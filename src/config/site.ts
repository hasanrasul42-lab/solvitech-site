import { WORK_VISIBLE } from "./work";

/**
 * Site structure and navigation.
 *
 * The homepage is seven chapters, in this order. Each renders as a <section>
 * whose id matches its chapter id, so navigation resolves to in-page anchors
 * until dedicated pages exist (see PLANNED_PAGES).
 *
 * Selected Work is only shown -- and only linked -- once approved real
 * projects exist (src/config/work.ts).
 */

export type ChapterId = "hero" | "solutions" | "work" | "why" | "approach" | "working-together" | "contact";

export interface Chapter {
  id: ChapterId;
  title: string;
  live: boolean;
}

export const HOME_CHAPTERS: Chapter[] = [
  { id: "hero", title: "Engineering better business", live: true },
  { id: "solutions", title: "Solutions", live: true },
  { id: "work", title: "Selected work", live: WORK_VISIBLE },
  { id: "why", title: "Why Solvitech", live: true },
  { id: "approach", title: "Our approach", live: true },
  { id: "working-together", title: "Working together", live: true },
  { id: "contact", title: "Start a conversation", live: true },
];

export const isLive = (id: ChapterId) => HOME_CHAPTERS.some((c) => c.id === id && c.live);

/**
 * Dedicated pages planned for later tasks. Nothing links to these until they
 * exist: when a page ships, point the relevant config `page` field at it.
 */
export const PLANNED_PAGES = [
  "/solutions",
  "/solutions/ai",
  "/solutions/automation",
  "/solutions/custom-software",
  "/solutions/integrations",
  "/solutions/websites",
  "/solutions/digital-growth",
  "/about",
  "/approach",
  "/working-together",
  "/contact",
] as const;

export interface SiteLink {
  label: string;
  href: string;
  /** A destination that does not exist yet (renders as a "coming soon" control). */
  pending: boolean;
  pendingNote?: string;
}

function chapterLink(label: string, id: ChapterId): SiteLink {
  return { label, href: id === "hero" ? "/" : `/#${id}`, pending: !isLive(id) };
}

/** Header links: only chapters that are live. */
export const NAV_LINKS: SiteLink[] = [
  chapterLink("Solutions", "solutions"),
  chapterLink("Our Work", "work"),
  chapterLink("About", "why"),
  chapterLink("Approach", "approach"),
  chapterLink("Working Together", "working-together"),
].filter((l) => !l.pending);

/** Header call to action (styled as a button, separate from the text links). */
export const NAV_CTA: SiteLink = chapterLink("Start a Project", "contact");

export const HERO_CTAS = {
  primary: chapterLink("Explore solutions", "solutions"),
  secondary: chapterLink("Discuss a project", "contact"),
};

export const SITE = {
  name: "Solvitech",
  title: "Solvitech | Engineering better business",
  description:
    "Solvitech designs and builds bespoke software, AI agents, business automation and integrations, plus websites and digital growth, so businesses work better.",
};
