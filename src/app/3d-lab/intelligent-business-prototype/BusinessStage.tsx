"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Platform from "./Platform";
import { AiLayer, AutomationLayer, RecordCard } from "./Layers";
import type { BizState, SceneId, SlotId, TechId } from "./business";

/*
 * One continuous environment, art-directed in CSS 3D. The Operations platform
 * is the anchor; the AI and Automation layers stand beside it like wings, and
 * the job record floats in front when the schedule changes. Focus moves the
 * camera (the whole world shifts and turns) -- nothing is rebuilt.
 *
 * Tablets and phones get their own compositions: the platform fills the stage
 * at a readable size and the AI / Automation / record layers slide over it
 * while they are the focus (phones also use a compact platform).
 */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  ry?: number;
  origin?: string;
}
interface Layout {
  w: number;
  h: number;
  rx: number;
  panes: { platform: Box; ai: Box; automation: Box; record: Box };
  camera: Record<"none" | SceneId, { tx: number; ty: number; ry: number; s: number }>;
}

const WIDE: Layout = {
  w: 1280,
  h: 640,
  rx: 6,
  panes: {
    // The platform stands in front; the wings sit behind it, angled away
    // (outer edges recede), and come forward only while in focus.
    platform: { x: 300, y: 20, w: 680, h: 600, z: 40 },
    ai: { x: 0, y: 60, w: 330, h: 510, z: -50, ry: -18, origin: "100% 50%" },
    automation: { x: 950, y: 60, w: 330, h: 510, z: -50, ry: 18, origin: "0% 50%" },
    record: { x: 640, y: 404, w: 330, h: 140, z: 170 },
  },
  camera: {
    none: { tx: 0, ty: 0, ry: 0, s: 1 },
    ai: { tx: 185, ty: 0, ry: 6, s: 1 },
    automation: { tx: -185, ty: 0, ry: -6, s: 1 },
    systems: { tx: 0, ty: 0, ry: 0, s: 1.03 },
  },
};
const FLAT = { tx: 0, ty: 0, ry: 0, s: 1 };
const MEDIUM: Layout = {
  w: 720,
  h: 640,
  rx: 4,
  panes: {
    platform: { x: 20, y: 20, w: 680, h: 600, z: 0 },
    ai: { x: 340, y: 40, w: 360, h: 520, z: 90 },
    automation: { x: 340, y: 70, w: 360, h: 470, z: 90 },
    record: { x: 360, y: 420, w: 330, h: 140, z: 100 },
  },
  camera: { none: FLAT, ai: FLAT, automation: FLAT, systems: FLAT },
};
const NARROW: Layout = {
  w: 360,
  h: 640,
  rx: 4,
  panes: {
    platform: { x: 0, y: 0, w: 360, h: 640, z: 0 },
    ai: { x: 8, y: 150, w: 344, h: 484, z: 90 },
    automation: { x: 8, y: 236, w: 344, h: 396, z: 90 },
    record: { x: 22, y: 360, w: 316, h: 140, z: 100 },
  },
  camera: {
    none: { tx: 0, ty: 0, ry: 0, s: 1 },
    ai: { tx: 0, ty: 0, ry: 0, s: 1 },
    automation: { tx: 0, ty: 0, ry: 0, s: 1 },
    systems: { tx: 0, ty: 0, ry: 0, s: 1 },
  },
};

