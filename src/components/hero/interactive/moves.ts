import * as THREE from "three";
import { clamp01, easeInOutCubic, easeInOutQuart, easeInOutSine } from "../../mark/motion";

/*
 * Five click manoeuvres. Each is a pure function of progress p (0..1) that
 * writes a rotation quaternion, composed from axis rotations in a fixed
 * parent -> child order (the first entry is the outermost pivot). Every move
 * ends with each axis at a whole number of turns (or, for Twist & Catch, a
 * twist that is undone), and the scene snaps to identity at p = 1, so no move
 * can leave drift behind.
 */

export type MoveId = "corkscrew" | "reverseAerial" | "doubleTuck" | "sideAerial" | "twistCatch";

export const MOVE_IDS: MoveId[] = ["corkscrew", "reverseAerial", "doubleTuck", "sideAerial", "twistCatch"];

const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
const TAU = Math.PI * 2;

/** Progress of p through the window [a, b], clamped to 0..1. */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/**
 * Launch ease: a cubic Hermite that leaves with 35% of the average speed (so
 * the move is visibly under way on the first frames, not "waiting") and
 * arrives with zero speed for a soft landing. Monotonic: no overshoot.
 */
const launch = (t: number, v0 = 0.35) => v0 * (t * t * t - 2 * t * t + t) + (3 * t * t - 2 * t * t * t);
/** Bell curve over [a, b], 0 outside. */
const bell = (p: number, a: number, b: number) => (p <= a || p >= b ? 0 : Math.sin(Math.PI * seg(p, a, b)));

const tmp = new THREE.Quaternion();
function compose(out: THREE.Quaternion, steps: [THREE.Vector3, number][]) {
  out.identity();
  for (const [axis, angle] of steps) out.multiply(tmp.setFromAxisAngle(axis, angle));
  return out;
}

export interface MoveDef {
  id: MoveId;
  label: string;
  seconds: number;
  /** Progress at which the energy pulse launches. */
  pulseAt: number;
  /** Peak extra scale and forward travel (world units) at the crest. */
  crestScale: number;
  crestForward: number;
  /** Writes the rotation at progress p. */
  rotation: (p: number, out: THREE.Quaternion) => THREE.Quaternion;
  /** Crest envelope (lift/scale), 0..1. */
  crest: (p: number) => number;
  /** Closing blue-light accent, 0..1. */
  accent: (p: number) => number;
}

export const MOVES: Record<MoveId, MoveDef> = {
  // 1. Corkscrew: the approved baseline. Spin and end-over-end flip share one
  //    sine curve, so they rise and settle together.
  corkscrew: {
    id: "corkscrew",
    label: "Corkscrew",
    seconds: 1.6,
    pulseAt: 0.7,
    crestScale: 0.025,
    crestForward: 0,
    rotation: (p, out) => {
      const e = easeInOutSine(p);
      return compose(out, [
        [Y, TAU * e],
        [X, TAU * e],
      ]);
    },
    crest: (p) => Math.sin(Math.PI * p),
    accent: () => 0,
  },

  // 2. Reverse Aerial: the backward flip leads (launch ease); the twist, about
  //    the body's own vertical, enters at 15% on a cubic that packs its speed
  //    into the middle, and finishes just before the end.
  reverseAerial: {
    id: "reverseAerial",
    label: "Reverse Aerial",
    seconds: 1.7,
    pulseAt: 0.72,
    crestScale: 0.025,
    crestForward: 0.04,
    rotation: (p, out) =>
      compose(out, [
        [X, -TAU * launch(p)],
        [Y, TAU * easeInOutCubic(seg(p, 0.15, 0.95))],
      ]),
    crest: (p) => bell(p, 0, 1) * (0.6 + 0.4 * bell(p, 0.2, 0.8)),
    accent: () => 0,
  },

  // 3. Double Tuck: two forward somersaults on the launch ease (clean, even
  //    acceleration), with one twist concentrated through the middle and the
  //    biggest lift/forward travel at the apex.
  doubleTuck: {
    id: "doubleTuck",
    label: "Double Tuck",
    seconds: 2.0,
    pulseAt: 0.78,
    crestScale: 0.03,
    crestForward: 0.14,
    rotation: (p, out) =>
      compose(out, [
        [X, 2 * TAU * launch(p)],
        [Y, TAU * easeInOutSine(seg(p, 0.3, 0.7))],
      ]),
    crest: (p) => Math.pow(Math.sin(Math.PI * p), 1.6),
    accent: () => 0,
  },

  // 4. Side Aerial: a cartwheel in the picture plane leads on a long sine
  //    sweep; the horizontal turn trails it on a gentler curve, so the motion
  //    flows rather than snaps.
  sideAerial: {
    id: "sideAerial",
    label: "Side Aerial",
    seconds: 1.8,
    pulseAt: 0.74,
    crestScale: 0.022,
    crestForward: 0.02,
    rotation: (p, out) =>
      compose(out, [
        [Y, TAU * easeInOutQuart(seg(p, 0.1, 1))],
        [Z, -TAU * easeInOutSine(seg(p, 0, 0.92))],
      ]),
    crest: (p) => Math.sin(Math.PI * p),
    accent: () => 0,
  },

  // 5. Twist & Catch: half-twist away, a full forward somersault while
  //    "airborne", then the half-twist is undone into a soft catch with a blue
  //    accent. The twist is the outer pivot, so the somersault runs about the
  //    twisted body's axis.
  twistCatch: {
    id: "twistCatch",
    label: "Twist & Catch",
    seconds: 1.9,
    pulseAt: 0.8,
    crestScale: 0.025,
    crestForward: 0.06,
    rotation: (p, out) =>
      compose(out, [
        [Y, Math.PI * (launch(seg(p, 0, 0.3)) - easeInOutSine(seg(p, 0.68, 1)))],
        [X, TAU * easeInOutCubic(seg(p, 0.18, 0.8))],
      ]),
    crest: (p) => bell(p, 0.1, 0.85),
    accent: (p) => bell(p, 0.82, 1) * 0.9,
  },
};

/**
 * Shuffle bag: each set plays all five moves once in random order, and a new
 * set never starts with the move that ended the previous one.
 */
export function createShuffleBag(random: () => number = Math.random) {
  let bag: MoveId[] = [];
  let last: MoveId | null = null;

  const refill = () => {
    bag = [...MOVE_IDS];
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    // bag is consumed from the end; avoid repeating across the boundary.
    if (bag[bag.length - 1] === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  };

  return {
    next(): MoveId {
      if (bag.length === 0) refill();
      last = bag.pop()!;
      return last;
    },
    /** Remaining moves in the current set (for the preview panel). */
    remaining: () => bag.length,
  };
}
