"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { registerField } from "./runtime";

/**
 * The only client part of a field: registers its root with the shared
 * runtime. The geometry inside is rendered on the server.
 */
export default function FieldRoot({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? registerField(ref.current) : undefined), []);
  return (
    <div ref={ref} aria-hidden className={`fld ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * A content region whose `data-react` elements respond to the cursor trail
 * (e.g. service panels, stage markers). Not decorative: renders as a plain div.
 */
export function ReactZone({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? registerField(ref.current) : undefined), []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
