import Link from "next/link";
import { APPROACH, STAGES } from "@/config/home";
import { APPROACH_PAGE } from "@/config/pages";
import { primaryBtn } from "@/components/solutions/shared";
import { ReactZone } from "@/components/field/FieldRoot";
import { Eyebrow, Section, SectionTitle } from "./Section";

/**
 * Chapter 05 -- Our Approach (homepage summary). The four stages, one line
 * each and the outcome each ends with; the detail (client contributions,
 * decisions, deliverables) lives on /approach. Copy: src/config/home.ts and
 * src/config/pages.ts.
 */
export default function HomeApproach() {
  return (
    <Section id="approach" seamless className="tl-section">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{APPROACH.eyebrow}</Eyebrow>
          <SectionTitle id="approach" className="max-w-[18ch]">
            {APPROACH.title}
          </SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{APPROACH.intro}</p>
      </div>

      <ReactZone>
      <ol className="relative mt-12 grid gap-8 md:mt-16 md:grid-cols-4 md:gap-0">
        {/* The route: a faint track, filled as the chapter scrolls (vertical on phones). */}
        {/* Background (option A): a light beam along the route. */}
        <span aria-hidden className="bga bga-beam hidden md:block" />
        <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-white/[0.1] md:block" />
        <span aria-hidden className="prog-x absolute left-5 right-5 top-5 hidden h-px bg-gradient-to-r from-accent via-accent/70 to-accent-soft md:block" />
        <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-white/[0.1] md:hidden" />
        <span aria-hidden className="prog-y absolute bottom-5 left-5 top-5 w-px bg-gradient-to-b from-accent to-accent-soft md:hidden" />
        {STAGES.map((s, i) => {
          const outcome = APPROACH_PAGE.stages.find((d) => d.id === s.id)?.outcome;
          return (
            <li key={s.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4 md:block md:pr-8">
              <span aria-hidden className="bga bga-stage-guide hidden md:block" />
              <span
                data-react=""
                className="prog-node rx rx-node relative z-10 grid h-10 w-10 place-items-center rounded-full border border-accent/70 bg-background font-mono text-sm text-accent-soft"
                style={{ ["--from" as string]: `entry ${60 + i * 12}%`, ["--to" as string]: `entry ${70 + i * 12}%` }}
              >
                {i + 1}
              </span>
              <div className="md:mt-6">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-[1.375rem]">{s.name}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{s.summary}</p>
                {outcome && (
                  <p className="mt-3 text-sm text-subtle">
                    Ends with: <span className="text-foreground/90">{outcome}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      </ReactZone>

      {APPROACH.page && (
        <div className="mt-12 md:mt-14">
          <Link href={APPROACH.page} className={primaryBtn}>
            View Our Approach <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}
