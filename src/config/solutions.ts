/**
 * Supporting pathways (websites and growth): capabilities of the same team,
 * shown after the four core service stories (src/config/stories.ts) as
 * clearly secondary links to their dedicated pages.
 */

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
