import Stage, { Layer } from "@/components/home/directory/Stage";
import { Tick, lines, round, turn } from "@/components/solutions/story/parts";

/**
 * Visuals for the Websites page's own sections (homepage stage system). The
 * hero, need, experience, services and close sections reuse the Websites
 * visuals in story/WebsiteVisuals.tsx; these three are new compositions:
 *
 *   quality    device row   one site on desktop, tablet and phone, with checks
 *   scenarios  three sites  starter, growing and modernised, stepping forward
 *   costs      scope sheet  essentials and later additions, plus ongoing items
 *
 * Sample content is fictional. Sizes are em on the 60 x 42 em canvas.
 */

const ACC = "acc-websites";

function Page({ compact }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-[0.7em] p-[0.9em]">
      <div className="flex items-center justify-between text-[0.7em] text-white/55">
        <span className="font-semibold text-white/85">Harbour Physio</span>
        {compact ? <span className="text-[1.2em] leading-none">≡</span> : <span className="flex gap-[1em]"><span>Treatments</span><span>About</span><span>Contact</span></span>}
      </div>
      <p className={`${compact ? "text-[0.95em]" : "text-[1.3em]"} font-semibold leading-tight text-white`}>Back to moving well</p>
      <span className="w-fit rounded-full px-[0.8em] py-[0.25em] text-[0.7em] font-medium text-white acc-bg">Book an assessment</span>
      <div className={`mt-auto grid gap-[0.4em] ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
        {(compact ? [0, 1] : [0, 1, 2]).map((i) => (
          <span key={i} className="h-[2.2em] rounded-[0.4em] bg-white/[0.06]" />
        ))}
      </div>
    </div>
  );
}

export function QualityVisual({ label }: { label: string }) {
  return (
    <Stage track="section" label={label} rest={[12, -12]} className={ACC}>
      <Layer x={1} y={4} w={36} h={25} slab>
        <Page />
      </Layer>
      <Layer x={8} y={29} w={22} h={1.6} z={1} slab style={round(0.6)} />
      <Layer x={31} y={11} w={16} h={22} z={5} lift={2} slab style={round(1.2)}>
        <div className="h-full p-[0.3em] text-[0.8em]">
          <Page compact />
        </div>
      </Layer>
      <Layer x={45} y={17} w={10} h={19} z={10} lift={4} slab style={round(1.6)} faceClassName="![background:#070b14]" className="s3d-key">
        <div className="h-full pt-[0.6em] text-[0.62em]">
          <Page compact />
        </div>
      </Layer>
      <Layer x={2} y={32} w={26} h={7.5} z={8} lift={3} slab faceClassName="is-light">
        <div className="grid gap-[0.35em] p-[0.8em] text-[0.72em] text-[#1f2633]">
          {["Clear navigation", "Loads quickly", "Search-friendly structure"].map((c) => (
            <p key={c} className="flex items-center gap-[0.5em]">
              <Tick dark="#ffffff" /> {c}
            </p>
          ))}
        </div>
      </Layer>
    </Stage>
  );
}

export function ScenariosVisual({ label }: { label: string }) {
  const sites = [
    { stage: "Starting out", extra: null },
    {
      stage: "Ready to grow",
      extra: (
        <div className="grid grid-cols-2 gap-[0.4em] text-[0.7em]">
          <span className="rounded-[0.35em] border border-white/15 px-[0.4em] py-[0.25em] text-white/70">Book online</span>
          <span className="rounded-[0.35em] border border-white/15 px-[0.4em] py-[0.25em] text-white/70">Shop · 3</span>
        </div>
      ),
    },
    {
      stage: "Ready for change",
      extra: (
        <div className="relative h-[3.6em] overflow-hidden rounded-[0.4em] bg-[#e9e4d8]">
          <p className="p-[0.4em] font-serif text-[0.6em] font-bold text-[#4a4433] line-through decoration-[#c0392b]/70">WELCOME TO OUR SITE</p>
          <span className="absolute inset-y-0 right-0 w-[55%] bg-[linear-gradient(90deg,transparent,rgb(150_140_255/0.55))]" />
        </div>
      ),
    },
  ];
  return (
    <Stage track="section" label={label} rest={[10, 14]} className={ACC}>
      {sites.map((s, i) => (
        <Layer key={s.stage} x={1 + i * 19.5} y={10 - i * 3.5} w={18} h={24 + i * 3} z={i * 4} lift={1 + i * 1.5} slab className={i === 1 ? "s3d-key" : ""} style={turn((i - 1) * 3)}>
          <div className="flex h-full flex-col gap-[0.6em] p-[0.9em]">
            <p className="text-[0.66em] font-semibold uppercase tracking-[0.14em] acc-text">
              0{i + 1} {s.stage}
            </p>
            <span className="h-[1.6em] rounded-[0.35em] bg-white/[0.07]" />
            {lines(["90%", "70%", "80%"], "bg-white/[0.12]")}
            {s.extra}
            <span className="mt-auto w-fit rounded-full px-[0.8em] py-[0.25em] text-[0.68em] font-medium text-white acc-bg">Get in touch</span>
          </div>
        </Layer>
      ))}
    </Stage>
  );
}

export function CostsVisual({ label }: { label: string }) {
  const essential = ["Service pages", "Enquiry form", "Mobile layout"];
  const later = ["Online booking", "Customer accounts"];
  return (
    <Stage track="section" label={label} rest={[10, -12]} className={ACC}>
      <Layer x={3} y={2} w={30} h={37} slab faceClassName="is-light" style={turn(-2)}>
        <div className="p-[1.1em] text-[0.8em] text-[#1f2633]">
          <p className="text-[1.25em] font-semibold">Project scope</p>
          <p className="mt-[1em] text-[0.8em] font-semibold uppercase tracking-[0.14em] text-black/45">Essential</p>
          {essential.map((e) => (
            <p key={e} className="mt-[0.45em] flex items-center gap-[0.5em]">
              <Tick dark="#ffffff" /> {e}
            </p>
          ))}
          <p className="mt-[1.1em] text-[0.8em] font-semibold uppercase tracking-[0.14em] text-black/45">Later</p>
          {later.map((e) => (
            <p key={e} className="mt-[0.45em] flex items-center gap-[0.5em] text-black/50">
              <span className="h-[1.1em] w-[1.1em] rounded-full border border-dashed border-black/30" /> {e}
            </p>
          ))}
        </div>
      </Layer>
      <Layer x={31} y={7} w={24} h={20} z={8} lift={3} slab className="s3d-key">
        <div className="p-[1em] text-[0.78em]">
          <p className="font-semibold text-white/85">Ongoing</p>
          {["Domain", "Hosting", "Maintenance", "Content updates"].map((o) => (
            <p key={o} className="mt-[0.55em] flex items-center justify-between border-b border-white/[0.07] pb-[0.35em] text-white/65">
              <span>{o}</span>
              <span className="text-[0.85em] acc-text">Agreed</span>
            </p>
          ))}
        </div>
      </Layer>
      <Layer x={35} y={30} w={21} h={6} z={5} lift={2} slab style={round(3)}>
        <p className="flex h-full items-center gap-[0.6em] px-[1.1em] text-[0.8em] text-white/75">
          <span className="h-[0.6em] w-[0.6em] rounded-full acc-bg" /> Launch, then grow
        </p>
      </Layer>
    </Stage>
  );
}
