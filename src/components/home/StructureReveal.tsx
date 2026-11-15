"use client";

import { useEffect } from "react";
import "./structure.css";

/**
 * Homepage sections below the hero have a plain background. Each holds a
 * hidden fine dot grid (.sr layers, structure.css) that only appears where
 * the cursor is, in the section under the cursor: the section "answers back".
 *
 * One passive pointer listener. The section under the cursor gets
 * `data-sr`; in each of its .sr layers a small dot "spot" follows the cursor
 * (lightly smoothed) by transform, on animation frames, only while the cursor
 * moves or the page scrolls. Nothing runs at rest. Touch devices and reduced
 * motion get the plain background only.
 */
export default function StructureReveal() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active: HTMLElement | null = null;
    /** The active section's layers and their moving spots. */
    let layers: { el: HTMLElement; spot: HTMLElement; r: number }[] = [];
    let px = 0;
    let py = 0;
    let sx = 0;
    let sy = 0;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = 0;
      if (!active) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const k = 1 - Math.exp(-dt * 18);
      sx += (px - sx) * k;
      sy += (py - sy) * k;
      // Read every box first, then write: no forced layout between writes.
      // Each spot moves by transform; its background offset keeps the dots
      // fixed to the section, so only the small spot repaints.
      const boxes = layers.map((l) => l.el.getBoundingClientRect());
      layers.forEach(({ spot, r }, i) => {
        const x = sx - boxes[i].left - r;
        const y = sy - boxes[i].top - r;
        spot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        spot.style.backgroundPosition = `${(-x).toFixed(1)}px ${(-y).toFixed(1)}px`;
      });
      if (Math.abs(px - sx) + Math.abs(py - sy) > 0.3) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const setActive = (sec: HTMLElement | null) => {
      if (sec === active) return;
      active?.removeAttribute("data-sr");
      active = sec;
      layers = sec
        ? [...sec.querySelectorAll<HTMLElement>(".sr")].map((el) => {
            let spot = el.querySelector<HTMLElement>(":scope > .sr-spot");
            if (!spot) {
              spot = document.createElement("div");
              spot.className = "sr-spot";
              el.appendChild(spot);
            }
            const r = parseFloat(getComputedStyle(el).getPropertyValue("--r")) || 220;
            return { el, spot, r };
          })
        : [];
      if (sec) {
        // Start the light where the cursor is, without sliding in from elsewhere.
        sx = px;
        sy = py;
        sec.setAttribute("data-sr", "");
      }
    };

    // Warm-up: create every section's spot now (during the intro), so the
    // first hover over a section never has to build DOM.
    if (fine.matches && !reduced.matches) {
      for (const el of document.querySelectorAll<HTMLElement>(".sr")) {
        if (el.querySelector(":scope > .sr-spot")) continue;
        const spot = document.createElement("div");
        spot.className = "sr-spot";
        el.appendChild(spot);
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      if (!fine.matches || reduced.matches) return;
      px = e.clientX;
      py = e.clientY;
      const sec = (e.target as Element | null)?.closest?.<HTMLElement>("[data-sr-section]") ?? null;
      setActive(sec);
      request();
    };
    const onScroll = () => {
      if (active) request();
    };
    const onLeave = () => setActive(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      setActive(null);
    };
  }, []);

  return null;
}
