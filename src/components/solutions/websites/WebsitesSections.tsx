"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { WEB_CLOSE, WEB_COSTS, WEB_FAQ, WEB_HERO, WEB_NEED, WEB_PAGE, WEB_QUALITY, WEB_SCENARIOS, WEB_SERVICES, WEB_UX } from "@/config/websitesPage";
import { Eyebrow, anchorOffset, bandSurface, BandEdge, gutter, solidBtn } from "@/components/home/Section";
import { Atmos, Breadcrumb, dots } from "@/components/solutions/kit";
import { primaryBtn } from "@/components/solutions/shared";
import { WebsiteBuilds, WebsiteClose, WebsiteFocus, WebsiteHero, WebsiteSigns } from "@/components/solutions/story/WebsiteVisuals";
import { CostsVisual, QualityVisual, ScenariosVisual } from "./WebsitesVisuals";

/**
 * /solutions/websites (founder copy, November 2026), laid out as an editorial
 * page rather than a run of card rows. One system throughout:
 *   - one container (1280px of content), one 12-column grid
 *   - section headings ~43px with tight leading, body 16px at 1.65
 *   - mostly the near-black page; navy bands only for the selector and the
 *     three situations
 *   - each section a different form: split hero, editorial transition,
 *     accordion, integrated selector, 2x2 grid, ruled rows, ruled columns,
 *     ruled list, FAQ, one dominant closing panel
 *   - cards only where they help (the four benefits): 16px radius, 28px padding
 * Sections aim to fit one 1440x800 screen; the five quality details may run
 * slightly over. Copy: src/config/websitesPage.ts (unchanged).
 */

const wrap = `mx-auto w-full max-w-[1376px] ${gutter}`;
const band = { ["--surface" as string]: "#0b1322" };
const pad = "py-16 lg:py-12";
const body = "text-base leading-[1.65] text-muted";
const rule = "border-white/[0.08]";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/** Section title; the copy's closing full stop becomes the accent one. */
function Title({ id, children, className = "" }: { id: string; children: string; className?: string }) {
  const question = /[?!]$/.test(children);
  const text = children.replace(/\.$/, "");
  return (
    <h2
      id={id}
      className={`reveal mt-4 text-balance text-[clamp(1.9rem,7vw,2.4rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground lg:text-[clamp(2.25rem,3vw,2.75rem)] ${className}`}
    >
      {text}
      {!question && <span className="text-accent">.</span>}
    </h2>
  );
}

function Paras({ items, className = body }: { items: string[]; className?: string }) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {items.map((p) => (
        <p key={p.slice(0, 32)}>{p}</p>
      ))}
    </div>
  );
}

function Fit({ max, children }: { max: string; children: ReactNode }) {
  return <div className={`w-full ${max}`}>{children}</div>;
}

/** One-open-at-a-time rows (native details, grouped by name). */
function Accordion({ group, items, first = true, numbered = true }: { group: string; items: { title: string; body: string[] }[]; first?: boolean; numbered?: boolean }) {
  return (
    <div className={`border-b ${rule}`}>
      {items.map((it, i) => (
        <details key={it.title} name={group} open={first && i === 0} className={`group border-t ${rule}`}>
          <summary className={`flex min-h-[3.75rem] cursor-pointer list-none items-center gap-5 py-3.5 text-[1.0625rem] font-medium text-foreground ${focus} [&::-webkit-details-marker]:hidden`}>
            {numbered && <span className="w-6 font-mono text-sm text-subtle group-open:text-foreground">{String(i + 1).padStart(2, "0")}</span>}
            <span className="flex-1">{it.title}</span>
            <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full border border-white/10 text-base text-subtle transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <div className={`pb-5 ${numbered ? "pl-11" : ""} pr-12`}>
            <Paras items={it.body} className="text-[0.9375rem] leading-[1.65] text-muted" />
          </div>
        </details>
      ))}
    </div>
  );
}

// --- 00 Hero + introduction -----------------------------------------------------------------

