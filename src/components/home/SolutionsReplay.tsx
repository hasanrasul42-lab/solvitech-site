"use client";

/** Replays the Solutions walkthrough (handled by ConnectedSystem). */
export default function SolutionsReplay({ className }: { className: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("solutions:replay"))}>
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Replay the walkthrough
    </button>
  );
}
