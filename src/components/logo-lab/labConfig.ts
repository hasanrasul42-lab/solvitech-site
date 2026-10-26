export interface LabSettings {
  /** Straight extrusion depth, world units (mark is 3 units tall). */
  depth: number;
  /** Bevel size and thickness, world units. */
  bevel: number;
  bevelSegments: number;
  /** Corner-preserving smoothing through the traced vertices. */
  smoothing: boolean;
  roughness: number;
  metalness: number;
  keyLight: number;
  rimLight: number;
  environment: number;
  /** 0 hides the reference overlay. */
  referenceOpacity: number;
  showTrace: boolean;
}

export interface ViewState {
  /** Degrees around the vertical axis; 0 = front. */
  azimuth: number;
  /** Degrees above the horizontal; 0 = level. */
  elevation: number;
  /** Bumped on reset/preset so the camera re-fits even if angles are unchanged. */
  resetToken: number;
}

export const DEFAULT_SETTINGS: LabSettings = {
  depth: 0.16,
  bevel: 0.02,
  bevelSegments: 4,
  smoothing: true,
  roughness: 0.42,
  metalness: 0.05,
  keyLight: 1.6,
  rimLight: 1.2,
  environment: 0.9,
  referenceOpacity: 0,
  showTrace: false,
};

/** Task 02 experiments. Each block toggles independently. */
export interface ExperimentSettings {
  /** false = Task 01 static mode: plain materials, no effects, no motion. */
  enabled: boolean;
  illumination: {
    enabled: boolean;
    glowStrength: number;
    glowColor: string;
    /** Glow blur radius, SVG px. */
    glowSoftness: number;
    /** Restrained self-illumination of the blue ribbon. */
    blueEmissive: number;
    /** Lifts the white ribbon towards true satin white. */
    whiteLift: number;
  };
  energy: {
    enabled: boolean;
    /** Full circuits (blue -> white -> blue) per second. */
    speed: number;
    intensity: number;
    /** Pulses travelling the circuit at once. */
    frequency: number;
    /** Pulse length, fraction of the circuit. */
    width: number;
    /** Strength of the response on the white ribbon relative to the blue. */
    whiteResponse: number;
  };
  motion: {
    arrival: boolean;
    idle: boolean;
    cursor: boolean;
    /** Max cursor tilt, degrees. */
    cursorTilt: number;
    /** Idle drift amplitude multiplier. */
    idleAmount: number;
  };
}

export const DEFAULT_EXPERIMENTS: ExperimentSettings = {
  enabled: true,
  illumination: {
    enabled: true,
    glowStrength: 0.55,
    glowColor: "#2f6bff",
    glowSoftness: 34,
    blueEmissive: 0.22,
    whiteLift: 0.5,
  },
  energy: {
    enabled: true,
    speed: 0.09,
    intensity: 1.1,
    frequency: 1,
    width: 0.07,
    whiteResponse: 0.35,
  },
  motion: {
    arrival: true,
    idle: true,
    cursor: true,
    cursorTilt: 4,
    idleAmount: 1,
  },
};

export const FRONT_VIEW = { azimuth: 0, elevation: 0 };
export const THREE_QUARTER_VIEW = { azimuth: -35, elevation: 15 };

/**
 * Placement of the SVG inside original-reference.png, measured from the
 * reference pixels: SVG (0,0) lands at (svgOriginX, svgOriginY) and one SVG
 * unit spans pxPerSvgUnit reference pixels.
 */
export const REFERENCE_IMAGE = {
  url: "/brand/original-reference.png",
  width: 1254,
  height: 1254,
  svgOriginX: 407,
  svgOriginY: 331,
  pxPerSvgUnit: 1,
};

export const MARK_SVG_SIZE = { width: 443, height: 588 };
