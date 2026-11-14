"use client";

import { useEffect, useRef } from "react";
import { HERO_FLOW } from "@/components/field/geometry";
import { registerPainter, wake, type PaintState } from "@/components/field/runtime";

/** Stroke colours per ink (match field.css) and the lit colour they move towards. */
const INK: Record<string, [number, number, number, number]> = {
  faint: [150, 180, 230, 0.07],
  soft: [150, 180, 230, 0.13],
  ink: [150, 180, 230, 0.2],
  blue: [54, 123, 250, 0.38],
};
const LIT: [number, number, number, number] = [150, 188, 255, 0.8];
const REACH = 150;
const DRAW_MS = 1800;
const PULSE_MS = 1500;

type Line = {
  path: Path2D;
  len: number; // design units
  samples: [number, number][]; // design units
  ink: [number, number, number, number];
  width: number;
  lift: number;
  delay: number;
  depth: number;
  phase: number;
  e: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/**
 * The hero's living background, drawn on its own Canvas 2D layer behind the
 * approved hero (which is not modified). The same directional flow as the
 * rest of the field vocabulary, painted on the shared runtime frame: it draws
 * in when the System Activation intro ends, leans with the pointer in two
 * depths, and each curve flexes, brightens and carries a pulse where the
 * cursor trail passes. It redraws only while something is changing, so it
 * costs nothing at rest and never touches the 3D scene.
 */
export default function HeroFlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Geometry: Path2D for drawing, an SVG path element for measuring.
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const lines: Line[] = HERO_FLOW.map((s, i) => {
      svgPath.setAttribute("d", s.d);
      const len = svgPath.getTotalLength();
      const n = Math.max(8, Math.round(len / 60));
      const samples: [number, number][] = [];
      for (let k = 0; k <= n; k++) {
        const p = svgPath.getPointAtLength((len * k) / n);
        samples.push([p.x, p.y]);
      }
      return {
        path: new Path2D(s.d),
        len,
        samples,
        ink: INK[s.ink ?? "soft"],
        width: s.width ?? 1,
        lift: s.lift ?? 0,
        delay: s.delay ?? 0,
        depth: i < 15 ? 14 : 26,
        phase: (i * 397) % PULSE_MS,
        e: 0,
      };
    });

    let W = 0;
    let H = 0;
    let dpr = 1;
    let pageTop = 0;
    let dirty = true;
    let introAt = -1;
    let lastTx = 9;
    let lastTy = 9;
    // View: desktop frames the full composition; phones frame it around the mark.
    let scale = 1;
    let ox = 0;
    let oy = 0;
    let narrow = false;

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      pageTop = r.top + window.scrollY;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      narrow = W < 768;
      const [vx, vy, vw, vh] = narrow ? [700, 200, 620, 900] : [0, 0, 1440, 900];
      scale = Math.max(W / vw, H / vh);
      ox = (W - vw * scale) / 2 - vx * scale;
      oy = narrow ? -vy * scale : (H - vh * scale) / 2 - vy * scale;
      dirty = true;
      wake();
    };

    const introPlaying = () => document.documentElement.getAttribute("data-intro") === "play";
    const mo = new MutationObserver(() => wake());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] });

    const paint = (st: PaintState) => {
      if (!W || !H) return false;
      // Off screen: nothing to draw (resume when it returns).
      const scrollY = window.scrollY;
      if (scrollY > pageTop + H) {
        dirty = true;
        return false;
      }
      if (introPlaying()) {
        if (dirty) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          dirty = false;
        }
        return false;
      }
      if (introAt < 0) introAt = st.now;
      const since = st.reduced ? Infinity : st.now - introAt;

      // Energy from the newest trail points (client coords -> canvas coords).
      const src: [number, number, number][] = [];
      if (st.interactive) {
        for (let i = st.trail.length - 1; i >= 0 && src.length < 6; i -= 3) {
          const p = st.trail[i];
          const life = 1 - (st.now - p.t) / st.trailMs;
          if (life <= 0) break;
          src.push([p.x, p.y + scrollY - pageTop, life * Math.min(1, 0.35 + p.v / 1.4)]);
        }
      }
      const up = 1 - Math.exp(-st.dt * 40);
      const down = 1 - Math.exp(-st.dt * 2.2);
      let active = false;
      for (const l of lines) {
        let target = 0;
        if (src.length) {
          const dx = -st.tx * l.depth;
          const dy = -st.ty * l.depth * 0.6;
          for (const [sx, sy, w] of src) {
            for (const [x, y] of l.samples) {
              const cx = ox + x * scale + dx - sx;
              const cy = oy + y * scale + dy - sy;
              const d2 = cx * cx + cy * cy;
              if (d2 < REACH * REACH) {
                const k = 1 - Math.sqrt(d2) / REACH;
                const v = k * k * (3 - 2 * k) * w;
                if (v > target) target = v;
              }
            }
          }
        }
        l.e += (target - l.e) * (target > l.e ? up : down);
        if (l.e < 0.003) l.e = 0;
        if (l.e > 0) active = true;
      }

      const drawing = since < DRAW_MS + 1300;
      const moved = Math.abs(st.tx - lastTx) + Math.abs(st.ty - lastTy) > 0.0008;
      if (!dirty && !drawing && !active && !moved) return false;
      dirty = false;
      lastTx = st.tx;
      lastTy = st.ty;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const l of lines) {
        const p = easeOut((since - l.delay) / DRAW_MS);
        if (p <= 0) continue;
        const e = l.e;
        const lift = narrow ? 0 : e * l.lift;
        ctx.save();
        ctx.translate(ox - st.tx * l.depth, oy - st.ty * l.depth * 0.6 - lift);
        ctx.scale(scale, scale);
        const L = l.len;
        const m = e * 0.62;
        const c = l.ink;
        const r = c[0] + (LIT[0] - c[0]) * m;
        const g = c[1] + (LIT[1] - c[1]) * m;
        const b = c[2] + (LIT[2] - c[2]) * m;
        const a = c[3] + (LIT[3] - c[3]) * m;
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
        ctx.lineWidth = (l.width + e * 0.5) / scale;
        ctx.setLineDash(p < 1 ? [L * p, L] : []);
        ctx.stroke(l.path);
        // A pulse travelling along an energised curve.
        if (e > 0.25 && p >= 1 && !st.reduced) {
          const seg = L * 0.045;
          const ph = ((st.now + l.phase) % PULSE_MS) / PULSE_MS;
          const t = ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2;
          ctx.setLineDash([seg, L * 2]);
          ctx.lineDashOffset = seg - t * (L + seg);
          ctx.strokeStyle = `rgba(205,224,255,${(e * 0.55).toFixed(3)})`;
          ctx.lineWidth = (l.width + 0.6) / scale;
          ctx.stroke(l.path);
          ctx.lineDashOffset = 0;
        }
        ctx.restore();
      }
      // Keep the copy side clear: fade the composition out towards the text.
      ctx.globalCompositeOperation = "destination-in";
      const fade = narrow ? ctx.createLinearGradient(0, 0, 0, H) : ctx.createLinearGradient(0, 0, W, 0);
      if (narrow) {
        fade.addColorStop(0, "#000");
        fade.addColorStop(0.38, "#000");
        fade.addColorStop(0.7, "rgba(0,0,0,0.25)");
        fade.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        fade.addColorStop(0, "rgba(0,0,0,0.18)");
        fade.addColorStop(0.3, "rgba(0,0,0,0.45)");
        fade.addColorStop(0.55, "#000");
      }
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, W, H);
      if (!narrow) {
        // Dissolve into the Solutions chapter below: no edge at the canvas bottom.
        const bottom = ctx.createLinearGradient(0, H * 0.62, 0, H);
        bottom.addColorStop(0, "#000");
        bottom.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bottom;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = "source-over";
      return drawing || active;
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    const off = registerPainter(paint);
    return () => {
      off();
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
