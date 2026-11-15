import Link from "next/link";
import {
  ABOUT_HOME,
  APPROACH,
  CLOSING,
  CONTACT,
  HOME_MODELS,
  PRINCIPLES,
  STAGES,
  STAGE_WHY,
  WHY,
  WORKING,
} from "@/config/home";
import { APPROACH_PAGE, WORKING_PAGE } from "@/config/pages";
import { CALL_CTA, ENQUIRY_CTA } from "@/config/site";
import { primaryBtn, secondaryBtn } from "@/components/solutions/shared";
import { ReactZone } from "@/components/field/FieldRoot";
import { Eyebrow, Section, SectionTitle, gutter, anchorOffset, textLink } from "./Section";

/**
 * The company half of the homepage, calmer than the service directory:
 *   05 About Solvitech  -- who you would be working with
 *   06 Why Solvitech    -- how we think, what to expect
 *   07 Our Approach     -- the four stages (scroll-filled route, kept)
 *   08 Working Together -- the three engagement models
 *   09 Start a Conversation
 * Copy: src/config/home.ts and src/config/pages.ts. Nothing here invents
 * people, history, clients, prices or guarantees.
 */

const dots = <div aria-hidden className="sr sr-dots -z-10" />;

// --- 05 About ------------------------------------------------------------------------

