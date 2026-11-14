/**
 * Geometry for the Solvitech Field: plain data (SVG path strings), generated
 * once at module load. Coordinates use a 1440 x 900 design space unless a
 * variant says otherwise.
 */

export type Ink = "faint" | "soft" | "ink" | "blue";

export interface Shape {
  d: string;
  ink?: Ink;
  width?: number;
  /** Draw with the scroll position (default true). */
  draw?: boolean;
  /** Scroll range for drawing, e.g. ["entry 10%", "cover 40%"]. */
  range?: [string, string];
  fill?: boolean;
  dashed?: boolean;
  transform?: string;
  /** Responds to the cursor trail / spine head (default: every line that is not a fill). */
  react?: boolean;
  /** Responds by turning into this shape (AI: a scattered mark aligning). */
  alt?: string;
  /** Lifts by this many px when energised (layered surfaces). */
  lift?: number;
  /** Time-based drawing delay in ms (hero: draws in after the intro). */
  delay?: number;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Deterministic pseudo-random sequence (no hydration mismatch). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Circular arc from angle a0 to a1 (degrees, 0 = east, clockwise in SVG). */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [r1(cx + r * Math.cos((a * Math.PI) / 180)), r1(cy + r * Math.sin((a * Math.PI) / 180))];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export const square = (x: number, y: number, s: number) => `M${x - s} ${y} L${x} ${y - s} L${x + s} ${y} L${x} ${y + s} Z`;

// --- The official ribbon outline (from public/brand/solvitech-mark.svg) ---------------

export const RIBBON_WHITE =
  "M 431 15 L 60 189 L 42 199 L 28 212 L 21 222 L 16 232 L 11 250 L 11 269 L 14 282 L 21 298 L 27 307 L 36 317 L 47 326 L 94 351 L 92 333 L 96 317 L 104 304 L 118 292 L 402 160 L 414 153 L 425 141 L 431 126 Z";
export const RIBBON_BLUE =
  "M 413 290 L 405 280 L 391 268 L 344 242 L 343 243 L 345 250 L 345 264 L 341 277 L 335 287 L 324 298 L 318 302 L 78 413 L 28 438 L 18 450 L 14 461 L 14 570 L 372 407 L 394 395 L 413 376 L 422 359 L 426 343 L 425 318 L 421 305 Z";

// --- Hero: directional flow around the mark ------------------------------------------
// A family of long curves sweeping from lower left to upper right, gathered
// where the mark sits (about 70% / 50% on desktop) like the ribbon's own
// direction, plus fine orbit arcs around it. Lines flex and light under the
// cursor trail.

const MARK: [number, number] = [1010, 450];
export const HERO_FLOW: Shape[] = [
  ...Array.from({ length: 15 }, (_, i): Shape => {
    const o = (i - 7) * 30;
    const gather = 0.55; // compression near the mark
    return {
      d: `M-80 ${r1(700 + o * 1.5)} C420 ${r1(690 + o * 1.3)} ${r1(MARK[0] - 330)} ${r1(MARK[1] + 120 + o * gather)} ${MARK[0]} ${r1(MARK[1] + o * gather)} S${r1(1300)} ${r1(150 + o * 1.4)} 1540 ${r1(80 + o * 1.8)}`,
      ink: i === 7 ? "blue" : i === 5 || i === 9 ? "ink" : i % 2 ? "soft" : "faint",
      width: i === 7 ? 1.4 : 1,
      draw: true,
      lift: 5 + (i % 3) * 2,
      delay: 120 + Math.abs(i - 7) * 70,
    };
  }),
  ...[300, 380, 470].flatMap((r, i): Shape[] => [
    { d: arc(MARK[0], MARK[1], r, 196 + i * 6, 262 - i * 4), ink: i === 1 ? "blue" : "faint", delay: 700 + i * 120 },
    { d: arc(MARK[0], MARK[1], r, 10 + i * 6, 78 - i * 4), ink: "faint", delay: 820 + i * 120 },
  ]),
];

// --- Hero to Solutions: light and lines flowing out from beneath the mark -------------

export const HANDOFF: Shape[] = Array.from({ length: 7 }, (_, i): Shape => {
  // A bundle that leaves from under the mark (top right), passes between the
  // headline and the intro, and converges where the service map's axis starts.
  const x0 = 930 + i * 34;
  const c1 = 820 + i * 10;
  const c2y = 120 + i * 8;
  return {
    d: `M${x0} -20 C${c1} ${40 + i * 4} ${724} ${c2y} 720 340`,
    ink: i === 3 ? "blue" : i % 2 ? "soft" : "faint",
    width: i === 3 ? 1.25 : 1,
    range: [`entry ${i * 2}%`, `cover ${30 + i * 3}%`],
  };
});

// --- Solutions: concentric precision arcs rising behind the service map ----------------

export const SOLUTIONS_ARCS: Shape[] = [420, 540, 660, 800, 960].map((r, i) => ({
  d: arc(720, 1060, r, 196 + i * 2, 344 - i * 2),
  ink: i === 2 ? "blue" : i % 2 ? "soft" : "faint",
  range: [`entry ${i * 4}%`, `cover ${40 + i * 4}%`] as [string, string],
}));

// --- Why / About: the ribbon outline at architectural scale ---------------------------

export const ribbonContour = (transform: string, echo = false): Shape[] => [
  { d: RIBBON_WHITE, ink: echo ? "faint" : "soft", transform, range: ["entry 5%", "cover 55%"] },
  { d: RIBBON_BLUE, ink: echo ? "faint" : "blue", transform, range: ["entry 15%", "cover 65%"] },
];

// --- Contact: lines converging on the enquiry ------------------------------------------

export const converging = (cx: number, cy: number): Shape[] => [
  ...[60, 200, 340, 480, 620, 760, 900].map((y, i): Shape => ({
    d: `M-40 ${y} Q${cx * 0.55} ${(y + cy) / 2 + (y - cy) * 0.18} ${cx} ${cy}`,
    ink: i === 3 ? "blue" : i % 2 ? "soft" : "faint",
    range: [`entry ${i * 3}%`, `cover ${40 + i * 3}%`],
  })),
  ...[220, 520, 820].map((x, i): Shape => ({
    d: `M${x} 960 Q${(x + cx) / 2} ${cy + 260} ${cx} ${cy}`,
    ink: "faint",
    range: [`entry ${8 + i * 4}%`, `cover ${46 + i * 4}%`],
  })),
  { d: arc(cx, cy, 70, 0, 359.9), ink: "soft", range: ["entry 20%", "cover 55%"] },
  { d: arc(cx, cy, 150, 0, 359.9), ink: "faint", range: ["entry 25%", "cover 60%"] },
];

// --- Solutions hub: routes converging into a system ----------------------------------

const HUB_NODE: [number, number] = [1120, 430];
export const HUB: Shape[] = [
  ...[
    [560, 140],
    [500, 420],
    [620, 760],
    [900, 880],
  ].map(([x, y], i): Shape => ({
    d: `M${x} ${y} C${(x + HUB_NODE[0]) / 2} ${y} ${HUB_NODE[0] - 160} ${HUB_NODE[1]} ${HUB_NODE[0]} ${HUB_NODE[1]}`,
    ink: i === 1 ? "blue" : "ink",
    width: 1.25,
    range: [`entry ${i * 4}%`, `cover ${36 + i * 4}%`],
  })),
  ...[
    [1440, 120],
    [1440, 760],
  ].map(([x, y]): Shape => ({
    d: `M${x} ${y} C${x - 120} ${y} ${HUB_NODE[0] + 120} ${HUB_NODE[1]} ${HUB_NODE[0]} ${HUB_NODE[1]}`,
    ink: "faint",
    dashed: true,
    draw: false,
  })),
  ...[70, 140, 230, 340].map((r, i): Shape => ({
    d: arc(HUB_NODE[0], HUB_NODE[1], r, 0, 359.9),
    ink: i === 1 ? "blue" : "faint",
    range: [`entry ${10 + i * 5}%`, `cover ${45 + i * 5}%`],
  })),
  { d: square(HUB_NODE[0], HUB_NODE[1], 9), ink: "blue", fill: true, draw: false },
];

// --- AI: scattered marks that align (are interpreted) where the trail passes ----

export const AI_MARKS: Shape[] = (() => {
  const rand = seeded(7);
  const out: Shape[] = [];
  for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 15; col++) {
      const x = 640 + col * 54 + (rand() - 0.5) * 22;
      const y = 70 + row * 76 + (rand() - 0.5) * 26;
      const ang = rand() * Math.PI;
      const seg = (a: number, l: number) => {
        const dx = Math.cos(a) * l;
        const dy = Math.sin(a) * l;
        return `M${r1(x - dx)} ${r1(y - dy)} L${r1(x + dx)} ${r1(y + dy)}`;
      };
      out.push({
        d: seg(ang, 13),
        alt: seg((-24 * Math.PI) / 180, 15),
        ink: (row + col) % 3 ? "faint" : "soft",
        width: 1.25,
        draw: false,
      });
    }
  }
  return out;
})();

