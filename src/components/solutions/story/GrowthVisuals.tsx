import Stage, { Layer } from "@/components/home/directory/Stage";
import { round, turn } from "./parts";

/**
 * SEO & Digital Growth visuals (homepage stage system), each its own composition:
 *   hero    search lift   your listing rising out of a results page, with a map card
 *   signs   deep pages    result pages receding, your listing on the last one
 *   focus   loop          visibility, behaviour, enquiries, improvement in a cycle
 *   builds  audit report  a clipboard report whose checks fill in
 *   close   local map     pins on a town map, yours lifted
 * No rankings, traffic or enquiry figures are shown: nothing is promised.
 */

const ACC = "acc-growth";

function Result({ title, url, dim }: { title: string; url: string; dim?: boolean }) {
  return (
    <div className={`py-[0.55em] ${dim ? "opacity-60" : ""}`}>
      <p className="text-[0.72em] text-white/40">{url}</p>
      <p className="text-[0.95em] font-medium text-[#9fb8ff]">{title}</p>
      <span className="mt-[0.3em] block h-[0.35em] w-[85%] rounded-full bg-white/10" />
    </div>
  );
}

export function GrowthHero() {
  return (
    <Stage track="section" label="Illustration: a search results page for “boiler repair near me”, with your business's listing lifted out of the results beside a map card." rest={[9, -12]} className={ACC}>
      <Layer x={1} y={2} w={38} h={36} slab>
        <div className="p-[1.2em]">
          <div className="flex items-center gap-[0.6em] rounded-full border border-white/12 bg-white/[0.04] px-[1em] py-[0.5em] text-[0.9em] text-white/80">
            <svg viewBox="0 0 24 24" className="h-[1em] w-[1em] text-white/50" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="10.5" cy="10.5" r="6" />
              <path d="M15 15l5 5" strokeLinecap="round" />
            </svg>
            boiler repair near me
          </div>
          <div className="mt-[0.8em] divide-y divide-white/[0.06]">
            <Result title="Heating engineers in your area" url="directory.example" dim />
            <div className="h-[4.6em]" />
            <Result title="Boiler servicing guide" url="advice.example" dim />
            <Result title="Emergency repairs" url="another-firm.example" dim />
          </div>
        </div>
      </Layer>
      <Layer x={4} y={13.5} w={33} h={8} z={8} lift={3} slab className="s3d-key">
        <div className="px-[1.1em] py-[0.8em]">
          <p className="text-[0.72em] text-white/45">yourbusiness.co.uk › boiler-repair</p>
          <p className="text-[1.05em] font-semibold acc-text">Boiler Repair in Your Town</p>
          <p className="text-[0.75em] text-white/55">Clear prices, local engineers, easy online booking.</p>
        </div>
      </Layer>
      <Layer x={41} y={6} w={17} h={22} z={5} lift={2} slab>
        <div className="relative h-full overflow-hidden rounded-[inherit]">
          <svg viewBox="0 0 17 22" className="absolute inset-0 h-full w-full" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.5">
            <path d="M0 6h17M0 14h17M5 0v22M12 0v22M0 19l17-9" />
          </svg>
          <span className="absolute left-[44%] top-[34%] grid h-[2.4em] w-[2.4em] -translate-x-1/2 place-items-center rounded-full rounded-br-none rotate-45 acc-bg">
            <span className="h-[0.8em] w-[0.8em] -rotate-45 rounded-full bg-[#06140c]" />
          </span>
          <p className="absolute inset-x-0 bottom-0 bg-black/40 px-[0.8em] py-[0.5em] text-[0.75em] text-white/80">Business profile · Open today</p>
        </div>
      </Layer>
    </Stage>
  );
}

export function GrowthSigns() {
  const pages = [1, 2, 3, 4];
  return (
    <Stage track="section" label="Illustration: four pages of search results receding into the distance, with your business's listing only on the last one." rest={[14, 16]} className={ACC}>
      {pages.map((p, i) => {
        const last = i === pages.length - 1;
        return (
          <Layer key={p} x={20 - i * 5.5} y={2 + i * 3.6} w={34} h={24} z={(pages.length - 1 - i) * -4 + 12} slab className={last ? "" : "on-dim"} style={turn(-2 + i)}>
            <div className="p-[1em]">
              <p className="flex items-center justify-between text-[0.75em] uppercase tracking-[0.14em] text-white/40">
                Results · page {pages.length - i}
                {i === 0 && <span className="st-hit rounded-[0.3em] px-[0.5em] py-[0.2em] normal-case tracking-normal text-white">Your business</span>}
              </p>
              <div className="mt-[0.6em] grid gap-[0.6em]">
                {[0, 1, 2].map((r) => (
                  <span key={r} className="block h-[0.45em] rounded-full bg-white/10" style={{ width: `${70 + r * 8}%` }} />
                ))}
              </div>
            </div>
          </Layer>
        );
      })}
      <Layer x={2} y={30} w={20} h={6} z={16} lift={3} slab className="s3d-key" style={round(3)}>
        <p className="flex h-full items-center justify-center text-[0.95em] font-medium text-white/85">Where are we?</p>
      </Layer>
    </Stage>
  );
}

