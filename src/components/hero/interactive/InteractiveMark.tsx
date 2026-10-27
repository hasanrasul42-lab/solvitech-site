"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import Image from "next/image";
import SceneErrorBoundary from "../../mark/SceneErrorBoundary";
import { useMediaQuery, useOffscreen, useWebGLSupport } from "../../mark/browser";
import {
  AMPLITUDE,
  DEFAULT_RESPONSE,
  ENTRANCE,
  MARK_ENTRANCE_EVENT,
  RESPONSE_PRESETS,
  createInteractionInput,
  entranceEase,
  type EntranceProgress,
  type EntranceState,
  type InteractionInput,
  type MarkEntranceDetail,
  type ResponsePreset,
} from "./interactionConfig";
import { POSTER, RIBBON_BOX, RIBBON_BOX_CSS, VIEWBOX, posterUrls } from "./layout";
import type { Lighting } from "./InteractiveScene";
import type { MoveId } from "./moves";

// The 3D scene chunk starts loading as soon as this module runs in the
// browser. It is deliberately not next/dynamic (React.lazy): a lazy component
// suspends once even when its chunk is ready, and React 19 then holds back the
// reveal of that boundary for ~300 ms -- a dead wait before the entrance.
// Instead the loaded module is read from a tiny external store (no Suspense).
type SceneModule = typeof import("./InteractiveScene");
let sceneModule: SceneModule | null = null;
const sceneListeners = new Set<() => void>();
if (typeof window !== "undefined") {
  void import("./InteractiveScene").then((mod) => {
    sceneModule = mod;
    sceneListeners.forEach((listener) => listener());
  });
}
const subscribeScene = (listener: () => void) => {
  sceneListeners.add(listener);
  return () => sceneListeners.delete(listener);
};
const useSceneModule = () => useSyncExternalStore(subscribeScene, () => sceneModule, () => null);

const REFERENCE = { url: "/brand/original-reference.png", size: 1254, svgOriginX: 407, svgOriginY: 331 };

/** Pixels of travel before a touch counts as a drag rather than a tap. */
const DRAG_THRESHOLD = 10;
/** Touch only: presses longer than this are not taps (long-press / scroll intent). */
const TAP_MAX_MS = 700;

const deg = (d: number) => (d * Math.PI) / 180;

/** Centred box with the ribbons' bounding-box proportions, scaled by `scale`. */
function ribbonBoxStyle(scale = 1) {
  return {
    height: scale === 1 ? RIBBON_BOX_CSS.height : `calc(${RIBBON_BOX_CSS.height} * ${scale})`,
    aspectRatio: RIBBON_BOX_CSS.aspectRatio,
  };
}

/** Box the posters were cropped to: the ribbon box scaled by POSTER.scaleX/Y. */
const posterBoxStyle = {
  height: `calc(${RIBBON_BOX_CSS.height} * ${POSTER.scaleY})`,
  aspectRatio: `${RIBBON_BOX.w * POSTER.scaleX} / ${RIBBON_BOX.h * POSTER.scaleY}`,
};

/**
 * 3D-rendered posters of the real scene, shown until the WebGL canvas takes
 * over. They never move: all motion is performed by the real geometry.
 * - First paint: the start-pose poster (~14KB). A <picture> media source swaps
 *   in the resting-pose poster for reduced-motion visitors, so they never see
 *   an entrance pose.
 * - Fallback (WebGL slow or unavailable): the start poster fades out while the
 *   resting-pose poster (~96KB, only requested then) fades in just behind it,
 *   so the two poses never show as a double exposure.
 */
