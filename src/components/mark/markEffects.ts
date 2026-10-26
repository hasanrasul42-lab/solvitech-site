import * as THREE from "three";
import type { MarkContours, RibbonContour } from "./markGeometry";

/**
 * A ribbon's long axis in world space (object space of the mark). The longest
 * contour edge is one of the ribbon's straight long sides, so it gives the
 * direction the ribbon runs in without any hand-placed coordinates.
 */
export interface RibbonAxis {
  origin: THREE.Vector2;
  dir: THREE.Vector2;
  /** Min/max projection of the contour onto dir, relative to origin. */
  range: THREE.Vector2;
  /** Average perpendicular offset, so points along the axis sit mid-ribbon. */
  centerOffset: number;
}

export function ribbonAxis(ribbon: RibbonContour, contours: MarkContours): RibbonAxis {
  const center = contours.bounds.getCenter(new THREE.Vector2());
  const pts = ribbon.points.map(
    (p) => new THREE.Vector2((p.x - center.x) * contours.scale, -(p.y - center.y) * contours.scale),
  );

  let dir = new THREE.Vector2(1, 0);
  let longest = 0;
  pts.forEach((p, i) => {
    const edge = new THREE.Vector2().subVectors(pts[(i + 1) % pts.length], p);
    if (edge.length() > longest) {
      longest = edge.length();
      dir = edge.normalize();
    }
  });
  if (dir.x < 0) dir.negate(); // always run left -> right

  const origin = new THREE.Vector2();
  pts.forEach((p) => origin.add(p));
  origin.divideScalar(pts.length);

  const normal = new THREE.Vector2(-dir.y, dir.x);
  let min = Infinity;
  let max = -Infinity;
  let perp = 0;
  for (const p of pts) {
    const rel = new THREE.Vector2().subVectors(p, origin);
    const a = rel.dot(dir);
    min = Math.min(min, a);
    max = Math.max(max, a);
    perp += rel.dot(normal);
  }
  return { origin, dir, range: new THREE.Vector2(min, max), centerOffset: perp / pts.length };
}

/** Point on the ribbon's mid-line at parameter s (0 = left end, 1 = right end). */
export function pointOnAxis(axis: RibbonAxis, s: number, target: THREE.Vector3, z: number) {
  const a = THREE.MathUtils.lerp(axis.range.x, axis.range.y, s);
  const normal = new THREE.Vector2(-axis.dir.y, axis.dir.x);
  return target.set(
    axis.origin.x + axis.dir.x * a + normal.x * axis.centerOffset,
    axis.origin.y + axis.dir.y * a + normal.y * axis.centerOffset,
    z,
  );
}

/*
 * Energy loop. The two ribbons interlock: the blue curl rises under the white
 * ribbon's right side, and the white curl drops over the blue's left side.
 * Light therefore runs one closed circuit, loop coordinate g in [0, 1):
 *   g 0.0 -> 0.5  blue ribbon, left end -> right curl
 *   g 0.5 -> 1.0  white ribbon, right end -> left curl, then back into blue.
 */
export const BLUE_SEGMENT = { start: 0, reverse: false };
export const WHITE_SEGMENT = { start: 0.5, reverse: true };

export type EnergyUniforms = {
  uEnergyPhase: THREE.IUniform<number>;
  uEnergyCount: THREE.IUniform<number>;
  uEnergyWidth: THREE.IUniform<number>;
  uEnergyIntensity: THREE.IUniform<number>;
  uEnergyColor: THREE.IUniform<THREE.Color>;
  uAxisOrigin: THREE.IUniform<THREE.Vector2>;
  uAxisDir: THREE.IUniform<THREE.Vector2>;
  uAxisRange: THREE.IUniform<THREE.Vector2>;
  uSegStart: THREE.IUniform<number>;
  uSegReverse: THREE.IUniform<number>;
};

export function createEnergyUniforms(axis: RibbonAxis, segment: typeof BLUE_SEGMENT): EnergyUniforms {
  return {
    uEnergyPhase: { value: 0 },
    uEnergyCount: { value: 1 },
    uEnergyWidth: { value: 0.08 },
    uEnergyIntensity: { value: 0 },
    uEnergyColor: { value: new THREE.Color("#7fb0ff") },
    uAxisOrigin: { value: axis.origin },
    uAxisDir: { value: axis.dir },
    uAxisRange: { value: axis.range },
    uSegStart: { value: segment.start },
    uSegReverse: { value: segment.reverse ? 1 : 0 },
  };
}

/**
 * Adds a travelling emissive band to a MeshPhysicalMaterial. The band is a
 * Gaussian in loop coordinate, computed per fragment from object-space
 * position projected on the ribbon axis, so it sweeps along the ribbon rather
 * than flashing the whole mesh.
 */
export function patchEnergyShader(shader: THREE.WebGLProgramParametersWithUniforms, uniforms: EnergyUniforms) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\nvarying vec3 vEnergyPos;")
    .replace("#include <begin_vertex>", "#include <begin_vertex>\nvEnergyPos = position;");
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
varying vec3 vEnergyPos;
uniform float uEnergyPhase, uEnergyCount, uEnergyWidth, uEnergyIntensity, uSegStart, uSegReverse;
uniform vec3 uEnergyColor;
uniform vec2 uAxisOrigin, uAxisDir, uAxisRange;`,
    )
    .replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
if (uEnergyIntensity > 0.0) {
  float a = dot(vEnergyPos.xy - uAxisOrigin, uAxisDir);
  float s = clamp((a - uAxisRange.x) / (uAxisRange.y - uAxisRange.x), 0.0, 1.0);
  s = mix(s, 1.0 - s, uSegReverse);
  float g = uSegStart + s * 0.5;
  float x = fract(g * uEnergyCount - uEnergyPhase);
  float d = min(x, 1.0 - x) / uEnergyCount;
  totalEmissiveRadiance += uEnergyColor * uEnergyIntensity * exp(-(d * d) / (uEnergyWidth * uEnergyWidth));
}`,
    );
}

/**
 * Soft glow texture drawn from the real SVG paths: each ribbon is filled into
 * a 2D canvas and blurred via canvas shadows (supported everywhere, unlike
 * ctx.filter). The blue ribbon glows fully, the white one faintly, so the halo
 * follows the mark's actual silhouette.
 */
export function createGlowTexture(contours: MarkContours, color: string, softnessPx: number, whiteAlpha = 0.4) {
  const size = contours.bounds.getSize(new THREE.Vector2());
  const pad = Math.ceil(softnessPx * 3 + 20);
  const res = 1; // canvas px per SVG px
  const width = Math.ceil((size.x + pad * 2) * res);
  const height = Math.ceil((size.y + pad * 2) * res);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Draw the shape far off-canvas and let only its blurred shadow land.
    const offset = width + 100;
    ctx.shadowColor = color;
    ctx.shadowBlur = softnessPx * res * 2;
    ctx.shadowOffsetX = offset;
    ctx.fillStyle = "#000";
    for (const ribbon of contours.ribbons) {
      ctx.globalAlpha = ribbon.id === "blue-ribbon" ? 1 : whiteAlpha;
      ctx.setTransform(
        res,
        0,
        0,
        res,
        (pad - contours.bounds.min.x) * res - offset,
        (pad - contours.bounds.min.y) * res,
      );
      ctx.fill(new Path2D(ribbon.d));
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return {
    texture,
    worldWidth: (width / res) * contours.scale,
    worldHeight: (height / res) * contours.scale,
  };
}

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
