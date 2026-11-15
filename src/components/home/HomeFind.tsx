import Link from "next/link";
import { FIND, ROUTES, type Route } from "@/config/home";
import { Eyebrow, Section } from "./Section";
import "./directory/directory.css";

/**
 * Chapter 02 -- Find Your Solution. Three direct pathways for the three main
 * kinds of visitor (exploring AI, wanting time back, wanting a website). Not
 * a questionnaire: each is a plain link to its service page. Bespoke software
 * is pointed to just below, so established organisations see it too.
 */
export default function HomeFind() {
  return (
    <Section id="find" seamless band field={<div aria-hidden className="sr sr-dots -z-10" />} pad="pb-12 pt-10 md:pb-16 md:pt-14 lg:pb-16 lg:pt-16">
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{FIND.eyebrow}</Eyebrow>
          <h2
            id="find-title"
            className="reveal mt-5 max-w-[20ch] text-[clamp(2rem,7.4vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(2.6rem,4.6vw,3.25rem)]"
          >
            {FIND.title}
          </h2>
        </div>
        <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-1.5">{FIND.intro}</p>
      </div>

      <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
        {ROUTES.map((r) => (
          <li key={r.id} className="flex">
            <Link
              href={r.href}
              className={`route acc-${r.id} flex w-full flex-col rounded-[22px] border border-white/[0.09] bg-white/[0.015] p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft sm:p-7`}
            >
              <span className="route-glyph block h-14 w-14">
                <RouteGlyph id={r.id} />
              </span>
              <span className="mt-7 block text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-foreground md:text-[1.3125rem] lg:text-[1.5rem]">
                {r.title}
              </span>
              <span className="mb-7 mt-2.5 block text-[0.9375rem] leading-relaxed text-muted md:text-base">{r.line}</span>
              <span className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-sm font-medium text-foreground/85">
                {r.cue}
                <span aria-hidden className="route-arrow text-base text-subtle">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-muted">
        {FIND.bespoke.lead}
        <a
          href={FIND.bespoke.href}
          className="inline-flex min-h-10 items-center gap-1.5 font-medium text-accent-soft transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
        >
          {FIND.bespoke.label}
          <span aria-hidden>↓</span>
        </a>
      </p>
    </Section>
  );
}

/** A small, distinct emblem per pathway (line drawings in the pathway's accent). */
function RouteGlyph({ id }: { id: Route["id"] }) {
  const stroke = "rgb(var(--acc))";
  const faint = "rgb(255 255 255 / 0.22)";
  if (id === "ai") {
    // An insight: a chart with one highlighted finding.
    return (
      <svg viewBox="0 0 56 56" fill="none" className="h-full w-full">
        <rect x="1" y="1" width="54" height="54" rx="16" fill="rgb(var(--acc) / 0.1)" stroke="rgb(var(--acc) / 0.35)" />
        <path d="M14 40V32M22 40V27M30 40V35M38 40V22" stroke={faint} strokeWidth="3" strokeLinecap="round" />
        <path d="M30 40V35" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        <path d="M37 13l1.6 3.4L42 18l-3.4 1.6L37 23l-1.6-3.4L32 18l3.4-1.6z" fill={stroke} />
      </svg>
    );
  }
  if (id === "automation") {
    // A task list, ticked.
    return (
      <svg viewBox="0 0 56 56" fill="none" className="h-full w-full">
        <rect x="1" y="1" width="54" height="54" rx="16" fill="rgb(var(--acc) / 0.1)" stroke="rgb(var(--acc) / 0.35)" />
        <path d="M14 19.5l2.5 2.5 4.5-5M14 29.5l2.5 2.5 4.5-5" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 20h16M26 30h12" stroke={faint} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="17.5" cy="39.5" r="3.5" stroke={faint} strokeWidth="2" />
        <path d="M26 40h14" stroke={faint} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  // A browser window with a phone in front.
  return (
    <svg viewBox="0 0 56 56" fill="none" className="h-full w-full">
      <rect x="1" y="1" width="54" height="54" rx="16" fill="rgb(var(--acc) / 0.1)" stroke="rgb(var(--acc) / 0.35)" />
      <rect x="10" y="14" width="30" height="22" rx="3" stroke={faint} strokeWidth="2" />
      <path d="M10 19.5h30" stroke={faint} strokeWidth="2" />
      <rect x="33" y="24" width="13" height="20" rx="3" fill="#0b1220" stroke={stroke} strokeWidth="2" />
      <path d="M37.5 40h4" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
