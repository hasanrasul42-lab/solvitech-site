/**
 * The Solvitech Field -- one site-level runtime for the living environment.
 *
 * One passive pointer listener and one requestAnimationFrame loop drive:
 *
 *  1. The cursor trail: a fine luminous filament drawn on a single fixed
 *     Canvas 2D layer. Its tip sits exactly at the pointer (no lag); every
 *     raw pointer sample (coalesced events) from the last ~0.55 s is drawn as
 *     a smooth, tapering spline, so fast movement leaves a longer, brighter
 *     trail and the tail dissolves on its own.
 *  2. Environmental response: geometry marked `data-react` (inside registered
 *     fields) samples its own shape into page coordinates once per layout. Each
 *     frame, elements near the trail gain energy (`--e`, 0..1) that decays smoothly; CSS turns energy into
 *     light, activation and small movements. Strong energy sets `data-live`,
 *     which sends a pulse along the path.
 *  3. Canvas painters (registerPainter): the hero flow and the homepage's
 *     continuous flow draw on this same frame, with the trail, damped pointer
 *     and timing passed in, so the whole site runs one loop.
 *
 * Fields also receive --tx/--ty (damped pointer, -1..1) for their depth layers.
 *
 * The loop only runs while something is moving (pointer, trail decay, energy
 * decay, scroll) and stops when the tab is hidden. Nothing here reads layout on
 * pointer moves: rects are measured on scroll/resize only. Touch devices get no
 * trail (no cursor) but keep the scroll-driven drawing. With reduced motion,
 * nothing animates: everything is drawn complete and still.
 */

type Sample = { x: number; y: number };
type Reactive = { el: Element; pts: Sample[]; e: number; live: boolean; chain: Element | null };
type Field = { el: HTMLElement; visible: boolean; reactive: Reactive[] };

/** A trail point: client coords, time (ms), speed (px/ms). */
export type TrailPoint = { x: number; y: number; t: number; v: number };
export type PaintState = {
  now: number;
  dt: number;
  /** Damped pointer, -1..1 (0 when the trail is off). */
  tx: number;
  ty: number;
  trail: readonly TrailPoint[];
  trailMs: number;
  interactive: boolean;
  reduced: boolean;
};
/** Canvas painters (e.g. the hero flow) draw on the shared frame; return true while animating. */
type Painter = (s: PaintState) => boolean;

const painters = new Set<Painter>();
const fields = new Set<Field>();
let observer: IntersectionObserver | null = null;
let started = false;
let trailOn = false;
let reduced = false;
let raf = 0;
let last = 0;
let hidden = false;

// Pointer (client coords) and the damped follower.
let px = 0;
let py = 0;
// Parallax pointer for depth layers.
let sx = 0;
let sy = 0;
let scrolled = true;
let layoutDirty = true;

/** Trail history: page-independent client coords, with birth time (ms). */
const pts: TrailPoint[] = [];
const TRAIL_MS = 560;
const MAX_PTS = 96;
const PARALLAX = 9;
const REACH = 150; // px: how far the trail's influence extends

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let cw = 0;
let ch = 0;

// ---------------------------------------------------------------------------

function request() {
  if (!raf && !hidden && started) raf = requestAnimationFrame(frame);
}

function sizeCanvas() {
  if (!canvas || !ctx) return;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cw = window.innerWidth;
  ch = window.innerHeight;
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "fld-trail";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  sizeCanvas();
}

/** Re-measure reactive geometry in page coordinates. */
function measure() {
  layoutDirty = false;
  const scrollY = window.scrollY;
  for (const f of fields) {
    for (const r of f.reactive) {
      const el = r.el as SVGGraphicsElement;
      if (!(el instanceof SVGElement)) {
        // A DOM element (a panel, a stage marker): sample its outline.
        const b = (el as Element).getBoundingClientRect();
        const out: Sample[] = [];
        const nx = Math.max(1, Math.round(b.width / 80));
        const ny = Math.max(1, Math.round(b.height / 80));
        for (let i = 0; i <= nx; i++) {
          out.push({ x: b.left + (b.width * i) / nx, y: b.top + scrollY }, { x: b.left + (b.width * i) / nx, y: b.bottom + scrollY });
        }
        for (let i = 1; i < ny; i++) {
          out.push({ x: b.left, y: b.top + (b.height * i) / ny + scrollY }, { x: b.right, y: b.top + (b.height * i) / ny + scrollY });
        }
        r.pts = out;
        continue;
      }
      const path = (el.matches("path") ? el : el.querySelector("path")) as SVGPathElement | null;
      const m = path?.getScreenCTM();
      if (!path || !m) {
        r.pts = [];
        continue;
      }
      let len = 0;
      try {
        len = path.getTotalLength();
      } catch {
        len = 0;
      }
      // Path length in user units is not screen length; sample roughly every ~40px on screen.
      const scale = Math.hypot(m.a, m.b) || 1;
      const n = Math.max(1, Math.min(28, Math.round((len * scale) / 40)));
      const out: Sample[] = [];
      for (let i = 0; i <= n; i++) {
        const p = path.getPointAtLength((len * i) / n);
        out.push({ x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f + scrollY });
      }
      r.pts = out;
    }
  }
}

