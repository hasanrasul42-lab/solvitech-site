"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A dimensional service visual: layered HTML surfaces in one CSS 3D space
 * (perspective + preserve-3d), sized in em so the whole composition scales
 * with its container (directory.css). No WebGL, so it never competes with the
 * hero's scene for the GPU.
 *
 * Behaviour, all restrained:
 * - At rest the composition holds its own angle (--rx0 / --ry0).
 * - A fine pointer over the service tilts it a few degrees (damped, animation
 *   frames only while it is settling: nothing runs at rest or off-screen).
 * - Hovering or focusing the service sets `data-on`, which brings its key
 *   layer forward (each visual decides what that is).
 * - Touch screens get the same emphasis while the visual is in view.
 * - Reduced motion: no tilt; emphasis still applies, without transitions.
 */
export default function Stage({
  label,
  rest,
  className = "",
  view,
  children,
}: {
  /** What the illustration shows, for assistive technology. */
  label: string;
  /** Resting angle in degrees: [rotateX, rotateY]. */
  rest: [number, number];
  className?: string;
  /** Optional named state (e.g. desktop / mobile) for the visual's own CSS. */
  view?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = el.closest<HTMLElement>("[data-svc]") ?? el;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let last = 0;
    let hovered = false;
    let focused = false;
    let inView = false;

    const sync = () => {
      const on = hovered || focused || (!fine.matches && inView);
      el.toggleAttribute("data-on", on);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const k = 1 - Math.exp(-dt * 7);
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches || reduced.matches) return;
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      request();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovered = true;
      sync();
    };
    const onLeave = () => {
      hovered = false;
      tx = 0;
      ty = 0;
      request();
      sync();
    };
    const onFocusIn = () => {
      focused = true;
      sync();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (host.contains(e.relatedTarget as Node | null)) return;
      focused = false;
      sync();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("focusin", onFocusIn);
    host.addEventListener("focusout", onFocusOut);
    fine.addEventListener("change", sync);
    return () => {
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("focusin", onFocusIn);
      host.removeEventListener("focusout", onFocusOut);
      fine.removeEventListener("change", sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      data-view={view}
      className={`s3d ${className}`}
      style={{ ["--rx0" as string]: `${rest[0]}deg`, ["--ry0" as string]: `${rest[1]}deg` } as CSSProperties}
    >
      <div aria-hidden className="s3d-view">
        <div className="s3d-floor" />
        <div className="s3d-scene">{children}</div>
      </div>
    </div>
  );
}

/**
 * One element in the scene, positioned on the 60 x 42 em canvas and lifted
 * `z` em towards the viewer; `lift` em more while the service is emphasised.
 * A `slab` is a solid surface: a face with a darker edge just behind it, so
 * it reads as having thickness when the scene turns.
 */
export function Layer({
  x,
  y,
  w,
  h,
  z = 0,
  lift = 0,
  slab = false,
  className = "",
  faceClassName = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  z?: number;
  /** Extra em towards the viewer while emphasised. */
  lift?: number;
  slab?: boolean;
  className?: string;
  faceClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`s3d-l ${className}`}
      style={
        {
          left: `${x}em`,
          top: `${y}em`,
          width: `${w}em`,
          height: h === undefined ? undefined : `${h}em`,
          ["--z" as string]: `${z}em`,
          ["--lift" as string]: `${lift}em`,
          ...style,
        } as CSSProperties
      }
    >
      {slab ? (
        <>
          <div className="s3d-edge" />
          <div className={`s3d-face ${faceClassName}`}>{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
