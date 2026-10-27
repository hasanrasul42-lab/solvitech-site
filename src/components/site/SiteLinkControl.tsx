"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { SiteLink } from "@/config/site";

/**
 * Renders a site link. Live links are ordinary Next links. Pending links (the
 * destination is not built yet) render as a button with the same styling that
 * announces "coming soon" in a small status bubble, so nothing routes to a
 * missing page and nothing pretends to work.
 */
export default function SiteLinkControl({
  link,
  className,
  children,
  current = false,
  onNavigate,
  bubblePlacement = "below",
}: {
  link: SiteLink;
  className: string;
  children?: ReactNode;
  current?: boolean;
  onNavigate?: () => void;
  bubblePlacement?: "below" | "above";
}) {
  const noteId = useId();
  const [showNote, setShowNote] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!link.pending) {
    return (
      <Link href={link.href} className={className} aria-current={current ? "page" : undefined} onClick={onNavigate}>
        {children ?? link.label}
      </Link>
    );
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className={className}
        aria-disabled="true"
        aria-describedby={noteId}
        data-pending-destination={link.href}
        onClick={() => {
          setShowNote(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setShowNote(false), 2400);
        }}
      >
        {children ?? link.label}
      </button>
      <span
        id={noteId}
        role="status"
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#0e1626] px-2.5 py-1 text-xs font-normal normal-case tracking-normal text-muted shadow-lg transition-opacity duration-200 ${
          bubblePlacement === "below" ? "top-full mt-2" : "bottom-full mb-2"
        } ${showNote ? "opacity-100" : "sr-only opacity-0"}`}
      >
        {link.pendingNote ?? "Coming soon."}
      </span>
    </span>
  );
}
