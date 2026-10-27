"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_SVG_URL, readMarkContours, type MarkContours } from "./markGeometry";

/** Start loading the brand SVG into the loader cache ahead of first use. */
export function preloadMarkContours() {
  useLoader.preload(SVGLoader, MARK_SVG_URL);
}

/** Parsed ribbon contours of the brand SVG (suspends while loading). */
export function useMarkContours(): MarkContours {
  const svg = useLoader(SVGLoader, MARK_SVG_URL);
  return useMemo(() => readMarkContours(svg), [svg]);
}

// Non-suspending variant. Suspending inside a canvas costs ~300 ms on first
// load (React holds back the reveal of a suspended boundary), so the hero
// scene loads the contours itself and mounts its canvas once they exist.
let loaded: MarkContours | null = null;
let loading: Promise<MarkContours | null> | null = null;
const listeners = new Set<() => void>();

/** Load and parse the brand SVG once; resolves to null if it fails. */
export function loadMarkContours(): Promise<MarkContours | null> {
  loading ??= new SVGLoader()
    .loadAsync(MARK_SVG_URL)
    .then((svg) => {
      loaded = readMarkContours(svg);
      listeners.forEach((listener) => listener());
      return loaded;
    })
    .catch(() => null);
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void loadMarkContours();
  return () => listeners.delete(listener);
}

/** The parsed contours, or null until loaded (never suspends). */
export function useLoadedMarkContours(): MarkContours | null {
  return useSyncExternalStore(
    subscribe,
    () => loaded,
    () => null,
  );
}
