import Link from "next/link";
import { cacheLife } from "next/cache";
import { NAV_CTA, NAV_LINKS, SITE } from "@/config/site";
import BrandLogo from "./BrandLogo";

const linkClass =
  "rounded-sm text-[0.9375rem] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/** The copyright year, cached (Cache Components forbids `new Date()` in a prerender). */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Site-wide footer: brand, the same live destinations as the header, copyright. */
export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-background">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-14 sm:px-8 md:grid-cols-12 lg:px-12">
        <div className="md:col-span-5">
          <BrandLogo />
          <p className="mt-4 max-w-[22rem] text-[0.9375rem] leading-relaxed text-muted">
            Bespoke software, AI, automation and integrations, engineered around how your business works.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-7 md:justify-self-end">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
            {[...NAV_LINKS, NAV_CTA].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-subtle md:col-span-12">
          &copy; <CopyrightYear /> {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
