"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery } from "@/components/mark/browser";
import BusinessStage from "./BusinessStage";
import {
  APPROVALS,
  CAPABILITIES,
  INVOICE_AMOUNT,
  JOBS,
  MOVABLE_JOB,
  QUOTE_ON_FILE,
  techName,
  validTargets,
  type SceneId,
} from "./business";
import { useBizEngine } from "./useBizEngine";

const CAPTION: Record<"intro" | SceneId | "overview", string> = {
  intro: "A sample field-service business, running on one operations platform.",
  ai: "AI reads a supplier email, pulls out the details and spots a £70 overcharge.",
  automation: "A scheduled rule finds an overdue approval, reminds the approver and escalates it.",
  systems: "An operator moves a job; schedule, availability and the job record update together.",
  overview: "One environment: an invoice to review, an approval escalated, a job rescheduled.",
};

const noop = () => () => {};
const readDev = () => new URLSearchParams(window.location.search).has("dev");

export default function IntelligentBusiness() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stageWrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState<SceneId | null>(null);
  const [explore, setExplore] = useState<SceneId | null>(null);
  const dev = useSyncExternalStore(noop, readDev, () => false);
  const engine = useBizEngine({ visible, reduced });
  const { state, playing, started, start } = engine;

  // Start when the stage is meaningfully visible; pause when it is not.
  useEffect(() => {
    const el = stageWrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio >= 0.25), {
      threshold: [0, 0.25, 0.5],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || started) return;
    const t = setTimeout(start, 0);
    return () => clearTimeout(t);
  }, [visible, started, start]);

  const sceneFocus = playing && state.scene !== "intro" && state.scene !== "overview" ? state.scene : null;
  const focus = preview ?? explore ?? sceneFocus;
  const caption = explore
    ? CAPTION[explore]
    : playing || state.done
      ? CAPTION[state.scene]
      : CAPTION.intro;

  const openExplore = (id: SceneId) => {
    if (playing) engine.finish();
    setExplore((cur) => (cur === id ? null : id));
  };
  const replay = () => {
    setExplore(null);
    setPreview(null);
    start();
  };

  return (
    <div>
      {/* data-* expose the engine's progress for testing and debugging. */}
      <div
        ref={stageWrap}
        data-scene={state.scene}
        data-ai={state.ai}
        data-automation={state.automation}
        data-systems={state.systems}
        data-done={state.done}
      >
        <BusinessStage
          state={state}
          focus={focus}
          started={started || reduced}
          reduced={reduced}
          exploreSystems={explore === "systems"}
          onMove={engine.moveJob}
          label="Illustrative simulation · sample business and data"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="min-h-[1.5rem] text-[0.9375rem] text-foreground/85" aria-live="polite">
          {caption}
        </p>
        <div className="flex gap-2">
          {explore && (
            <button type="button" onClick={() => setExplore(null)} className={smallBtn}>
              Back to overview
            </button>
          )}
          <button type="button" onClick={replay} className={smallBtn}>
            <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Replay
          </button>
        </div>
      </div>

      {/* Capability rail: always visible identities; hover/focus moves the camera, click explores. */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {CAPABILITIES.map((c) => {
          const current = focus === c.id;
          const doneHere =
            (c.id === "ai" && state.ai >= 6) ||
            (c.id === "automation" && state.automation >= 6) ||
            (c.id === "systems" && state.systems >= 4);
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={explore === c.id}
              onClick={() => openExplore(c.id)}
              onMouseEnter={() => setPreview(c.id)}
              onMouseLeave={() => setPreview(null)}
              onFocus={() => setPreview(c.id)}
              onBlur={() => setPreview(null)}
              className={`rounded-2xl border p-5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft ${
                current ? "border-accent/50 bg-accent/[0.07]" : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <span className="block text-xs font-medium uppercase tracking-[0.16em] text-accent-soft">{c.verb}</span>
              <span className="mt-2 block text-xl font-semibold tracking-[-0.015em] text-foreground">{c.name}</span>
              <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{c.line}</span>
              <span
                className={`mt-3 block border-t border-white/[0.06] pt-3 text-sm leading-snug transition-opacity duration-500 ${
                  doneHere ? "text-foreground/90 opacity-100" : "text-subtle opacity-70"
                }`}
              >
                {doneHere ? c.result : "In the demonstration…"}
              </span>
            </button>
          );
        })}
      </div>

      {explore && <Explore id={explore} engine={engine} />}
      {dev && <DevPanel engine={engine} />}
    </div>
  );
}

const smallBtn =
  "inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

function Explore({ id, engine }: { id: SceneId; engine: ReturnType<typeof useBizEngine> }) {
  const { state } = engine;
  return (
    <div className="mt-4 rounded-2xl border border-accent/25 bg-accent/[0.04] p-5 md:p-6">
      {id === "ai" && (
        <>
          <p className="text-base font-semibold text-foreground">What the AI-assisted step did (simulated)</p>
          <ol className="mt-3 grid gap-2 text-[0.9375rem] leading-relaxed text-muted md:grid-cols-2">
            <li>1. Read a supplier email about JOB-1042.</li>
            <li>2. Picked out the invoice number, amount and delivery date.</li>
            <li>
              3. Compared the &pound;{INVOICE_AMOUNT} invoice with the &pound;{QUOTE_ON_FILE} quote on file.
            </li>
            <li>
              4. Flagged the &pound;{INVOICE_AMOUNT - QUOTE_ON_FILE} difference for a person to review. Nothing was
              approved automatically.
            </li>
          </ol>
        </>
      )}
      {id === "automation" && (
        <>
          <p className="text-base font-semibold text-foreground">What the automation did</p>
          <p className="mt-3 max-w-[60rem] text-[0.9375rem] leading-relaxed text-muted">
            The rule runs every working day at 09:30. Today it found {APPROVALS["PO-318"].id} waiting{" "}
            {APPROVALS["PO-318"].days} days, reminded {APPROVALS["PO-318"].approver} and escalated it to Priya.{" "}
            {APPROVALS["PO-322"].id} had only waited {APPROVALS["PO-322"].days} day, so it was left alone. Both actions
            are recorded in the activity history, with no one coordinating it by hand.
          </p>
        </>
      )}
      {id === "systems" && (
        <>
          <p className="text-base font-semibold text-foreground">
            Try it: move {MOVABLE_JOB} ({JOBS[MOVABLE_JOB].title}) to another free slot
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
            Only gas-qualified engineers are offered. The schedule, availability, job record and overview update
            together. You can also use the dashed slots in the schedule.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {validTargets(state, MOVABLE_JOB).map((t) => (
              <button
                key={t.tech + t.slot}
                type="button"
                onClick={() => engine.moveJob(t.tech, t.slot)}
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
              >
                {techName(t.tech)} &middot; {t.slot}:00
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Development only (?dev=1): replay and inspect the three scenes individually. */
function DevPanel({ engine }: { engine: ReturnType<typeof useBizEngine> }) {
  const { state } = engine;
  return (
    <div className="fixed bottom-4 left-4 z-50 w-72 rounded-xl border border-white/10 bg-[#0b1220]/95 p-3 text-xs text-slate-300 shadow-2xl backdrop-blur">
      <p className="mb-2 font-medium uppercase tracking-[0.14em] text-slate-400">Scene engine (dev)</p>
      <div className="grid grid-cols-3 gap-1.5">
        {(["ai", "automation", "systems"] as SceneId[]).map((s) => (
          <button key={s} type="button" className="rounded-md border border-white/10 px-2 py-1.5 hover:border-white/30" onClick={() => engine.playScene(s)}>
            {s}
          </button>
        ))}
        <button type="button" className="col-span-2 rounded-md border border-white/10 px-2 py-1.5 hover:border-white/30" onClick={engine.start}>
          Restart all
        </button>
        <button type="button" className="rounded-md border border-white/10 px-2 py-1.5 hover:border-white/30" onClick={engine.finish}>
          Finish
        </button>
      </div>
      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-[10.5px] text-slate-400">
        {JSON.stringify(
          {
            scene: state.scene,
            ai: state.ai,
            automation: state.automation,
            systems: state.systems,
            playing: engine.playing,
            job: state.jobs[MOVABLE_JOB],
            approvals: state.approvals,
            review: state.review,
            done: state.done,
          },
          null,
          1,
        )}
      </pre>
    </div>
  );
}
