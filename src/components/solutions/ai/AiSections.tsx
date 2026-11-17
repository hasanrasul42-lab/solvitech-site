"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { AI_ALONGSIDE, AI_APPROACH, AI_APPS, AI_CLOSE, AI_DISCOVERY, AI_HERO, AI_PAGE } from "@/config/aiPage";
import { Eyebrow, anchorOffset, bandSurface, BandEdge, solidBtn } from "@/components/home/Section";
import { Atmos, Breadcrumb, dots, textLink, wrap } from "@/components/solutions/kit";
import { primaryBtn } from "@/components/solutions/shared";
import { AlongsideVisual, AppsVisual, ApproachVisual, CloseVisual, DiscoveryVisual, HeroVisual } from "./AiVisuals";

/**
 * /solutions/ai, sections 00-05 (founder copy, November 2026). Each section
 * pairs its copy with one dimensional visual built like the homepage's
 * service visuals (AiVisuals.tsx). Backgrounds follow the homepage.
 *
 * Fit: on a desktop screen (from about 1280 x 760 of visible page) every
 * section fits in one view at 100% zoom, so copy sits beside its visual
 * rather than below it, and visuals have a capped size. Body text stays at
 * 15-17px. On smaller screens sections stack and scroll as normal.
 * Copy: src/config/aiPage.ts.
 */

const band = { ["--surface" as string]: "#0b1322" };
/** Section padding: compact on desktop so a section fits one screen. */
const pad = "py-16 lg:py-10";
const body = "text-[0.9375rem] leading-relaxed text-muted lg:text-base";

function Title({ id, children }: { id: string; children: string }) {
  const question = /[?!]$/.test(children);
  return (
    <h2
      id={id}
      className="reveal mt-4 text-[clamp(1.9rem,7vw,2.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-foreground lg:text-[clamp(2.1rem,2.6vw,2.6rem)]"
    >
      {children}
      {!question && <span className="text-accent">.</span>}
    </h2>
  );
}

