"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMediaQuery } from "@/components/mark/browser";
import { CAPABILITIES, WALKTHROUGH, type CapabilityId } from "@/config/solutions";

/*
 * Chapter 02 showcase: a conceptual connected system in operation, built from
 * real interface elements layered in CSS 3D (perspective, depth, shadows).
 * Information moves between them along connectors (CSS motion paths).
 * No WebGL: interface panes read sharper as HTML, and the hero already owns
 * the page's one 3D canvas.
 *
 * The walkthrough plays once when the stage scrolls into view (no looping),
 * can be replayed, and Build / Automate / Connect jump to their part of it.
 * Reduced motion: the finished state, no movement, controls still work.
 */

type PaneId = "inbox" | "process" | "app" | "alert";
type Side = "t" | "b" | "l" | "r";
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}
interface Layout {
  w: number;
  h: number;
  /** Base orientation of the scene (degrees). */
  rx: number;
  ry: number;
  panes: Record<PaneId, Box>;
  /** Connectors: from pane side (at fraction t) to pane side. */
  links: [PaneId, Side, number, PaneId, Side, number][];
}

// Art-directed compositions: a wide, layered scene, and a vertical zig-zag
// for phones (not the wide scene shrunk).
const WIDE: Layout = {
  w: 960,
  h: 520,
  rx: 9,
  ry: -9,
  panes: {
    inbox: { x: 40, y: 40, w: 300, h: 205, z: 0 },
    process: { x: 300, y: 205, w: 340, h: 196, z: 70 },
    app: { x: 600, y: 30, w: 320, h: 225, z: 30 },
    alert: { x: 600, y: 380, w: 300, h: 96, z: 95 },
  },
  links: [
    ["inbox", "b", 0.5, "process", "l", 0.42],
    ["process", "r", 0.4, "app", "b", 0.42],
    ["app", "b", 0.82, "alert", "t", 0.62],
  ],
};
const NARROW: Layout = {
  w: 360,
  h: 680,
  rx: 10,
  ry: 0,
  panes: {
    inbox: { x: 0, y: 0, w: 262, h: 150, z: 0 },
    process: { x: 82, y: 186, w: 278, h: 182, z: 50 },
    app: { x: 0, y: 404, w: 268, h: 150, z: 20 },
    alert: { x: 92, y: 590, w: 268, h: 88, z: 70 },
  },
  links: [
    ["inbox", "r", 0.7, "process", "t", 0.75],
    ["process", "l", 0.7, "app", "t", 0.25],
    ["app", "r", 0.7, "alert", "t", 0.75],
  ],
};

// Walkthrough phases: 0 revealed, 1 enquiry, 2 automate, 3 connect, 4 build, 5 done.
const SCHEDULE = [0, 600, 1700, 3300, 4800, 6400];
const PHASE_OF: Record<CapabilityId, number> = { automate: 2, connect: 3, build: 4 };
const FOCUS_AT: Record<number, CapabilityId> = { 2: "automate", 3: "connect", 4: "build" };
/** Which panes each capability is about (others dim while it is in focus). */
const INVOLVES: Record<CapabilityId, PaneId[]> = {
  automate: ["inbox", "process"],
  connect: ["process", "app"],
  build: ["app", "alert"],
};
/** The connector each capability lights (index into links). */
const LINK_OF: Record<CapabilityId, number> = { automate: 0, connect: 1, build: 2 };

function anchor(b: Box, side: Side, t: number): [number, number] {
  if (side === "t") return [b.x + b.w * t, b.y + 6];
  if (side === "b") return [b.x + b.w * t, b.y + b.h - 6];
  if (side === "l") return [b.x + 6, b.y + b.h * t];
  return [b.x + b.w - 6, b.y + b.h * t];
}
const NORMAL: Record<Side, [number, number]> = { t: [0, -1], b: [0, 1], l: [-1, 0], r: [1, 0] };

