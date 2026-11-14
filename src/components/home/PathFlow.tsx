"use client";

import { useEffect, useRef } from "react";
import { registerPainter, wake, type PaintState } from "@/components/field/runtime";

/**
 * Homepage background -- option B ("path", shown with ?bg=path): one planned
 * pathway, drawn like an engineered route (straight runs, rounded turns),
 * where every turn means something:
 *   Hero             leaves from under the mark as a single line
 *   Solutions        runs down the service map's axis; at the centre it
 *                    branches along the horizontal gap -- four services, one system
 *   Why Solvitech    one quiet line in the gap between the two columns
 *   Our Approach     becomes the stage route, Discover to Launch & Evolve
 *   Working Together branches into three, one per engagement model
 *   Contact          ends at the enquiry form's frame
 * The full route is faintly visible; the lit part and its head follow the
 * scroll position. Measured from the real layout; text is always kept clear.
 * Painted on the shared runtime frame (no work at rest).
 */

type P = [number, number];
type Route = { pts: P[]; cum: number[]; reach: number[]; len: number; path: Path2D };
type Branch = { route: Route; root: number; end: boolean };
type Rect = [number, number, number, number];

const RADIUS = 22;
const TEXT = "h2, h3, p, li, dt, dd, label, input, select, textarea, a, button, .svc-p";

function route(pts: P[]): Route {
  const path = new Path2D();
  path.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) path.arcTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], RADIUS);
  path.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
  const cum = [0];
  const reach = [pts[0][1]];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    reach.push(Math.max(reach[i - 1], pts[i][1]));
  }
  return { pts, cum, reach, len: cum[cum.length - 1], path };
}

/** Length of route drawn when everything above page-y `y` is revealed. */
function drawnAt(r: Route, y: number) {
  if (y <= r.reach[0]) return 0;
  for (let i = 1; i < r.pts.length; i++) {
    if (r.reach[i] >= y) {
      const y0 = r.pts[i - 1][1];
      const y1 = r.pts[i][1];
      const seg = r.cum[i] - r.cum[i - 1];
      // Horizontal runs reveal all at once when reached; vertical runs follow y.
      if (y1 === y0) return r.cum[i];
      return r.cum[i - 1] + seg * Math.min(1, Math.max(0, (y - y0) / (y1 - y0)));
    }
  }
  return r.len;
}

function pointAt(r: Route, l: number): P {
  for (let i = 1; i < r.pts.length; i++) {
    if (r.cum[i] >= l) {
      const k = (l - r.cum[i - 1]) / (r.cum[i] - r.cum[i - 1] || 1);
      return [r.pts[i - 1][0] + (r.pts[i][0] - r.pts[i - 1][0]) * k, r.pts[i - 1][1] + (r.pts[i][1] - r.pts[i - 1][1]) * k];
    }
  }
  return r.pts[r.pts.length - 1];
}

