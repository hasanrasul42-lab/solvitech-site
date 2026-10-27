"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  FINAL_STATE,
  INITIAL_STATE,
  MOVABLE_JOB,
  SCENE_START,
  TIMELINE,
  bizReducer,
  techName,
  type BizAction,
  type BizState,
  type SceneId,
  type SlotId,
  type TechId,
} from "./business";

type EngineAction = BizAction | { type: "set"; state: BizState };
const engineReducer = (s: BizState, a: EngineAction): BizState => (a.type === "set" ? a.state : bizReducer(s, a));

/**
 * Plays the TIMELINE through the reducer in real time. Pauses whenever the
 * stage is not visible or the tab is hidden, and resumes where it left off.
 */
export function useBizEngine({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  const [state, dispatch] = useReducer(engineReducer, INITIAL_STATE);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const stateRef = useRef(state);
  const play = useRef({ index: 0, until: TIMELINE.length, elapsed: 0, startedAt: 0 });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const active = playing && visible && tabVisible;

  // The clock: fire every event that is due, then sleep until the next one.
  useEffect(() => {
    if (!active) return;
    const p = play.current;
    p.startedAt = performance.now() - p.elapsed;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const now = performance.now() - p.startedAt;
      while (p.index < p.until && TIMELINE[p.index][0] <= now) {
        dispatch(TIMELINE[p.index][1]);
        p.index++;
      }
      p.elapsed = now;
      if (p.index >= p.until) {
        setPlaying(false);
        return;
      }
      timer = setTimeout(step, TIMELINE[p.index][0] - now);
    };
    step();
    return () => {
      clearTimeout(timer);
      p.elapsed = performance.now() - p.startedAt;
    };
  }, [active]);

  /** Play the whole presentation from the start (or show its end state under reduced motion). */
  const start = useCallback(() => {
    setStarted(true);
    if (reduced) {
      play.current = { index: TIMELINE.length, until: TIMELINE.length, elapsed: 0, startedAt: 0 };
      dispatch({ type: "set", state: FINAL_STATE });
      setPlaying(false);
      return;
    }
    play.current = { index: 0, until: TIMELINE.length, elapsed: 0, startedAt: 0 };
    dispatch({ type: "set", state: INITIAL_STATE });
    setPlaying(true);
  }, [reduced]);

  /** Development: replay one scene from the state just before it, then stop. */
  const playScene = useCallback((scene: SceneId) => {
    const from = SCENE_START[scene];
    const order: SceneId[] = ["ai", "automation", "systems"];
    const next = order[order.indexOf(scene) + 1];
    const until = next ? SCENE_START[next] : TIMELINE.length;
    let s = INITIAL_STATE;
    for (let i = 0; i < from; i++) s = bizReducer(s, TIMELINE[i][1]);
    // Earlier scenes' results stay; this scene's own progress starts fresh.
    s = { ...s, [scene]: 0, done: false };
    setStarted(true);
    play.current = { index: from, until, elapsed: TIMELINE[from][0] - 200, startedAt: 0 };
    dispatch({ type: "set", state: s });
    setPlaying(true);
  }, []);

  /** Apply whatever is left of the presentation immediately. */
  const finish = useCallback(() => {
    const p = play.current;
    let s = stateRef.current;
    for (let i = p.index; i < TIMELINE.length; i++) s = bizReducer(s, TIMELINE[i][1]);
    play.current = { index: TIMELINE.length, until: TIMELINE.length, elapsed: 0, startedAt: 0 };
    dispatch({ type: "set", state: s });
    setPlaying(false);
    setStarted(true);
    return s;
  }, []);

  /** The visitor's own scheduling change (Custom Systems exploration). */
  const moveJob = useCallback(
    (tech: TechId, slot: SlotId) => {
      finish();
      dispatch({ type: "move", job: MOVABLE_JOB, tech, slot, by: "you" });
      dispatch({ type: "systems", step: 4 });
      dispatch({
        type: "log",
        entry: { time: "now", text: `${MOVABLE_JOB} moved to ${slot}:00 · ${techName(tech)} (you)`, by: "systems" },
      });
    },
    [finish],
  );

  return { state, playing, started, start, playScene, finish, moveJob };
}