// --- Automation: timing lanes that activate in sequence --------------------------------

export const AUTOMATION: Shape[] = [
  { d: "M720 120 V820", ink: "blue", width: 1.25, range: ["entry 0%", "cover 25%"] },
  ...Array.from({ length: 6 }, (_, i): Shape => {
    const y = 190 + i * 104;
    const start = 750 + i * 34;
    const h = 26;
    let d = `M720 ${y} H${start}`;
    let x = start;
    for (let k = 0; k < 4; k++) {
      d += ` V${y - h} H${x + 56} V${y} H${x + 124}`;
      x += 124;
    }
    d += ` H1500`;
    return { d, ink: i === 2 ? "blue" : i % 2 ? "soft" : "ink", range: [`entry ${6 + i * 6}%`, `cover ${30 + i * 6}%`] };
  }),
];

// --- Custom software: architectural planes, configured -------------------------------

export const plane = (cx: number, cy: number, w: number, h: number) => {
  const sk = w * 0.22;
  return `M${cx - w / 2} ${cy} L${cx - w / 2 + sk} ${cy - h / 2} L${cx + w / 2} ${cy - h / 2} L${cx + w / 2 - sk} ${cy} Z`;
};

// --- Integrations: distinct systems joined by precise routes ---------------------------

export const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

