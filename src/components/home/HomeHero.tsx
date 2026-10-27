import InteractiveMark, { type InteractiveMarkProps } from "@/components/hero/interactive/InteractiveMark";
import SiteLinkControl from "@/components/site/SiteLinkControl";
import HeroCopySync from "./HeroCopySync";
import { HERO_CTAS } from "@/config/site";

const primaryCta =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[0.9375rem] font-medium text-background transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";
const secondaryCta =
  "inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";

/**
 * Chapter 1 of the homepage. Text and sculpture share one environment:
 *
 * - lg+: text on the left; the sculpture stage is a full-height layer on the
 *   right that bleeds under the text column, so the glow and the mark sit in
 *   the same space as the headline rather than in a separate column.
 * - md:  stacked, text first, then a tall stage with the mark offset right.
 * - <md: vertical: the mark first (it is the visual hook), then text and CTAs.
 *
 * The stage ignores pointer input except on the mark's own hit target, so it
 * never blocks text selection, links or scrolling.
 */
export default function HomeHero({
  markProps,
}: {
  /** Lab experiments only (e.g. /3d-lab/entrance-prototype, archive branch); the homepage passes none. */
  markProps?: Omit<InteractiveMarkProps, "className">;
} = {}) {
  return (
    <section
      id="hero"
      data-chapter="hero"
      aria-labelledby="hero-title"
      className="hero-sync relative isolate overflow-hidden lg:flex lg:min-h-[max(40rem,100svh)] lg:items-center"
    >
      {/* Copy, bloom and mark all start at first paint; this retimes the copy
          to land with the mark (globals.css .hero-sync). */}
      <HeroCopySync targetId="hero" />
      {/* Ambient light: a soft blue bloom behind the sculpture and a faint
          cool falloff from the top. No grids, rings or particles. */}
      <div aria-hidden className="hero-fade pointer-events-none absolute inset-0 -z-10">
        {markProps?.lighting === "refined" ? (
          // A/B candidate: asymmetric field low around the blue ribbon (globals.css).
          <div className="hero-bloom-refined absolute inset-0" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_48%_at_50%_30%,rgb(47_107_255/0.13),transparent_70%)] md:bg-[radial-gradient(ellipse_46%_40%_at_62%_68%,rgb(47_107_255/0.13),transparent_70%)] lg:bg-[radial-gradient(ellipse_34%_55%_at_70%_52%,rgb(47_107_255/0.14),transparent_72%)]" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_25%_-5%,rgb(110_160_255/0.06),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-[max(1.25rem,env(safe-area-inset-left))] pb-14 pt-[calc(var(--header-height)+env(safe-area-inset-top))] sm:px-8 md:pb-16 lg:static lg:px-12 lg:pb-[calc(var(--header-height)*0.5)]">
        {/* Text */}
        <div className="relative z-10 order-2 -mt-2 md:order-1 md:mt-10 md:max-w-[40rem] lg:mt-0 lg:w-[46%] lg:max-w-[42rem] xl:w-[44%]">
          <p
            className="hero-rise flex items-center gap-3 text-[0.625rem] font-medium uppercase tracking-[0.14em] text-subtle min-[400px]:text-[0.6875rem] sm:text-xs sm:tracking-[0.22em]"
            style={{ ["--delay" as string]: "0ms" }}
          >
            <span aria-hidden className="h-px w-6 bg-accent" />
            Systems · Automation · Digital experiences
          </p>

          <h1
            id="hero-title"
            className="hero-rise mt-5 text-[clamp(2.75rem,min(11vw,8.5svh),4.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground md:text-[clamp(4rem,9.4vw,5.5rem)] lg:mt-6 lg:text-[clamp(4.75rem,min(6.6vw,10.5svh),6.75rem)]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            Engineering better business<span className="text-accent">.</span>
          </h1>

          <p
            className="hero-rise mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg lg:mt-8 lg:max-w-[33rem] lg:text-[1.1875rem]"
            style={{ ["--delay" as string]: "200ms" }}
          >
            We design and build intelligent systems, AI automations, high-performance websites and digital solutions
            that make businesses work better.
          </p>

          <div
            className="hero-rise mt-8 flex flex-col gap-3 min-[420px]:flex-row lg:mt-10"
            style={{ ["--delay" as string]: "300ms" }}
          >
            <SiteLinkControl link={HERO_CTAS.primary} className={`${primaryCta} w-full min-[420px]:w-auto`}>
              {HERO_CTAS.primary.label}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </SiteLinkControl>
            <SiteLinkControl link={HERO_CTAS.secondary} className={`${secondaryCta} w-full min-[420px]:w-auto`} />
          </div>
        </div>

        {/* Sculpture stage: after the text in the DOM (reading and tab order),
            first visually on phones via `order`. */}
        <div
          className="relative -mx-[max(1.25rem,env(safe-area-inset-left))] order-1 h-[clamp(17rem,42svh,26rem)] pointer-events-none [&_[role=button]]:pointer-events-auto sm:-mx-8 md:order-2 md:mx-0 md:-mt-4 md:ml-[18%] md:h-[clamp(24rem,46svh,34rem)] lg:absolute lg:inset-y-0 lg:right-0 lg:ml-0 lg:mt-0 lg:h-auto lg:w-[58%] xl:w-[56%]"
        >
          {/* The mark owns its entrance (fade-in + settle); no extra fade here,
              which previously hid most of the movement. */}
          <InteractiveMark className="h-full w-full" {...markProps} />
        </div>
      </div>
    </section>
  );
}
