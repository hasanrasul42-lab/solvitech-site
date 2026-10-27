import type { Metadata } from "next";
import PosterCapture from "./PosterCapture";

export const metadata: Metadata = {
  title: "Poster Capture | Solvitech",
  robots: { index: false, follow: false },
};

/**
 * Renders the real interactive scene frozen at the entrance start pose and at
 * rest, so the hero's first-paint posters are authored from the same mesh,
 * camera, materials and lights. See PosterCapture for the export procedure.
 */
export default function PosterCapturePage() {
  return (
    <div className="flex-1 bg-[#080D17]">
      <PosterCapture />
    </div>
  );
}
