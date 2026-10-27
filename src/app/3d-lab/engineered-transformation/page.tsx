import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import EngineeredTransformation from "./EngineeredTransformation";
import "./et.css";

export const metadata: Metadata = {
  title: "Engineered Transformation | Solvitech",
  robots: { index: false, follow: false },
};

/**
 * Task 13E (lab only): one modular sculpture with three mechanisms --
 * understanding, executing, controlling -- that assemble into one system.
 * The homepage is unchanged.
 */
export default function EngineeredTransformationPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 bg-[#080D17]">
        <section
          aria-labelledby="et-title"
          className="relative isolate overflow-hidden pb-24 pt-[calc(var(--header-height)+env(safe-area-inset-top)+2.5rem)] md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+3.5rem)]"
        >
          <EngineeredTransformation />
        </section>
      </main>
    </>
  );
}