export const INTEGRATIONS: Shape[] = [
  { d: rrect(760, 140, 260, 170, 18), ink: "ink", range: ["entry 0%", "cover 25%"] },
  { d: rrect(1150, 110, 250, 210, 18), ink: "ink", range: ["entry 4%", "cover 29%"] },
  { d: rrect(940, 590, 310, 170, 18), ink: "ink", range: ["entry 8%", "cover 33%"] },
  { d: "M480 225 H760", ink: "faint", dashed: true, draw: false },
  { d: "M1020 225 C1085 225 1085 215 1150 215", ink: "blue", width: 1.5, range: ["entry 18%", "cover 42%"] },
  { d: "M890 310 V440 Q890 460 910 460 H1050 Q1070 460 1070 480 V590", ink: "soft", width: 1.25, range: ["entry 24%", "cover 48%"] },
  { d: "M1275 320 V500 Q1275 520 1255 520 H1200 Q1180 520 1180 540 V590", ink: "soft", width: 1.25, range: ["entry 30%", "cover 54%"] },
  ...[
    [1020, 225],
    [1150, 215],
    [890, 310],
    [1070, 590],
    [1275, 320],
    [1180, 590],
  ].map(([x, y]): Shape => ({ d: square(x, y, 5), ink: "blue", fill: true, draw: false })),
];

// --- Digital growth: a measured, stepped rise; the refined line under attention ------------

export const GROWTH_BASE: Shape[] = [
  { d: "M640 780 H1440", ink: "soft", range: ["entry 0%", "cover 25%"] },
  ...Array.from({ length: 21 }, (_, i): Shape => ({
    d: `M${640 + i * 40} 780 V${i % 5 === 0 ? 762 : 771}`,
    ink: "faint",
    draw: false,
  })),
  {
    d: "M640 720 H760 L800 680 H900 L940 620 H1040 L1080 540 H1180 L1220 450 H1320 L1360 350 H1440",
    ink: "blue",
    width: 1.5,
    range: ["entry 10%", "cover 50%"],
  },
  ...[
    [800, 680],
    [940, 620],
    [1080, 540],
    [1220, 450],
    [1360, 350],
  ].map(([x, y]): Shape => ({ d: square(x, y, 4), ink: "blue", fill: true, draw: false })),
];
export const GROWTH_REFINED: Shape[] = [
  { d: "M640 724 C760 716 860 668 960 622 C1060 576 1120 520 1210 456 C1290 400 1360 352 1440 336", ink: "ink", width: 1.5, range: ["entry 20%", "cover 60%"] },
];

// --- Approach: four stages on one precise route ----------------------------------------

export const APPROACH_ROUTE: Shape[] = [
  { d: "M820 470 H1500", ink: "soft", range: ["entry 0%", "cover 40%"] },
  { d: "M860 446 H1500", ink: "faint", range: ["entry 5%", "cover 45%"] },
  { d: "M860 494 H1500", ink: "faint", range: ["entry 10%", "cover 50%"] },
  ...[900, 1060, 1220, 1380].flatMap((x, i): Shape[] => [
    { d: arc(x, 470, 20, 0, 359.9), ink: "blue", width: 1.25, range: [`entry ${8 + i * 7}%`, `cover ${32 + i * 7}%`] },
    { d: arc(x, 470, 42, 0, 359.9), ink: "faint", range: [`entry ${12 + i * 7}%`, `cover ${36 + i * 7}%`] },
  ]),
];

// --- Working together: calm, precise rules --------------------------------------------------

export const CALM_RULES: Shape[] = Array.from({ length: 6 }, (_, i): Shape => ({
  d: `M${880 + i * 56} ${700 + i * 30} H1500`,
  ink: i === 2 ? "blue" : i % 2 ? "soft" : "ink",
  range: [`entry ${i * 4}%`, `cover ${30 + i * 4}%`],
}));
