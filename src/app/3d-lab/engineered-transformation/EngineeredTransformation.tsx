"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery, useWebGLSupport } from "@/components/mark/browser";
import { END, START, type Mechanism } from "./choreography";
import { Director } from "./director";
import Sculpture from "./Sculpture";

const CAPABILITIES: { id: Mechanism; name: string; line: string; detail: string }[] = [
  {
    id: "intel",
    name: "AI & Intelligence",
    line: "Understand information. Reveal what matters.",
    detail: "Mixed inputs are read as they pass through. The one that doesn't fit is lifted out for attention; the rest is sorted.",
  },
  {
    id: "auto",
    name: "Process Automation",
    line: "Make complex workflows run smoothly.",
    detail: "One trigger throws a linked sequence (lever, carriage, clamp) through to a confirmed finish, with no hand-offs.",
  },
  {
    id: "sys",
    name: "Custom Business Systems",
    line: "Software designed around how you operate.",
    detail: "One module moves to a new bay, its neighbours re-centre, the pathways re-route, and the structure settles, stable.",
  },
];
const STATUS: Record<string, string> = {
  intel: "Intelligence: reading the inputs and isolating the one that matters.",
  auto: "Automation: one trigger runs the sequence to completion.",
  sys: "Custom systems: the structure reconfigures and settles.",
  unify: "The three capabilities lock together into one system.",
};
const POSTER = "/lab/engineered-transformation.webp";

const noop = () => () => {};
const readQuery = () => window.location.search;