/** Numbered points, compact enough to sit beside a visual. */
function Steps({ items, cols = "" }: { items: { title: string; body: string }[]; cols?: string }) {
  return (
    <ol className={`grid gap-2.5 ${cols}`}>
      {items.map((it, i) => (
        <li key={it.title} className="lift-card flex items-start gap-3.5 rounded-[16px] px-4 py-3.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent/35 bg-accent/[0.12] font-mono text-[0.7rem] text-accent-soft">{i + 1}</span>
          <span>
            <span className="block text-[1rem] font-semibold tracking-[-0.01em] text-foreground">{it.title}</span>
            <span className="mt-1 block text-[0.9375rem] leading-snug text-muted">{it.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** A visual with a capped height, so its section fits one screen. */
function Fit({ max, children }: { max: string; children: ReactNode }) {
  return <div className={`mx-auto w-full ${max}`}>{children}</div>;
}

// --- 00 Introduction ----------------------------------------------------------------------

export function AiHero() {
  const { stat } = AI_HERO;
  return (
    <>
      <section data-svc="" data-sr-section="" aria-labelledby="ai-title" className="relative isolate overflow-hidden">
        {dots}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_75%_45%,rgb(54_123_250/0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_10%_0%,rgb(110_160_255/0.06),transparent_70%)]" />
        <Atmos at={["74%", "48%"]} />
        <div className={`${wrap} pb-12 pt-[calc(var(--header-height)+env(safe-area-inset-top)+1.75rem)] lg:pb-10 lg:pt-[calc(var(--header-height)+env(safe-area-inset-top)+1.5rem)]`}>
          <Breadcrumb label={AI_PAGE.label} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,50fr)_minmax(0,50fr)] lg:gap-12">
            <div>
              <Eyebrow>{AI_HERO.eyebrow}</Eyebrow>
              <h1
                id="ai-title"
                className="mt-4 max-w-[22ch] text-[clamp(2.2rem,8.4vw,2.9rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-foreground md:text-[clamp(2.9rem,5.6vw,3.6rem)] lg:text-[clamp(2.8rem,3.6vw,3.6rem)]"
              >
                {AI_HERO.title}
              </h1>

              {/* The adoption figure, with its source. */}
              <figure className="mt-6 max-w-[36rem]">
                <div className="flex items-end gap-5">
                  <div>
                    <p className="text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-subtle">{stat.from.value}</p>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.12em] text-subtle">{stat.from.year}</p>
                  </div>
                  <span aria-hidden className="mb-3 h-px flex-1 bg-gradient-to-r from-white/15 to-accent/80" />
                  <div>
                    <p className="text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-foreground">{stat.to.value}</p>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.12em] text-accent-soft">{stat.to.year}</p>
                  </div>
                </div>
                <figcaption className="mt-3 text-[0.875rem] leading-relaxed text-subtle">
                  <a href={stat.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-white/60">
                    {stat.caption}
                  </a>
                </figcaption>
              </figure>

              <p className="mt-5 max-w-[36rem] text-[1.0625rem] font-medium leading-relaxed text-foreground">{AI_HERO.close}</p>
              <div className="mt-6 flex flex-col gap-3 min-[460px]:flex-row">
                <a href={AI_HERO.primary.href} className={primaryBtn}>
                  {AI_HERO.primary.label} <span aria-hidden>↓</span>
                </a>
                <Link href={AI_HERO.secondary.href} className={solidBtn}>
                  {AI_HERO.secondary.label} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <Fit max="lg:max-w-[38rem]">
              <HeroVisual label={AI_HERO.visualLabel} />
            </Fit>
          </div>
        </div>
      </section>

      {/* The context, and two short points: a band of its own under the hero. */}
      <section aria-label="Why AI, and how to begin" data-sr-section="" className="relative isolate">
        {dots}
        <div className={`${wrap} pb-14 lg:pb-12`}>
          <div className="grid gap-8 border-t border-white/[0.08] pt-10 lg:grid-cols-12 lg:gap-12">
            <div className="grid content-start gap-4 lg:col-span-5">
              <p className="text-[1.0625rem] font-medium leading-relaxed text-foreground">{AI_HERO.paragraphs[0]}</p>
              <p className={body}>{AI_HERO.paragraphs[1]}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {AI_HERO.cards.map((c) => (
                <div key={c.title} className="lift-card rounded-[18px] p-5">
                  <h2 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-foreground">{c.title}</h2>
                  <p className={`mt-2 ${body}`}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// --- 01 AI Consulting & Discovery ------------------------------------------------------------

export function AiDiscovery() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="ai-discovery-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["22%", "100%"]} acc="150 140 255" />
      <div className={`${wrap} ${pad} grid items-center gap-10 lg:grid-cols-12 lg:gap-12`}>
        <div className="lg:col-span-6">
          <Eyebrow>{AI_DISCOVERY.eyebrow}</Eyebrow>
          <Title id="ai-discovery-title">{AI_DISCOVERY.title}</Title>
          <div className={`mt-4 grid gap-2.5 ${body}`}>
            {AI_DISCOVERY.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-5">
            <Steps items={AI_DISCOVERY.steps} />
          </div>
        </div>
        <div className="lg:col-span-6">
          <Fit max="lg:max-w-[36rem]">
            <DiscoveryVisual label={AI_DISCOVERY.visualLabel} />
          </Fit>
          <p className="mt-6 text-center text-[1rem] font-medium text-foreground">{AI_DISCOVERY.close}</p>
        </div>
      </div>
    </section>
  );
}

// --- 02 Practical AI Applications ------------------------------------------------------------

export function AiApps() {
  // One application in focus at a time: the list stays short and scannable,
  // the chosen one is read in full beside the visual. Hover, focus or tap.
  const [active, setActive] = useState(0);
  const uid = useId();
  const item = AI_APPS.items[active];
  return (
    <section id={AI_APPS.anchor} data-svc="" data-sr-section="" aria-labelledby="ai-apps-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["72%", "20%"]} acc="45 205 180" />
      <div className={`${wrap} ${pad}`}>
        <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Eyebrow>{AI_APPS.eyebrow}</Eyebrow>
            <Title id="ai-apps-title">{AI_APPS.title}</Title>
          </div>
          <p className={`lg:col-span-6 lg:pb-1 ${body}`}>{AI_APPS.lead}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-12">
          <ol className="grid content-start gap-1.5 lg:col-span-5" aria-label="Applications">
            {AI_APPS.items.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.label}>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls={`${uid}-detail`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center gap-4 rounded-[14px] border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft ${
                      on ? "border-[#5fe0c8]/40 bg-[#5fe0c8]/[0.07]" : "border-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className={`font-mono text-sm ${on ? "text-[#5fe0c8]" : "text-subtle"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[1.0625rem] font-medium leading-snug ${on ? "text-foreground" : "text-muted"}`}>{it.headline}</span>
                    <span aria-hidden className={`ml-auto text-lg transition-opacity ${on ? "text-[#5fe0c8] opacity-100" : "opacity-0"}`}>
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div id={`${uid}-detail`} aria-live="polite" className="lift-card grid items-center gap-6 rounded-[24px] p-6 sm:p-8 lg:col-span-7 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#5fe0c8]">{item.label}</p>
              <h3 className="mt-3 text-[1.5rem] font-semibold leading-snug tracking-[-0.02em] text-foreground">{item.headline}</h3>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{item.body}</p>
            </div>
            <Fit max="max-w-[16rem] lg:max-w-none">
              <AppsVisual label={AI_APPS.visualLabel} />
            </Fit>
          </div>
        </div>
        <p className="mt-6 text-[0.9375rem] text-subtle">{AI_APPS.close}</p>
      </div>
    </section>
  );
}

// --- 03 From Idea to Implementation ------------------------------------------------------------

export function AiApproach() {
  const { note } = AI_APPROACH;
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="ai-approach-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["15%", "100%"]} />
      <div className={`${wrap} ${pad}`}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{AI_APPROACH.eyebrow}</Eyebrow>
            <Title id="ai-approach-title">{AI_APPROACH.title}</Title>
            <div className={`mt-4 grid gap-2.5 ${body}`}>
              {AI_APPROACH.lead.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-5 rounded-[18px] border border-white/[0.09] bg-white/[0.02] p-5">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-foreground">{note.title}</h3>
              <p className={`mt-1.5 ${body}`}>{note.body}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.9375rem] font-medium text-accent-soft">{note.close}</p>
                <Link href={AI_APPROACH.cta.href} className={textLink}>
                  {AI_APPROACH.cta.label} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Fit max="lg:max-w-[30rem]">
              <ApproachVisual label={AI_APPROACH.visualLabel} />
            </Fit>
          </div>
        </div>
        <div className="mt-7">
          <Steps items={AI_APPROACH.stages} cols="md:grid-cols-2 lg:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}

// --- 04 AI That Works Alongside Your Team ----------------------------------------------------------

export function AiAlongside() {
  return (
    <>
      <section data-svc="" data-sr-section="" aria-labelledby="ai-alongside-title" className={`relative isolate ${anchorOffset}`}>
        {dots}
        <Atmos at={["80%", "30%"]} />
        <div className={`${wrap} py-16 lg:py-14`}>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow>{AI_ALONGSIDE.eyebrow}</Eyebrow>
              <Title id="ai-alongside-title">{AI_ALONGSIDE.title}</Title>
              <div className="mt-6 grid gap-4 text-[1.0625rem] leading-relaxed text-muted">
                {AI_ALONGSIDE.intro.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="lift-card mt-8 rounded-[20px] p-6 sm:p-7">
                <h3 className="text-[1.1875rem] font-semibold leading-snug tracking-[-0.015em] text-foreground">{AI_ALONGSIDE.control.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-muted">{AI_ALONGSIDE.control.body}</p>
              </div>
              <p className="mt-6 text-[1.0625rem] font-medium text-accent-soft">{AI_ALONGSIDE.close}</p>
            </div>
            <div className="lg:col-span-6">
              <Fit max="lg:max-w-[38rem]">
                <AlongsideVisual label={AI_ALONGSIDE.visualLabel} />
              </Fit>
            </div>
          </div>
        </div>
      </section>

      {/* The after-hours call, step by step: the same topic, on its own screen. */}
      <section aria-label="An after-hours call, step by step" data-sr-section="" className="relative isolate">
        {dots}
        <div className={`${wrap} pb-16 pt-4 lg:pb-14 lg:pt-6`}>
          <ol className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {AI_ALONGSIDE.story.map((s, i) => (
              <li key={s.label} className="lift-card relative flex flex-col rounded-[24px] p-7 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-accent/40 bg-accent/[0.12] font-mono text-sm text-accent-soft">0{i + 1}</span>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent-soft">{s.label}</span>
                  {i < AI_ALONGSIDE.story.length - 1 && <span aria-hidden className="ml-auto hidden text-xl text-white/25 lg:block">→</span>}
                </div>
                <h3 className="mt-6 text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-foreground">{s.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[0.875rem] text-subtle">{AI_ALONGSIDE.disclaimer}</p>
        </div>
      </section>
    </>
  );
}

// --- 05 Start a Conversation --------------------------------------------------------------------

export function AiClose() {
  return (
    <section data-sr-section="" aria-labelledby="ai-close-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["50%", "100%"]} />
      <div className={`${wrap} py-16 lg:py-12`}>
        <div data-svc="" className="relative isolate overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#0a1324] px-6 py-10 sm:px-10 lg:px-14 lg:py-10">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_75%_at_88%_105%,rgb(54_123_250/0.3),transparent_70%),radial-gradient(ellipse_45%_50%_at_0%_0%,rgb(110_160_255/0.08),transparent_70%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/70 to-transparent" />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Eyebrow>{AI_CLOSE.eyebrow}</Eyebrow>
              <Title id="ai-close-title">{AI_CLOSE.title}</Title>
              <p className="mt-4 text-[1.0625rem] font-medium leading-relaxed text-foreground">{AI_CLOSE.body[0]}</p>
              <div className={`mt-2.5 grid gap-2 ${body}`}>
                {AI_CLOSE.body.slice(1).map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 min-[460px]:flex-row min-[460px]:items-center">
                <Link href={AI_CLOSE.primary.href} className={primaryBtn}>
                  {AI_CLOSE.primary.label} <span aria-hidden>→</span>
                </Link>
                <Link href={AI_CLOSE.secondary.href} className={solidBtn}>
                  {AI_CLOSE.secondary.label}
                </Link>
              </div>
              <p className="mt-4 text-[0.9375rem] font-medium text-foreground">{AI_CLOSE.signoff}</p>
            </div>
            <div className="lg:col-span-5">
              <Fit max="lg:max-w-[28rem]">
                <CloseVisual label={AI_CLOSE.visualLabel} />
              </Fit>
              <nav aria-label="Related services" className="mt-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Related services</p>
                <ul className="mt-2 flex flex-wrap gap-x-5">
                  {AI_CLOSE.related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className={`${textLink} text-[0.9375rem]`}>
                        {r.label} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <p className="mt-5 max-w-[60rem] text-[0.8125rem] leading-relaxed text-subtle">
          {AI_CLOSE.attribution.text}{" "}
          <a href={AI_CLOSE.attribution.href} target="_blank" rel="noopener noreferrer" className="text-accent-soft underline underline-offset-4 hover:text-foreground">
            {AI_CLOSE.attribution.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
