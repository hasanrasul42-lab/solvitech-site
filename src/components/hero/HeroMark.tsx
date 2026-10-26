"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import SceneErrorBoundary from "../mark/SceneErrorBoundary";
import { useMediaQuery, useOffscreen, useWebGLSupport } from "../mark/browser";
import { MARK_SVG_URL } from "../mark/markGeometry";
import { MARK_HEIGHT_FRACTION, MARK_MAX_WIDTH_FRACTION } from "./heroLayout";
import { DEFAULT_HERO_PRESET, HERO_PRESETS, type HeroPreset } from "./heroMotion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// solvitech-mark.svg: viewBox size and the ribbons' combined bounding box.
// The 3D mark is fitted by the ribbon box; the <img> shows the whole viewBox.
const VIEWBOX = { w: 443, h: 588 };
const RIBBON_BOX = { w: 420, h: 555 };

/** Static mark sized to land on the same silhouette as the 3D fit. */
const fallbackSize = {
  height: `min(${((MARK_HEIGHT_FRACTION * VIEWBOX.h) / RIBBON_BOX.h) * 100}cqh, ${
    ((MARK_MAX_WIDTH_FRACTION * VIEWBOX.h) / RIBBON_BOX.w) * 100
  }cqw)`,
  width: "auto",
};

function StaticMark({ visible = true, fade }: { visible?: boolean; fade: boolean }) {
  return (
    <Image
      src={MARK_SVG_URL}
      alt=""
      width={VIEWBOX.w}
      height={VIEWBOX.h}
      unoptimized
      priority
      className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
      style={{
        ...fallbackSize,
        opacity: visible ? 1 : 0,
        transition: fade ? "opacity 700ms ease-out" : undefined,
      }}
    />
  );
}

/**
 * Ambient Solvitech sculpture for the public hero. Not interactive: it never
 * takes pointer or touch input, so it cannot be orbited or dragged and does not
 * block scrolling. Size it with the parent; it fills its box.
 *
 * - SSR / no WebGL / render error: the flat SVG mark.
 * - Reduced motion: a still 3D front pose, no arrival, drift or cursor tilt.
 * - Touch / coarse pointers: no cursor response, lower pixel ratio.
 */
export default function HeroMark({
  className = "",
  preset = DEFAULT_HERO_PRESET,
}: {
  className?: string;
  /** Cursor rotation/parallax envelope. */
  preset?: HeroPreset;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const hasWebGL = useWebGLSupport();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  const offscreen = useOffscreen(stage);

  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={stage}
      role="img"
      aria-label="Solvitech"
      className={`relative overflow-hidden [container-type:size] ${className}`}
    >
      <StaticMark visible={!ready} fade={!reducedMotion} />
      {hasWebGL && (
        <SceneErrorBoundary fallback={<StaticMark fade={false} />}>
          <div
            className="absolute inset-0"
            style={{ opacity: ready ? 1 : 0, transition: reducedMotion ? undefined : "opacity 500ms ease-out" }}
          >
            <HeroScene
              still={reducedMotion}
              followCursor={finePointer && !coarsePointer}
              interaction={HERO_PRESETS[preset]}
              paused={offscreen}
              anchor={stage}
              lowPower={coarsePointer}
              onReady={onReady}
            />
          </div>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
