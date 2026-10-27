/**
 * "Inside an Intelligent Business" -- the shared business model and its
 * deterministic engine.
 *
 * A fictional field-service operations company (illustrative only, sample
 * data). Three unrelated events happen inside one operating environment:
 *   AI         understands a supplier email and flags an invoice for review
 *   Automation executes an approval follow-up rule (remind, then escalate)
 *   Systems    an operator reschedules a job; related views stay in sync
 *
 * Everything is a pure reducer over predefined data: the same events always
 * produce the same records. No AI model, network, storage or real messages.
 */

export type SceneId = "ai" | "automation" | "systems";
export type TechId = "amira" | "sam" | "jo";
export type SlotId = "08" | "10" | "12" | "14" | "16";
export type ApprovalStatus = "pending" | "escalated";

export const TECHS: { id: TechId; name: string; skill: string; gas: boolean }[] = [
  { id: "amira", name: "Amira", skill: "Electrical", gas: false },
  { id: "sam", name: "Sam", skill: "Gas & heating", gas: true },
  { id: "jo", name: "Jo", skill: "Gas & heating", gas: true },
];
export const SLOTS: SlotId[] = ["08", "10", "12", "14", "16"];
/** Slots shown on the narrow (phone) schedule; includes both ends of the scripted move. */
export const NARROW_SLOTS: SlotId[] = ["10", "12", "14"];

export interface Job {
  id: string;
  title: string;
  site: string;
  needsGas: boolean;
}
export const JOBS: Record<string, Job> = {
  "JOB-1048": { id: "JOB-1048", title: "Alarm test", site: "Harbour House", needsGas: false },
  "JOB-1053": { id: "JOB-1053", title: "Lighting fix", site: "Park View", needsGas: false },
  "JOB-1051": { id: "JOB-1051", title: "Boiler service", site: "Elm Street", needsGas: true },
  "JOB-1049": { id: "JOB-1049", title: "Radiator fix", site: "Mill Court", needsGas: true },
  "JOB-1055": { id: "JOB-1055", title: "Gas check", site: "Quay Road", needsGas: true },
  "JOB-1056": { id: "JOB-1056", title: "Heater check", site: "Lime Grove", needsGas: true },
};
/** The job the Custom Systems demonstration (and the visitor) can move. */
export const MOVABLE_JOB = "JOB-1051";

export const APPROVALS: Record<string, { id: string; title: string; approver: string; days: number }> = {
  "PO-318": { id: "PO-318", title: "Access equipment", approver: "Dan", days: 3 },
  "PO-322": { id: "PO-322", title: "Filters", approver: "Dan", days: 1 },
};
/** Automation rule: pending longer than this many working days is overdue. */
export const OVERDUE_AFTER_DAYS = 2;

/** The supplier email the AI scene reads (sample data). */
export const SUPPLIER_EMAIL = {
  from: "Coolflow Supplies",
  subject: "Invoice INV-7731 · JOB-1042",
  /** Body as segments; `mark` segments are the details the AI picks out. */
  body: [
    { text: "Please find invoice " },
    { text: "INV-7731", mark: "invoice" },
    { text: " for the compressor unit on " },
    { text: "JOB-1042", mark: "job" },
    { text: ". Total " },
    { text: "£490", mark: "amount" },
    { text: " including delivery. We can deliver " },
    { text: "Thursday morning", mark: "delivery" },
    { text: "." },
  ] as { text: string; mark?: string }[],
};
export const QUOTE_ON_FILE = 420;
export const INVOICE_AMOUNT = 490;

export interface Activity {
  time: string;
  text: string;
  by: SceneId | "team";
}

export interface BizState {
  /** Narrative focus (drives the camera). */
  scene: "intro" | SceneId | "overview";
  /** AI: 0 idle, 1 email, 2 highlighted, 3 extracted, 4 discrepancy, 5 recommendation, 6 sent to review. */
  ai: number;
  /** Automation: 0 idle, 1 check running, 2 overdue found, 3 rule met, 4 reminder sent, 5 escalated, 6 logged. */
  automation: number;
  /** Systems: 0 idle, 1 job picked up, 2 moved, 3 availability updated, 4 record updated. */
  systems: number;
  jobs: Record<string, { tech: TechId; slot: SlotId }>;
  approvals: Record<string, ApprovalStatus>;
  review: string[];
  activity: Activity[];
  /** How the movable job got to its slot: by the scripted operator or by the visitor. */
  movedBy: "operator" | "you" | null;
  done: boolean;
}

export const INITIAL_STATE: BizState = {
  scene: "intro",
  ai: 0,
  automation: 0,
  systems: 0,
  jobs: {
    "JOB-1048": { tech: "amira", slot: "08" },
    "JOB-1053": { tech: "amira", slot: "12" },
    "JOB-1051": { tech: "sam", slot: "10" },
    "JOB-1049": { tech: "sam", slot: "14" },
    "JOB-1055": { tech: "jo", slot: "08" },
    "JOB-1056": { tech: "jo", slot: "12" },
  },
  approvals: { "PO-318": "pending", "PO-322": "pending" },
  review: [],
  activity: [
    { time: "08:55", text: "JOB-1055 completed · Jo", by: "team" },
    { time: "08:41", text: "JOB-1048 started · Amira", by: "team" },
  ],
  movedBy: null,
  done: false,
};

export type BizAction =
  | { type: "scene"; scene: BizState["scene"] }
  | { type: "ai"; step: number }
  | { type: "automation"; step: number }
  | { type: "systems"; step: number }
  | { type: "approval"; id: string; status: ApprovalStatus }
  | { type: "review"; id: string }
  | { type: "move"; job: string; tech: TechId; slot: SlotId; by: "operator" | "you" }
  | { type: "log"; entry: Activity }
  | { type: "done" };