function linkPath(layout: Layout, i: number) {
  const [a, sa, ta, b, sb, tb] = layout.links[i];
  const p = anchor(layout.panes[a], sa, ta);
  const q = anchor(layout.panes[b], sb, tb);
  const k = Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.5;
  const c1 = [p[0] + NORMAL[sa][0] * k, p[1] + NORMAL[sa][1] * k];
  const c2 = [q[0] + NORMAL[sb][0] * k, q[1] + NORMAL[sb][1] * k];
  return `M ${p[0]} ${p[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${q[0]} ${q[1]}`;
}

export default function ConnectedSystem() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Default (server render, no JS, reduced motion): the finished state.
  const [seen, setSeen] = useState(false);
  const [phase, setPhase] = useState(5);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<CapabilityId | null>(null);
  const [announce, setAnnounce] = useState(false);
  const [width, setWidth] = useState(0);

  const layout = width > 0 && width < 640 ? NARROW : WIDE;
  const scale = width > 0 ? Math.min(layout === NARROW ? 1.08 : 1.02, width / layout.w) : 0;
  // Room above the scene for the label/replay row, a little below it.
  const padTop = layout === NARROW ? 58 : 52;
  const padBottom = 24;
  const s = scale || 0.8;
  const stageH = Math.round(layout.h * s + padTop + padBottom);
  // The scene scales about its centre; place its visual top at padTop.
  const worldTop = padTop - (layout.h - layout.h * s) / 2;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = useCallback(() => {
    clearTimers();
    setSelected(null);
    setSeen(true);
    if (reduced) {
      setPhase(5);
      return;
    }
    setPlaying(true);
    setPhase(0);
    SCHEDULE.forEach((at, p) => {
      if (p === 0) return;
      timers.current.push(
        setTimeout(() => {
          setPhase(p);
          if (p === 5) setPlaying(false);
        }, at),
      );
    });
  }, [reduced]);

  // Size: the scene is laid out in its own units and scaled to fit.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Play once when the stage comes into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        play();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimers();
    };
  }, [play]);

  // Gentle dimensional pointer response (desktop, wide layout only).
  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world || reduced || !finePointer || layout !== WIDE) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      world.style.setProperty("--tilt-x", `${cur.y.toFixed(3)}deg`);
      world.style.setProperty("--tilt-y", `${cur.x.toFixed(3)}deg`);
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 7;
      target.y = -((e.clientY - r.top) / r.height - 0.5) * 5;
      kick();
    };
    const onLeave = () => {
      target.x = target.y = 0;
      kick();
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, finePointer, layout]);

  const choose = (id: CapabilityId) => {
    clearTimers();
    setSeen(true);
    setPlaying(false);
    setAnnounce(true);
    setSelected(id);
    setPhase(PHASE_OF[id]);
  };

  const focus: CapabilityId | null = selected ?? (playing ? (FOCUS_AT[phase] ?? null) : null);
  const caption =
    phase <= 1
      ? WALKTHROUGH.steps.enquiry
      : phase >= 5
        ? WALKTHROUGH.steps.done
        : WALKTHROUGH.steps[FOCUS_AT[phase]];
  const active = focus ?? (phase >= 2 && phase <= 4 ? FOCUS_AT[phase] : null);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
      {/* Build / Automate / Connect */}
      <div className="order-2 lg:order-1 lg:col-span-4">
        <div role="group" aria-label="Explore the walkthrough by capability" className="flex gap-2 lg:flex-col lg:gap-1">
          {CAPABILITIES.map((c) => {
            const on = active === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected === c.id}
                onClick={() => choose(c.id)}
                className={`group relative flex-1 rounded-2xl border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft lg:rounded-none lg:border-0 lg:border-l-2 lg:px-6 lg:py-4 ${
                  on
                    ? "border-accent/50 bg-accent/[0.08] lg:border-accent lg:bg-transparent"
                    : "border-white/10 hover:border-white/25 lg:border-white/10"
                }`}
              >
                <span
                  className={`block text-center text-lg font-semibold tracking-[-0.02em] transition-colors duration-300 lg:text-left lg:text-[2.25rem] lg:leading-none ${
                    on ? "text-foreground" : "text-muted group-hover:text-foreground"
                  }`}
                >
                  {c.name}
                </span>
                <span className="sr-only lg:not-sr-only lg:mt-2.5 lg:block lg:text-base lg:leading-relaxed lg:text-muted">
                  {c.line}
                </span>
                <span className="sr-only lg:not-sr-only lg:mt-1 lg:block lg:text-sm lg:text-subtle">{c.covers}</span>
              </button>
            );
          })}
        </div>
        {/* Phones and tablets: the chosen capability's line, one at a time. */}
        <p className="mt-4 min-h-[3.25rem] text-center text-[0.9375rem] leading-relaxed text-muted lg:hidden">
          {active ? (
            <>
              <span className="text-foreground">{CAPABILITIES.find((c) => c.id === active)!.covers}.</span>{" "}
              {CAPABILITIES.find((c) => c.id === active)!.line}
            </>
          ) : (
            "Build, automate and connect: tap one to see its part."
          )}
        </p>
      </div>

      {/* The stage */}
      <div className="order-1 lg:order-2 lg:col-span-8">
        <div
          ref={stageRef}
          className="sol-stage relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[radial-gradient(ellipse_80%_70%_at_55%_45%,#0f1a2e_0%,#0a1120_60%,#090f1b_100%)]"
          style={{ height: stageH }}
          data-seen={seen}
        >
          <p className="sr-only">{WALKTHROUGH.summary}</p>

          {/* Light pooled under the scene. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] bottom-[6%] top-[35%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(54_123_250/0.16),transparent_70%)] blur-2xl"
          />

          <div aria-hidden className="absolute inset-0 [perspective:1700px] [perspective-origin:50%_35%]">
            <div
              ref={worldRef}
              className="absolute left-1/2 [transform-style:preserve-3d]"
              style={
                {
                  width: layout.w,
                  height: layout.h,
                  marginLeft: -layout.w / 2,
                  top: worldTop,
                  opacity: scale ? 1 : 0,
                  transformOrigin: "50% 50%",
                  transform: `scale(${scale || 0.8}) rotateX(calc(${layout.rx}deg + var(--tilt-x, 0deg))) rotateY(calc(${layout.ry}deg + var(--tilt-y, 0deg)))`,
                } as CSSProperties
              }
            >
              <Links layout={layout} focus={focus} phase={phase} playing={playing} reduced={reduced} />
              {(Object.keys(layout.panes) as PaneId[]).map((id, i) => (
                <Pane
                  key={id}
                  id={id}
                  index={i}
                  box={layout.panes[id]}
                  narrow={layout === NARROW}
                  phase={phase}
                  seen={seen}
                  dim={focus !== null && !INVOLVES[focus].includes(id)}
                  lift={focus !== null && INVOLVES[focus].includes(id)}
                />
              ))}
            </div>
          </div>

          {/* Flat overlay: honest label and replay. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
            <p className="text-xs text-subtle sm:text-[0.8125rem]">{WALKTHROUGH.label}</p>
            <button
              type="button"
              onClick={play}
              className="pointer-events-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-[#0b1322]/80 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Replay
            </button>
          </div>
        </div>
        <p
          aria-live={announce ? "polite" : "off"}
          className="mt-4 min-h-[1.5rem] text-center text-[0.9375rem] text-foreground/85 lg:text-left"
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

function Links({
  layout,
  focus,
  phase,
  playing,
  reduced,
}: {
  layout: Layout;
  focus: CapabilityId | null;
  phase: number;
  playing: boolean;
  reduced: boolean;
}) {
  const paths = layout.links.map((_, i) => linkPath(layout, i));
  return (
    <>
      <svg className="absolute inset-0 overflow-visible" width={layout.w} height={layout.h} fill="none">
        {paths.map((d, i) => {
          const lit = focus !== null && LINK_OF[focus] === i;
          return (
            <g key={i}>
              <path d={d} stroke="rgb(110 160 255 / 0.16)" strokeWidth={1.5} />
              <path
                d={d}
                stroke="rgb(110 165 255)"
                strokeWidth={1.75}
                strokeLinecap="round"
                className={`transition-opacity duration-500 ${lit && playing && !reduced ? "sol-flow" : ""}`}
                style={{ opacity: lit ? 0.85 : phase >= 5 ? 0.28 : 0 }}
                strokeDasharray={lit && playing && !reduced ? undefined : "none"}
              />
            </g>
          );
        })}
      </svg>
      {/* Information moving: one packet per connector, while its step plays. */}
      {playing &&
        !reduced &&
        paths.map((d, i) =>
          FOCUS_AT[phase] && LINK_OF[FOCUS_AT[phase]] === i ? (
            <span
              key={`${i}-${phase}`}
              className="sol-packet absolute left-0 top-0 flex items-center"
              style={{ offsetPath: `path('${d}')`, offsetRotate: "auto", offsetAnchor: "100% 50%" }}
            >
              <span className="h-[3px] w-12 rounded-full bg-gradient-to-r from-transparent to-[#7fb0ff]" />
              <span className="h-3 w-3 rounded-full bg-[#cfe0ff] shadow-[0_0_16px_5px_rgba(70,130,255,0.75)]" />
            </span>
          ) : null,
        )}
    </>
  );
}

