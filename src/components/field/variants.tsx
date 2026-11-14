import type { ServiceSlug } from "@/config/services";
import { Field, Glow, Layer, Lines, fadeEdges } from "./Field";
import {
  AI_MARKS,
  APPROACH_ROUTE,
  AUTOMATION,
  CALM_RULES,
  GROWTH_BASE,
  GROWTH_REFINED,
  HUB,
  INTEGRATIONS,
  converging,
  plane,
  ribbonContour,
  rrect,
  type Shape,
} from "./geometry";

/*
 * Page variants of the Solvitech Field. One framework (light planes, depth
 * layers, scroll drawing, and geometry that responds to the cursor trail);
 * each page composes it around its own idea and its own kind of response:
 * AI marks align, automation lanes fire in sequence, software planes lift,
 * integration routes carry a pulse, website surfaces rise, growth steps light.
 * Geometry sits right of the text column on desktop and recedes on phones.
 */

const HERO = "max-md:opacity-45";
const FIT = "xMaxYMid slice";

/** Moves a composition sideways (design units), keeping each shape's own transform. */
const shift = (shapes: Shape[], dx: number): Shape[] =>
  shapes.map((s) => ({ ...s, transform: `translate(${dx} 0)${s.transform ? ` ${s.transform}` : ""}` }));

/** Geometry at a depth; its lines respond to the cursor trail. */
function Lined({ shapes, depth, fade = fadeEdges.y, chain }: { shapes: Shape[]; depth: number; fade?: string; chain?: boolean }) {
  return (
    <Layer depth={depth} className={fade}>
      <Lines shapes={shapes} fit={FIT} chain={chain} />
    </Layer>
  );
}

/** /solutions: routes from every direction converging into one system. */
export function HubField() {
  return (
    <Field rest={["74%", "48%"]} className={HERO}>
      <Glow x="76%" y="48%" w="54rem" h="40rem" alpha={0.11} follow={26} />
      <Lined shapes={HUB} depth={14} />
    </Field>
  );
}

/** AI: scattered marks resolve into alignment (interpretation) where the trail passes. */
function AiField() {
  return (
    <Field rest={["80%", "46%"]} className={HERO}>
      <Glow x="80%" y="46%" w="46rem" h="36rem" alpha={0.08} follow={30} />
      <Lined shapes={shift(AI_MARKS, 190)} depth={10} />
    </Field>
  );
}

/** Automation: timing lanes leave one trigger and activate in sequence. */
function AutomationField() {
  return (
    <Field rest={["74%", "50%"]} className={HERO}>
      <Glow x="62%" y="50%" w="40rem" h="40rem" alpha={0.08} follow={20} />
      <Lined shapes={shift(AUTOMATION, 150)} depth={12} chain />
    </Field>
  );
}

/** Custom software: architectural planes, each at its own depth. */
const PLANES = [
  { cy: 260, d: 26, ink: "faint" as const },
  { cy: 400, d: 18, ink: "soft" as const },
  { cy: 540, d: 11, ink: "ink" as const },
  { cy: 680, d: 5, ink: "blue" as const },
];
function CustomSoftwareField() {
  return (
    <Field rest={["74%", "56%"]} className={HERO}>
      <Glow x="76%" y="62%" w="50rem" h="34rem" alpha={0.09} follow={22} />
      {PLANES.map((p, i) => {
        const shapes: Shape[] = [
          { d: plane(1130, p.cy, 540, 180), ink: p.ink, width: i === 3 ? 1.5 : 1, lift: 10, range: [`entry ${i * 6}%`, `cover ${32 + i * 6}%`] },
          { d: plane(1130, p.cy, 360, 104), ink: "faint", lift: 16, range: [`entry ${8 + i * 6}%`, `cover ${40 + i * 6}%`] },
        ];
        return <Lined key={p.cy} shapes={shapes} depth={p.d} />;
      })}
      <Layer depth={14} className={fadeEdges.y}>
        <Lines
          shapes={[
            { d: "M860 260 V680", ink: "faint", dashed: true },
            { d: "M1400 260 V680", ink: "faint", dashed: true },
          ]}
          fit={FIT}
        />
      </Layer>
    </Field>
  );
}

/** Integrations: distinct systems joined by precise, orthogonal routes. */
function IntegrationsField() {
  return (
    <Field rest={["76%", "44%"]} className={HERO}>
      <Glow x="76%" y="46%" w="52rem" h="38rem" alpha={0.08} follow={22} />
      <Lined shapes={shift(INTEGRATIONS, 110)} depth={12} chain />
    </Field>
  );
}

