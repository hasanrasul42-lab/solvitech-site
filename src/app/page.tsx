import HomeEntrance from "@/components/home/entrance/HomeEntrance";
import { INTRO_BOOT_SCRIPT } from "@/components/home/entrance/introTimeline";
import HomeApproach from "@/components/home/HomeApproach";
import HomeContact from "@/components/home/HomeContact";
import HomeSolutions from "@/components/home/HomeSolutions";
import HomeWhy from "@/components/home/HomeWhy";
import HomeWork from "@/components/home/HomeWork";
import HomeWorkingTogether from "@/components/home/HomeWorkingTogether";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

/**
 * Homepage: seven chapters in the order of HOME_CHAPTERS (src/config/site.ts).
 * Each renders as a <section> whose id matches its chapter id, so navigation
 * links resolve to in-page anchors. Selected Work renders only once approved
 * projects exist.
 * The boot script must come right after the hero markup: it decides whether
 * the System Activation intro plays and centres the mark before first paint.
 */
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <HomeEntrance />
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <HomeSolutions />
        <HomeWork />
        <HomeWhy />
        <HomeApproach />
        <HomeWorkingTogether />
        <HomeContact />
      </main>
      <SiteFooter />
    </>
  );
}
