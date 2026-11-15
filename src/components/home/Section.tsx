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
  pad = "py-20 md:py-24 lg:py-28",
  band = false,
  children,
}: {
  id: string;
  tone?: "base" | "raised";
  /** Homepage: no band, border or stacking context -- one continuous environment. */
  seamless?: boolean;
  /**
   * Homepage rhythm: a lifted navy surface with a lit top edge, so alternate
   * sections read as distinct chapters of one page. Exposes its colour as
   * --surface for opaque elements inside it.
   */
  band?: boolean;
  className?: string;
  /** Vertical padding (Tailwind classes). */
  pad?: string;
  /** Decorative Solvitech Field behind the chapter. */
  field?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-chapter={id}
      data-sr-section={seamless ? "" : undefined}
      aria-labelledby={`${id}-title`}
      className={`relative ${seamless ? "" : `isolate border-t border-hairline ${tone === "raised" ? "bg-[#0a0f1a]" : "bg-background"}`} ${band ? bandSurface : ""} ${anchorOffset} ${className}`}
      style={band ? { ["--surface" as string]: "#0b1322" } : undefined}
    >
      {band && <BandEdge />}
      {field}
      <div className={`mx-auto w-full max-w-[1440px] ${pad} ${gutter}`}>{children}</div>
    </section>
  );
}

/** The band surface: lifted navy, hairline edges, a faint cool light from the top. */
export const bandSurface =
  "isolate border-y border-white/[0.06] bg-[#0b1322] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(54_123_250/0.07),transparent_70%)]";

/** A lit top edge: brightest at the centre, fading to the sides. */
export function BandEdge() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-px h-px bg-[linear-gradient(90deg,transparent,rgb(110_160_255/0.45)_50%,transparent)]"
    />
  );
}

/**
 * Homepage outlined button. Solid (the section's colour), so the cursor dot
 * grid stays behind it; inner pages keep the shared secondaryBtn.
 */
export const solidBtn =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-[var(--surface,#080d17)] px-6 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/35 hover:bg-[color-mix(in_srgb,var(--surface,#080d17),white_6%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft";

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
