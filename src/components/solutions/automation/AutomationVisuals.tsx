import type { CSSProperties, ReactNode } from "react";
import Stage, { Layer } from "@/components/home/directory/Stage";

/**
 * Business Automation page visuals, built with the homepage's stage system
 * (Stage, Layer, directory.css): layered surfaces in one CSS 3D space, a
 * resting angle, a small pointer tilt and one emphasis on hover / focus / in
 * view. Each section has its own composition, distinct from each other and
 * from the AI page:
 *
 *   Hero      desk edge   inbox, an Unassigned tray, a diary strip
 *   Pain      stack       one request and the admin piled on it
 *   How       lanes       a sorting desk routing requests three ways
 *   Apps      gallery     four differently shaped work objects
 *   Approach  board       a pinned process-planning board
 *   Trust     exceptions  tickets fanned beside a status register
 *   Close     note stand  a question note and an open diary
 *
 * Colour: blue for the next step, amber for waiting / exceptions, teal for
 * done. Sample content is fictional. Sizes are em on the 60 x 42 em canvas.
 */

const turn = (deg: number): CSSProperties => ({ rotate: `${deg}deg` });
const round = (r: number): CSSProperties => ({ ["--r" as string]: `${r}em` });
const AMBER = "#e0a24a";
const TEAL = "#3cc9a8";

const dot = "inline-block h-[0.55em] w-[0.55em] rounded-full";

function WindowBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex h-[2.9em] items-center gap-[0.45em] border-b border-white/[0.07] px-[1.1em] text-[1.05em] text-white/80">
      <span className={`${dot} bg-white/15`} />
      <span className={`${dot} bg-white/15`} />
      <span className={`${dot} bg-white/15`} />
      <span className="ml-[0.8em] font-medium">{title}</span>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

function Tag({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[0.4em] rounded-full px-[0.7em] py-[0.15em] text-[0.78em] font-medium" style={{ color: tone, background: `color-mix(in srgb, ${tone} 16%, transparent)` }}>
      <span className="h-[0.45em] w-[0.45em] rounded-full" style={{ background: tone }} />
      {children}
    </span>
  );
}

function Draw({ d, z = 2 }: { d: string; z?: number }) {
  return (
    <Layer x={0} y={0} w={60} h={42} z={z}>
      <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={d} pathLength={1} fill="none" stroke="rgb(var(--acc))" strokeWidth="0.14" className="on-draw" />
      </svg>
    </Layer>
  );
}

const lines = (ws: string[], tone = "bg-black/[0.12]") => (
  <div className="grid gap-[0.5em]">
    {ws.map((w, i) => (
      <span key={i} className={`block h-[0.45em] rounded-full ${tone}`} style={{ width: w }} />
    ))}
  </div>
);

// --- 01 Hero: the request that stopped moving -----------------------------------------------

