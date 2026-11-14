import Link from "next/link";
import "./chapters.css";
import { CONTACT } from "@/config/home";
import ContactForm from "./ContactForm";
import { Eyebrow, SectionTitle, anchorOffset, gutter, textLink } from "./Section";

/**
 * Chapter 07 -- Start a Conversation. The homepage close: an invitation on the
 * left, the enquiry form on the right. Copy and delivery: src/config/home.ts.
 */
export default function HomeContact() {
  return (
    <section
      id="contact"
      data-chapter="contact"
      aria-labelledby="contact-title"
      className={`relative ${anchorOffset}`}
    >
      <div className={`mx-auto grid w-full max-w-[1440px] gap-12 py-20 md:py-24 lg:grid-cols-12 lg:gap-16 lg:py-32 ${gutter}`}>
        <div className="lg:col-span-5">
          <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
          <SectionTitle id="contact" className="max-w-[14ch]">
            {CONTACT.title}
          </SectionTitle>
          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted md:text-lg">{CONTACT.intro}</p>
          <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-subtle">What to expect</p>
          <ul className="mt-4 grid gap-3">
            {CONTACT.expectations.map((e) => (
              <li key={e} className="flex gap-3 text-[0.9375rem] leading-relaxed text-foreground/85 md:text-base">
                <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {e}
              </li>
            ))}
          </ul>
          {CONTACT.page && (
            <Link href={CONTACT.page} className={`mt-8 ${textLink}`}>
              Open the Start a Project page
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>

        <div className="relative lg:col-span-7">
          {/* Background (option A): light behind the form; fine lines end at its frame. */}
          <div aria-hidden className="bga bga-form-light" />
          <svg aria-hidden className="bga bga-lines-right max-lg:hidden" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <path d="M100 -12 C55 -12 35 30 0 30" stroke="rgb(150 180 230 / 0.16)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M100 14 C55 14 35 40 0 40" stroke="rgb(150 180 230 / 0.22)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M100 50 C55 50 35 50 0 50" stroke="rgb(110 160 255 / 0.42)" strokeWidth="1.25" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M100 86 C55 86 35 60 0 60" stroke="rgb(150 180 230 / 0.16)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M100 112 C55 112 35 70 0 70" stroke="rgb(150 180 230 / 0.16)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg aria-hidden className="bga bga-lines-top max-lg:hidden" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            <path d="M18 0 C18 55 40 45 40 100" stroke="rgb(150 180 230 / 0.16)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M55 0 C55 55 55 45 55 100" stroke="rgb(110 160 255 / 0.45)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M92 0 C92 55 70 45 70 100" stroke="rgb(150 180 230 / 0.16)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="reveal rounded-[24px] border border-white/[0.09] bg-[#080d17]/[0.94] p-5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:p-8 lg:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
