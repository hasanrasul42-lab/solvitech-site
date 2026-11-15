"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NAV_LINKS, NAV_SOLUTIONS, SOLUTIONS_HUB } from "@/config/site";

/**
 * Homepage warm-up, run during the System Activation intro: prefetch every
 * page the header, footer and service links point to, so the first click on
 * any of them opens at once. (The About 3D scene and the cursor dot grid warm
 * themselves up on mount: AboutMark.tsx, StructureReveal.tsx.)
 *
 * Sets html[data-warm="ready"] when the prefetches have been issued.
 */
export default function HomeWarmup() {
  const router = useRouter();
  useEffect(() => {
    const routes = new Set([
      ...NAV_SOLUTIONS.map((s) => s.href),
      ...NAV_LINKS.map((l) => l.href).filter((h) => h.startsWith("/") && !h.includes("#")),
      SOLUTIONS_HUB.href,
    ]);
    for (const href of routes) router.prefetch(href);
    document.documentElement.setAttribute("data-warm", "ready");
  }, [router]);
  return null;
}
