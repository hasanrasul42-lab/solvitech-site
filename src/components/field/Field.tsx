import type { CSSProperties, ReactNode } from "react";
import FieldRoot from "./FieldRoot";
import type { Ink, Shape } from "./geometry";
import "./field.css";

/**
 * The Solvitech Field: building blocks shared by every page.
 *
 *   <Field rest={["70%", "30%"]}>        decorative root (aria-hidden, no pointer events)
 *     <Glow x="68%" y="10%" w="60rem" h="40rem" />   light plane
 *     <Layer depth={14}><Lines shapes={...} /></Layer>   geometry at a depth
 *   </Field>
 *
 * Geometry is plain SVG paths (geometry.ts). Drawing follows the scroll
 * position in CSS; the runtime only writes custom properties (depth drift and
 * each reactive shape's energy as the cursor trail passes).
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function Field({
  rest,
  className = "",
  style,
  children,
}: {
  /** Resting light position (touch devices, before the pointer moves). */
  rest?: [string, string];
  className?: string;
  style?: Vars;
  children: ReactNode;
}) {
  const s: Vars = { ...style };
  if (rest) {
    s["--rest-x"] = rest[0];
    s["--rest-y"] = rest[1];
  }
  return (
    <FieldRoot className={`-z-10 ${className}`} style={s}>
      {children}
    </FieldRoot>
  );
}

/** A soft light plane. `follow` = px it leans towards the pointer. */
export function Glow({
  x,
  y,
  w,
  h,
  alpha = 0.12,
  follow = 0,
  color,
  className = "",
}: {
  x: string;
  y: string;
  w: string;
  h: string;
  alpha?: number;
  follow?: number;
  /** "r g b" */
  color?: string;
  className?: string;
}) {
  const style: Vars = { left: x, top: y, width: w, height: h, "--a": alpha, "--follow": follow };
  if (color) style["--glow"] = color;
  return <div className={`fld-glow ${className}`} style={style} />;
}

/** A depth layer: drifts up to `depth` px against the pointer. */
export function Layer({ depth = 0, className = "", style, children }: { depth?: number; className?: string; style?: Vars; children: ReactNode }) {
  return (
    <div className={`fld-l ${className}`} style={{ ...style, "--d": depth } as Vars}>
      {children}
    </div>
  );
}

const INK: Record<Ink, string> = { faint: "fld-ink-faint", soft: "fld-ink-soft", ink: "fld-ink", blue: "fld-ink-blue" };

/**
 * SVG paths in a 1440 x 900 design space (or `viewBox`). Reactive shapes are
 * wrapped in <g data-react>: the runtime writes their energy (--e) as the
 * cursor trail or the spine passes, and a pulse path runs along them while
 * they are strongly energised (field.css).
 */
export function Lines({
  shapes,
  chain = false,
  viewBox = "0 0 1440 900",
  fit = "xMidYMid slice",
  className = "",
  style,
}: {
  shapes: Shape[];
  /** Energy flows from each reactive shape to the next (sequenced activation). */
  chain?: boolean;
  viewBox?: string;
  fit?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio={fit} className={className} style={style} focusable="false" data-chain={chain ? "" : undefined}>
      {shapes.map((s, i) => {
        const ink = INK[s.ink ?? "soft"];
        const draw = s.draw !== false && !s.fill && !s.dashed;
        const w = s.width ?? 1;
        const range: Vars = { "--w": w };
        if (s.range) {
          range["--from"] = s.range[0];
          range["--to"] = s.range[1];
        }
        const base = (
          <path
            d={s.d}
            transform={s.react === false || s.fill ? s.transform : undefined}
            pathLength={draw ? 1 : undefined}
            className={`fld-base ${ink} ${draw ? "fld-draw" : "fld-fade"}`}
            style={range}
            fill={s.fill ? "currentColor" : "none"}
            stroke={s.fill ? "none" : "currentColor"}
            strokeWidth={w}
            strokeDasharray={s.dashed ? "3 7" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
        if (s.react === false || s.fill) return <g key={i}>{base}</g>;
        const lift: Vars | undefined = s.lift ? { "--lift": `${s.lift}px` } : undefined;
        return (
          <g key={i} data-react="" className={s.lift ? "fld-r fld-lift" : "fld-r"} transform={s.transform} style={lift}>
            {base}
            {s.alt ? (
              <path d={s.alt} className="fld-alt" fill="none" stroke="currentColor" strokeWidth={w + 0.25} strokeLinecap="round" />
            ) : (
              <path d={s.d} pathLength={1} className="fld-pulse" fill="none" stroke="currentColor" strokeWidth={w + 0.6} strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Fades a layer's edges so geometry dissolves into the page. */
export const fadeEdges = {
  top: "[mask-image:linear-gradient(to_bottom,transparent,#000_22%)]",
  bottom: "[mask-image:linear-gradient(to_top,transparent,#000_22%)]",
  y: "[mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]",
  left: "[mask-image:linear-gradient(to_right,transparent,#000_30%)]",
} as const;
