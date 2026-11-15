import Link from "next/link";
import { DIRECTORY, FAMILIES, MORE, type Family } from "@/config/home";
import { CALL_CTA, ENQUIRY_CTA } from "@/config/site";
import { Eyebrow, anchorOffset, gutter } from "./Section";
import { AiVisual, AutomationVisual, SoftwareVisual } from "./directory/Visuals";
import WebsiteVisual from "./directory/WebsiteVisual";
import "./directory/directory.css";

/**
 * Chapter 03 -- What We Do: the four service families, each with a
 * dimensional visual of recognisable product surfaces (src/components/home/
 * directory), a plain description, what it covers and direct links to the
 * dedicated pages. Then chapter 04 -- Additional Services (SEO & Digital
 * Growth, the Solutions hub).
 *
 * Introduce, don't demonstrate: no sequences or simulations here; the service
 * pages carry the deeper stories. Copy: src/config/home.ts.
 */
export default function HomeSolutions() {
  return (
    <>
      <section id="solutions" data-chapter="solutions" data-sr-section="" aria-labelledby="solutions-title" className={`relative ${anchorOffset}`}>
        <div aria-hidden className="sr sr-dots -z-10" />
        <div className={`mx-auto w-full max-w-[1440px] pb-8 pt-16 md:pt-20 lg:pt-24 ${gutter}`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <Eyebrow>{DIRECTORY.eyebrow}</Eyebrow>
              <h2
                id="solutions-title"
                className="reveal mt-5 max-w-[16ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1] tracking-[-0.04em] text-foreground md:text-[clamp(3.25rem,6.6vw,4.25rem)] lg:text-[clamp(3.5rem,4.6vw,4.5rem)]"
              >
                {DIRECTORY.title}
                <span className="text-accent">.</span>
              </h2>
            </div>
            <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:col-span-5 lg:pb-2">{DIRECTORY.intro}</p>
          </div>

          {/* The four families, as an index that doubles as in-page navigation. */}
          <nav aria-label="Service families" className="mt-10 md:mt-14">
            <ol className="grid grid-cols-2 border-t border-hairline lg:grid-cols-4">
              {FAMILIES.map((f, i) => (
                <li key={f.id} className={`acc-${f.id} border-b border-hairline [&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0`}>
                  <a
                    href={`#${f.anchor}`}
                    className="group flex h-full min-h-14 items-start gap-3 px-3 py-4 transition-colors hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-soft sm:gap-4 sm:px-5 sm:py-5"
                  >
                    <span className="acc-text pt-0.5 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[0.9375rem] font-medium leading-snug text-muted transition-colors group-hover:text-foreground sm:text-base">
                      {f.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className={`mx-auto w-full max-w-[1440px] ${gutter}`}>
          {FAMILIES.map((f, i) => (
            <FamilyRow key={f.id} family={f} index={i} />
          ))}
        </div>
      </section>

      <MoreServices />
    </>
  );
}

const linkBtn =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";

function Visual({ family }: { family: Family }) {
  switch (family.id) {
    case "ai":
      return <AiVisual label={family.visualLabel} />;
    case "automation":
      return <AutomationVisual label={family.visualLabel} />;
    case "websites":
      return <WebsiteVisual label={family.visualLabel} />;
    case "software":
      return <SoftwareVisual label={family.visualLabel} />;
  }
}

/**
 * One family. Phones read: heading, visual, then what it covers. From lg the
 * visual takes one side (alternating) and the text stacks on the other.
 */
function FamilyRow({ family: f, index }: { family: Family; index: number }) {
  const flip = index % 2 === 1;
  const areas = flip ? "lg:[grid-template-areas:'vis_head'_'vis_body']" : "lg:[grid-template-areas:'head_vis'_'body_vis']";
  const cols = flip ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]";
  return (
    <article
      id={f.anchor}
      data-svc=""
      aria-labelledby={`${f.anchor}-title`}
      className={`acc-${f.id} relative grid grid-cols-1 gap-x-14 border-t border-hairline py-14 md:py-20 lg:py-24 xl:gap-x-20 ${cols} ${areas} lg:grid-rows-[auto_1fr] ${anchorOffset}`}
    >
      {f.id === "websites" && (
        // The website family gets a little more light: it is a lead offer.
        <div aria-hidden className="pointer-events-none absolute inset-x-[-10%] inset-y-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_70%_50%,rgb(var(--acc)/0.09),transparent_70%)]" />
      )}
      <header className="[grid-area:auto] lg:self-end lg:[grid-area:head]">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-subtle sm:tracking-[0.2em]">
          <span className="acc-text font-mono tracking-normal">{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden className="acc-bg h-px w-6" />
          {f.kicker}
        </p>
        <h3
          id={`${f.anchor}-title`}
          className="mt-4 text-[clamp(1.9rem,7vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[2.6rem] lg:text-[clamp(2.3rem,3vw,2.9rem)]"
        >
          {f.title}
        </h3>
        <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{f.description}</p>
      </header>

      <div className="reveal -mx-[max(1.25rem,env(safe-area-inset-left))] mt-8 sm:mx-0 md:mt-10 lg:mt-0 lg:self-center lg:[grid-area:vis]">
        <Visual family={f} />
      </div>

      <div className="mt-8 md:mt-10 lg:mt-8 lg:[grid-area:body]">
        <div className={`grid gap-6 ${f.coverage.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {f.coverage.map((g, gi) => (
            <div key={gi}>
              {g.heading && <p className="mb-3 text-sm font-medium text-foreground">{g.heading}</p>}
              <ul className={`grid gap-x-6 gap-y-2.5 ${f.coverage.length === 1 ? "sm:grid-cols-2" : ""}`}>
                {g.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[0.9375rem] leading-snug text-muted">
                    <span aria-hidden className="acc-bg mt-[0.5rem] h-1 w-1 shrink-0 rounded-full" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {f.links.map((l) => (
            <Link key={l.href} href={l.href} className={linkBtn}>
              {l.label}
              <span aria-hidden className="transition-transform duration-300 ease-[var(--ease-precise)] group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
        </div>
        {f.related && (
          <p className="mt-5 text-[0.9375rem] text-muted">
            {f.related.lead}{" "}
            <Link
              href={f.related.href}
              className="font-medium text-accent-soft underline decoration-accent-soft/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
            >
              {f.related.label}
            </Link>
          </p>
        )}
      </div>
    </article>
  );
}

/** Chapter 04 -- Additional Services: SEO & Digital Growth, and the way to everything else. */
function MoreServices() {
  return (
    <section id="more" data-chapter="more" data-sr-section="" aria-labelledby="more-title" className={`relative ${anchorOffset}`}>
      <div aria-hidden className="sr sr-dots -z-10" />
      <div className={`mx-auto w-full max-w-[1440px] pb-16 md:pb-20 ${gutter}`}>
        <div className="grid overflow-hidden rounded-[26px] border border-white/[0.09] bg-[linear-gradient(135deg,rgb(255_255_255/0.035),rgb(255_255_255/0.01))] lg:grid-cols-12">
          <div className="relative p-6 sm:p-8 lg:col-span-8 lg:p-10">
            <Eyebrow>{MORE.eyebrow}</Eyebrow>
            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <GrowthGlyph />
              <div>
                <h2 id="more-title" className="text-[1.75rem] font-semibold tracking-[-0.025em] text-foreground md:text-[2rem]">
                  {MORE.title}
                </h2>
                <p className="mt-3 max-w-[36rem] text-[0.9375rem] leading-relaxed text-muted md:text-base">{MORE.line}</p>
                <Link
                  href={MORE.href}
                  className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-accent-soft transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
                >
                  {MORE.linkLabel}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 border-t border-white/[0.07] p-6 sm:p-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:p-10">
            <div>
              <p className="text-sm text-subtle">{MORE.hub.lead}</p>
              <Link
                href={MORE.hub.href}
                className="group mt-2 inline-flex min-h-11 items-center gap-1.5 text-lg font-medium text-foreground transition-colors hover:text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                {MORE.hub.label}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
            <div>
              <p className="text-sm text-subtle">Not sure which service fits?</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                Start with the problem.{" "}
                <Link href={CALL_CTA.href} className="font-medium text-foreground underline decoration-white/25 underline-offset-4 hover:decoration-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft">
                  {CALL_CTA.label}
                </Link>{" "}
                or{" "}
                <Link href={ENQUIRY_CTA.href} className="font-medium text-foreground underline decoration-white/25 underline-offset-4 hover:decoration-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft">
                  {ENQUIRY_CTA.label.toLowerCase()}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A search result climbing: visibility, quietly. */
function GrowthGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 96 72" fill="none" className="h-[4.5rem] w-24 shrink-0">
      <rect x="0.5" y="0.5" width="95" height="71" rx="14" fill="rgb(54 123 250 / 0.08)" stroke="rgb(54 123 250 / 0.3)" />
      <rect x="12" y="12" width="72" height="12" rx="6" stroke="rgb(255 255 255 / 0.22)" />
      <circle cx="20" cy="18" r="2.6" stroke="rgb(110 160 255)" strokeWidth="1.5" />
      <path d="M12 58 L30 50 L44 53 L62 40 L84 33" stroke="rgb(110 160 255)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="84" cy="33" r="3" fill="rgb(110 160 255)" />
    </svg>
  );
}