const SKELETON = "rounded-full bg-white/[0.07]";

function Pane({
  id,
  index,
  box,
  narrow,
  phase,
  seen,
  dim,
  lift,
}: {
  id: PaneId;
  index: number;
  box: Box;
  narrow: boolean;
  phase: number;
  seen: boolean;
  dim: boolean;
  lift: boolean;
}) {
  const z = box.z + (lift ? 26 : 0) + (dim ? -12 : 0);
  // The team alert only exists once its step happens (no empty frame before).
  const present = id !== "alert" || phase >= 4;
  const style: CSSProperties = {
    left: box.x,
    top: box.y,
    width: box.w,
    height: box.h,
    transform: `translate3d(0, ${seen && present ? 0 : 46}px, ${z}px)`,
    opacity: seen && present ? (dim ? 0.38 : 1) : 0,
    transitionDelay: seen && phase === 0 ? `${index * 110}ms` : "0ms",
  };
  const frame = `sol-pane absolute flex flex-col overflow-hidden rounded-2xl border bg-[linear-gradient(180deg,#121c30_0%,#0d1526_100%)] transition-[transform,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    lift
      ? "border-accent/40 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85),0_0_44px_-8px_rgba(54,123,250,0.35)]"
      : "border-white/[0.09] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85)]"
  }`;

  if (id === "inbox") {
    const fresh = phase >= 1;
    return (
      <div className={frame} style={style}>
        <PaneHeader icon={<MailIcon />} title="Inbox" />
        <div className="flex flex-1 flex-col gap-2.5 px-4 pt-1">
          <div
            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500 ${
              fresh ? "border-accent/30 bg-accent/[0.08] opacity-100" : "-translate-y-2 border-transparent opacity-0"
            }`}
          >
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(54,123,250,0.6)]" />
            <span className="min-w-0">
              <span className="block text-[13px] font-medium text-foreground">{WALKTHROUGH.enquiry.from}</span>
              <span className="block text-[13px] leading-snug text-muted">{WALKTHROUGH.enquiry.text}</span>
            </span>
          </div>
          {Array.from({ length: narrow ? 1 : 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-1">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white/10" />
              <span className="flex-1 space-y-1.5">
                <span className={`block h-2 w-1/3 ${SKELETON}`} />
                <span className={`block h-2 w-4/5 ${SKELETON}`} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "process") {
    const on = phase >= 2;
    const [request, order, date] = WALKTHROUGH.extracted;
    const mark = (text: string, i: number) => (
      <mark
        className="rounded bg-transparent px-0.5 text-inherit transition-colors duration-500"
        style={{
          backgroundColor: on ? "rgb(54 123 250 / 0.22)" : "transparent",
          color: on ? "#cfe0ff" : undefined,
          transitionDelay: on ? `${200 + i * 220}ms` : "0ms",
        }}
      >
        {text}
      </mark>
    );
    return (
      <div className={frame} style={style}>
        <PaneHeader icon={<SparkIcon />} title="Understanding the request" accent />
        <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-1">
          <p className={`${narrow ? "text-[14px]" : "text-[16px]"} leading-snug text-foreground/90`}>
            &ldquo;Can we {mark("move", 0)} order {mark("#4821", 1)} to {mark("Friday", 2)}?&rdquo;
          </p>
          <div className="flex flex-wrap gap-2">
            {[request, order, date].map((v, i) => (
              <span
                key={v}
                className="rounded-lg border border-accent/30 bg-[#0f1d36] px-2.5 py-1 font-mono text-[12.5px] text-[#cfe0ff] transition-all duration-500"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(6px)",
                  transitionDelay: on ? `${800 + i * 160}ms` : "0ms",
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "app") {
    const incoming = phase >= 3;
    const updated = phase >= 4;
    const { order } = WALKTHROUGH;
    return (
      <div className={frame} style={style}>
        <PaneHeader icon={<GridIcon />} title="Operations · Orders" />
        <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3">
          {Array.from({ length: narrow ? 1 : 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
              <span className={`h-2 w-12 ${SKELETON}`} />
              <span className={`h-2 w-8 ${SKELETON}`} />
              <span className={`ml-auto h-2 w-14 ${SKELETON}`} />
            </div>
          ))}
          <div
            className={`flex items-center gap-3 rounded-lg border px-2 py-2 text-[13px] transition-colors duration-500 ${
              incoming ? "border-accent/35 bg-accent/[0.09]" : "border-transparent"
            }`}
          >
            <span className="font-mono text-foreground">{order.id}</span>
            <span className="relative inline-flex w-9 justify-center font-mono">
              <span className={`transition-opacity duration-500 ${updated ? "opacity-0" : "text-muted"}`}>{order.before}</span>
              <span
                className={`absolute transition-opacity duration-500 ${updated ? "text-[#cfe0ff] opacity-100" : "opacity-0"}`}
              >
                {order.after}
              </span>
            </span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[11.5px] transition-colors duration-500 ${
                updated ? "bg-accent/25 text-[#cfe0ff]" : "bg-white/[0.06] text-muted"
              }`}
            >
              {updated ? "Updated" : incoming ? "Receiving" : "Scheduled"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Team alert (the frame itself arrives with its step; see `present`).
  const { alert } = WALKTHROUGH;
  return (
    <div className={frame} style={style}>
      <div
        className="flex h-full items-center gap-3 px-4"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[#cfe0ff]">
          <BellIcon />
        </span>
        <span className="min-w-0">
          <span className="block text-[12px] text-subtle">{alert.team}</span>
          <span className="block text-[14px] font-medium leading-snug text-foreground">{alert.text}</span>
          <span className="block text-[12px] text-muted">{alert.sub} ✓</span>
        </span>
      </div>
    </div>
  );
}

function PaneHeader({ icon, title, accent = false }: { icon: ReactNode; title: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-4 pb-2.5 pt-3.5">
      <span className={accent ? "text-accent-soft" : "text-subtle"}>{icon}</span>
      <span className="text-[13px] font-medium text-foreground/85">{title}</span>
    </div>
  );
}

const iconProps = { viewBox: "0 0 16 16", className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: 1.4 };
function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="3.5" width="12" height="9" rx="2" />
      <path d="m2.8 4.8 5.2 4 5.2-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 2.2 9.3 6.7 13.8 8 9.3 9.3 8 13.8 6.7 9.3 2.2 8l4.5-1.3L8 2.2Z" strokeLinejoin="round" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
      <path d="M2.5 6.5h11M6.5 6.5v7" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4.2 11V7.4a3.8 3.8 0 0 1 7.6 0V11l1 1.2H3.2l1-1.2ZM6.6 13.4a1.5 1.5 0 0 0 2.8 0" strokeLinejoin="round" />
    </svg>
  );
}
