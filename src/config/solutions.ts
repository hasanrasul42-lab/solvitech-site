/**
 * Chapter 02 -- Solutions. All copy for the homepage Solutions chapter lives
 * here so it can be refined without touching layout code. Copy is provisional.
 *
 * Positioning: one integrated offer. The four core services lead (shown as
 * one connected map, ServiceMap.tsx); websites and growth are supporting
 * capabilities of the same team. Each links to its dedicated page.
 */

export const SOLUTIONS_INTRO = {
  eyebrow: "Solutions",
  title: "Technology built around your business",
  intro:
    "Bespoke software, AI, automation and integrations, engineered around the way your business already operates. From disconnected systems and repetitive tasks to customer-facing platforms.",
};

export interface Pathway {
  id: string;
  title: string;
  line: string;
  /** Future dedicated page; until set, the pathway is informational only. */
  page?: string;
}

export const SUPPORTING_LABEL = "Also from the same team";

export const SUPPORTING: Pathway[] = [
  {
    id: "websites",
    title: "Websites & Digital Experiences",
    page: "/solutions/websites",
    line: "Fast, accessible websites, e-commerce and customer-facing experiences, built on the same engineering foundations.",
  },
  {
    id: "growth",
    title: "SEO & Digital Growth",
    page: "/solutions/digital-growth",
    line: "Search visibility, conversion improvements and clear measurement, so the right people find you and get in touch.",
  },
];

export const SOLUTIONS_CLOSING = {
  line: "Not sure which of these you need? Start with the problem.",
  /** The homepage contact chapter (or the Contact page once it exists). */
  cta: { label: "Start a Project", href: "/#contact" },
  hub: { label: "Explore Solutions", href: "/solutions" },
};
