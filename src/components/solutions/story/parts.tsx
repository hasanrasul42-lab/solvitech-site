import type { CSSProperties, ReactNode } from "react";
import { Layer } from "@/components/home/directory/Stage";

/** Small shared pieces for the service-page visuals (homepage stage system). */

export const turn = (deg: number): CSSProperties => ({ rotate: `${deg}deg` });
/** Turn about the vertical axis, e.g. a panel angled like a folding screen. */
export const yaw = (deg: number): CSSProperties => ({ rotate: `y ${deg}deg` });
export const round = (r: number): CSSProperties => ({ ["--r" as string]: `${r}em` });

const dot = "inline-block h-[0.55em] w-[0.55em] rounded-full";

export function WindowBar({ title, right, light }: { title: string; right?: ReactNode; light?: boolean }) {
  const tone = light ? "border-black/[0.08] text-[#1f2633]" : "border-white/[0.07] text-white/80";
  const d = light ? "bg-black/10" : "bg-white/15";
  return (
    <div className={`flex h-[2.9em] items-center gap-[0.45em] border-b px-[1.1em] text-[1.05em] ${tone}`}>
      <span className={`${dot} ${d}`} />
      <span className={`${dot} ${d}`} />
      <span className={`${dot} ${d}`} />
      <span className="ml-[0.8em] font-medium">{title}</span>
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

export function Draw({ d, z = 2, dashed }: { d: string; z?: number; dashed?: boolean }) {
  return (
    <Layer x={0} y={0} w={60} h={42} z={z}>
      <svg viewBox="0 0 60 42" className="absolute inset-0 h-full w-full overflow-visible">
        {dashed && <path d={d} fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="0.12" strokeDasharray="0.5 0.4" />}
        <path d={d} pathLength={1} fill="none" stroke="rgb(var(--acc))" strokeWidth="0.14" className="on-draw" />
      </svg>
    </Layer>
  );
}

export const lines = (ws: string[], tone = "bg-black/[0.12]") => (
  <div className="grid gap-[0.5em]">
    {ws.map((w, i) => (
      <span key={i} className={`block h-[0.45em] rounded-full ${tone}`} style={{ width: w }} />
    ))}
  </div>
);

export function Tick({ dark = "#04121f" }: { dark?: string }) {
  return (
    <span className="grid h-[1.4em] w-[1.4em] shrink-0 place-items-center rounded-full text-[0.8em] acc-bg" style={{ color: dark }}>
      ✓
    </span>
  );
}

export const pill = "rounded-full border border-white/10 bg-white/[0.04] px-[0.75em] py-[0.15em] text-[0.82em] text-white/55";
