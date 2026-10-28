import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/config/site";
import { Eyebrow, gutter } from "@/components/home/Section";

/** Unique title and description for an inner page. */
export function pageMetadata(meta: { title: string; description: string }): Metadata {
  const title = `${meta.title} | ${SITE.name}`;
  return { title, description: meta.description, openGraph: { title, description: meta.description } };
}

/** Opening band for inner pages: eyebrow, the page's h1, intro and actions. */
export default function PageHero({
  eyebrow,
  headline,
  intro,
  children,
  aside,
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  /** Actions under the intro. */
  children?: ReactNode;
  /** Optional right-hand column on desktop. */
  aside?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_65%_60%_at_20%_0%,rgb(54_123_250/0.10),transparent_70%)]"
      />
      <div
        className={`mx-auto grid w-full max-w-[1440px] gap-12 pb-16 pt-[calc(var(--header-height)+env(safe-area-inset-top)+3rem)] md:pb-24 md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+4.5rem)] ${aside ? "lg:grid-cols-12 lg:items-end lg:gap-16" : ""} ${gutter}`}
      >
        <div className={aside ? "lg:col-span-7" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1
            id="page-title"
            className="mt-5 max-w-[18ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.4vw,4.25rem)] lg:text-[clamp(3.5rem,4.8vw,4.75rem)]"
          >
            {headline}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-7 max-w-[44rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{intro}</p>
          {children && <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}
