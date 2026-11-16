"use client";

import Link from "next/link";
import { AI_APPROACH, AI_APPS, AI_CLOSE, AI_HERO, AI_OFFERS, AI_PAGE, AI_PAIN, AI_TRUST } from "@/config/aiPage";
import { Eyebrow, anchorOffset, bandSurface, BandEdge, solidBtn } from "@/components/home/Section";
import { Atmos, Breadcrumb, Faq, Points, Title, dots, h1, lead, textLink, wrap } from "@/components/solutions/kit";
import { primaryBtn } from "@/components/solutions/shared";
import { AppsVisual, ApproachVisual, CloseVisual, HeroVisual, OffersVisual, PainVisual, TrustVisual } from "./AiVisuals";

/**
 * /solutions/ai, sections (AI Service Page Plan V1.0, without the demo). Each section
 * pairs its copy with one dimensional visual built like the homepage's
 * service visuals (AiVisuals.tsx): it tilts with the pointer and its key card
 * lifts while the section is hovered, focused or (on touch) in view.
 * Backgrounds follow the homepage. Copy: src/config/aiPage.ts.
 */

// --- 01 Hero ------------------------------------------------------------------------------

export function AiHero() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="ai-title" className="relative isolate overflow-hidden">
      {dots}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_75%_45%,rgb(54_123_250/0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_10%_0%,rgb(110_160_255/0.06),transparent_70%)]" />
      <Atmos at={["74%", "48%"]} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-background" />
      <div className={`${wrap} pb-16 pt-[calc(var(--header-height)+env(safe-area-inset-top)+2.5rem)] md:pb-24 lg:pt-[calc(var(--header-height)+env(safe-area-inset-top)+3.5rem)]`}>
        <Breadcrumb label={AI_PAGE.label} />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,50fr)_minmax(0,50fr)] lg:gap-12">
          <div>
            <Eyebrow>{AI_HERO.eyebrow}</Eyebrow>
            <h1
              id="ai-title"
              className={h1}
            >
              {AI_HERO.title}
              <span className="text-accent">.</span>
            </h1>
            <p className={`mt-7 max-w-[38rem] ${lead}`}>{AI_HERO.lead}</p>
            <p className="mt-4 max-w-[36rem] text-[0.9375rem] leading-relaxed text-subtle md:text-base">{AI_HERO.support}</p>
            <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
              <Link href={AI_HERO.primary.href} className={primaryBtn}>
                {AI_HERO.primary.label} <span aria-hidden>→</span>
              </Link>
              <a href={AI_HERO.secondary.href} className={solidBtn}>
                {AI_HERO.secondary.label} <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
          <HeroVisual label={AI_HERO.visualLabel} />
        </div>
      </div>
    </section>
  );
}

// --- 02 Pain --------------------------------------------------------------------------------

export function AiPain() {
  return (
    <section id="ai-help" data-svc="" data-sr-section="" aria-labelledby="ai-pain-title" className={`relative ${bandSurface} ${anchorOffset}`} style={{ ["--surface" as string]: "#0b1322" }}>
      <BandEdge />
      {dots}
      <Atmos at={["22%", "100%"]} />
      <div className={`${wrap} grid items-center gap-10 py-20 md:py-24 lg:grid-cols-12 lg:gap-14`}>
        <div className="order-2 lg:order-1 lg:col-span-6">
          <PainVisual label={AI_PAIN.visualLabel} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <Eyebrow>{AI_PAIN.eyebrow}</Eyebrow>
          <Title id="ai-pain-title">{AI_PAIN.title}</Title>
          <p className={`mt-6 ${lead}`}>{AI_PAIN.body}</p>
          <Points items={AI_PAIN.items} />
        </div>
      </div>
    </section>
  );
}

// --- 03 Offerings -----------------------------------------------------------------------------

