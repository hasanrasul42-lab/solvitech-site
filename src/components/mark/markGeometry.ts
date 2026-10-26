import * as THREE from "three";
import type { SVGResult } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const MARK_SVG_URL = "/brand/solvitech-mark.svg";

/** World-space height of the combined mark. Everything else scales from this. */
export const MARK_WORLD_HEIGHT = 3;

export type RibbonId = "white-ribbon" | "blue-ribbon";

/** One closed contour from the SVG, kept in SVG pixel space (y down). */
export interface RibbonContour {
  id: RibbonId;
  color: string;
  /** Original SVG path data, for 2D canvas drawing (glow texture). */
  d: string;
  points: THREE.Vector2[];
}

export interface MarkContours {
  ribbons: RibbonContour[];
  /** Bounding box of both contours combined, in SVG pixels. */
  bounds: THREE.Box2;
  /** SVG pixels -> world units. */
  scale: number;
}

export interface ExtrudeSettings {
  depth: number;
  bevel: number;
  bevelSegments: number;
  smoothing: boolean;
}

/**
 * Pull the two ribbon contours out of the parsed SVG. Paths are identified by
 * their `id` attribute so white and blue stay separate meshes/materials.
 */
export function readMarkContours(svg: SVGResult): MarkContours {
  const ribbons: RibbonContour[] = [];
  const bounds = new THREE.Box2();

  for (const path of svg.paths) {
    const node = path.userData?.node as Element | undefined;
    const id = node?.getAttribute("id");
    if (id !== "white-ribbon" && id !== "blue-ribbon") continue;

    const subPath = path.subPaths[0];
    if (!subPath) continue;

    // The traced paths are straight-line polygons, so getPoints() returns the
    // original vertices. Drop the duplicated closing point if present.
    const points = subPath.getPoints().map((p) => p.clone());
    if (points.length > 1 && points[0].distanceTo(points[points.length - 1]) < 1e-6) {
      points.pop();
    }

    for (const p of points) bounds.expandByPoint(p);
    ribbons.push({
      id,
      color: (path.userData?.style as { fill?: string } | undefined)?.fill ?? `#${path.color.getHexString()}`,
      d: node?.getAttribute("d") ?? "",
      points,
    });
  }

  if (ribbons.length !== 2) {
    throw new Error(`Expected white-ribbon and blue-ribbon paths, found ${ribbons.length}`);
  }

  const size = bounds.getSize(new THREE.Vector2());
  return { ribbons, bounds, scale: MARK_WORLD_HEIGHT / size.y };
}

/** Turning angle (radians) at vertex i of a closed polygon. */
function turnAngle(points: THREE.Vector2[], i: number): number {
  const n = points.length;
  const a = points[(i - 1 + n) % n];
  const b = points[i];
  const c = points[(i + 1) % n];
  const d1 = new THREE.Vector2().subVectors(b, a).normalize();
  const d2 = new THREE.Vector2().subVectors(c, b).normalize();
  return Math.acos(THREE.MathUtils.clamp(d1.dot(d2), -1, 1));
}

const CORNER_ANGLE = THREE.MathUtils.degToRad(45);
const SAMPLE_SPACING_PX = 3;

/**
 * Corner-preserving smoothing of the traced polygon. The resulting curve passes
 * through every traced vertex; only the straight chords between them are
 * replaced by cubic segments. Vertices that turn more than CORNER_ANGLE are
 * kept as hard corners (ribbon tips), so the silhouette is not rounded off.
 */
export function smoothContour(points: THREE.Vector2[]): THREE.Vector2[] {
  const n = points.length;
  const isCorner = points.map((_, i) => turnAngle(points, i) > CORNER_ANGLE);

  // Unit tangent per vertex: Catmull-Rom direction for smooth vertices,
  // undefined for corners (each adjoining segment uses its own direction).
  const tangents = points.map((p, i) => {
    if (isCorner[i]) return null;
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];
    return new THREE.Vector2().subVectors(next, prev).normalize();
  });

  const out: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[i];
    const p1 = points[(i + 1) % n];
    const segment = new THREE.Vector2().subVectors(p1, p0);
    const length = segment.length();
    const dir = segment.clone().normalize();

    const t0 = tangents[i] ?? dir;
    const t1 = tangents[(i + 1) % n] ?? dir;

    out.push(p0.clone());
    if (!tangents[i] && !tangents[(i + 1) % n]) continue; // straight edge between corners

    // Handle length scaled to this segment, so short segments next to long
    // edges do not overshoot.
    const c0 = p0.clone().addScaledVector(t0, length / 3);
    const c1 = p1.clone().addScaledVector(t1, -length / 3);
    const curve = new THREE.CubicBezierCurve(p0, c0, c1, p1);
    const steps = Math.max(2, Math.ceil(length / SAMPLE_SPACING_PX));
    for (let s = 1; s < steps; s++) out.push(curve.getPoint(s / steps));
  }
  return out;
}

/** Convert SVG-space points to a centred, y-up THREE.Shape in world units. */
export function contourToShape(points: THREE.Vector2[], contours: MarkContours): THREE.Shape {
  const center = contours.bounds.getCenter(new THREE.Vector2());
  const { scale } = contours;
  return new THREE.Shape(
    points.map((p) => new THREE.Vector2((p.x - center.x) * scale, -(p.y - center.y) * scale)),
  );
}

/**
 * Extrude a ribbon. bevelOffset = -bevel pulls the front face inward by the
 * bevel size, so the outermost side wall sits exactly on the SVG contour and
 * the front-view silhouette is unchanged by the bevel. The geometry is centred
 * on z = 0.
 */
export function buildRibbonGeometry(
  ribbon: RibbonContour,
  contours: MarkContours,
  settings: ExtrudeSettings,
): THREE.BufferGeometry {
  const points = settings.smoothing ? smoothContour(ribbon.points) : ribbon.points;
  const shape = contourToShape(points, contours);
  const bevelEnabled = settings.bevel > 0;

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: settings.depth,
    bevelEnabled,
    bevelThickness: settings.bevel,
    bevelSize: settings.bevel,
    bevelOffset: bevelEnabled ? -settings.bevel : 0,
    bevelSegments: settings.bevelSegments,
    curveSegments: 1,
    steps: 1,
  });
  geometry.translate(0, 0, -settings.depth / 2);

  // ExtrudeGeometry is non-indexed with two groups: 0 = front/back caps,
  // 1 = side walls + bevel. Caps keep their exact flat normals; smoothing them
  // would bleed the bevel angle across the long cap triangles as streaks.
  // Walls get creased normals: smooth along curves and the rounded bevel, hard
  // where the contour has a real corner.
  const [caps, walls] = geometry.groups.map((group) => sliceGeometry(geometry, group.start, group.count));
  const smoothWalls = toCreasedNormals(walls, THREE.MathUtils.degToRad(40));
  const merged = mergeGeometries([caps, smoothWalls], true);
  [geometry, caps, walls, smoothWalls].forEach((g) => g.dispose());
  merged.computeBoundingBox();
  return merged;
}

/** Copy a vertex range of a non-indexed geometry (position + normal only). */
function sliceGeometry(geometry: THREE.BufferGeometry, start: number, count: number) {
  const out = new THREE.BufferGeometry();
  for (const name of ["position", "normal"] as const) {
    const attr = geometry.getAttribute(name) as THREE.BufferAttribute;
    const array = attr.array.slice(start * attr.itemSize, (start + count) * attr.itemSize);
    out.setAttribute(name, new THREE.BufferAttribute(array, attr.itemSize));
  }
  return out;
}
