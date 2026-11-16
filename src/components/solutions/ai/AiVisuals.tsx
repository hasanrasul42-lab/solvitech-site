import type { CSSProperties, ReactNode } from "react";
import Stage, { Layer } from "@/components/home/directory/Stage";
import { AI_SOURCES } from "@/config/aiPage";

/**
 * The AI page's section visuals, built with the homepage's stage system
 * (components/home/directory: Stage, Layer, directory.css): layered surfaces
 * in one CSS 3D space, a resting angle, a small pointer tilt, and one emphasis
 * on hover / focus / in view. Each uses a different composition so no two
 * read alike:
 *
 *   Hero      orbit      an assistant with its sources floating around it
 *   Pain      pile       scattered files, notes and messages; one matters
 *   Offers    staircase  three steps rising towards the viewer
 *   Apps      mosaic     four capability tiles; one produces a result
 *   Approach  cascade    four stage bars stepping forward
 *   Trust     gates      three frames in depth that an answer passes through
 *   Close     phone      a conversation and a first-call card
 *
 * Sample content is fictional. Sizes are em on the 60 x 42 em canvas.
 */

const turn = (deg: number): CSSProperties => ({ rotate: `${deg}deg` });

const lines = (ws: string[], tone = "bg-black/[0.12]") => (
  <div className="grid gap-[0.5em]">
    {ws.map((w, i) => (
      <span key={i} className={`block h-[0.45em] rounded-full ${tone}`} style={{ width: w }} />
    ))}
  </div>
);

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

// --- 01 Hero: orbit -----------------------------------------------------------------------------