function Posters({
  layerRef,
  final,
  restOnly = false,
  lighting = "approved",
}: {
  layerRef?: RefObject<HTMLDivElement | null>;
  final: boolean;
  /** restStart: only the resting-pose poster, with no swap animation. */
  restOnly?: boolean;
  lighting?: Lighting;
}) {
  const layer = "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  const urls = posterUrls(lighting);
  if (restOnly) {
    return (
      <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- plain, unoptimised poster asset */}
        <img
          src={urls.finalUrl}
          alt=""
          fetchPriority="high"
          decoding="async"
          className={layer}
          style={posterBoxStyle}
        />
      </div>
    );
  }
  return (
    // Hidden at hand-over (inline opacity, set directly by the controller).
    // The first-paint arrival is on the stage (.mark-arrive), shared with the canvas.
    <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0">
      <picture className={`${layer} ${final ? "mark-poster-out" : ""}`} style={posterBoxStyle}>
        <source srcSet={urls.finalUrl} media="(prefers-reduced-motion: reduce)" />
        <img src={urls.startUrl} alt="" fetchPriority="high" decoding="async" className="h-full w-full" />
      </picture>
      {final && (
        <div className={`${layer} mark-poster-fallback`} style={posterBoxStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element -- plain, unoptimised poster asset */}
          <img src={urls.finalUrl} alt="" decoding="async" className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

/** original-reference.png cropped to the ribbon box, for front-view checks. */
function ReferenceOverlay({ opacity }: { opacity: number }) {
  const left = REFERENCE.svgOriginX + VIEWBOX.ribbonX;
  const top = REFERENCE.svgOriginY + VIEWBOX.ribbonY;
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ ...ribbonBoxStyle(), opacity }}
    >
      <Image
        src={REFERENCE.url}
        alt=""
        width={REFERENCE.size}
        height={REFERENCE.size}
        unoptimized
        className="absolute max-w-none"
        style={{
          width: `${(REFERENCE.size / RIBBON_BOX.w) * 100}%`,
          height: `${(REFERENCE.size / RIBBON_BOX.h) * 100}%`,
          left: `${(-left / RIBBON_BOX.w) * 100}%`,
          top: `${(-top / RIBBON_BOX.h) * 100}%`,
        }}
      />
    </div>
  );
}

export interface InteractiveMarkProps {
  className?: string;
  /** Cursor rotation/parallax strength. */
  response?: ResponsePreset;
  /** Change to reset the interaction state and replay the arrival. */
  resetToken?: number;
  /** Preview only: overlay original-reference.png and hold the front pose. */
  referenceOpacity?: number;
  /**
   * Preview only: change the token to play a specific move, the next shuffled
   * move, or the last move again. Ordinary clicks always use the shuffle bag.
   */
  moveRequest?: { move: MoveId | "shuffle" | "replay"; token: number };
  /** Preview only: told which move starts on each accepted click. */
  onMoveStart?: (id: MoveId) => void;
  /**
   * Poster capture only (/3d-lab/poster-capture, archive branch): render the scene frozen at
   * entrance pose q, with no posters, idle, cursor response or hit target.
   */
  captureQ?: number;
  /**
   * Start at the resting pose instead of playing the 3D entrance: the
   * resting-pose poster shows first and the 3D takes over at that pose when
   * ready. For entrances choreographed outside the mark (entrance prototype).
   */
  restStart?: boolean;
  /**
   * restStart: cursor response and idle drift blend in from this
   * performance.now() time (or from the 3D takeover, whichever is later).
   */
  interactiveFrom?: number;
  /** Lab only: report the 3D as ready no earlier than this performance.now() time. */
  debugReadyAt?: number;
  /** Lab only: behave as if WebGL were unavailable. */
  debugNoWebGL?: boolean;
  /** Rendered inside the stage, above the mark (moves with the stage). */
  overlay?: ReactNode;
  /** Background halo and shadow treatment (A/B); posters follow it. */
  lighting?: Lighting;
}

