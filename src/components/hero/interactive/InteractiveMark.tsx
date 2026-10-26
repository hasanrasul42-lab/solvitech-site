"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import SceneErrorBoundary from "../../mark/SceneErrorBoundary";
import { useMediaQuery, useOffscreen, useWebGLSupport } from "../../mark/browser";
import { MARK_SVG_URL } from "../../mark/markGeometry";
import {
  AMPLITUDE,
  DEFAULT_RESPONSE,
  RESPONSE_PRESETS,
  createInteractionInput,
  type InteractionInput,
  type ResponsePreset,
} from "./interactionConfig";
import { RIBBON_BOX, RIBBON_BOX_CSS, VIEWBOX } from "./layout";
import type { MoveId } from "./moves";

const InteractiveScene = dynamic(() => import("./InteractiveScene"), { ssr: false });

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

function StaticMark({ visible = true, fade }: { visible?: boolean; fade: boolean }) {
  // The <img> shows the whole SVG viewBox; scale the ribbon box up to it.
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ ...ribbonBoxStyle(), opacity: visible ? 1 : 0, transition: fade ? "opacity 700ms ease-out" : undefined }}
    >
      <Image
        src={MARK_SVG_URL}
        alt=""
        width={VIEWBOX.w}
        height={VIEWBOX.h}
        unoptimized
        priority
        className="absolute max-w-none"
        style={{
          width: `${(VIEWBOX.w / RIBBON_BOX.w) * 100}%`,
          height: `${(VIEWBOX.h / RIBBON_BOX.h) * 100}%`,
          left: `${(-VIEWBOX.ribbonX / RIBBON_BOX.w) * 100}%`,
          top: `${(-VIEWBOX.ribbonY / RIBBON_BOX.h) * 100}%`,
        }}
      />
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
}

/**
 * Interactive 3D Solvitech mark for the homepage hero.
 *
 * Input (all handled outside React state, so pointer movement never
 * re-renders):
 * - Cursor anywhere on the page tilts the mark towards it, with parallax.
 * - Hover over the mark: lift, stronger rim light and glow.
 * - Click / tap / Enter / Space: one of five acrobatic moves (moves.ts),
 *   drawn from a shuffle bag. Extra requests
 *   during an animation are dropped.
 * - Touch: horizontal drag previews rotation, release returns; vertical
 *   swipes scroll the page (touch-action: pan-y).
 * - Arrow keys tilt in steps; Escape or blur recentres.
 *
 * Fallbacks: SSR / no WebGL / render error show the flat SVG. Reduced motion
 * keeps the 3D front pose still and turns clicks into a light pulse.
 */
export default function InteractiveMark({
  className = "",
  response = DEFAULT_RESPONSE,
  resetToken = 0,
  referenceOpacity = 0,
  moveRequest,
  onMoveStart,
}: InteractiveMarkProps) {
  const stage = useRef<HTMLDivElement>(null);
  const hitBox = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InteractionInput | null>(null);
  if (inputRef.current === null) inputRef.current = createInteractionInput();

  const hasWebGL = useWebGLSupport();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const smallScreen = useMediaQuery("(max-width: 640px)");
  const offscreen = useOffscreen(stage);
  const descriptionId = useId();
  const strength = RESPONSE_PRESETS[response];

  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

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

  // Reset requests from the parent.
  const lastReset = useRef(resetToken);
  useEffect(() => {
    if (resetToken === lastReset.current) return;
    lastReset.current = resetToken;
    const input = inputRef.current!;
    input.resetRequests++;
    input.keyYaw = input.keyPitch = 0;
    input.dragging = false;
    wake();
  }, [resetToken, wake]);

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

  // Cursor position relative to the mark, normalised by half the viewport.
  useEffect(() => {
    const input = inputRef.current!;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = hitBox.current?.getBoundingClientRect() ?? stage.current?.getBoundingClientRect();
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
      input.hover = false;
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

  const onPointerEnter = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    inputRef.current!.hover = true;
    wake();
  };
  const onPointerLeave = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    inputRef.current!.hover = false;
    wake();
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

  return (
    <div
      ref={stage}
      className={`relative overflow-hidden [container-type:size] ${className}`}
      {...(!interactive ? { role: "img", "aria-label": "Solvitech" } : {})}
    >
      <StaticMark visible={!ready || !interactive} fade={!reducedMotion} />
      {interactive && (
        <SceneErrorBoundary fallback={<StaticMark fade={false} />}>
          <div
            className="absolute inset-0"
            style={{ opacity: ready ? 1 : 0, transition: reducedMotion ? undefined : "opacity 500ms ease-out" }}
          >
            <InteractiveScene
              input={inputRef as RefObject<InteractionInput>}
              registerWake={registerWake}
              response={strength}
              reducedMotion={reducedMotion}
              holdFront={referenceOpacity > 0}
              paused={offscreen}
              lowPower={coarsePointer || smallScreen}
              onReady={onReady}
              onMoveStart={onMoveStart}
            />
          </div>
        </SceneErrorBoundary>
      )}
      {referenceOpacity > 0 && <ReferenceOverlay opacity={referenceOpacity} />}
      {interactive && (
        <>
          <div
            ref={hitBox}
            role="button"
            tabIndex={0}
            aria-label="Solvitech logo"
            aria-describedby={descriptionId}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none rounded-[32px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5c9dff]"
            style={{ ...ribbonBoxStyle(1.12), touchAction: "pan-y" }}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
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