export default function EngineeredTransformation() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const narrow = useMediaQuery("(max-width: 767px)");
  const webgl = useWebGLSupport();
  const query = useSyncExternalStore(noop, readQuery, () => "");
  const dev = query.includes("dev");
  const forceFallback = query.includes("nogl");
  // ?dev&still: no autoplay (for inspecting exact states).
  const still = dev && query.includes("still");
  const [director] = useState(() => new Director());
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [hideText, setHideText] = useState(false);
  const [preview, setPreview] = useState<Mechanism | null>(null);
  const started = useRef(false);
  useSyncExternalStore(director.subscribe, director.getVersion, director.getVersion);
  const active = director.active;

  const useGL = webgl === true && !lost && !forceFallback;
  const fallback = webgl === false || lost || forceFallback;

  // Reduced motion: the assembled sculpture, no choreography.
  useEffect(() => {
    if (reduced) {
      started.current = true;
      director.set(END);
    }
  }, [reduced, director]);

  // Play once the stage is properly in view; stop requesting frames when it is not.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        director.setVisible(e.isIntersecting);
        if (!started.current && !still && e.intersectionRatio >= 0.35) {
          started.current = true;
          director.playAll();
        }
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [director, still]);

  // Pointer parallax (fine pointers, full motion only).
  useEffect(() => {
    const el = stage.current;
    if (!el || reduced || !finePointer) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      director.setPointer(clamp(((e.clientX - r.left) / r.width) * 2 - 1), clamp(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const leave = () => director.setPointer(0, 0);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      director.setPointer(0, 0);
    };
  }, [director, reduced, finePointer]);

  // Test/debug hook (?dev only).
  useEffect(() => {
    if (!dev) return;
    (window as unknown as { __et?: Director }).__et = director;
    return () => void delete (window as unknown as { __et?: Director }).__et;
  }, [dev, director]);

  const highlight = (m: Mechanism | null) => {
    setPreview(m);
    director.setHighlight(m);
  };
  const replayMechanism = (m: Mechanism) => {
    if (reduced) return;
    started.current = true;
    director.playMechanism(m);
  };
  const replayAll = () => {
    started.current = true;
    director.playAll();
  };
  const reset = () => {
    started.current = true;
    director.reset();
  };

  return (
    <div>
      {!hideText && (
        <div className="mx-auto w-full max-w-[1440px] px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h1
              id="et-title"
              className="text-[clamp(2.25rem,8.5vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground md:text-[clamp(3rem,6vw,3.75rem)] lg:col-span-7 lg:text-[clamp(3.25rem,4.4vw,4.25rem)]"
            >
              Engineering intelligence into business<span className="text-accent">.</span>
            </h1>
            <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">
              From intelligent software and automation to custom-built systems, we engineer technology that works
              together.
            </p>
          </div>
        </div>
      )}

      {/* Stage: near full width, no card. */}
      <div
        ref={stage}
        className="et-stage relative mx-auto mt-6 w-full max-w-[1760px] md:mt-4"
        role="img"
        aria-label="A modular engineered sculpture: three mechanisms on one plinth. An intelligence chamber reads inputs and isolates an anomaly, an automation mechanism runs from trigger to completion, and a reconfigurable rack rearranges itself. They then slide together and lock into one system."
      >
        <div aria-hidden className="et-pool pointer-events-none absolute inset-0" />
        {useGL && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
            <Sculpture director={director} lowPower={narrow} onReady={() => setReady(true)} onLost={() => setLost(true)} />
          </div>
        )}
        {fallback && (
          // Static fallback: the assembled sculpture, rendered from this scene.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-contain" />
        )}
      </div>

      {!hideText && (
        <div className="mx-auto w-full max-w-[1440px] px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12">
          <ul className="grid gap-px overflow-hidden border-y border-white/[0.07] md:grid-cols-3 md:border-x-0">
            {CAPABILITIES.map((c, i) => {
              const on = preview === c.id || active === c.id;
              return (
                <li key={c.id} className="bg-[#080D17]">
                  <button
                    type="button"
                    onClick={() => replayMechanism(c.id)}
                    onMouseEnter={() => highlight(c.id)}
                    onMouseLeave={() => highlight(null)}
                    onFocus={() => highlight(c.id)}
                    onBlur={() => highlight(null)}
                    aria-describedby={`et-detail-${c.id}`}
                    className="group relative block h-full w-full px-1 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-soft md:px-6 md:py-7"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-x-1 top-0 h-px origin-left bg-accent transition-transform duration-500 md:inset-x-6 ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                      <span className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">{c.name}</span>
                    </span>
                    <span className="mt-1.5 block pl-[1.85rem] text-[0.9375rem] leading-relaxed text-muted">{c.line}</span>
                    <span
                      className={`grid pl-[1.85rem] transition-[grid-template-rows,opacity] duration-500 ${
                        on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span id={`et-detail-${c.id}`} className="overflow-hidden">
                        <span className="block pt-3 text-sm leading-relaxed text-foreground/80">
                          {c.detail}
                          {!reduced && <span className="mt-2 block text-xs text-subtle">Select to replay this mechanism.</span>}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="min-h-[1.5rem] text-sm text-subtle" aria-live="polite">
              {reduced ? "Motion is reduced: showing the assembled system." : active ? STATUS[active] : ""}
            </p>
            {!reduced && (
              <div className="flex gap-2">
                <button type="button" onClick={replayAll} className={smallBtn}>
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Replay
                </button>
                <button type="button" onClick={reset} className={smallBtn}>
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {dev && <DevPanel director={director} hideText={hideText} setHideText={setHideText} />}
    </div>
  );
}

const smallBtn =
  "inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

/** Development only (?dev=1). */
function DevPanel({
  director,
  hideText,
  setHideText,
}: {
  director: Director;
  hideText: boolean;
  setHideText: (v: boolean) => void;
}) {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, []);
  const b = "rounded-md border border-white/10 px-2 py-1.5 hover:border-white/30";
  return (
    <div className="fixed bottom-4 left-4 z-50 w-72 rounded-xl border border-white/10 bg-[#0b1220]/95 p-3 text-xs text-slate-300 shadow-2xl backdrop-blur">
      <p className="mb-2 font-medium uppercase tracking-[0.14em] text-slate-400">Sculpture (dev)</p>
      <div className="grid grid-cols-3 gap-1.5">
        <button type="button" className={b} onClick={() => director.set(START)}>
          Initial
        </button>
        <button type="button" className={b} onClick={() => director.playFrom("intel")}>
          Intel
        </button>
        <button type="button" className={b} onClick={() => director.playFrom("auto")}>
          Auto
        </button>
        <button type="button" className={b} onClick={() => director.playFrom("sys")}>
          Systems
        </button>
        <button type="button" className={b} onClick={() => director.set(END)}>
          Final
        </button>
        <button type="button" className={b} onClick={() => director.playAll()}>
          Replay all
        </button>
        <button type="button" className={`${b} col-span-3`} onClick={() => setHideText(!hideText)}>
          {hideText ? "Show text" : "Hide text"}
        </button>
      </div>
      <pre className="mt-2 font-mono text-[10.5px] text-slate-400">
        {Object.entries(director.p)
          .map(([k, v]) => `${k.padEnd(6)} ${v.toFixed(3)}`)
          .join("\n")}
        {`\nactive ${director.active ?? "-"}  idle ${director.idle > 0 ? director.idle.toFixed(1) : "-"}`}
      </pre>
    </div>
  );
}