export function WebHero() {
  return (
    <>
      <section data-svc="" data-sr-section="" aria-labelledby="web-title" className="relative isolate overflow-hidden">
        {dots}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_75%_45%,rgb(150_140_255/0.09),transparent_70%),radial-gradient(ellipse_60%_40%_at_10%_0%,rgb(110_160_255/0.05),transparent_70%)]" />
        <Atmos at={["72%", "50%"]} />
        <div className={`${wrap} pb-10 pt-[calc(var(--header-height)+env(safe-area-inset-top)+1.75rem)] lg:pt-[calc(var(--header-height)+env(safe-area-inset-top)+1.5rem)]`}>
          <Breadcrumb label={WEB_PAGE.label} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:gap-10">
            <div>
              <Eyebrow>{WEB_HERO.eyebrow}</Eyebrow>
              <h1
                id="web-title"
                className="mt-5 max-w-[16ch] text-[clamp(2.3rem,8.6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-foreground md:text-[clamp(3rem,5.8vw,3.75rem)] lg:text-[clamp(3rem,4vw,4rem)]"
              >
                {WEB_HERO.title.replace(/\.$/, "")}
                <span className="text-accent">.</span>
              </h1>
              <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.65] text-muted md:text-lg">{WEB_HERO.lead}</p>
              <div className="mt-8 flex flex-col gap-3 min-[460px]:flex-row">
                <Link href={WEB_HERO.primary.href} className={primaryBtn}>
                  {WEB_HERO.primary.label} <span aria-hidden>→</span>
                </Link>
                <a href={WEB_HERO.secondary.href} className={solidBtn}>
                  {WEB_HERO.secondary.label} <span aria-hidden>↓</span>
                </a>
              </div>
            </div>
            <Fit max="mx-auto lg:max-w-none">
              <WebsiteHero />
            </Fit>
          </div>
        </div>
      </section>

      {/* An editorial transition: a narrow, left-aligned passage behind a fine rule. */}
      <section aria-label="How we approach a website" data-sr-section="" className="relative isolate">
        {dots}
        <div className={`${wrap} pb-16 pt-6 lg:pb-20`}>
          <div className={`grid gap-6 border-t ${rule} pt-10 lg:grid-cols-12 lg:gap-12`}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle lg:col-span-3 lg:pt-1.5">Our approach</p>
            <div className="grid max-w-[44rem] gap-4 lg:col-span-9">
              <p className="text-[1.25rem] font-medium leading-[1.55] tracking-[-0.01em] text-foreground">{WEB_HERO.paragraphs[0]}</p>
              <p className={body}>{WEB_HERO.paragraphs[1]}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// --- 01 Recognising the need: 40 / 60, text beside the scenario rows ----------------------------

export function WebNeed() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="web-need-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["80%", "15%"]} />
      <div className={`${wrap} ${pad} grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16`}>
        <div>
          <Eyebrow>{WEB_NEED.eyebrow}</Eyebrow>
          <Title id="web-need-title">{WEB_NEED.title}</Title>
          <div className="mt-5">
            <Paras items={WEB_NEED.body} />
          </div>
          <p className="mt-7 border-l-2 border-white/15 pl-4 text-base font-medium leading-[1.6] text-foreground">{WEB_NEED.close}</p>
        </div>
        <div>
          <div className="flex justify-end">
            <Fit max="max-w-[12.5rem]">
              <WebsiteSigns />
            </Fit>
          </div>
          <div className="mt-2">
            <Accordion group="web-need" items={WEB_NEED.items} />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 02 Website types: heading across the top, one integrated selector ---------------------------

