"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { EXISTING_JOBS, type JobRow, type Priority, type Scenario } from "./scenarios";

/*
 * The visual half of the prototype: a service desk application (the focus)
 * with the incoming request, a simulated triage step and a team notification
 * layered around it in CSS 3D. It renders whatever state it is given; the
 * state machine lives in SolutionsDemo.
 */

type PaneId = "request" | "triage" | "desk" | "notify";
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
  rx: number;
  ry: number;
  panes: Record<PaneId, Box>;
  links: [PaneId, Side, number, PaneId, Side, number][];
}

const WIDE: Layout = {
  w: 980,
  h: 580,
  rx: 8,
  ry: -8,
  panes: {
    request: { x: 10, y: 30, w: 300, h: 150, z: 30 },
    triage: { x: 645, y: 0, w: 285, h: 166, z: 80 },
    desk: { x: 170, y: 196, w: 560, h: 300, z: 40 },
    notify: { x: 585, y: 470, w: 345, h: 92, z: 110 },
  },
  links: [
    ["request", "r", 0.5, "triage", "l", 0.55],
    ["triage", "b", 0.45, "desk", "r", 0.28],
    ["desk", "r", 0.78, "notify", "t", 0.7],
  ],
};
const NARROW: Layout = {
  w: 360,
  h: 672,
  rx: 8,
  ry: 0,
  panes: {
    request: { x: 0, y: 0, w: 318, h: 132, z: 30 },
    triage: { x: 42, y: 156, w: 318, h: 140, z: 70 },
    desk: { x: 0, y: 322, w: 360, h: 230, z: 40 },
    notify: { x: 26, y: 578, w: 334, h: 94, z: 90 },
  },
  links: [
    ["request", "r", 0.72, "triage", "t", 0.86],
    ["triage", "l", 0.72, "desk", "t", 0.14],
    ["desk", "r", 0.82, "notify", "t", 0.86],
  ],
};

/** Step (1-5) at which each connector carries information, and the pane in focus per step. */
const LINK_STEP = [2, 4, 5];
const FOCUS_PANE: Record<number, PaneId> = { 1: "request", 2: "triage", 3: "triage", 4: "desk", 5: "notify" };

const NORMAL: Record<Side, [number, number]> = { t: [0, -1], b: [0, 1], l: [-1, 0], r: [1, 0] };
function anchor(b: Box, side: Side, t: number): [number, number] {
  if (side === "t") return [b.x + b.w * t, b.y + 6];
  if (side === "b") return [b.x + b.w * t, b.y + b.h - 6];
  if (side === "l") return [b.x + 6, b.y + b.h * t];
  return [b.x + b.w - 6, b.y + b.h * t];
}
function linkPath(layout: Layout, i: number) {
  const [a, sa, ta, b, sb, tb] = layout.links[i];
  const p = anchor(layout.panes[a], sa, ta);
  const q = anchor(layout.panes[b], sb, tb);
  const k = Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.45;
  return `M ${p[0]} ${p[1]} C ${p[0] + NORMAL[sa][0] * k} ${p[1] + NORMAL[sa][1] * k}, ${q[0] + NORMAL[sb][0] * k} ${
    q[1] + NORMAL[sb][1] * k
  }, ${q[0]} ${q[1]}`;
}

export interface StageProps {
  scenario: Scenario;
  /** 0 = ready (not run), 1-5 = steps completed so far. */
  step: number;
  running: boolean;
  reduced: boolean;
  finePointer: boolean;
}