export function GrowthFocus() {
  const steps = [
    { n: "Visibility", x: 21, y: 1 },
    { n: "Behaviour", x: 40, y: 15 },
    { n: "Enquiries", x: 21, y: 29 },
    { n: "Improvement", x: 2, y: 15 },
  ];
  return (
    <Stage track="section" label="Illustration: four cards in a loop with arrows between them: visibility, behaviour, enquiries and improvement." rest={[14, -6]} className={ACC}>
      <Layer x={0} y={0} w={60} h={42} z={1}>
        <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <ellipse cx="30" cy="21" rx="19" ry="13.5" stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.2" strokeDasharray="0.6 0.5" />
          <ellipse cx="30" cy="21" rx="19" ry="13.5" stroke="rgb(var(--acc))" strokeWidth="0.2" pathLength={1} className="on-draw" />
          <path d="M44 9.5l1.6 0.6-0.4 1.6M45.5 32.5l-1.6 0.4-0.3-1.6M16 32.5l-1.6-0.6 0.4-1.6M14.5 9.5l1.6-0.4 0.3 1.6" stroke="rgb(var(--acc))" strokeWidth="0.25" />
        </svg>
      </Layer>
      {steps.map((s, i) => (
        <Layer key={s.n} x={s.x} y={s.y} w={18} h={11} z={4 + i * 1.5} lift={2 + (i === 2 ? 2 : 0)} slab className={i === 2 ? "s3d-key" : ""}>
          <div className="flex h-full flex-col justify-center px-[1em]">
            <span className="font-mono text-[0.75em] acc-text">0{i + 1}</span>
            <span className="text-[1.15em] font-semibold text-white/90">{s.n}</span>
          </div>
        </Layer>
      ))}
    </Stage>
  );
}

export function GrowthBuilds() {
  const checks = ["Technical SEO", "Local search", "Content architecture", "Analytics & tracking", "Conversion", "Reporting"];
  return (
    <Stage track="section" label="Illustration: a clipboard site report with six checks, technical SEO, local search, content, analytics, conversion and reporting, filling in." rest={[10, 12]} className={ACC}>
      <Layer x={10} y={2} w={30} h={38} z={0} slab faceClassName="!bg-[linear-gradient(170deg,#3a2f26,#241c16)]" style={turn(-3)} />
      <Layer x={12} y={5} w={26} h={33} z={2} lift={2} slab faceClassName="is-light" className="s3d-key" style={turn(-3)}>
        <div className="p-[1.3em] text-[#1f2633]">
          <p className="text-[0.75em] uppercase tracking-[0.14em] text-black/40">Site report</p>
          <p className="mt-[0.2em] text-[1.3em] font-semibold">What we checked</p>
          {checks.map((c) => (
            <p key={c} className="mt-[0.75em] flex items-center gap-[0.6em] border-b border-black/[0.07] pb-[0.5em] text-[0.9em]">
              <span className="au-tick grid h-[1.4em] w-[1.4em] shrink-0 place-items-center rounded-full text-[0.75em]">✓</span>
              {c}
            </p>
          ))}
        </div>
      </Layer>
      <Layer x={21} y={0.5} w={8} h={3.4} z={5} slab style={round(0.6)} faceClassName="!bg-[#9aa3b2] !border-[#9aa3b2]" />
      <Layer x={41} y={10} w={17} h={13} z={7} lift={3} slab>
        <div className="flex h-full flex-col justify-end gap-[0.4em] p-[1em]">
          <div className="flex h-[60%] items-end gap-[0.4em]">
            {[40, 55, 48, 70, 82].map((h, i) => (
              <span key={i} className="st-grow flex-1 rounded-t-[0.2em] acc-bg" style={{ height: `${h}%`, opacity: 0.45 + i * 0.12 }} />
            ))}
          </div>
          <p className="text-[0.72em] text-white/55">Enquiries tracked · sample</p>
        </div>
      </Layer>
      <Layer x={42} y={26} w={15} h={5} z={9} lift={3} slab style={round(2.5)}>
        <p className="flex h-full items-center justify-center text-[0.78em] text-white/75">Plain-English report</p>
      </Layer>
    </Stage>
  );
}

export function GrowthClose() {
  const pins = [
    { x: 10, y: 10, z: 3 },
    { x: 41, y: 8, z: 4 },
    { x: 46, y: 26, z: 3 },
    { x: 14, y: 27, z: 4 },
  ];
  return (
    <Stage track="section" label="Illustration: a town map with several business pins, one of them yours, raised above the rest." rest={[22, -10]} className={ACC}>
      <Layer x={1} y={3} w={58} h={36} slab faceClassName="![background:#0f1a17]">
        <svg viewBox="0 0 58 36" className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round">
          <path d="M0 12 C 14 10, 24 18, 58 14" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.4" />
          <path d="M20 0 C 22 12, 18 24, 24 36" stroke="rgb(255 255 255 / 0.12)" strokeWidth="1.4" />
          <path d="M0 28 C 20 26, 40 30, 58 26" stroke="rgb(255 255 255 / 0.08)" strokeWidth="0.8" />
          <path d="M40 0 C 38 10, 44 22, 40 36" stroke="rgb(255 255 255 / 0.08)" strokeWidth="0.8" />
          <path d="M44 16 C 50 18, 52 22, 58 22 L58 36 L46 36 Z" fill="rgb(110 210 150 / 0.06)" />
        </svg>
      </Layer>
      {pins.map((p, i) => (
        <Layer key={i} x={p.x} y={p.y} w={3} h={3} z={p.z} className="on-dim">
          <span className="block h-full w-full rotate-45 rounded-full rounded-br-none bg-white/30" />
        </Layer>
      ))}
      <Layer x={26} y={13} w={4.4} h={4.4} z={6} lift={5} className="s3d-key">
        <span className="grid h-full w-full rotate-45 place-items-center rounded-full rounded-br-none acc-bg">
          <span className="h-[1.3em] w-[1.3em] rounded-full bg-[#06140c]" />
        </span>
      </Layer>
      <Layer x={31.5} y={10} w={17} h={6} z={9} lift={5} slab className="on-show" style={round(1.2)}>
        <p className="flex h-full items-center px-[1em] text-[0.85em] text-white/85">Your business · open now</p>
      </Layer>
    </Stage>
  );
}
