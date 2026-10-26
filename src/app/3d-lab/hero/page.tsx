import type { Metadata } from "next";
import HeroPreview from "./HeroPreview";

export const metadata: Metadata = {
  title: "Hero Sculpture Preview | Solvitech",
  robots: { index: false, follow: false },
};

/**
 * Preview of the public hero sculpture as visitors would get it, plus an
 * interaction-preset switch for evaluation. Not the homepage layout; the extra
 * height below lets you check scrolling and offscreen pausing.
 */
export default function HeroPreviewPage() {
  return (
    <div className="flex-1 bg-[#080D17] text-slate-300">
      <HeroPreview />
      <div className="h-[150svh] px-4 py-10 text-sm text-slate-500">
        Scroll space for testing. The sculpture stops rendering when it leaves the viewport.
      </div>
    </div>
  );
}
