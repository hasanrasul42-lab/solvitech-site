/**
 * The Solvitech Field -- one site-level runtime for the living environment.
 *
 * One passive pointer listener and one requestAnimationFrame loop drive:
 *
 *  1. The cursor trail: a fine luminous filament drawn on a single fixed
 *     Canvas 2D layer. A damped follower chases the pointer (inertia); its
 *     recent path is kept for ~0.7 s and drawn as a tapering ribbon, so fast
 *     movement leaves a longer, brighter trail and the tail decays on its own.
 *  2. Environmental response: geometry marked `data-react` (inside registered
 *     fields) samples its own shape into page coordinates once per layout. Each
 *     frame, elements near the trail -- or near the homepage spine's head --
 *     gain energy (`--e`, 0..1) that decays smoothly; CSS turns energy into
 *     light, activation and small movements. Strong energy sets `data-live`,
 *     which sends a pulse along the path.
 *  3. The homepage spine: one continuous path through every chapter (built by
 *     HomeSpine from the real layout). Its lit portion and luminous head follow
 *     the scroll position, so the path carries on through section boundaries.
 *
 * Fields also receive --tx/--ty (damped pointer, -1..1) for their depth layers.
 *
 * The loop only runs while something is moving (pointer, trail decay, energy
 * decay, scroll) and stops when the tab is hidden. Nothing here reads layout on
 * pointer moves: rects are measured on scroll/resize only. Touch devices get no
 * trail (no cursor) but keep the spine and its scroll-driven responses. With
 * reduced motion, nothing animates: the spine is drawn complete and still.
 */

type Sample = { x: number; y: number };
type Reactive = { el: Element; pts: Sample[]; e: number; live: boolean; chain: Element | null };
type Field = { el: HTMLElement; visible: boolean; reactive: Reactive[] };
type Spine = {
  el: SVGSVGElement;
  lit: SVGPathElement;
  glow: SVGPathElement;
  head: SVGGElement;
  /** page-y -> fraction of path length, sampled along the path. */
  table: { y: number; f: number; x: number; py: number }[];
  top: number;
};

const fields = new Set<Field>();
let spine: Spine | null = null;
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
let hx = 0;
let hy = 0;
let hasPointer = false;
// Parallax pointer for depth layers.
let sx = 0;
let sy = 0;
let scrolled = true;
let layoutDirty = true;

/** Trail history: page-independent client coords, with birth time (ms). */
const pts: { x: number; y: number; t: number; v: number }[] = [];
const TRAIL_MS = 720;
const MAX_PTS = 64;
const FOLLOW = 22; // follower stiffness: higher = tighter to the pointer
const PARALLAX = 6.5;
const REACH = 150; // px: how far the trail's influence extends
const SPINE_REACH = 210;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let cw = 0;
let ch = 0;
let spineHead: { x: number; y: number } | null = null;

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
  if (spine) buildSpineTable(spine);
}

function buildSpineTable(s: Spine) {
  const path = s.lit;
  const m = path.getScreenCTM();
  if (!m) return;
  let len = 0;
  try {
    len = path.getTotalLength();
  } catch {
    return;
  }
  const n = 240;
  const table: Spine["table"] = [];
  let maxY = -Infinity;
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength((len * i) / n);
    const y = m.b * p.x + m.d * p.y + m.f + window.scrollY;
    const x = m.a * p.x + m.c * p.y + m.e;
    // Keep the table monotonic in y (the spine runs downwards overall).
    maxY = Math.max(maxY, y);
    table.push({ y: maxY, f: i / n, x, py: y });
  }
  s.table = table;
}

function spineFraction(s: Spine, y: number) {
  const t = s.table;
  if (!t.length) return 1;
  if (y <= t[0].y) return 0;
  for (let i = 1; i < t.length; i++) {
    if (t[i].y >= y) {
      const a = t[i - 1];
      const b = t[i];
      const k = b.y === a.y ? 1 : (y - a.y) / (b.y - a.y);
      return a.f + (b.f - a.f) * k;
    }
  }
  return 1;
}

function updateSpine() {
  if (!spine) {
    spineHead = null;
    return;
  }
  const s = spine;
  if (reduced) {
    s.lit.style.strokeDashoffset = "0";
    s.glow.style.opacity = "0";
    s.head.style.opacity = "0";
    spineHead = null;
    return;
  }
  // The lit path reaches 62% down the viewport.
  const reachY = window.scrollY + window.innerHeight * 0.62;
  const f = spineFraction(s, reachY);
  s.lit.style.strokeDashoffset = (1 - f).toFixed(4);
  s.glow.style.strokeDashoffset = (0.045 - f).toFixed(4);
  // Head position: interpolate the sampled point at fraction f.
  const t = s.table;
  const i = Math.min(t.length - 1, Math.max(0, Math.round(f * (t.length - 1))));
  const pt = t[i];
  if (!pt) return;
  const visible = f > 0.002 && f < 0.998;
  s.head.style.opacity = visible ? "1" : "0";
  s.glow.style.opacity = visible ? "1" : "0";
  s.head.style.transform = `translate(${pt.x.toFixed(1)}px, ${(pt.py - s.top).toFixed(1)}px)`;
  spineHead = visible ? { x: pt.x, y: pt.py } : null;
}

