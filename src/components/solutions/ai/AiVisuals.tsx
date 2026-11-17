import type { CSSProperties, ReactNode } from "react";
import Stage, { Layer } from "@/components/home/directory/Stage";

/**
 * The AI page's section visuals, built with the homepage's stage system
 * (components/home/directory: Stage, Layer, directory.css): layered surfaces
 * in one CSS 3D space, a resting angle, a small pointer tilt, and one emphasis
 * on hover / focus / in view. Each uses a different composition:
 *
 *   Hero       orbit       an AI assistant with ordinary jobs around it
 *   Discovery  staircase   understand, identify, plan, rising towards the viewer
 *   Apps       mosaic      calls, bookings, enquiries, documents; one produces a result
 *   Approach   cascade     four stage bars stepping forward
 *   Alongside  night/day   an evening call answered, ready for the team next morning
 *   Close      phone       a conversation and a first-call card
 *
 * Sample content is fictional. Sizes are em on the 60 x 42 em canvas.
 */

const turn = (deg: number): CSSProperties => ({ rotate: `${deg}deg` });
const round = (r: number): CSSProperties => ({ ["--r" as string]: `${r}em` });

const Tick = ({ dark = "#04121f" }: { dark?: string }) => (
  <span className="grid h-[1.4em] w-[1.4em] shrink-0 place-items-center rounded-full text-[0.8em] acc-bg" style={{ color: dark }}>
    ✓
  </span>
);

function Draw({ d, z = 2 }: { d: string; z?: number }) {
  return (
    <Layer x={0} y={0} w={60} h={42} z={z}>
      <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={d} pathLength={1} fill="none" stroke="rgb(var(--acc))" strokeWidth="0.14" strokeDasharray="1 1" className="on-draw" />
      </svg>
    </Layer>
  );
}

const ICONS: Record<string, ReactNode> = {
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 005.2 5.2l1.3-2 4 1.5v3a2 2 0 01-2 2A15.5 15.5 0 014.5 5.5a2 2 0 012-2z" strokeLinejoin="round" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M8.5 14l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" strokeLinejoin="round" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
      <path d="M9 11h6M9 14.5h6M9 18h4" strokeLinecap="round" />
    </>
  ),
};

function Icon({ name, className }: { name: string; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      {ICONS[name]}
    </svg>
  );
}

// --- 00 Hero: orbit -----------------------------------------------------------------------------

