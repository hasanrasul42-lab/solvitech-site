import { WORK_VISIBLE } from "./work";

/**
 * Site structure and navigation.
 *
 * The homepage is seven chapters, in this order (Master Blueprint V1.4). Each
 * renders as a <section> whose id matches its chapter id. Navigation points at
 * the dedicated pages; the homepage chapters link to them as well.
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

/** Public pages, for the sitemap. Selected Work is added once it exists. */
export const PUBLIC_ROUTES = ["/", "/solutions", "/about", "/approach", "/working-together", "/contact"] as const;

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

const page = (label: string, href: string): SiteLink => ({ label, href, pending: false });

/**
 * Header links (Blueprint V1.4 order: Solutions, Work when publishable,
 * Approach, About; plus Working Together). Only real destinations.
 */
export const NAV_LINKS: SiteLink[] = [
  page("Solutions", "/solutions"),
  chapterLink("Our Work", "work"),
  page("Our Approach", "/approach"),
  page("About", "/about"),
  page("Working Together", "/working-together"),
].filter((l) => !l.pending);

/** Site-wide call to action: the dedicated Contact page. */
export const NAV_CTA: SiteLink = page("Start a Project", "/contact");

/** Hero: Explore Solutions (primary, in-page) and Discuss a Project (Blueprint V1.4). */
export const HERO_CTAS = {
  primary: chapterLink("Explore solutions", "solutions"),
  secondary: page("Discuss a project", "/contact"),
};

export const SITE = {
  name: "Solvitech",
  /**
   * Canonical origin for the sitemap, robots and metadata. Unset until the
   * production domain is confirmed (NEXT_PUBLIC_SITE_URL); while unset, robots
   * asks search engines not to index.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL as string | undefined,
  title: "Solvitech | Engineering better business",
  description:
    "Solvitech designs and builds bespoke software, AI agents, business automation and integrations, plus websites and digital growth, so businesses work better.",
};
