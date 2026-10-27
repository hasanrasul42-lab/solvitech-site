import * as THREE from "three";
import type { MoveId } from "./moves";

/** Cursor response envelope (degrees / CSS px at the far edge of the viewport). */
export interface ResponseStrength {
  label: string;
  yawDeg: number;
  pitchDeg: number;
  parallaxXPx: number;
  parallaxYPx: number;
}

export const RESPONSE_PRESETS = {
  subtle: { label: "Subtle", yawDeg: 6, pitchDeg: 4, parallaxXPx: 6, parallaxYPx: 3 },
  standard: { label: "Standard", yawDeg: 12, pitchDeg: 8, parallaxXPx: 10, parallaxYPx: 6 },
  expressive: { label: "Expressive", yawDeg: 15, pitchDeg: 9, parallaxXPx: 12, parallaxYPx: 6 },
} satisfies Record<string, ResponseStrength>;

export type ResponsePreset = keyof typeof RESPONSE_PRESETS;

/**
 * Entrance. A 3D-rendered poster of the real scene at the start pose shows at
 * first paint; once WebGL has rendered, the canvas takes over at exactly that
 * pose and the real geometry performs the whole entrance.
 *
 * Posters are rendered from this scene by /3d-lab/poster-capture on the archive branch (see that
 * page for how to regenerate them after changing materials, lights or the
 * start pose).
 */
export const ENTRANCE = {
  /** Real 3D entrance, start pose -> rest. */
  durationMs: 1400,
  /** Canvas fades in over the start poster (both at the start pose). */
  handoverMs: 120,
  /**
   * If WebGL has not rendered by this time after navigation start, there is
   * no late entrance: the start poster gives way to the final-pose poster and
   * the 3D later takes over at rest. Generous on purpose: a slightly late real
   * entrance looks far better than swapping posters.
   */
  maxWaitMs: 3000,
  /** Start -> final poster swap duration (globals.css .mark-poster-out/-fallback). */
  fallbackPosterMs: 700,
  /** After taking over from the resting poster, cursor response blends in over this. */
  takeoverEngageMs: 900,
  /** Entrance time fraction where pointer response and idle drift start to blend in. */
  engageFrom: 0.72,
  /** Entrance time fraction for the energy pulse. */
  pulseAt: 0.55,
} as const;

/** Entrance pose easing: zero velocity at both ends, peak speed early, long settle. */
export const entranceEase = (t: number) => 1 - Math.pow(1 - t, 4) * (1 + 4 * t);

/**
 * Dispatched (bubbling) from the mark's stage when the 3D entrance starts, so
 * other hero elements can finish together with it.
 */
export const MARK_ENTRANCE_EVENT = "solvitech:mark-entrance";
export interface MarkEntranceDetail {
  /** performance.now() time at which the mark's entrance ends. */
  endsAt: number;
}

export type EntranceState = "poster" | "handover" | "entering" | "complete" | "fallback";

/** Live entrance progress handed to the scene each frame. */
export interface EntranceProgress {
  /** Overrides the time-based cursor/idle blend (fallback takeover). */
  engage?: number;
  /** Pose progress, 0 = start pose, 1 = rest. */
  q: number;
  /** Time progress through the entrance, 0..1. */
  t: number;
}
export const DEFAULT_RESPONSE: ResponsePreset = "standard";

/** Every timing and amplitude in one place, so the report and code agree. */
export const TIMING = {
  /** Ignore further clicks for this long after an animation ends. */
  clickCooldownSeconds: 0.25,
  pulseSeconds: 1.4,
  /** Cursor/keyboard spring smooth time (s): ~60% at 200ms, settled ~450ms. */
  tiltSmoothTime: 0.2,
  dragSmoothTime: 0.08,
  releaseSmoothTime: 0.35,
} as const;

export const AMPLITUDE = {
  /** Entrance start pose (entrance progress q = 0). Mirrored exactly by the
   *  `.mark-entrance` transform in globals.css. */
  arrivalYawDeg: -16,
  arrivalPitchDeg: 5,
  arrivalDrop: 0.288, // world units = 9.6% of the 3-unit mark height (~45-50px desktop)
  arrivalScale: 0.9,
  idleYawDeg: 1.5,
  idlePitchDeg: 0.8,
  idleRollDeg: 0.3,
  idleFloat: 0.04,
  /** Lift at a move's crest (scale and forward travel are per move). */
  manoeuvreLift: 0.04,
  /** Extra glow at the start of a move (x base glow). */
  manoeuvreGlow: 0.9,
  dragMaxYawDeg: 35,
  keyStepDeg: 4,
} as const;

/**
 * Input written by DOM event handlers and read by the render loop. Lives in a
 * ref: pointer movement never re-renders React.
 */
export interface InteractionInput {
  /** Cursor offset from the logo centre, -1..1 (y down). */
  pointer: THREE.Vector2;
  dragging: boolean;
  /** Touch-drag preview yaw, radians. */
  dragYaw: number;
  /** Arrow-key offsets, radians. */
  keyYaw: number;
  keyPitch: number;
  /** Incremented per click/tap/Enter; the scene consumes requests. */
  spinRequests: number;
  /** Optional specific move for the next request (preview panel). */
  requestedMove: MoveId | "replay" | null;
  /** Incremented to reset and replay the arrival. */
  resetRequests: number;
}

export function createInteractionInput(): InteractionInput {
  return {
    pointer: new THREE.Vector2(),
    dragging: false,
    dragYaw: 0,
    keyYaw: 0,
    keyPitch: 0,
    spinRequests: 0,
    requestedMove: null,
    resetRequests: 0,
  };
}
