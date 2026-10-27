"use client";

import {
  APPROVALS,
  INVOICE_AMOUNT,
  JOBS,
  MOVABLE_JOB,
  NARROW_SLOTS,
  QUOTE_ON_FILE,
  SLOTS,
  TECHS,
  freeCount,
  techName,
  validTargets,
  type BizState,
  type SlotId,
  type TechId,
} from "./business";

/*
 * The Operations platform: the anchor of the scene. One application with four
 * live areas -- overview, today's schedule, approvals & review, activity --
 * all rendered from the same engine state, so every scene's result shows up
 * here and related views always agree.
 */

const GRID = {
  wide: { name: 84, slot: 110, row: 48, head: 28 },
  narrow: { name: 70, slot: 88, row: 46, head: 26 },
};

export default function Platform({
  state,
  narrow,
  exploreSystems,
  onMove,
}: {
  state: BizState;
  narrow: boolean;
  exploreSystems: boolean;
  onMove: (tech: TechId, slot: SlotId) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20 text-[#cfe0ff]">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
            <path d="M2.5 6.5h11M6.5 6.5v7" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold text-foreground">Operations</span>
        <span className="ml-auto text-[13px] text-subtle">Tuesday &middot; today</span>
      </div>

      <div className={`flex flex-1 flex-col ${narrow ? "gap-3 px-3 py-3" : "gap-4 px-5 py-4"}`}>
        <Overview state={state} narrow={narrow} />
        <Schedule state={state} narrow={narrow} exploreSystems={exploreSystems} onMove={onMove} />
        <div className={narrow ? "grid gap-3" : "grid grid-cols-[1.1fr_1fr] gap-4"}>
          <Approvals state={state} narrow={narrow} />
          <ActivityList state={state} narrow={narrow} />
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, sub, tone, flashKey }: { label: string; value: string; sub: string; tone?: "warn" | "info"; flashKey: string }) {
  return (
    <div
      key={flashKey}
      className={`ib-flash min-w-0 rounded-xl border px-3 py-2.5 ${
        tone === "warn"
          ? "border-[#ff9d5c]/30 bg-[#ff9d5c]/[0.07]"
          : tone === "info"
            ? "border-accent/30 bg-accent/[0.08]"
            : "border-white/[0.07] bg-white/[0.025]"
      }`}
    >
      <p className="text-[12px] text-subtle">{label}</p>
      <p className="mt-0.5 text-[16px] font-semibold leading-tight text-foreground">{value}</p>
      <p className="mt-0.5 truncate text-[12px] text-muted">{sub}</p>
    </div>
  );
}

function Overview({ state, narrow }: { state: BizState; narrow: boolean }) {
  const toReview = state.review.length;
  const escalated = Object.values(state.approvals).filter((s) => s === "escalated").length;
  const pending = Object.values(state.approvals).filter((s) => s === "pending").length;
  const moved = state.movedBy !== null;
  const where = state.jobs[MOVABLE_JOB];
  return (
    <div className="grid grid-cols-3 gap-2">
      <Tile
        label={narrow ? "Review" : "Review queue"}
        value={toReview ? `${toReview} to review` : "Clear"}
        sub={toReview ? (narrow ? "Invoice" : "Invoice INV-7731") : "Nothing waiting"}
        tone={toReview ? "warn" : undefined}
        flashKey={`r${toReview}`}
      />
      <Tile
        label="Approvals"
        value={escalated ? `${escalated} escalated` : `${pending} pending`}
        sub={escalated ? (narrow ? "PO-318" : "PO-318 · to Priya") : narrow ? "Oldest 3 days" : "Oldest: 3 days"}
        tone={escalated ? "info" : undefined}
        flashKey={`a${escalated}`}
      />
      <Tile
        label={narrow ? "Jobs" : "Today’s jobs"}
        value={narrow ? "6 jobs" : "6 scheduled"}
        sub={moved ? `${narrow ? MOVABLE_JOB.slice(4) : MOVABLE_JOB} → ${where.slot}:00` : narrow ? "All assigned" : "All engineers assigned"}
        tone={moved ? "info" : undefined}
        flashKey={`j${moved}${where.tech}${where.slot}`}
      />
    </div>
  );
}

function Schedule({
  state,
  narrow,
  exploreSystems,
  onMove,
}: {
  state: BizState;
  narrow: boolean;
  exploreSystems: boolean;
  onMove: (tech: TechId, slot: SlotId) => void;
}) {
  const g = narrow ? GRID.narrow : GRID.wide;
  const slots = narrow ? NARROW_SLOTS : SLOTS;
  const width = g.name + slots.length * g.slot;
  const height = g.head + TECHS.length * g.row;
  const targets = exploreSystems
    ? validTargets(state, MOVABLE_JOB).filter((t) => slots.includes(t.slot))
    : [];
  const picked = state.systems === 1;
  const pos = (tech: TechId, slot: SlotId) => ({
    left: g.name + slots.indexOf(slot) * g.slot + 4,
    top: g.head + TECHS.findIndex((t) => t.id === tech) * g.row + 4,
  });
  const movable = state.jobs[MOVABLE_JOB];
  const movablePos = pos(movable.tech, movable.slot);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[13px] font-medium text-foreground/85">Schedule</p>
        <p className="text-[12px] text-subtle">{narrow ? "10:00–14:00" : "Engineers · free slots"}</p>
      </div>
      <div className="relative" style={{ width, height }}>
        {/* Time header */}
        {slots.map((s, i) => (
          <span
            key={s}
            className="absolute top-0 text-[12px] text-subtle"
            style={{ left: g.name + i * g.slot + 6, lineHeight: `${g.head - 6}px` }}
          >
            {s}:00
          </span>
        ))}
        {/* Rows: engineer + availability */}
        {TECHS.map((t, r) => (
          <div
            key={t.id}
            className="absolute inset-x-0 border-t border-white/[0.05]"
            style={{ top: g.head + r * g.row, height: g.row }}
          >
            <div className="flex h-full flex-col justify-center pr-2">
              <span className="text-[13px] font-medium text-foreground/90">{t.name}</span>
              <span key={freeCount(state, t.id)} className="ib-flash rounded text-[11.5px] text-subtle">
                {freeCount(state, t.id)} free
              </span>
            </div>
          </div>
        ))}
        {/* Empty slot cells */}
        {TECHS.flatMap((t) =>
          slots.map((s) => (
            <span
              key={`${t.id}${s}`}
              className="absolute rounded-lg bg-white/[0.02]"
              style={{ ...pos(t.id, s), width: g.slot - 8, height: g.row - 8 }}
            />
          )),
        )}
        {/* Visitor targets (Custom Systems exploration) */}
        {targets.map((t) => (
          <button
            key={`${t.tech}${t.slot}`}
            type="button"
            aria-label={`Move ${MOVABLE_JOB} to ${techName(t.tech)} at ${t.slot}:00`}
            onClick={() => onMove(t.tech, t.slot)}
            className="absolute z-10 rounded-lg border border-dashed border-accent/60 bg-accent/[0.06] text-[12px] text-accent-soft transition-colors hover:bg-accent/[0.16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
            style={{ ...pos(t.tech, t.slot), width: g.slot - 8, height: g.row - 8 }}
          >
            Move here
          </button>
        ))}
        {/* Jobs */}
        {Object.entries(state.jobs).map(([id, p]) => {
          const shown = slots.includes(p.slot);
          const isMovable = id === MOVABLE_JOB;
          const lit = isMovable && state.systems >= 1;
          return (
            <div
              key={id}
              className={`absolute flex flex-col justify-center rounded-lg border px-1.5 transition-[left,top,box-shadow,background-color,border-color,opacity] duration-[900ms] ease-[cubic-bezier(0.65,0,0.25,1)] ${
                lit
                  ? "z-20 border-accent/60 bg-[#1b3566] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.8),0_0_24px_-6px_rgba(54,123,250,0.6)]"
                  : "border-white/[0.08] bg-[#17233b]"
              } ${picked && isMovable ? "-translate-y-1" : ""}`}
              style={{ ...pos(p.tech, p.slot), width: g.slot - 8, height: g.row - 8, opacity: shown ? 1 : 0 }}
            >
              <span className="font-mono text-[10.5px] leading-tight text-subtle">{id}</span>
              <span className="truncate text-[12px] leading-tight text-foreground/90">{JOBS[id].title}</span>
            </div>
          );
        })}
        {/* Scripted operator pointer */}
        <span
          aria-hidden
          className="pointer-events-none absolute z-30 transition-[left,top,opacity] duration-[900ms] ease-[cubic-bezier(0.65,0,0.25,1)]"
          style={{
            left: movablePos.left + g.slot * 0.55,
            top: movablePos.top + g.row * 0.45,
            opacity: state.systems >= 1 && state.systems <= 2 && state.movedBy === "operator" ? 1 : state.systems === 1 ? 1 : 0,
          }}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            <path d="M4 2.5v13l3.6-3.4 2.4 5.4 2.2-1-2.4-5.3 5-.3L4 2.5Z" fill="#fff" stroke="#0b1220" strokeWidth="1" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function Approvals({ state, narrow }: { state: BizState; narrow: boolean }) {
  const inReview = state.review.includes("INV-7731");
  const rows = [
    ...(inReview
      ? [
          {
            id: "INV-7731",
            title: "Supplier invoice",
            status: `Review · £${INVOICE_AMOUNT - QUOTE_ON_FILE} over`,
            tone: "warn" as const,
          },
        ]
      : []),
    ...Object.values(APPROVALS).map((a) => ({
      id: a.id,
      title: a.title,
      status: state.approvals[a.id] === "escalated" ? "Escalated" : `Pending · ${a.days} day${a.days > 1 ? "s" : ""}`,
      tone: state.approvals[a.id] === "escalated" ? ("info" as const) : undefined,
    })),
  ];
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-foreground/85">Approvals &amp; review</p>
      <ul className="space-y-1">
        {rows.map((r) => (
          <li
            key={r.id + r.status}
            className={`ib-in flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${
              r.tone === "warn" ? "bg-[#ff9d5c]/[0.08]" : r.tone === "info" ? "bg-accent/[0.09]" : "bg-white/[0.02]"
            }`}
          >
            <span className="w-[4.5rem] shrink-0 font-mono text-[11.5px] text-subtle">{r.id}</span>
            {!narrow && <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground/85">{r.title}</span>}
            <span
              className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11.5px] ${
                r.tone === "warn"
                  ? "bg-[#ff9d5c]/15 text-[#ffc08f]"
                  : r.tone === "info"
                    ? "bg-accent/20 text-[#cfe0ff]"
                    : "bg-white/[0.06] text-muted"
              }`}
            >
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOURCE: Record<string, string> = { ai: "AI", automation: "Automation", systems: "Systems", team: "Team" };

function ActivityList({ state, narrow }: { state: BizState; narrow: boolean }) {
  const rows = state.activity.slice(0, narrow ? 3 : 4);
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-foreground/85">Activity</p>
      <ul className="space-y-1">
        {rows.map((a) => (
          <li key={a.time + a.text} className="ib-in flex items-baseline gap-2 px-1 py-1">
            <span className="w-10 shrink-0 font-mono text-[11px] text-subtle">{a.time}</span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground/85">{a.text}</span>
            <span
              className={`shrink-0 text-[10.5px] uppercase tracking-[0.1em] ${
                a.by === "team" ? "text-subtle" : "text-accent-soft"
              }`}
            >
              {SOURCE[a.by]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
