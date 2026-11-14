import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, gutter } from "@/components/home/Section";
import InnerPageShell from "@/components/site/InnerPageShell";
import { primaryBtn, secondaryBtn } from "@/components/solutions/shared";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Page not found | ${SITE.name}`,
  robots: { index: false },
};

/** Branded 404: same header and footer as the rest of the site, and clear ways back. */
export default function NotFound() {
  return (
    <InnerPageShell>
      <section aria-labelledby="page-title" className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_65%_60%_at_20%_0%,rgb(54_123_250/0.10),transparent_70%)]"
        />
        <div className={`mx-auto w-full max-w-[1440px] pb-28 pt-[calc(var(--header-height)+env(safe-area-inset-top)+4rem)] md:pb-36 md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+6rem)] ${gutter}`}>
          <Eyebrow>Error 404</Eyebrow>
          <h1
            id="page-title"
            className="mt-5 max-w-[16ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.4vw,4.25rem)]"
          >
            This page doesn&rsquo;t exist<span className="text-accent">.</span>
          </h1>
          <p className="mt-7 max-w-[36rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">
            The link may be out of date, or the address may have been typed incorrectly. These will take you somewhere
            useful.
          </p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <Link href="/" className={primaryBtn}>
              Back to Home
            </Link>
            <Link href="/solutions" className={secondaryBtn}>
              Explore Solutions
            </Link>
            <Link href="/contact" className={secondaryBtn}>
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </InnerPageShell>
  );
}
