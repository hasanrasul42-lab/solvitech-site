/**
 * Chapter 02 -- Solutions. All copy for the homepage Solutions chapter lives
 * here so it can be refined without touching layout code. Copy is provisional.
 *
 * Positioning: one integrated offer. Three core capabilities (Build, Automate,
 * Connect) lead; websites and growth are supporting capabilities of the same
 * team. Detailed explanations belong on future dedicated pages: set `page`
 * once a page exists and the chapter links to it; until then nothing links to
 * a missing route.
 */

export const SOLUTIONS_INTRO = {
  eyebrow: "Solutions",
  title: "Technology built around your business",
  intro:
    "From disconnected systems and repetitive tasks to customer-facing platforms, we engineer practical technology around the way your business operates.",
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
    covers: "Custom software & business systems",
  },
  {
    id: "automate",
    name: "Automate",
    line: "Intelligent workflows that remove repetitive manual steps.",
    covers: "AI agents & automation",
  },
  {
    id: "connect",
    name: "Connect",
    line: "Integrations that allow tools and information to work together.",
    covers: "Integrations & data",
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
    line: "Fast, accessible websites and customer-facing experiences, built on the same foundations.",
  },
  {
    id: "growth",
    title: "Growth & Visibility",
    line: "SEO, conversion optimisation and measurement, so the right people find you and act.",
  },
];

export const SOLUTIONS_CLOSING = {
  line: "Every project starts with how your business works today.",
  /**
   * Set to a real address (or replace with the Contact page link once it
   * exists) to turn the closing into a direct contact action. Until then the
   * closing offers a working replay of the walkthrough, never a fake button.
   */
  contactEmail: undefined as string | undefined,
};
