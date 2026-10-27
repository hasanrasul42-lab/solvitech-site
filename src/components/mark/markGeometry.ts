import * as THREE from "three";
import type { SVGResult } from "three/examples/jsm/loaders/SVGLoader.js";

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

/*
 * ---------------------------------------------------------------------------
 * Contour preparation
 *
 * The SVG is a raster trace: integer vertices, long genuinely straight edges,
 * curved ends approximated by short chords, and the odd noise vertex. The
 * pipeline below keeps the trace as the source of truth and only removes what
 * is provably noise:
 *
 *   1. merge vertices closer than MERGE_PX (e.g. the 1.4 px step at the blue
 *      ribbon's top tip, which otherwise reads as two corners);
 *   2. classify vertices: CORNER (turn > 45 deg) or smooth;
 *   3. keep long trace edges (>= STRAIGHT_PX) exactly straight -- the logo's
 *      long edges are straight lines; bending them into cubics introduced
 *      S-shaped inflections that showed up as uneven highlight bands;
 *   4. curve only the short-chord runs (the rounded ends), with tangents that
 *      join adjoining straight edges with G1 continuity;
 *   5. (in world space, see clearConvexCorners) keep the bevel's reach around
 *      each convex corner free of samples, so the inset front face cannot fold
 *      back on itself (the source of the protrusion at the ribbon tips).
 * ---------------------------------------------------------------------------
 */

const CORNER_ANGLE = THREE.MathUtils.degToRad(45);
const MERGE_PX = 2.5;
const STRAIGHT_PX = 40;
const SAMPLE_SPACING_PX = 2;

interface PreparedContour {
  points: THREE.Vector2[];
  corner: boolean[];
}

/** Turning angle (radians) at vertex i of a closed polygon. */
function turnAngle(points: THREE.Vector2[], i: number): number {
  const n = points.length;
  const d1 = new THREE.Vector2().subVectors(points[i], points[(i - 1 + n) % n]).normalize();
  const d2 = new THREE.Vector2().subVectors(points[(i + 1) % n], points[i]).normalize();
  return Math.acos(THREE.MathUtils.clamp(d1.dot(d2), -1, 1));
}

function mergeClosePoints(points: THREE.Vector2[]): THREE.Vector2[] {
  const out: THREE.Vector2[] = [];
  for (const p of points) {
    if (out.length === 0 || out[out.length - 1].distanceTo(p) >= MERGE_PX) out.push(p.clone());
  }
  while (out.length > 3 && out[0].distanceTo(out[out.length - 1]) < MERGE_PX) out.pop();
  return out;
}

/**
 * Corner-preserving smoothing of the traced polygon (SVG space). The result
 * passes through every (merged) trace vertex.
 */
export function smoothContour(input: THREE.Vector2[]): PreparedContour {
  const points = mergeClosePoints(input);
  const n = points.length;
  const corner = points.map((_, i) => turnAngle(points, i) > CORNER_ANGLE);
  const segDir = points.map((p, i) => new THREE.Vector2().subVectors(points[(i + 1) % n], p).normalize());
  const segLen = points.map((p, i) => p.distanceTo(points[(i + 1) % n]));
  const straight = points.map((_, i) => segLen[i] >= STRAIGHT_PX || (corner[i] && corner[(i + 1) % n]));

  // Tangent at each smooth vertex. Next to a straight edge it follows that
  // edge exactly (so the straight edge stays straight right up to the curve);
  // between two curved runs it is the Catmull-Rom direction.
  const tangent = points.map((p, i) => {
    if (corner[i]) return null;
    const prev = (i - 1 + n) % n;
    const inStraight = straight[prev];
    const outStraight = straight[i];
    if (inStraight && !outStraight) return segDir[prev].clone();
    if (outStraight && !inStraight) return segDir[i].clone();
    if (inStraight && outStraight) return segDir[prev].clone().add(segDir[i]).normalize();
    return new THREE.Vector2().subVectors(points[(i + 1) % n], points[prev]).normalize();
  });

  const out: THREE.Vector2[] = [];
  const outCorner: boolean[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[i];
    const p1 = points[(i + 1) % n];
    out.push(p0.clone());
    outCorner.push(corner[i]);
    if (straight[i]) continue;

    const length = segLen[i];
    const t0 = tangent[i] ?? segDir[i];
    const t1 = tangent[(i + 1) % n] ?? segDir[i];
    const curve = new THREE.CubicBezierCurve(
      p0,
      p0.clone().addScaledVector(t0, length / 3),
      p1.clone().addScaledVector(t1, -length / 3),
      p1,
    );
    const steps = Math.max(2, Math.ceil(length / SAMPLE_SPACING_PX));
    for (let s = 1; s < steps; s++) {
      out.push(curve.getPoint(s / steps));
      outCorner.push(false);
    }
  }
  return { points: out, corner: outCorner };
}

