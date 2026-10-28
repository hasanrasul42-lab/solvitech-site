import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { getService, type Feature, type ServiceSlug } from "@/config/services";
import { Eyebrow, Section, SectionTitle, gutter } from "@/components/home/Section";
import ServiceVisual from "./ServiceVisual";
import { PageCta, primaryBtn, secondaryBtn } from "./shared";

/** Unique title and description for a service page. */
export function serviceMetadata(slug: ServiceSlug): Metadata {
  const { meta } = getService(slug);
  const title = `${meta.title} | ${SITE.name}`;
  return { title, description: meta.description, openGraph: { title, description: meta.description } };
}

/**
 * A dedicated service page. One shared structure; each service differs in its
 * illustration and its `feature` block (comparison, checklist or principles).
 * Copy: src/config/services.ts.
 */
export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  const s = getService(slug);
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="service-title" className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_65%_60%_at_20%_0%,rgb(54_123_250/0.10),transparent_70%)]"
        />
        <div className={`mx-auto w-full max-w-[1440px] pb-14 pt-[calc(var(--header-height)+env(safe-area-inset-top)+3rem)] md:pb-20 md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+4.5rem)] ${gutter}`}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-subtle">
              <li>
                <Link href="/solutions" className="rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                  Solutions
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-muted">
                {s.short}
              </li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-8">
              <Eyebrow>{s.name}</Eyebrow>
              <h1
                id="service-title"
                className="mt-5 max-w-[20ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.4vw,4.25rem)] lg:text-[clamp(3.5rem,4.6vw,4.5rem)]"
              >
                {s.hero.headline}
                <span className="text-accent">.</span>
              </h1>
            </div>
          </div>
          <p className="mt-7 max-w-[44rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{s.hero.intro}</p>
          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
            <Link href="/#contact" className={primaryBtn}>
              Discuss your project <span aria-hidden>→</span>
            </Link>
            <Link href="/solutions" className={secondaryBtn}>
              All solutions
            </Link>
          </div>
          <div className="mt-14 md:mt-20">
            <ServiceVisual slug={s.slug} />
          </div>
        </div>
      </section>

      {/* What it involves + recognisable problems */}
      <Section id="involves" tone="raised">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>Overview</Eyebrow>
            <SectionTitle id="involves">{s.involves.title}</SectionTitle>
            {s.involves.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-6">
            <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground md:text-2xl">Sound familiar?</h3>
            <ul className="mt-6 grid gap-3">
              {s.problems.map((p) => (
                <li key={p} className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-base leading-relaxed text-foreground/90">
                  &ldquo;{p}&rdquo;
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* What we build */}
      <Section id="builds">
        <Eyebrow>Capabilities</Eyebrow>
        <SectionTitle id="builds">What we can design and engineer</SectionTitle>
        <ul className="mt-12 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {s.builds.map((b) => (
            <li key={b.title} className="border-t border-hairline py-6">
              <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground md:text-xl">{b.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{b.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <FeatureBlock feature={s.feature} />

      {/* Examples */}
      <Section id="examples">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>Applications</Eyebrow>
            <SectionTitle id="examples">Examples of what this can look like</SectionTitle>
          </div>
          <p className="max-w-[30rem] text-[0.9375rem] leading-relaxed text-subtle lg:col-span-5 lg:pb-2">
            These are illustrative scenarios to show how the work applies in practice. They are not descriptions of
            specific client projects.
          </p>
        </div>
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {s.examples.map((e) => (
            <li key={e.title} className="flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6 md:p-7">
              <span className="self-start rounded-full border border-white/10 px-2.5 py-1 text-xs text-subtle">Illustrative scenario</span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-foreground">{e.title}</h3>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-subtle">The situation</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{e.situation}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-subtle">What could be built</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-foreground/85">{e.approach}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Engagement + considerations */}
      <Section id="engagement" tone="raised">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Engagement</Eyebrow>
            <SectionTitle id="engagement">What a typical engagement involves</SectionTitle>
            <ol className="mt-10 grid gap-0">
              {s.engagement.steps.map((st, i) => (
                <li key={st.title} className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-hairline py-5 first:border-t-0 first:pt-0">
                  <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full border border-accent/40 font-mono text-sm text-accent-soft">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground">{st.title}</h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted md:text-base">{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-[38rem] border-l-2 border-accent/60 pl-4 text-[0.9375rem] leading-relaxed text-foreground/85 md:text-base">
              {s.engagement.note}
            </p>
            <Link href="/#approach" className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-soft hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft">
              How every project runs <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[20px] border border-white/[0.08] bg-[#080d17]/70 p-6 sm:p-8">
              <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground md:text-2xl">Worth knowing</h3>
              <dl className="mt-6 grid gap-5">
                {s.considerations.map((c) => (
                  <div key={c.title}>
                    <dt className="text-base font-medium text-foreground">{c.title}</dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{c.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* Related */}
      <Section id="related">
        <Eyebrow>Works well with</Eyebrow>
        <SectionTitle id="related">Related capabilities</SectionTitle>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {s.related.map((r) => {
            const rel = getService(r.slug);
            return (
              <li key={r.slug}>
                <Link
                  href={rel.href}
                  className="group flex h-full flex-col rounded-[20px] border border-white/[0.08] p-6 transition-colors hover:border-accent/50 hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
                >
                  <span className="text-lg font-semibold tracking-[-0.015em] text-foreground">{rel.name}</span>
                  <span className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{r.why}</span>
                  <span className="mt-auto pt-5 text-sm font-medium text-accent-soft">
                    Explore <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <PageCta title={s.cta.title} body={s.cta.body} />
    </>
  );
}

function FeatureBlock({ feature: f }: { feature: Feature }) {
  return (
    <Section id="feature" tone="raised">
      <div className="max-w-[48rem]">
        <SectionTitle id="feature">{f.title}</SectionTitle>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{f.intro}</p>
      </div>

      {f.kind === "comparison" && (
        <div className="mt-10 overflow-x-auto rounded-[20px] border border-white/[0.08]">
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
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {f.items.map((it, i) => (
            <li key={it.title} className="rounded-[20px] border border-white/[0.08] bg-[#080d17]/60 p-6 md:p-7">
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