export function WebServices() {
  // One website type in focus at a time (hover, focus or tap).
  const [active, setActive] = useState(0);
  const uid = useId();
  const item = WEB_SERVICES.items[active];
  return (
    <section id={WEB_SERVICES.anchor} data-svc="" data-sr-section="" aria-labelledby="web-services-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["78%", "100%"]} />
      <div className={`${wrap} ${pad}`}>
        <Eyebrow>{WEB_SERVICES.eyebrow}</Eyebrow>
        <Title id="web-services-title" className="max-w-[26ch]">
          {WEB_SERVICES.title}
        </Title>
        <p className={`mt-4 max-w-[76rem] ${body}`}>{WEB_SERVICES.lead.join(" ")}</p>

        <div className={`mt-7 grid overflow-hidden rounded-[16px] border ${rule} bg-[linear-gradient(170deg,rgb(255_255_255/0.035),rgb(255_255_255/0.01)_50%)] lg:grid-cols-[17.5rem_minmax(0,1fr)]`}>
          <ol aria-label="Website types" className={`border-b ${rule} p-3 lg:border-b-0 lg:border-r`}>
            {WEB_SERVICES.items.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.title}>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls={`${uid}-detail`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`relative flex w-full items-center gap-3.5 rounded-[10px] px-4 py-3 text-left transition-colors ${focus} ${on ? "bg-white/[0.05]" : "hover:bg-white/[0.025]"}`}
                  >
                    <span aria-hidden className={`absolute inset-y-2.5 left-0 w-[2px] rounded-full bg-accent transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                    <span className={`font-mono text-xs ${on ? "text-foreground" : "text-subtle"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[0.9375rem] font-medium leading-snug ${on ? "text-foreground" : "text-muted"}`}>{it.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div id={`${uid}-detail`} aria-live="polite" className="grid items-center gap-8 p-7 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:gap-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">{item.title}</p>
              <h3 className="mt-3 text-balance text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.02em] text-foreground">{item.tagline}</h3>
              <div className="mt-4">
                <Paras items={item.body} className="text-[0.9375rem] leading-[1.65] text-muted" />
              </div>
            </div>
            <Fit max="mx-auto max-w-[17rem]">
              <WebsiteBuilds />
            </Fit>
          </div>
        </div>
        <p className="mt-5 text-[0.9375rem] leading-[1.6] text-subtle">{WEB_SERVICES.close}</p>
      </div>
    </section>
  );
}

// --- 03 A better experience: introduction with the phones, four benefits as a 2 x 2 grid ----------

export function WebUx() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="web-ux-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["18%", "75%"]} />
      <div className={`${wrap} py-16 lg:py-10 grid gap-10 lg:grid-cols-12 lg:gap-12`}>
        <div className="flex flex-col lg:col-span-5">
          <Eyebrow>{WEB_UX.eyebrow}</Eyebrow>
          <Title id="web-ux-title">{WEB_UX.title}</Title>
          <div className="mt-4">
            <Paras items={WEB_UX.body} className="grid gap-2 text-base leading-[1.6] text-muted" />
          </div>
          <p className="mt-4 text-base font-medium leading-[1.6] text-foreground">{WEB_UX.close}</p>
          <div className="mt-6 lg:mt-auto lg:pt-4">
            <Fit max="max-w-[12rem]">
              <WebsiteFocus />
            </Fit>
          </div>
        </div>
        <ol className="grid content-center gap-4 sm:grid-cols-2 lg:col-span-7">
          {WEB_UX.steps.map((s, i) => (
            <li key={s.title} className="lift-card rounded-[16px] p-6">
              <div className="flex items-start gap-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs">{i + 1}</span>
                <h3 className="pt-1 text-[1.125rem] font-semibold leading-snug tracking-[-0.015em] text-foreground">{s.title}</h3>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-[1.65] text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// --- 04 The details: introduction across the top, five ruled rows ------------------------------

export function WebQuality() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="web-quality-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["82%", "12%"]} />
      <div className={`${wrap} ${pad}`}>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <Eyebrow>{WEB_QUALITY.eyebrow}</Eyebrow>
            <Title id="web-quality-title">{WEB_QUALITY.title}</Title>
            <div className="mt-4 max-w-[48rem]">
              <Paras items={WEB_QUALITY.body} className="grid gap-2 text-base leading-[1.65] text-muted" />
            </div>
          </div>
          <div className="flex justify-end lg:col-span-4">
            <Fit max="max-w-[15rem]">
              <QualityVisual label={WEB_QUALITY.visualLabel} />
            </Fit>
          </div>
        </div>
        <ol className={`mt-6 border-b ${rule}`}>
          {WEB_QUALITY.items.map((it, i) => (
            <li key={it.title} className={`grid gap-x-8 gap-y-2 border-t ${rule} py-3.5 md:grid-cols-[2.5rem_13rem_minmax(0,1fr)]`}>
              <span className="font-mono text-sm text-subtle md:pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-foreground">{it.title}</h3>
              <p className="text-[0.9375rem] leading-[1.65] text-muted">{it.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-[62rem] text-[0.875rem] leading-[1.6] text-subtle">{WEB_QUALITY.note}</p>
      </div>
    </section>
  );
}

// --- 05 Different businesses: a full-width introduction, three ruled columns ---------------------

export function WebScenarios() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="web-scenarios-title" className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
      <BandEdge />
      {dots}
      <Atmos at={["82%", "25%"]} />
      <div className={`${wrap} py-16 lg:py-10`}>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <Eyebrow>{WEB_SCENARIOS.eyebrow}</Eyebrow>
            <Title id="web-scenarios-title">{WEB_SCENARIOS.title}</Title>
            <div className="mt-4 max-w-[48rem]">
              <Paras items={WEB_SCENARIOS.body} />
            </div>
          </div>
          <div className="flex justify-end lg:col-span-4">
            <Fit max="max-w-[14rem]">
              <ScenariosVisual label={WEB_SCENARIOS.visualLabel} />
            </Fit>
          </div>
        </div>
        <ol className={`mt-7 grid border-t ${rule} lg:grid-cols-3`}>
          {WEB_SCENARIOS.items.map((s, i) => (
            <li key={s.stage} className={`pt-6 lg:px-8 lg:first:pl-0 lg:last:pr-0 ${i > 0 ? `border-t lg:border-l lg:border-t-0 ${rule} mt-6 lg:mt-0` : ""}`}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">
                0{i + 1} · {s.stage}
              </p>
              <h3 className="mt-3 text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-foreground">{s.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-[1.65] text-muted">{s.body.join(" ")}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[0.875rem] leading-[1.6] text-subtle">{WEB_SCENARIOS.disclaimer}</p>
      </div>
    </section>
  );
}

// --- 06 Investment: introduction on the left, three ruled explanations on the right ---------------

export function WebCosts() {
  return (
    <section data-svc="" data-sr-section="" aria-labelledby="web-costs-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["20%", "80%"]} />
      <div className={`${wrap} ${pad} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
        <div className="flex flex-col lg:col-span-4">
          <Eyebrow>{WEB_COSTS.eyebrow}</Eyebrow>
          <Title id="web-costs-title">{WEB_COSTS.title}</Title>
          <div className="mt-5">
            <Paras items={WEB_COSTS.body} />
          </div>
          <div className="mt-8 lg:mt-auto lg:pt-6">
            <Fit max="max-w-[15rem]">
              <CostsVisual label={WEB_COSTS.visualLabel} />
            </Fit>
          </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-8">
          <ol className={`border-b ${rule}`}>
            {WEB_COSTS.items.map((it) => (
              <li key={it.title} className={`border-t ${rule} py-4`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-foreground">{it.title}</h3>
                  <p className="text-[0.9375rem] font-medium text-foreground/70">{it.tagline}</p>
                </div>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.65] text-muted">{it.body.join(" ")}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-base leading-[1.6] text-foreground">{WEB_COSTS.close}</p>
          <Link href={WEB_COSTS.related.href} className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-sm text-[0.9375rem] font-medium text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-white/60 ${focus}`}>
            {WEB_COSTS.related.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- Common questions ---------------------------------------------------------------------

export function WebFaq() {
  const items = WEB_FAQ.items.map((f) => ({ title: f.q, body: [f.a.join(" ")] }));
  return (
    <section data-sr-section="" aria-labelledby="web-faq-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <div className={`${wrap} ${pad} grid gap-8 border-t ${rule} lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-4">
          <Eyebrow>Questions</Eyebrow>
          <Title id="web-faq-title">{WEB_FAQ.title}</Title>
        </div>
        <div className="lg:col-span-8">
          <Accordion group="web-faq" items={items} first={false} numbered={false} />
        </div>
      </div>
    </section>
  );
}

// --- 07 Start your project: one dominant panel, light related links -----------------------------

export function WebClose() {
  return (
    <section data-sr-section="" aria-labelledby="web-close-title" className={`relative isolate ${anchorOffset}`}>
      {dots}
      <Atmos at={["50%", "100%"]} />
      <div className={`${wrap} pb-16 pt-4 lg:pb-14`}>
        <div data-svc="" className="relative isolate overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#0c1426] px-6 py-10 sm:px-10 lg:px-14 lg:py-10">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_80%_at_90%_110%,rgb(77_136_255/0.22),transparent_70%),radial-gradient(ellipse_45%_50%_at_0%_0%,rgb(110_160_255/0.07),transparent_70%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/60 to-transparent" />
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <Eyebrow>{WEB_CLOSE.eyebrow}</Eyebrow>
              <Title id="web-close-title" className="lg:text-[clamp(2.5rem,3.4vw,3.25rem)]">
                {WEB_CLOSE.title}
              </Title>
              <p className="mt-5 max-w-[44rem] text-[1.0625rem] font-medium leading-[1.6] text-foreground">{WEB_CLOSE.body[0]}</p>
              <div className="mt-3 max-w-[44rem]">
                <Paras items={WEB_CLOSE.body.slice(1)} />
              </div>
              <div className="mt-7 flex flex-col gap-3 min-[460px]:flex-row min-[460px]:items-center">
                <Link href={WEB_CLOSE.primary.href} className={primaryBtn}>
                  {WEB_CLOSE.primary.label} <span aria-hidden>→</span>
                </Link>
                <Link href={WEB_CLOSE.secondary.href} className={solidBtn}>
                  {WEB_CLOSE.secondary.label}
                </Link>
              </div>
              <p className="mt-5 max-w-[44rem] text-[0.9375rem] leading-[1.6] text-muted">{WEB_CLOSE.signoff}</p>
            </div>
            <div className="opacity-75 lg:col-span-4">
              <Fit max="mx-auto max-w-[18rem]">
                <WebsiteClose />
              </Fit>
            </div>
          </div>
        </div>
        <nav aria-label="Related services" className="mt-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">Related services</p>
          <ul className="mt-3 grid gap-x-10 gap-y-4 md:grid-cols-3">
            {WEB_CLOSE.related.map((r) => (
              <li key={r.href} className={`border-t ${rule} pt-4`}>
                <Link href={r.href} className={`group inline-flex items-center gap-1.5 rounded-sm text-[0.9375rem] font-medium text-foreground ${focus}`}>
                  {r.label}{" "}
                  <span aria-hidden className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground">
                    →
                  </span>
                </Link>
                <p className="mt-1 text-[0.875rem] leading-[1.55] text-subtle">{r.body}</p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