function rawContour(input: THREE.Vector2[]): PreparedContour {
  const points = mergeClosePoints(input);
  return { points, corner: points.map((_, i) => turnAngle(points, i) > CORNER_ANGLE) };
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
 * Remove smooth samples that sit inside a convex corner's bevel reach. Insetting
 * a corner with interior angle a by distance d moves it d / tan(a / 2) along
 * each edge; any sample closer than that would overtake it and fold the inset
 * contour (a visible spike). Corners themselves are never removed.
 */
function clearConvexCorners(c: PreparedContour, inset: number): PreparedContour {
  if (inset <= 0) return c;
  const { points, corner } = c;
  const n = points.length;
  const remove = new Array<boolean>(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (!corner[i]) continue;
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];
    const d1 = new THREE.Vector2().subVectors(points[i], prev);
    const d2 = new THREE.Vector2().subVectors(next, points[i]);
    if (d1.cross(d2) <= 0) continue; // concave (CCW contour): the inset opens up, no fold
    const interior = Math.PI - turnAngle(points, i);
    const reach = (inset / Math.tan(interior / 2)) * 1.25 + inset * 0.25;
    for (const step of [1, -1]) {
      for (let k = 1; k < n; k++) {
        const j = (i + step * k + n) % n;
        if (corner[j] || points[j].distanceTo(points[i]) >= reach) break;
        remove[j] = true;
      }
    }
  }
  return {
    points: points.filter((_, i) => !remove[i]),
    corner: corner.filter((_, i) => !remove[i]),
  };
}

/*
 * ---------------------------------------------------------------------------
 * Bevelled extrusion with analytic normals
 *
 * Profile (front half; the back mirrors it): a quarter-round bevel from the
 * front cap, inset by `bevel`, out to the side wall, which sits exactly on the
 * contour so the front silhouette is unchanged. Every vertex normal is computed
 * from the profile itself -- (contourNormal * sin phi, cos phi) -- instead of
 * being averaged from triangle faces, so long thin triangles cannot leave
 * stripes in sharp highlights. Smooth vertices share one contour normal across
 * both adjoining faces; corner vertices use each face's own edge normal, which
 * keeps the tips crisp.
 * ---------------------------------------------------------------------------
 */