export function HeroVisual({ label }: { label: string }) {
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
  return (
    <Stage track="section" label={label} rest={[9, -13]} className="acc-ai">
      {/* The inbox: it arrived. */}
      <Layer x={1} y={3} w={25} h={22} slab>
        <WindowBar title="Inbox" right={<span className="text-[0.8em] text-white/40">3 new</span>} />
        <div className="px-[0.8em] py-[0.6em] text-[0.88em]">
          {[
            ["Site visit request", "Website form", true],
            ["Invoice query", "Email", false],
            ["Delivery update", "Email", false],
          ].map(([t, s, on]) => (
            <div key={t as string} className={`mb-[0.35em] rounded-[0.45em] px-[0.6em] py-[0.5em] ${on ? "bg-white/[0.07]" : ""}`}>
              <p className="flex items-center gap-[0.5em] text-white/85">
                {on && <span className="h-[0.5em] w-[0.5em] rounded-full acc-bg" />}
                {t}
              </p>
              <p className="text-[0.85em] text-white/40">{s}</p>
            </div>
          ))}
        </div>
      </Layer>

      {/* The Unassigned tray, with the request waiting in it. */}
      <Layer x={8} y={24} w={30} h={14} z={4} slab faceClassName="!bg-[linear-gradient(170deg,#1a2335,#0d1422)]">
        <div className="flex h-full items-end justify-between px-[1.1em] pb-[0.8em]">
          <span className="text-[0.78em] font-semibold uppercase tracking-[0.18em]" style={{ color: AMBER }}>
            Unassigned
          </span>
          <span className="text-[0.75em] text-white/35">Tray</span>
        </div>
      </Layer>
      <Layer x={11} y={17} w={22} h={14} z={8} lift={3} slab faceClassName="is-light" className="s3d-key" style={turn(-3)}>
        <div className="flex h-full flex-col p-[1.1em] text-[#1f2633]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.8em] text-black/45">#1042</span>
            <span className="on-hide">
              <Tag tone="#b9741c">Waiting for assignment</Tag>
            </span>
          </div>
          <p className="mt-[0.4em] text-[1.35em] font-semibold leading-tight">Site visit · 14 Elm Road</p>
          <p className="text-[0.85em] text-black/50">Preferred: Tuesday or Thursday</p>
          <p className="on-show mt-auto text-[0.85em] font-medium text-[#2459bd]">Next: Scheduling queue →</p>
        </div>
      </Layer>

      <Draw d="M33 24 C 38 24, 40 20.5, 44 20.5" z={6} />

      {/* The diary, with a slot nobody has allocated. */}
      <Layer x={43} y={2} w={15.5} h={36} z={2} slab>
        <div className="px-[1em] pt-[0.9em] text-[0.82em] text-white/40">
          <p className="text-[1.1em] font-semibold text-white/85">Thursday</p>
          <p>Diary</p>
        </div>
        {hours.map((h, i) => (
          <div key={h} className="absolute inset-x-0 border-t border-white/[0.05] pl-[0.8em] text-[0.7em] text-white/30" style={{ top: `${6 + i * 4.2}em`, height: "4.2em" }}>
            {h}
          </div>
        ))}
        <div className="absolute left-[3.6em] right-[0.6em] top-[6.3em] h-[3.6em] rounded-[0.4em] bg-white/[0.07] px-[0.5em] py-[0.3em] text-[0.72em] text-white/55">Repair · Oak Ave</div>
        <div className="au-slot absolute left-[3.6em] right-[0.6em] top-[14.7em] h-[7.8em] rounded-[0.4em] px-[0.5em] py-[0.35em] text-[0.72em]">
          <span className="on-hide text-white/35">Unallocated</span>
          <span className="on-show absolute inset-[0.4em] font-medium text-white">Proposed · #1042</span>
        </div>
        <div className="absolute left-[3.6em] right-[0.6em] top-[27.3em] h-[3.6em] rounded-[0.4em] bg-white/[0.07] px-[0.5em] py-[0.3em] text-[0.72em] text-white/55">Survey · Mill Lane</div>
      </Layer>
    </Stage>
  );
}

// --- 02 Pain: the growing admin stack ------------------------------------------------------------

