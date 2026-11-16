import Link from "next/link";
import type { ReactNode } from "react";
import { gutter } from "@/components/home/Section";

/**
 * Shared building blocks for the dedicated service pages (/solutions/ai,
 * /solutions/automation): type scale, the homepage's dot grid and section
 * atmosphere, numbered points, breadcrumb and FAQ. Visuals are per page.
 */

export const wrap = `mx-auto w-full max-w-[1440px] ${gutter}`;
export const h2 =
  "reveal mt-5 text-[clamp(2rem,7.6vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(2.6rem,4.8vw,3.25rem)] lg:text-[clamp(2.75rem,3.4vw,3.5rem)]";
export const h1 =
  "mt-5 max-w-[15ch] text-[clamp(2.5rem,10vw,3.4rem)] font-semibold leading-[1] tracking-[-0.04em] text-foreground md:text-[clamp(3.4rem,7vw,4.5rem)] lg:text-[clamp(3.6rem,5vw,4.9rem)]";
export const lead = "text-[1.0625rem] leading-relaxed text-muted md:text-lg";
export const textLink =
  "inline-flex min-h-11 items-center gap-1.5 font-medium text-accent-soft transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/** A section title; ends with the accent full stop unless it is a question. */
export function Title({ id, children }: { id: string; children: ReactNode }) {
  const question = typeof children === "string" && /[?!]$/.test(children);
  return (
    <h2 id={id} className={h2}>
      {children}
      {!question && <span className="text-accent">.</span>}
    </h2>
  );
}

/** The homepage's cursor-revealed dot grid (StructureReveal + structure.css). */
export const dots = <div aria-hidden className="sr sr-dots -z-10" />;

/** The homepage's section atmosphere: accent light + fine grid from a point (directory.css .sec-atmos). */
export function Atmos({ at, acc }: { at: [string, string]; acc?: string }) {
  return (
    <div
      aria-hidden
      className="sec-atmos"
      style={{ ["--ax" as string]: at[0], ["--ay" as string]: at[1], ...(acc ? { ["--acc" as string]: acc } : {}) }}
    />
  );
}

/** Numbered points on the homepage's lifted card surface. */
export function Points({ items, ordered, className = "mt-8 grid gap-3" }: { items: { title: string; body: string }[]; ordered?: boolean; className?: string }) {
  const List = ordered ? "ol" : "ul";
  return (
    <List className={className}>
      {items.map((it, i) => (
        <li key={it.title} className="lift-card flex items-start gap-4 rounded-[18px] p-5 sm:p-6">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/35 bg-accent/[0.12] font-mono text-xs text-accent-soft">{i + 1}</span>
          <span>
            <span className="block text-[1.125rem] font-semibold tracking-[-0.015em] text-foreground">{it.title}</span>
            <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-muted">{it.body}</span>
          </span>
        </li>
      ))}
    </List>
  );
}

const crumb = "rounded-sm hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

export function Breadcrumb({ label }: { label: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-subtle">
        <li>
          <Link href="/" className={crumb}>
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/solutions" className={crumb}>
            Solutions
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="text-muted">
          {label}
        </li>
      </ol>
    </nav>
  );
}

export function Faq({ items, cta }: { items: { q: string; a: string }[]; cta: { lead: string; label: string; href: string } }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
      <h3 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground lg:col-span-4">Common questions</h3>
      <div className="lg:col-span-8">
        {items.map((f) => (
          <details key={f.q} className="group border-t border-white/[0.09] last:border-b">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-medium text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-xl text-accent-soft transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-[44rem] pb-5 text-[0.9375rem] leading-relaxed text-muted md:text-base">{f.a}</p>
          </details>
        ))}
        <p className="mt-6 text-[0.9375rem] text-muted">
          {cta.lead}{" "}
          <Link href={cta.href} className={textLink}>
            {cta.label} <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
