"use client";

import { useState } from "react";
import Link from "next/link";
import InteractiveMark from "@/components/hero/interactive/InteractiveMark";
import {
  DEFAULT_RESPONSE,
  RESPONSE_PRESETS,
  type ResponsePreset,
} from "@/components/hero/interactive/interactionConfig";
import { MOVES, MOVE_IDS, type MoveId } from "@/components/hero/interactive/moves";

const chip =
  "rounded-md border border-white/12 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5c9dff]";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] text-slate-500">{label}</span>
      <div className="flex gap-1" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`${chip} ${value === o.value ? "bg-white/10 text-white" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Presentation of the public interactive mark, with discreet preview-only options. */
export default function InteractionPreview() {
  const [response, setResponse] = useState<ResponsePreset>(DEFAULT_RESPONSE);
  const [resetToken, setResetToken] = useState(0);
  const [compare, setCompare] = useState(false);
  const [moveRequest, setMoveRequest] = useState<{ move: MoveId | "shuffle" | "replay"; token: number }>({
    move: "shuffle",
    token: 0,
  });
  const [lastMove, setLastMove] = useState<MoveId | null>(null);
  const play = (move: MoveId | "shuffle" | "replay") => setMoveRequest((r) => ({ move, token: r.token + 1 }));

  return (
    <section className="relative h-svh min-h-[560px] overflow-hidden bg-[#080D17]">
      <InteractiveMark
        className="h-full w-full"
        response={response}
        resetToken={resetToken}
        referenceOpacity={compare ? 0.5 : 0}
        moveRequest={moveRequest}
        onMoveStart={setLastMove}
      />

      <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[11px] uppercase tracking-[0.22em] text-slate-500">
        <span className="[@media(pointer:coarse)]:hidden">Move, hover or click the mark</span>
        <span className="hidden [@media(pointer:coarse)]:inline">Tap to spin · drag sideways to turn</span>
      </p>

      <details className="group absolute right-4 top-4 w-[min(320px,calc(100vw-2rem))] rounded-lg border border-white/10 bg-[#0b1220]/80 text-slate-300 backdrop-blur open:shadow-lg">
        <summary className="cursor-pointer list-none px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5c9dff]">
          Preview options
        </summary>
        <div className="space-y-3 border-t border-white/10 px-3 py-3">
          <div className="space-y-2">
            <span className="text-[11px] text-slate-500">Moves</span>
            <div className="flex flex-wrap gap-1">
              {MOVE_IDS.map((id, i) => (
                <button key={id} type="button" className={chip} onClick={() => play(id)}>
                  {i + 1}. {MOVES[id].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <button type="button" className={chip} onClick={() => play("shuffle")}>
                Shuffle (next in bag)
              </button>
              <button type="button" className={chip} onClick={() => play("replay")} disabled={!lastMove}>
                Replay last
              </button>
              <span className="ml-auto font-mono text-[10px] text-slate-500" aria-live="polite">
                {lastMove ? `Last: ${MOVES[lastMove].label}` : "No move yet"}
              </span>
            </div>
          </div>
          <Segmented
            label="Response"
            value={response}
            options={(Object.keys(RESPONSE_PRESETS) as ResponsePreset[]).map((k) => ({
              value: k,
              label: RESPONSE_PRESETS[k].label,
            }))}
            onChange={setResponse}
          />
          <p className="font-mono text-[10px] text-slate-500">
            ±{RESPONSE_PRESETS[response].yawDeg}° / ±{RESPONSE_PRESETS[response].pitchDeg}° · parallax ±
            {RESPONSE_PRESETS[response].parallaxXPx}/±{RESPONSE_PRESETS[response].parallaxYPx}px
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-[11px] text-slate-400">
              <input
                type="checkbox"
                checked={compare}
                onChange={(e) => setCompare(e.target.checked)}
                className="accent-[#367BFA]"
              />
              Compare with reference
            </label>
            <button type="button" className={chip} onClick={() => setResetToken((n) => n + 1)}>
              Reset interaction
            </button>
          </div>
          <Link href="/3d-lab" className="block text-[11px] text-slate-500 underline underline-offset-4">
            Back to lab
          </Link>
        </div>
      </details>
    </section>
  );
}
