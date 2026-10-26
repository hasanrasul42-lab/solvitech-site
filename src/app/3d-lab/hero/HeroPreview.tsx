"use client";

import { useState } from "react";
import Link from "next/link";
import HeroMark from "@/components/hero/HeroMark";
import { DEFAULT_HERO_PRESET, HERO_PRESETS, type HeroPreset } from "@/components/hero/heroMotion";

/** Hero preview with an interaction-preset switch (preview only). */
export default function HeroPreview() {
  const [preset, setPreset] = useState<HeroPreset>(DEFAULT_HERO_PRESET);
  const current = HERO_PRESETS[preset];

  return (
    <section className="relative h-svh min-h-[480px]">
      <HeroMark className="h-full w-full" preset={preset} />
      <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Hero sculpture preview ·{" "}
          <Link href="/3d-lab" className="underline underline-offset-4 hover:text-slate-300">
            back to lab
          </Link>
        </p>
        <div className="flex items-center gap-2" role="group" aria-label="Interaction preset">
          {(Object.keys(HERO_PRESETS) as HeroPreset[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={preset === key}
              onClick={() => setPreset(key)}
              className={`rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#367BFA] ${
                preset === key ? "bg-white/10" : ""
              }`}
            >
              {HERO_PRESETS[key].label}
            </button>
          ))}
        </div>
      </div>
      <p className="absolute bottom-4 left-4 font-mono text-[11px] text-slate-500">
        ±{current.yawDeg}° horizontal · ±{current.pitchDeg}° vertical · parallax ±{current.parallaxXPx}/±
        {current.parallaxYPx}px
      </p>
    </section>
  );
}
