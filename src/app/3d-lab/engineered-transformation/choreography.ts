/**
 * Engineered Transformation -- choreography.
 *
 * The sculpture's state is four progress values in [0, 1]:
 *   intel  the interpretation chamber reads, isolates and sorts
 *   auto   trigger -> lever -> carriage -> clamp -> complete
 *   sys    the rack reconfigures (one module moves, the others accommodate)
 *   unify  the separated modules slide together and lock
 * Every part's pose is a pure function of these, so any state can be shown
 * exactly (dev controls, reduced motion) and replays are deterministic.
 * Paths are routed around neighbouring parts, so nothing passes through
 * anything else at any progress value.
 */

export type Phase = "intel" | "auto" | "sys" | "unify";
export type Mechanism = Exclude<Phase, "unify">;
export type Progress = Record<Phase, number>;
type V3 = [number, number, number];

export const SECONDS: Progress = { intel: 5.2, auto: 3.8, sys: 4.2, unify: 2.4 };
export const ORDER: Phase[] = ["intel", "auto", "sys", "unify"];
/** Pause between phases (seconds). */
export const GAP = 0.45;
/** Rewind time for a full unit of progress (seconds). */
export const REWIND = 1.1;

export const START: Progress = { intel: 0, auto: 0, sys: 0, unify: 0 };
export const END: Progress = { intel: 1, auto: 1, sys: 1, unify: 1 };

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Weighted, mechanical easing: slow out, slow in, no overshoot. */
export const ease = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
/** Eased local progress of a sub-step within [a, b]. */
export const seg = (p: number, a: number, b: number) => ease((p - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** A light that rises to 1 over [a, m] and settles to `rest` by b. */
export const pulse = (p: number, a: number, m: number, b: number, rest = 0) =>
  p < a ? 0 : p < m ? seg(p, a, m) : lerp(1, rest, seg(p, m, b));

/** Follow a polyline of waypoints, easing in and out of every corner. */
export function path(points: V3[], t: number): V3 {
  if (t <= 0) return points[0];
  if (t >= 1) return points[points.length - 1];
  const legs = points.length - 1;
  const f = t * legs;
  const i = Math.min(legs - 1, Math.floor(f));
  const k = ease(f - i);
  const a = points[i];
  const b = points[i + 1];
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
}

// --- Layout (world units) ----------------------------------------------------

export const PLINTH = { w: 9.3, h: 0.25, d: 2.9 };
export const RAIL = { y: 0.29, r: 0.04, z: 0.75 };
/** Module-local origin: the top of each module's carriage. */
export const DECK_Y = 0.556;
export const CARRIAGE = { h: 0.22, d: 2.2 };
export const MODULE = {
  intel: { w: 2.6, from: -3.06, to: -2.44 },
  auto: { w: 2.2, from: 0, to: 0 },
  sys: { w: 2.6, from: 3.06, to: 2.44 },
};
/** Bounding box used for camera framing (covers the separated state). */
/** Framing bounds: the modules (separated); the plinth's ends may bleed off a wide stage. */
export const BOUNDS = { min: [-4.36, 0, -1.45] as V3, max: [4.36, 2.52, 1.45] as V3 };

// --- Intelligence --------------------------------------------------------------

export const CHAMBER = { x: 0.66, z: 0.5, floor: 0.14, top: 0.86 };
export type TokenKind = "slab" | "disc" | "anomaly";
export interface Token {
  kind: TokenKind;
  tray: V3;
  slot: V3;
  out: V3;
  /** Exit order (0 leaves first). The anomaly leaves separately. */
  exit: number;
}
const TRAY = 0.2;
const ROW = 0.2;
const SHELF_X = 1.0;
/**
 * Tokens fill the deepest slots first, so a token never travels through one
 * already seated; they leave nearest-the-exit first for the same reason.
 */
export const TOKENS: Token[] = [
  { kind: "slab", tray: [-1.12, TRAY, -0.36], slot: [0.36, 0.18, -ROW], out: [SHELF_X, 0.1, 0.32], exit: 0 },
  { kind: "disc", tray: [-0.86, TRAY, -0.36], slot: [0, 0.18, -ROW], out: [SHELF_X, 0.1, -0.06], exit: 1 },
  { kind: "slab", tray: [-1.12, TRAY, 0], slot: [-0.36, 0.18, -ROW], out: [SHELF_X, 0.18, 0.32], exit: 3 },
  { kind: "anomaly", tray: [-0.86, TRAY + 0.025, 0], slot: [0.36, 0.205, ROW], out: [SHELF_X, 0.86, -0.46], exit: -1 },
  { kind: "disc", tray: [-1.12, TRAY, 0.36], slot: [0, 0.18, ROW], out: [SHELF_X, 0.18, -0.06], exit: 2 },
  { kind: "slab", tray: [-0.86, TRAY, 0.36], slot: [-0.36, 0.18, ROW], out: [SHELF_X, 0.26, 0.32], exit: 4 },
];
export const INTEL = {
  enter: { a: 0.02, stagger: 0.058, d: 0.14 },
  scan: { a: 0.4, b: 0.57 },
  isolate: { a: 0.57, b: 0.7 },
  sort: { a: 0.69, stagger: 0.056, d: 0.085 },
};

/** Pose of token i at intelligence progress p (module-local). */
export function tokenPose(i: number, p: number): V3 {
  const t = TOKENS[i];
  if (t.kind === "anomaly") {
    const iso = clamp01((p - INTEL.isolate.a) / (INTEL.isolate.b - INTEL.isolate.a));
    if (iso > 0) {
      const lift = 1.02;
      return path(
        [t.slot, [0.82, t.slot[1], t.slot[2]], [0.82, lift, t.slot[2]], [t.out[0], lift, t.out[2]], t.out],
        iso,
      );
    }
  } else {
    const a = INTEL.sort.a + t.exit * INTEL.sort.stagger;
    const out = clamp01((p - a) / INTEL.sort.d);
    if (out > 0) {
      const over = 0.44;
      return path([t.slot, [0.76, t.slot[1], t.slot[2]], [0.76, over, t.slot[2]], [t.out[0], over, t.out[2]], t.out], out);
    }
  }
  const a = INTEL.enter.a + i * INTEL.enter.stagger;
  const enter = clamp01((p - a) / INTEL.enter.d);
  if (enter > 0) {
    const over = 0.42;
    return path(
      [t.tray, [t.tray[0], over, t.tray[2]], [-0.56, over, t.slot[2]], [-0.56, t.slot[1], t.slot[2]], t.slot],
      enter,
    );
  }
  return t.tray;
}
/** The scan plane's x within the chamber, and its visibility. */
export const scanX = (p: number) => lerp(-0.56, 0.56, seg(p, INTEL.scan.a, INTEL.scan.b));
export const scanAlpha = (p: number) => pulse(p, INTEL.scan.a - 0.02, INTEL.scan.a + 0.03, INTEL.scan.b + 0.02);
/** How strongly token i is lit: a brief read for ordinary items, a held signal for the anomaly. */
export function tokenGlow(i: number, p: number) {
  const t = TOKENS[i];
  if (p < INTEL.scan.a) return 0;
  const near = Math.max(0, 1 - Math.abs(scanX(p) - t.slot[0]) / 0.2);
  // The anomaly keeps its signal once the scan has passed it.
  if (t.kind === "anomaly") return scanX(p) >= t.slot[0] || p >= INTEL.scan.b ? 1 : near;
  return p < INTEL.scan.b + 0.03 ? near * 0.55 : 0;
}
/** The inspection post's ring lights as the anomaly arrives. */
export const postGlow = (p: number) => seg(p, INTEL.isolate.b - 0.04, INTEL.isolate.b + 0.04);

// --- Automation -----------------------------------------------------------------

export const AUTO = {
  pivot: [-0.38, 0.14] as [number, number],
  lever: 0.62,
  from: 0.32,
  to: -0.28,
  key: { y: 0.3, x0: -0.7, travel: 0.094 },
  carriage: { y: 0.6, x0: -0.05, x1: 0.6 },
  /** Press head over the end of the track: raised clear, then down onto the carriage. */
  press: { x: 0.6, up: 0.83, down: 0.73, sleeve: 0.89 },
};
export const autoPose = (p: number) => {
  const press = seg(p, 0.02, 0.2) * (1 - seg(p, 0.86, 0.98));
  return {
    /** Trigger key travel 0..1 (pressed, held, released once complete). */
    press,
    trigger: pulse(p, 0.02, 0.12, 0.4, 0.12),
    /** Lever angle (radians), driven by the key's pushrod; latched once thrown. */
    lever: lerp(AUTO.from, AUTO.to, seg(p, 0.02, 0.2)),
    carriage: seg(p, 0.24, 0.6),
    clamp: seg(p, 0.62, 0.78),
    done: pulse(p, 0.76, 0.86, 1, 0.5),
  };
};

// --- Custom systems rack ---------------------------------------------------------

export const RACK = {
  cols: [-0.47, 0.47] as [number, number],
  rows: [0.34, 0.88, 1.42] as [number, number, number],
  z: -0.12,
  out: 0.52,
};
export type RackId = "a" | "b" | "c" | "d" | "e";
export const RACK_IDS: RackId[] = ["a", "b", "c", "d", "e"];
export const SYS = { move: { a: 0.04, b: 0.6 }, shift: { a: 0.6, b: 0.8 }, paths: { a: 0.64, b: 0.88 } };
export function rackPose(id: RackId, p: number): V3 {
  const [c0, c1] = RACK.cols;
  const [r0, r1, r2] = RACK.rows;
  const z = RACK.z;
  // Column 0 re-centres once c has left it (the neighbours accommodate).
  const shift = seg(p, SYS.shift.a, SYS.shift.b) * ((r1 - r0) / 2);
  switch (id) {
    case "a":
      return [c0, r0 + shift, z];
    case "b":
      return [c0, r1 + shift, z];
    case "d":
      return [c1, r0, z];
    case "e":
      return [c1, r2, z];
    case "c": {
      // Out, across in front of e, down, then in -- never through a neighbour.
      const t = clamp01((p - SYS.move.a) / (SYS.move.b - SYS.move.a));
      return path(
        [
          [c0, r2, z],
          [c0, r2, z + RACK.out],
          [c1, r2, z + RACK.out],
          [c1, r1, z + RACK.out],
          [c1, r1, z],
        ],
        t,
      );
    }
  }
}
/** Light-path configuration blend: 0 = layout A, 1 = layout B. */
export const pathBlend = (p: number) => seg(p, SYS.paths.a, SYS.paths.b);
export const sysSettle = (p: number) => pulse(p, 0.84, 0.92, 1, 0.3);
export const selectGlow = (p: number) => pulse(p, 0, 0.06, 0.94, 0.25);

// --- Unification ------------------------------------------------------------------

export const moduleX = (m: keyof typeof MODULE, unify: number) =>
  lerp(MODULE[m].from, MODULE[m].to, seg(unify, 0, 0.76));
export const seamGlow = (unify: number) => pulse(unify, 0.66, 0.82, 1, 0.2);
