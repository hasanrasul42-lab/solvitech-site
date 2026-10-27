"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  INITIAL_STATE,
  INVOICE_AMOUNT,
  JOBS,
  MOVABLE_JOB,
  OVERDUE_AFTER_DAYS,
  QUOTE_ON_FILE,
  SUPPLIER_EMAIL,
  freeCount,
  techName,
  type BizState,
} from "./business";

/*
 * The two capability layers around the platform, plus the job record that
 * Custom Systems updates. Each has its own visual personality:
 *   AI         -- reading: highlights, extracted fields, a found inconsistency
 *   Automation -- executing: a visible rule and a completing action trail
 */

const reveal = (on: boolean, delay = 0): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "none" : "translateY(8px)",
  transition: "opacity 500ms ease, transform 600ms cubic-bezier(0.22,1,0.36,1)",
  transitionDelay: on ? `${delay}ms` : "0ms",
});

function LayerHeader({ icon, title, tag }: { icon: ReactNode; title: string; tag: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20 text-[#cfe0ff]">{icon}</span>
      <span className="text-[14px] font-semibold text-foreground">{title}</span>
      <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-subtle">{tag}</span>
    </div>
  );
}

const MARK_ORDER = ["invoice", "job", "amount", "delivery"];

export function AiLayer({ state }: { state: BizState }) {
  const s = state.ai;
  const diff = INVOICE_AMOUNT - QUOTE_ON_FILE;
  return (
    <div className="flex h-full flex-col">
      <LayerHeader icon={<SparkIcon />} title="AI-assisted review" tag="simulated" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* The supplier email */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0b1324] p-3.5" style={reveal(s >= 1)}>
          <p className="text-[12px] text-subtle">From {SUPPLIER_EMAIL.from}</p>
          <p className="text-[13.5px] font-medium text-foreground">{SUPPLIER_EMAIL.subject}</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-foreground/80">
            {SUPPLIER_EMAIL.body.map((seg, i) =>
              seg.mark ? (
                <mark
                  key={i}
                  className="rounded px-0.5 text-inherit"
                  style={{
                    backgroundColor: s >= 2 ? "rgb(54 123 250 / 0.24)" : "transparent",
                    color: s >= 2 ? "#e3edff" : undefined,
                    transition: "background-color 400ms ease, color 400ms ease",
                    transitionDelay: s >= 2 ? `${MARK_ORDER.indexOf(seg.mark) * 180}ms` : "0ms",
                  }}
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>
        </div>

        {/* Extracted, structured */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Job", "JOB-1042"],
            ["Invoice", `£${INVOICE_AMOUNT}`],
            ["Quote on file", `£${QUOTE_ON_FILE}`],
            ["Delivery", "Thu morning"],
          ].map(([k, v], i) => (
            <div key={k} className="rounded-lg border border-accent/20 bg-[#0f1d36] px-2.5 py-1.5" style={reveal(s >= 3, i * 110)}>
              <p className="text-[11px] text-subtle">{k}</p>
              <p className="font-mono text-[13.5px] text-[#dbe7ff]">{v}</p>
            </div>
          ))}
        </div>

        {/* The inconsistency */}
        <div
          className="flex items-center gap-2.5 rounded-lg border border-[#ff9d5c]/35 bg-[#ff9d5c]/[0.08] px-3 py-2"
          style={reveal(s >= 4)}
        >
          <span aria-hidden className="text-[#ffc08f]">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2.5 14 13.5H2L8 2.5Z" strokeLinejoin="round" />
              <path d="M8 6.5v3.2M8 11.6v.1" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-[13.5px] text-foreground">
            Invoice is <strong className="font-semibold text-[#ffc08f]">&pound;{diff} above</strong> the agreed quote.
          </p>
        </div>

        {/* Recommendation: a person decides */}
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5" style={reveal(s >= 5)}>
          <p className="text-[12px] text-subtle">Recommendation</p>
          <p className="text-[13.5px] leading-snug text-foreground">Hold payment and ask an approver to review the difference.</p>
          <p
            className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2 py-0.5 text-[11.5px] text-[#cfe0ff]"
            style={reveal(s >= 6)}
          >
            Sent for human review &rarr; Operations
          </p>
        </div>
      </div>
    </div>
  );
}

export function AutomationLayer({ state }: { state: BizState }) {
  const s = state.automation;
  const trail = [
    "Scheduled check ran at 09:30",
    "2 approvals checked · PO-318 is 3 days old",
    "Rule met for PO-318 · PO-322 (1 day) left alone",
    "Reminder sent to Dan · email (simulated)",
    "Escalated to Priya, operations manager",
    "Both actions logged to activity",
  ];
  return (
    <div className="flex h-full flex-col">
      <LayerHeader icon={<FlowIcon />} title="Automation" tag="rule" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="rounded-xl border border-white/[0.07] bg-[#0b1324] p-3.5">
          <p className="text-[13.5px] font-medium text-foreground">Approval follow-up</p>
          <dl className="mt-2 grid grid-cols-[3rem_1fr] gap-x-2 gap-y-1.5 text-[13px] leading-snug">
            <dt className="text-accent-soft">When</dt>
            <dd className="text-foreground/85">Every working day at 09:30</dd>
            <dt className="text-accent-soft">If</dt>
            <dd className="text-foreground/85">An approval waits more than {OVERDUE_AFTER_DAYS} working days</dd>
            <dt className="text-accent-soft">Then</dt>
            <dd className="text-foreground/85">Remind the approver, then escalate to the operations manager</dd>
          </dl>
        </div>
        <ol className="space-y-1.5">
          {trail.map((t, i) => {
            // Item i is automation step i + 1: running while current, done once passed.
            const done = s >= i + 2 || s >= 6;
            const running = s === i + 1 && s < 6;
            const shown = s >= i + 1;
            return (
              <li key={t} className="flex items-start gap-2.5" style={reveal(shown)}>
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] ${
                    done ? "border-accent bg-accent text-white" : "border-accent/60 text-accent-soft"
                  }`}
                >
                  {done ? "✓" : running ? <span className="ib-spin block h-2.5 w-2.5 rounded-full border-2 border-accent-soft border-t-transparent" /> : ""}
                </span>
                <span className={`text-[13px] leading-snug ${done ? "text-foreground/90" : "text-foreground"}`}>{t}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function RecordCard({ state }: { state: BizState }) {
  const before = INITIAL_STATE.jobs[MOVABLE_JOB];
  const now = state.jobs[MOVABLE_JOB];
  const job = JOBS[MOVABLE_JOB];
  const changed = now.tech !== before.tech || now.slot !== before.slot;
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-4 py-3">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-subtle">{MOVABLE_JOB}</span>
        <span className="text-[14px] font-semibold text-foreground">
          {job.title} &middot; {job.site}
        </span>
      </div>
      <dl className="grid grid-cols-[5.5rem_1fr] gap-x-2 gap-y-1 text-[13px]">
        <dt className="text-subtle">Engineer</dt>
        <dd className="text-foreground">
          {changed && <span className="text-subtle line-through">{techName(before.tech)}</span>} {techName(now.tech)}
        </dd>
        <dt className="text-subtle">Time</dt>
        <dd className="text-foreground">
          {changed && <span className="text-subtle line-through">{before.slot}:00</span>} {now.slot}:00
        </dd>
        <dt className="text-subtle">Availability</dt>
        <dd className="text-foreground/85">
          {techName(before.tech)} {freeCount(state, before.tech)} free &middot; {techName(now.tech)}{" "}
          {freeCount(state, now.tech)} free
        </dd>
      </dl>
    </div>
  );
}

const iconProps = { viewBox: "0 0 16 16", className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
function SparkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 2.2 9.3 6.7 13.8 8 9.3 9.3 8 13.8 6.7 9.3 2.2 8l4.5-1.3L8 2.2Z" strokeLinejoin="round" />
    </svg>
  );
}
function FlowIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="4" cy="4" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <path d="M5.8 4H10a2 2 0 0 1 2 2v4.2" strokeLinecap="round" />
    </svg>
  );
}
