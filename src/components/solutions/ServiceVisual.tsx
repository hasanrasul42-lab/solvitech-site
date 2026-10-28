import type { ReactNode } from "react";
import type { ServiceSlug } from "@/config/services";

/**
 * One explanatory illustration per service: a simple diagram or an example
 * interface. Static HTML/CSS (no images to load, no animation); the visual
 * itself is decorative and a text description is provided for assistive
 * technology. Every figure is captioned as illustrative.
 */

const panel = "rounded-2xl border border-white/[0.08] bg-[#0d1424]";
const chip = "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
const label = "text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-subtle";

const DESCRIPTIONS: Record<ServiceSlug, { caption: string; description: string }> = {
  "custom-software": {
    caption: "Illustrative interface: a job-management board for a field-service business.",
    description:
      "An example job-management screen with three columns: To schedule, Booked and Completed. Each card shows a job, a site and an assigned engineer. A side panel shows the selected job's history and customer updates.",
  },
  ai: {
    caption: "Illustrative interface: an assistant answering from approved documents, with sources and a review step.",
    description:
      "An example assistant panel. A staff question asks how many days of annual leave can be carried over. The answer cites two policy documents, and an exception request is marked as needing approval by a person.",
  },
  automation: {
    caption: "Illustrative workflow: a purchase approval with reminders, escalation and an exception path.",
    description:
      "A workflow diagram: a request is submitted, checked against rules, sent to an approver, reminded after two days and escalated after four. Approved requests update the finance system; incomplete requests go to a person to resolve.",
  },
  integrations: {
    caption: "Illustrative diagram: business systems connected through an integration layer, with one source of truth per record.",
    description:
      "A diagram with an integration layer at the centre connected to an online shop, a CRM, an accounting system and a stock system. Labels show orders, customers, invoices and stock levels flowing between them, with monitoring and error alerts.",
  },
  websites: {
    caption: "Illustrative wireframe: a booking journey annotated with the standards built into it.",
    description:
      "A simplified website layout with a clear headline, service summary and a three-step booking flow. Annotations point out fast loading, accessible structure, search-friendly headings and a booking that passes directly into the calendar system.",
  },
  "digital-growth": {
    caption: "Illustrative cycle: how visibility, behaviour and measurement feed each improvement.",
    description:
      "A cycle with five stages: Found in search, Visit, Enquire, Measure and Improve, with Improve leading back to Found in search. Examples under each stage include technical SEO, clear pages, simple forms, enquiry tracking and evidence-based changes.",
  },
};

export default function ServiceVisual({ slug }: { slug: ServiceSlug }) {
  const { caption, description } = DESCRIPTIONS[slug];
  const body: Record<ServiceSlug, ReactNode> = {
    "custom-software": <JobBoard />,
    ai: <AssistantPanel />,
    automation: <ApprovalFlow />,
    integrations: <IntegrationHub />,
    websites: <BookingWireframe />,
    "digital-growth": <GrowthCycle />,
  };
  return (
    <figure className="m-0">
      <div role="img" aria-label={description} className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0a1120] p-4 sm:p-6 md:p-8">
        <div aria-hidden>{body[slug]}</div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-subtle">{caption}</figcaption>
    </figure>
  );
}

// --- Custom software: job board --------------------------------------------------