export function HomeAbout() {
  return (
    <Section id="about" seamless field={dots}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>{ABOUT_HOME.eyebrow}</Eyebrow>
          <SectionTitle id="about" className="max-w-[13ch]">
            {ABOUT_HOME.title}
          </SectionTitle>
        </div>
        <div className="lg:col-span-7 lg:pt-12">
          <p className="reveal text-[1.375rem] font-medium leading-[1.35] tracking-[-0.015em] text-foreground md:text-[1.75rem] lg:text-[1.875rem]">
            {ABOUT_HOME.statement}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-8">
            {ABOUT_HOME.body.map((p) => (
              <p key={p} className="text-[0.9375rem] leading-relaxed text-muted md:text-base">
                {p}
              </p>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.08] min-[480px]:grid-cols-2">
            {ABOUT_HOME.traits.map((t) => (
              <div key={t.title} className="bg-background p-5 sm:p-6">
                <dt className="flex items-center gap-2.5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground">
                  <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                  {t.title}
                </dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{t.body}</dd>
              </div>
            ))}
          </dl>
          <Link href={ABOUT_HOME.link.href} className={`mt-8 min-h-11 ${textLink}`}>
            {ABOUT_HOME.link.label}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}

// --- 06 Why Solvitech -------------------------------------------------------------------

export function HomeWhy() {
  return (
    <Section id="why" seamless field={dots}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{WHY.eyebrow}</Eyebrow>
          <SectionTitle id="why" className="max-w-[16ch]">
            {WHY.title}
          </SectionTitle>
        </div>
        <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{WHY.lead}</p>
      </div>

      <ol className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8 lg:gap-12">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="group relative border-t border-white/[0.1] pt-7">
            <span
              aria-hidden
              className="absolute inset-x-0 -top-px h-px origin-left scale-x-[0.18] bg-accent transition-transform duration-700 ease-[var(--ease-precise)] group-hover:scale-x-100"
            />
            <span
              aria-hidden
              className="block font-mono text-[3.25rem] font-light leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgb(110_160_255/0.55)] md:text-[3.75rem]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-[1.4375rem] font-semibold tracking-[-0.02em] text-foreground md:text-[1.5rem]">{p.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">{p.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// --- 07 Our Approach ----------------------------------------------------------------------

/**
 * The four stages on a route that fills as the chapter scrolls (CSS
 * scroll-driven, field.css .prog-*; vertical on phones). Each stage: what
 * happens, why it matters, what you can expect at the end.
 */
export function HomeApproach() {
  return (
    <Section id="approach" seamless className="tl-section" field={dots}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{APPROACH.eyebrow}</Eyebrow>
          <SectionTitle id="approach" className="max-w-[18ch]">
            {APPROACH.title}
          </SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{APPROACH.intro}</p>
      </div>

      <ReactZone>
        <ol className="relative mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-4 lg:gap-0">
          <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-white/[0.1] lg:block" />
          <span aria-hidden className="prog-x absolute left-5 right-5 top-5 hidden h-px bg-gradient-to-r from-accent via-accent/70 to-accent-soft lg:block" />
          <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-white/[0.1] md:hidden" />
          <span aria-hidden className="prog-y absolute bottom-5 left-5 top-5 w-px bg-gradient-to-b from-accent to-accent-soft md:hidden" />
          {STAGES.map((s, i) => {
            const outcome = APPROACH_PAGE.stages.find((d) => d.id === s.id)?.outcome;
            return (
              <li key={s.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4 md:block lg:pr-8">
                <span
                  data-react=""
                  className="prog-node relative z-10 grid h-10 w-10 place-items-center rounded-full border border-accent/70 bg-background font-mono text-sm text-accent-soft"
                  style={{ ["--from" as string]: `entry ${60 + i * 12}%`, ["--to" as string]: `entry ${70 + i * 12}%` }}
                >
                  {i + 1}
                </span>
                <div className="md:mt-6">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-[1.375rem]">{s.name}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/85 md:text-base">{s.summary}</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{STAGE_WHY[s.id]}</p>
                  {outcome && (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1 text-[0.8125rem] text-muted">
                      <span className="text-subtle">You receive</span>
                      <span className="text-foreground/90">{outcome}</span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </ReactZone>

      {APPROACH.page && (
        <div className="mt-12 md:mt-14">
          <Link href={APPROACH.page} className={secondaryBtn}>
            View Our Approach <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}

// --- 08 Working Together ---------------------------------------------------------------------

/** One shape per engagement model: a single scope, connected parts, a cycle. */
function ModelGlyph({ id }: { id: (typeof HOME_MODELS)[number]["id"] }) {
  const ink = "rgb(110 160 255)";
  const faint = "rgb(255 255 255 / 0.2)";
  return (
    <svg aria-hidden viewBox="0 0 64 40" fill="none" className="h-10 w-16">
      {id === "defined" && <rect x="18" y="6" width="28" height="28" rx="6" stroke={ink} strokeWidth="1.6" />}
      {id === "bespoke" && (
        <>
          <rect x="4" y="12" width="16" height="16" rx="4" stroke={faint} strokeWidth="1.6" />
          <rect x="24" y="6" width="16" height="16" rx="4" stroke={ink} strokeWidth="1.6" />
          <rect x="44" y="18" width="16" height="16" rx="4" stroke={faint} strokeWidth="1.6" />
          <path d="M20 20h4M40 22l4 4" stroke={faint} strokeWidth="1.6" />
        </>
      )}
      {id === "partnership" && (
        <>
          <path d="M44 12a14 14 0 1 0 2 14" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M40 8l5 4-5 4" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

export function HomeWorkingTogether() {
  return (
    <Section id="working-together" seamless field={dots}>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{WORKING.eyebrow}</Eyebrow>
          <SectionTitle id="working-together" className="max-w-[17ch]">
            {WORKING.title}
          </SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{WORKING.intro}</p>
      </div>

      <ul className="mt-12 grid gap-4 md:mt-16 lg:grid-cols-3 lg:gap-5">
        {HOME_MODELS.map((m) => {
          const suits = WORKING_PAGE.models.find((x) => x.id === m.id)?.suits;
          return (
            <li
              key={m.id}
              className="group relative flex flex-col rounded-[22px] border border-white/[0.08] bg-white/[0.015] p-6 transition-colors duration-500 ease-[var(--ease-precise)] hover:border-white/[0.16] hover:bg-white/[0.03] sm:p-8"
            >
              <ModelGlyph id={m.id} />
              <h3 className="mt-6 text-[1.5rem] font-semibold tracking-[-0.025em] text-foreground md:text-[1.625rem]">{m.name}</h3>
              <p className="mt-2 text-base font-medium leading-snug text-foreground/85">{m.line}</p>
              {suits && <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{suits}</p>}
              <p className="mt-auto pt-6 text-[0.8125rem] uppercase tracking-[0.14em] text-subtle">{m.shape}</p>
            </li>
          );
        })}
      </ul>

      {WORKING.page && (
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[36rem] text-[0.9375rem] leading-relaxed text-muted">
            What shapes a quotation, what is agreed in writing and common questions are covered in detail.
          </p>
          <Link href={WORKING.page} className={`${secondaryBtn} shrink-0`}>
            How We Work Together <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}

// --- 09 Start a Conversation -------------------------------------------------------------------

/**
 * The close. Two honest actions: a call (booking when configured, otherwise
 * "Request a call" to the Contact page) and a written enquiry. The note says
 * exactly what happens while booking and delivery are not connected.
 */
export function HomeContact() {
  const call = CALL_CTA.external ? (
    <a href={CALL_CTA.href} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
      {CALL_CTA.label} <span aria-hidden>→</span>
    </a>
  ) : (
    <Link href={CALL_CTA.href} className={primaryBtn}>
      {CALL_CTA.label}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
  return (
    <section id="contact" data-chapter="contact" data-sr-section="" aria-labelledby="contact-title" className={`relative ${anchorOffset}`}>
      {dots}
      <div className={`mx-auto w-full max-w-[1440px] pb-20 pt-6 md:pb-28 md:pt-10 ${gutter}`}>
        <div className="relative isolate overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0a1120] px-6 py-12 sm:px-10 md:py-16 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_85%_100%,rgb(54_123_250/0.22),transparent_70%),radial-gradient(ellipse_40%_50%_at_0%_0%,rgb(110_160_255/0.08),transparent_70%)]"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/50 to-transparent" />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>{CLOSING.eyebrow}</Eyebrow>
              <h2
                id="contact-title"
                className="reveal mt-5 max-w-[17ch] text-[clamp(2.2rem,8.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3rem,5.6vw,4rem)]"
              >
                {CLOSING.title}
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{CLOSING.intro}</p>
              <div className="mt-9 flex flex-col gap-3 min-[460px]:flex-row">
                {call}
                <Link href={ENQUIRY_CTA.href} className={secondaryBtn}>
                  {ENQUIRY_CTA.label}
                </Link>
              </div>
              {!CALL_CTA.external && <p className="mt-5 max-w-[32rem] text-[0.8125rem] leading-relaxed text-subtle">{CLOSING.previewNote}</p>}
            </div>
            <div className="lg:col-span-5 lg:pt-14">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">What to expect</p>
              <ol className="mt-5 grid gap-5">
                {CONTACT.expectations.map((e, i) => (
                  <li key={e} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-white/[0.08] pt-5 text-[0.9375rem] leading-relaxed text-foreground/85 md:text-base">
                    <span aria-hidden className="font-mono text-xs leading-6 text-accent-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {e}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
