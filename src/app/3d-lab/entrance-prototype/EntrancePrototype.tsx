"use client";

import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import HomeHero from "@/components/home/HomeHero";
import SiteHeader from "@/components/site/SiteHeader";
import { RIBBON_BOX, VIEWBOX, RIBBON_BOX_CSS } from "@/components/hero/interactive/layout";
import type { Lighting } from "@/components/hero/interactive/InteractiveScene";
import { INTRO, INTRO_3D_KEY, STAGE_SELECTOR, placeIntroStage, type Intro3dRecord } from "./introTimeline";

/** Simulated WebGL readiness, measured from the start of the intro. */
const SIMS = [
  { id: "real", label: "Real (as fast as possible)" },
  { id: "400", label: "Ready after 400 ms" },
  { id: "1200", label: "Ready after 1.2 s" },
  { id: "3000", label: "Ready after 3 s" },
  { id: "none", label: "WebGL unavailable" },
] as const;
type SimId = (typeof SIMS)[number]["id"];
type Variant = "intro" | "current";

const noopSubscribe = () => () => {};
const readBootStart = () => Number(document.documentElement.getAttribute("data-intro-start") ?? 0);
const readSimFromUrl = (): SimId => {
  const value = new URLSearchParams(window.location.search).get("webgl");
  return SIMS.some((s) => s.id === value) ? (value as SimId) : "real";
};

const html = () => document.documentElement;

/**
 * The activation light: the official silhouette (solvitech-mark.svg) masks a
 * moving blue band, laid exactly over the mark at its resting pose. It lives
 * inside the mark's stage, so it moves with it.
 */
