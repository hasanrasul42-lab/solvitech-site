import type { ReactNode } from "react";

/** Shared page gutter and in-page anchor offset (clears the fixed header). */
export const gutter = "px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12";
export const anchorOffset = "scroll-mt-[calc(var(--header-height)+1.5rem)]";

export const textLink =
  "inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-soft transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/**
 * A homepage chapter: full-bleed band with a hairline top edge and the shared
 * content width. `tone` alternates the band colour so chapters read apart.
 */
export function Section({
  id,
  tone = "base",
  className = "",
  field,
  seamless = false,
  children,
}: {
  id: string;
  tone?: "base" | "raised";
  /** Homepage: no band, border or stacking context -- one continuous environment. */
  seamless?: boolean;
  className?: string;
  /** Decorative Solvitech Field behind the chapter. */
  field?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-chapter={id}
      aria-labelledby={`${id}-title`}
      className={`relative ${seamless ? "" : `isolate border-t border-hairline ${tone === "raised" ? "bg-[#0a0f1a]" : "bg-background"}`} ${anchorOffset} ${className}`}
    >
      {field}
      <div className={`mx-auto w-full max-w-[1440px] py-20 md:py-24 lg:py-28 ${gutter}`}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p data-eyebrow="" className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-subtle sm:tracking-[0.22em]">
      <span aria-hidden className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

/** Chapter heading. Sizes step down slightly from the Solutions headline. */
export function SectionTitle({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2
      id={`${id}-title`}
      className={`reveal mt-5 text-[clamp(2.1rem,8vw,2.75rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground md:text-[clamp(2.75rem,5.4vw,3.5rem)] lg:text-[clamp(3rem,3.9vw,3.75rem)] ${className}`}
    >
      {children}
      <span className="text-accent">.</span>
    </h2>
  );
}