export function AiOffers() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="ai-offers-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["30%", "70%"]} acc="150 140 255" />
      <div className={`${wrap} py-20 md:py-24`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{AI_OFFERS.eyebrow}</Eyebrow>
            <Title id="ai-offers-title">{AI_OFFERS.title}</Title>
          </div>
          <p className={`max-w-[34rem] lg:col-span-5 lg:pb-2 ${lead}`}>{AI_OFFERS.intro}</p>
        </div>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <OffersVisual label={AI_OFFERS.visualLabel} />
          </div>
          <div className="lg:col-span-5">
            <Points items={AI_OFFERS.items} className="grid gap-3" />
            <p className="mt-6 text-[0.9375rem] text-muted">
              {AI_OFFERS.micro.lead}{" "}
              <Link href={AI_OFFERS.micro.href} className={textLink}>
                {AI_OFFERS.micro.label} <span aria-hidden>→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 05 Applications -------------------------------------------------------------------------

export function AiApps() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="ai-apps-title" className={`relative ${bandSurface} ${anchorOffset}`} style={{ ["--surface" as string]: "#0b1322" }}>
      <BandEdge />
      {dots}
      <Atmos at={["72%", "50%"]} acc="45 205 180" />
      <div className={`${wrap} py-20 md:py-24`}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow>{AI_APPS.eyebrow}</Eyebrow>
            <Title id="ai-apps-title">{AI_APPS.title}</Title>
            <p className={`mt-6 ${lead}`}>{AI_APPS.lead}</p>
            <Points items={AI_APPS.items} ordered />
            <p className="mt-5 text-[0.8125rem] text-subtle">{AI_APPS.clarification}</p>
          </div>
          <div className="lg:col-span-7">
            <AppsVisual label={AI_APPS.visualLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 06 Approach ---------------------------------------------------------------------------

export function AiApproach() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="ai-approach-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["15%", "100%"]} />
      <div className={`${wrap} py-20 md:py-24`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{AI_APPROACH.eyebrow}</Eyebrow>
            <Title id="ai-approach-title">{AI_APPROACH.title}</Title>
          </div>
          <p className={`max-w-[34rem] lg:col-span-5 lg:pb-2 ${lead}`}>{AI_APPROACH.lead}</p>
        </div>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Points items={AI_APPROACH.stages.map((s) => ({ title: s.name, body: s.body }))} ordered className="grid gap-3" />
          </div>
          <div className="lg:col-span-7">
            <ApproachVisual label={AI_APPROACH.visualLabel} />
          </div>
        </div>
        <div className="mt-10">
          <Link href={AI_APPROACH.cta.href} className={solidBtn}>
            {AI_APPROACH.cta.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- 07 Responsible -------------------------------------------------------------------------

export function AiTrust() {
  return (
    <section data-sr-section="" aria-labelledby="ai-trust-title" className={`relative ${bandSurface} ${anchorOffset}`} style={{ ["--surface" as string]: "#0b1322" }}>
      <BandEdge />
      {dots}
      <Atmos at={["80%", "12%"]} />
      <div className={`${wrap} py-20 md:py-24`}>
        <div data-svc="" className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Eyebrow>{AI_TRUST.eyebrow}</Eyebrow>
            <Title id="ai-trust-title">{AI_TRUST.title}</Title>
            <p className={`mt-6 ${lead}`}>{AI_TRUST.body}</p>
            <Points items={AI_TRUST.principles} />
          </div>
          <div className="lg:col-span-6">
            <TrustVisual label={AI_TRUST.visualLabel} />
          </div>
        </div>

        <div className="mt-16">
          <Faq items={AI_TRUST.faq} cta={AI_TRUST.cta} />
        </div>
      </div>
    </section>
  );
}

// --- 08 Conversation --------------------------------------------------------------------------

export function AiClose() {
  return (
    <section data-sr-section="" aria-labelledby="ai-close-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <div className={`${wrap} pb-24 pt-6 md:pb-28`}>
        <div data-svc="" className="relative isolate overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#0a1324] px-6 py-12 sm:px-10 md:py-16 lg:px-16">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_75%_at_88%_105%,rgb(54_123_250/0.3),transparent_70%),radial-gradient(ellipse_45%_50%_at_0%_0%,rgb(110_160_255/0.08),transparent_70%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/70 to-transparent" />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <Eyebrow>{AI_CLOSE.eyebrow}</Eyebrow>
              <Title id="ai-close-title">{AI_CLOSE.title}</Title>
              <p className={`mt-6 ${lead}`}>{AI_CLOSE.body}</p>
              <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
                <Link href={AI_CLOSE.primary.href} className={primaryBtn}>
                  {AI_CLOSE.primary.label} <span aria-hidden>→</span>
                </Link>
                <Link href={AI_CLOSE.secondary.href} className={solidBtn}>
                  {AI_CLOSE.secondary.label}
                </Link>
              </div>
              <nav aria-label="Related services" className="mt-8">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Related services</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
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
            <div className="lg:col-span-6">
              <CloseVisual label={AI_CLOSE.visualLabel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