function ActivationSweep() {
  // The SVG viewBox box, positioned so its ribbon box sits on the stage's ribbon box.
  const ribbonCx = (VIEWBOX.ribbonX + RIBBON_BOX.w / 2) / VIEWBOX.w;
  const ribbonCy = (VIEWBOX.ribbonY + RIBBON_BOX.h / 2) / VIEWBOX.h;
  return (
    <div
      aria-hidden
      className="intro-sweep pointer-events-none absolute left-1/2 top-1/2"
      style={{
        height: `calc(${RIBBON_BOX_CSS.height} * ${VIEWBOX.h / RIBBON_BOX.h})`,
        aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}`,
        transform: `translate(${-ribbonCx * 100}%, ${-ribbonCy * 100}%)`,
      }}
    >
      <div className="intro-sweep-band" />
    </div>
  );
}

/**
 * /3d-lab/entrance-prototype: the real homepage hero with the experimental
 * "System Activation" entrance, plus lab controls to compare it with the
 * current entrance under different WebGL readiness conditions.
 */
export default function EntrancePrototype({ lighting = "approved" }: { lighting?: Lighting } = {}) {
  const bootStart = useSyncExternalStore(noopSubscribe, readBootStart, () => 0);
  const urlSim = useSyncExternalStore(noopSubscribe, readSimFromUrl, () => "real" as SimId);
  const [simOverride, setSimOverride] = useState<SimId | null>(null);
  const sim = simOverride ?? urlSim;
  const [variant, setVariant] = useState<Variant>("intro");
  const [run, setRun] = useState(0);
  // performance.now() of a replay; the first load uses the boot script's time.
  const [replayStart, setReplayStart] = useState(0);
  const start = replayStart || bootStart;

  const finish = useCallback(() => {
    if (html().getAttribute("data-intro") === "play") html().setAttribute("data-intro", "done");
  }, []);

  // A replay remounts the hero; position and start the intro before paint.
  useLayoutEffect(() => {
    if (run === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    html().setAttribute("data-intro", "done"); // untransformed for measuring
    html().removeAttribute("data-intro-reason");
    if (variant === "current") {
      html().setAttribute("data-intro", "off");
      return;
    }
    if (reduced) {
      html().setAttribute("data-intro", "skip");
      html().setAttribute("data-intro-reason", "reduced-motion");
      return;
    }
    const stage = document.querySelector<HTMLElement>(STAGE_SELECTOR);
    if (stage) placeIntroStage(stage);
    void html().offsetWidth; // restart the header animation
    html().setAttribute("data-intro", "play");
  }, [run, variant]);

  // End of the intro, and early exits: skip on resize (positions would be
  // stale) or when keyboard focus moves into the page.
  useEffect(() => {
    if (html().getAttribute("data-intro") !== "play") {
      // Internal navigation (no boot script ran): no intro.
      if (!html().hasAttribute("data-intro")) html().setAttribute("data-intro", "done");
      return;
    }
    const timer = setTimeout(finish, Math.max(0, start + INTRO.endMs - performance.now()));
    const onFocus = (e: FocusEvent) => {
      if (!(e.target as Element).closest?.("[data-lab-panel]")) finish();
    };
    window.addEventListener("resize", finish);
    document.addEventListener("focusin", onFocus);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", finish);
      document.removeEventListener("focusin", onFocus);
    };
  }, [start, run, finish]);

  // Real page loads only (not lab replays, whose chunks are already warm):
  // record how soon the 3D took over, to decide whether the next visit needs
  // the intro at all.
  useEffect(() => {
    if (run !== 0) return;
    const stage = document.querySelector(STAGE_SELECTOR);
    if (!stage) return;
    const save = (readyMs: number | null) => {
      const record: Intro3dRecord = { readyMs, at: Date.now() };
      try {
        localStorage.setItem(INTRO_3D_KEY, JSON.stringify(record));
      } catch {}
    };
    const check = () => {
      const state = stage.getAttribute("data-entrance");
      if (state === "complete") save(performance.now());
      else if (state === "fallback" && !stage.querySelector("canvas")) save(null);
      else return false;
      return true;
    };
    if (check()) return;
    const observer = new MutationObserver(() => check() && observer.disconnect());
    observer.observe(stage, { attributes: true, attributeFilter: ["data-entrance"] });
    return () => observer.disconnect();
  }, [run]);

  // Leaving the page: drop the intro state so no other page is affected.
  useEffect(
    () => () => {
      for (const name of ["data-intro", "data-intro-start", "data-intro-reason"]) html().removeAttribute(name);
    },
    [],
  );

  const replay = useCallback((next: { variant?: Variant; sim?: SimId } = {}) => {
    if (next.variant) setVariant(next.variant);
    if (next.sim) {
      setSimOverride(next.sim);
      const url = new URL(window.location.href);
      if (next.sim === "real") url.searchParams.delete("webgl");
      else url.searchParams.set("webgl", next.sim);
      window.history.replaceState(null, "", url);
    }
    setReplayStart(performance.now());
    setRun((r) => r + 1);
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(INTRO_3D_KEY);
    } catch {}
    replay({ variant: "intro", sim: "real" });
  }, [replay]);

  const simDelay = sim === "real" || sim === "none" ? 0 : Number(sim);
  const markProps =
    variant === "intro"
      ? {
          restStart: true,
          // Cursor response blends in once the activation light has passed, so
          // the sweep always sits exactly on the resting silhouette.
          interactiveFrom: start + INTRO.sweepDelayMs + INTRO.sweepMs,
          overlay: <ActivationSweep />,
          debugReadyAt: simDelay ? start + simDelay : 0,
          debugNoWebGL: sim === "none",
          lighting,
        }
      : { debugReadyAt: simDelay ? start + simDelay : 0, debugNoWebGL: sim === "none", lighting };

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <HomeHero key={run} markProps={markProps} />
      </main>
      <button
        type="button"
        onClick={finish}
        className="intro-skip fixed bottom-6 left-1/2 z-50 -translate-x-1/2 items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted backdrop-blur transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
      >
        Skip intro
      </button>
      <LabPanel variant={variant} sim={sim} onReplay={replay} onReset={reset} />
    </>
  );
}

function LabPanel({
  variant,
  sim,
  onReplay,
  onReset,
}: {
  variant: Variant;
  sim: SimId;
  onReplay: (next?: { variant?: Variant; sim?: SimId }) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return;
    const read = () => {
      const stage = document.querySelector(STAGE_SELECTOR);
      const intro = html().getAttribute("data-intro") ?? "-";
      const reason = html().getAttribute("data-intro-reason");
      setStatus(`intro: ${intro}${reason ? ` (${reason})` : ""} · mark: ${stage?.getAttribute("data-entrance") ?? "-"}`);
    };
    read();
    const timer = setInterval(read, 150);
    return () => clearInterval(timer);
  }, [open]);

  const button =
    "rounded-md border border-white/10 px-2.5 py-1.5 text-left text-xs text-slate-300 transition-colors hover:border-white/25 hover:text-white aria-pressed:border-[#5c9dff]/60 aria-pressed:text-white";

  return (
    <div data-lab-panel className="fixed bottom-4 right-4 z-50 text-xs">
      {open ? (
        <div className="w-64 rounded-xl border border-white/10 bg-[#0b1220]/95 p-3 shadow-2xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium uppercase tracking-[0.14em] text-slate-400">Entrance lab</span>
            <button type="button" className="text-slate-500 hover:text-white" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <div className="grid gap-1.5">
            <button type="button" className={button} onClick={() => onReplay({ variant: "intro" })}>
              Replay System Activation
            </button>
            <button
              type="button"
              className={button}
              aria-pressed={variant === "current"}
              onClick={() => onReplay({ variant: "current" })}
            >
              Bypass: current homepage entrance
            </button>
          </div>
          <p className="mb-1.5 mt-3 text-slate-500">WebGL readiness (replays)</p>
          <div className="grid gap-1.5">
            {SIMS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={button}
                aria-pressed={sim === s.id}
                onClick={() => onReplay({ sim: s.id })}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button type="button" className={`${button} mt-3 w-full`} onClick={onReset}>
            Reset experiment
          </button>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-slate-500">{status}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/10 bg-[#0b1220]/80 px-3 py-1.5 text-slate-400 backdrop-blur hover:text-white"
        >
          Lab
        </button>
      )}
    </div>
  );
}
