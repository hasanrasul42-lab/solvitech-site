import Link from "next/link";
import { gutter } from "@/components/home/Section";

export const primaryBtn =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[0.9375rem] font-medium text-background transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";
export const secondaryBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";

/**
 * Closing call to action for Solutions pages. Enquiries go to the homepage
 * contact chapter (the only enquiry destination until a Contact page exists).
 */
export function PageCta({ title, body }: { title: string; body: string }) {
  return (
    <section aria-labelledby="page-cta-title" className="relative isolate overflow-hidden border-t border-hairline bg-[#0a0f1a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_70%_at_85%_100%,rgb(54_123_250/0.12),transparent_70%)]"
      />
      <div className={`mx-auto flex w-full max-w-[1440px] flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-24 ${gutter}`}>
        <div className="max-w-[40rem]">
          <h2 id="page-cta-title" className="text-[clamp(2rem,7vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground md:text-[2.75rem]">
            {title}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted md:text-lg">{body}</p>
        </div>
        <Link href="/#contact" className={`${primaryBtn} shrink-0 self-start md:self-auto`}>
          Start a conversation <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
