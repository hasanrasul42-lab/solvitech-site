import HomeEntrance from "@/components/home/entrance/HomeEntrance";
import HeroBackdrop from "@/components/home/HeroBackdrop";
import StructureReveal from "@/components/home/StructureReveal";
import { INTRO_BOOT_SCRIPT } from "@/components/home/entrance/introTimeline";
import HomeFind from "@/components/home/HomeFind";
import HomeSolutions from "@/components/home/HomeSolutions";
import HomeWork from "@/components/home/HomeWork";
import { HomeAbout, HomeApproach, HomeContact, HomeWhy, HomeWorkingTogether } from "@/components/home/HomeCompany";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { SITE } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = SITE.url ? { alternates: { canonical: "/" } } : {};

/**
 * Homepage (redesign V3.0), in the order of HOME_CHAPTERS (src/config/site.ts):
 * hero, find your solution, what we do, additional services, (selected work,
 * once approved), about, why Solvitech, our approach, working together, start
 * a conversation. Each renders as a <section> whose id matches its chapter id.
 *
 * The homepage introduces, explains, directs and converts; the dedicated
 * service pages carry deeper demonstrations.
 *
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
      {/* Sections share one stacking context, so each section's cursor-revealed
          dot grid can sit behind its content; clip only sideways. */}
      <main id="main" className="relative isolate flex-1 overflow-x-clip">
        <HeroBackdrop />
        <StructureReveal />
        <HomeEntrance />
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <HomeFind />
        <HomeSolutions />
        <HomeWork />
        <HomeAbout />
        <HomeWhy />
        <HomeApproach />
        <HomeWorkingTogether />
        <HomeContact />
      </main>
      <SiteFooter />
    </>
  );
}
