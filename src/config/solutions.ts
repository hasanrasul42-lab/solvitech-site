/**
 * Chapter 02 -- Solutions. All copy for the homepage Solutions chapter lives
 * here so it can be refined without touching layout code. Copy is provisional.
 *
 * Positioning: one integrated offer. Three core capabilities (Build, Automate,
 * Connect) lead; websites and growth are supporting capabilities of the same
 * team. Detailed explanations belong on future dedicated pages (planned:
 * /solutions/custom-software, /solutions/ai, /solutions/automation,
 * /solutions/integrations, /solutions/websites, /solutions/digital-growth):
 * set `page` once a page exists and the chapter links to it; until then
 * nothing links to a missing route.
 */

export const SOLUTIONS_INTRO = {
  eyebrow: "Solutions",
  title: "Technology built around your business",
  intro:
    "Bespoke software, AI, automation and integrations, engineered around the way your business already operates. From disconnected systems and repetitive tasks to customer-facing platforms.",
};

export type CapabilityId = "build" | "automate" | "connect";

export interface Capability {
  id: CapabilityId;
  name: string;
  line: string;
  /** The service area it stands for (also helps visitors scanning for it). */
  covers: string;
  /** Future dedicated page, e.g. "/solutions/automation". */
  page?: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: "build",
    name: "Build",
    line: "Software and systems designed for how a business operates.",
    covers: "Bespoke software & business systems",
  },
  {
    id: "automate",
    name: "Automate",
    line: "AI agents and workflows that take on repetitive, manual work.",
    covers: "AI agents & process automation",
  },
  {
    id: "connect",
    name: "Connect",
    line: "Integrations that allow tools and information to work together.",
    covers: "Integrations & connected data",
  },
];

/**
 * The conceptual walkthrough on the stage: a deliberately ordinary request
 * moving through a connected system. Not a client deployment.
 */
export const WALKTHROUGH = {
  label: "Conceptual walkthrough · not a client deployment",
  summary:
    "A conceptual example: a customer emails to move an order to Friday; an automated step reads the request and extracts the order number and date; the details flow into the operations system, which updates the order; and the operations team receives a clear update.",
  enquiry: { from: "Customer", text: "Can we move order #4821 to Friday?" },
  extracted: ["Reschedule", "#4821", "Friday"],
  order: { id: "#4821", before: "Thu", after: "Fri" },
  alert: { team: "Operations team", text: "Order #4821 moved to Friday", sub: "Customer notified" },
  /** Stage captions, in process order. */
  steps: {
    enquiry: "A customer enquiry arrives.",
    automate: "The request is understood and its details pulled out.",
    connect: "Structured data flows into the order system.",
    build: "The order updates and the team gets a clear, actionable alert.",
    done: "From enquiry to action, without re-typing or chasing.",
  },
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
    line: "Fast, accessible websites, e-commerce and customer-facing experiences, built on the same engineering foundations.",
  },
  {
    id: "growth",
    title: "SEO & Digital Growth",
    line: "Search visibility, conversion improvements and clear measurement, so the right people find you and get in touch.",
  },
];

export const SOLUTIONS_CLOSING = {
  line: "Not sure which of these you need? Start with the problem.",
  /** The homepage contact chapter (or the Contact page once it exists). */
  cta: { label: "Describe your project", href: "/#contact" },
};