export default function DemoStage({ scenario, step, running, reduced, finePointer }: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const layout = width > 0 && width < 640 ? NARROW : WIDE;
  const s = width > 0 ? Math.min(layout === NARROW ? 1.08 : 1.02, width / layout.w) : 0.8;
  const padTop = layout === NARROW ? 54 : 56;
  const padBottom = 26;
  const stageH = Math.round(layout.h * s + padTop + padBottom);
  const worldTop = padTop - (layout.h - layout.h * s) / 2;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Restrained pointer response (desktop, wide composition only).
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
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      target.y = -((e.clientY - r.top) / r.height - 0.5) * 4;
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

  const focus = running || step === 5 ? (FOCUS_PANE[step] ?? null) : null;
  const paths = layout.links.map((_, i) => linkPath(layout, i));
  const narrow = layout === NARROW;

  return (
    <div
      ref={stageRef}
      aria-hidden
      className="demo-stage relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,#0f1a2e_0%,#0a1120_60%,#090f1b_100%)]"
      style={{ height: stageH }}
    >
      <div className="pointer-events-none absolute inset-x-[8%] bottom-[4%] top-[30%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(54_123_250/0.14),transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 [perspective:1700px] [perspective-origin:50%_30%]">
        <div
          ref={worldRef}
          className="absolute left-1/2 [transform-style:preserve-3d]"
          style={
            {
              width: layout.w,
              height: layout.h,
              marginLeft: -layout.w / 2,
              top: worldTop,
              opacity: width ? 1 : 0,
              transformOrigin: "50% 50%",
              transform: `scale(${s}) rotateX(calc(${layout.rx}deg + var(--tilt-x, 0deg))) rotateY(calc(${layout.ry}deg + var(--tilt-y, 0deg)))`,
            } as CSSProperties
          }
        >
          <svg className="absolute inset-0 overflow-visible" width={layout.w} height={layout.h} fill="none">
            {paths.map((d, i) => {
              const reached = step >= LINK_STEP[i];
              const live = running && step === LINK_STEP[i] && !reduced;
              return (
                <g key={i}>
                  <path d={d} stroke="rgb(110 160 255 / 0.14)" strokeWidth={1.5} />
                  <path
                    d={d}
                    stroke="rgb(110 165 255)"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    className={`transition-opacity duration-500 ${live ? "sol-flow" : ""}`}
                    style={{ opacity: live ? 0.9 : reached ? 0.35 : 0 }}
                  />
                </g>
              );
            })}
          </svg>
          {running &&
            !reduced &&
            paths.map((d, i) =>
              step === LINK_STEP[i] ? (
                <span
                  key={`${i}-${step}-${scenario.id}`}
                  className="sol-packet absolute left-0 top-0 flex items-center"
                  style={{ offsetPath: `path('${d}')`, offsetRotate: "auto", offsetAnchor: "100% 50%" }}
                >
                  <span className="h-[3px] w-12 rounded-full bg-gradient-to-r from-transparent to-[#7fb0ff]" />
                  <span className="h-3 w-3 rounded-full bg-[#cfe0ff] shadow-[0_0_16px_5px_rgba(70,130,255,0.75)]" />
                </span>
              ) : null,
            )}

          <Pane box={layout.panes.request} focus={focus === "request"} visible>
            <RequestCard scenario={scenario} sent={step >= 1} />
          </Pane>
          <Pane box={layout.panes.triage} focus={focus === "triage"} visible>
            <TriageCard scenario={scenario} step={step} />
          </Pane>
          <Pane box={layout.panes.desk} focus={focus === "desk"} visible>
            <ServiceDesk scenario={scenario} step={step} narrow={narrow} />
          </Pane>
          <Pane box={layout.panes.notify} focus={focus === "notify"} visible={step >= 5}>
            <Notification scenario={scenario} />
          </Pane>
        </div>
      </div>
      <p className="pointer-events-none absolute left-4 top-4 text-xs text-subtle sm:left-5 sm:top-5 sm:text-[0.8125rem]">
        Simulated example &middot; runs in your browser
      </p>
    </div>
  );
}

