/**
 * "System Activation" entrance prototype: shared timeline and boot logic.
 *
 * The visuals are CSS animations (entrance.css), all keyed off
 * html[data-intro]:
 *   play -> the intro is running (set before first paint by the boot script,
 *           or by Replay);
 *   done -> finished or skipped: everything rests in its final state;
 *   skip -> the 3D is expected to be ready almost at once (see below), or
 *           reduced motion: the normal hero, no intro;
 *   off  -> lab comparison: the current homepage entrance.
 * Nothing waits for WebGL: the intro moves the mark's whole stage (poster or
 * live canvas, whichever is showing), so the 3D can take over at any moment.
 *
 * Keep these in step with entrance.css.
 */
export const INTRO = {
  /** Stage A: the mark fades in, centred, dormant (dimmed). */
  appearMs: 220,
  /** Stage B: a blue light sweep passes through the mark as it powers up. */
  sweepDelayMs: 160,
  sweepMs: 640,
  /** Stage C: the mark glides from the centre into its hero position. */
  moveDelayMs: 640,
  moveMs: 560,
  /** The copy arrives with the move; this is when the intro attribute is cleared. */
  endMs: 1500,
  /** Mark size during stages A-B, relative to its final size (<= 1 keeps the canvas sharp). */
  scale: 0.86,
} as const;

/**
 * The intro only covers loading. Whether the 3D will be ready almost at once
 * cannot be known before the first paint, so it is predicted from the last
 * real visit: how long the 3D took to take over (warm cache, capable device)
 * or whether WebGL was unavailable (nothing to wait for).
 */
export const INTRO_3D_KEY = "solvitech:entrance-prototype:3d";
/** Takeover (performance.now() at data-entrance=complete) counted as "immediate". */
export const INTRO_FAST_MS = 900;
/** Older records are ignored: the browser cache may have been cleared since. */
export const INTRO_RECORD_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface Intro3dRecord {
  /** ms after navigation start until the 3D took over; null = WebGL unavailable. */
  readyMs: number | null;
  /** Date.now() when recorded. */
  at: number;
}

/**
 * Offsets that put the mark's stage centre (= the mark's centre) at the
 * viewport centre. Measured on the untransformed stage, so call it while
 * html[data-intro] is not "play".
 */
export function placeIntroStage(stage: HTMLElement) {
  const r = stage.getBoundingClientRect();
  stage.style.setProperty("--intro-dx", `${window.innerWidth / 2 - (r.left + r.width / 2)}px`);
  stage.style.setProperty("--intro-dy", `${window.innerHeight / 2 - (r.top + r.height / 2)}px`);
}

export const STAGE_SELECTOR = "#hero [data-entrance]";

/**
 * Inline boot script, placed right after the hero markup so it runs before
 * the first paint: decides whether the intro plays and centres the mark.
 */
export const INTRO_BOOT_SCRIPT = `(function () {
  try {
    var html = document.documentElement;
    var place = ${placeIntroStage.toString()};
    var stage = document.querySelector(${JSON.stringify(STAGE_SELECTOR)});
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var rec = null;
    try { rec = JSON.parse(localStorage.getItem(${JSON.stringify(INTRO_3D_KEY)}) || "null"); } catch (e) {}
    if (rec && !(Date.now() - rec.at < ${INTRO_RECORD_MAX_AGE_MS})) rec = null;
    var fast = !!rec && (rec.readyMs === null || rec.readyMs <= ${INTRO_FAST_MS});
    if (!stage || reduced || fast || window.scrollY > 0) {
      html.setAttribute("data-intro", "skip");
      html.setAttribute("data-intro-reason", !stage ? "no-stage" : reduced ? "reduced-motion" : fast
        ? (rec.readyMs === null ? "no WebGL last visit" : "3D ready in " + Math.round(rec.readyMs) + " ms last visit")
        : "scrolled");
      return;
    }
    html.setAttribute("data-intro-reason", rec ? "3D took " + Math.round(rec.readyMs) + " ms last visit" : "first visit");
    place(stage);
    html.setAttribute("data-intro-start", String(performance.now()));
    html.setAttribute("data-intro", "play");
  } catch (e) {}
})();`;
