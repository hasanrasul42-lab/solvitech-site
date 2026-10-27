"use client";

import InteractiveMark from "@/components/hero/interactive/InteractiveMark";
import type { Lighting } from "@/components/hero/interactive/InteractiveScene";

/**
 * Poster authoring. Two stages render the real scene frozen at entrance pose
 * q = 0 (start) and q = 1 (rest). The stages are landscape, so the mark is
 * height-fitted exactly as in the hero.
 *
 * Export: serve the app with POSTER_CAPTURE=1, open this page, and run
 * `window.capturePosters()` in the console. Each canvas is cropped to the
 * POSTER box (ribbon box x POSTER.scaleX/Y, centred), encoded as WebP and
 * saved to public/brand/poster/ via /api/poster-capture. Rebuild afterwards.
 */
export default function PosterCapture({ lighting = "approved" }: { lighting?: Lighting }) {
  const suffix = lighting === "refined" ? "-refined" : "";
  return (
    <div className="grid gap-6 p-6">
      <p className="text-xs text-slate-500">
        Poster capture. Run <code>window.capturePosters()</code> with POSTER_CAPTURE=1.
      </p>
      {[0, 1].map((q) => (
        <div key={q} data-poster-q={q} className="relative h-[760px] w-[1100px]">
          <InteractiveMark className="h-full w-full" captureQ={q} lighting={lighting} />
        </div>
      ))}
      <CaptureScript suffix={suffix} />
    </div>
  );
}

function CaptureScript({ suffix }: { suffix: string }) {
  // Inline script: installs window.capturePosters() for the export procedure.
  const code = `
window.capturePosters = async function () {
  const { MARK_HEIGHT_FRACTION, MARK_MAX_WIDTH_FRACTION, RIBBON, SCALE_X, SCALE_Y } = ${JSON.stringify({
    MARK_HEIGHT_FRACTION: 0.58,
    MARK_MAX_WIDTH_FRACTION: 0.72,
    RIBBON: { w: 420, h: 555 },
    SCALE_X: 1.7,
    SCALE_Y: 1.55,
  })};
  const grab = (canvas) => new Promise((resolve) => {
    const raf = window.requestAnimationFrame.bind(window);
    let done = false;
    const wrapped = (cb) => raf((ts) => { cb(ts); if (!done) { done = true; window.requestAnimationFrame = raf;
      const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
      c.getContext('2d').drawImage(canvas, 0, 0); resolve(c); } });
    window.requestAnimationFrame = wrapped;
    window.dispatchEvent(new Event('resize'));
  });
  const results = [];
  for (const [q, name] of [[0, 'mark-entrance-start${suffix}'], [1, 'mark-entrance-final${suffix}']]) {
    const stage = document.querySelector('[data-poster-q="' + q + '"]');
    const canvas = stage.querySelector('canvas');
    const snap = await grab(canvas);
    const W = snap.width, H = snap.height;
    const markH = Math.min(H * MARK_HEIGHT_FRACTION, (W * MARK_MAX_WIDTH_FRACTION * RIBBON.h) / RIBBON.w);
    const cw = Math.round(markH * (RIBBON.w / RIBBON.h) * SCALE_X), ch = Math.round(markH * SCALE_Y);
    const out = document.createElement('canvas'); out.width = cw; out.height = ch;
    out.getContext('2d').drawImage(snap, (W - cw) / 2, (H - ch) / 2, cw, ch, 0, 0, cw, ch);
    const dataUrl = out.toDataURL('image/webp', 0.86);
    const res = await fetch('/api/poster-capture', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, dataUrl }) });
    results.push({ name, size: [cw, ch], status: res.status, saved: res.ok ? (await res.json()).bytes : null });
  }
  return results;
};`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
