import Link from "next/link";
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
      data-sr-section=""
      aria-labelledby="contact-title"
      className={`relative ${anchorOffset}`}
    >
      <div aria-hidden className="sr sr-dots -z-10" />
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
          <div className="reveal rounded-[24px] border border-white/[0.09] bg-[#080d17]/[0.94] p-5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:p-8 lg:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
