"use client";

import { useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import SceneErrorBoundary from "../mark/SceneErrorBoundary";
import { useMediaQuery, useOffscreen, useWebGLSupport } from "../mark/browser";
import type { SceneFx } from "./LogoScene";
import {
  DEFAULT_EXPERIMENTS,
  DEFAULT_SETTINGS,
  type ExperimentSettings,
  FRONT_VIEW,
  MARK_SVG_SIZE,
  REFERENCE_IMAGE,
  THREE_QUARTER_VIEW,
  type LabSettings,
  type ViewState,
} from "./labConfig";
import { MARK_SVG_URL } from "../mark/markGeometry";

const LogoScene = dynamic(() => import("./LogoScene"), {
  ssr: false,
  loading: () => <StaticMark note="Loading 3D view…" />,
});

/** Flat SVG shown before the 3D view loads, or instead of it if WebGL fails. */
function StaticMark({ note }: { note?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#080D17]">
      <Image
        src={MARK_SVG_URL}
        alt="Solvitech ribbon symbol"
        width={MARK_SVG_SIZE.width}
        height={MARK_SVG_SIZE.height}
        unoptimized
        priority
        className="h-[55%] w-auto"
      />
      {note && (
        <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-400">{note}</p>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toFixed(2),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-slate-300">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[#367BFA]"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#367BFA]"
      />
      {label}
    </label>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-lg border border-white/10 p-4">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</legend>
      {children}
    </fieldset>
  );
}

const buttonClass =
  "rounded-md border border-white/15 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#367BFA]";

/** Reference image cropped to the area the SVG covers (same pixel grid). */
function ReferenceCrop({ className = "" }: { className?: string }) {
  const { width: svgW, height: svgH } = MARK_SVG_SIZE;
  const ref = REFERENCE_IMAGE;
  return (
    <Image
      src={ref.url}
      alt="Original Solvitech logo reference"
      width={ref.width}
      height={ref.height}
      unoptimized
      className={`absolute max-w-none ${className}`}
      style={{
        width: `${((ref.width / ref.pxPerSvgUnit) / svgW) * 100}%`,
        height: `${((ref.height / ref.pxPerSvgUnit) / svgH) * 100}%`,
        left: `${(-ref.svgOriginX / ref.pxPerSvgUnit / svgW) * 100}%`,
        top: `${(-ref.svgOriginY / ref.pxPerSvgUnit / svgH) * 100}%`,
      }}
    />
  );
}

function ComparisonCard({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <figure className="rounded-lg border border-white/10 p-3">
      <div
        className="relative mx-auto w-full max-w-[260px] overflow-hidden bg-[#080D17]"
        style={{ aspectRatio: `${MARK_SVG_SIZE.width} / ${MARK_SVG_SIZE.height}` }}
      >
        {children}
      </div>
      <figcaption className="mt-3 text-xs">
        <span className="block font-semibold text-slate-200">{title}</span>
        <span className="text-slate-400">{caption}</span>
      </figcaption>
    </figure>
  );
}

function FlatComparison() {
  const [mode, setMode] = useState<"fill" | "difference">("difference");
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Flat front-view comparison</h2>
          <p className="text-xs text-slate-400">
            The traced SVG and original-reference.png on the same pixel grid.
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Overlay mode">
          {(["difference", "fill"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`${buttonClass} ${mode === m ? "bg-white/10" : ""}`}
            >
              {m === "difference" ? "Difference" : "50% overlay"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ComparisonCard title="Original reference" caption="original-reference.png, cropped">
          <ReferenceCrop />
        </ComparisonCard>
        <ComparisonCard title="Traced SVG" caption="public/brand/solvitech-mark.svg">
          <Image src={MARK_SVG_URL} alt="Traced SVG mark" fill unoptimized />
        </ComparisonCard>
        <ComparisonCard
          title="Overlay"
          caption={
            mode === "difference"
              ? "Matching areas go dark; bright fringes show where the trace deviates."
              : "Traced SVG at 50% over the reference."
          }
        >
          <ReferenceCrop />
          <Image
            src={MARK_SVG_URL}
            alt=""
            fill
            unoptimized
            style={mode === "difference" ? { mixBlendMode: "difference" } : { opacity: 0.5 }}
          />
        </ComparisonCard>
      </div>
    </section>
  );
}

export default function LogoLab() {
  const [settings, setSettings] = useState<LabSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<ViewState>({ ...FRONT_VIEW, resetToken: 0 });
  const hasWebGL = useWebGLSupport();

  const [experiments, setExperiments] = useState<ExperimentSettings>(DEFAULT_EXPERIMENTS);
  const [arrivalToken, setArrivalToken] = useState(0);
  const [motionOverride, setMotionOverride] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const reduceMotion = prefersReducedMotion && !motionOverride;

  // Stop requesting frames while the canvas is scrolled out of view.
  const stageRef = useRef<HTMLDivElement>(null);
  const offscreen = useOffscreen(stageRef);

  // Reduced motion: no arrival, idle or cursor motion; pulses freeze in place.
  // Touch devices: no cursor tilt (dragging orbits the camera).
  const fx: SceneFx = {
    experiments: {
      ...experiments,
      motion: {
        ...experiments.motion,
        arrival: experiments.motion.arrival && !reduceMotion,
        idle: experiments.motion.idle && !reduceMotion,
        cursor: experiments.motion.cursor && !reduceMotion && !coarsePointer,
      },
    },
    animateEnergy: !reduceMotion,
    paused: offscreen,
    arrivalToken,
    holdStill: settings.referenceOpacity > 0 || settings.showTrace,
  };

  const set = <K extends keyof LabSettings>(key: K) => (value: LabSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));
  const setFx =
    <G extends "illumination" | "energy" | "motion", K extends keyof ExperimentSettings[G]>(group: G, key: K) =>
    (value: ExperimentSettings[G][K]) =>
      setExperiments((x) => ({ ...x, [group]: { ...x[group], [key]: value } }));
  const goTo = (angles: { azimuth: number; elevation: number }) =>
    setView((v) => ({ ...angles, resetToken: v.resetToken + 1 }));

  const fallback = <StaticMark note="3D view unavailable. Showing the flat SVG." />;
  const deg = (v: number) => `${v}°`;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#367BFA]">Development lab</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">
          Solvitech mark: 3D, illumination &amp; motion
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          The traced SVG extruded as two separate ribbons, with switchable lighting and motion experiments. These
          controls are for evaluation only. Drag to orbit, scroll or pinch to zoom.
        </p>
        <Link href="/3d-lab/hero" className="mt-2 inline-block text-xs text-[#6ea0ff] underline underline-offset-4">
          Open the public hero sculpture preview (no controls)
        </Link>
        <Link
          href="/3d-lab/hero-interaction-preview"
          className="ml-4 mt-2 inline-block text-xs text-[#6ea0ff] underline underline-offset-4"
        >
          Open the interactive hero preview
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Render mode">
            {[
              { label: "Static 3D (Task 01)", value: false },
              { label: "Experiments (Task 02)", value: true },
            ].map(({ label, value }) => (
              <button
                key={label}
                type="button"
                aria-pressed={experiments.enabled === value}
                className={`${buttonClass} ${experiments.enabled === value ? "bg-white/10" : ""}`}
                onClick={() => {
                  setExperiments((x) => ({ ...x, enabled: value }));
                  if (value) setArrivalToken((n) => n + 1);
                }}
              >
                {label}
              </button>
            ))}
            {experiments.enabled && (
              <button
                type="button"
                className={buttonClass}
                disabled={!fx.experiments.motion.arrival}
                onClick={() => setArrivalToken((n) => n + 1)}
              >
                Replay arrival
              </button>
            )}
          </div>
          <div
            ref={stageRef}
            className="relative h-[62svh] min-h-[360px] overflow-hidden rounded-xl border border-white/10 lg:h-[72vh]"
          >
            {hasWebGL === false ? (
              fallback
            ) : hasWebGL === null ? (
              <StaticMark />
            ) : (
              <SceneErrorBoundary fallback={fallback}>
                <LogoScene
                  settings={settings}
                  fx={fx}
                  maxDpr={coarsePointer ? 1.5 : 2}
                  view={view}
                  onViewChange={setView}
                />
              </SceneErrorBoundary>
            )}
          </div>
          {experiments.enabled && (prefersReducedMotion || fx.holdStill) && (
            <p className="mt-2 text-xs text-slate-400">
              {fx.holdStill
                ? "Overlays are on, so motion holds the neutral front pose."
                : reduceMotion
                  ? "Your system asks for reduced motion: arrival, idle and cursor motion are off and pulses are frozen."
                  : "Reduced motion is overridden for this preview."}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => goTo(FRONT_VIEW)}>
              Reset to front view
            </button>
            <button type="button" className={buttonClass} onClick={() => goTo(THREE_QUARTER_VIEW)}>
              3/4 view
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                setExperiments(DEFAULT_EXPERIMENTS);
              }}
            >
              Reset settings
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          {experiments.enabled && (
            <>
              <Panel title="A · Premium illumination">
                <Toggle label="Enabled" checked={experiments.illumination.enabled}
                  onChange={setFx("illumination", "enabled")} />
                <Slider label="Glow strength" value={experiments.illumination.glowStrength} min={0} max={1.5}
                  step={0.05} onChange={setFx("illumination", "glowStrength")} />
                <Slider label="Glow softness" value={experiments.illumination.glowSoftness} min={8} max={80}
                  step={1} format={(v) => `${v}px`} onChange={setFx("illumination", "glowSoftness")} />
                <label className="flex items-center justify-between text-xs text-slate-400">
                  Glow colour
                  <input type="color" value={experiments.illumination.glowColor}
                    onChange={(e) => setFx("illumination", "glowColor")(e.target.value)}
                    className="h-6 w-10 cursor-pointer rounded border border-white/15 bg-transparent" />
                </label>
                <Slider label="Blue emissive" value={experiments.illumination.blueEmissive} min={0} max={0.8}
                  step={0.01} onChange={setFx("illumination", "blueEmissive")} />
                <Slider label="White lift" value={experiments.illumination.whiteLift} min={0} max={1} step={0.05}
                  onChange={setFx("illumination", "whiteLift")} />
              </Panel>

              <Panel title="B · Living energy">
                <Toggle label="Enabled" checked={experiments.energy.enabled} onChange={setFx("energy", "enabled")} />
                <Slider label="Speed (circuits/s)" value={experiments.energy.speed} min={0.02} max={0.4}
                  step={0.01} onChange={setFx("energy", "speed")} />
                <Slider label="Intensity" value={experiments.energy.intensity} min={0} max={3} step={0.05}
                  onChange={setFx("energy", "intensity")} />
                <Slider label="Frequency (pulses)" value={experiments.energy.frequency} min={1} max={4} step={1}
                  format={String} onChange={setFx("energy", "frequency")} />
                <Slider label="Pulse length" value={experiments.energy.width} min={0.02} max={0.2} step={0.005}
                  format={(v) => v.toFixed(3)} onChange={setFx("energy", "width")} />
                <Slider label="White ribbon response" value={experiments.energy.whiteResponse} min={0} max={1}
                  step={0.05} onChange={setFx("energy", "whiteResponse")} />
              </Panel>

              <Panel title="C · Cinematic motion">
                <Toggle label="Arrival animation" checked={experiments.motion.arrival}
                  onChange={setFx("motion", "arrival")} />
                <Toggle label="Idle drift" checked={experiments.motion.idle} onChange={setFx("motion", "idle")} />
                <Slider label="Idle amount" value={experiments.motion.idleAmount} min={0} max={2} step={0.1}
                  onChange={setFx("motion", "idleAmount")} />
                <Toggle label={coarsePointer ? "Cursor tilt (mouse only, off on touch)" : "Cursor tilt"}
                  checked={experiments.motion.cursor} onChange={setFx("motion", "cursor")} />
                <Slider label="Max cursor tilt" value={experiments.motion.cursorTilt} min={1} max={8} step={0.5}
                  format={(v) => `${v}°`} onChange={setFx("motion", "cursorTilt")} />
                {prefersReducedMotion && (
                  <Toggle label="Preview motion despite reduced-motion setting" checked={motionOverride}
                    onChange={setMotionOverride} />
                )}
              </Panel>
            </>
          )}

          <Panel title="View angle">
            <Slider label="Horizontal" value={view.azimuth} min={-90} max={90} step={1} format={deg}
              onChange={(azimuth) => setView((v) => ({ ...v, azimuth }))} />
            <Slider label="Vertical" value={view.elevation} min={-60} max={60} step={1} format={deg}
              onChange={(elevation) => setView((v) => ({ ...v, elevation }))} />
          </Panel>

          <Panel title="Geometry">
            <Slider label="Depth" value={settings.depth} min={0.02} max={0.6} step={0.01} onChange={set("depth")} />
            <Slider label="Bevel" value={settings.bevel} min={0} max={0.06} step={0.002}
              format={(v) => v.toFixed(3)} onChange={set("bevel")} />
            <Slider label="Bevel segments" value={settings.bevelSegments} min={1} max={8} step={1}
              format={String} onChange={set("bevelSegments")} />
            <Toggle label="Smooth traced contour (passes through every traced point)" checked={settings.smoothing}
              onChange={set("smoothing")} />
          </Panel>

          <Panel title="Material">
            <Slider label="Roughness" value={settings.roughness} min={0.15} max={0.9} step={0.01}
              onChange={set("roughness")} />
            <Slider label="Metalness" value={settings.metalness} min={0} max={0.4} step={0.01}
              onChange={set("metalness")} />
          </Panel>

          <Panel title="Lighting">
            <Slider label="Key light" value={settings.keyLight} min={0} max={4} step={0.05} onChange={set("keyLight")} />
            <Slider label="Blue rim light" value={settings.rimLight} min={0} max={4} step={0.05}
              onChange={set("rimLight")} />
            <Slider label="Studio environment" value={settings.environment} min={0} max={2} step={0.05}
              onChange={set("environment")} />
          </Panel>

          <Panel title="Front-view check">
            <Slider label="Reference overlay opacity" value={settings.referenceOpacity} min={0} max={1} step={0.05}
              onChange={set("referenceOpacity")} />
            <Toggle label="Show raw traced outline" checked={settings.showTrace} onChange={set("showTrace")} />
            <p className="text-[11px] leading-relaxed text-slate-500">
              Overlays line up in the front view only. Reset to front view before judging alignment.
            </p>
          </Panel>
        </aside>
      </div>

      <FlatComparison />
    </main>
  );
}
