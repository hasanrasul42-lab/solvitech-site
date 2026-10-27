/**
 * Site structure and navigation.
 *
 * The homepage is planned as seven chapters (Impress -> Explain -> Prove ->
 * Reassure -> Convert). The hero and Solutions exist today. Every link that points at
 * a chapter which is not built yet is marked `pending`: it renders as a
 * complete-looking control that says "coming soon" when used, instead of
 * routing to a page or anchor that does not exist. When a chapter ships, set
 * its `status` to "live" and the links start working as in-page anchors.
 */

export type ChapterId = "hero" | "work" | "solutions" | "approach" | "investment" | "about" | "contact";

export interface Chapter {
  id: ChapterId;
  title: string;
  status: "live" | "pending";
}

export const HOME_CHAPTERS: Chapter[] = [
  { id: "hero", title: "Engineering better business", status: "live" },
  { id: "work", title: "Selected work", status: "pending" },
  { id: "solutions", title: "Solutions", status: "live" },
  { id: "approach", title: "Our approach", status: "pending" },
  { id: "investment", title: "Investment", status: "pending" },
  { id: "about", title: "About", status: "pending" },
  { id: "contact", title: "Start a project", status: "pending" },
];

const chapter = (id: ChapterId) => HOME_CHAPTERS.find((c) => c.id === id)!;

export interface SiteLink {
  label: string;
  /** Destination once live. Chapters resolve to in-page anchors on "/". */
  href: string;
  pending: boolean;
  /** Shown when a pending link is used. */
  pendingNote?: string;
}

function chapterLink(label: string, id: ChapterId): SiteLink {
  const c = chapter(id);
  return {
    label,
    href: id === "hero" ? "/" : `/#${id}`,
    pending: c.status === "pending",
    pendingNote: `${c.title} is coming soon.`,
  };
}

export const NAV_LINKS: SiteLink[] = [
  chapterLink("Home", "hero"),
  chapterLink("Our Work", "work"),
  chapterLink("Solutions", "solutions"),
  chapterLink("Our Approach", "approach"),
  chapterLink("About", "about"),
];

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
    "Solvitech designs and builds intelligent systems, AI automations, high-performance websites and digital solutions that make businesses work better.",
};
