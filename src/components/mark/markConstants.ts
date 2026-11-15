/**
 * Brand-mark constants with no dependencies, so code that loads with the
 * page (hero layout) can use them without pulling three.js into the initial
 * bundle. markGeometry.ts re-exports them.
 */

export const MARK_SVG_URL = "/brand/solvitech-mark.svg";

/** World-space height of the combined mark. Everything else scales from this. */
export const MARK_WORLD_HEIGHT = 3;