function JobBoard() {
  const cols = [
    { name: "To schedule", jobs: [["Boiler service", "Elm Street"], ["Alarm test", "Harbour House"]] },
    { name: "Booked", jobs: [["Radiator repair", "Mill Court · Sam"], ["Gas safety check", "Quay Road · Jo"]] },
    { name: "Completed", jobs: [["Lighting fix", "Park View · Amira"]] },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_15rem]">
      <div className={`${panel} p-4`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Jobs · this week</p>
          <span className={`${chip} border-white/10 text-muted`}>5 open</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.name} className="rounded-xl bg-white/[0.025] p-2.5">
              <p className={label}>{c.name}</p>
              <div className="mt-2 grid gap-2">
                {c.jobs.map(([t, s], i) => (
                  <div
                    key={t}
                    className={`rounded-lg border p-2.5 ${c.name === "Booked" && i === 0 ? "border-accent/60 bg-accent/10" : "border-white/[0.07] bg-[#0f1729]"}`}
                  >
                    <p className="text-sm font-medium text-foreground">{t}</p>
                    <p className="mt-0.5 text-xs text-muted">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${panel} p-4`}>
        <p className={label}>Selected job</p>
        <p className="mt-2 text-sm font-semibold text-foreground">Radiator repair · Mill Court</p>
        <ul className="mt-3 grid gap-2 text-xs text-muted">
          <li className="flex justify-between gap-2"><span>Booked for Thu 10:00</span><span className="text-subtle">09:12</span></li>
          <li className="flex justify-between gap-2"><span>Assigned to Sam</span><span className="text-subtle">09:12</span></li>
          <li className="flex justify-between gap-2"><span className="text-accent-soft">Customer notified</span><span className="text-subtle">09:13</span></li>
        </ul>
      </div>
    </div>
  );
}

// --- AI: assistant with sources and review ------------------------------------------

function AssistantPanel() {
  return (
    <div className="mx-auto grid max-w-[40rem] gap-3">
      <div className={`${panel} ml-auto max-w-[85%] p-3.5`}>
        <p className="text-sm text-foreground">How many days of annual leave can I carry over into next year?</p>
      </div>
      <div className={`${panel} max-w-[92%] p-4`}>
        <p className="flex items-center gap-2 text-xs font-medium text-accent-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Policy assistant
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          Up to 5 days can be carried over, and they must be used by the end of March. Carrying over more needs your
          manager&rsquo;s approval.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`${chip} border-white/10 text-muted`}>Source: Annual Leave Policy §4.2</span>
          <span className={`${chip} border-white/10 text-muted`}>Source: HR FAQ</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-3">
        <span className={`${chip} border-amber-300/30 text-amber-100/90`}>Needs approval</span>
        <span className="text-xs text-muted">Request to carry over 8 days, routed to a manager</span>
      </div>
    </div>
  );
}

// --- Automation: approval flow -----------------------------------------------------

function ApprovalFlow() {
  const steps = [
    { name: "Request submitted", note: "Form with item, cost, reason" },
    { name: "Rules checked", note: "Route by value and department" },
    { name: "Approver notified", note: "Reminder after 2 days" },
    { name: "Approved", note: "Finance system updated" },
  ];
  return (
    <div>
      <ol className="grid gap-3 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.name} className={`${panel} relative p-4`}>
            <span className="font-mono text-xs text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-1.5 text-sm font-semibold text-foreground">{s.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.note}</p>
            {i < steps.length - 1 && (
              <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-subtle md:block">→</span>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
          <p className={label}>If no decision after 4 days</p>
          <p className="mt-1.5 text-sm text-foreground">Escalated to the department head</p>
        </div>
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-3.5">
          <p className={label}>Exception</p>
          <p className="mt-1.5 text-sm text-foreground">Missing cost code: sent to a person to resolve</p>
        </div>
      </div>
    </div>
  );
}

// --- Integrations: hub ---------------------------------------------------------------

function IntegrationHub() {
  const systems = [
    { name: "Online shop", flow: "Orders →", pos: "md:col-start-1 md:row-start-1" },
    { name: "CRM", flow: "↔ Customers", pos: "md:col-start-3 md:row-start-1" },
    { name: "Accounting", flow: "← Invoices", pos: "md:col-start-1 md:row-start-3" },
    { name: "Stock system", flow: "↔ Stock levels", pos: "md:col-start-3 md:row-start-3" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:grid-rows-[auto_auto_auto] md:items-center">
      {systems.map((s) => (
        <div key={s.name} className={`${panel} p-4 ${s.pos}`}>
          <p className="text-sm font-semibold text-foreground">{s.name}</p>
          <p className="mt-1 text-xs text-muted">{s.flow}</p>
        </div>
      ))}
      <div className="rounded-2xl border border-accent/50 bg-accent/10 p-5 text-center md:col-start-2 md:row-start-2 md:mx-6">
        <p className="text-sm font-semibold text-foreground">Integration layer</p>
        <p className="mt-1 text-xs text-muted">Mapping · matching · retries</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Monitoring &amp; alerts
        </p>
      </div>
    </div>
  );
}

// --- Websites: annotated wireframe -----------------------------------------------------

function BookingWireframe() {
  const notes = ["Loads fast on mobile", "Accessible headings & contrast", "Search-friendly structure", "Booking goes straight to the calendar"];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_14rem] lg:items-center">
      <div className={`${panel} overflow-hidden`}>
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-3 h-4 flex-1 rounded bg-white/[0.04]" />
        </div>
        <div className="p-5">
          <div className="h-3 w-2/3 rounded bg-white/25" />
          <div className="mt-2 h-2 w-5/6 rounded bg-white/10" />
          <div className="mt-1.5 h-2 w-3/5 rounded bg-white/10" />
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {["Choose service", "Pick a time", "Your details"].map((s, i) => (
              <div key={s} className={`rounded-lg border p-3 ${i === 1 ? "border-accent/60 bg-accent/10" : "border-white/[0.07]"}`}>
                <p className="font-mono text-[0.6875rem] text-accent-soft">Step {i + 1}</p>
                <p className="mt-1 text-sm text-foreground">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {["09:00", "09:30", "10:00", "11:00", "13:30", "15:00"].map((t, i) => (
              <span key={t} className={`rounded-md border px-2 py-1.5 text-center text-xs ${i === 2 ? "border-accent bg-accent/20 text-foreground" : "border-white/[0.07] text-muted"}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ul className="grid gap-2">
        {notes.map((n) => (
          <li key={n} className="flex items-start gap-2 text-sm text-muted">
            <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Digital growth: improvement cycle ---------------------------------------------------

function GrowthCycle() {
  const stages = [
    { name: "Found in search", note: "Technical SEO, local listings" },
    { name: "Visit", note: "Pages that answer the question" },
    { name: "Enquire", note: "Clear calls to action, simple forms" },
    { name: "Measure", note: "Enquiries tracked by source" },
    { name: "Improve", note: "Changes based on evidence" },
  ];
  return (
    <div>
      <ol className="grid gap-3 sm:grid-cols-5">
        {stages.map((s, i) => (
          <li key={s.name} className={`${panel} p-4 ${i === 3 ? "border-accent/50" : ""}`}>
            <span className="font-mono text-xs text-accent-soft">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-1.5 text-sm font-semibold text-foreground">{s.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.note}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-center gap-2 text-xs text-subtle">
        <span className="h-px flex-1 bg-white/10" /> Improve feeds back into visibility <span className="h-px flex-1 bg-white/10" />
      </p>
    </div>
  );
}
