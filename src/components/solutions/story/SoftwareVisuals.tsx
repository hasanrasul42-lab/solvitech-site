import Stage, { Layer } from "@/components/home/directory/Stage";
import { Draw, Tick, WindowBar, lines, pill, round, turn, yaw } from "./parts";

/**
 * Custom Software visuals (homepage stage system), each its own composition:
 *   hero    depth views     one system seen by a manager, an engineer and a customer
 *   signs   annotated sheet the spreadsheet everyone is afraid to touch
 *   focus   folding screen  requirements, architecture and scope side by side
 *   builds  skyline         six kinds of module standing on one platform
 *   close   sketch → screen a paper sketch becoming a working screen
 * Sample content is fictional.
 */

const ACC = "acc-software";

export function SoftwareHero() {
  return (
    <Stage track="section" label="Illustration: one job-management system seen three ways: a manager's overview, an engineer's job list on a phone and a customer's portal showing their job status." rest={[9, -12]} className={ACC}>
      <Layer x={1} y={2} w={40} h={26} slab>
        <WindowBar title="Operations · Overview" right={<span className={pill}>Manager</span>} />
        <div className="grid grid-cols-3 gap-[0.7em] p-[1.1em]">
          {[
            ["Open jobs", "38"],
            ["Booked today", "12"],
            ["Awaiting parts", "5"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[0.5em] border border-white/[0.07] bg-white/[0.03] px-[0.7em] py-[0.5em]">
              <p className="text-[0.75em] text-white/45">{k}</p>
              <p className="text-[1.4em] font-semibold text-white/90">{v}</p>
            </div>
          ))}
        </div>
        <div className="mx-[1.1em] grid gap-[0.35em] text-[0.8em] text-white/55">
          {["J-2208 · Boiler service", "J-2209 · Install", "J-2210 · Repair"].map((j) => (
            <p key={j} className="border-b border-white/[0.06] pb-[0.3em]">
              {j}
            </p>
          ))}
        </div>
      </Layer>
      <Layer x={42} y={4} w={15} h={30} z={6} lift={2} slab style={round(2)} faceClassName="![background:#070b14]">
        <div className="p-[1em] pt-[1.4em] text-[0.8em]">
          <p className="text-center text-white/40">Engineer · Today</p>
          {["09:00 J-2208", "11:30 J-2210", "14:00 J-2211"].map((j, i) => (
            <p key={j} className={`mt-[0.6em] rounded-[0.5em] px-[0.6em] py-[0.5em] ${i === 1 ? "acc-bg text-[#04121f] font-medium" : "bg-white/[0.06] text-white/70"}`}>
              {j}
            </p>
          ))}
        </div>
      </Layer>
      <Layer x={10} y={22} w={27} h={16} z={10} lift={3} slab faceClassName="is-light" className="s3d-key">
        <div className="flex h-full flex-col p-[1.1em] text-[#1f2633]">
          <p className="text-[0.75em] uppercase tracking-[0.14em] text-black/40">Customer portal</p>
          <p className="mt-[0.2em] text-[1.2em] font-semibold">Your repair · J-2210</p>
          <div className="mt-auto flex items-center gap-[0.4em] text-[0.78em]">
            {["Booked", "On the way", "Complete"].map((st, i) => (
              <span key={st} className={`rounded-full px-[0.6em] py-[0.15em] ${i === 1 ? "bg-[#1f2633] text-white" : "bg-black/[0.06] text-black/50"}`}>
                {st}
              </span>
            ))}
          </div>
        </div>
      </Layer>
    </Stage>
  );
}