export function PainVisual({ label }: { label: string }) {
  const sheet = "flex h-full flex-col p-[1.1em]";
  const head = "flex items-center justify-between";
  const title = "text-[1.2em] font-semibold tracking-[-0.01em]";
  return (
    <Stage track="section" label={label} rest={[14, 12]} className="acc-ai">
      {/* 1. The enquiry itself. */}
      <Layer x={4} y={2} w={30} h={20} z={0} slab faceClassName="is-light">
        <div className={`${sheet} text-[#1f2633]`}>
          <div className={head}>
            <p className={title}>Enquiry</p>
            <span className="font-mono text-[0.75em] text-black/40">#1042</span>
          </div>
          <div className="mt-[0.8em]">{lines(["85%", "70%", "60%"])}</div>
        </div>
      </Layer>
      {/* 2. The same details, typed again. */}
      <Layer x={10} y={7.5} w={30} h={20} z={2.5} lift={1.5} slab faceClassName="is-light">
        <div className={`${sheet} text-[#1f2633]`}>
          <div className={head}>
            <p className={title}>Intake form</p>
            <span className="text-[0.75em] text-black/40">re-entered</span>
          </div>
          <div className="mt-[0.7em] grid grid-cols-2 gap-[0.4em] text-[0.75em] text-black/50">
            {["Name", "Phone", "Address", "Request"].map((f) => (
              <span key={f} className="rounded-[0.3em] border border-black/10 px-[0.4em] py-[0.25em]">
                {f}
              </span>
            ))}
          </div>
        </div>
      </Layer>
      {/* 3. A task nobody has picked up. */}
      <Layer x={16} y={13} w={30} h={20} z={5} lift={3} slab>
        <div className={sheet}>
          <div className={head}>
            <p className={`${title} text-white`}>Task ticket</p>
            <Tag tone={AMBER}>No owner</Tag>
          </div>
          <p className="mt-[0.7em] text-[0.9em] text-white/55">Assign to: —</p>
        </div>
      </Layer>
      {/* 4. The diary page to check. */}
      <Layer x={22} y={18.5} w={30} h={20} z={7.5} lift={4.5} slab faceClassName="is-light">
        <div className={`${sheet} text-[#1f2633]`}>
          <div className={head}>
            <p className={title}>Calendar</p>
            <span className="text-[0.75em] text-black/40">Week 46</span>
          </div>
          <div className="mt-[0.7em] grid grid-cols-5 gap-[0.3em]">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`h-[1.3em] rounded-[0.2em] ${[1, 4, 8].includes(i) ? "bg-black/20" : "bg-black/[0.06]"}`} />
            ))}
          </div>
        </div>
      </Layer>
      {/* 5. The follow-up reminder on top. */}
      <Layer x={40} y={27} w={18} h={12} z={10} lift={6} slab className="s3d-key" faceClassName="![background:#f3d77a] !border-[#f3d77a]" style={{ ...turn(5), ...round(0.4) }}>
        <div className="p-[1em] text-[#3a3012]">
          <p className="text-[0.75em] uppercase tracking-[0.14em] opacity-60">Reminder</p>
          <p className="mt-[0.3em] text-[1.05em] font-semibold leading-snug">Chase #1042 — any update?</p>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 03 How: the sorting desk -----------------------------------------------------------------

export function HowVisual({ label }: { label: string }) {
  const lanes = [
    { name: "Ready to process", tone: TEAL, y: 3, ticket: "#1042 · Site visit · details complete" },
    { name: "Needs information", tone: AMBER, y: 15.5, ticket: "#1043 · Quote · location missing" },
    { name: "Needs review", tone: "#8ab0ff", y: 28, ticket: null },
  ];
  return (
    <Stage track="section" label={label} rest={[16, -6]} className="acc-ai">
      {/* The incoming request. */}
      <Layer x={1} y={15.5} w={15} h={9.5} z={6} lift={2} slab faceClassName="is-light" style={turn(-3)}>
        <div className="p-[1em] text-[#1f2633]">
          <p className="text-[0.72em] uppercase tracking-[0.14em] text-black/40">Incoming</p>
          <p className="mt-[0.3em] text-[1.1em] font-semibold leading-tight">New request</p>
          <div className="mt-[0.6em]">{lines(["80%", "60%"])}</div>
        </div>
      </Layer>
      {/* The check. */}
      <Layer x={17.5} y={17.5} w={6} h={6} z={5} lift={2} slab className="s3d-key" style={round(3)}>
        <div className="grid h-full place-items-center">
          <span className="text-center text-[0.72em] font-semibold uppercase tracking-[0.1em] acc-text">Check</span>
        </div>
      </Layer>
      <Draw d="M23.5 20.5 C 25 20.5, 25 7.2, 27 7.2 M23.5 20.5 L 27 20 M23.5 20.5 C 25 20.5, 25 32.2, 27 32.2" z={3} />
      {lanes.map((l) => (
        <Layer key={l.name} x={26} y={l.y} w={33} h={10.5} z={1} slab faceClassName="!bg-[linear-gradient(170deg,#141d2e,#0b1220)]">
          <div className="flex h-full items-center gap-[0.9em] px-[1em]">
            <span className="w-[7.5em] shrink-0 text-[0.82em] font-semibold leading-tight" style={{ color: l.tone }}>
              {l.name}
            </span>
            {l.ticket ? (
              <span className="min-w-0 flex-1 truncate rounded-[0.45em] border border-white/10 bg-white/[0.06] px-[0.7em] py-[0.55em] text-[0.82em] text-white/80" style={{ boxShadow: `inset 0.22em 0 0 ${l.tone}` }}>
                {l.ticket}
              </span>
            ) : (
              <span className="min-w-0 flex-1 rounded-[0.45em] border border-dashed border-white/15 px-[0.7em] py-[0.55em] text-[0.82em] text-white/35">For cases needing judgement</span>
            )}
          </div>
        </Layer>
      ))}
    </Stage>
  );
}

