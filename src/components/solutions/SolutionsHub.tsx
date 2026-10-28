import Link from "next/link";
import { CORE_SERVICES, HUB, SUPPORTING_SERVICES, getService } from "@/config/services";
import { Eyebrow, Section, SectionTitle, gutter } from "@/components/home/Section";
import { PageCta, primaryBtn, secondaryBtn } from "./shared";

/**
 * /solutions -- the overview. Core expertise leads as large rows; a problem
 * finder helps visitors who don't know which service they need; supporting
 * services stay clearly linked. Copy: src/config/services.ts (HUB).
 */
export default function SolutionsHub() {
  return (
    <>
      <section aria-labelledby="hub-title" className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_65%_60%_at_20%_0%,rgb(54_123_250/0.10),transparent_70%)]"
        />
        <div className={`mx-auto w-full max-w-[1440px] pb-16 pt-[calc(var(--header-height)+env(safe-area-inset-top)+3rem)] md:pb-24 md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+4.5rem)] ${gutter}`}>
          <Eyebrow>{HUB.eyebrow}</Eyebrow>
          <h1
            id="hub-title"
            className="mt-5 max-w-[18ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.4vw,4.25rem)] lg:text-[clamp(3.5rem,4.8vw,4.75rem)]"
          >
            {HUB.headline}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-7 max-w-[44rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{HUB.intro}</p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <a href="#finder" className={primaryBtn}>
              Find where to start <span aria-hidden>↓</span>
            </a>
            <Link href="/contact" className={secondaryBtn}>
              Discuss a project
            </Link>
          </div>
        </div>
      </section>

      {/* Core expertise */}
      <Section id="core" tone="raised">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{HUB.coreLabel}</Eyebrow>
            <SectionTitle id="core">Systems, AI, automation and integration</SectionTitle>
          </div>
          <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted lg:col-span-5 lg:pb-2">{HUB.coreIntro}</p>
        </div>
        <ul className="mt-12 border-t border-hairline">
          {CORE_SERVICES.map((s, i) => (
            <li key={s.slug} className="border-b border-hairline">
              <Link
                href={s.href}
                className="group grid gap-3 py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-soft md:grid-cols-12 md:items-center md:gap-8 md:py-10"
              >
                <span aria-hidden className="font-mono text-sm text-accent-soft md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-foreground transition-colors group-hover:text-accent-soft md:col-span-5 md:text-[2.25rem]">
                  {s.name}
                </span>
                <span className="text-base leading-relaxed text-muted md:col-span-5">{s.summary}</span>
                <span aria-hidden className="hidden text-2xl text-subtle transition-transform group-hover:translate-x-1 group-hover:text-foreground md:col-span-1 md:block md:justify-self-end">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Problem finder */}
      <Section id="finder">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Start from the problem</Eyebrow>
            <SectionTitle id="finder">{HUB.finder.title}</SectionTitle>
            <p className="mt-6 max-w-[26rem] text-[1.0625rem] leading-relaxed text-muted">{HUB.finder.intro}</p>
          </div>
          <ul className="grid gap-3 lg:col-span-8">
            {HUB.finder.items.map((it) => {
              const s = getService(it.slug);
              return (
                <li key={it.problem}>
                  <Link
                    href={s.href}
                    className="group flex flex-col gap-2 rounded-2xl border border-white/[0.08] px-5 py-4 transition-colors hover:border-accent/50 hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <span className="text-base leading-relaxed text-foreground">&ldquo;{it.problem}&rdquo;</span>
                    <span className="shrink-0 text-sm font-medium text-accent-soft">
                      {s.short} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* How it fits together */}
      <Section id="together" tone="raised">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>Joined up</Eyebrow>
            <SectionTitle id="together">{HUB.together.title}</SectionTitle>
            <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed text-muted">{HUB.together.body}</p>
          </div>
          <figure className="m-0 lg:col-span-6">
            <ol className="grid gap-2">
              {HUB.together.chain.map((c, i) => (
                <li key={c.slug} className="grid grid-cols-[2rem_1fr] items-center gap-3">
                  <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full border border-accent/40 font-mono text-xs text-accent-soft">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#0d1424] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="text-[0.9375rem] text-foreground">{c.step}</span>
                    <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-accent-soft">{getService(c.slug).short}</span>
                  </span>
                </li>
              ))}
            </ol>
            <figcaption className="mt-3 text-sm text-subtle">Illustrative: one enquiry passing through five capabilities.</figcaption>
          </figure>
        </div>
      </Section>

      {/* Supporting services */}
      <Section id="supporting">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{HUB.supportingLabel}</Eyebrow>
            <SectionTitle id="supporting">Websites and digital growth</SectionTitle>
          </div>
          <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted lg:col-span-5 lg:pb-2">{HUB.supportingIntro}</p>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {SUPPORTING_SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-[20px] border border-white/[0.08] p-7 transition-colors hover:border-accent/50 hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft md:p-8"
              >
                <span className="text-[1.5rem] font-semibold tracking-[-0.025em] text-foreground md:text-[1.75rem]">{s.name}</span>
                <span className="mt-3 text-base leading-relaxed text-muted">{s.summary}</span>
                <span className="mt-auto pt-6 text-sm font-medium text-accent-soft">
                  Explore {s.short.toLowerCase()} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <PageCta title="Tell us about the problem" body="You don't need to know which service you need. Describe what you want to improve and we'll suggest the right starting point." />
    </>
  );
}
