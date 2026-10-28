"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CONTACT, ENQUIRY_INTERESTS } from "@/config/home";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Enquiry form: name, reply email, optional service interest and a short
 * message (Master Blueprint V1.4: keep the first step short). Used on the
 * homepage and /contact. Delivery depends on configuration (src/config/home.ts):
 *   CONTACT.email set -> opens the visitor's email app with the enquiry
 *                        filled in, ready for them to send;
 *   nothing set       -> preview only: the enquiry is checked and prepared,
 *                        then the form says plainly that it was not sent.
 * There is never a success message for something that did not happen.
 */
export default function ContactForm() {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [errors, setErrors] = useState<Errors>({});
  const [prepared, setPrepared] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const delivery = CONTACT.email ? "email" : "preview";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};
    if (!value("name")) next.name = "Please enter your name.";
    if (!value("email")) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(value("email"))) next.email = "Please enter a valid email address, like name@company.com.";
    if (value("message").length < 20) next.message = "Please describe what you have in mind in a sentence or two.";
    setErrors(next);
    const first = (["name", "email", "message"] as Field[]).find((f) => next[f]);
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = [
      value("message"),
      "",
      value("interest") ? `Interested in: ${value("interest")}` : null,
      `Name: ${value("name")}`,
      `Reply to: ${value("email")}`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    if (delivery === "email") {
      const subject = `Project enquiry from ${value("name")}`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    setPrepared(body);
    setCopied(false);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const copy = async () => {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // The form stays mounted (hidden) while the result shows, so "Edit enquiry"
  // returns to exactly what the visitor typed.
  const result = prepared && (
    <div ref={resultRef} tabIndex={-1} role="status" className="rounded-[20px] border border-white/[0.1] bg-[#0b1220] p-6 outline-none sm:p-8">
      {delivery === "email" ? (
        <>
          <p className="text-xl font-semibold tracking-[-0.015em] text-foreground">Your email app should now be open</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
            Your enquiry is filled in and ready to send from there. It has not been sent yet. If no email window
            appeared, copy the text below into an email to {CONTACT.email}.
          </p>
        </>
      ) : (
        <>
          <p className="text-xl font-semibold tracking-[-0.015em] text-foreground">Not sent: online enquiries aren&rsquo;t connected yet</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
            This is a preview of the website, so your enquiry has not been sent or stored anywhere. You can copy the
            text below to keep it; copying does not send it.
          </p>
        </>
      )}
      <pre className="mt-5 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-black/20 p-4 font-sans text-sm leading-relaxed text-foreground/85">
        {prepared}
      </pre>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={copy} className={secondaryBtn}>
          {copied ? "Copied (not sent)" : "Copy text (does not send)"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPrepared(null);
            requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("input, textarea")?.focus());
          }}
          className={secondaryBtn}
        >
          Edit enquiry
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? "Enquiry text copied to the clipboard. It has not been sent." : ""}
      </p>
    </div>
  );

  return (
    <>
      {result}
      <form ref={formRef} hidden={!!prepared} noValidate onSubmit={submit} className="grid gap-5" aria-describedby={delivery === "preview" ? id("notice") : undefined}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id={id("name")} name="name" label="Your name" autoComplete="name" error={errors.name} />
          <TextField id={id("email")} name="email" type="email" label="Reply email" autoComplete="email" error={errors.email} />
        </div>

        <div>
          <label htmlFor={id("interest")} className="text-sm font-medium text-foreground">
            What is it about? <span className="font-normal text-subtle">(optional)</span>
          </label>
          <div className="relative mt-2">
            <select id={id("interest")} name="interest" defaultValue="" className={`${inputClass} appearance-none pr-11`}>
              <option value="">Choose a service, if you know</option>
              {ENQUIRY_INTERESTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor={id("message")} className="text-sm font-medium text-foreground">
            What would you like to improve, automate, connect or build?
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? id("message-error") : undefined}
            placeholder="For example: we re-type every order from email into two separate systems, and it takes hours each week."
            className={`${inputClass} mt-2 min-h-[8.5rem] resize-y`}
          />
          {errors.message && <FieldError id={id("message-error")}>{errors.message}</FieldError>}
        </div>

        {delivery === "preview" && (
          <p id={id("notice")} className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-sm leading-relaxed text-amber-100/90">
            Preview: online enquiries are not connected yet, so this form does not send or store anything.
          </p>
        )}

        <div>
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[0.9375rem] font-medium text-background transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-soft">
            {delivery === "email" ? "Write the email" : "Prepare enquiry"}
            <span aria-hidden>→</span>
          </button>
        </div>
      </form>
    </>
  );
}

const inputClass =
  "block w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-base text-foreground placeholder:text-subtle/80 transition-colors hover:border-white/25 focus:border-accent-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft/40 aria-[invalid=true]:border-red-400/70";

const secondaryBtn =
  "inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-medium text-foreground transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft";

function TextField({
  id,
  name,
  label,
  type = "text",
  optional = false,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} {optional && <span className="font-normal text-subtle">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} mt-2`}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-2 text-sm text-red-300">
      {children}
    </p>
  );
}
