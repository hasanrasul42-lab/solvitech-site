import Image from "next/image";
import Link from "next/link";
import { ABOUT, FOUNDER } from "@/config/pages";
import { CORE_SERVICES, SUPPORTING_SERVICES } from "@/config/services";
import { Eyebrow, Section, SectionTitle } from "@/components/home/Section";
import { PageCta, primaryBtn, secondaryBtn } from "@/components/solutions/shared";
import PageHero from "./PageHero";

/**
 * /about. Editorial and credible (Blueprint V1.4): who Solvitech is, honest
 * founder-led accountability, what drives the work, expertise and next steps.
 * Founder profile details render only once approved in FOUNDER.
 */
export default function AboutPage() {
  const profile = FOUNDER.name && FOUNDER.introduction;
  return (
    <>
      <PageHero eyebrow={ABOUT.eyebrow} headline={ABOUT.headline} intro={ABOUT.intro}>
        <Link href="/solutions" className={primaryBtn}>
          Explore our solutions <span aria-hidden>→</span>
        </Link>
        <Link href="/contact" className={secondaryBtn}>
          Start a project
        </Link>
      </PageHero>

      {/* What Solvitech is */}
      <Section id="what" tone="raised">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>The company</Eyebrow>
            <SectionTitle id="what">{ABOUT.what.title}</SectionTitle>
          </div>
          <div className="lg:col-span-7 lg:pt-12">
            {ABOUT.what.paragraphs.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                className={`max-w-[42rem] leading-relaxed ${i === 0 ? "text-xl text-foreground md:text-[1.375rem]" : "mt-6 text-[1.0625rem] text-muted"}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Founder-led */}
      <Section id="founder">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Accountability</Eyebrow>
            <SectionTitle id="founder">{ABOUT.founderLed.title}</SectionTitle>
            {ABOUT.founderLed.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-6 max-w-[42rem] text-[1.0625rem] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5">
            {profile ? (
              <figure className="m-0 rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
                {FOUNDER.photo && (
                  <Image src={FOUNDER.photo} alt={FOUNDER.name!} width={480} height={560} className="mb-6 h-auto w-full rounded-2xl object-cover" />
                )}
                <figcaption>
                  <p className="text-xl font-semibold text-foreground">{FOUNDER.name}</p>
                  <p className="text-sm text-subtle">{FOUNDER.role}</p>
                </figcaption>
                {FOUNDER.introduction!.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </figure>
            ) : (
              <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground">{ABOUT.standards.title}</h3>
                <ul className="mt-5 grid gap-3">
                  {ABOUT.standards.items.map((s) => (
                    <li key={s} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">
                      <svg aria-hidden viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Beliefs */}
      <Section id="beliefs" tone="raised">
        <Eyebrow>Principles</Eyebrow>
        <SectionTitle id="beliefs">{ABOUT.beliefs.title}</SectionTitle>
        <ol className="mt-12 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {ABOUT.beliefs.items.map((b, i) => (
            <li key={b.title} className="border-t border-hairline py-7">
              <span aria-hidden className="font-mono text-xs text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">{b.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{b.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Expertise */}
      <Section id="expertise">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>Expertise</Eyebrow>
            <SectionTitle id="expertise">{ABOUT.expertise.title}</SectionTitle>
          </div>
          <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted lg:col-span-5 lg:pb-2">{ABOUT.expertise.intro}</p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-[20px] border border-white/[0.08] p-6 transition-colors hover:border-accent/50 hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                <span className="text-lg font-semibold leading-snug tracking-[-0.015em] text-foreground">{s.name}</span>
                <span className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.summary}</span>
                <span aria-hidden className="mt-auto pt-5 text-sm text-accent-soft transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.9375rem] text-muted">
          Also:{" "}
          {SUPPORTING_SERVICES.map((s, i) => (
            <span key={s.slug}>
              {i > 0 && " and "}
              <Link href={s.href} className="font-medium text-accent-soft underline-offset-4 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft">
                {s.name}
              </Link>
            </span>
          ))}
          .
        </p>
      </Section>

      {/* Pathways */}
      <Section id="next" tone="raised">
        <Eyebrow>Next</Eyebrow>
        <SectionTitle id="next">Where to go from here</SectionTitle>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { href: "/solutions", title: "See what we build", body: "Software, AI, automation and integrations, plus websites and growth." },
            { href: "/approach", title: "See how projects run", body: "The four stages from first conversation to a supported system." },
            { href: "/working-together", title: "See how engagements work", body: "Engagement types, what shapes a quote and what is agreed in writing." },
          ].map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="group flex h-full flex-col rounded-[20px] border border-white/[0.08] p-6 transition-colors hover:border-accent/50 hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                <span className="text-lg font-semibold tracking-[-0.015em] text-foreground">{p.title}</span>
                <span className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{p.body}</span>
                <span aria-hidden className="mt-auto pt-5 text-sm text-accent-soft transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <PageCta title="Have a problem worth solving?" body="Describe it in a few sentences. You'll be talking directly to the person who would do the work." />
    </>
  );
}
