/**
 * Cursor interaction envelopes for the hero sculpture. Angles are the maximum
 * orientation (idle drift included) when the cursor is at the far edge of the
 * viewport; parallax is in CSS pixels.
 */
export interface HeroInteraction {
  label: string;
  yawDeg: number;
  pitchDeg: number;
  parallaxXPx: number;
  parallaxYPx: number;
}

export const HERO_PRESETS = {
  subtle: { label: "Subtle", yawDeg: 6, pitchDeg: 4, parallaxXPx: 6, parallaxYPx: 3 },
  balanced: { label: "Balanced", yawDeg: 11, pitchDeg: 7, parallaxXPx: 9, parallaxYPx: 5 },
  expressive: { label: "Expressive", yawDeg: 15, pitchDeg: 9, parallaxXPx: 12, parallaxYPx: 6 },
} satisfies Record<string, HeroInteraction>;

export type HeroPreset = keyof typeof HERO_PRESETS;

/** Experimental default while the envelope is being evaluated. */
export const DEFAULT_HERO_PRESET: HeroPreset = "expressive";

/**
 * Spring smooth time (s). Critically damped, x(t) = (1 + ωt)e^(−ωt) with
 * ω = 2 / smoothTime: visibly moving within a couple of frames, ~60% of the
 * way at 200ms, ~94% at 450ms, no overshoot.
 */
export const HERO_SMOOTH_TIME = 0.2;
