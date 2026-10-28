import Link from "next/link";
import { WORKING_PAGE } from "@/config/pages";
import { getService } from "@/config/services";
import { Eyebrow, Section, SectionTitle } from "@/components/home/Section";
import { PageCta, primaryBtn, secondaryBtn } from "@/components/solutions/shared";
import PageHero from "./PageHero";

/**
 * /working-together. Calm and legible (Blueprint V1.4): engagement models,
 * what shapes a quotation, what is agreed in writing, and common questions.
 * No prices, deposits, minimums, support guarantees or legal terms.
 */
export default function WorkingTogetherPage() {
  const W = WORKING_PAGE;
  return (
    <>
      <PageHero eyebrow={W.eyebrow} headline={W.headline} intro={W.intro}>
        <Link href="/contact" className={primaryBtn}>
          Discuss a project <span aria-hidden>→</span>
        </Link>
        <Link href="/approach" className={secondaryBtn}>
          How projects run
        </Link>
      </PageHero>

      {/* Engagement models */}
      <Section id="models" tone="raised">
        <Eyebrow>Engagement models</Eyebrow>
        <SectionTitle id="models">Three ways to work together</SectionTitle>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {W.models.map((m, i) => (
            <article key={m.id} aria-labelledby={`model-${m.id}`} className="flex flex-col rounded-[24px] border border-white/[0.08] bg-[#080d17]/60 p-6 md:p-8">
              <span aria-hidden className="font-mono text-xs text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 id={`model-${m.id}`} className="mt-3 text-[1.625rem] font-semibold tracking-[-0.025em] text-foreground">
                {m.name}
              </h3>
              <p className="mt-1 text-base font-medium text-foreground/85">{m.summary}</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted md:text-base">{m.body}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-subtle">Suits you</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-foreground/85">{m.suits}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-subtle">For example</p>
              <ul className="mt-2 grid gap-1.5">
                {m.examples.map((e) => (
                  <li key={e} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-muted">
                    <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent-soft" />
                    {e}
                  </li>
                ))}
              </ul>
              <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-6 text-sm">
                {m.related.map((slug) => {
                  const s = getService(slug);
                  return (
                    <Link key={slug} href={s.href} className="font-medium text-accent-soft hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft">
                      {s.short} <span aria-hidden>→</span>
                    </Link>
                  );
                })}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* What influences a quotation */}
      <Section id="quote">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Pricing</Eyebrow>
            <SectionTitle id="quote">{W.quoteFactors.title}</SectionTitle>
            <p className="mt-6 max-w-[26rem] text-[1.0625rem] leading-relaxed text-muted">{W.quoteFactors.intro}</p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8 lg:pt-3">
            {W.quoteFactors.items.map((f) => (
              <div key={f.title} className="border-t border-hairline pt-5">
                <dt className="text-lg font-semibold tracking-[-0.015em] text-foreground">{f.title}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{f.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Agreed in writing */}
      <Section id="agreed" tone="raised">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>In writing</Eyebrow>
            <SectionTitle id="agreed">{W.agreed.title}</SectionTitle>
            <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted">{W.agreed.intro}</p>
          </div>
          <dl className="divide-y divide-hairline rounded-[24px] border border-white/[0.08] bg-[#080d17]/60 px-6 sm:px-8 lg:col-span-7">
            {W.agreed.items.map((a) => (
              <div key={a.title} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-base font-semibold text-foreground">{a.title}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-muted md:text-base">{a.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Common questions */}
      <Section id="questions">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <SectionTitle id="questions">{W.questions.title}</SectionTitle>
          </div>
          <div className="border-t border-hairline lg:col-span-8">
            {W.questions.items.map((q) => (
              <details key={q.q} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium text-foreground transition-colors hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft [&::-webkit-details-marker]:hidden">
                  {q.q}
                  <span aria-hidden className="text-xl text-subtle transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[44rem] pb-6 text-[0.9375rem] leading-relaxed text-muted md:text-base">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <PageCta title="Start with a conversation" body="Tell us what you need. The scope and quotation come after we understand the problem, not before." />
    </>
  );
}
