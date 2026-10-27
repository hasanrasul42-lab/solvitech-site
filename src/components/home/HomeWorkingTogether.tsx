import Link from "next/link";
import { AGREED_IN_SCOPING, COST_FACTORS, ENGAGEMENTS, WORKING } from "@/config/home";
import { Eyebrow, Section, SectionTitle, textLink } from "./Section";

/**
 * Chapter 06 -- Working Together. Three engagement types side by side, then
 * what shapes cost and timeline next to what is agreed in writing. No prices
 * or contractual promises. Copy: src/config/home.ts.
 */
export default function HomeWorkingTogether() {
  return (
    <Section id="working-together">
      <div className="max-w-[52rem]">
        <Eyebrow>{WORKING.eyebrow}</Eyebrow>
        <SectionTitle id="working-together">{WORKING.title}</SectionTitle>
        <p className="mt-6 max-w-[40rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{WORKING.intro}</p>
        {WORKING.page && (
          <Link href={WORKING.page} className={`mt-5 ${textLink}`}>
            How engagements work
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      <ul className="mt-12 grid border-y border-hairline md:mt-16 lg:grid-cols-3">
        {ENGAGEMENTS.map((e, i) => (
          <li
            key={e.id}
            className="flex flex-col border-t border-hairline py-8 first:border-t-0 lg:border-l lg:border-t-0 lg:px-8 lg:py-10 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <span aria-hidden className="font-mono text-xs text-accent-soft">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[1.625rem] font-semibold tracking-[-0.025em] text-foreground">{e.name}</h3>
            <p className="mt-2 text-base font-medium leading-snug text-foreground/85">{e.bestFor}</p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted md:text-base">{e.description}</p>
            <p className="mt-5 text-sm leading-relaxed text-subtle lg:mt-auto lg:pt-6">
              <span className="sr-only">Examples: </span>
              {e.examples}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground md:text-2xl">{COST_FACTORS.title}</h3>
          <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {COST_FACTORS.items.map((f) => (
              <div key={f.name}>
                <dt className="text-base font-medium text-foreground">{f.name}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{f.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8 lg:col-span-5">
          <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground md:text-2xl">{AGREED_IN_SCOPING.title}</h3>
          <ul className="mt-5 grid gap-3">
            {AGREED_IN_SCOPING.items.map((item) => (
              <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">
                <svg aria-hidden viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
