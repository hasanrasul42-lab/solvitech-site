import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SolutionsDemo from "./SolutionsDemo";
import "./demo.css";

export const metadata: Metadata = {
  title: "Solutions Prototype | Solvitech",
  robots: { index: false, follow: false },
};

/**
 * Task 13C prototype (not linked publicly): an interactive, locally simulated
 * business workflow. The homepage Solutions section is unchanged.
 */
export default function SolutionsPrototypePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-[#0a0f1a]">
        <section
          aria-labelledby="demo-title"
          className="relative isolate overflow-hidden pt-[calc(var(--header-height)+env(safe-area-inset-top))]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_70%_60%_at_25%_0%,rgb(54_123_250/0.08),transparent_70%)]"
          />
          <div className="mx-auto w-full max-w-[1440px] px-[max(1.25rem,env(safe-area-inset-left))] pb-24 pt-10 sm:px-8 md:pt-14 lg:px-12">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
              <div className="lg:col-span-7">
                <p className="flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-subtle sm:text-xs sm:tracking-[0.22em]">
                  <span aria-hidden className="h-px w-6 bg-accent" />
                  Solutions &middot; interactive prototype
                </p>
                <h1
                  id="demo-title"
                  className="mt-5 max-w-[16ch] text-[clamp(2.25rem,8.5vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground md:text-[clamp(3rem,6vw,3.75rem)] lg:text-[clamp(3.25rem,4.4vw,4.25rem)]"
                >
                  See a request handled from inbox to action<span className="text-accent">.</span>
                </h1>
              </div>
              <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">
                Choose a customer request and run it. The system reads it, decides what to do, updates the service desk
                and tells the right team: a small, simulated example of what we engineer.
              </p>
            </div>
            <div className="mt-10 md:mt-14">
              <SolutionsDemo />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
