"use client";

import { useEffect, useRef } from "react";
import { registerSpine, spineChanged } from "@/components/field/runtime";

type P = [number, number];

/** Smooth path through points (Catmull-Rom as cubic Béziers). */
function through(p: P[]) {
  if (p.length < 2) return "";
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] ?? c;
    const c1: P = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
    const c2: P = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  return d;
}

/**
 * The homepage spine: one continuous luminous path through every chapter.
 * It leaves the hero's light under the mark, becomes the service map's axis,
 * runs down the margin beside Why Solvitech, becomes the Approach route,
 * passes Working Together and converges on the enquiry form.
 *
 * Its course is measured from the real layout (on load and on resize), so it
 * crosses every section boundary at any viewport size. The lit portion and
 * its head follow the scroll position (runtime.ts); the whole course is always
 * faintly visible, so the page reads as one environment. Decorative only.
 */
export default function HomeSpine() {
  const svg = useRef<SVGSVGElement>(null);
  const dormant = useRef<SVGPathElement>(null);
  const lit = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = svg.current?.parentElement;
    if (!svg.current || !root || !lit.current || !glow.current || !head.current || !dormant.current) return;
    const el = svg.current;
    const paths = [dormant.current, lit.current, glow.current];

    const build = () => {
      const base = root.getBoundingClientRect();
      const W = base.width;
      const rel = (r: DOMRect) => ({ l: r.left - base.left, t: r.top - base.top, r: r.right - base.left, b: r.bottom - base.top, w: r.width, h: r.height });
      const q = (s: string) => document.querySelector(s);
      const hero = q("#hero");
      const map = q(".svc-map");
      const why = q("#why");
      const nodes = document.querySelectorAll("#approach .prog-node");
      const working = q("#working-together");
      const form = q("#contact form")?.parentElement;
      if (!hero || !map || !why || nodes.length < 2 || !working || !form) return;
      const gx = W >= 1024 ? 24 : W >= 640 ? 16 : 10;
      const H = rel(hero.getBoundingClientRect());
      const M = rel(map.getBoundingClientRect());
      const Y = rel(why.getBoundingClientRect());
      const N0 = rel(nodes[0].getBoundingClientRect());
      const N1 = rel(nodes[nodes.length - 1].getBoundingClientRect());
      const Wk = rel(working.getBoundingClientRect());
      const F = rel(form.getBoundingClientRect());
      const cx = M.l + M.w / 2;
      const lg = W >= 1024;
      if (W < 768) {
        // Phones: the copy spans the width, so the spine keeps to the gutters
        // and changes side only in the space between chapters.
        const R = W - gx;
        const narrow: P[] = [
          [R, H.b - 4],
          [R, M.b + 40],
          [R, Y.t - 20],
          [gx, Y.t + 50],
          [gx, Y.b - 60],
          [N0.l + N0.w / 2, N0.t + N0.h / 2],
          [N1.l + N1.w / 2, N1.t + N1.h / 2],
          [N1.l + N1.w / 2, N1.b + 90],
          [R, Wk.t + 40],
          [R, F.t - 40],
          [F.r - 28, F.t],
        ];
        const d = through(narrow);
        el.setAttribute("width", String(W));
        el.setAttribute("height", String(base.height));
        for (const p of paths) p.setAttribute("d", d);
        spineChanged(base.top + window.scrollY);
        return;
      }
      const pts: P[] = [
        [lg ? W * 0.69 : W * 0.5, H.b - (lg ? 40 : 4)],
        [cx, M.t - 64],
        [cx, M.t + M.h / 2],
        [cx, M.b + 56],
        [gx, M.b + 260],
        [gx, Y.b - 60],
        [N0.l + N0.w / 2, N0.t + N0.h / 2],
        [N1.l + N1.w / 2, N1.t + N1.h / 2],
        [W - gx, Wk.t + 140],
        [W - gx, Wk.b - 40],
        [F.l + F.w * 0.18, F.t],
      ];
      // Straight runs where the spine becomes the map axis and the Approach route.
      const d =
        through(pts.slice(0, 2)) +
        ` L${cx.toFixed(1)} ${(M.b + 56).toFixed(1)}` +
        through(pts.slice(3, 7)).replace(/^M[^C]+/, "") +
        ` L${pts[7][0].toFixed(1)} ${pts[7][1].toFixed(1)}` +
        through(pts.slice(7)).replace(/^M[^C]+/, "");
      el.setAttribute("width", String(W));
      el.setAttribute("height", String(base.height));
      for (const p of paths) p.setAttribute("d", d);
      spineChanged(base.top + window.scrollY);
    };

    build();
    const off = registerSpine({ el, lit: lit.current, glow: glow.current, head: head.current, top: 0 });
    build();
    let t = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(t);
      t = requestAnimationFrame(build);
    });
    ro.observe(root);
    window.addEventListener("resize", build, { passive: true });
    return () => {
      off();
      ro.disconnect();
      cancelAnimationFrame(t);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <svg ref={svg} aria-hidden focusable="false" className="spine pointer-events-none absolute left-0 top-0 overflow-visible">
      <defs>
        <radialGradient id="spine-head-glow">
          <stop offset="0" stopColor="rgb(200 222 255)" stopOpacity="0.9" />
          <stop offset="0.3" stopColor="rgb(84 140 255)" stopOpacity="0.35" />
          <stop offset="1" stopColor="rgb(54 123 250)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path ref={dormant} className="spine-dormant" fill="none" />
      <path ref={lit} className="spine-lit" pathLength={1} fill="none" />
      <path ref={glow} className="spine-glow" pathLength={1} fill="none" />
      <g ref={head} className="spine-head">
        <circle r="26" fill="url(#spine-head-glow)" />
        <circle r="2.2" fill="rgb(235 243 255)" />
      </g>
    </svg>
  );
}