export default function BusinessStage({
  state,
  focus,
  started,
  reduced,
  exploreSystems,
  onMove,
  label,
}: {
  state: BizState;
  /** The capability in focus (playing scene, hovered or explored), or none for the overview. */
  focus: SceneId | null;
  started: boolean;
  reduced: boolean;
  exploreSystems: boolean;
  onMove: (tech: TechId, slot: SlotId) => void;
  label: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const layout = width > 0 && width < 640 ? NARROW : width > 0 && width < 1060 ? MEDIUM : WIDE;
  const narrow = layout === NARROW;
  // Tablet and phone: layers overlay the platform instead of standing beside it.
  const overlay = layout !== WIDE;
  const s = width > 0 ? Math.min(1.1, width / layout.w) : 0.8;
  const padTop = 50;
  const padBottom = 24;
  const stageH = Math.round(layout.h * s + padTop + padBottom);
  const worldTop = padTop - (layout.h - layout.h * s) / 2;
  const cam = layout.camera[focus ?? "none"];

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Restrained pointer response on desktop (adds to the camera, never fights it).
  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!stage || !world || reduced || !fine || overlay) return;
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
    const onMovePtr = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 4;
      target.y = -((e.clientY - r.top) / r.height - 0.5) * 3;
      kick();
    };
    const onLeave = () => {
      target.x = target.y = 0;
      kick();
    };
    stage.addEventListener("pointermove", onMovePtr);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMovePtr);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, overlay]);

  const p = layout.panes;
  const wingFocus = (id: SceneId) => focus === id;
  // Wide: wings always present. Tablet/phone: a layer appears only while it is the focus.
  const showAi = overlay ? focus === "ai" && state.ai >= 1 : true;
  const showAutomation = overlay ? focus === "automation" : true;
  const showRecord = focus === "systems" && (state.systems >= 3 || exploreSystems || state.movedBy === "you");

  return (
    <div
      ref={stageRef}
      className="ib-stage relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[radial-gradient(ellipse_75%_70%_at_50%_45%,#101b30_0%,#0a1120_58%,#080e1a_100%)]"
      style={{ height: stageH }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[12%] bottom-[2%] top-[40%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(54_123_250/0.13),transparent_70%)] blur-2xl"
      />
      <div className="absolute inset-0 [perspective:2000px] [perspective-origin:50%_35%]">
        <div
          ref={worldRef}
          className="ib-world absolute left-1/2 [transform-style:preserve-3d]"
          style={
            {
              width: layout.w,
              height: layout.h,
              marginLeft: -layout.w / 2,
              top: worldTop,
              opacity: width ? 1 : 0,
              transformOrigin: "50% 50%",
              transform: `scale(${s * cam.s}) translate3d(${cam.tx}px, ${cam.ty}px, 0) rotateX(calc(${layout.rx}deg + var(--tilt-x, 0deg))) rotateY(calc(${cam.ry}deg + var(--tilt-y, 0deg)))`,
              transition: "transform 1200ms cubic-bezier(0.65, 0, 0.25, 1)",
            } as CSSProperties
          }
        >
          <Pane box={p.platform} shown={started} focus={focus === "systems"} index={0}>
            <Platform state={state} narrow={narrow} exploreSystems={exploreSystems} onMove={onMove} />
          </Pane>
          <Pane box={p.ai} shown={started && showAi} focus={wingFocus("ai")} quiet={focus !== null && !wingFocus("ai")} index={1} label="AI & Intelligence">
            <AiLayer state={state} />
          </Pane>
          <Pane
            box={p.automation}
            shown={started && showAutomation}
            focus={wingFocus("automation")}
            quiet={focus !== null && !wingFocus("automation")}
            index={2}
            label="Automation"
          >
            <AutomationLayer state={state} />
          </Pane>
          <Pane box={p.record} shown={showRecord} focus index={0}>
            <RecordCard state={state} />
          </Pane>
        </div>
      </div>
      <p className="pointer-events-none absolute left-5 top-4 text-[12px] text-subtle sm:text-[13px]">{label}</p>
    </div>
  );
}

function Pane({
  box,
  shown,
  focus,
  quiet = false,
  index,
  label,
  children,
}: {
  box: Box;
  shown: boolean;
  focus: boolean;
  quiet?: boolean;
  index: number;
  label?: string;
  children: ReactNode;
}) {
  // Wings turn toward the viewer and come forward (in front of the platform) when in focus.
  const ry = box.ry ? (focus ? box.ry * 0.2 : box.ry) : 0;
  const z = box.z + (focus && box.ry ? 200 : 0);
  return (
    <div
      aria-label={label}
      className={`absolute overflow-hidden rounded-[20px] border bg-[linear-gradient(180deg,#131e33_0%,#0d1627_100%)] ${
        focus
          ? "border-accent/45 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(54,123,250,0.4)]"
          : "border-white/[0.09] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
      }`}
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        transformOrigin: box.origin ?? "50% 50%",
        opacity: shown ? (quiet ? 0.55 : 1) : 0,
        transform: `translate3d(0, ${shown ? 0 : 40}px, ${z}px) rotateY(${ry}deg)`,
        transition:
          "transform 1100ms cubic-bezier(0.65,0,0.25,1), opacity 700ms ease, border-color 600ms ease, box-shadow 600ms ease",
        transitionDelay: shown ? `${index * 90}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
