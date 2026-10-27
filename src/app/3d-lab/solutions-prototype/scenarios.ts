/**
 * Predefined scenarios for the Solutions prototype. Everything the demo shows
 * is derived from these objects and runs locally: no network, no live AI, no
 * real customer data. The "AI triage" is a scripted simulation.
 */

export type ScenarioId = "urgent" | "routine" | "reschedule";
export type Priority = "urgent" | "routine" | "change";

export interface JobRow {
  id: string;
  title: string;
  priority: Priority;
  status: string;
}

export interface Scenario {
  id: ScenarioId;
  /** Option label. */
  label: string;
  request: { from: string; text: string };
  triage: { type: string; priority: Priority; priorityLabel: string; action: string };
  /** A new job, or an update to an existing one. */
  record: { kind: "create"; row: JobRow } | { kind: "update"; id: string; status: string };
  notify: { team: string; text: string };
  /** Plain-language result of each step, for the progress list and screen readers. */
  stepResults: [string, string, string, string, string];
  outcome: string;
}

export const EXISTING_JOBS: JobRow[] = [
  { id: "#2049", title: "Gutter clearing", priority: "routine", status: "Mon 09:00" },
  { id: "#2047", title: "Boiler service", priority: "routine", status: "Tue 10:00" },
  { id: "#2044", title: "Door lock repair", priority: "routine", status: "Completed" },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "urgent",
    label: "Urgent maintenance request",
    request: { from: "Tenant · Flat 12", text: "Water is leaking through the kitchen ceiling and it's getting worse." },
    triage: {
      type: "Plumbing · Leak",
      priority: "urgent",
      priorityLabel: "Urgent",
      action: "Create an emergency job",
    },
    record: {
      kind: "create",
      row: { id: "#2051", title: "Kitchen ceiling leak", priority: "urgent", status: "Within 2 hours" },
    },
    notify: { team: "On-call plumbing", text: "Urgent leak at Flat 12 · attend within 2 hours" },
    stepResults: [
      "Leak reported from Flat 12.",
      "Recognised as a plumbing leak.",
      "Marked urgent: active water damage.",
      "Emergency job #2051 created.",
      "On-call plumbing team alerted.",
    ],
    outcome: "An urgent job exists and the on-call team knows within seconds; nothing waits in an inbox.",
  },
  {
    id: "routine",
    label: "Routine maintenance request",
    request: { from: "Tenant · Flat 4", text: "The bathroom extractor fan has stopped working." },
    triage: {
      type: "Electrical · Ventilation",
      priority: "routine",
      priorityLabel: "Routine",
      action: "Add to next week's schedule",
    },
    record: {
      kind: "create",
      row: { id: "#2052", title: "Extractor fan repair", priority: "routine", status: "Next week" },
    },
    notify: { team: "Maintenance scheduling", text: "New routine job #2052 added to next week" },
    stepResults: [
      "Fault reported from Flat 4.",
      "Recognised as an electrical repair.",
      "Marked routine: no urgency.",
      "Job #2052 created and scheduled.",
      "Scheduling team informed.",
    ],
    outcome: "The repair is logged and scheduled at the right priority, without anyone re-typing it.",
  },
  {
    id: "reschedule",
    label: "Appointment change",
    request: { from: "Customer · Job #2047", text: "Could the engineer come Thursday afternoon instead of Tuesday?" },
    triage: {
      type: "Appointment · Reschedule",
      priority: "change",
      priorityLabel: "Change",
      action: "Move booking to Thu 14:00",
    },
    record: { kind: "update", id: "#2047", status: "Thu 14:00" },
    notify: { team: "Scheduling", text: "Booking #2047 moved to Thursday 14:00" },
    stepResults: [
      "Change requested for job #2047.",
      "Recognised as a reschedule.",
      "New slot found: Thursday 14:00.",
      "Booking #2047 updated.",
      "Scheduling team and engineer informed.",
    ],
    outcome: "The booking moves to a free slot and everyone involved is updated, with no phone tag.",
  },
];

export const STEPS = ["Request received", "Understood", "Priority set", "Record updated", "Team notified"] as const;

/** How the demo maps onto a real engagement (answers "could you build this for me?"). */
export const APPLIES = [
  {
    name: "Build",
    text: "The service desk itself: software shaped around how your team takes, plans and tracks work.",
  },
  {
    name: "Automate",
    text: "Reading and prioritising requests by your rules, with a person reviewing anything uncertain.",
  },
  {
    name: "Connect",
    text: "Linking your inbox, records, calendar and team messaging so updates happen once, everywhere.",
  },
];
