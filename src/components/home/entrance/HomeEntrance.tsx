"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import HomeHero from "@/components/home/HomeHero";
import { RIBBON_BOX, VIEWBOX, RIBBON_BOX_CSS } from "@/components/hero/interactive/layout";
import { INTRO, INTRO_3D_KEY, STAGE_SELECTOR, type Intro3dRecord } from "./introTimeline";
import "./entrance.css";

const noopSubscribe = () => () => {};
const readBootStart = () => Number(document.documentElement.getAttribute("data-intro-start") ?? 0);

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
 * The homepage hero with the "System Activation" entrance and the refined
 * (steady glow field) lighting. The boot script (INTRO_BOOT_SCRIPT, placed
 * right after this in the page) decides before first paint whether the intro
 * plays: only when the 3D is likely to need loading time.
 */
export default function HomeEntrance() {
  const start = useSyncExternalStore(noopSubscribe, readBootStart, () => 0);

  const finish = useCallback(() => {
    if (html().getAttribute("data-intro") === "play") html().setAttribute("data-intro", "done");
  }, []);

  // End of the intro, and early exits: skip on resize (positions would be
  // stale) or when keyboard focus moves into the page.
  useEffect(() => {
    if (html().getAttribute("data-intro") !== "play") {
      // Internal navigation (no boot script ran): no intro.
      if (!html().hasAttribute("data-intro")) html().setAttribute("data-intro", "done");
      return;
    }
    const timer = setTimeout(finish, Math.max(0, start + INTRO.endMs - performance.now()));
    window.addEventListener("resize", finish);
    document.addEventListener("focusin", finish);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", finish);
      document.removeEventListener("focusin", finish);
    };
  }, [start, finish]);

  // Record how soon the 3D took over, to decide whether the next visit needs
  // the intro at all.
  useEffect(() => {
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
  }, []);

  // Leaving the page: drop the intro state so no other page is affected.
  useEffect(
    () => () => {
      for (const name of ["data-intro", "data-intro-start", "data-intro-reason"]) html().removeAttribute(name);
    },
    [],
  );

  return (
    <>
      <HomeHero
        markProps={{
          restStart: true,
          // Cursor response blends in once the activation light has passed, so
          // the sweep always sits exactly on the resting silhouette.
          interactiveFrom: start + INTRO.sweepDelayMs + INTRO.sweepMs,
          overlay: <ActivationSweep />,
          lighting: "refined",
        }}
      />
      <button
        type="button"
        onClick={finish}
        className="intro-skip fixed bottom-6 left-1/2 z-50 -translate-x-1/2 items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted backdrop-blur transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
      >
        Skip intro
      </button>
    </>
  );
}