/**
 * Interactive 3D Solvitech mark for the homepage hero.
 *
 * Entrance (one continuous 3D arrival):
 *   poster    -> a 3D-rendered poster of the real scene at the start pose
 *                shows at first paint (opacity fade only);
 *   handover  -> once WebGL has rendered, the canvas fades in over it at
 *                exactly the same pose;
 *   entering  -> the real geometry moves from the start pose to rest, with
 *                cursor response and idle drift blending in over the end;
 *   complete
 *   fallback  -> WebGL not ready within ENTRANCE.maxWaitMs (or unavailable,
 *                or reduced motion): crossfade to the resting-pose poster; the
 *                3D later takes over at rest. No late entrance.
 *
 * Input (all handled outside React state, so pointer movement never
 * re-renders):
 * - Cursor anywhere on the page tilts the mark towards it, with parallax.
 *   The cursor is tracked from hydration, before the 3D exists.
 * - No hover state: the mark responds to the cursor the same way everywhere;
 *   over the mark it is simply clickable.
 * - Click / tap / Enter / Space: one of five acrobatic moves (moves.ts),
 *   drawn from a shuffle bag. Extra requests during an animation are dropped.
 * - Touch: horizontal drag previews rotation, release returns; vertical
 *   swipes scroll the page (touch-action: pan-y).
 * - Arrow keys tilt in steps; Escape or blur recentres.
 */
