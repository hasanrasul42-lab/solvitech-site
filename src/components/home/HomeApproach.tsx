import Link from "next/link";
import { APPROACH, STAGES, STAGE_LABELS } from "@/config/home";
import { Eyebrow, Section, SectionTitle, textLink } from "./Section";

/**
 * Chapter 05 -- Our Approach. Discover -> Design -> Engineer -> Launch &
 * Evolve as a numbered rail; each stage answers what happens, what the client
 * contributes, what Solvitech delivers and which decision closes it.
 * Copy: src/config/home.ts.
 */
export default function HomeApproach() {
  return (
    <Section id="approach" tone="raised">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{APPROACH.eyebrow}</Eyebrow>
          <SectionTitle id="approach" className="max-w-[18ch]">
            {APPROACH.title}
          </SectionTitle>
        </div>
        <div className="lg:col-span-5 lg:pb-2">
          <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{APPROACH.intro}</p>
          {APPROACH.page && (
            <Link href={APPROACH.page} className={`mt-5 ${textLink}`}>
              How we work in detail
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stage overview: the sequence at a glance. */}
      <ol
        aria-label="The four stages"
        className="mt-12 hidden grid-cols-4 border-y border-hairline md:mt-16 md:grid"
      >
        {STAGES.map((s, i) => (
          <li key={s.id} className="border-l border-hairline px-5 py-5 first:border-l-0 first:pl-0">
            <a
              href={`#approach-${s.id}`}
              className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-soft"
            >
              <span className="font-mono text-xs text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-2 flex items-center justify-between gap-3 text-lg font-semibold tracking-[-0.015em] text-foreground transition-colors group-hover:text-accent-soft">
                {s.name}
                {i < STAGES.length - 1 && (
                  <span aria-hidden className="font-normal text-subtle">
                    →
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-12 md:mt-16">
        {STAGES.map((s, i) => (
          <article
            key={s.id}
            id={`approach-${s.id}`}
            aria-labelledby={`approach-${s.id}-name`}
            className="relative grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-6 border-t border-hairline py-10 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-12 lg:py-14"
          >
            <div className="lg:col-span-4">
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/40 font-mono text-sm text-accent-soft"
                >
                  {i + 1}
                </span>
                <h3
                  id={`approach-${s.id}-name`}
                  className="text-[1.75rem] font-semibold tracking-[-0.03em] text-foreground md:text-[2rem]"
                >
                  {s.name}
                </h3>
              </div>
              <p className="mt-4 max-w-[24rem] text-base leading-relaxed text-foreground/85 md:text-[1.0625rem]">{s.summary}</p>
            </div>

            <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-8">
              <Detail label={STAGE_LABELS.happens}>{s.happens}</Detail>
              <Detail label={STAGE_LABELS.youContribute}>{s.youContribute}</Detail>
              <Detail label={STAGE_LABELS.weDeliver}>{s.weDeliver}</Detail>
              <Detail label={STAGE_LABELS.decision} emphasis>
                {s.decision}
              </Detail>
            </dl>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Detail({ label, emphasis = false, children }: { label: string; emphasis?: boolean; children: string }) {
  return (
    <div className={emphasis ? "border-l-2 border-accent/60 pl-4" : ""}>
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">{label}</dt>
      <dd className={`mt-2 text-[0.9375rem] leading-relaxed md:text-base ${emphasis ? "text-foreground" : "text-muted"}`}>
        {children}
      </dd>
    </div>
  );
}
