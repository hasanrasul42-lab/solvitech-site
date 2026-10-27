import Link from "next/link";
import { PRINCIPLES, WHY } from "@/config/home";
import { Eyebrow, Section, SectionTitle, textLink } from "./Section";

/**
 * Chapter 04 -- Why Solvitech. A statement of who we are on the left (held in
 * view on desktop), and the six reasons to trust us as a readable list.
 * Copy: src/config/home.ts.
 */
export default function HomeWhy() {
  return (
    <Section id="why">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)]">
            <Eyebrow>{WHY.eyebrow}</Eyebrow>
            <SectionTitle id="why" className="max-w-[16ch]">
              {WHY.title}
            </SectionTitle>
            <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{WHY.lead}</p>
            {WHY.aboutPage && (
              <Link href={WHY.aboutPage} className={`mt-6 ${textLink}`}>
                {WHY.aboutLabel}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>

        <ol className="lg:col-span-7">
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title}
              className="grid gap-2 border-t border-hairline py-7 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_1fr] sm:gap-x-4 lg:py-8 lg:first:pt-2"
            >
              <span aria-hidden className="pt-1 font-mono text-xs text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[1.3125rem] font-semibold leading-snug tracking-[-0.02em] text-foreground md:text-[1.4375rem]">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-[38rem] text-[0.9375rem] leading-relaxed text-muted md:text-base">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
