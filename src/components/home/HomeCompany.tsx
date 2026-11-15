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
import { ReactZone } from "@/components/field/FieldRoot";
import { Eyebrow, Section, SectionTitle, gutter, anchorOffset, solidBtn } from "./Section";
import AboutMark from "./AboutMark";
import ContactForm from "./ContactForm";
import "./directory/directory.css";

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
    <Section id="about" seamless band field={dots} className="overflow-hidden" pad="py-20 md:py-28 lg:py-36">
      {/* The Solvitech mark in glass, behind the text, turning with the cursor. */}
      <AboutMark className="absolute -z-10 inset-x-0 top-[8%] h-[46%] opacity-70 md:inset-y-0 md:left-auto md:right-[-6%] md:top-0 md:h-auto md:w-[62%] md:opacity-100 lg:right-[-2%] lg:w-[54%]" />
      <div className="relative max-w-[38rem] pt-[min(70vw,22rem)] md:pt-0 lg:max-w-[40rem]">
        <Eyebrow>{ABOUT_HOME.eyebrow}</Eyebrow>
        <h2
          id="about-title"
          className="reveal mt-5 text-[clamp(2.3rem,9vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[clamp(3rem,6vw,4rem)] lg:text-[clamp(3.5rem,4.6vw,4.5rem)]"
        >
          <span className="block text-foreground">{ABOUT_HOME.title[0]}</span>
          <span className="block bg-gradient-to-r from-accent-soft to-[#9fc0ff] bg-clip-text text-transparent">
            {ABOUT_HOME.title[1]}
            <span className="text-accent">.</span>
          </span>
        </h2>
        <p className="mt-8 text-[1.1875rem] font-medium leading-[1.45] tracking-[-0.01em] text-foreground md:text-[1.375rem]">{ABOUT_HOME.statement}</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted md:text-base">{ABOUT_HOME.body}</p>
        <Link href={ABOUT_HOME.link.href} className={`${solidBtn} mt-9`}>
          {ABOUT_HOME.link.label} <span aria-hidden>→</span>
        </Link>
      </div>
    </Section>
  );
}

// --- 06 Why Solvitech -------------------------------------------------------------------

/** Full-section light and grid, from a point (directory.css .sec-atmos). */
function Atmos({ at, acc }: { at: [string, string]; acc?: string }) {
  return (
    <div
      aria-hidden
      className="sec-atmos"
      style={{ ["--ax" as string]: at[0], ["--ay" as string]: at[1], ...(acc ? { ["--acc" as string]: acc } : {}) }}
    />
  );
}

const ink = "rgb(var(--acc))";
const line = "rgb(255 255 255 / 0.2)";
const dim = "rgb(255 255 255 / 0.08)";

