import Link from "next/link";
import { CORE_SERVICES } from "@/config/services";
import { SOLUTIONS_CLOSING, SOLUTIONS_INTRO, SUPPORTING, SUPPORTING_LABEL } from "@/config/solutions";
import ConnectedSystem from "./ConnectedSystem";

const gutter = "px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12";
const anchorOffset = "scroll-mt-[calc(var(--header-height)+1.5rem)]";
const secondaryCta =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";

/**
 * Chapter 02 -- Solutions. Editorial headline, then one dominant showcase (a
 * conceptual connected system in operation, with Build / Automate / Connect),
 * then the supporting pathways and a single working closing action.
 *
 * Copy and future page links: src/config/solutions.ts.
 */
export default function HomeSolutions() {
  return (
    <section
      id="solutions"
      data-chapter="solutions"
      aria-labelledby="solutions-title"
      className={`relative isolate overflow-hidden border-t border-hairline bg-[#0a0f1a] ${anchorOffset}`}
    >
      {/* A lifted tone and a faint cool wash set the chapter apart from the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_70%_60%_at_25%_0%,rgb(54_123_250/0.08),transparent_70%)]"
      />

      <div className={`mx-auto w-full max-w-[1440px] pb-20 pt-20 md:pb-28 md:pt-24 lg:pb-32 lg:pt-24 ${gutter}`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-subtle min-[400px]:text-[0.6875rem] sm:text-xs sm:tracking-[0.22em]">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {SOLUTIONS_INTRO.eyebrow}
            </p>
            <h2
              id="solutions-title"
              className="mt-5 max-w-[15ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.6vw,4.25rem)] lg:text-[clamp(3.5rem,4.6vw,4.5rem)]"
            >
              {SOLUTIONS_INTRO.title}
              <span className="text-accent">.</span>
            </h2>
          </div>
          <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">
            {SOLUTIONS_INTRO.intro}
          </p>
        </div>

        <div className="mt-10 md:mt-14">
          <ConnectedSystem />
        </div>

        {/* Core services: each has a dedicated page. */}
        <nav aria-label="Core services" className="mt-16 md:mt-20">
          <ul className="grid border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
            {CORE_SERVICES.map((s) => (
              <li key={s.slug} className="border-b border-hairline sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0">
                <Link
                  href={s.href}
                  className="group flex h-full flex-col gap-2 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-soft sm:px-6 lg:first:pl-0"
                >
                  <span className="text-lg font-semibold tracking-[-0.015em] text-foreground transition-colors group-hover:text-accent-soft">
                    {s.name}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-muted">{s.summary}</span>
                  <span aria-hidden className="mt-auto pt-2 text-sm text-accent-soft transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Supporting pathways */}
        <div className="mt-20 md:mt-24">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-subtle">{SUPPORTING_LABEL}</p>
          <div className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {SUPPORTING.map((p) => (
              <div key={p.id} id={`solutions-${p.id}`} className={`border-t border-hairline pt-6 ${anchorOffset}`}>
                <h3 className="text-[1.5rem] font-semibold tracking-[-0.025em] text-foreground md:text-[1.75rem]">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-[30rem] text-[0.9375rem] leading-relaxed text-muted md:text-base">{p.line}</p>
                {p.page && (
                  <Link
                    href={p.page}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
                  >
                    Explore {p.title}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Closing: route anyone unsure into the contact chapter. */}
        <div className="mt-20 flex flex-col gap-6 rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 md:mt-24 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="max-w-[34rem] text-xl leading-snug tracking-[-0.01em] text-foreground md:text-2xl">
            {SOLUTIONS_CLOSING.line}
          </p>
          <div className="flex shrink-0 flex-col gap-3 min-[420px]:flex-row">
            <Link href={SOLUTIONS_CLOSING.hub.href} className={secondaryCta}>
              {SOLUTIONS_CLOSING.hub.label}
            </Link>
            <Link href={SOLUTIONS_CLOSING.cta.href} className={secondaryCta}>
              {SOLUTIONS_CLOSING.cta.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
