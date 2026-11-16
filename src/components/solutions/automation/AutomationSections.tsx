"use client";

import Link from "next/link";
import { AUTO_APPROACH, AUTO_APPS, AUTO_CLOSE, AUTO_HERO, AUTO_HOW, AUTO_PAGE, AUTO_PAIN, AUTO_TRUST } from "@/config/automationPage";
import { Eyebrow, anchorOffset, bandSurface, BandEdge, solidBtn } from "@/components/home/Section";
import { Atmos, Breadcrumb, Faq, Points, Title, dots, h1, lead, textLink, wrap } from "@/components/solutions/kit";
import { primaryBtn } from "@/components/solutions/shared";
import { AppsVisual, ApproachVisual, CloseVisual, HeroVisual, HowVisual, PainVisual, TrustVisual } from "./AutomationVisuals";

/**
 * /solutions/automation, sections (Business Automation Plan V1.0, without
 * the interactive demo, matching the AI page). Each section pairs its copy
 * with one dimensional visual built like the homepage's service visuals
 * (AutomationVisuals.tsx). Backgrounds follow the homepage.
 * Copy: src/config/automationPage.ts.
 */

const band = { ["--surface" as string]: "#0b1322" };

// --- 01 Hero ------------------------------------------------------------------------------

export function AutoHero() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="auto-title" className="relative isolate overflow-hidden">
      {dots}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_75%_45%,rgb(54_123_250/0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_10%_0%,rgb(110_160_255/0.06),transparent_70%)]" />
      <Atmos at={["74%", "48%"]} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-background" />
      <div className={`${wrap} pb-16 pt-[calc(var(--header-height)+env(safe-area-inset-top)+2.5rem)] md:pb-24 lg:pt-[calc(var(--header-height)+env(safe-area-inset-top)+3.5rem)]`}>
        <Breadcrumb label={AUTO_PAGE.label} />
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)] lg:gap-12">
          <div>
            <Eyebrow>{AUTO_HERO.eyebrow}</Eyebrow>
            <h1 id="auto-title" className={h1}>
              {AUTO_HERO.title}
              <span className="text-accent">.</span>
            </h1>
            <p className={`mt-7 max-w-[38rem] ${lead}`}>{AUTO_HERO.lead}</p>
            <p className="mt-4 max-w-[36rem] text-[0.9375rem] leading-relaxed text-subtle md:text-base">{AUTO_HERO.support}</p>
            <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
              <Link href={AUTO_HERO.primary.href} className={primaryBtn}>
                {AUTO_HERO.primary.label} <span aria-hidden>→</span>
              </Link>
              <a href={AUTO_HERO.secondary.href} className={solidBtn}>
                {AUTO_HERO.secondary.label} <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
          <HeroVisual label={AUTO_HERO.visualLabel} />
        </div>
      </div>
    </section>
  );
}

// --- 02 Pain --------------------------------------------------------------------------------

export function AutoPain() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="auto-pain-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["22%", "100%"]} acc="224 162 74" />
      <div className={`${wrap} grid items-center gap-10 py-20 md:py-24 lg:grid-cols-12 lg:gap-14`}>
        <div className="order-2 lg:order-1 lg:col-span-7">
          <PainVisual label={AUTO_PAIN.visualLabel} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5">
          <Eyebrow>{AUTO_PAIN.eyebrow}</Eyebrow>
          <Title id="auto-pain-title">{AUTO_PAIN.title}</Title>
          <p className={`mt-6 ${lead}`}>{AUTO_PAIN.body}</p>
          <Points items={AUTO_PAIN.items} />
        </div>
      </div>
    </section>
  );
}

// --- 03 What automation changes ----------------------------------------------------------------

