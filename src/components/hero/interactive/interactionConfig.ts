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
export const DEFAULT_RESPONSE: ResponsePreset = "standard";

/** Every timing and amplitude in one place, so the report and code agree. */
export const TIMING = {
  arrivalSeconds: 1.8,
  /** Arrival progress at which the first energy pulse is launched. */
  arrivalPulseAt: 0.35,
  /** Ignore further clicks for this long after an animation ends. */
  clickCooldownSeconds: 0.25,
  pulseSeconds: 1.4,
  /** Cursor/keyboard spring smooth time (s): ~60% at 200ms, settled ~450ms. */
  tiltSmoothTime: 0.2,
  hoverSmoothTime: 0.22,
  dragSmoothTime: 0.08,
  releaseSmoothTime: 0.35,
} as const;

export const AMPLITUDE = {
  arrivalYawDeg: -10,
  arrivalPitchDeg: 4,
  arrivalDrop: 0.14, // world units (~3% of mark height)
  arrivalScale: 0.96,
  idleYawDeg: 1.5,
  idlePitchDeg: 0.8,
  idleRollDeg: 0.3,
  idleFloat: 0.04,
  hoverScale: 0.025,
  /** Lift at a move's crest (scale and forward travel are per move). */
  manoeuvreLift: 0.04,
  /** Extra glow at the start of a move (x base glow). */
  manoeuvreGlow: 0.9,
  hoverLift: 0.05,
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
  hover: boolean;
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
    hover: false,
    dragging: false,
    dragYaw: 0,
    keyYaw: 0,
    keyPitch: 0,
    spinRequests: 0,
    requestedMove: null,
    resetRequests: 0,
  };
}