/** Energise reactive geometry near the trail and the spine head. */
function react(dt: number): boolean {
  const scrollY = window.scrollY;
  // Sources in page coords: the newest trail points (sparse) and the spine head.
  const src: { x: number; y: number; w: number; r: number }[] = [];
  const now = performance.now();
  for (let i = pts.length - 1; i >= 0 && src.length < 6; i -= 3) {
    const p = pts[i];
    const life = 1 - (now - p.t) / TRAIL_MS;
    if (life <= 0) break;
    src.push({ x: p.x, y: p.y + scrollY, w: life * Math.min(1, 0.35 + p.v / 1.4), r: REACH });
  }
  if (spineHead) src.push({ x: spineHead.x, y: spineHead.y, w: 0.6, r: SPINE_REACH });

  let active = false;
  const up = 1 - Math.exp(-dt * 14);
  const down = 1 - Math.exp(-dt * 1.6);
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
      const live = r.e > 0.42;
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
  if (pts.length < 2) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const n = pts.length;
  // Two passes: a soft blue halo, then a fine white-blue core. Each segment
  // tapers with age, so the tail thins and fades out.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 1; i < n; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const life = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
      const pos = i / (n - 1);
      const k = life * life * (0.25 + 0.75 * pos);
      if (k < 0.01) continue;
      const speed = Math.min(1, b.v / 1.6);
      // Smooth curve through segment midpoints.
      const m0x = i > 1 ? (pts[i - 2].x + a.x) / 2 : a.x;
      const m0y = i > 1 ? (pts[i - 2].y + a.y) / 2 : a.y;
      const m1x = (a.x + b.x) / 2;
      const m1y = (a.y + b.y) / 2;
      ctx.beginPath();
      ctx.moveTo(m0x, m0y);
      ctx.quadraticCurveTo(a.x, a.y, m1x, m1y);
      if (pass === 0) {
        ctx.strokeStyle = `rgba(54, 123, 250, ${(0.16 * k * (0.5 + speed)).toFixed(3)})`;
        ctx.lineWidth = 7 * k + 1;
      } else {
        ctx.strokeStyle = `rgba(${Math.round(150 + 90 * pos)}, ${Math.round(190 + 55 * pos)}, 255, ${(0.85 * k).toFixed(3)})`;
        ctx.lineWidth = 0.6 + 1.3 * k;
      }
      ctx.stroke();
    }
  }
  // Leading point: a small, bright filament tip.
  const tip = pts[n - 1];
  const life = Math.max(0, 1 - (now - tip.t) / TRAIL_MS);
  if (life > 0.02) {
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
    g.addColorStop(0, `rgba(235, 243, 255, ${(0.95 * life).toFixed(3)})`);
    g.addColorStop(0.35, `rgba(120, 170, 255, ${(0.35 * life).toFixed(3)})`);
    g.addColorStop(1, "rgba(54, 123, 250, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(hx, hy, 9, 0, Math.PI * 2);
    ctx.fill();
  }
}

function frame(now: number) {
  raf = 0;
  const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
  last = now;
  if (layoutDirty) measure();

  let moving = false;
  if (trailOn) {
    // Damped follower: inertia without lag that feels heavy.
    const k = hasPointer ? 1 - Math.exp(-dt * FOLLOW) : 0;
    const ox = hx;
    const oy = hy;
    hx += (px - hx) * k;
    hy += (py - hy) * k;
    const dist = Math.hypot(hx - ox, hy - oy);
    if (dist > 0.15) {
      pts.push({ x: hx, y: hy, t: now, v: dist / Math.max(1, dt * 1000) });
      if (pts.length > MAX_PTS) pts.shift();
      moving = true;
    }
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

  if (scrolled) updateSpine();
  const wasScrolled = scrolled;
  scrolled = false;
  const energised = reduced ? false : react(dt);

  if (moving || settling || energised || wasScrolled) request();
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
  px = sx = hx = window.innerWidth * 0.62;
  py = sy = hy = window.innerHeight * 0.42;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      px = e.clientX;
      py = e.clientY;
      if (!hasPointer) {
        hasPointer = true;
        hx = px;
        hy = py;
      }
      request();
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    hasPointer = false;
  });
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

/** Register the homepage spine (see HomeSpine); call again after rebuilding its path. */
export function registerSpine(s: Omit<Spine, "table">) {
  start();
  spine = { ...s, table: [] };
  layoutDirty = true;
  scrolled = true;
  request();
  return () => {
    if (spine?.el === s.el) spine = null;
  };
}

/** The spine's path changed (relayout). */
export function spineChanged(top: number) {
  if (spine) spine.top = top;
  layoutDirty = true;
  scrolled = true;
  request();
}
