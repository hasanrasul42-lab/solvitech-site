import Stage, { Layer } from "@/components/home/directory/Stage";
import { Draw, Tick, WindowBar, pill, round, yaw } from "./parts";

/**
 * Systems Integration visuals (homepage stage system), each its own composition:
 *   hero    facing systems  a shop and an accounts system turned towards each other
 *   signs   triplicate      the same customer, three slightly different records
 *   focus   chain           source, mapping, timing, failure handling as linked nodes
 *   builds  patch panel     six kinds of connection plugged into one panel
 *   close   jigsaw          two pieces that fit
 * Sample content is fictional.
 */

const ACC = "acc-integrations";

export function IntegrationHero() {
  return (
    <Stage track="section" label="Illustration: an online shop and an accounts system turned towards each other, with an order passing from one to the other as an invoice." rest={[8, 0]} className={ACC}>
      <Layer x={1} y={4} w={24} h={30} slab style={yaw(22)}>
        <WindowBar title="Online shop" />
        <div className="grid gap-[0.4em] p-[1em] text-[0.85em]">
          {[
            ["#4471", "£84.00", true],
            ["#4470", "£126.50", false],
            ["#4469", "£39.99", false],
          ].map(([id, v, on]) => (
            <div key={id as string} className={`flex justify-between rounded-[0.4em] px-[0.6em] py-[0.5em] ${on ? "st-hit text-white/90" : "text-white/55"}`}>
              <span className="font-mono">Order {id}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Layer>
      <Layer x={35} y={4} w={24} h={30} slab faceClassName="is-light" style={yaw(-22)}>
        <WindowBar title="Accounts" light />
        <div className="grid gap-[0.4em] p-[1em] text-[0.85em] text-[#1f2633]">
          {[
            ["INV-2290", "£84.00", true],
            ["INV-2289", "£126.50", false],
            ["INV-2288", "£39.99", false],
          ].map(([id, v, on]) => (
            <div key={id as string} className={`flex justify-between rounded-[0.4em] px-[0.6em] py-[0.5em] ${on ? "st-hit" : "text-black/50"}`}>
              <span className="font-mono">{id}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Layer>
      <Draw d="M22 12 C 28 9, 32 9, 38 12" z={6} dashed />
      <Layer x={19} y={16} w={22} h={9} z={10} lift={3} slab className="s3d-key" style={round(1.2)}>
        <div className="flex h-full items-center gap-[0.7em] px-[1.1em] text-[0.9em]">
          <Tick dark="#2a1a06" />
          <span className="text-white/85">
            Order #4471 <span className="text-white/40">→</span> INV-2290
          </span>
        </div>
      </Layer>
      <Layer x={23} y={27} w={14} h={4.4} z={8} lift={2} slab className="on-show" style={round(2.2)}>
        <p className="flex h-full items-center justify-center text-[0.8em] text-white/70">Stock updated</p>
      </Layer>
    </Stage>
  );
}

export function IntegrationSigns() {
  const records = [
    { sys: "CRM", name: "Jane Smith", phone: "07700 900456", email: "jane@example.co.uk", diff: [] as string[] },
    { sys: "Accounts", name: "J. Smith", phone: "07700 900456", email: "accounts@example.co.uk", diff: ["name", "email"] },
    { sys: "Support", name: "Jane Smyth", phone: "01632 960123", email: "jane@example.co.uk", diff: ["name", "phone"] },
  ];
  return (
    <Stage track="section" label="Illustration: the same customer held in three systems with different names, phone numbers and email addresses." rest={[12, -12]} className={ACC}>
      {records.map((r, i) => (
        <Layer key={r.sys} x={3 + i * 9} y={3 + i * 6} w={30} h={17} z={i * 4} lift={i * 1.5} slab className={i === 2 ? "s3d-key" : ""}>
          <div className="p-[1.1em] text-[0.85em]">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-[0.14em] text-white/45">{r.sys}</span>
              <span className={pill}>Customer</span>
            </div>
            {(["name", "phone", "email"] as const).map((f) => (
              <p key={f} className={`mt-[0.5em] truncate rounded-[0.3em] px-[0.4em] py-[0.15em] ${r.diff.includes(f) ? "st-hit text-white" : "text-white/65"}`}>
                {r[f]}
              </p>
            ))}
          </div>
        </Layer>
      ))}
      <Layer x={46} y={30} w={11} h={8} z={14} lift={3} slab style={round(1.2)}>
        <p className="flex h-full items-center justify-center text-[0.9em] font-semibold acc-text">Which is right?</p>
      </Layer>
    </Stage>
  );
}

export function IntegrationFocus() {
  const nodes = [
    { n: "Source of truth", icon: "★" },
    { n: "Mapping", icon: "⇄" },
    { n: "Timing", icon: "◷" },
    { n: "Failure handling", icon: "↻" },
  ];
  return (
    <Stage track="section" label="Illustration: four linked nodes rising from left to right: source of truth, mapping, timing and failure handling." rest={[12, 14]} className={ACC}>
      <Draw d="M8 31 C 16 31, 16 24, 22 24 S 30 17, 36 17 S 46 10, 51 10" z={1} dashed />
      {nodes.map((nd, i) => (
        <Layer key={nd.n} x={2 + i * 14} y={24 - i * 7} w={12} h={12} z={2 + i * 3} lift={1 + i} slab className={i === 3 ? "s3d-key" : ""} style={round(6)}>
          <div className="grid h-full place-items-center">
            <span className="text-[2.4em] leading-none acc-text">{nd.icon}</span>
          </div>
        </Layer>
      ))}
      {nodes.map((nd, i) => (
        <Layer key={`${nd.n}-l`} x={1 + i * 14} y={37 - i * 7} w={14} h={3.4} z={3 + i * 3} lift={1 + i}>
          <p className="text-center text-[0.85em] font-medium text-white/80">
            <span className="mr-[0.4em] font-mono acc-text">0{i + 1}</span>
            {nd.n}
          </p>
        </Layer>
      ))}
    </Stage>
  );
}

export function IntegrationBuilds() {
  const ports = ["API", "Data sync", "CRM & accounts", "E-commerce", "Custom connector", "Monitoring"];
  return (
    <Stage track="section" label="Illustration: a patch panel with six labelled ports, API, data sync, CRM and accounts, e-commerce, custom connector and monitoring, with cables plugged in and a sync log." rest={[10, -14]} className={ACC}>
      <Layer x={2} y={4} w={56} h={17} slab faceClassName="!bg-[linear-gradient(170deg,#1c2131,#0e121c)]">
        <div className="grid h-full grid-cols-6 gap-[0.6em] p-[1em]">
          {ports.map((p) => (
            <div key={p} className="flex flex-col items-center justify-between">
              <span className="grid h-[3.6em] w-[3.6em] place-items-center rounded-full border-[0.3em] border-white/15 bg-[#06090f]">
                <span className="h-[1.2em] w-[1.2em] rounded-full acc-bg" />
              </span>
              <span className="text-center text-[0.7em] leading-tight text-white/65">{p}</span>
            </div>
          ))}
        </div>
      </Layer>
      <Draw d="M7 11 C 7 24, 14 26, 14 34 M16.3 11 C 16.3 22, 22 25, 22 34 M25.6 11 C 25.6 22, 30 25, 30 34 M34.9 11 C 34.9 22, 38 25, 38 34 M44.2 11 C 44.2 22, 46 25, 46 34 M53.5 11 C 53.5 20, 54 25, 54 34" z={3} />
      <Layer x={8} y={28} w={26} h={10} z={8} lift={3} slab className="s3d-key">
        <div className="p-[1em] text-[0.82em]">
          <p className="font-semibold text-white/85">Sync log</p>
          <p className="mt-[0.4em] flex items-center gap-[0.4em] text-white/65">
            <Tick dark="#2a1a06" /> Orders synced
          </p>
          <p className="mt-[0.3em] text-white/45">1 retry queued · rate limit</p>
        </div>
      </Layer>
    </Stage>
  );
}

const PIECE = "M2 2h11c0-2.6 4-2.6 4 0h11v10c-2.6 0-2.6 4 0 4v10H2V16c2.6 0 2.6-4 0-4z";

export function IntegrationClose() {
  return (
    <Stage track="section" label="Illustration: two jigsaw pieces, your CRM and your accounts, fitting together." rest={[10, -14]} className={ACC}>
      <Layer x={3} y={6} w={28} h={28} z={0} lift={0}>
        <svg viewBox="0 0 30 28" className="absolute inset-0 h-full w-full overflow-visible">
          <path d={PIECE} fill="#f3efe8" />
        </svg>
        <p className="absolute left-[2.2em] top-[11em] text-[1.3em] font-semibold text-[#1f2633]">Your CRM</p>
      </Layer>
      <Layer x={27} y={9} w={28} h={28} z={6} lift={-4} className="s3d-key">
        <svg viewBox="0 0 30 28" className="absolute inset-0 h-full w-full overflow-visible">
          <path d={PIECE} fill="rgb(var(--acc))" />
        </svg>
        <p className="absolute left-[2.2em] top-[11em] text-[1.3em] font-semibold text-[#2a1a06]">Your accounts</p>
      </Layer>
    </Stage>
  );
}
