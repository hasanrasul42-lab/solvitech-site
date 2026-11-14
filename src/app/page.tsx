import HomeEntrance from "@/components/home/entrance/HomeEntrance";
import HeroBackdrop from "@/components/home/HeroBackdrop";
import PathFlow from "@/components/home/PathFlow";
import { INTRO_BOOT_SCRIPT } from "@/components/home/entrance/introTimeline";
import HomeApproach from "@/components/home/HomeApproach";
import HomeContact from "@/components/home/HomeContact";
import HomeSolutions from "@/components/home/HomeSolutions";
import HomeWhy from "@/components/home/HomeWhy";
import HomeWork from "@/components/home/HomeWork";
import HomeWorkingTogether from "@/components/home/HomeWorkingTogether";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { SITE } from "@/config/site";
import type { Metadata } from "next";

/** Chooses the chapter background option from ?bg=fixed|path before first paint. */
const BG_SCRIPT = `(function(){try{var b=new URLSearchParams(location.search).get("bg");if(b==="path"||b==="fixed")document.documentElement.setAttribute("data-bg",b)}catch(e){}})()`;

export const metadata: Metadata = SITE.url ? { alternates: { canonical: "/" } } : {};

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
      {/* Chapters share one stacking context, so each chapter's fixed
          background can extend softly past its edges; clip only sideways. */}
      <main id="main" className="relative isolate flex-1 overflow-x-clip">
        {/* Chapter backgrounds: fixed per chapter (default, chapters.css) or
            one planned pathway (?bg=path). Both are kept while one is chosen. */}
        <script dangerouslySetInnerHTML={{ __html: BG_SCRIPT }} />
        <PathFlow />
        <HeroBackdrop />
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