/** Websites: large composed surfaces with a clear typographic hierarchy. */
const SURFACES: Shape[][] = [
  [{ d: rrect(880, 130, 560, 420, 22), ink: "faint", lift: 6, range: ["entry 0%", "cover 30%"] }],
  [{ d: rrect(800, 220, 560, 440, 22), ink: "soft", lift: 9, range: ["entry 6%", "cover 36%"] }],
  [
    { d: rrect(720, 320, 600, 470, 22), ink: "ink", width: 1.25, lift: 12, range: ["entry 12%", "cover 42%"] },
    { d: "M772 410 H1090", ink: "blue", width: 3, range: ["entry 22%", "cover 50%"] },
    { d: "M772 452 H1010", ink: "soft", width: 3, range: ["entry 26%", "cover 54%"] },
    { d: "M772 520 H1260", ink: "faint", range: ["entry 30%", "cover 58%"] },
    { d: "M772 546 H1230", ink: "faint", range: ["entry 31%", "cover 59%"] },
    { d: "M772 572 H1180", ink: "faint", range: ["entry 32%", "cover 60%"] },
    { d: rrect(772, 640, 150, 48, 24), ink: "blue", range: ["entry 34%", "cover 62%"] },
  ],
];
function WebsitesField() {
  return (
    <Field rest={["72%", "58%"]} className={HERO}>
      <Glow x="70%" y="60%" w="54rem" h="36rem" alpha={0.08} follow={24} />
      {SURFACES.map((shapes, i) => (
        <Lined key={i} shapes={shift(shapes, 130)} depth={24 - i * 9} />
      ))}
    </Field>
  );
}

/** Digital growth: a measured, stepped rise; a refined line appears where attention falls. */
function GrowthField() {
  return (
    <Field rest={["78%", "52%"]} className={HERO}>
      <Glow x="80%" y="50%" w="46rem" h="36rem" alpha={0.08} follow={22} />
      <Lined shapes={shift(GROWTH_BASE, 200)} depth={10} />
      <Lined shapes={shift(GROWTH_REFINED, 200)} depth={16} />
    </Field>
  );
}

const SERVICE_FIELDS: Record<ServiceSlug, () => React.JSX.Element> = {
  ai: AiField,
  automation: AutomationField,
  "custom-software": CustomSoftwareField,
  integrations: IntegrationsField,
  websites: WebsitesField,
  "digital-growth": GrowthField,
};

export function ServiceField({ slug }: { slug: ServiceSlug }) {
  const F = SERVICE_FIELDS[slug];
  return <F />;
}

/** About: the ribbon outline, editorial and large. */
export function AboutField() {
  return (
    <Field rest={["78%", "40%"]} className={HERO}>
      <Glow x="80%" y="42%" w="50rem" h="40rem" alpha={0.08} follow={24} />
      <Lined shapes={ribbonContour("translate(1080 -30) scale(1.75)", true)} depth={22} />
      <Lined shapes={ribbonContour("translate(1010 60) scale(1.45)")} depth={12} />
    </Field>
  );
}

/** Approach: four stages on one precise route. */
export function ApproachField() {
  return (
    <Field rest={["80%", "52%"]} className={HERO}>
      <Glow x="82%" y="52%" w="48rem" h="30rem" alpha={0.08} follow={22} />
      <Lined shapes={APPROACH_ROUTE} depth={12} fade={fadeEdges.left} chain />
    </Field>
  );
}

/** Working Together: calm and clear. */
export function WorkingField() {
  return (
    <Field rest={["74%", "70%"]} className={HERO}>
      <Glow x="74%" y="64%" w="56rem" h="34rem" alpha={0.06} follow={16} color="var(--fld-ice)" />
      <Glow x="80%" y="40%" w="40rem" h="30rem" alpha={0.06} follow={20} />
      <Lined shapes={CALM_RULES} depth={8} fade={fadeEdges.left} />
    </Field>
  );
}

/** Contact: everything converges on the enquiry. */
export function ContactField() {
  return (
    <Field rest={["70%", "36%"]} className="bottom-auto h-[64rem]">
      <Glow x="70%" y="38%" w="64rem" h="44rem" alpha={0.09} follow={22} />
      <Lined shapes={converging(1020, 360)} depth={12} />
    </Field>
  );
}
