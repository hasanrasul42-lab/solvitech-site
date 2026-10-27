import type { Metadata } from "next";
import EntrancePrototype from "../EntrancePrototype";
import { INTRO_BOOT_SCRIPT } from "../introTimeline";
import "../entrance.css";

export const metadata: Metadata = {
  title: "Entrance Prototype, refined lighting | Solvitech",
  robots: { index: false, follow: false },
};

/** The System Activation entrance with the "refined" lighting (A/B candidate). */
export default function RefinedEntrancePrototypePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <EntrancePrototype lighting="refined" />
      <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
    </>
  );
}