export default function PathFlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const main = canvas?.parentElement;
    if (!canvas || !ctx || !main) return;
    const on = () => document.documentElement.getAttribute("data-bg") === "path";

    let W = 0;
    let H = 0;
    let dpr = 1;
    let trunk: Route | null = null;
    let branches: Branch[] = [];
    let rects: Rect[] = [];
    let dots: P[] = [];
    let lastY = -1;
    let dirty = true;
    let cleared = false;

    const build = () => {
      if (!on()) return;
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const sy = window.scrollY;
      const box = (el: Element | null | undefined) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { l: r.left, r: r.right, t: r.top + sy, b: r.bottom + sy, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + sy + r.height / 2 };
      };
      const hero = box(document.getElementById("hero"));
      const map = box(document.querySelector(".svc-map"));
      const why = box(document.getElementById("why"));
      const whyText = box(document.querySelector("#why [data-eyebrow]")?.parentElement?.parentElement);
      const whyList = box(document.querySelector("#why ol"));
      const nodes = [...document.querySelectorAll("#approach .prog-node")].map((n) => box(n)!);
      const models = [...document.querySelectorAll("#working-together ul > li")].map((n) => box(n)!);
      const form = box(document.querySelector("#contact form")?.parentElement);
      trunk = null;
      branches = [];
      dots = [];
      if (!hero || !map || !why || nodes.length < 2 || !form) return;
      const n0 = nodes[0];
      const n1 = nodes[nodes.length - 1];
      const gL = W >= 1024 ? 24 : W >= 640 ? 16 : 10;
      const gR = W - gL;
      const cx = map.cx;

      if (W < 768) {
        trunk = route([
          [W * 0.5, hero.b - 6],
          [gR, hero.b - 6],
          [gR, why.t + 30],
          [gL, why.t + 30],
          [gL, n0.cy],
          [n0.cx, n0.cy],
          [n0.cx, n1.cy],
          [n0.cx, n1.b + 60],
          [gR, n1.b + 60],
          [gR, form.t - 30],
          [form.r - 28, form.t - 30],
          [form.r - 28, form.t],
        ]);
        dots = [[form.r - 28, form.t]];
      } else {
        const whyGap = whyText && whyList ? (whyText.r + whyList.l) / 2 : W * 0.44;
        const lx = W * 0.69;
        // Between the Solutions heading and its intro paragraph.
        const head = box(document.querySelector("#solutions h2")?.parentElement);
        const intro = box(document.querySelector("#solutions h2")?.parentElement?.nextElementSibling);
        const solGap = head && intro && intro.l > head.r ? (head.r + intro.l) / 2 : cx;
        const listTop = models.length ? models[0].t - 40 : n1.b + 160;
        trunk = route([
          [lx, hero.b - hero.h * 0.18],
          [lx, hero.b + 40],
          [solGap, hero.b + 40],
          [solGap, map.t - 56],
          [cx, map.t - 56],
          [cx, why.t + 48],
          [whyGap, why.t + 48],
          [whyGap, why.b - 56],
          [gL, why.b - 56],
          [gL, n0.cy],
          [gR, n1.cy],
          [gR, form.t - 56],
          [form.r - 48, form.t - 56],
          [form.r - 48, form.t],
        ]);
        // Four services, one system: the centre branches along the map's horizontal gap.
        const mid = map.t + map.h / 2;
        const spurL = route([[cx, mid], [map.l - 28, mid]]);
        const spurR = route([[cx, mid], [map.r + 28, mid]]);
        branches.push({ route: spurL, root: mid, end: true }, { route: spurR, root: mid, end: true });
        // Three engagement models: three short drops from one line above them.
        if (models.length === 3 && W >= 1024) {
          const xs = models.map((m, i) => (i === 0 ? m.l : m.l + 32));
          branches.push({ route: route([[gR, listTop], [xs[0], listTop], [xs[0], listTop + 26]]), root: listTop, end: true });
          for (const x of xs.slice(1)) branches.push({ route: route([[x, listTop], [x, listTop + 26]]), root: listTop, end: true });
        }
        dots = [[form.r - 48, form.t]];
      }

      rects = [];
      for (const id of ["solutions", "why", "approach", "working-together", "contact"]) {
        const sec = document.getElementById(id);
        if (!sec) continue;
        for (const el of sec.querySelectorAll(TEXT)) {
          const r = el.getBoundingClientRect();
          if (r.width && r.height) rects.push([r.left, r.top + sy, r.right, r.bottom + sy]);
        }
      }
      dirty = true;
      wake();
    };

    const paint = (st: PaintState) => {
      if (!on()) {
        if (!cleared) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          cleared = true;
        }
        return false;
      }
      cleared = false;
      if (!trunk) {
        build();
        if (!trunk) return false;
      }
      const sy = window.scrollY;
      if (!dirty && sy === lastY) return false;
      dirty = false;
      lastY = sy;
      const reachY = st.reduced ? Infinity : sy + H * 0.68;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(0, -sy);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // The full route, dormant.
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(150,180,230,0.09)";
      ctx.lineWidth = 1;
      ctx.stroke(trunk.path);
      for (const b of branches) ctx.stroke(b.route.path);

      // The lit route up to the scroll position.
      const drawn = drawnAt(trunk, reachY);
      if (drawn > 0) {
        ctx.strokeStyle = "rgba(110,160,255,0.6)";
        ctx.lineWidth = 1.4;
        ctx.setLineDash(drawn < trunk.len ? [drawn, trunk.len] : []);
        ctx.stroke(trunk.path);
      }
      ctx.setLineDash([]);
      for (const b of branches) {
        if (reachY < b.root) continue;
        const p = st.reduced ? 1 : Math.min(1, (reachY - b.root) / 220);
        ctx.strokeStyle = "rgba(110,160,255,0.5)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash(p < 1 ? [b.route.len * p, b.route.len] : []);
        ctx.stroke(b.route.path);
        if (p >= 1 && b.end) {
          const [ex, ey] = b.route.pts[b.route.pts.length - 1];
          ctx.fillStyle = "rgba(150,190,255,0.85)";
          ctx.beginPath();
          ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.setLineDash([]);
      for (const [x, y] of dots) {
        if (drawn < trunk.len) continue;
        ctx.fillStyle = "rgba(200,222,255,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Text stays clear.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.95)";
      for (const [l, t, r, b] of rects) {
        if (b < sy - 40 || t > sy + H + 40) continue;
        ctx.fillRect(l - 3, t - 2 - sy, r - l + 6, b - t + 4);
      }
      // The head of the lit route: a bright point with a soft light, beneath.
      if (drawn > 0 && drawn < trunk.len) {
        const [hx, hy0] = pointAt(trunk, drawn);
        const hy = hy0 - sy;
        ctx.globalCompositeOperation = "destination-over";
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 200);
        g.addColorStop(0, "rgba(54,123,250,0.12)");
        g.addColorStop(1, "rgba(54,123,250,0)");
        ctx.fillStyle = g;
        ctx.fillRect(hx - 200, hy - 200, 400, 400);
        ctx.globalCompositeOperation = "source-over";
        const c = ctx.createRadialGradient(hx, hy, 0, hx, hy, 10);
        c.addColorStop(0, "rgba(235,243,255,0.95)");
        c.addColorStop(0.35, "rgba(120,170,255,0.4)");
        c.addColorStop(1, "rgba(54,123,250,0)");
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(hx, hy, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      return false;
    };

    build();
    let t = 0;
    const rebuild = () => {
      cancelAnimationFrame(t);
      t = requestAnimationFrame(build);
    };
    const ro = new ResizeObserver(rebuild);
    ro.observe(main);
    window.addEventListener("resize", rebuild, { passive: true });
    const off = registerPainter(paint);
    return () => {
      off();
      ro.disconnect();
      cancelAnimationFrame(t);
      window.removeEventListener("resize", rebuild);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