// --- 04 Apps: the gallery ------------------------------------------------------------------------

export function AppsVisual({ label }: { label: string }) {
  return (
    <Stage track="section" label={label} rest={[8, 16]} className="acc-ai">
      {/* Enquiries: a slip gains an owner. */}
      <Layer x={1} y={3} w={19} h={11} z={3} lift={2} slab faceClassName="is-light" style={turn(-4)}>
        <div className="p-[1em] text-[#1f2633]">
          <p className="font-mono text-[0.75em] text-black/40">Enquiry #1042</p>
          <p className="mt-[0.2em] text-[1.05em] font-semibold">Site visit</p>
          <p className="relative mt-[0.5em] text-[0.82em]">
            <span className="on-hide text-black/45">Owner: —</span>
            <span className="on-show absolute left-0 top-0 font-medium text-[#2459bd]">Owner: Sam R.</span>
          </p>
        </div>
      </Layer>

      {/* Scheduling: a diary column with a proposed slot. */}
      <Layer x={22} y={1} w={12} h={25} z={6} lift={3} slab>
        <div className="px-[0.9em] pt-[0.9em] text-[0.8em]">
          <p className="font-semibold text-white/85">Tuesday</p>
          {["08", "09", "10", "11", "12"].map((h) => (
            <p key={h} className="mt-[0.75em] border-t border-white/[0.06] pt-[0.3em] text-[0.85em] text-white/30">
              {h}:00
            </p>
          ))}
        </div>
        <div className="au-slot absolute left-[2.8em] right-[0.6em] top-[9.2em] h-[4.6em] rounded-[0.4em] px-[0.4em] py-[0.3em] text-[0.7em]">
          <span className="on-show font-medium text-white">Proposed</span>
        </div>
      </Layer>

      {/* Records: one field kept consistent. */}
      <Layer x={2} y={19} w={22} h={16} z={9} lift={2} slab>
        <WindowBar title="Customer record" />
        <div className="grid gap-[0.45em] p-[1em] text-[0.82em]">
          <div className="flex justify-between text-white/55">
            <span>Name</span>
            <span className="text-white/80">A. Patel</span>
          </div>
          <div className="auto-hit flex justify-between rounded-[0.3em] px-[0.3em] py-[0.2em] text-white/55">
            <span>Phone</span>
            <span className="text-white/90">07700 900123</span>
          </div>
          <p className="on-show text-[0.85em]" style={{ color: TEAL }}>
            ✓ Matches the enquiry
          </p>
        </div>
      </Layer>

      {/* Approvals: a document stops at a review control. */}
      <Layer x={37} y={7} w={21} h={28} z={4} lift={3.5} slab faceClassName="is-light" className="s3d-key" style={turn(3)}>
        <div className="flex h-full flex-col p-[1.2em] text-[#1f2633]">
          <p className="text-[0.75em] uppercase tracking-[0.14em] text-black/40">Purchase approval</p>
          <p className="mt-[0.3em] text-[1.3em] font-semibold">Boiler parts</p>
          <p className="text-[1.6em] font-semibold tracking-[-0.02em]">£640.00</p>
          <div className="mt-[0.8em]">{lines(["90%", "72%", "84%"])}</div>
          <div className="mt-auto flex items-center justify-between">
            <span className="rounded-[0.45em] px-[0.9em] py-[0.35em] text-[0.85em] font-medium text-white acc-bg">Review</span>
            <span className="text-[0.75em] text-black/45">Awaiting a person</span>
          </div>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 05 Approach: the planning board ---------------------------------------------------------------

export function ApproachVisual({ label }: { label: string }) {
  const col = "text-[0.78em] font-semibold uppercase tracking-[0.16em] text-white/40";
  const card = "rounded-[0.4em] px-[0.7em] py-[0.55em] text-[0.85em] leading-tight";
  return (
    <Stage track="section" label={label} rest={[6, -14]} className="acc-ai">
      {/* The board. */}
      <Layer x={1} y={2} w={58} h={32} slab faceClassName="!bg-[linear-gradient(165deg,#151e30,#0c1322)]">
        <div className="grid h-full grid-cols-3 gap-[1em] p-[1.3em]">
          <p className={col}>Current process</p>
          <p className={col}>Proposed rules</p>
          <p className={col}>Test cases</p>
        </div>
      </Layer>

      {/* Current process: paper cards, one unclear hand-off circled. */}
      {["Enquiry arrives", "Copied to spreadsheet", "Who assigns it?"].map((t, i) => (
        <Layer key={t} x={3} y={7 + i * 9.5} w={15} h={4.6} z={2 + i * 0.4} lift={1} slab faceClassName="is-light" style={{ ...turn([-2, 1.5, -1][i]), ...round(0.4) }}>
          <div className={`${card} text-[#1f2633]`}>{t}</div>
        </Layer>
      ))}
      <Layer x={1.5} y={23.6} w={18} h={8.6} z={3.5}>
        <svg viewBox="0 0 18 8.6" className="absolute inset-0 h-full w-full overflow-visible" fill="none" stroke={AMBER} strokeWidth="0.25">
          <ellipse cx="9" cy="4.3" rx="8.6" ry="4" strokeDasharray="0.6 0.4" />
        </svg>
      </Layer>

      {/* Proposed rules: annotated decisions. */}
      {[
        ["If details are complete", "→ Scheduling queue"],
        ["If location is missing", "→ hold and ask"],
        ["If outside standard work", "→ operations review"],
      ].map(([a, b], i) => (
        <Layer key={a} x={21.5} y={7 + i * 9.5} w={17} h={5.6} z={3} lift={2} slab style={round(0.6)}>
          <div className={`${card} text-white/75`}>
            {a}
            <span className="block acc-text">{b}</span>
          </div>
        </Layer>
      ))}

      {/* Test cases: normal and exceptional. */}
      <Layer x={41} y={7} w={16} h={17} z={5} lift={3.5} slab faceClassName="is-light" className="s3d-key" style={turn(2)}>
        <div className="p-[1em] text-[0.85em] text-[#1f2633]">
          <p className="font-semibold">Tested</p>
          {["Complete enquiry", "Missing location", "Unusual request", "Duplicate"].map((t) => (
            <p key={t} className="mt-[0.7em] flex items-center gap-[0.5em]">
              <span className="au-tick grid h-[1.35em] w-[1.35em] shrink-0 place-items-center rounded-full text-[0.75em]">✓</span>
              {t}
            </p>
          ))}
        </div>
      </Layer>
    </Stage>
  );
}

// --- 06 Trust: the exception desk -------------------------------------------------------------------

export function TrustVisual({ label }: { label: string }) {
  const tickets = [
    { id: "#1041", title: "Duplicate request", tag: "Review · avoid re-processing", tone: AMBER, x: 21, y: 8, z: 2, r: -7 },
    { id: "#1043", title: "Location missing", tag: "Held", tone: AMBER, x: 30, y: 6, z: 5, r: 0 },
    { id: "#1042", title: "Site visit", tag: "Progressed", tone: TEAL, x: 39, y: 8, z: 8, r: 7 },
  ];
  return (
    <Stage track="section" label={label} rest={[12, 14]} className="acc-ai">
      {/* The status register. */}
      <Layer x={1} y={8} w={18} h={23.5} slab>
        <WindowBar title="Status" />
        <div className="grid gap-[0.2em] p-[0.8em] text-[0.8em]">
          {[
            ["#1040", "Complete", TEAL],
            ["#1041", "Review", AMBER],
            ["#1042", "Progressed", TEAL],
            ["#1043", "Held", AMBER],
            ["#1044", "Complete", TEAL],
          ].map(([id, s, c]) => (
            <div key={id} className="flex items-center justify-between border-b border-white/[0.06] py-[0.55em]">
              <span className="font-mono text-white/50">{id}</span>
              <span style={{ color: c }}>{s}</span>
            </div>
          ))}
        </div>
      </Layer>

      {/* Three tickets, three outcomes. */}
      {tickets.map((t) => (
        <Layer key={t.id} x={t.x} y={t.y} w={17} h={21} z={t.z} lift={t.z / 2} slab faceClassName="is-light" style={turn(t.r)}>
          <div className="flex h-full flex-col p-[1em] text-[#1f2633]">
            <span className="font-mono text-[0.78em] text-black/40">{t.id}</span>
            <p className="mt-[0.3em] text-[1.1em] font-semibold leading-tight">{t.title}</p>
            <div className="mt-[0.6em]">{lines(["85%", "65%"])}</div>
            <span className="mt-auto rounded-[0.35em] px-[0.5em] py-[0.3em] text-[0.75em] font-semibold" style={{ color: t.tone === TEAL ? "#13775f" : "#9a5b10", background: `color-mix(in srgb, ${t.tone} 22%, transparent)` }}>
              {t.tag}
            </span>
          </div>
        </Layer>
      ))}

      {/* The review control: a person decides. */}
      <Layer x={41} y={31} w={15} h={6.5} z={11} lift={3} slab className="s3d-key" style={round(3.25)}>
        <div className="flex h-full items-center gap-[0.6em] px-[1em] text-[0.9em] text-white/85">
          <svg viewBox="0 0 24 24" className="h-[1.4em] w-[1.4em] acc-text" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c1-4 4-6 7-6s6 2 7 6" strokeLinecap="round" />
          </svg>
          Review held item
        </div>
      </Layer>
    </Stage>
  );
}

// --- 07 Close: the note stand ----------------------------------------------------------------------

export function CloseVisual({ label }: { label: string }) {
  return (
    <Stage track="section" label={label} rest={[10, -10]} className="acc-ai">
      {/* An open diary, behind. */}
      <Layer x={30} y={5} w={28} h={24} z={0} slab>
        <div className="grid h-full grid-cols-2">
          <div className="border-r border-white/[0.08] p-[1em] text-[0.8em] text-white/40">
            <p className="text-[1.1em] font-semibold text-white/80">Monday</p>
            <div className="mt-[0.8em]">{lines(["80%", "55%", "70%"], "bg-white/[0.08]")}</div>
          </div>
          <div className="p-[1em] text-[0.8em] text-white/40">
            <p className="text-[1.1em] font-semibold text-white/80">Tuesday</p>
            <div className="mt-[0.8em] rounded-[0.4em] border border-dashed border-white/20 px-[0.5em] py-[0.4em] text-[0.9em] text-white/55">Process chat?</div>
          </div>
        </div>
      </Layer>

      {/* The stand and its question note. */}
      <Layer x={3} y={30} w={34} h={4.5} z={6} slab faceClassName="!bg-[linear-gradient(170deg,#3a2f26,#241c16)]" style={round(0.6)} />
      <Layer x={5} y={6} w={30} h={24} z={7} lift={3} slab faceClassName="is-light" className="s3d-key" style={{ ...turn(-2), ...round(0.6) }}>
        <div className="flex h-full flex-col justify-center p-[1.8em] text-[#1f2633]">
          <p className="text-[0.8em] uppercase tracking-[0.16em] text-black/40">A good place to start</p>
          <p className="mt-[0.4em] text-[2.1em] font-semibold leading-[1.1] tracking-[-0.02em]">What keeps getting repeated?</p>
        </div>
      </Layer>

      {/* A pen. */}
      <Layer x={38} y={33} w={17} h={1.3} z={3} slab className="on-show" faceClassName="!bg-[#3478f6] !border-[#3478f6]" style={{ ...turn(-12), ...round(0.65) }} />
    </Stage>
  );
}
