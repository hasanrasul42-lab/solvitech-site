import Link from "next/link";
import { WORKING } from "@/config/home";
import { WORKING_PAGE } from "@/config/pages";
import { secondaryBtn } from "@/components/solutions/shared";
import { Eyebrow, Section, SectionTitle } from "./Section";

/**
 * Chapter 06 -- Working Together (homepage summary). The three engagement
 * models and who each suits; quotation factors, what is agreed in writing and
 * common questions live on /working-together. Copy: src/config/pages.ts.
 */
export default function HomeWorkingTogether() {
  return (
    <Section id="working-together">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{WORKING.eyebrow}</Eyebrow>
          <SectionTitle id="working-together">{WORKING.title}</SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{WORKING.intro}</p>
      </div>

      <ul className="mt-12 grid border-y border-hairline md:mt-16 lg:grid-cols-3">
        {WORKING_PAGE.models.map((m, i) => (
          <li
            key={m.id}
            className="border-t border-hairline py-8 first:border-t-0 lg:border-l lg:border-t-0 lg:px-8 lg:py-10 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <span aria-hidden className="font-mono text-xs text-accent-soft">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[1.625rem] font-semibold tracking-[-0.025em] text-foreground">{m.name}</h3>
            <p className="mt-2 text-base font-medium leading-snug text-foreground/85">{m.summary}</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">{m.suits}</p>
          </li>
        ))}
      </ul>

      {WORKING.page && (
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[36rem] text-[0.9375rem] leading-relaxed text-muted">
            What shapes a quotation, what is agreed in writing and common questions are covered in detail.
          </p>
          <Link href={WORKING.page} className={`${secondaryBtn} shrink-0`}>
            How We Work Together <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}
