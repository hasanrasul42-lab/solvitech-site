import type { Metadata } from "next";
import PosterCapture from "../PosterCapture";

export const metadata: Metadata = {
  title: "Poster Capture (refined lighting) | Solvitech",
  robots: { index: false, follow: false },
};

/** As /3d-lab/poster-capture, for the "refined" lighting A/B candidate. */
export default function RefinedPosterCapturePage() {
  return (
    <div className="flex-1 bg-[#080D17]">
      <PosterCapture lighting="refined" />
    </div>
  );
}