export function bizReducer(state: BizState, a: BizAction): BizState {
  switch (a.type) {
    case "scene":
      return { ...state, scene: a.scene };
    case "ai":
      return { ...state, ai: a.step };
    case "automation":
      return { ...state, automation: a.step };
    case "systems":
      return { ...state, systems: a.step };
    case "approval":
      return { ...state, approvals: { ...state.approvals, [a.id]: a.status } };
    case "review":
      return state.review.includes(a.id) ? state : { ...state, review: [a.id, ...state.review] };
    case "move":
      if (!isFree(state, a.tech, a.slot, a.job)) return state;
      return { ...state, jobs: { ...state.jobs, [a.job]: { tech: a.tech, slot: a.slot } }, movedBy: a.by };
    case "log":
      return { ...state, activity: [a.entry, ...state.activity] };
    case "done":
      return { ...state, done: true, scene: "overview" };
  }
}

export function isFree(state: BizState, tech: TechId, slot: SlotId, except?: string) {
  return !Object.entries(state.jobs).some(([id, p]) => id !== except && p.tech === tech && p.slot === slot);
}

/** Free slots a job may move to (qualified engineers only). */
export function validTargets(state: BizState, job: string) {
  const needsGas = JOBS[job].needsGas;
  const here = state.jobs[job];
  return TECHS.filter((t) => !needsGas || t.gas).flatMap((t) =>
    SLOTS.filter((s) => !(t.id === here.tech && s === here.slot) && isFree(state, t.id, s, job)).map((s) => ({
      tech: t.id,
      slot: s,
    })),
  );
}

export const techName = (id: TechId) => TECHS.find((t) => t.id === id)!.name;
export const freeCount = (state: BizState, tech: TechId) => SLOTS.filter((s) => isFree(state, tech, s)).length;

/**
 * The automatic presentation: [time in ms, action]. Scenes are independent
 * business events that all land in the shared platform.
 */
export const TIMELINE: [number, BizAction][] = [
  // AI -- understanding a supplier email.
  [700, { type: "scene", scene: "ai" }],
  [1100, { type: "ai", step: 1 }],
  [2000, { type: "ai", step: 2 }],
  [3000, { type: "ai", step: 3 }],
  [3900, { type: "ai", step: 4 }],
  [4800, { type: "ai", step: 5 }],
  [5600, { type: "ai", step: 6 }],
  [5600, { type: "review", id: "INV-7731" }],
  [5600, { type: "log", entry: { time: "09:02", text: "INV-7731 flagged · £70 over quote", by: "ai" } }],
  // Automation -- approval follow-up rule.
  [6600, { type: "scene", scene: "automation" }],
  [7000, { type: "automation", step: 1 }],
  [7800, { type: "automation", step: 2 }],
  [8500, { type: "automation", step: 3 }],
  [9200, { type: "automation", step: 4 }],
  [9200, { type: "log", entry: { time: "09:30", text: "Reminder sent to Dan · PO-318", by: "automation" } }],
  [9900, { type: "automation", step: 5 }],
  [9900, { type: "approval", id: "PO-318", status: "escalated" }],
  [9900, { type: "log", entry: { time: "09:30", text: "PO-318 escalated to Priya", by: "automation" } }],
  [10500, { type: "automation", step: 6 }],
  // Custom systems -- an operator reschedules a job.
  [11300, { type: "scene", scene: "systems" }],
  [11700, { type: "systems", step: 1 }],
  [12500, { type: "move", job: MOVABLE_JOB, tech: "jo", slot: "14", by: "operator" }],
  [12500, { type: "systems", step: 2 }],
  [13300, { type: "systems", step: 3 }],
  [13900, { type: "systems", step: 4 }],
  [13900, { type: "log", entry: { time: "09:41", text: "JOB-1051 moved to 14:00 · Jo", by: "systems" } }],
  // Everything settles into the combined overview.
  [15200, { type: "done" }],
];

export const SCENE_START: Record<SceneId, number> = {
  ai: TIMELINE.findIndex(([, a]) => a.type === "scene" && a.scene === "ai"),
  automation: TIMELINE.findIndex(([, a]) => a.type === "scene" && a.scene === "automation"),
  systems: TIMELINE.findIndex(([, a]) => a.type === "scene" && a.scene === "systems"),
};

/** State after applying the first `n` timeline events (for jumps and reduced motion). */
export function stateAt(n: number, from: BizState = INITIAL_STATE) {
  return TIMELINE.slice(0, n).reduce((s, [, a]) => bizReducer(s, a), from);
}
export const FINAL_STATE = stateAt(TIMELINE.length);

export const CAPABILITIES: { id: SceneId; name: string; line: string; verb: string; result: string }[] = [
  {
    id: "ai",
    name: "AI & Intelligence",
    line: "Understand information and support better decisions.",
    verb: "AI understands",
    result: "Read a supplier invoice and flagged a £70 overcharge for review.",
  },
  {
    id: "automation",
    name: "Automation",
    line: "Coordinate work and execute repeatable processes.",
    verb: "Automation executes",
    result: "Found an overdue approval, sent a reminder and escalated it.",
  },
  {
    id: "systems",
    name: "Custom Systems",
    line: "Build the software your business actually needs.",
    verb: "Custom software manages",
    result: "Rescheduled a job; schedule, availability and records stayed in sync.",
  },
];
