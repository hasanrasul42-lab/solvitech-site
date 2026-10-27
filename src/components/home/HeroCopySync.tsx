"use client";

import { useEffect } from "react";
import { MARK_ENTRANCE_EVENT, type MarkEntranceDetail } from "@/components/hero/interactive/interactionConfig";

/**
 * Keeps the hero copy's entrance in step with the 3D mark. The copy starts at
 * first paint (CSS); when the mark's 3D entrance starts, every hero animation
 * is retimed by one shared rate so the last of them ends exactly when the
 * mark lands. The stagger is kept, and changing the rate preserves progress,
 * so nothing jumps.
 */
export default function HeroCopySync({ targetId }: { targetId: string }) {
  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;

    const onEntrance = (event: Event) => {
      const { endsAt } = (event as CustomEvent<MarkEntranceDetail>).detail;
      const animations = Array.from(root.querySelectorAll<HTMLElement>(".hero-rise, .hero-fade"))
        .flatMap((el) => el.getAnimations())
        .filter((a) => a.playState !== "finished");
      if (animations.length === 0) return;

      // Time left on the last-ending animation, in its own (unscaled) timeline.
      const remaining = Math.max(
        ...animations.map((a) => Number(a.effect?.getComputedTiming().endTime ?? 0) - Number(a.currentTime ?? 0)),
      );
      const wanted = endsAt - performance.now();
      if (remaining <= 0 || wanted <= 0) return;
      const rate = Math.min(2.5, Math.max(0.4, remaining / wanted));
      animations.forEach((a) => a.updatePlaybackRate(rate));
    };

    root.addEventListener(MARK_ENTRANCE_EVENT, onEntrance);
    return () => root.removeEventListener(MARK_ENTRANCE_EVENT, onEntrance);
  }, [targetId]);

  return null;
}
