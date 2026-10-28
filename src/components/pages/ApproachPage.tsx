import Link from "next/link";
import { STAGES, STAGE_LABELS } from "@/config/home";
import { APPROACH_PAGE } from "@/config/pages";
import { Eyebrow, Section, SectionTitle } from "@/components/home/Section";
import { PageCta, primaryBtn, secondaryBtn } from "@/components/solutions/shared";
import PageHero from "./PageHero";

/**
 * /approach. A clear process diagram (Blueprint V1.4: "Our Approach uses clear
 * diagrams"), then each stage in depth: purpose, what we do, the client's
 * part, decisions, typical outputs and the practical topics within it.
 * Stage basics are shared with the homepage (src/config/home.ts STAGES).
 */
export default function ApproachPage() {
  const stages = STAGES.map((s) => ({ ...s, ...APPROACH_PAGE.stages.find((d) => d.id === s.id)! }));
  return (
    <>
      <PageHero eyebrow={APPROACH_PAGE.eyebrow} headline={APPROACH_PAGE.headline} intro={APPROACH_PAGE.intro}>
        <a href="#stages" className={primaryBtn}>
          Walk through the stages <span aria-hidden>↓</span>
        </a>
        <Link href="/working-together" className={secondaryBtn}>
          How engagements work
        </Link>
      </PageHero>

      {/* Process diagram: four stages and the outcome each ends with. */}
      <section aria-label="The four stages at a glance" className="border-t border-hairline bg-[#0a0f1a]">
        <div className="mx-auto w-full max-w-[1440px] px-[max(1.25rem,env(safe-area-inset-left))] py-12 sm:px-8 md:py-16 lg:px-12">
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-0">
            <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-gradient-to-r from-accent/70 via-accent/40 to-accent/70 md:block" />
            {stages.map((s, i) => (
              <li key={s.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4 md:block md:pr-6">
                <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-accent/60 bg-[#0a0f1a] font-mono text-sm text-accent-soft">
                  {i + 1}
                </span>
                <div className="md:mt-5">
                  <a
                    href={`#stage-${s.id}`}
                    className="rounded-sm text-xl font-semibold tracking-[-0.02em] text-foreground hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
                  >
                    {s.name}
                  </a>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{s.summary}</p>
                  <p className="mt-3 text-sm text-subtle">
                    Ends with: <span className="text-foreground/90">{s.outcome}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Flexibility */}
      <Section id="flexibility">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Fitted to the work</Eyebrow>
            <SectionTitle id="flexibility">{APPROACH_PAGE.flexibility.title}</SectionTitle>
          </div>
          <p className="max-w-[42rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-7">{APPROACH_PAGE.flexibility.body}</p>
        </div>
      </Section>

      {/* Stages in depth */}
      <div id="stages" className="scroll-mt-[calc(var(--header-height)+1rem)]">
        {stages.map((s, i) => (
          <section
            key={s.id}
            id={`stage-${s.id}`}
            aria-labelledby={`stage-${s.id}-title`}
            className={`scroll-mt-[calc(var(--header-height)+1rem)] border-t border-hairline ${i % 2 === 0 ? "bg-[#0a0f1a]" : "bg-background"}`}
          >
            <div className="mx-auto w-full max-w-[1440px] px-[max(1.25rem,env(safe-area-inset-left))] py-16 sm:px-8 md:py-20 lg:px-12 lg:py-24">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <p className="font-mono text-sm text-accent-soft">Stage {i + 1} of 4</p>
                  <h2 id={`stage-${s.id}-title`} className="mt-3 text-[clamp(2.25rem,8vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground md:text-[3.25rem]">
                    {s.name}
                  </h2>
                  <p className="mt-5 max-w-[26rem] text-[1.0625rem] leading-relaxed text-foreground/85">{s.purpose}</p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-foreground">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Outcome: {s.outcome}
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                    <Detail label="What Solvitech does">{s.happens}</Detail>
                    <Detail label={STAGE_LABELS.youContribute}>{s.youContribute}</Detail>
                    <Detail label="Decisions made" emphasis>
                      {s.decision}
                    </Detail>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">Typical outputs</dt>
                      <dd className="mt-2">
                        <ul className="grid gap-1.5">
                          {s.outputs.map((o) => (
                            <li key={o} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-muted md:text-base">
                              <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent-soft" />
                              {o}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>

                  <h3 className="mt-12 text-xs font-medium uppercase tracking-[0.14em] text-subtle">In practice</h3>
                  <ul className="mt-4 grid gap-4 md:grid-cols-3">
                    {s.inPractice.map((t) => (
                      <li key={t.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                        <h4 className="text-base font-semibold text-foreground">{t.title}</h4>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{t.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Communication */}
      <Section id="communication">
        <Eyebrow>Communication</Eyebrow>
        <SectionTitle id="communication">{APPROACH_PAGE.communication.title}</SectionTitle>
        <ul className="mt-10 grid gap-x-12 md:grid-cols-3">
          {APPROACH_PAGE.communication.items.map((c) => (
            <li key={c.title} className="border-t border-hairline py-6">
              <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground">{c.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted md:text-base">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <PageCta title="Ready to start with Discover?" body="The first step is a conversation about the problem. Tell us what you'd like to improve." />
    </>
  );
}

function Detail({ label, emphasis = false, children }: { label: string; emphasis?: boolean; children: string }) {
  return (
    <div className={emphasis ? "border-l-2 border-accent/60 pl-4" : ""}>
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-subtle">{label}</dt>
      <dd className={`mt-2 text-[0.9375rem] leading-relaxed md:text-base ${emphasis ? "text-foreground" : "text-muted"}`}>{children}</dd>
    </div>
  );
}
