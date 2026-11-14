import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SHARE_IMAGE, SITE } from "@/config/site";
import { getService, type Feature, type Focus, type SectionKey, type Service, type ServiceSlug } from "@/config/services";
import { Eyebrow, Section, SectionTitle, gutter } from "@/components/home/Section";
import { ServiceField } from "@/components/field/variants";
import { PageCta, primaryBtn, secondaryBtn } from "./shared";

/** Unique title and description for a service page. */
export function serviceMetadata(slug: ServiceSlug): Metadata {
  const { meta, href } = getService(slug);
  const title = `${meta.title} | ${SITE.name}`;
  return {
    title,
    description: meta.description,
    openGraph: { title, description: meta.description, images: [SHARE_IMAGE] },
    ...(SITE.url ? { alternates: { canonical: href } } : {}),
  };
}

/**
 * A dedicated service page. Shared building blocks, but each service sets its
 * own section order, focus block, feature block and section titles, so the
 * page follows how that kind of work actually happens. The general delivery
 * process is linked (/approach), not repeated. Copy: src/config/services.ts.
 */
export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  const s = getService(slug);
  const blocks: Record<SectionKey, (tone: Tone) => ReactNode> = {
    focus: (tone) => <FocusBlock key="focus" focus={s.focus} tone={tone} />,
    builds: (tone) => <BuildsBlock key="builds" s={s} tone={tone} />,
    feature: (tone) => <FeatureBlock key="feature" feature={s.feature} tone={tone} />,
    examples: (tone) => <ExamplesBlock key="examples" s={s} tone={tone} />,
    limits: (tone) => <LimitsBlock key="limits" s={s} tone={tone} />,
  };
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="service-title" className="relative isolate overflow-hidden">
        <ServiceField slug={s.slug} />
        <div className={`mx-auto w-full max-w-[1440px] pb-16 pt-[calc(var(--header-height)+env(safe-area-inset-top)+3rem)] md:pb-24 md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+4.5rem)] lg:min-h-[46rem] ${gutter}`}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-subtle">
              <li>
                <Link href="/solutions" className="rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                  Solutions
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-muted">
                {s.name}
              </li>
            </ol>
          </nav>
          <div className="mt-8">
            <Eyebrow>{s.name}</Eyebrow>
            <h1
              id="service-title"
              className="reveal mt-5 max-w-[20ch] lg:max-w-[15ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.4vw,4.25rem)] lg:text-[clamp(3.5rem,4.6vw,4.5rem)]"
            >
              {s.hero.headline}
              <span className="text-accent">.</span>
            </h1>
          </div>
          <p className="mt-7 max-w-[44rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:max-w-[40rem]">{s.hero.intro}</p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <Link href="/contact" className={primaryBtn}>
              Start a Project <span aria-hidden>→</span>
            </Link>
            <Link href="/solutions" className={secondaryBtn}>
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* What it involves + recognisable signs */}
      <Section id="involves" tone="raised">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Overview</Eyebrow>
            <SectionTitle id="involves">{s.involves.title}</SectionTitle>
            {s.involves.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-6 max-w-[40rem] text-[1.0625rem] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5 lg:pt-14">
            <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">{s.problemsTitle}</h3>
            <ul className="mt-5 grid gap-3">
              {s.problems.map((p) => (
                <li key={p} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">
                  <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {s.order.map((key, i) => blocks[key](i % 2 === 0 ? "base" : "raised"))}

      <ApproachBand note={s.approachNote} tone={s.order.length % 2 === 0 ? "base" : "raised"} />
      <RelatedBlock s={s} />
      <PageCta title={s.cta.title} body={s.cta.body} />
    </>
  );
}

type Tone = "base" | "raised";

function BuildsBlock({ s, tone }: { s: Service; tone: Tone }) {
  return (
    <Section id="builds" tone={tone}>
      <Eyebrow>Capabilities</Eyebrow>
      <SectionTitle id="builds">{s.buildsTitle}</SectionTitle>
      <ul className="mt-12 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
        {s.builds.map((b) => (
          <li key={b.title} className="border-t border-hairline py-6">
            <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">{b.title}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{b.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** How this kind of work happens: a numbered path, a ladder of levels, or parallel columns. */
function FocusBlock({ focus: f, tone }: { focus: Focus; tone: Tone }) {
  return (
    <Section id="focus" tone={tone}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle id="focus">{f.title}</SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted lg:col-span-5 lg:pb-2">{f.intro}</p>
      </div>

      {f.style === "path" && (
        <ol className={`relative mt-12 grid gap-8 md:mt-16 md:gap-0 ${f.items.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-gradient-to-r from-accent/70 via-accent/40 to-accent/70 md:block" />
          {f.items.map((it, i) => (
            <li key={it.title} className="relative grid grid-cols-[2.5rem_1fr] gap-4 md:block md:pr-8">
              <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-accent/60 bg-[#0a0f1a] font-mono text-sm text-accent-soft">
                {i + 1}
              </span>
              <div className="md:mt-6">
                <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">{it.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{it.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {f.style === "ladder" && (
        <ol className="mt-12 grid gap-3 md:mt-16">
          {f.items.map((it, i) => (
            <li
              key={it.title}
              className="grid gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:grid-cols-[14rem_1fr] md:items-baseline md:gap-8 md:p-6"
              style={{ marginLeft: `calc(${i} * min(2.5rem, 4vw))` }}
            >
              <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">
                <span className="mb-1 block font-mono text-xs font-normal text-accent-soft">Level {i + 1}</span>
                {it.title}
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted md:text-base">{it.body}</p>
            </li>
          ))}
        </ol>
      )}

      {f.style === "columns" && (
        <ul className={`mt-12 grid border-y border-hairline md:mt-16 ${f.items.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {f.items.map((it) => (
            <li key={it.title} className="border-t border-hairline py-7 first:border-t-0 md:px-6 md:first:pl-0 lg:border-l lg:border-t-0 lg:first:border-l-0">
              <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">{it.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{it.body}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function ExamplesBlock({ s, tone }: { s: Service; tone: Tone }) {
  return (
    <Section id="examples" tone={tone}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>Applications</Eyebrow>
          <SectionTitle id="examples">{s.examplesTitle}</SectionTitle>
        </div>
        <p className="max-w-[30rem] text-[0.9375rem] leading-relaxed text-subtle lg:col-span-5 lg:pb-2">
          Illustrative scenarios showing how the work applies in practice. They are not descriptions of specific client
          projects.
        </p>
      </div>
      <ul className="mt-12 grid gap-x-10 lg:grid-cols-3">
        {s.examples.map((e) => (
          <li key={e.title} className="border-t border-hairline py-7">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Illustrative scenario</p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground">{e.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{e.situation}</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/85">
              <span className="font-medium text-foreground">What could be built: </span>
              {e.approach}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function LimitsBlock({ s, tone }: { s: Service; tone: Tone }) {
  return (
    <Section id="limits" tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>Worth knowing</Eyebrow>
          <SectionTitle id="limits">Limits and considerations</SectionTitle>
        </div>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8 lg:pt-3">
          {s.considerations.map((c) => (
            <div key={c.title} className="border-t border-hairline pt-5">
              <dt className="text-lg font-semibold tracking-[-0.015em] text-foreground">{c.title}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{c.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/** One line on how projects of this kind run, pointing to the full process. */
function ApproachBand({ note, tone }: { note: string; tone: Tone }) {
  return (
    <section aria-labelledby="approach-band-title" className={`border-t border-hairline ${tone === "raised" ? "bg-[#0a0f1a]" : "bg-background"}`}>
      <div className={`mx-auto flex w-full max-w-[1440px] flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14 ${gutter}`}>
        <div className="max-w-[44rem]">
          <h2 id="approach-band-title" className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">
            How a project like this runs
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">
            {note} Every project follows the same four stages: Discover, Design, Engineer, Launch &amp; Evolve.
          </p>
        </div>
        <Link href="/approach" className={`${secondaryBtn} shrink-0 self-start md:self-auto`}>
          View Our Approach <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

function RelatedBlock({ s }: { s: Service }) {
  return (
    <section aria-labelledby="related-title" className="border-t border-hairline bg-background">
      <div className={`mx-auto w-full max-w-[1440px] py-16 md:py-20 ${gutter}`}>
        <h2 id="related-title" className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">
          Works well with
        </h2>
        <ul className="mt-6 grid gap-x-10 md:grid-cols-3">
          {s.related.map((r) => {
            const rel = getService(r.slug);
            return (
              <li key={r.slug} className="border-t border-hairline">
                <Link
                  href={rel.href}
                  className="group block py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
                >
                  <span className="flex items-center justify-between gap-4 text-lg font-semibold tracking-[-0.015em] text-foreground transition-colors group-hover:text-accent-soft">
                    {rel.name}
                    <span aria-hidden className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent-soft">
                      →
                    </span>
                  </span>
                  <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-muted">{r.why}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FeatureBlock({ feature: f, tone }: { feature: Feature; tone: Tone }) {
  return (
    <Section id="feature" tone={tone}>
      <div className="max-w-[48rem]">
        <SectionTitle id="feature">{f.title}</SectionTitle>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{f.intro}</p>
      </div>

      {f.kind === "comparison" && (
        /* Phones: one block per aspect, both answers visible without sideways scrolling. */
        <dl className="mt-10 grid gap-3 md:hidden">
          {f.rows.map((r) => (
            <div key={r.label} className="rounded-2xl border border-white/[0.08] p-5">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">{r.label}</dt>
              <dd className="mt-3 grid gap-3">
                <p className="text-[0.9375rem] leading-relaxed text-muted">
                  <span className="block text-sm font-semibold text-foreground/85">{f.columns[0]}</span>
                  {r.a}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-foreground/90">
                  <span className="block text-sm font-semibold text-foreground">{f.columns[1]}</span>
                  {r.b}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {f.kind === "comparison" && (
        <div className="mt-10 hidden overflow-x-auto rounded-[20px] border border-white/[0.08] md:block">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">{f.title}</caption>
            <thead>
              <tr className="bg-white/[0.03]">
                <th scope="col" className="w-[22%] px-5 py-4 text-sm font-medium text-subtle">
                  <span className="sr-only">Aspect</span>
                </th>
                {f.columns.map((c, i) => (
                  <th key={c} scope="col" className={`px-5 py-4 text-base font-semibold ${i === 1 ? "text-foreground" : "text-foreground/85"}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.rows.map((r) => (
                <tr key={r.label} className="border-t border-hairline">
                  <th scope="row" className="px-5 py-4 align-top text-sm font-medium text-subtle">
                    {r.label}
                  </th>
                  <td className="px-5 py-4 align-top text-[0.9375rem] leading-relaxed text-muted">{r.a}</td>
                  <td className="px-5 py-4 align-top text-[0.9375rem] leading-relaxed text-foreground/90">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {f.kind === "checklist" && (
        <ul className="mt-10 grid gap-x-12 gap-y-6 md:grid-cols-2">
          {f.items.map((it) => (
            <li key={it.title} className="flex gap-4">
              <svg aria-hidden viewBox="0 0 16 16" className="mt-1 h-5 w-5 shrink-0 text-accent-soft" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground">{it.title}</h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted md:text-base">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {f.kind === "principles" && (
        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {f.items.map((it, i) => (
            <li key={it.title} className="border-t border-hairline py-6">
              <span aria-hidden className="font-mono text-xs text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">{it.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{it.body}</p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
