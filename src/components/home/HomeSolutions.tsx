import Link from "next/link";
import { DIRECTORY, FAMILIES, type Family } from "@/config/home";
import { Eyebrow, anchorOffset, gutter } from "./Section";
import { AiVisual, AutomationVisual, SoftwareVisual } from "./directory/Visuals";
import WebsiteVisual from "./directory/WebsiteVisual";
import "./directory/directory.css";

/**
 * Chapter 03 -- What We Do: the four service families, each with a
 * dimensional visual of recognisable product surfaces (src/components/home/
 * directory), a plain description, what it covers and direct links to the
 * dedicated pages. SEO & Digital Growth sits inside the websites family.
 *
 * Introduce, don't demonstrate: no sequences or simulations here; the service
 * pages carry the deeper stories. Copy: src/config/home.ts.
 */
export default function HomeSolutions() {
  return (
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
      </div>
    </article>
  );
}
