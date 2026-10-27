import type { Metadata } from "next";
import EntrancePrototype from "./EntrancePrototype";
import { INTRO_BOOT_SCRIPT } from "./introTimeline";
import "./entrance.css";

export const metadata: Metadata = {
  title: "Entrance Prototype | Solvitech",
  robots: { index: false, follow: false },
};

/**
 * A/B experiment: the homepage hero with the "System Activation" entrance.
 * The homepage itself (/) is unchanged. The boot script must come after the
 * hero markup: it measures the mark's stage and centres it before first paint.
 */
export default function EntrancePrototypePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <EntrancePrototype />
      <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
    </>
  );
}
