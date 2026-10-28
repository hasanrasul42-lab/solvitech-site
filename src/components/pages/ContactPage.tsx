import Link from "next/link";
import { CONTACT } from "@/config/home";
import { CONTACT_PAGE } from "@/config/pages";
import { getService } from "@/config/services";
import { Eyebrow, gutter } from "@/components/home/Section";
import ContactForm from "@/components/home/ContactForm";

/**
 * /contact -- the dedicated enquiry destination. A confident opening, what we
 * can discuss, the short form and what happens next. Delivery follows
 * CONTACT (src/config/home.ts): preview-only until a recipient is configured.
 */
export default function ContactPage() {
  const C = CONTACT_PAGE;
  const preview = !CONTACT.email;
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(ellipse_60%_60%_at_15%_0%,rgb(54_123_250/0.11),transparent_70%)]"
      />
      <div
        className={`mx-auto grid w-full max-w-[1440px] gap-14 pb-24 pt-[calc(var(--header-height)+env(safe-area-inset-top)+3rem)] md:pt-[calc(var(--header-height)+env(safe-area-inset-top)+4.5rem)] lg:grid-cols-12 lg:gap-16 ${gutter}`}
      >
        <div className="lg:col-span-5">
          <Eyebrow>{C.eyebrow}</Eyebrow>
          <h1
            id="page-title"
            className="mt-5 max-w-[16ch] text-[clamp(2.4rem,9vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[clamp(3rem,6vw,4rem)] lg:text-[clamp(3rem,4vw,4rem)]"
          >
            {C.headline}
            <span className="text-accent">?</span>
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{C.intro}</p>

          <h2 className="mt-12 text-xs font-medium uppercase tracking-[0.16em] text-subtle">{C.topicsTitle}</h2>
          <ul className="mt-4 grid gap-2">
            {C.topics.map((t) => (
              <li key={t.slug}>
                <Link
                  href={getService(t.slug).href}
                  className="group flex items-start justify-between gap-4 rounded-xl px-1 py-1.5 text-[0.9375rem] leading-relaxed text-foreground/90 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft md:text-base"
                >
                  <span className="flex gap-3">
                    <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {t.label}
                  </span>
                  <span aria-hidden className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent-soft">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[24px] border border-white/[0.08] bg-[#0a0f1a]/80 p-5 sm:p-8 lg:p-10">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-[-0.015em] text-foreground md:text-2xl">Tell us about your project</h2>
              {preview && (
                <span className="rounded-full border border-amber-300/30 bg-amber-300/[0.06] px-3 py-1 text-xs font-medium text-amber-100/90">
                  Preview only: not connected
                </span>
              )}
            </div>
            <ContactForm />
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-[-0.015em] text-foreground md:text-2xl">{C.next.title}</h2>
            {preview && (
              <p className="mt-2 text-sm leading-relaxed text-subtle">
                How enquiries will be handled once online enquiries are connected.
              </p>
            )}
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {C.next.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-3">
                  <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full border border-accent/40 font-mono text-xs text-accent-soft">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