/** Energise reactive geometry near the trail. */
function react(dt: number): boolean {
  const scrollY = window.scrollY;
  // Sources in page coords: the newest trail points (sparse).
  const src: { x: number; y: number; w: number; r: number }[] = [];
  const now = performance.now();
  for (let i = pts.length - 1; i >= 0 && src.length < 6; i -= 3) {
    const p = pts[i];
    const life = 1 - (now - p.t) / TRAIL_MS;
    if (life <= 0) break;
    src.push({ x: p.x, y: p.y + scrollY, w: life * Math.min(1, 0.35 + p.v / 1.4), r: REACH });
  }

  let active = false;
  const up = 1 - Math.exp(-dt * 40);
  const down = 1 - Math.exp(-dt * 2.2);
  for (const f of fields) {
    if (!f.visible) continue;
    let before: Reactive | null = null;
    for (const r of f.reactive) {
      let target = 0;
      // Sequenced activation: energy carries on to the next shape in a chain.
      if (r.chain && before && before.chain === r.chain) target = before.e * 0.9;
      before = r;
      if (src.length) {
        for (const s of src) {
          for (const p of r.pts) {
            const dx = p.x - s.x;
            const dy = p.y - s.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < s.r * s.r) {
              const k = 1 - Math.sqrt(d2) / s.r;
              const v = k * k * (3 - 2 * k) * s.w;
              if (v > target) target = v;
            }
          }
        }
      }
      const prev = r.e;
      r.e += (target - r.e) * (target > r.e ? up : down);
      if (r.e < 0.004) r.e = 0;
      if (Math.abs(r.e - prev) > 0.003 || (r.e === 0 && prev !== 0)) {
        (r.el as HTMLElement).style.setProperty("--e", r.e.toFixed(3));
      }
      const live = r.e > 0.5;
      if (live !== r.live) {
        r.live = live;
        if (live) r.el.setAttribute("data-live", "");
        else r.el.removeAttribute("data-live");
      }
      if (r.e > 0) active = true;
    }
  }
  return active;
}