/** One line drawing per principle. */
function PrincipleArt({ i }: { i: number }) {
  if (i === 0) {
    // Business first: look closely at how the work flows before choosing anything.
    // Four steps on one line; the second is examined under a lens.
    const steps = [50, 110, 170, 230];
    return (
      <svg viewBox="0 0 280 130" fill="none" className="h-full w-full">
        {/* Connectors run edge to edge, never through a step. */}
        <path d="M62 58h33M125 58h33M182 58h36" stroke={line} strokeWidth="1.5" strokeDasharray="3 4" />
        {steps.map((x, k) =>
          k === 1 ? (
            <rect key={x} x={x - 14} y={44} width="28" height="28" rx="6" stroke={ink} strokeWidth="1.5" fill="rgb(var(--acc) / 0.15)" />
          ) : (
            <rect key={x} x={x - 11} y={48} width="22" height="20" rx="5" stroke={line} strokeWidth="1.5" />
          ),
        )}
        <g className="art-hot">
          <circle cx="110" cy="58" r="27" stroke={ink} strokeWidth="1.5" />
          <path d="M129 77l14 14" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        </g>
        <text x="140" y="118" textAnchor="middle" fill="rgb(255 255 255 / 0.35)" fontSize="10" fontFamily="var(--font-mono)">
          how the work really happens
        </text>
      </svg>
    );
  }
  if (i === 1) {
    // Engineering with purpose: measured, designed to fit.
    return (
      <svg viewBox="0 0 280 130" fill="none" className="h-full w-full">
        <rect x="70" y="34" width="140" height="62" rx="6" stroke={line} strokeWidth="1.5" />
        <rect x="84" y="48" width="54" height="34" rx="4" stroke={dim} strokeWidth="1.5" />
        <rect x="146" y="48" width="50" height="14" rx="3" stroke={dim} strokeWidth="1.5" />
        <rect x="146" y="68" width="50" height="14" rx="3" stroke={ink} strokeWidth="1.5" className="art-hot" fill="rgb(var(--acc) / 0.15)" />
        <g className="art-hot" stroke={ink} strokeWidth="1.2">
          <path d="M70 18h140M70 13v10M210 13v10" />
          <path d="M226 34v62M221 34h10M221 96h10" />
        </g>
        <text x="122" y="12" fill="rgb(255 255 255 / 0.35)" fontSize="10" fontFamily="var(--font-mono)">
          fit
        </text>
        <text x="70" y="116" fill="rgb(255 255 255 / 0.35)" fontSize="10" fontFamily="var(--font-mono)">
          maintainable · practical
        </text>
      </svg>
    );
  }
  // Direct accountability: one line between you and the person doing the work.
  return (
    <svg viewBox="0 0 280 130" fill="none" className="h-full w-full">
      <path d="M84 65h112" stroke={line} strokeWidth="1.5" />
      <path d="M84 65h112" stroke={ink} strokeWidth="2" className="art-hot" />
      <circle cx="140" cy="65" r="4" fill={ink} className="art-hot" />
      {[
        [56, "You"],
        [224, "Founder"],
      ].map(([x, t]) => (
        <g key={t as string}>
          <circle cx={x as number} cy="65" r="28"stroke={t === "You" ? line : ink} strokeWidth="1.5" fill="#0a1222" />
          <text x={x as number} y="69" textAnchor="middle" fill="rgb(255 255 255 / 0.75)" fontSize="10.5" fontFamily="var(--font-sans)">
            {t}
          </text>
        </g>
      ))}
      <text x="140" y="112" textAnchor="middle" fill="rgb(255 255 255 / 0.35)" fontSize="10" fontFamily="var(--font-mono)">
        one point of contact
      </text>
    </svg>
  );
}

