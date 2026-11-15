import type { ReactNode } from "react";
import Stage, { Layer } from "./Stage";

/**
 * Service visuals for AI, Automation and Custom Software & Integrations
 * (Websites lives in WebsiteVisual.tsx: it has its own view toggle).
 *
 * Each is a still, readable composition of recognisable product surfaces with
 * illustrative sample data, and one meaningful emphasis on hover / focus /
 * in view (Stage.tsx). No simulations or sequences: the homepage introduces,
 * the service pages explain.
 *
 * All sizes are em on the 60 x 42 em canvas (directory.css).
 */

const dot = "inline-block h-[0.55em] w-[0.55em] rounded-full";
const bar = "flex items-center gap-[0.45em] border-b border-white/[0.07] px-[1.1em] text-[1.05em]";

function WindowBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className={`${bar} h-[2.9em]`}>
      <span className={`${dot} bg-white/15`} />
      <span className={`${dot} bg-white/15`} />
      <span className={`${dot} bg-white/15`} />
      <span className="ml-[0.8em] font-medium text-white/80">{title}</span>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

const pill = "rounded-full border border-white/10 bg-white/[0.04] px-[0.75em] py-[0.15em] text-[0.82em] text-white/55";

// --- AI & Intelligent Solutions ------------------------------------------------------

const MONTHS = [62, 66, 70, 52, 47, 50, 68, 72, 74, 78, 76, 82];
const DIP = new Set([3, 4, 5]);

