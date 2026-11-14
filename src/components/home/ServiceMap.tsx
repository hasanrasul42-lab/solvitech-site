import Link from "next/link";
import { ReactZone } from "@/components/field/FieldRoot";
import { CORE_SERVICES } from "@/config/services";

const QUADRANTS = ["tl", "tr", "bl", "br"] as const;

/**
 * The four core services as one connected system: four regions whose gaps
 * form the system's axes, meeting at a single centre. Hovering or focusing a
 * service lights the axes it sits on; the axes draw out from the centre as
 * the map scrolls into view. Every region is a plain link to its page.
 * Styles: field.css (.svc-*).
 */
export default function ServiceMap() {
  return (
    <ReactZone className="svc-map relative">
      {/* Axes and centre (md+): behind the regions, visible in the gaps. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="svc-ax svc-ax-l" />
        <span className="svc-ax svc-ax-r" />
        <span className="svc-ax svc-ax-t" />
        <span className="svc-ax svc-ax-b" />
        <span className="svc-node" />
      </div>

      <ul className="relative grid gap-4 md:auto-rows-fr md:grid-cols-2 md:gap-12 lg:gap-16">
        {CORE_SERVICES.map((s, i) => (
          <li key={s.slug} data-q={QUADRANTS[i]} className="svc-p">
            <Link
              href={s.href}
              data-react=""
              className="rx rx-panel group relative isolate flex h-full flex-col rounded-[22px] border border-white/[0.07] bg-[#0b111d]/[0.92] p-6 transition-[border-color,background-color] duration-300 ease-[var(--ease-precise)] hover:border-accent/35 hover:bg-[#0d1424] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft sm:p-8 lg:p-10"
            >
              <span aria-hidden className="sr sr-panel sr-dots" />
              {/* Edge light along the side that faces the centre. */}
              <span aria-hidden className="svc-edge" />
              <span aria-hidden className="font-mono text-xs text-accent-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[1.5rem] font-semibold leading-tight tracking-[-0.025em] text-foreground md:text-[1.75rem] lg:text-[2rem]">
                {s.name}
              </h3>
              <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed text-muted md:text-base">{s.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-hairline pt-5 text-sm text-foreground/75">
                {s.builds.slice(0, 3).map((b) => (
                  <li key={b.title} className="flex items-center gap-2">
                    <span aria-hidden className="h-1 w-1 rotate-45 bg-accent/70" />
                    {b.title}
                  </li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-medium text-accent-soft">
                Explore {s.name}
                <span aria-hidden className="transition-transform duration-300 ease-[var(--ease-precise)] group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ReactZone>
  );
}