export function HomeWhy() {
  return (
    <Section id="why" seamless field={dots}>
      <Atmos at={["50%", "0%"]} />
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{WHY.eyebrow}</Eyebrow>
          <SectionTitle id="why" className="max-w-[16ch]">
            {WHY.title}
          </SectionTitle>
        </div>
        <p className="max-w-[30rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{WHY.lead}</p>
      </div>

      <ol className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 lg:gap-6">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="lift-card flex flex-col rounded-[24px] p-3 sm:p-4">
            <div className="art-well h-40 sm:h-44">
              <div className="absolute inset-0 grid place-items-center p-4">
                <PrincipleArt i={i} />
              </div>
            </div>
            <div className="px-3 pb-4 pt-6 sm:px-4">
              <p className="font-mono text-xs text-accent-soft">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-[1.4375rem] font-semibold tracking-[-0.02em] text-foreground md:text-[1.5rem]">{p.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted md:text-base">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// --- 07 Our Approach ----------------------------------------------------------------------

/**
 * The four stages on a route that fills as the chapter scrolls (CSS
 * scroll-driven, field.css .prog-*; vertical on phones). Each stage is a card
 * hanging off its node: what happens, why it matters, what you receive.
 */
export function HomeApproach() {
  return (
    <Section id="approach" seamless band className="tl-section" field={dots}>
      <Atmos at={["15%", "100%"]} />
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
        <ol className="relative mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* The route: a faint track, filled as the section scrolls. */}
          <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-white/[0.12] lg:block" />
          <span aria-hidden className="prog-x absolute left-5 right-5 top-5 hidden h-[2px] -translate-y-[0.5px] bg-gradient-to-r from-accent via-accent-soft to-[#9fc0ff] shadow-[0_0_12px_rgb(54_123_250/0.7)] lg:block" />
          <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-white/[0.12] md:hidden" />
          <span aria-hidden className="prog-y absolute bottom-5 left-5 top-5 w-[2px] bg-gradient-to-b from-accent to-accent-soft md:hidden" />
          {STAGES.map((s, i) => {
            const outcome = APPROACH_PAGE.stages.find((d) => d.id === s.id)?.outcome;
            return (
              <li key={s.id} className="relative grid grid-cols-[2.5rem_1fr] gap-4 md:flex md:flex-col md:gap-0">
                <span
                  data-react=""
                  className="prog-node relative z-10 grid h-10 w-10 shrink-0 place-items-center self-start rounded-full border border-accent/70 bg-[var(--surface,#080d17)] font-mono text-sm text-accent-soft shadow-[0_0_0_6px_var(--surface,#080d17)]"
                  style={{ ["--from" as string]: `entry ${60 + i * 12}%`, ["--to" as string]: `entry ${70 + i * 12}%` }}
                >
                  {i + 1}
                </span>
                <div className="lift-card flex flex-1 flex-col rounded-[20px] p-5 sm:p-6 md:mt-6">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-[1.375rem]">{s.name}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-foreground/85">{s.summary}</p>
                  <p className="mb-5 mt-2 text-[0.9375rem] leading-relaxed text-muted">{STAGE_WHY[s.id]}</p>
                  {outcome && (
                    <p className="mt-auto border-t border-white/[0.08] pt-4 text-[0.875rem] leading-snug">
                      <span className="block text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">You receive</span>
                      <span className="mt-1 flex items-start gap-2 text-foreground/90">
                        <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                        {outcome}
                      </span>
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
          <Link href={APPROACH.page} className={solidBtn}>
            View Our Approach <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}

// --- 08 Working Together ---------------------------------------------------------------------

const MODEL_ACC: Record<(typeof HOME_MODELS)[number]["id"], string> = {
  defined: "77 136 255",
  bespoke: "150 140 255",
  partnership: "45 205 180",
};

/** The shape of each engagement, drawn: one scope; connected parts; a cycle. */
function ModelArt({ id }: { id: (typeof HOME_MODELS)[number]["id"] }) {
  const label = (x: number, y: number, t: string, anchor: "start" | "middle" | "end" = "middle") => (
    <text x={x} y={y} textAnchor={anchor} fill="rgb(255 255 255 / 0.4)" fontSize="9.5" fontFamily="var(--font-mono)">
      {t}
    </text>
  );
  if (id === "defined") {
    return (
      <svg viewBox="0 0 260 130" fill="none" className="h-full w-full">
        <rect x="80" y="30" width="100" height="64" rx="10" stroke={ink} strokeWidth="1.6" fill="rgb(var(--acc) / 0.1)" />
        <path d="M100 52h46M100 64h60M100 76h34" stroke={line} strokeWidth="1.6" strokeLinecap="round" />
        <g className="art-hot" stroke={ink} strokeWidth="1.2">
          <path d="M80 18h100M80 13v10M180 13v10" />
        </g>
        {/* Agreed: a tick badge on the scope's lower corner, clear of the measure. */}
        <circle cx="180" cy="94" r="11" fill="#0a1222" stroke={ink} strokeWidth="1.6" className="art-hot" />
        <path d="M175 94l3.5 3.5 6-7" stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="art-hot" />
        {label(130, 116, "one agreed scope")}
      </svg>
    );
  }
  if (id === "bespoke") {
    // Parts as [centre x, centre y, key]; links run centre to centre and are
    // drawn first, so each part (opaque) covers its end: every link meets its box.
    const parts: [number, number, boolean][] = [
      [55, 42, false],
      [130, 36, true],
      [205, 48, false],
      [88, 90, false],
      [172, 92, false],
    ];
    const links: [number, number][] = [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [3, 4],
    ];
    const hot = new Set(["0-1", "1-2", "1-4"]);
    const seg = ([a, b]: [number, number]) => `M${parts[a][0]} ${parts[a][1]}L${parts[b][0]} ${parts[b][1]}`;
    return (
      <svg viewBox="0 0 260 130" fill="none" className="h-full w-full">
        <path d={links.map(seg).join("")} stroke={line} strokeWidth="1.4" />
        <path d={links.filter(([a, b]) => hot.has(`${a}-${b}`)).map(seg).join("")} stroke={ink} strokeWidth="1.6" className="art-hot" />
        {parts.map(([cx, cy, key]) => {
          const w = key ? 40 : 30;
          const h = key ? 32 : 24;
          return (
            <g key={`${cx}-${cy}`}>
              <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="6" fill="#0a1222" />
              <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="6" stroke={key ? ink : line} strokeWidth="1.5" fill={key ? "rgb(var(--acc) / 0.14)" : "none"} />
            </g>
          );
        })}
        {label(130, 124, "connected parts, in milestones")}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 260 130" fill="none" className="h-full w-full">
      <circle cx="130" cy="60" r="38" stroke={line} strokeWidth="1.4" strokeDasharray="4 5" />
      <path d="M130 22a38 38 0 0 1 36.5 27.5" stroke={ink} strokeWidth="2" strokeLinecap="round" className="art-hot" />
      <path d="M160 44l7 6 2-9" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="art-hot" />
      {[
        [130, 22, "improve"],
        [168, 60, "support"],
        [130, 98, "review"],
        [92, 60, "develop"],
      ].map(([x, y, t]) => (
        <g key={t as string}>
          <circle cx={x as number} cy={y as number} r="4.5" fill="#0a1222" stroke={ink} strokeWidth="1.5" />
          {label((x as number) + ((x as number) > 130 ? 10 : (x as number) < 130 ? -10 : 0), (y as number) + ((y as number) === 22 ? -8 : (y as number) === 98 ? 16 : 3.5), t as string, (x as number) > 130 ? "start" : (x as number) < 130 ? "end" : "middle")}
        </g>
      ))}
    </svg>
  );
}

export function HomeWorkingTogether() {
  return (
    <Section id="working-together" seamless field={dots}>
      <Atmos at={["85%", "10%"]} acc="150 140 255" />
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <Eyebrow>{WORKING.eyebrow}</Eyebrow>
          <SectionTitle id="working-together" className="max-w-[17ch]">
            {WORKING.title}
          </SectionTitle>
        </div>
        <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{WORKING.intro}</p>
      </div>

      <ul className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-3 lg:gap-6">
        {HOME_MODELS.map((m) => {
          const suits = WORKING_PAGE.models.find((x) => x.id === m.id)?.suits;
          return (
            <li key={m.id} className="lift-card flex flex-col rounded-[24px] p-3 sm:p-4" style={{ ["--acc" as string]: MODEL_ACC[m.id] }}>
              <div className="art-well h-40 sm:h-44">
                <div className="absolute inset-0 grid place-items-center p-4">
                  <ModelArt id={m.id} />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-4">
                <h3 className="text-[1.5rem] font-semibold tracking-[-0.025em] text-foreground md:text-[1.625rem]">{m.name}</h3>
                <p className="mt-2 text-base font-medium leading-snug text-foreground/85">{m.line}</p>
                {suits && (
                  <p className="mt-4 border-t border-white/[0.08] pt-4 text-[0.9375rem] leading-relaxed text-muted">
                    <span className="mb-1 block text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">Suits you when</span>
                    {suits.replace(/^When /, "").replace(/^./, (c) => c.toUpperCase())}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {WORKING.page && (
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[36rem] text-[0.9375rem] leading-relaxed text-muted">
            What shapes a quotation, what is agreed in writing and common questions are covered in detail.
          </p>
          <Link href={WORKING.page} className={`${solidBtn} shrink-0`}>
            How We Work Together <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </Section>
  );
}

// --- 09 Start a Conversation -------------------------------------------------------------------

const callLink =
  "font-medium text-foreground underline decoration-accent-soft/40 underline-offset-4 transition-colors hover:decoration-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/**
 * The close: the enquiry form in place (ContactForm, shared with /contact).
 * Until delivery is configured it says plainly that nothing is sent, before
 * and after submitting. A call stays one link away (booking when configured,
 * otherwise the Contact page).
 */
export function HomeContact() {
  return (
    <section id="contact" data-chapter="contact" data-sr-section="" aria-labelledby="contact-title" className={`relative ${anchorOffset}`}>
      {dots}
      <div className={`mx-auto w-full max-w-[1440px] pb-20 pt-16 md:pb-28 md:pt-24 ${gutter}`}>
        <div className="relative isolate overflow-hidden rounded-[32px] border border-white/[0.12] bg-[#0a1324] px-6 py-12 shadow-[0_60px_120px_-60px_rgb(54_123_250/0.55)] sm:px-10 md:py-16 lg:px-16 lg:py-20">
          {/* Light, grid and a lit edge: the page's last and brightest moment. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_75%_at_88%_105%,rgb(54_123_250/0.38),transparent_70%),radial-gradient(ellipse_35%_45%_at_100%_100%,rgb(150_140_255/0.18),transparent_70%),radial-gradient(ellipse_45%_50%_at_0%_0%,rgb(110_160_255/0.1),transparent_70%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(110_160_255/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(110_160_255/0.08)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_70%_at_85%_100%,#000_10%,transparent_75%)]"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-accent-soft/70 to-transparent" />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* The invitation and what happens next. */}
            <div className="lg:col-span-5">
              <Eyebrow>{CLOSING.eyebrow}</Eyebrow>
              <h2
                id="contact-title"
                className="reveal mt-5 max-w-[16ch] text-[clamp(2.3rem,8.8vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3rem,5.4vw,3.75rem)] lg:text-[clamp(2.75rem,3.6vw,3.5rem)]"
              >
                Let’s discuss what your business could do{" "}
                <span className="bg-gradient-to-r from-accent-soft to-[#9fc0ff] bg-clip-text text-transparent">better</span>
                <span className="text-accent">.</span>
              </h2>
              <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{CLOSING.intro}</p>

              <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-subtle">What to expect</p>
              <ol className="relative mt-5 grid gap-5">
                <span aria-hidden className="absolute bottom-3 left-[0.9375rem] top-3 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />
                {CONTACT.expectations.map((e, i) => (
                  <li key={e} className="relative grid grid-cols-[2rem_1fr] items-start gap-4 text-[0.9375rem] leading-relaxed text-foreground/85">
                    <span
                      aria-hidden
                      className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-accent/60 bg-[#0a1324] font-mono text-xs text-accent-soft shadow-[0_0_16px_rgb(54_123_250/0.35)]"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-1">{e}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-10 text-[0.9375rem] text-muted">
                Prefer to talk it through?{" "}
                {CALL_CTA.external ? (
                  <a href={CALL_CTA.href} target="_blank" rel="noopener noreferrer" className={callLink}>
                    {CALL_CTA.label} →
                  </a>
                ) : (
                  <Link href={CALL_CTA.href} className={callLink}>
                    {CALL_CTA.label} →
                  </Link>
                )}
              </p>
            </div>

            {/* The enquiry form itself (honest about delivery: ContactForm). */}
            <div className="lg:col-span-7">
              <div className="rounded-[24px] border border-white/[0.1] bg-[#070c16] p-5 shadow-[0_40px_80px_-50px_rgb(0_0_0/0.9)] sm:p-8">
                <h3 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-foreground">{ENQUIRY_CTA.label.replace(/^./, (c) => c.toUpperCase())}</h3>
                <p className="mb-6 mt-1.5 text-[0.9375rem] text-muted">A few sentences is enough. It doesn’t need to be a finished brief.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