function drawTrail(now: number) {
  if (!ctx) return;
  ctx.clearRect(0, 0, cw, ch);
  // Drop expired points.
  while (pts.length && now - pts[0].t > TRAIL_MS) pts.shift();
  const n = pts.length;
  if (n < 2) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // Two passes: a soft blue halo, then a fine white-blue core. The path is a
  // Catmull-Rom spline through the raw pointer samples, so it stays smooth at
  // any speed; each segment tapers and fades with age.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const age = (now - p2.t) / TRAIL_MS;
      const life = Math.max(0, 1 - age);
      const pos = (i + 1) / (n - 1);
      // Ease-out fade: the newest part is crisp, the tail dissolves.
      const k = life * life * (0.3 + 0.7 * pos);
      if (k < 0.01) continue;
      const speed = Math.min(1, p2.v / 1.4);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.bezierCurveTo(
        p1.x + (p2.x - p0.x) / 6,
        p1.y + (p2.y - p0.y) / 6,
        p2.x - (p3.x - p1.x) / 6,
        p2.y - (p3.y - p1.y) / 6,
        p2.x,
        p2.y,
      );
      if (pass === 0) {
        ctx.strokeStyle = `rgba(54,123,250,${(0.18 * k * (0.45 + speed)).toFixed(3)})`;
        ctx.lineWidth = 1 + 7 * k;
      } else {
        ctx.strokeStyle = `rgba(${150 + ((90 * pos) | 0)},${190 + ((55 * pos) | 0)},255,${(0.9 * k).toFixed(3)})`;
        ctx.lineWidth = 0.6 + 1.4 * k;
      }
      ctx.stroke();
    }
  }
  // Leading point: a small, bright filament tip, exactly at the pointer.
  const tip = pts[n - 1];
  const life = Math.max(0, 1 - (now - tip.t) / TRAIL_MS);
  if (life > 0.02) {
    const g = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 9);
    g.addColorStop(0, `rgba(235,243,255,${(0.95 * life).toFixed(3)})`);
    g.addColorStop(0.35, `rgba(120,170,255,${(0.35 * life).toFixed(3)})`);
    g.addColorStop(1, "rgba(54,123,250,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 9, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Add a raw pointer sample (client coords, event time). */
function addPoint(x: number, y: number, t: number) {
  const last = pts[pts.length - 1];
  if (last) {
    const d = Math.hypot(x - last.x, y - last.y);
    if (d < 1.5) return;
    const v = d / Math.max(1, t - last.t);
    // Smooth the speed estimate a little so intensity doesn't flicker.
    pts.push({ x, y, t, v: last.v * 0.6 + v * 0.4 });
  } else {
    pts.push({ x, y, t, v: 0 });
  }
  if (pts.length > MAX_PTS) pts.shift();
}

function frame(now: number) {
  raf = 0;
  const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
  last = now;
  if (layoutDirty) measure();

  let moving = false;
  if (trailOn) {
    drawTrail(now);
    if (pts.length > 1) moving = true;
  }

  // Parallax pointer for depth layers.
  const kp = 1 - Math.exp(-dt * PARALLAX);
  sx += (px - sx) * kp;
  sy += (py - sy) * kp;
  const settling = trailOn && Math.abs(px - sx) + Math.abs(py - sy) > 0.5;
  if (trailOn) {
    const tx = ((sx / window.innerWidth) * 2 - 1).toFixed(4);
    const ty = ((sy / window.innerHeight) * 2 - 1).toFixed(4);
    for (const f of fields) {
      if (!f.visible) continue;
      f.el.style.setProperty("--tx", tx);
      f.el.style.setProperty("--ty", ty);
    }
  }

  let painting = false;
  if (painters.size) {
    const state: PaintState = {
      now,
      dt,
      tx: trailOn ? (sx / window.innerWidth) * 2 - 1 : 0,
      ty: trailOn ? (sy / window.innerHeight) * 2 - 1 : 0,
      trail: pts,
      trailMs: TRAIL_MS,
      interactive: trailOn,
      reduced,
    };
    for (const p of painters) if (p(state)) painting = true;
  }

  const wasScrolled = scrolled;
  scrolled = false;
  const energised = reduced ? false : react(dt);

  if (moving || settling || energised || painting || wasScrolled) request();
  else last = 0;
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    reduced = rm.matches;
    trailOn = fine.matches && !reduced;
    if (trailOn) ensureCanvas();
    if (canvas) canvas.style.display = trailOn ? "" : "none";
    if (!trailOn) pts.length = 0;
    for (const f of fields) f.el.dataset.pointer = trailOn ? "on" : "off";
    scrolled = true;
    request();
  };
  px = sx = window.innerWidth * 0.62;
  py = sy = window.innerHeight * 0.42;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      px = e.clientX;
      py = e.clientY;
      if (trailOn) {
        // Every intermediate sample the browser delivered since the last
        // event, so fast movements stay smooth curves instead of chords.
        const list = e.getCoalescedEvents?.() ?? [];
        if (list.length) for (const c of list) addPoint(c.clientX, c.clientY, c.timeStamp);
        else addPoint(px, py, e.timeStamp);
      }
      request();
    },
    { passive: true },
  );
  window.addEventListener(
    "scroll",
    () => {
      scrolled = true;
      request();
    },
    { passive: true },
  );
  window.addEventListener(
    "resize",
    () => {
      sizeCanvas();
      layoutDirty = true;
      scrolled = true;
      request();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
    if (hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    last = 0;
    if (!hidden) request();
  });
  // Late layout changes (fonts, images, client navigation) move geometry.
  new ResizeObserver(() => {
    layoutDirty = true;
    scrolled = true;
    request();
  }).observe(document.body);
  fine.addEventListener("change", update);
  rm.addEventListener("change", update);
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const f of fields) if (f.el === entry.target) f.visible = entry.isIntersecting;
      }
      request();
    },
    { rootMargin: "20% 0px" },
  );
  update();
}

/** Start the site-level runtime (cursor trail) without a field. */
export function startField() {
  start();
}

/** Register a field root; returns the cleanup function. */
export function registerField(el: HTMLElement) {
  start();
  const f: Field = {
    el,
    visible: false,
    reactive: [...el.querySelectorAll("[data-react]")].map((r) => ({ el: r, pts: [], e: 0, live: false, chain: r.closest("[data-chain]") })),
  };
  fields.add(f);
  el.dataset.pointer = trailOn ? "on" : "off";
  observer?.observe(el);
  layoutDirty = true;
  request();
  return () => {
    observer?.unobserve(el);
    fields.delete(f);
  };
}

/** Register a canvas painter on the shared frame; returns the cleanup function. */
export function registerPainter(p: Painter) {
  start();
  painters.add(p);
  request();
  return () => {
    painters.delete(p);
  };
}

/** Ask for a frame (e.g. after a painter's canvas was resized). */
export function wake() {
  request();
}