export function SoftwareSigns() {
  const cells = Array.from({ length: 30 }, (_, i) => i);
  return (
    <Stage track="section" label="Illustration: a crowded spreadsheet with several near-identical tabs, a note that only one person understands a formula, a broken reference and an email chain asking for a job update." rest={[12, 10]} className={ACC}>
      <Layer x={2} y={3} w={44} h={31} slab faceClassName="is-light">
        <div className="grid h-[calc(100%-2.6em)] grid-cols-6 text-[0.72em] text-black/45">
          {cells.map((i) => (
            <span key={i} className={`border-b border-r border-black/[0.07] px-[0.4em] py-[0.5em] ${i < 6 ? "bg-black/[0.04] font-semibold text-black/60" : ""} ${i === 21 ? "st-hit font-semibold text-[#b3261e]" : ""}`}>
              {i < 6 ? ["Job", "Client", "Engineer", "Date", "Status", "Total"][i] : i === 21 ? "#REF!" : i % 6 === 0 ? `J-${2200 + i}` : "···"}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-[2.6em] items-center gap-[0.3em] border-t border-black/10 bg-black/[0.03] px-[0.6em] text-[0.7em]">
          {["Jobs_v7_FINAL", "Copy of Jobs", "DO NOT EDIT", "Sheet4"].map((t, i) => (
            <span key={t} className={`rounded-t-[0.3em] px-[0.6em] py-[0.25em] ${i === 0 ? "bg-white text-black/70" : "text-black/40"}`}>
              {t}
            </span>
          ))}
        </div>
      </Layer>
      <Layer x={34} y={2} w={17} h={11} z={6} lift={2} slab faceClassName="![background:#f3d77a] !border-[#f3d77a]" style={{ ...turn(6), ...round(0.4) }}>
        <p className="p-[1em] text-[0.95em] font-medium leading-snug text-[#3a3012]">Only Dave knows how this formula works</p>
      </Layer>
      <Layer x={26} y={21} w={19} h={6.5} z={9} lift={3} slab style={round(1.2)}>
        <p className="p-[0.9em] text-[0.85em] text-white/75">Which tab is the current one?</p>
      </Layer>
      <Layer x={40} y={28} w={19} h={9} z={12} lift={4} slab className="s3d-key">
        <div className="p-[0.9em] text-[0.82em]">
          <p className="truncate font-medium text-white/85">Re: Re: Fwd: job status?</p>
          <p className="mt-[0.3em] text-white/45">“Any update on our repair?”</p>
        </div>
      </Layer>
    </Stage>
  );
}

export function SoftwareFocus() {
  const panel = "flex h-full flex-col p-[1.2em]";
  const head = "text-[0.8em] font-semibold uppercase tracking-[0.14em] acc-text";
  return (
    <Stage track="section" label="Illustration: three panels standing like a folding screen: operational requirements listing roles, an architecture sketch of data and access, and a product scope splitting version one from later." rest={[8, 0]} className={ACC}>
      <Layer x={2} y={4} w={18} h={32} z={3} lift={1} slab style={yaw(18)}>
        <div className={panel}>
          <p className={head}>Requirements</p>
          <div className="mt-[0.9em] grid gap-[0.5em] text-[0.85em] text-white/70">
            {["Office: book & assign", "Engineer: job sheet", "Customer: track status", "Exceptions: parts delay"].map((r) => (
              <p key={r} className="rounded-[0.4em] bg-white/[0.05] px-[0.6em] py-[0.45em]">
                {r}
              </p>
            ))}
          </div>
        </div>
      </Layer>
      <Layer x={21} y={2} w={18} h={34} z={0} lift={3} slab className="s3d-key">
        <div className={panel}>
          <p className={head}>Architecture</p>
          <svg viewBox="0 0 36 40" className="mt-[1em] w-full" fill="none" stroke="rgb(255 255 255 / 0.35)" strokeWidth="0.6">
            <rect x="11" y="2" width="14" height="7" rx="1.5" />
            <rect x="2" y="17" width="12" height="7" rx="1.5" />
            <rect x="22" y="17" width="12" height="7" rx="1.5" />
            <rect x="11" y="31" width="14" height="7" rx="1.5" stroke="rgb(var(--acc))" />
            <path d="M18 9v4H8v4M18 13h10v4M8 24v4h10v3M28 24v4H18" />
          </svg>
          <p className="mt-auto text-[0.78em] text-white/45">Data · access · hosting</p>
        </div>
      </Layer>
      <Layer x={40} y={4} w={18} h={32} z={3} lift={1} slab style={yaw(-18)}>
        <div className={panel}>
          <p className={head}>Scope</p>
          <p className="mt-[0.9em] text-[0.78em] uppercase tracking-[0.12em] text-white/40">Version one</p>
          {["Job board", "Assignments", "Job sheets"].map((r) => (
            <p key={r} className="mt-[0.4em] flex items-center gap-[0.5em] text-[0.85em] text-white/75">
              <Tick /> {r}
            </p>
          ))}
          <p className="mt-[1em] text-[0.78em] uppercase tracking-[0.12em] text-white/40">Later</p>
          <p className="mt-[0.4em] text-[0.85em] text-white/40">Customer portal</p>
        </div>
      </Layer>
    </Stage>
  );
}

export function SoftwareBuilds() {
  const blocks = [
    { name: "Operations", h: 22 },
    { name: "Scheduling", h: 17 },
    { name: "Portals", h: 13 },
    { name: "Dashboards", h: 19 },
    { name: "Internal tools", h: 11 },
    { name: "Extensions", h: 8 },
  ];
  return (
    <Stage track="section" label="Illustration: six modules of different heights standing on one platform: operations, scheduling, portals, dashboards, internal tools and extensions." rest={[16, -14]} className={ACC}>
      <Layer x={2} y={30} w={56} h={8} z={0} slab faceClassName="!bg-[linear-gradient(170deg,#18233a,#0d1424)]">
        <div className="flex h-full items-center justify-between px-[1.2em] text-[0.82em]">
          <span className="font-semibold uppercase tracking-[0.16em] acc-text">Your system</span>
          <span className="text-white/40">One place for the work</span>
        </div>
      </Layer>
      {blocks.map((b, i) => (
        <Layer
          key={b.name}
          x={4 + i * 9}
          y={30 - b.h}
          w={7.6}
          h={b.h}
          z={3 + i * 1.2}
          lift={i === 0 ? 3 : 1 + i * 0.4}
          slab
          className={i === 0 ? "s3d-key" : ""}
          style={round(0.7)}
          faceClassName="!bg-[linear-gradient(180deg,rgb(var(--acc)/0.32),rgb(var(--acc)/0.06)_45%,#0d1424)]"
        >
          <div className="flex h-full flex-col justify-between p-[0.7em]">
            <span className="block h-[0.35em] w-[2.4em] rounded-full acc-bg" />
            <p className="text-[0.82em] font-semibold leading-tight text-white">{b.name}</p>
          </div>
        </Layer>
      ))}
    </Stage>
  );
}

export function SoftwareClose() {
  return (
    <Stage track="section" label="Illustration: a pencil sketch of a job board on paper, and the same layout as a finished screen in front of it." rest={[10, -12]} className={ACC}>
      <Layer x={2} y={4} w={30} h={24} z={0} slab faceClassName="is-light" style={turn(-4)}>
        <svg viewBox="0 0 30 24" className="absolute inset-0 h-full w-full" fill="none" stroke="#5a6070" strokeWidth="0.18" strokeDasharray="0.6 0.3">
          <rect x="2" y="2" width="26" height="3" rx="0.6" />
          <rect x="2" y="7" width="7" height="15" rx="0.6" />
          <rect x="11" y="7" width="7.5" height="6" rx="0.6" />
          <rect x="20.5" y="7" width="7.5" height="6" rx="0.6" />
          <rect x="11" y="15" width="17" height="7" rx="0.6" />
          <path d="M3.5 3.5h8M3.5 10h4M3.5 12.5h4M3.5 15h4" strokeDasharray="none" />
        </svg>
      </Layer>
      <Draw d="M30 15 C 33 15, 33 18, 36 18" z={4} />
      <Layer x={26} y={12} w={32} h={25} z={7} lift={3} slab className="s3d-key">
        <WindowBar title="Job board" />
        <div className="flex h-[calc(100%-2.9em)] gap-[0.7em] p-[0.9em]">
          <div className="w-[7em] shrink-0 rounded-[0.4em] bg-white/[0.04] p-[0.6em]">{lines(["90%", "70%", "80%"], "bg-white/[0.12]")}</div>
          <div className="grid flex-1 grid-cols-2 gap-[0.6em]">
            <div className="rounded-[0.4em] bg-white/[0.06] p-[0.6em] text-[0.75em] text-white/70">Today · 12</div>
            <div className="rounded-[0.4em] p-[0.6em] text-[0.75em] font-medium text-[#04121f] acc-bg">Unassigned · 3</div>
            <div className="col-span-2 rounded-[0.4em] bg-white/[0.04] p-[0.6em]">{lines(["85%", "60%"], "bg-white/[0.1]")}</div>
          </div>
        </div>
      </Layer>
    </Stage>
  );
}
