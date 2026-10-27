"use client";

import { useEffect, useReducer, useRef } from "react";
import { useMediaQuery } from "@/components/mark/browser";
import DemoStage from "./DemoStage";
import { APPLIES, SCENARIOS, STEPS, type ScenarioId } from "./scenarios";

/*
 * Solutions prototype: choose a request, run it, watch a service desk handle
 * it, see the outcome. A real UI state machine drives everything; outcomes
 * are always derived from the selected scenario, and all of it runs locally.
 *
 *   ready --run--> running (steps 1..5, timed) --> done
 *     ^  select / reset                              |
 *     +---------------------------------------------+  (run again)
 */

type Status = "ready" | "running" | "done";
interface State {
  scenario: ScenarioId;
  status: Status;
  /** Steps completed: 0 (none) .. 5 (team notified). */
  step: number;
  /** Bumped on every run/select/reset so stale timers are ignored. */
  run: number;
}
type Action =
  | { type: "select"; id: ScenarioId }
  | { type: "run"; instant: boolean }
  | { type: "advance"; run: number }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select":
      return { scenario: action.id, status: "ready", step: 0, run: state.run + 1 };
    case "run":
      if (state.status === "running") return state;
      return action.instant
        ? { ...state, status: "done", step: 5, run: state.run + 1 }
        : { ...state, status: "running", step: 1, run: state.run + 1 };
    case "advance":
      if (action.run !== state.run || state.status !== "running") return state;
      return state.step < 5 ? { ...state, step: state.step + 1 } : { ...state, status: "done" };
    case "reset":
      return { ...state, status: "ready", step: 0, run: state.run + 1 };
  }
}

/** How long each completed step stays in view before the next (index = step). */
const STEP_MS = [0, 1100, 1000, 1100, 1200, 1000];

export default function SolutionsDemo() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [state, dispatch] = useReducer(reducer, { scenario: "urgent", status: "ready", step: 0, run: 0 });
  const stageWrap = useRef<HTMLDivElement>(null);
  const scenario = SCENARIOS.find((s) => s.id === state.scenario)!;
  const running = state.status === "running";

  // The clock: one timer per step, cancelled whenever the state moves on.
  useEffect(() => {
    if (state.status !== "running") return;
    const run = state.run;
    const timer = setTimeout(() => dispatch({ type: "advance", run }), STEP_MS[state.step]);
    return () => clearTimeout(timer);
  }, [state.status, state.step, state.run]);

  const start = () => {
    dispatch({ type: "run", instant: reduced });
    // On narrow screens the stage sits below the controls: bring it into view.
    const el = stageWrap.current;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight)
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  const announcement =
    state.status === "done"
      ? `Done. ${scenario.outcome}`
      : state.step > 0
        ? `${STEPS[state.step - 1]}: ${scenario.stepResults[state.step - 1]}`
        : "";

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Controls + what happened */}
      <div className="lg:col-span-4">
        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">1 &middot; Choose a request</legend>
          <div className="mt-4 grid gap-2.5">
            {SCENARIOS.map((s) => {
              const on = s.id === state.scenario;
              return (
                <label
                  key={s.id}
                  className={`group relative block cursor-pointer rounded-2xl border px-4 py-3.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-soft ${
                    on ? "border-accent/50 bg-accent/[0.08]" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={s.id}
                    checked={on}
                    onChange={() => dispatch({ type: "select", id: s.id })}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        on ? "border-accent" : "border-white/25"
                      }`}
                    >
                      {on && <span className="h-2 w-2 rounded-full bg-accent" />}
                    </span>
                    <span className="text-[1.0625rem] font-medium text-foreground">{s.label}</span>
                  </span>
                  <span className="mt-1.5 block pl-7 text-[0.9375rem] leading-snug text-muted">
                    &ldquo;{s.request.text}&rdquo;
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">2 &middot; Run it</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={start}
              disabled={running}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[0.9375rem] font-medium text-background transition-colors hover:bg-white disabled:cursor-default disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M4.5 2.8v10.4L13 8 4.5 2.8Z" />
              </svg>
              {running ? "Running…" : state.status === "done" ? "Run again" : "Run the request"}
            </button>
            {state.status !== "ready" && (
              <button
                type="button"
                onClick={() => dispatch({ type: "reset" })}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-5 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 3 · What happened (desktop: here; phones: below the stage) */}
        <Progress className="mt-8 hidden lg:block" state={state} results={scenario.stepResults} />
      </div>

      {/* The stage + outcome */}
      <div className="lg:col-span-8" ref={stageWrap}>
        <DemoStage
          scenario={scenario}
          step={state.step}
          running={running}
          reduced={reduced}
          finePointer={finePointer}
        />
        <Progress className="mt-6 lg:hidden" state={state} results={scenario.stepResults} />
        <div
          className={`mt-5 rounded-2xl border px-5 py-4 transition-colors duration-500 ${
            state.status === "done" ? "border-accent/35 bg-accent/[0.07]" : "border-white/[0.07] bg-white/[0.015]"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">Outcome</p>
          <p className="mt-1.5 text-[1.0625rem] leading-relaxed text-foreground">
            {state.status === "done"
              ? scenario.outcome
              : running
                ? "Watch the request move through the system…"
                : "Run the request to see what happens."}
          </p>
        </div>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>

      {/* How this applies */}
      <div className="border-t border-hairline pt-10 lg:col-span-12">
        <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground md:text-[1.75rem]">
          How we&rsquo;d build something like this for you
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3 md:gap-10">
          {APPLIES.map((a) => (
            <div key={a.name}>
              <p className="text-lg font-semibold text-foreground">{a.name}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{a.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[46rem] text-sm leading-relaxed text-subtle">
          Transparent by design: this demonstration uses predefined examples and runs entirely in your browser. The
          &ldquo;AI triage&rdquo; is simulated; in a real system, suggestions follow your rules and anything uncertain
          goes to a person.
        </p>
      </div>
    </div>
  );
}

function Progress({ state, results, className }: { state: State; results: readonly string[]; className: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">3 &middot; What happened</p>
      <ol className="mt-4 space-y-1">
        {STEPS.map((name, i) => {
          const done = state.step > i;
          const current = state.status === "running" && state.step === i + 1;
          return (
            <li key={name} aria-current={current ? "step" : undefined} className="flex gap-3 py-1.5">
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors duration-300 ${
                  done ? "border-accent bg-accent text-white" : "border-white/20 text-subtle"
                } ${current ? "ring-4 ring-accent/20" : ""}`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="min-w-0">
                <span className={`block text-[0.9375rem] ${done ? "text-foreground" : "text-subtle"}`}>{name}</span>
                <span
                  className={`block text-sm leading-snug text-muted transition-opacity duration-300 ${
                    done ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {done ? results[i] : " "}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
