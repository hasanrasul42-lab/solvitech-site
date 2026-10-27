import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHero from "@/components/home/HomeHero";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Lighting A/B | Solvitech",
  robots: { index: false, follow: false },
};

const VARIANTS = ["approved", "refined"] as const;
type Variant = (typeof VARIANTS)[number];

export function generateStaticParams() {
  return VARIANTS.map((variant) => ({ variant }));
}

/**
 * Lighting A/B: the real homepage hero with the approved or the refined
 * background illumination and shadow. Separate static routes, so each loads
 * fresh with its own matching posters (no hand-over change on either).
 */
export default async function LightingAbPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  if (!VARIANTS.includes(variant as Variant)) notFound();
  const other: Variant = variant === "refined" ? "approved" : "refined";

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <HomeHero markProps={{ lighting: variant as Variant }} />
      </main>
      <div className="fixed right-3 top-20 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1220]/85 px-3 py-1.5 text-xs text-slate-400 backdrop-blur">
        <span>
          Lighting: <span className="text-white">{variant}</span>
        </span>
        <Link href={`/3d-lab/lighting/${other}`} className="rounded-full border border-white/10 px-2 py-0.5 hover:text-white">
          Show {other}
        </Link>
      </div>
    </>
  );
}