export function HeroVisual({ label }: { label: string }) {
  const sources = [
    { s: AI_SOURCES[0], x: 1, y: 4, z: 0, r: -6 },
    { s: AI_SOURCES[1], x: 46, y: 2, z: 6, r: 5 },
    { s: AI_SOURCES[2], x: 45, y: 28, z: 11, r: -4 },
  ];
  return (
    <Stage label={label} rest={[8, -10]} className="acc-ai">
      {sources.map(({ s, x, y, z, r }, i) => (
        <Layer key={s.id} x={x} y={y} w={13} h={10} z={z} lift={1 + i} slab faceClassName="is-light" style={turn(r)}>
          <div className="p-[0.9em] text-[#1f2633]">
            <p className="text-[0.8em] font-semibold leading-tight">{s.title}</p>
            <p className="mt-[0.2em] text-[0.62em] uppercase tracking-[0.12em] text-black/40">{s.section.split(" · ")[0]}</p>
            <div className="mt-[0.7em]">{lines(["90%", "70%", "80%"])}</div>
          </div>
        </Layer>
      ))}
      <Draw d="M14 9 L 17 13 M46 7.5 L 43 11 M45 32 L 43 29" z={3} />

      {/* The assistant: centre of the orbit. */}
      <Layer x={16} y={8} w={28} h={25} z={4} lift={3} slab className="s3d-key" faceClassName="!bg-[linear-gradient(160deg,#16223a,#0e1628)]">
        <div className="flex h-full flex-col p-[1.3em]">
          <p className="flex items-center gap-[0.5em] text-[0.85em] font-medium uppercase tracking-[0.16em] acc-text">
            <span className="h-[0.5em] w-[0.5em] rounded-full acc-bg" />
            Knowledge assistant
          </p>
          <p className="mt-[0.9em] self-end rounded-[0.8em] rounded-br-[0.2em] bg-white/[0.08] px-[0.8em] py-[0.45em] text-[0.95em] text-white/85">
            How do we handle an urgent enquiry?
          </p>
          <p className="mt-[0.9em] text-[1.3em] font-semibold leading-[1.25] tracking-[-0.01em] text-white">
            Mark it urgent and assign an owner on the same working day.
          </p>
          <div className="mt-auto flex flex-wrap gap-[0.4em]">
            {["[1] Guide", "[2] Rules", "[3] Checklist"].map((c) => (
              <span key={c} className="rounded-[0.4em] bg-white/[0.07] px-[0.55em] py-[0.15em] text-[0.8em] text-white/60">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 02 Pain: the pile --------------------------------------------------------------------------

export function PainVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[12, 10]} className="acc-ai">
      {/* An old PDF. */}
      <Layer x={2} y={3} w={15} h={19} z={0} slab faceClassName="is-light" className="on-dim" style={turn(-7)}>
        <div className="p-[1em] text-[#1f2633]">
          <p className="text-[0.8em] font-semibold">Escalation rules (old).pdf</p>
          <div className="mt-[0.8em]">{lines(["92%", "75%", "86%", "60%", "80%", "70%"])}</div>
        </div>
      </Layer>
      {/* A spreadsheet. */}
      <Layer x={20} y={2} w={21} h={12} z={2} slab className="on-dim" style={turn(3)}>
        <div className="grid h-full grid-cols-3 text-[0.75em] text-white/50">
          {["Order", "Status", "Owner", "2288", "Open", "—", "2290", "Closed", "Ana", "2291", "Open", "—"].map((c, i) => (
            <span key={i} className={`border-b border-r border-white/[0.06] px-[0.6em] py-[0.35em] ${i < 3 ? "text-white/70" : ""}`}>
              {c}
            </span>
          ))}
        </div>
      </Layer>
      {/* A sticky note. */}
      <Layer x={43} y={5} w={13} h={12} z={4} slab className="on-dim" faceClassName="![background:#f3d77a] !border-[#f3d77a]" style={{ ...turn(7), ["--r" as string]: "0.4em" }}>
        <p className="p-[1em] text-[1em] font-medium leading-snug text-[#3a3012]">Ask Sam where the handover notes are?</p>
      </Layer>
      {/* A team chat. */}
      <Layer x={41} y={24} w={17} h={8.5} z={5} slab className="on-dim" style={{ ...turn(-3), ["--r" as string]: "1.4em" }}>
        <div className="p-[0.9em] text-[0.82em] leading-snug text-white/65">
          <span className="text-white/40">Team chat · </span>Has anyone got the latest returns process?
        </div>
      </Layer>
      {/* A reminder. */}
      <Layer x={3} y={27} w={16} h={9} z={3} slab className="on-dim" style={turn(4)}>
        <div className="flex h-full items-center gap-[0.7em] p-[1em] text-[0.85em] text-white/65">
          <span className="grid h-[2.2em] w-[2.2em] shrink-0 place-items-center rounded-[0.5em] bg-[#d98f3a]/20 text-[#ffb36b]">!</span>
          Review supplier terms · overdue
        </div>
      </Layer>

      {/* The one that matters. */}
      <Layer x={17} y={15} w={24} h={15} z={8} lift={4} slab className="s3d-key" style={turn(-2)}>
        <div className="flex h-full flex-col p-[1.2em]">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#d98f3a] px-[0.8em] py-[0.15em] text-[0.8em] font-semibold text-[#1d1408]">Urgent</span>
            <span className="text-[0.8em] text-white/40">08:47</span>
          </div>
          <p className="mt-[0.6em] text-[1.4em] font-semibold leading-tight tracking-[-0.02em] text-white">No heating · 14 Elm Road</p>
          <p className="mt-auto text-[0.92em] text-white/60">Which rule applies, and who picks it up?</p>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 03 Offers: the staircase ---------------------------------------------------------------------

export function OffersVisual({ label }: { label: string }) {
  const step = "flex h-full flex-col p-[1.2em]";
  const tag = "font-mono text-[0.85em] acc-text";
  return (
    <Stage label={label} rest={[10, -16]} className="acc-violet">
      <Draw d="M10 26 C 18 26, 22 21, 30 21 S 42 16, 50 16" z={1} />

      <Layer x={1} y={14} w={18} h={23} z={0} lift={1} slab>
        <div className={step}>
          <span className={tag}>01</span>
          <p className="mt-[0.3em] text-[1.15em] font-semibold text-white">Discovery</p>
          <svg viewBox="0 0 40 30" className="mt-[0.9em] w-full" fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="0.8">
            <rect x="2" y="2" width="14" height="8" rx="2" />
            <rect x="24" y="2" width="14" height="8" rx="2" />
            <rect x="24" y="20" width="14" height="8" rx="2" stroke="rgb(var(--acc))" strokeWidth="1.4" />
            <path d="M16 6h8M31 10v10" />
          </svg>
          <p className="mt-auto text-[0.85em] text-white/50">Where AI fits</p>
        </div>
      </Layer>

      <Layer x={21} y={9} w={18} h={23} z={6} lift={2.5} slab faceClassName="!bg-[linear-gradient(160deg,#1b1a3a,#100f26)]">
        <div className={step}>
          <span className={tag}>02</span>
          <p className="mt-[0.3em] text-[1.15em] font-semibold text-white">Custom AI</p>
          <div className="mt-[0.9em] grid gap-[0.4em]">
            <span className="self-end rounded-[0.6em] bg-white/[0.08] px-[0.6em] py-[0.3em] text-[0.75em] text-white/70">Summarise this contract</span>
            <span className="rounded-[0.6em] border border-[rgb(var(--acc)/0.6)] px-[0.6em] py-[0.3em] text-[0.75em] text-white/80">12-month term · 30-day notice</span>
          </div>
          <p className="mt-auto text-[0.85em] text-white/50">A tool built for you</p>
        </div>
      </Layer>

      <Layer x={41} y={4} w={18} h={23} z={12} lift={4} slab className="s3d-key">
        <div className={step}>
          <span className={tag}>03</span>
          <p className="mt-[0.3em] text-[1.15em] font-semibold text-white">Integration</p>
          <div className="mt-[1.1em] flex items-center justify-between">
            <span className="grid h-[3.4em] w-[3.4em] place-items-center rounded-[0.7em] bg-white/[0.07] text-[0.75em] text-white/70">CRM</span>
            <span className="h-[0.2em] flex-1 acc-bg" />
            <span className="grid h-[3.4em] w-[3.4em] place-items-center rounded-[0.7em] acc-bg text-[0.75em] font-semibold text-white">AI</span>
            <span className="h-[0.2em] flex-1 acc-bg" />
            <span className="grid h-[3.4em] w-[3.4em] place-items-center rounded-[0.7em] bg-white/[0.07] text-[0.75em] text-white/70">Inbox</span>
          </div>
          <p className="mt-auto text-[0.85em] text-white/50">In the tools you use</p>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 05 Apps: the mosaic ----------------------------------------------------------------------------

const ICONS: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" strokeLinecap="round" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
      <path d="M9 11h6M9 14.5h6M9 18h4" strokeLinecap="round" />
    </>
  ),
  decide: <path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" strokeLinecap="round" />,
  ops: (
    <>
      <path d="M4 6h11a3 3 0 010 6H9a3 3 0 000 6h11" strokeLinecap="round" />
      <path d="M17 15l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function AppsVisual({ label }: { label: string }) {
  const tiles = [
    { icon: "search", name: "Knowledge search", x: 3, y: 4, z: 0 },
    { icon: "doc", name: "Document understanding", x: 19, y: 4, z: 4, key: true },
    { icon: "decide", name: "Decision support", x: 3, y: 21, z: 2 },
    { icon: "ops", name: "AI-assisted operations", x: 19, y: 21, z: 6 },
  ];
  return (
    <Stage label={label} rest={[14, 12]} className="acc-automation">
      {tiles.map((t) => (
        <Layer
          key={t.name}
          x={t.x}
          y={t.y}
          w={15}
          h={15}
          z={t.z}
          lift={t.key ? 4 : 0}
          slab
          className={t.key ? "s3d-key" : "on-dim"}
          style={{ ["--r" as string]: "1.6em" }}
        >
          <div className="flex h-full flex-col justify-between p-[1.2em]">
            <svg viewBox="0 0 24 24" className={`h-[3.2em] w-[3.2em] ${t.key ? "acc-text" : "text-white/50"}`} fill="none" stroke="currentColor" strokeWidth="1.8">
              {ICONS[t.icon]}
            </svg>
            <p className="text-[0.95em] font-medium leading-tight text-white/85">{t.name}</p>
          </div>
        </Layer>
      ))}

      <Draw d="M34 11 C 38 11, 38 13, 41 13" z={6} />

      {/* What the document tile produces. */}
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
      <Layer x={42} y={25.5} w={15} h={4.2} z={12} lift={3} slab className="on-show" style={{ ["--r" as string]: "2.1em" }}>
        <div className="flex h-full items-center gap-[0.5em] px-[1em] text-[0.88em] text-white/80">
          <Tick dark="#04201c" /> Ready to check
        </div>
      </Layer>
    </Stage>
  );
}

// --- 06 Approach: the cascade -------------------------------------------------------------------------

const STAGES: [string, string][] = [
  ["Discover", "Objective, current work, sources"],
  ["Design", "Behaviour, risks, measures of success"],
  ["Engineer", "Build and test with real cases"],
  ["Launch & evolve", "Introduce, review, improve"],
];

export function ApproachVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[8, 14]} className="acc-ai">
      {STAGES.map(([name, note], i) => {
        const last = i === STAGES.length - 1;
        return (
          <Layer
            key={name}
            x={2 + i * 5}
            y={3 + i * 9.2}
            w={40}
            h={7.4}
            z={i * 3}
            lift={last ? 4 : i}
            slab
            className={last ? "s3d-key" : ""}
            style={{ ["--r" as string]: "1.2em" }}
          >
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

// --- 07 Trust: the gates ----------------------------------------------------------------------------

export function TrustVisual({ label }: { label: string }) {
  const gates = [
    { name: "Access", z: 0 },
    { name: "Evidence", z: 7 },
    { name: "Approval", z: 14 },
  ];
  return (
    <Stage label={label} rest={[8, -24]} className="acc-ai">
      {/* The question, far back. */}
      <Layer x={21} y={13} w={18} h={9} z={-7} slab style={{ ["--r" as string]: "1.2em" }}>
        <p className="p-[1em] text-[0.9em] leading-snug text-white/70">When should an urgent enquiry be escalated?</p>
      </Layer>

      {gates.map((g, i) => (
        <Layer key={g.name} x={15} y={4} w={30} h={30} z={g.z} lift={i * 1.5}>
          <div className={`ai-gate absolute inset-0 rounded-[2em] border-[0.3em] g${i}`} />
          <span
            style={{ left: `${1.2 + i * 9.5}em` }}
            className="absolute -top-[1.3em] flex items-center gap-[0.5em] rounded-full border border-white/15 bg-[#0d1525] px-[0.9em] py-[0.35em] text-[0.85em] text-white/80"
          >
            <span className="font-mono acc-text">0{i + 1}</span>
            {g.name}
          </span>
        </Layer>
      ))}

      {/* The answer that came through. */}
      <Layer x={24} y={22} w={20} h={10} z={19} lift={3} slab className="s3d-key">
        <div className="flex h-full flex-col justify-center p-[1em]">
          <p className="text-[0.95em] font-semibold leading-snug text-white">Escalate after two working hours</p>
          <p className="mt-[0.3em] flex items-center gap-[0.4em] text-[0.8em] text-white/55">
            <Tick /> Approved by a team lead
          </p>
        </div>
      </Layer>
    </Stage>
  );
}

// --- 08 Close: the phone ---------------------------------------------------------------------------

export function CloseVisual({ label }: { label: string }) {
  return (
    <Stage label={label} rest={[10, -14]} className="acc-ai">
      {/* The phone. */}
      <Layer x={5} y={1} w={20} h={40} slab style={{ ["--r" as string]: "2.8em" }} faceClassName="![background:#070b14]">
        <div className="flex h-full flex-col p-[1.2em] pt-[1.6em]">
          <span className="mx-auto block h-[0.6em] w-[5em] rounded-full bg-white/10" />
          <p className="mt-[1.2em] text-center text-[0.8em] text-white/45">Solvitech</p>
          <div className="mt-[1.2em] grid gap-[0.7em] text-[0.88em] leading-snug">
            <p className="ml-[2em] rounded-[1em] rounded-br-[0.2em] bg-white/[0.1] px-[0.8em] py-[0.55em] text-white/85">
              We spend hours finding answers in old documents. Could AI help?
            </p>
            <p className="mr-[2em] rounded-[1em] rounded-bl-[0.2em] px-[0.8em] py-[0.55em] text-white acc-bg">
              Possibly. Let’s look at where the time goes first.
            </p>
          </div>
          <div className="mt-auto rounded-full border border-white/10 px-[1em] py-[0.5em] text-[0.8em] text-white/35">Message</div>
        </div>
      </Layer>

      <Draw d="M25 22 C 29 22, 30 18, 33 18" z={3} />

      {/* The next step. */}
      <Layer x={32} y={9} w={25} h={20} z={7} lift={3} slab className="s3d-key" faceClassName="!bg-[linear-gradient(160deg,#16223a,#0e1628)]">
        <div className="flex h-full flex-col p-[1.3em]">
          <p className="flex items-center gap-[0.5em] text-[0.85em] font-medium uppercase tracking-[0.16em] acc-text">
            <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em]" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
              <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
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
