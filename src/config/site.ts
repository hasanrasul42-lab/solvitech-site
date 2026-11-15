import { WORK_VISIBLE } from "./work";

/**
 * Site structure and navigation.
 *
 * The homepage chapters, in this order (homepage redesign V3.0, built on the
 * Master Blueprint V1.4 routes). Each
 * renders as a <section> whose id matches its chapter id. Navigation points at
 * the dedicated pages; the homepage chapters link to them as well.
 *
 * Selected Work is only shown -- and only linked -- once approved real
 * projects exist (src/config/work.ts).
 */

export type ChapterId =
  | "hero"
  | "find"
  | "solutions"
  | "more"
  | "work"
  | "about"
  | "why"
  | "approach"
  | "working-together"
  | "contact";

export interface Chapter {
  id: ChapterId;
  title: string;
  live: boolean;
}

export const HOME_CHAPTERS: Chapter[] = [
  { id: "hero", title: "Engineering better business", live: true },
  { id: "find", title: "Find your solution", live: true },
  { id: "solutions", title: "What we do", live: true },
  { id: "more", title: "Additional services", live: true },
  { id: "work", title: "Selected work", live: WORK_VISIBLE },
  { id: "about", title: "About Solvitech", live: true },
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
 * The six dedicated service pages, as the header's Solutions menu lists them.
 * The homepage groups them into four families; navigation never hides one.
 */
export interface NavService {
  label: string;
  href: string;
  line: string;
}

export const NAV_SOLUTIONS: NavService[] = [
  { label: "AI & Intelligent Solutions", href: "/solutions/ai", line: "AI advisory, adoption and intelligent applications" },
  { label: "Business Automation", href: "/solutions/automation", line: "Less repetitive admin, smoother everyday processes" },
  { label: "Websites & E-commerce", href: "/solutions/websites", line: "Business websites, redesigns and online stores" },
  { label: "Custom Software", href: "/solutions/custom-software", line: "Applications and platforms built around how you work" },
  { label: "Systems Integration", href: "/solutions/integrations", line: "Connect the systems you already rely on" },
  { label: "SEO & Digital Growth", href: "/solutions/digital-growth", line: "Be found, and turn visits into enquiries" },
];

/** The Solutions overview page, offered at the foot of the Solutions menu. */
export const SOLUTIONS_HUB = { label: "All solutions", href: "/solutions" };

/**
 * Header links after the Solutions menu: Selected Work when publishable,
 * About, Our Approach, Working Together, Contact. Only real destinations.
 */
export const NAV_LINKS: SiteLink[] = [
  chapterLink("Our Work", "work"),
  page("About", "/about"),
  page("Our Approach", "/approach"),
  page("Working Together", "/working-together"),
  page("Contact", "/contact"),
].filter((l) => !l.pending);

/**
 * Approved booking / scheduling URL. Deliberately unset: no booking service
 * has been configured. Until it is, the call action is labelled "Request a
 * call" and opens the Contact page (which says plainly that enquiries are not
 * yet delivered); nothing claims a call has been booked. Set it and every
 * call action switches to "Book a call" and the scheduler.
 */
export const BOOKING_URL: string | undefined = undefined;

/** The site-wide call action (header, homepage close). */
export const CALL_CTA: SiteLink & { external: boolean } = BOOKING_URL
  ? { label: "Book a call", href: BOOKING_URL, pending: false, external: true }
  : { label: "Request a call", href: "/contact", pending: false, external: false };

/** The written alternative to a call. */
export const ENQUIRY_CTA: SiteLink = page("Send a project enquiry", "/contact");

/** Header call to action. */
export const NAV_CTA: SiteLink & { external: boolean } = CALL_CTA;

/** Kept for the archived storytelling chapters (not on the homepage). */
export const CONVERSATION_CTA: SiteLink & { external: boolean } = BOOKING_URL
  ? { label: "Book a call", href: BOOKING_URL, pending: false, external: true }
  : { label: "Start a conversation", href: "/contact", pending: false, external: false };

/** Hero: Explore Solutions (primary, in-page) and Discuss a Project (Blueprint V1.4). */
export const HERO_CTAS = {
  primary: chapterLink("Explore solutions", "solutions"),
  secondary: page("Discuss a project", "/contact"),
};

/**
 * The social share image (src/app/opengraph-image.png). A page that sets its
 * own openGraph block replaces the inherited one, so it lists this again.
 */
export const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Solvitech: Engineering better business. Bespoke software, AI, automation and integrations.",
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
    "Solvitech helps businesses put the right technology to work: AI advisory and implementation, business automation, websites and e-commerce, custom software and systems integration.",
};
