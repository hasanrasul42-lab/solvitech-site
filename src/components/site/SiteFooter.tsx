import Link from "next/link";
import { cacheLife } from "next/cache";
import { CALL_CTA, ENQUIRY_CTA, NAV_LINKS, NAV_SOLUTIONS, SITE, SOLUTIONS_HUB } from "@/config/site";
import BrandLogo from "./BrandLogo";

const linkClass =
  "group inline-flex min-h-8 items-center gap-1.5 rounded-sm text-[0.9375rem] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/** The copyright year, cached (Cache Components forbids `new Date()` in a prerender). */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function ColumnTitle({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-subtle">
      <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
      {children}
    </p>
  );
}

/**
 * Site-wide footer: brand and the two conversation actions, every service
 * page, the company pages, then copyright and a way back to the top. Only
 * real destinations: no invented legal pages, addresses or contact details.
 */
export default function SiteFooter() {
  const call = CALL_CTA.external ? (
    <a href={CALL_CTA.href} target="_blank" rel="noopener noreferrer" className={callClass}>
      {CALL_CTA.label} <span aria-hidden>→</span>
    </a>
  ) : (
    <Link href={CALL_CTA.href} className={callClass}>
      {CALL_CTA.label}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.07] bg-[#060a13]">
      {/* A lit top edge, a soft light and a fine grid fading from the top left. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(110_160_255/0.5)_30%,transparent_75%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_15%_0%,rgb(54_123_250/0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgb(110_160_255/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(110_160_255/0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_40%_70%_at_10%_0%,#000_10%,transparent_75%)]"
      />

      <div className="mx-auto w-full max-w-[1440px] px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12">
        <div className="grid gap-12 pb-14 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-16">
          {/* Brand and the two ways to start. */}
          <div className="lg:col-span-5">
            <BrandLogo />
            <p className="mt-5 max-w-[24rem] text-[1.0625rem] leading-relaxed text-muted">
              AI, automation, websites and bespoke software, engineered around how your business works.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {call}
              <Link href={ENQUIRY_CTA.href} className={`${linkClass} font-medium text-foreground/85`}>
                {ENQUIRY_CTA.label}
              </Link>
            </div>
          </div>

          <nav aria-label="Footer" className="grid gap-10 min-[480px]:grid-cols-[1.35fr_1fr] lg:col-span-7 lg:justify-self-end lg:gap-20">
            <div>
              <ColumnTitle>Solutions</ColumnTitle>
              <ul className="mt-5 grid gap-1.5">
                {NAV_SOLUTIONS.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className={linkClass}>
                      {s.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={SOLUTIONS_HUB.href} className={`${linkClass} text-accent-soft hover:text-foreground`}>
                    {SOLUTIONS_HUB.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ColumnTitle>Company</ColumnTitle>
              <ul className="mt-5 grid gap-1.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.07] pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; <CopyrightYear /> {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="hidden md:block">Engineering better business.</p>
            <a href="#" className={`group inline-flex min-h-8 items-center gap-1.5 rounded-sm text-muted transition-colors hover:text-foreground ${focusRing}`}>
              Back to top
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">
                ↑
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const callClass =
  "group inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[0.9375rem] font-medium text-background transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";
