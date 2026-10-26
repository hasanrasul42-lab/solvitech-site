import type { Metadata } from "next";
import InteractionPreview from "./InteractionPreview";

export const metadata: Metadata = {
  title: "Interactive Hero Preview | Solvitech",
  robots: { index: false, follow: false },
};

/**
 * The public interactive mark as visitors would get it. Not the homepage
 * layout; the space below lets you test scrolling (including touch scrolling
 * over the mark) and offscreen pausing.
 */
export default function HeroInteractionPreviewPage() {
  return (
    <div className="flex-1 bg-[#080D17]">
      <InteractionPreview />
      <div className="h-[120svh] px-4 py-10 text-sm text-slate-600">
        Scroll space for testing. The sculpture stops rendering when it leaves the viewport.
      </div>
    </div>
  );
}