export function HeroVisual({ label }: { label: string }) {
  const jobs = [
    { icon: "phone", title: "Call after hours", note: "Details collected", x: 1, y: 4, z: 0, r: -6 },
    { icon: "calendar", title: "Booking request", note: "Availability checked", x: 46, y: 2, z: 6, r: 5 },
    { icon: "mail", title: "Website enquiry", note: "Routed to sales", x: 45, y: 28, z: 11, r: -4 },
  ];
  return (
    <Stage track="section" label={label} rest={[8, -10]} className="acc-ai">
      {jobs.map((j, i) => (
        <Layer key={j.title} x={j.x} y={j.y} w={13} h={10} z={j.z} lift={1 + i} slab faceClassName="is-light" style={turn(j.r)}>
          <div className="p-[0.9em] text-[#1f2633]">
            <Icon name={j.icon} className="h-[1.5em] w-[1.5em] text-[#2459bd]" />
            <p className="mt-[0.4em] text-[0.85em] font-semibold leading-tight">{j.title}</p>
            <p className="mt-[0.15em] text-[0.68em] text-black/50">{j.note}</p>
          </div>
        </Layer>
      ))}
      <Draw d="M14 9 L 17 13 M46 7.5 L 43 11 M45 32 L 43 29" z={3} />

      {/* The assistant: centre of the orbit. */}
      <Layer x={16} y={8} w={28} h={25} z={4} lift={3} slab className="s3d-key" faceClassName="!bg-[linear-gradient(160deg,#16223a,#0e1628)]">
        <div className="flex h-full flex-col p-[1.3em]">
          <p className="flex items-center gap-[0.5em] text-[0.85em] font-medium uppercase tracking-[0.16em] acc-text">
            <span className="h-[0.5em] w-[0.5em] rounded-full acc-bg" />
            AI assistant · overnight
          </p>
          <div className="mt-[1em] grid gap-[0.55em] text-[0.92em]">
            {[
              ["After-hours call answered", "Ready for follow-up"],
              ["Booking details collected", "In the calendar"],
              ["Enquiry read and routed", "Sales queue"],
              ["Invoice details extracted", "Ready to check"],
            ].map(([a, b]) => (
              <div key={a} className="flex items-center justify-between gap-[0.6em] border-b border-white/[0.07] pb-[0.45em]">
                <span className="flex items-center gap-[0.5em] text-white/85">
                  <Tick /> {a}
                </span>
                <span className="shrink-0 text-[0.85em] text-white/45">{b}</span>
              </div>
            ))}
          </div>
          <p className="mt-auto text-[0.82em] text-white/45">Unusual requests passed to the team</p>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 01 Discovery: the staircase ---------------------------------------------------------------------

export function DiscoveryVisual({ label }: { label: string }) {
  const step = "flex h-full flex-col p-[1.2em]";
  const tag = "font-mono text-[0.85em] acc-text";
  return (
    <Stage track="section" label={label} rest={[10, -16]} className="acc-violet">
      <Draw d="M10 26 C 18 26, 22 21, 30 21 S 42 16, 50 16" z={1} />

      <Layer x={1} y={14} w={18} h={23} z={0} lift={1} slab>
        <div className={step}>
          <span className={tag}>01</span>
          <p className="mt-[0.3em] text-[1.15em] font-semibold text-white">Understand</p>
          <div className="mt-[0.8em] grid gap-[0.4em] text-[0.75em] text-white/65">
            {["Customer calls", "Bookings", "Repeated admin", "After-hours"].map((t) => (
              <span key={t} className="rounded-[0.4em] bg-white/[0.06] px-[0.6em] py-[0.3em]">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-auto text-[0.85em] text-white/50">How the business runs</p>
        </div>
      </Layer>

      <Layer x={21} y={9} w={18} h={23} z={6} lift={2.5} slab faceClassName="!bg-[linear-gradient(160deg,#1b1a3a,#100f26)]">
        <div className={step}>
          <span className={tag}>02</span>
          <p className="mt-[0.3em] text-[1.15em] font-semibold text-white">Identify</p>
          <svg viewBox="0 0 40 30" className="mt-[0.9em] w-full" fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="0.8">
            <rect x="2" y="2" width="14" height="8" rx="2" />
            <rect x="24" y="2" width="14" height="8" rx="2" />
            <rect x="24" y="20" width="14" height="8" rx="2" />
            <path d="M16 6h8M31 10v10" />
            <ellipse cx="31" cy="24" rx="10" ry="6.5" stroke="rgb(var(--acc))" strokeWidth="1.2" />
          </svg>
          <p className="mt-auto text-[0.85em] text-white/50">Where AI would help</p>
        </div>
      </Layer>

      <Layer x={41} y={4} w={18} h={23} z={12} lift={4} slab className="s3d-key">
        <div className={step}>
          <span className={tag}>03</span>
          <p className="mt-[0.3em] text-[1.15em] font-semibold text-white">Plan</p>
          <div className="mt-[0.9em] grid gap-[0.45em] text-[0.78em]">
            <span className="flex items-center justify-between rounded-[0.45em] border border-[rgb(var(--acc)/0.6)] px-[0.6em] py-[0.4em] text-white/85">
              Existing tool <Tick dark="#120f2a" />
            </span>
            <span className="rounded-[0.45em] bg-white/[0.05] px-[0.6em] py-[0.4em] text-white/50">Tailored build</span>
          </div>
          <p className="mt-auto text-[0.85em] text-white/50">What is feasible</p>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 02 Apps: the mosaic ----------------------------------------------------------------------------

export function AppsVisual({ label }: { label: string }) {
  const tiles = [
    { icon: "phone", name: "Telephone answering", x: 3, y: 4, z: 0 },
    { icon: "doc", name: "Paperwork", x: 19, y: 4, z: 4, key: true },
    { icon: "calendar", name: "Bookings", x: 3, y: 21, z: 2 },
    { icon: "mail", name: "Enquiries", x: 19, y: 21, z: 6 },
  ];
  return (
    <Stage track="section" label={label} rest={[14, 12]} className="acc-automation">
      {tiles.map((t) => (
        <Layer key={t.name} x={t.x} y={t.y} w={15} h={15} z={t.z} lift={t.key ? 4 : 0} slab className={t.key ? "s3d-key" : "on-dim"} style={round(1.6)}>
          <div className="flex h-full flex-col justify-between p-[1.2em]">
            <Icon name={t.icon} className={`h-[3.2em] w-[3.2em] ${t.key ? "acc-text" : "text-white/50"}`} />
            <p className="text-[0.95em] font-medium leading-tight text-white/85">{t.name}</p>
          </div>
        </Layer>
      ))}

      <Draw d="M34 11 C 38 11, 38 13, 41 13" z={6} />

      {/* What the paperwork tile produces. */}
      <Layer x={40} y={6} w={18} h={17.5} z={9} lift={3} slab faceClassName="is-light">
        <div className="p-[1.1em] text-[0.9em] text-[#1f2633]">
          <p className="text-[0.75em] uppercase tracking-[0.12em] text-black/40">Extracted for review</p>
          {[
            ["Supplier", "Northfield"],
            ["Invoice", "INV-7731"],
            ["Due", "30 days"],
          ].map(([k, v]) => (
            <div key={k} className="mt-[0.6em] flex justify-between border-b border-black/[0.08] pb-[0.3em]">
              <span className="text-black/50">{k}</span>
              <span>{v}</span>
            </div>
          ))}
          <div className="ai-field-hit mt-[0.7em] flex justify-between rounded-[0.35em] px-[0.35em] py-[0.3em] font-semibold">
            <span>Total</span>
            <span>£429.40</span>
          </div>
        </div>
      </Layer>
      <Layer x={42} y={25.5} w={15} h={4.2} z={12} lift={3} slab className="on-show" style={round(2.1)}>
        <div className="flex h-full items-center gap-[0.5em] px-[1em] text-[0.88em] text-white/80">
          <Tick dark="#04201c" /> Ready to check
        </div>
      </Layer>
    </Stage>
  );
}

// --- 03 Approach: the cascade -------------------------------------------------------------------------

const STAGES: [string, string][] = [
  ["Discover", "The business, the friction, where AI could help"],
  ["Evaluate & Plan", "Options, feasibility, cost, the way forward"],
  ["Build & Integrate", "Configure or build, connect to workflows"],
  ["Launch & Improve", "Test, use daily, adjust"],
];

export function ApproachVisual({ label }: { label: string }) {
  return (
    <Stage track="section" label={label} rest={[8, 14]} className="acc-ai">
      {STAGES.map(([name, note], i) => {
        const last = i === STAGES.length - 1;
        return (
          <Layer key={name} x={2 + i * 5} y={3 + i * 9.2} w={40} h={7.4} z={i * 3} lift={last ? 4 : i} slab className={last ? "s3d-key" : ""} style={round(1.2)}>
            <div className="flex h-full items-center gap-[1em] px-[1.2em]">
              <span className="font-mono text-[1.1em] acc-text">0{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.1em] font-semibold text-white">{name}</span>
                <span className="block truncate text-[0.82em] text-white/50">{note}</span>
              </span>
              {last ? (
                <span className="rounded-full px-[0.8em] py-[0.2em] text-[0.8em] font-medium text-white acc-bg">In use</span>
              ) : (
                <span className="au-tick grid h-[1.6em] w-[1.6em] place-items-center rounded-full text-[0.85em]">✓</span>
              )}
            </div>
          </Layer>
        );
      })}
    </Stage>
  );
}

// --- 04 Alongside your team: evening and next morning -----------------------------------------------

export function AlongsideVisual({ label }: { label: string }) {
  return (
    <Stage track="section" label={label} rest={[10, -12]} className="acc-ai">
      {/* Evening: the call is answered. */}
      <Layer x={1} y={3} w={28} h={35} slab faceClassName="!bg-[linear-gradient(170deg,#0d1430,#070a18)]">
        <div className="flex h-full flex-col p-[1.3em]">
          <p className="flex items-center justify-between text-[0.8em] text-white/45">
            <span className="flex items-center gap-[0.5em]">
              <svg viewBox="0 0 24 24" className="h-[1.2em] w-[1.2em] text-[#b9c7ff]" fill="currentColor">
                <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
              </svg>
              Evening · after closing
            </span>
            <span>19:42</span>
          </p>
          <p className="mt-[1em] flex items-center gap-[0.5em] text-[1.15em] font-semibold text-white">
            <Icon name="phone" className="h-[1.1em] w-[1.1em] acc-text" />
            Incoming call
          </p>
          <div className="mt-[0.9em] grid gap-[0.6em] text-[0.85em] leading-snug">
            <p className="mr-[2em] rounded-[0.9em] rounded-bl-[0.2em] bg-white/[0.08] px-[0.8em] py-[0.5em] text-white/80">Hi, I’d like to book a service visit next week.</p>
            <p className="ml-[2em] rounded-[0.9em] rounded-br-[0.2em] px-[0.8em] py-[0.5em] text-white acc-bg">Of course. Which days suit you, and what’s the address?</p>
            <p className="mr-[2em] rounded-[0.9em] rounded-bl-[0.2em] bg-white/[0.08] px-[0.8em] py-[0.5em] text-white/80">Tuesday or Thursday morning.</p>
          </div>
          <p className="mt-auto flex items-center gap-[0.5em] text-[0.8em] text-white/50">
            <Tick /> Availability checked in the calendar
          </p>
        </div>
      </Layer>

      <Draw d="M29 20 C 32 20, 32 16, 35 16" z={4} />

      {/* Next morning: ready for the team. */}
      <Layer x={33} y={6} w={25} h={22} z={6} lift={3} slab faceClassName="is-light" className="s3d-key">
        <div className="flex h-full flex-col p-[1.2em] text-[#1f2633]">
          <p className="flex items-center justify-between text-[0.75em] uppercase tracking-[0.12em] text-black/45">
            <span>Next morning · 08:30</span>
          </p>
          <p className="mt-[0.4em] text-[1.25em] font-semibold leading-tight">Ready for the team</p>
          <div className="mt-[0.7em] grid gap-[0.35em] text-[0.82em]">
            {[
              ["Request", "Service visit"],
              ["Preferred", "Tue or Thu, am"],
              ["Contact", "Collected"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-black/[0.07] pb-[0.3em]">
                <span className="text-black/50">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <p className="mt-auto text-[0.78em] font-medium text-[#2459bd]">Follows the normal booking process</p>
        </div>
      </Layer>

      {/* The unusual one goes to a person. */}
      <Layer x={35} y={31} w={22} h={6} z={9} lift={3} slab className="on-show" style={round(3)}>
        <div className="flex h-full items-center gap-[0.6em] px-[1.1em] text-[0.85em] text-white/80">
          <span className="grid h-[1.4em] w-[1.4em] place-items-center rounded-full bg-[#e0a24a] text-[0.8em] font-bold text-[#1d1408]">!</span>
          Unusual request · passed to the team
        </div>
      </Layer>
    </Stage>
  );
}

// --- 05 Close: the phone ---------------------------------------------------------------------------

export function CloseVisual({ label }: { label: string }) {
  return (
    <Stage track="section" label={label} rest={[10, -14]} className="acc-ai">
      <Layer x={5} y={1} w={20} h={40} slab style={round(2.8)} faceClassName="![background:#070b14]">
        <div className="flex h-full flex-col p-[1.2em] pt-[1.6em]">
          <span className="mx-auto block h-[0.6em] w-[5em] rounded-full bg-white/10" />
          <p className="mt-[1.2em] text-center text-[0.8em] text-white/45">Solvitech</p>
          <div className="mt-[1.2em] grid gap-[0.7em] text-[0.88em] leading-snug">
            <p className="ml-[2em] rounded-[1em] rounded-br-[0.2em] bg-white/[0.1] px-[0.8em] py-[0.55em] text-white/85">We keep missing calls after hours. Could AI help?</p>
            <p className="mr-[2em] rounded-[1em] rounded-bl-[0.2em] px-[0.8em] py-[0.55em] text-white acc-bg">Possibly. Let’s look at how the business works first.</p>
          </div>
          <div className="mt-auto rounded-full border border-white/10 px-[1em] py-[0.5em] text-[0.8em] text-white/35">Message</div>
        </div>
      </Layer>

      <Draw d="M25 22 C 29 22, 30 18, 33 18" z={3} />

      <Layer x={32} y={9} w={25} h={20} z={7} lift={3} slab className="s3d-key" faceClassName="!bg-[linear-gradient(160deg,#16223a,#0e1628)]">
        <div className="flex h-full flex-col p-[1.3em]">
          <p className="flex items-center gap-[0.5em] text-[0.85em] font-medium uppercase tracking-[0.16em] acc-text">
            <Icon name="calendar" className="h-[1.1em] w-[1.1em]" />
            A first conversation
          </p>
          <ul className="mt-[0.9em] grid gap-[0.6em] text-[1em] text-white/75">
            <li className="flex items-center gap-[0.55em]">
              <Tick /> Your challenge
            </li>
            <li className="flex items-center gap-[0.55em]">
              <Tick /> Whether AI fits
            </li>
            <li className="flex items-center gap-[0.55em]">
              <Tick /> A practical next step
            </li>
          </ul>
        </div>
      </Layer>
    </Stage>
  );
}