function extrudeContour(
  contour: PreparedContour,
  depth: number,
  bevel: number,
  bevelSegments: number,
): THREE.BufferGeometry {
  const P = contour.points;
  const corner = contour.corner;
  const n = P.length;
  const half = depth / 2;

  const edgeDir = P.map((p, i) => new THREE.Vector2().subVectors(P[(i + 1) % n], p).normalize());
  // Outward normal of each edge for a CCW contour.
  const edgeN = edgeDir.map((d) => new THREE.Vector2(d.y, -d.x));
  const vertN = P.map((_, i) => edgeN[(i - 1 + n) % n].clone().add(edgeN[i]).normalize());
  // Miter: offsetting by `vertN * miterScale * d` moves both adjoining edges
  // inward by exactly d (capped for very sharp tips).
  const miterScale = P.map((_, i) => 1 / Math.max(vertN[i].dot(edgeN[i]), 0.2));

  const S = bevel > 0 ? Math.max(1, bevelSegments) : 0;
  const rings = Array.from({ length: S + 1 }, (_, k) => {
    const phi = S === 0 ? Math.PI / 2 : (k / S) * (Math.PI / 2);
    return { inset: bevel * (1 - Math.sin(phi)), z: half + bevel * Math.cos(phi), nxy: Math.sin(phi), nz: Math.cos(phi) };
  });

  const positions: number[] = [];
  const normals: number[] = [];
  const pb = new THREE.Vector3();
  const pc = new THREE.Vector3();
  const face = new THREE.Vector3();
  const expected = new THREE.Vector3();

  type V = { p: THREE.Vector3; n: THREE.Vector3 };
  const pushTri = (a: V, b: V, c: V) => {
    face.crossVectors(pb.subVectors(b.p, a.p), pc.subVectors(c.p, a.p));
    expected.copy(a.n).add(b.n).add(c.n);
    const [x, y, z] = face.dot(expected) >= 0 ? [a, b, c] : [a, c, b];
    for (const v of [x, y, z]) {
      positions.push(v.p.x, v.p.y, v.p.z);
      normals.push(v.n.x, v.n.y, v.n.z);
    }
  };

  const ringVertex = (k: number, i: number, e: number, side: 1 | -1): V => {
    const r = rings[k];
    const off = r.inset * miterScale[i];
    const n2 = corner[i] ? edgeN[e] : vertN[i];
    return {
      p: new THREE.Vector3(P[i].x - vertN[i].x * off, P[i].y - vertN[i].y * off, side * r.z),
      n: new THREE.Vector3(n2.x * r.nxy, n2.y * r.nxy, side * r.nz).normalize(),
    };
  };

  for (let e = 0; e < n; e++) {
    const i0 = e;
    const i1 = (e + 1) % n;
    // Front and back bevel bands.
    for (const side of [1, -1] as const) {
      for (let k = 0; k < S; k++) {
        const a = ringVertex(k, i0, e, side);
        const b = ringVertex(k, i1, e, side);
        const c = ringVertex(k + 1, i1, e, side);
        const d = ringVertex(k + 1, i0, e, side);
        pushTri(a, b, c);
        pushTri(a, c, d);
      }
    }
    // Side wall (on the contour itself).
    const fa = ringVertex(S, i0, e, 1);
    const fb = ringVertex(S, i1, e, 1);
    const bb = ringVertex(S, i1, e, -1);
    const ba = ringVertex(S, i0, e, -1);
    pushTri(fa, fb, bb);
    pushTri(fa, bb, ba);
  }

  // Flat caps on the innermost ring.
  const capZ = rings[0].z;
  const capInset = rings[0].inset;
  const cap = P.map((p, i) => {
    const off = capInset * miterScale[i];
    return new THREE.Vector2(p.x - vertN[i].x * off, p.y - vertN[i].y * off);
  });
  const triangles = THREE.ShapeUtils.triangulateShape(cap, []);
  for (const side of [1, -1] as const) {
    const nz = new THREE.Vector3(0, 0, side);
    for (const [a, b, c] of triangles) {
      pushTri(
        { p: new THREE.Vector3(cap[a].x, cap[a].y, side * capZ), n: nz },
        { p: new THREE.Vector3(cap[b].x, cap[b].y, side * capZ), n: nz },
        { p: new THREE.Vector3(cap[c].x, cap[c].y, side * capZ), n: nz },
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Build one ribbon: prepared contour -> world space (centred, y up, CCW) ->
 * corner clearance for the bevel -> bevelled extrusion centred on z = 0.
 * The side wall's front edge (z = depth / 2) is the silhouette plane.
 */
export function buildRibbonGeometry(
  ribbon: RibbonContour,
  contours: MarkContours,
  settings: ExtrudeSettings,
): THREE.BufferGeometry {
  const prepared = settings.smoothing ? smoothContour(ribbon.points) : rawContour(ribbon.points);
  const center = contours.bounds.getCenter(new THREE.Vector2());
  let points = prepared.points.map(
    (p) => new THREE.Vector2((p.x - center.x) * contours.scale, -(p.y - center.y) * contours.scale),
  );
  let corner = prepared.corner;
  if (THREE.ShapeUtils.isClockWise(points)) {
    points = points.reverse();
    corner = [...corner].reverse();
  }
  const cleared = clearConvexCorners({ points, corner }, settings.bevel);
  return extrudeContour(cleared, settings.depth, settings.bevel, settings.bevelSegments);
}