export function AutoHow() {
  return (
    <section id={AUTO_HOW.anchor} data-svc="" data-sr-section="" aria-labelledby="auto-how-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["50%", "85%"]} />
      <div className={`${wrap} py-20 md:py-24`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{AUTO_HOW.eyebrow}</Eyebrow>
            <Title id="auto-how-title">{AUTO_HOW.title}</Title>
          </div>
          <p className={`max-w-[34rem] lg:col-span-5 lg:pb-2 ${lead}`}>{AUTO_HOW.body}</p>
        </div>
        <Points items={AUTO_HOW.stages} ordered className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4" />
        <div className="mx-auto mt-12 max-w-[64rem]">
          <HowVisual label={AUTO_HOW.visualLabel} />
        </div>
        <div className="mt-10 flex justify-center">
          <Link href={AUTO_HOW.cta.href} className={primaryBtn}>
            {AUTO_HOW.cta.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- 04 Applications -------------------------------------------------------------------------

export function AutoApps() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="auto-apps-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["30%", "60%"]} acc="45 205 180" />
      <div className={`${wrap} py-20 md:py-24`}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <AppsVisual label={AUTO_APPS.visualLabel} />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <Eyebrow>{AUTO_APPS.eyebrow}</Eyebrow>
            <Title id="auto-apps-title">{AUTO_APPS.title}</Title>
            <p className={`mt-6 ${lead}`}>{AUTO_APPS.lead}</p>
            <Points items={AUTO_APPS.items} ordered />
            <ul className="mt-6 grid gap-1 text-[0.9375rem] text-muted">
              {AUTO_APPS.related.map((r) => (
                <li key={r.href}>
                  {r.lead}{" "}
                  <Link href={r.href} className={textLink}>
                    {r.label} <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 05 Approach ---------------------------------------------------------------------------

export function AutoApproach() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="auto-approach-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["85%", "100%"]} />
      <div className={`${wrap} py-20 md:py-24`}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{AUTO_APPROACH.eyebrow}</Eyebrow>
            <Title id="auto-approach-title">{AUTO_APPROACH.title}</Title>
          </div>
          <p className={`max-w-[34rem] lg:col-span-5 lg:pb-2 ${lead}`}>{AUTO_APPROACH.lead}</p>
        </div>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ApproachVisual label={AUTO_APPROACH.visualLabel} />
          </div>
          <div className="lg:col-span-5">
            <Points items={AUTO_APPROACH.stages} ordered className="grid gap-3" />
            <div className="mt-8">
              <Link href={AUTO_APPROACH.cta.href} className={solidBtn}>
                {AUTO_APPROACH.cta.label} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 06 Trust -------------------------------------------------------------------------------

export function AutoTrust() {
  return (
    <section data-sr-section="" aria-labelledby="auto-trust-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["80%", "12%"]} />
      <div className={`${wrap} py-20 md:py-24`}>
        <div data-svc="" className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Eyebrow>{AUTO_TRUST.eyebrow}</Eyebrow>
            <Title id="auto-trust-title">{AUTO_TRUST.title}</Title>
            <p className={`mt-6 ${lead}`}>{AUTO_TRUST.body}</p>
            <Points items={AUTO_TRUST.principles} className="mt-8 grid gap-3 sm:grid-cols-2" />
          </div>
          <div className="lg:col-span-6">
            <TrustVisual label={AUTO_TRUST.visualLabel} />
          </div>
        </div>
        <div className="mt-16">
          <Faq items={AUTO_TRUST.faq} cta={AUTO_TRUST.cta} />
        </div>
      </div>
    </section>
  );
}

// --- 07 Close --------------------------------------------------------------------------------

export function AutoClose() {
  return (
    <section data-sr-section="" aria-labelledby="auto-close-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <div className={`${wrap} pb-24 pt-16 md:pb-28`}>
        <div data-svc="" className="relative isolate overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#0a1324] px-6 py-12 sm:px-10 md:py-16 lg:px-16">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_75%_at_88%_105%,rgb(54_123_250/0.3),transparent_70%),radial-gradient(ellipse_45%_50%_at_0%_0%,rgb(110_160_255/0.08),transparent_70%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/70 to-transparent" />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <Eyebrow>{AUTO_CLOSE.eyebrow}</Eyebrow>
              <Title id="auto-close-title">{AUTO_CLOSE.title}</Title>
              <p className={`mt-6 ${lead}`}>{AUTO_CLOSE.body}</p>
              <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
                <Link href={AUTO_CLOSE.primary.href} className={primaryBtn}>
                  {AUTO_CLOSE.primary.label} <span aria-hidden>→</span>
                </Link>
                <Link href={AUTO_CLOSE.secondary.href} className={solidBtn}>
                  {AUTO_CLOSE.secondary.label}
                </Link>
              </div>
              <nav aria-label="Related" className="mt-8">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Related</p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {AUTO_CLOSE.related.map((r) => (
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
              <CloseVisual label={AUTO_CLOSE.visualLabel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