export default function InteractiveMark({
  className = "",
  response = DEFAULT_RESPONSE,
  resetToken = 0,
  referenceOpacity = 0,
  moveRequest,
  onMoveStart,
  captureQ,
  restStart = false,
  interactiveFrom = 0,
  debugReadyAt = 0,
  debugNoWebGL = false,
  overlay,
  lighting = "approved",
}: InteractiveMarkProps) {
  const capture = captureQ !== undefined;
  const stage = useRef<HTMLDivElement>(null);
  const hitBox = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InteractionInput | null>(null);
  if (inputRef.current === null) inputRef.current = createInteractionInput();

  const detectedWebGL = useWebGLSupport();
  const hasWebGL = debugNoWebGL ? false : detectedWebGL;
  const InteractiveScene = useSceneModule()?.default;
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const smallScreen = useMediaQuery("(max-width: 640px)");
  const offscreen = useOffscreen(stage);
  const descriptionId = useId();
  const strength = RESPONSE_PRESETS[response];

  // --- Entrance controller --------------------------------------------------
  // `ready`      the scene has rendered real frames; the canvas fades in over
  //              the poster (which stays fully opaque underneath).
  // `fallback`   no 3D entrance: the resting-pose poster is shown instead.
  // After hand-over the posters are hidden via `posterLayer` (no re-render).
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  // Fallback only: the canvas fades in once the resting poster has arrived.
  const [canvasShown, setCanvasShown] = useState(false);
  const timedOutAt = useRef(0);
  const takeoverAt = useRef(0);
  const debugReadyAtRef = useRef(debugReadyAt);
  useEffect(() => {
    debugReadyAtRef.current = debugReadyAt;
  }, [debugReadyAt]);
  const onReady = useCallback(() => {
    const wait = debugReadyAtRef.current - performance.now();
    if (wait > 0) setTimeout(() => setReady(true), wait);
    else setReady(true);
  }, []);
  const interactiveFromRef = useRef(interactiveFrom);
  useEffect(() => {
    interactiveFromRef.current = interactiveFrom;
  }, [interactiveFrom]);

  /** "pending" until the entrance runs; "running" while it plays; "rest" = q 1. */
  const entranceMode = useRef<"pending" | "running" | "rest">(restStart ? "rest" : "pending");
  /**
   * Frame-paced entrance clock. Each rendered frame advances the entrance by
   * its real interval, capped near the display's normal frame time, so a
   * main-thread hitch slows the motion for a frame instead of making the
   * mark jump (most visible at the start, where the entrance is fastest).
   * `frame` is an average of normal frame intervals, measured from the
   * hand-over frames onwards.
   */
  const entranceClock = useRef({ last: 0, elapsed: 0, frame: 1000 / 60 });
  const posterLayer = useRef<HTMLDivElement>(null);

  // Exposed on the stage as data-entrance (for tests and debugging); no React state.
  const setEntranceState = useCallback(
    (state: EntranceState) => stage.current?.setAttribute("data-entrance", state),
    [],
  );

  const getEntrance = useCallback((): EntranceProgress => {
    if (captureQ !== undefined) return { q: captureQ, t: 0 };
    const now = performance.now();
    if (entranceMode.current === "rest") {
      if (!timedOutAt.current && !restStart) return { q: 1, t: 1 };
      // Took over from the resting poster: the first frames match it exactly
      // (no cursor tilt yet), then cursor response and idle drift blend in.
      const from = Math.max(takeoverAt.current + ENTRANCE.handoverMs, interactiveFromRef.current);
      const since = takeoverAt.current ? now - from : -1;
      const x = Math.min(1, Math.max(0, since / ENTRANCE.takeoverEngageMs));
      return { q: 1, t: 1, engage: x * x * (3 - 2 * x) };
    }
    const clock = entranceClock.current;
    const dt = clock.last ? now - clock.last : 0;
    clock.last = now;
    // A single long frame barely moves the estimate; a genuinely slower
    // display (e.g. 30 fps) still raises it within a few frames.
    if (dt > 0) clock.frame += (Math.min(dt, clock.frame * 2) - clock.frame) * 0.15;
    if (entranceMode.current === "pending") return { q: 0, t: 0 };
    clock.elapsed += Math.min(dt, clock.frame * 1.5);
    const t = Math.min(1, clock.elapsed / ENTRANCE.durationMs);
    if (t >= 1) {
      entranceMode.current = "rest";
      setEntranceState("complete");
    }
    return { q: entranceEase(t), t };
  }, [captureQ, restStart, setEntranceState]);

  // No 3D entrance (reduced motion, no WebGL): show the resting poster.
  useEffect(() => {
    if (capture) return;
    if (reducedMotion || hasWebGL === false) {
      entranceMode.current = "rest";
      setEntranceState("fallback");
    }
  }, [reducedMotion, hasWebGL, capture, setEntranceState]);

  // Bounded wait: if WebGL has not rendered by maxWaitMs after navigation
  // start, settle on the resting poster instead of a late entrance.
  useEffect(() => {
    if (capture || ready) return;
    const remaining = Math.max(0, ENTRANCE.maxWaitMs - performance.now());
    const timer = setTimeout(() => {
      if (entranceMode.current !== "pending") return;
      entranceMode.current = "rest";
      timedOutAt.current = performance.now();
      setTimedOut(true);
      setEntranceState("fallback");
    }, remaining);
    return () => clearTimeout(timer);
  }, [ready, capture, setEntranceState]);

  // Hand-over: canvas fades in over the poster at the same pose, then the
  // entrance starts on the real geometry (or, after a fallback, it is already
  // at rest and replaces the resting poster once that has fully arrived, so
  // the two never overlap mid-swap).
  useEffect(() => {
    if (!ready || capture) return;
    if (entranceMode.current === "pending") setEntranceState("handover");
    const fade = reducedMotion ? 0 : ENTRANCE.handoverMs;
    const wait = timedOutAt.current
      ? Math.max(0, timedOutAt.current + ENTRANCE.fallbackPosterMs - performance.now())
      : 0;
    const show = setTimeout(() => {
      takeoverAt.current = performance.now();
      if (timedOutAt.current) setCanvasShown(true);
    }, wait);
    const timer = setTimeout(() => {
      if (entranceMode.current === "pending") {
        entranceMode.current = "running";
        entranceClock.current.elapsed = 0;
        setEntranceState("entering");
        // Lets the hero copy (already moving since first paint) retime itself
        // to finish exactly with the mark.
        const detail: MarkEntranceDetail = { endsAt: performance.now() + ENTRANCE.durationMs };
        stage.current?.dispatchEvent(new CustomEvent(MARK_ENTRANCE_EVENT, { bubbles: true, detail }));
      } else {
        setEntranceState("complete");
      }
      // Hide the posters directly: a React update here would re-render the
      // canvas tree in the entrance's first (fastest) frames.
      if (posterLayer.current) posterLayer.current.style.opacity = "0";
    }, wait + fade + 20);
    return () => {
      clearTimeout(show);
      clearTimeout(timer);
    };
  }, [ready, reducedMotion, capture, setEntranceState]);

  // The scene registers its frame-request function here; input handlers call
  // wake() after writing to the input object.
  const wakeRef = useRef<() => void>(() => {});
  const wake = useCallback(() => wakeRef.current(), []);
  const registerWake = useCallback((fn: () => void) => {
    wakeRef.current = fn;
    return () => {
      wakeRef.current = () => {};
    };
  }, []);

  // Reset requests from the parent (preview): replay the 3D entrance.
  const lastReset = useRef(resetToken);
  useEffect(() => {
    if (resetToken === lastReset.current) return;
    lastReset.current = resetToken;
    const input = inputRef.current!;
    input.resetRequests++;
    input.keyYaw = input.keyPitch = 0;
    input.dragging = false;
    if (!reducedMotion) {
      entranceMode.current = "running";
      entranceClock.current.elapsed = 0;
      entranceClock.current.last = 0;
      setEntranceState("entering");
    }
    wake();
  }, [resetToken, wake, reducedMotion, setEntranceState]);

  // Explicit move requests from the preview panel.
  const lastMoveToken = useRef(moveRequest?.token ?? 0);
  useEffect(() => {
    if (!moveRequest || moveRequest.token === lastMoveToken.current) return;
    lastMoveToken.current = moveRequest.token;
    const input = inputRef.current!;
    input.requestedMove = moveRequest.move === "shuffle" ? null : moveRequest.move;
    input.spinRequests++;
    wake();
  }, [moveRequest, wake]);

  // Cursor position relative to the (fixed) stage centre, normalised by half
  // the viewport. Tracked from hydration, so the target is already correct
  // when the entrance blends pointer control in.
  useEffect(() => {
    const input = inputRef.current!;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = stage.current?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      input.pointer.set(
        Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))),
        Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))),
      );
      wake();
    };
    const reset = () => {
      input.pointer.set(0, 0);
      wake();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [wake]);

  // --- Gesture handling on the mark ----------------------------------------
  const gesture = useRef<{ id: number; x0: number; y0: number; t0: number; moved: boolean; drag: boolean } | null>(
    null,
  );

  const requestSpin = () => {
    const input = inputRef.current!;
    input.requestedMove = null; // ordinary activation: next move from the shuffle bag
    input.spinRequests++;
    wake();
  };
  const endDrag = () => {
    const input = inputRef.current!;
    if (input.dragging) {
      input.dragging = false;
      wake();
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    gesture.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false, drag: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x0;
    const dy = e.clientY - g.y0;
    if (!g.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) g.moved = true;
    if (e.pointerType === "mouse") return; // mouse: tilt follows the cursor, no drag-rotate
    // Touch: a mostly horizontal move becomes a rotation preview. Vertical
    // moves are left to the browser (pan-y), which scrolls and cancels us.
    if (!g.drag && g.moved && Math.abs(dx) > Math.abs(dy) * 1.2) {
      g.drag = true;
      inputRef.current!.dragging = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Pointer already released (or synthetic); dragging still works uncaptured.
      }
    }
    if (g.drag) {
      const width = e.currentTarget.getBoundingClientRect().width || 1;
      const max = deg(AMPLITUDE.dragMaxYawDeg);
      inputRef.current!.dragYaw = Math.max(-max, Math.min(max, (dx / width) * 2 * max));
      wake();
    }
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== e.pointerId) return;
    if (g.drag) {
      endDrag();
      return;
    }
    // A press-and-release on the target with no real travel is a click. Mouse
    // clicks have no time limit (a slow click is still a click).
    const quick = e.pointerType === "mouse" || performance.now() - g.t0 < TAP_MAX_MS;
    if (!g.moved && quick) requestSpin();
  };
  const onPointerCancel = () => {
    gesture.current = null;
    endDrag();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current!;
    const step = deg(AMPLITUDE.keyStepDeg);
    const maxYaw = deg(strength.yawDeg);
    const maxPitch = deg(strength.pitchDeg);
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!e.repeat) requestSpin();
        return;
      case "ArrowLeft":
        input.keyYaw = Math.max(-maxYaw, input.keyYaw - step);
        break;
      case "ArrowRight":
        input.keyYaw = Math.min(maxYaw, input.keyYaw + step);
        break;
      case "ArrowUp":
        input.keyPitch = Math.max(-maxPitch, input.keyPitch - step);
        break;
      case "ArrowDown":
        input.keyPitch = Math.min(maxPitch, input.keyPitch + step);
        break;
      case "Escape":
      case "Home":
        input.keyYaw = input.keyPitch = 0;
        break;
      default:
        return;
    }
    e.preventDefault();
    wake();
  };
  const onBlur = () => {
    const input = inputRef.current!;
    input.keyYaw = input.keyPitch = 0;
    wake();
  };

  const interactive = hasWebGL === true;
  // Normal path: the canvas fades in as soon as it is ready. Fallback: only
  // once the resting poster has fully arrived (canvasShown).
  const canvasVisible = capture || (ready && !timedOut) || canvasShown;
  // Resting-pose poster: no 3D entrance will play.
  const fallback = timedOut || reducedMotion || hasWebGL === false;

  return (
    <div
      ref={stage}
      data-entrance="poster"
      className={`relative overflow-hidden [container-type:size] ${capture || restStart ? "" : "mark-arrive"} ${className}`}
      {...(!interactive ? { role: "img", "aria-label": "Solvitech" } : {})}
    >
      {!capture && <Posters layerRef={posterLayer} final={fallback} restOnly={restStart} lighting={lighting} />}
      {interactive && (
        <SceneErrorBoundary fallback={<Posters final restOnly={restStart} lighting={lighting} />}>
          <div
            className="absolute inset-0"
            style={{
              opacity: canvasVisible ? 1 : 0,
              transition: capture || reducedMotion ? undefined : `opacity ${ENTRANCE.handoverMs}ms linear`,
            }}
          >
            {InteractiveScene && (
              <InteractiveScene
                input={inputRef as RefObject<InteractionInput>}
                registerWake={registerWake}
                getEntrance={getEntrance}
                frozen={capture}
                response={strength}
                reducedMotion={reducedMotion}
                holdFront={referenceOpacity > 0}
                paused={offscreen}
                lowPower={coarsePointer || smallScreen}
                onReady={onReady}
                onMoveStart={onMoveStart}
                layoutSized={restStart}
                lighting={lighting}
              />
            )}
          </div>
        </SceneErrorBoundary>
      )}
      {referenceOpacity > 0 && <ReferenceOverlay opacity={referenceOpacity} />}
      {overlay}
      {interactive && !capture && (
        <>
          <div
            ref={hitBox}
            role="button"
            tabIndex={0}
            aria-label="Solvitech logo"
            aria-describedby={descriptionId}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none rounded-[32px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5c9dff]"
            style={{ ...ribbonBoxStyle(1.12), touchAction: "pan-y" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
          <span id={descriptionId} className="sr-only">
            {reducedMotion
              ? "Press Enter or Space to illuminate the logo. Use the arrow keys to tilt it."
              : "Press Enter or Space to spin the logo. Use the arrow keys to tilt it, Escape to recentre."}
          </span>
        </>
      )}
    </div>
  );
}
