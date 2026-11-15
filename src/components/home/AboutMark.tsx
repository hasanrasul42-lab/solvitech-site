"use client";

import { useEffect, useRef, useState, type ComponentType, type RefObject } from "react";
import { useMediaQuery, useOffscreen, useWebGLSupport } from "@/components/mark/browser";
import SceneErrorBoundary from "@/components/mark/SceneErrorBoundary";

/**
 * The About section's backdrop: the Solvitech mark as a transparent 3D
 * outline that turns towards the cursor (AboutMarkScene.tsx).
 *
 * This wrapper imports no 3D code, so the scene module (three.js, react-
 * three-fiber, drei) never weighs on the initial bundle. It is fetched and
 * drawn once straight after the page loads (during the intro), so it is
 * ready, with its shaders compiled, before anyone scrolls to About. Without
 * WebGL, or on a render error, the flat mark shows very faintly.
 */

type SceneProps = { live: boolean; anchor: RefObject<HTMLElement | null> };
let Scene: ComponentType<SceneProps> | null = null;

/** The flat mark, very faint: used without WebGL, before the scene loads and on error. */
function Poster() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- decorative SVG, no optimisation needed
    <img src="/brand/solvitech-mark.svg" alt="" className="absolute inset-0 m-auto h-[78%] w-auto opacity-[0.08]" />
  );
}

export default function AboutMark({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const webgl = useWebGLSupport();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const offscreen = useOffscreen(ref);
  const [loaded, setLoaded] = useState<ComponentType<SceneProps> | null>(() => Scene);

  // Fetch and draw the scene straight after load (during the intro).
  useEffect(() => {
    if (!webgl || loaded) return;
    let cancelled = false;
    void import("./AboutMarkScene").then((mod) => {
      Scene = mod.default;
      if (!cancelled) setLoaded(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, [webgl, loaded]);

  const live = fine && !reduced && !offscreen;
  const Loaded = loaded;

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
      {Loaded ? (
        <SceneErrorBoundary fallback={<Poster />}>
          <Loaded live={live} anchor={ref} />
        </SceneErrorBoundary>
      ) : (
        <Poster />
      )}
    </div>
  );
}
