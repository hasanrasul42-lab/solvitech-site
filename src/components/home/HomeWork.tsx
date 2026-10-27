import Link from "next/link";
import { APPROVED_WORK, WORK_INTRO, WORK_VISIBLE } from "@/config/work";
import { Eyebrow, Section, SectionTitle, textLink } from "./Section";

/**
 * Chapter 03 -- Selected Work. Renders nothing until approved, real projects
 * exist in src/config/work.ts (the navigation link follows the same rule).
 */
export default function HomeWork() {
  if (!WORK_VISIBLE) return null;
  return (
    <Section id="work">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{WORK_INTRO.eyebrow}</Eyebrow>
          <SectionTitle id="work">{WORK_INTRO.title}</SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">
          {WORK_INTRO.intro}
        </p>
      </div>
      <ul className="mt-12 grid gap-x-12 gap-y-12 md:mt-16 md:grid-cols-2">
        {APPROVED_WORK.map((p) => (
          <li key={p.id} className="border-t border-hairline pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">
              {p.client} · {p.capability}
            </p>
            <h3 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.025em] text-foreground md:text-[1.75rem]">{p.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">{p.challenge}</p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{p.solution}</p>
            {p.outcome && <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground md:text-base">{p.outcome}</p>}
            {p.page && (
              <Link href={p.page} className={`mt-4 ${textLink}`}>
                Read the case study
                <span aria-hidden>→</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