function Pane({ box, focus, visible, children }: { box: Box; focus: boolean; visible: boolean; children: ReactNode }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-2xl border bg-[linear-gradient(180deg,#121c30_0%,#0d1526_100%)] transition-[transform,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        focus
          ? "border-accent/45 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85),0_0_44px_-8px_rgba(54,123,250,0.38)]"
          : "border-white/[0.09] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.85)]"
      }`}
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: visible ? 1 : 0,
        transform: `translate3d(0, ${visible ? 0 : 18}px, ${box.z + (focus ? 24 : 0)}px)`,
      }}
    >
      {children}
    </div>
  );
}

function Header({ icon, title, right }: { icon: ReactNode; title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 pb-2 pt-3.5">
      <span className="text-subtle">{icon}</span>
      <span className="text-[13px] font-medium text-foreground/85">{title}</span>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

function RequestCard({ scenario, sent }: { scenario: Scenario; sent: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <Header
        icon={<MailIcon />}
        title="New request"
        right={
          <span
            className={`rounded-full px-2 py-0.5 text-[11.5px] transition-colors duration-500 ${
              sent ? "bg-accent/20 text-[#cfe0ff]" : "bg-white/[0.06] text-muted"
            }`}
          >
            {sent ? "Received" : "Ready to send"}
          </span>
        }
      />
      <div className="px-4 pb-4">
        <p className="text-[12.5px] text-subtle">{scenario.request.from}</p>
        <p className="mt-1 text-[15px] leading-snug text-foreground">{scenario.request.text}</p>
      </div>
    </div>
  );
}

const PRIORITY_STYLE: Record<Priority, string> = {
  urgent: "bg-[#ff9d5c]/15 text-[#ffc08f] ring-1 ring-[#ff9d5c]/30",
  routine: "bg-white/[0.07] text-foreground/80 ring-1 ring-white/10",
  change: "bg-accent/20 text-[#cfe0ff] ring-1 ring-accent/35",
};

function TriageCard({ scenario, step }: { scenario: Scenario; step: number }) {
  const { triage } = scenario;
  const reveal = (on: boolean, delay = 0): CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : "translateY(6px)",
    transitionDelay: on ? `${delay}ms` : "0ms",
  });
  return (
    <div className="flex h-full flex-col">
      <Header
        icon={<SparkIcon />}
        title="AI triage"
        right={<span className="text-[11.5px] text-subtle">simulated</span>}
      />
      <div className="relative flex-1 px-4 pb-3">
        <p
          className="absolute inset-x-4 top-1 text-[14px] text-subtle transition-opacity duration-300"
          style={{ opacity: step < 2 ? 1 : 0 }}
        >
          Waiting for a request&hellip;
        </p>
        <div className="space-y-2.5">
          <p className="text-[15px] font-medium text-foreground transition-all duration-500" style={reveal(step >= 2)}>
            {triage.type}
          </p>
          <div className="flex flex-wrap items-center gap-2 transition-all duration-500" style={reveal(step >= 3)}>
            <span className={`rounded-full px-2.5 py-0.5 text-[12.5px] font-medium ${PRIORITY_STYLE[triage.priority]}`}>
              {triage.priorityLabel}
            </span>
            <span className="text-[13.5px] text-muted">{triage.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceDesk({ scenario, step, narrow }: { scenario: Scenario; step: number; narrow: boolean }) {
  const applied = step >= 4;
  const rec = scenario.record;
  const existing = EXISTING_JOBS.slice(0, narrow ? 2 : 3).map((row) =>
    rec.kind === "update" && row.id === rec.id && applied ? { ...row, status: rec.status, updated: true } : row,
  );
  // An updated row must stay visible on the narrow layout.
  if (narrow && rec.kind === "update" && !existing.some((r) => r.id === rec.id)) {
    const row = EXISTING_JOBS.find((r) => r.id === rec.id)!;
    existing[existing.length - 1] = applied ? { ...row, status: rec.status, updated: true } : row;
  }
  return (
    <div className="flex h-full flex-col">
      <Header
        icon={<GridIcon />}
        title="Service desk"
        right={
          <span className="flex gap-1.5 text-[12px]">
            <span className="rounded-md bg-white/[0.08] px-2 py-0.5 text-foreground/85">Jobs</span>
            <span className="px-2 py-0.5 text-subtle">Schedule</span>
          </span>
        }
      />
      <div
        className={`mx-4 grid gap-x-3 border-b border-white/[0.06] pb-2 text-[11.5px] uppercase tracking-[0.12em] text-subtle ${narrow ? COLS_NARROW : COLS_WIDE}`}
      >
        <span>Job</span>
        <span>Description</span>
        {!narrow && <span>Priority</span>}
        <span className="text-right">When</span>
      </div>
      <div className="flex-1 px-2 pt-1">
        {rec.kind === "create" && (
          <div
            className="grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ gridTemplateRows: applied ? "1fr" : "0fr", opacity: applied ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <Row row={rec.row} narrow={narrow} highlight />
            </div>
          </div>
        )}
        {existing.map((row) => (
          <Row key={row.id} row={row} narrow={narrow} highlight={"updated" in row} />
        ))}
      </div>
    </div>
  );
}

const COLS_WIDE = "grid-cols-[3.5rem_1fr_auto_6.5rem]";
const COLS_NARROW = "grid-cols-[3.25rem_1fr_auto]";

function Row({ row, narrow, highlight = false }: { row: JobRow; narrow: boolean; highlight?: boolean }) {
  return (
    <div
      className={`mx-2 my-1 grid items-center gap-x-3 rounded-lg border px-2 py-2.5 text-[14px] transition-colors duration-500 ${
        narrow ? COLS_NARROW : COLS_WIDE
      } ${highlight ? "border-accent/35 bg-accent/[0.09]" : "border-transparent"}`}
    >
      <span className="font-mono text-[13px] text-muted">{row.id}</span>
      <span className="truncate text-foreground/90">{row.title}</span>
      {!narrow && (
        <span>
          <span className={`rounded-full px-2 py-0.5 text-[11.5px] ${PRIORITY_STYLE[row.priority]}`}>
            {row.priority === "urgent" ? "Urgent" : row.priority === "change" ? "Change" : "Routine"}
          </span>
        </span>
      )}
      <span className={`text-right text-[13px] ${highlight ? "text-[#cfe0ff]" : "text-muted"}`}>{row.status}</span>
    </div>
  );
}

function Notification({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex h-full items-center gap-3 px-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[#cfe0ff]">
        <BellIcon />
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] text-subtle">{scenario.notify.team} team</span>
        <span className="block text-[14.5px] font-medium leading-snug text-foreground">{scenario.notify.text}</span>
      </span>
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
    <svg {...iconProps} className="h-[18px] w-[18px]">
      <path d="M4.2 11V7.4a3.8 3.8 0 0 1 7.6 0V11l1 1.2H3.2l1-1.2ZM6.6 13.4a1.5 1.5 0 0 0 2.8 0" strokeLinejoin="round" />
    </svg>
  );
}
