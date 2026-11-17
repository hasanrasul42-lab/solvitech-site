import Link from "next/link";
import type { ReactNode } from "react";
import { getService, type ServiceSlug } from "@/config/services";
import { Eyebrow, anchorOffset, bandSurface, BandEdge, solidBtn } from "@/components/home/Section";
import StructureReveal from "@/components/home/StructureReveal";
import { Atmos, Breadcrumb, Points, Title, dots, h1, lead, textLink, wrap } from "@/components/solutions/kit";
import { primaryBtn } from "@/components/solutions/shared";
import "@/components/home/directory/directory.css";
import "./story.css";

/**
 * A dedicated service page (custom software, integrations, websites, digital
 * growth), built like /solutions/ai and /solutions/automation: the homepage's
 * surfaces, lighting and dot grid, with a dimensional visual beside the copy
 * in five sections. Copy comes from src/config/services.ts; each page passes
 * its own visuals, so no two pages (or sections) look alike.
 */

export interface StoryVisuals {
  hero: ReactNode;
  signs: ReactNode;
  focus: ReactNode;
  builds: ReactNode;
  close: ReactNode;
}

const band = { ["--surface" as string]: "#0b1322" };

export default function ServiceStory({ slug, accent, visuals }: { slug: ServiceSlug; accent: string; visuals: StoryVisuals }) {
  const s = getService(slug);
  const id = (k: string) => `${slug}-${k}`;
  const feature = s.feature;
  return (
    <div className="svc-cards contents">
      <StructureReveal />

      {/* 01 Hero */}
      <section data-svc="" data-sr-section="" aria-labelledby={id("title")} className="relative isolate overflow-hidden">
        {dots}
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: `radial-gradient(ellipse 50% 60% at 75% 45%, rgb(${accent} / 0.13), transparent 70%), radial-gradient(ellipse 60% 40% at 10% 0%, rgb(110 160 255 / 0.06), transparent 70%)` }} />
        <Atmos at={["74%", "48%"]} acc={accent} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-background" />
        <div className={`${wrap} pb-16 pt-[calc(var(--header-height)+env(safe-area-inset-top)+2.5rem)] md:pb-24 lg:pt-[calc(var(--header-height)+env(safe-area-inset-top)+3.5rem)]`}>
          <Breadcrumb label={s.name} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)] lg:gap-12">
            <div>
              <Eyebrow>{s.name}</Eyebrow>
              <h1 id={id("title")} className={`${h1} !max-w-[17ch]`}>
                {s.hero.headline}
                <span className="text-accent">.</span>
              </h1>
              <p className={`mt-7 max-w-[38rem] ${lead}`}>{s.hero.intro}</p>
              <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
                <Link href="/contact" className={primaryBtn}>
                  Discuss Your Project <span aria-hidden>→</span>
                </Link>
                <a href={`#${id("builds")}`} className={solidBtn}>
                  {s.buildsTitle} <span aria-hidden>↓</span>
                </a>
              </div>
            </div>
            {visuals.hero}
          </div>
        </div>
      </section>

      {/* 02 Signs */}
      <section data-svc="" data-sr-section="" aria-labelledby={id("signs")} className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
        <BandEdge />
        {dots}
        <Atmos at={["22%", "100%"]} acc={accent} />
        <div className={`${wrap} grid items-center gap-10 py-20 md:py-24 lg:grid-cols-12 lg:gap-14`}>
          <div className="order-2 lg:order-1 lg:col-span-7">{visuals.signs}</div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <Eyebrow>Sound familiar?</Eyebrow>
            <Title id={id("signs")}>{s.problemsTitle}</Title>
            <ul className="mt-8 grid gap-3">
              {s.problems.map((p) => (
                <li key={p} className="lift-card flex items-start gap-4 rounded-[18px] px-5 py-4">
                  <span aria-hidden className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full" style={{ background: `rgb(${accent})` }} />
                  <span className="text-[1rem] leading-relaxed text-foreground/90">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 03 How it works */}
      <section data-svc="" data-sr-section="" aria-labelledby={id("focus")} className={`relative isolate ${anchorOffset}`}>
        {dots}
        <Atmos at={["70%", "60%"]} acc={accent} />
        <div className={`${wrap} py-20 md:py-24`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <Eyebrow>{s.involves.title}</Eyebrow>
              <Title id={id("focus")}>{s.focus.title}</Title>
            </div>
            <div className={`grid max-w-[34rem] gap-4 lg:col-span-5 lg:pb-2 ${lead}`}>
              {s.involves.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-[1rem] leading-relaxed text-muted">{s.focus.intro}</p>
              <Points items={s.focus.items} ordered={s.focus.style !== "columns"} className="mt-6 grid gap-3" />
            </div>
            <div className="lg:col-span-7">{visuals.focus}</div>
          </div>
        </div>
      </section>

      {/* 04 What we build */}
      <section id={id("builds")} data-svc="" data-sr-section="" aria-labelledby={id("builds-title")} className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
        <BandEdge />
        {dots}
        <Atmos at={["30%", "40%"]} acc={accent} />
        <div className={`${wrap} py-20 md:py-24`}>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="order-2 lg:order-1 lg:col-span-6">{visuals.builds}</div>
            <div className="order-1 lg:order-2 lg:col-span-6">
              <Eyebrow>What we build</Eyebrow>
              <Title id={id("builds-title")}>{s.buildsTitle}</Title>
              <Points items={s.builds} className="mt-8 grid gap-3 sm:grid-cols-2" />
            </div>
          </div>
        </div>
      </section>

      {/* 05 Feature + examples */}
      <section data-sr-section="" aria-labelledby={id("feature")} className={`relative isolate ${anchorOffset}`}>
        {dots}
        <Atmos at={["50%", "0%"]} acc={accent} />
        <div className={`${wrap} py-20 md:py-24`}>
          <div className="mx-auto max-w-[52rem] text-center">
            <div className="flex justify-center">
              <Eyebrow>Choosing well</Eyebrow>
            </div>
            <Title id={id("feature")}>{feature.title}</Title>
            <p className={`mx-auto mt-6 max-w-[44rem] ${lead}`}>{feature.intro}</p>
          </div>
          {feature.kind === "comparison" ? (
            <div className="lift-card mx-auto mt-12 max-w-[60rem] overflow-hidden rounded-[22px]">
              <table className="w-full text-left text-[0.9375rem]">
                <thead>
                  <tr className="border-b border-white/[0.09]">
                    <th className="px-5 py-4 font-medium text-subtle sm:px-6">
                      <span className="sr-only">Aspect</span>
                    </th>
                    {feature.columns.map((c, i) => (
                      <th key={c} className={`px-5 py-4 font-semibold sm:px-6 ${i === 1 ? "text-foreground" : "text-muted"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feature.rows.map((r) => (
                    <tr key={r.label} className="border-b border-white/[0.06] last:border-0">
                      <th scope="row" className="px-5 py-4 align-top font-medium text-subtle sm:px-6">
                        {r.label}
                      </th>
                      <td className="px-5 py-4 align-top text-muted sm:px-6">{r.a}</td>
                      <td className="px-5 py-4 align-top text-foreground/90 sm:px-6">{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Points items={feature.items} className="mx-auto mt-12 grid max-w-[64rem] gap-3 md:grid-cols-2" />
          )}

          <div className="mt-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="text-[1.75rem] font-semibold tracking-[-0.02em] text-foreground">{s.examplesTitle}</h3>
              <p className="text-sm text-subtle">Illustrative scenarios, not client projects.</p>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {s.examples.map((e) => (
                <article key={e.title} className="lift-card flex flex-col rounded-[20px] p-6">
                  <h4 className="text-[1.125rem] font-semibold tracking-[-0.015em] text-foreground">{e.title}</h4>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-subtle">The situation</p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{e.situation}</p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em]" style={{ color: `rgb(${accent})` }}>
                    What could be built
                  </p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-foreground/85">{e.approach}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 Worth knowing */}
      <section data-sr-section="" aria-labelledby={id("limits")} className={`relative ${bandSurface} ${anchorOffset}`} style={band}>
        <BandEdge />
        {dots}
        <div className={`${wrap} grid gap-10 py-20 md:py-24 lg:grid-cols-12 lg:gap-14`}>
          <div className="lg:col-span-5">
            <Eyebrow>Worth knowing</Eyebrow>
            <Title id={id("limits")}>Honest about what it takes</Title>
            <p className={`mt-6 ${lead}`}>{s.approachNote}</p>
            <Link href="/approach" className={`${textLink} mt-4`}>
              How we run projects <span aria-hidden>→</span>
            </Link>
          </div>
          <Points items={s.considerations} className="grid gap-3 lg:col-span-7" />
        </div>
      </section>

      {/* 07 Close */}
      <section data-sr-section="" aria-labelledby={id("close")} className={`relative isolate ${anchorOffset}`}>
        {dots}
        <div className={`${wrap} pb-24 pt-16 md:pb-28`}>
          <div data-svc="" className="relative isolate overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#0a1324] px-6 py-12 sm:px-10 md:py-16 lg:px-16">
            <div aria-hidden className="absolute inset-0 -z-10" style={{ background: `radial-gradient(ellipse 55% 75% at 88% 105%, rgb(${accent} / 0.28), transparent 70%), radial-gradient(ellipse 45% 50% at 0% 0%, rgb(110 160 255 / 0.08), transparent 70%)` }} />
            <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/70 to-transparent" />
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <Eyebrow>Start a conversation</Eyebrow>
                <Title id={id("close")}>{s.cta.title}</Title>
                <p className={`mt-6 ${lead}`}>{s.cta.body}</p>
                <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
                  <Link href="/contact" className={primaryBtn}>
                    Discuss Your Project <span aria-hidden>→</span>
                  </Link>
                  <Link href="/solutions" className={solidBtn}>
                    Explore All Solutions
                  </Link>
                </div>
                <nav aria-label="Related services" className="mt-8">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">Related services</p>
                  <ul className="mt-3 grid gap-2">
                    {s.related.map((r) => {
                      const rel = getService(r.slug);
                      return (
                        <li key={r.slug} className="text-[0.9375rem] text-muted">
                          <Link href={rel.href} className={textLink}>
                            {rel.name} <span aria-hidden>→</span>
                          </Link>{" "}
                          <span className="block sm:inline">{r.why}</span>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
              <div className="lg:col-span-6">{visuals.close}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
