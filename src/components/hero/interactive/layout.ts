import * as THREE from "three";
import { MARK_WORLD_HEIGHT, type MarkContours } from "../../mark/markGeometry";

/** Mark height as a fraction of the stage, unless the stage is narrow. */
export const MARK_HEIGHT_FRACTION = 0.58;
export const MARK_MAX_WIDTH_FRACTION = 0.72;

/** solvitech-mark.svg viewBox and the ribbons' combined bounding box (SVG px). */
export const VIEWBOX = { w: 443, h: 588, ribbonX: 11, ribbonY: 15 };
export const RIBBON_BOX = { w: 420, h: 555 };

export const FOV = 22;

/**
 * Camera distance and world-per-CSS-pixel such that the silhouette plane
 * (z = silhouetteZ, the front edge of the side walls) is exactly the fitted
 * size. Fitting z = 0 instead would make the front ~2% larger than the
 * reference under perspective.
 */
export function fitMetrics(width: number, height: number, contours: MarkContours, silhouetteZ: number) {
  const bounds = contours.bounds.getSize(new THREE.Vector2());
  const markPx = Math.min(height * MARK_HEIGHT_FRACTION, (width * MARK_MAX_WIDTH_FRACTION * bounds.y) / bounds.x);
  const visibleHeight = (MARK_WORLD_HEIGHT * height) / markPx;
  return {
    distance: silhouetteZ + visibleHeight / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)),
    worldPerPx: visibleHeight / height,
  };
}

/** CSS size of the ribbon box, matching fitMetrics (container query units). */
export const RIBBON_BOX_CSS = {
  height: `min(${MARK_HEIGHT_FRACTION * 100}cqh, ${((MARK_MAX_WIDTH_FRACTION * RIBBON_BOX.h) / RIBBON_BOX.w) * 100}cqw)`,
  aspectRatio: `${RIBBON_BOX.w} / ${RIBBON_BOX.h}`,
};

/**
 * 3D-rendered entrance posters (see /3d-lab/poster-capture). Each poster is the
 * real scene cropped to the ribbon box scaled by scaleX/scaleY around its
 * centre (room for the start pose's turn and drop, and the resting glow).
 */
export const POSTER = {
  startUrl: "/brand/poster/mark-entrance-start.webp",
  finalUrl: "/brand/poster/mark-entrance-final.webp",
  scaleX: 1.7,
  scaleY: 1.55,
  /** The same posters rendered with the "refined" lighting (A/B candidate). */
  refined: {
    startUrl: "/brand/poster/mark-entrance-start-refined.webp",
    finalUrl: "/brand/poster/mark-entrance-final-refined.webp",
  },
} as const;

/** Poster URLs for a lighting variant (posters must match the live scene's lighting). */
export function posterUrls(lighting: "approved" | "refined" = "approved") {
  return lighting === "refined" ? POSTER.refined : { startUrl: POSTER.startUrl, finalUrl: POSTER.finalUrl };
}