export function AiVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[9, -13]} className="acc-ai">
      {/* The application */}
      <Layer x={1} y={3} w={41} h={33} slab>
        <WindowBar title="Operations review" right={<span className={pill}>Sample data</span>} />
        <div className="flex h-[calc(100%-2.9em)]">
          <nav className="w-[8.6em] shrink-0 border-r border-white/[0.07] px-[0.9em] py-[1.1em] text-[1em] text-white/45">
            <p className="mb-[1em] text-[0.8em] uppercase tracking-[0.18em] text-white/30">Insight</p>
            {["Overview", "Sales", "Orders", "Customers", "Reports"].map((n, i) => (
              <p
                key={n}
                className={`mb-[0.35em] rounded-[0.4em] px-[0.6em] py-[0.35em] ${i === 0 ? "bg-white/[0.07] text-white/85" : ""}`}
              >
                {n}
              </p>
            ))}
          </nav>
          <div className="min-w-0 flex-1 p-[1.2em]">
            <div className="grid grid-cols-3 gap-[0.8em]">
              {[
                ["Orders", "1,284"],
                ["Avg. order", "£86"],
                ["Repeat rate", "41%"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[0.6em] border border-white/[0.07] bg-white/[0.025] px-[0.8em] py-[0.6em]">
                  <p className="text-[0.85em] text-white/45">{k}</p>
                  <p className="mt-[0.1em] text-[1.6em] font-semibold tracking-[-0.02em] text-white/90">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-[1em] rounded-[0.6em] border border-white/[0.07] bg-white/[0.02] p-[0.8em]">
              <p className="text-[0.85em] text-white/45">Trade repeat orders · last 12 months</p>
              <svg viewBox="0 0 240 70" className="mt-[0.5em] block h-[7.2em] w-full" preserveAspectRatio="none">
                {MONTHS.map((v, i) => (
                  <rect
                    key={i}
                    x={i * 20 + 4}
                    y={70 - v * 0.8}
                    width="12"
                    height={v * 0.8}
                    rx="2"
                    className={DIP.has(i) ? "ai-dip" : undefined}
                    fill={DIP.has(i) ? undefined : "rgb(255 255 255 / 0.12)"}
                  />
                ))}
              </svg>
            </div>
            <div className="mt-[0.9em] grid gap-[0.35em] text-[0.95em]">
              {[
                ["Trade accounts", "−18%", "text-[#ff9a8a]"],
                ["Retail", "+6%", "text-[#7fe0b8]"],
                ["Online", "+11%", "text-[#7fe0b8]"],
              ].map(([k, v, c]) => (
                <div key={k} className="flex justify-between border-b border-white/[0.06] pb-[0.3em] text-white/60">
                  <span>{k}</span>
                  <span className={c}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layer>

      {/* What the finding refers to. */}
      <Layer x={0} y={0} w={60} h={42} z={2.5}>
        <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible">
          <path
            d="M22.4 19.6 C 25 19.6, 26.5 22.5, 29.5 22.5"
            pathLength={1}
            fill="none"
            stroke="rgb(var(--acc))"
            strokeWidth="0.14"
            className="on-draw"
          />
          <circle cx="22.4" cy="19.6" r="0.35" fill="rgb(var(--acc))" className="on-show" />
        </svg>
      </Layer>

      {/* The finding: the focus of the composition. */}
      <Layer x={29.5} y={15} w={28.5} h={17.5} z={5} lift={3} slab className="s3d-key" faceClassName="!bg-[linear-gradient(160deg,#16223a,#0e1628)]">
        <div className="flex h-full flex-col p-[1.3em]">
          <p className="flex items-center gap-[0.5em] text-[0.85em] font-medium uppercase tracking-[0.16em] acc-text">
            <span className="h-[0.5em] w-[0.5em] rounded-full acc-bg" />
            Finding
          </p>
          <p className="mt-[0.6em] text-[1.6em] font-semibold leading-[1.18] tracking-[-0.02em] text-white">
            Trade repeat orders fell after the March price change
          </p>
          <p className="mt-[0.6em] text-[1.02em] leading-[1.45] text-white/60">
            42 trade accounts haven’t reordered since. Reviewing their pricing is the clearest route to recovering them.
          </p>
          <div className="mt-auto flex items-center justify-between pt-[0.8em]">
            <span className="text-[0.85em] text-white/40">Orders · CRM · price list</span>
            <span className="rounded-full px-[0.9em] py-[0.3em] text-[0.9em] font-medium text-white acc-bg">Review accounts</span>
          </div>
        </div>
      </Layer>

      {/* Supporting context, nearest the viewer. */}
      <Layer x={37} y={8.6} w={19} h={4.3} z={8} lift={4} slab style={{ ["--r" as string]: "2.2em" }}>
        <div className="flex h-full items-center gap-[0.6em] px-[1.1em] text-[0.95em] text-white/70">
          <span className="grid h-[1.4em] w-[1.4em] place-items-center rounded-full text-[0.8em] text-white acc-bg">✓</span>
          14 months of orders analysed
        </div>
      </Layer>
    </Stage>
  );
}

// --- Business Automation -------------------------------------------------------------------

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
/** [day, start hour index, length in hours, label] */
const BOOKED: [number, number, number, string][] = [
  [0, 0, 2, "Survey · Mill Lane"],
  [0, 5, 1.5, "Repair"],
  [1, 1, 2, "Install · Unit 4"],
  [1, 6, 1.5, "Quote visit"],
  [2, 0, 1, "Callback"],
  [2, 4, 2.5, "Repair · Station Rd"],
  [3, 0, 1.5, "Quote visit"],
  [3, 5, 2, "Service · Oak Ave"],
  [4, 1, 2, "Service · Hill St"],
  [4, 4, 1, "Survey"],
];
const COL = 7.3;
const ROW = 3.15;
const GRID_X = 4.6;
const GRID_Y = 6.4;

export function AutomationVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[11, 12]} className="acc-automation">
      {/* The schedule */}
      <Layer x={16} y={3} w={42.5} h={34} slab>
        <WindowBar title="Schedule" right={<span className={pill}>Week 46</span>} />
        <div className="absolute inset-x-0 top-[2.9em] flex h-[3.5em] items-end pb-[0.5em] text-[0.95em] text-white/45" style={{ paddingLeft: `${GRID_X}em` }}>
          {DAYS.map((d) => (
            <span key={d} style={{ width: `${COL}em` }} className="pl-[0.4em]">
              {d}
            </span>
          ))}
        </div>
        {HOURS.map((h, i) => (
          <div
            key={h}
            className="absolute inset-x-0 border-t border-white/[0.05] text-[0.78em] text-white/30"
            style={{ top: `${GRID_Y + i * ROW}em`, height: `${ROW}em` }}
          >
            <span className="pl-[1em]">{h}</span>
          </div>
        ))}
        {BOOKED.map(([d, s, len, t]) => (
          <div
            key={`${d}-${s}`}
            className="absolute overflow-hidden rounded-[0.45em] border border-white/[0.08] bg-white/[0.07] px-[0.5em] py-[0.3em] text-[0.8em] leading-tight text-white/55"
            style={{
              left: `calc(${GRID_X + d * COL + 0.25}em)`,
              top: `${GRID_Y + s * ROW + 0.2}em`,
              width: `${COL - 0.5}em`,
              height: `${len * ROW - 0.4}em`,
            }}
          >
            {t}
          </div>
        ))}
        {/* The free slot: takes the new job when emphasised. */}
        <div
          className="au-slot absolute rounded-[0.45em] px-[0.5em] py-[0.35em] text-[0.8em] leading-tight"
          style={{ left: `${GRID_X + 3 * COL + 0.25}em`, top: `${GRID_Y + 2 * ROW + 0.2}em`, width: `${COL - 0.5}em`, height: `${2 * ROW - 0.4}em` }}
        >
          <span className="on-hide absolute left-[0.6em] top-[0.4em] text-white/35">Available</span>
          <span className="on-show absolute inset-[0.4em] font-medium text-white">
            Boiler service
            <span className="block font-normal text-white/70">Elm Road · Sam R.</span>
          </span>
        </div>
      </Layer>

      {/* Request to slot. */}
      <Layer x={0} y={0} w={60} h={42} z={3}>
        <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible">
          <path
            d="M24 21 C 30 21, 33 18.5, 38.6 18.5"
            pathLength={1}
            fill="none"
            stroke="rgb(var(--acc))"
            strokeWidth="0.14"
            className="on-draw"
          />
        </svg>
      </Layer>

      {/* The work request */}
      <Layer x={1.5} y={10} w={22.5} h={21.5} z={6} lift={2.5} slab className="s3d-key">
        <div className="flex h-full flex-col p-[1.3em]">
          <div className="flex items-center justify-between">
            <span className="rounded-full px-[0.8em] py-[0.2em] text-[0.82em] font-medium text-[#04201c] acc-bg">New request</span>
            <span className="text-[0.85em] text-white/40">09:02</span>
          </div>
          <p className="mt-[0.8em] text-[1.65em] font-semibold tracking-[-0.02em] text-white">Boiler service</p>
          <p className="text-[0.98em] text-white/50">14 Elm Road · web form</p>
          <ul className="mt-auto grid gap-[0.65em] text-[0.98em] text-white/75">
            <li className="flex items-center gap-[0.6em]">
              <span className="grid h-[1.35em] w-[1.35em] place-items-center rounded-full text-[0.75em] text-[#04201c] acc-bg">✓</span>
              Details checked
            </li>
            <li className="flex items-center gap-[0.6em]">
              <span className="au-tick grid h-[1.35em] w-[1.35em] place-items-center rounded-full text-[0.75em]">✓</span>
              Assigned to Sam R. · Thu 10:00
            </li>
            <li className="flex items-center gap-[0.6em]">
              <span className="au-tick grid h-[1.35em] w-[1.35em] place-items-center rounded-full text-[0.75em]">✓</span>
              Customer notified
            </li>
          </ul>
        </div>
      </Layer>

      {/* Completion */}
      <Layer x={34} y={34.6} w={21.5} h={4.4} z={9} lift={2.5} slab className="on-show" style={{ ["--r" as string]: "2.2em" }}>
        <div className="flex h-full items-center gap-[0.6em] px-[1.1em] text-[0.95em] text-white/80">
          <span className="grid h-[1.4em] w-[1.4em] place-items-center rounded-full text-[0.8em] text-[#04201c] acc-bg">✓</span>
          Scheduled automatically
        </div>
      </Layer>
    </Stage>
  );
}

// --- Custom Software & Integrations ------------------------------------------------------------

const JOBS: [string, string, string, string, boolean][] = [
  ["J-1041", "Dental practice", "Scheduled", "£2,400", false],
  ["J-1042", "Food wholesaler", "In progress", "£8,150", false],
  ["J-1044", "Lettings agency", "Complete", "£1,280", true],
  ["J-1045", "Design studio", "Quoted", "£3,600", false],
  ["J-1046", "Garden centre", "In progress", "£5,020", false],
];
const STAGE_TONE: Record<string, string> = {
  Scheduled: "text-white/60 bg-white/[0.06]",
  "In progress": "text-[#ffd48a] bg-[#ffd48a]/10",
  Complete: "text-[#7fe0b8] bg-[#7fe0b8]/10",
  Quoted: "text-[#b9c7ff] bg-[#b9c7ff]/10",
};

export function SoftwareVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[10, 13]} className="acc-software">
      {/* The bespoke application */}
      <Layer x={1} y={4} w={35} h={32} slab>
        <div className="flex h-full">
          <nav className="w-[8.4em] shrink-0 bg-[#070c16] px-[0.9em] py-[1.1em] text-[1em] text-white/45">
            <p className="mb-[1.2em] flex items-center gap-[0.5em] font-semibold text-white/85">
              <span className="h-[1em] w-[1em] rounded-[0.3em] acc-bg" />
              Operations
            </p>
            {["Jobs", "Clients", "Stock", "Invoices", "Reports"].map((n, i) => (
              <p key={n} className={`mb-[0.35em] rounded-[0.4em] px-[0.6em] py-[0.35em] ${i === 0 ? "bg-white/[0.08] text-white/90" : ""}`}>
                {n}
              </p>
            ))}
          </nav>
          <div className="min-w-0 flex-1 p-[1.2em]">
            <div className="flex items-center justify-between">
              <p className="text-[1.5em] font-semibold tracking-[-0.02em] text-white">Jobs</p>
              <span className="rounded-[0.45em] px-[0.8em] py-[0.3em] text-[0.85em] font-medium text-[#04121f] acc-bg">New job</span>
            </div>
            <div className="mt-[0.8em] flex gap-[0.4em] text-[0.8em]">
              {["All", "Active", "Complete"].map((f, i) => (
                <span key={f} className={`rounded-full border px-[0.7em] py-[0.1em] ${i === 0 ? "border-white/25 text-white/80" : "border-white/10 text-white/40"}`}>
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-[0.9em] grid grid-cols-[4.2em_1fr_6.4em_4em] gap-x-[0.6em] border-b border-white/[0.08] pb-[0.4em] text-[0.78em] uppercase tracking-[0.1em] text-white/35">
              <span>Job</span>
              <span>Client</span>
              <span>Stage</span>
              <span className="text-right">Value</span>
            </div>
            {JOBS.map(([id, client, stage, value, synced]) => (
              <div
                key={id}
                className={`grid h-[2.55em] grid-cols-[4.2em_1fr_6.4em_4em] items-center gap-x-[0.6em] border-b border-white/[0.05] px-[0.2em] text-[0.92em] text-white/70 ${synced ? "sw-row rounded-[0.3em]" : ""}`}
              >
                <span className="font-mono text-white/45">{id}</span>
                <span className="truncate">{client}</span>
                <span className={`justify-self-start rounded-full px-[0.6em] py-[0.05em] text-[0.85em] ${STAGE_TONE[stage]}`}>{stage}</span>
                <span className="text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Layer>

      {/* The connection between the two systems. */}
      <Layer x={0} y={0} w={60} h={42} z={2}>
        <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible">
          <path d="M36 20.2 C 38.5 20.2, 38.5 17.6, 41 17.6" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="0.12" />
          <path
            d="M36 20.2 C 38.5 20.2, 38.5 17.6, 41 17.6"
            pathLength={1}
            fill="none"
            stroke="rgb(var(--acc))"
            strokeWidth="0.2"
            strokeLinecap="round"
            className="sw-flow"
          />
        </svg>
      </Layer>
      <Layer x={36.3} y={17.6} w={4.4} h={2.6} z={4} lift={1.5}>
        <span className="grid h-full w-full place-items-center rounded-full border border-white/15 bg-[#0d1525] text-[0.75em] font-medium uppercase tracking-[0.12em] text-white/70">
          Sync
        </span>
      </Layer>

      {/* The connected application (a different product, a different look). */}
      <Layer x={41} y={8} w={17.5} h={24} z={4.5} lift={2} slab className="s3d-key" faceClassName="is-light">
        <div className="flex h-full flex-col">
          <div className="flex h-[2.9em] items-center gap-[0.5em] border-b border-black/[0.08] px-[1em] text-[1em] font-semibold text-[#1f2633]">
            <span className="grid h-[1.3em] w-[1.3em] place-items-center rounded-full bg-[#1f2633] text-[0.7em] text-white">A</span>
            Accounts
          </div>
          <div className="flex-1 p-[1em]">
            <p className="text-[0.8em] uppercase tracking-[0.12em] text-black/40">Invoices</p>
            <div className="mt-[0.6em] rounded-[0.6em] border border-black/[0.08] bg-white p-[0.8em] shadow-[0_0.4em_1em_-0.5em_rgb(0_0_0/0.25)]">
              <div className="flex items-center justify-between text-[0.85em] text-black/50">
                <span className="font-mono">INV-2044</span>
                <span className="relative">
                  <span className="on-hide text-black/40">Draft</span>
                  <span className="on-show absolute right-0 top-0 whitespace-nowrap font-medium text-[#0f8a5f]">Synced</span>
                </span>
              </div>
              <p className="mt-[0.4em] text-[1.05em] font-semibold text-[#1f2633]">Lettings agency</p>
              <p className="text-[1.5em] font-semibold tracking-[-0.02em] text-[#1f2633]">£1,280.00</p>
              <p className="mt-[0.3em] text-[0.8em] text-black/45">From job J-1044</p>
            </div>
            {["INV-2043", "INV-2042"].map((n, i) => (
              <div key={n} className="on-dim mt-[0.5em] flex justify-between border-b border-black/[0.06] pb-[0.35em] text-[0.82em] text-black/45">
                <span className="font-mono">{n}</span>
                <span>{["£640.00", "£2,115.00"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </Layer>
    </Stage>
  );
}

// --- About: where business understanding meets technology expertise ---------------------

const BUSINESS = ["People and roles", "Day-to-day processes", "Customers and goals", "Constraints and budget"];
const TECHNOLOGY = ["AI & intelligent applications", "Business automation", "Websites & e-commerce", "Software & integrations"];

function PlaneList({ items, align }: { items: string[]; align: "left" | "right" }) {
  return (
    <ul className={`mt-[1.4em] grid gap-[0.75em] text-[1.08em] ${align === "right" ? "justify-items-end" : ""}`}>
      {items.map((t) => (
        <li key={t} className={`flex items-center gap-[0.6em] text-white/70 ${align === "right" ? "flex-row-reverse" : ""}`}>
          <span className="h-[0.42em] w-[0.42em] shrink-0 rotate-45 acc-bg" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function AboutVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[8, -10]} className="acc-ai">
      {/* Business understanding */}
      <Layer
        x={0.5}
        y={4}
        w={33}
        h={30}
        z={0}
        slab
        className="acc-automation"
        faceClassName="![background:linear-gradient(150deg,#122033,#0b1424_65%)]"
        style={{ ["--r" as string]: "1.6em" }}
      >
        <div className="p-[1.8em]">
          <p className="text-[0.85em] uppercase tracking-[0.2em] acc-text">How your business runs</p>
          <p className="mt-[0.4em] text-[1.9em] font-semibold leading-[1.1] tracking-[-0.02em] text-white">Business understanding</p>
          <PlaneList items={BUSINESS} align="left" />
        </div>
      </Layer>

      {/* Technology expertise */}
      <Layer
        x={26.5}
        y={8}
        w={33}
        h={30}
        z={3}
        slab
        faceClassName="![background:linear-gradient(150deg,#132544,#0c1630_65%)]"
        style={{ ["--r" as string]: "1.6em" }}
      >
        <div className="p-[1.8em] text-right">
          <p className="text-[0.85em] uppercase tracking-[0.2em] acc-text">What technology can do</p>
          <p className="mt-[0.4em] text-[1.9em] font-semibold leading-[1.1] tracking-[-0.02em] text-white">Technology expertise</p>
          <div className="flex justify-end">
            <PlaneList items={TECHNOLOGY} align="right" />
          </div>
        </div>
      </Layer>

      {/* Where they meet */}
      <Layer x={16.5} y={28} w={27} h={12} z={7} lift={3} slab className="s3d-key" faceClassName="![background:linear-gradient(160deg,#1a2c4d,#101c33)]">
        <div className="flex h-full flex-col justify-center p-[1.5em]">
          <p className="flex items-center gap-[0.5em] text-[0.82em] font-medium uppercase tracking-[0.18em] acc-text">
            <span className="h-[0.5em] w-[0.5em] rounded-full acc-bg" />
            Where we work
          </p>
          <p className="mt-[0.5em] text-[1.65em] font-semibold leading-[1.15] tracking-[-0.02em] text-white">The right solution, built to fit</p>
          <p className="mt-[0.6em] flex gap-[1.2em] text-[0.92em] text-white/60">
            <span>✓ Suits how you work</span>
            <span>✓ Built to last</span>
          </p>
        </div>
      </Layer>
    </Stage>
  );
}
