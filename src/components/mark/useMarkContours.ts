"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_SVG_URL, readMarkContours, type MarkContours } from "./markGeometry";

/** Parsed ribbon contours of the brand SVG (suspends while loading). */
export function useMarkContours(): MarkContours {
  const svg = useLoader(SVGLoader, MARK_SVG_URL);
  return useMemo(() => readMarkContours(svg), [svg]);
}
