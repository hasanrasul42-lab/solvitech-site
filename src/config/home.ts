/**
 * Homepage copy (redesign V3.0): Find Your Solution, What We Do, Additional
 * Services, About, Why Solvitech, Our Approach, Working Together and Start a
 * Conversation. All copy lives here so it can be edited without touching
 * layout code.
 *
 * Ground rules for this copy: no invented clients, credentials, team size,
 * prices, timescales or contractual promises. Anything commercial is phrased
 * as "agreed during scoping" until the founder approves specific terms.
 */

import { SERVICES } from "./services";

// --- 02 Find Your Solution -------------------------------------------------------

export const FIND = {
  eyebrow: "Where to start",
  title: "What can we help you achieve?",
  intro: "Whether you’re exploring new technology or have a specific project in mind, find the right place to start.",
  bespoke: { lead: "Need bespoke software or connected systems?", label: "See Custom Software & Integrations", href: "#software" },
};

export interface Route {
  id: "ai" | "automation" | "websites";
  title: string;
  line: string;
  href: string;
  cue: string;
}

export const ROUTES: Route[] = [
  {
    id: "ai",
    title: "Explore AI for my business",
    line: "Discover where AI could add value, understand adoption and explore implementation.",
    href: "/solutions/ai",
    cue: "AI & Intelligent Solutions",
  },
  {
    id: "automation",
    title: "Save time and streamline operations",
    line: "Reduce repetitive work and improve everyday business processes.",
    href: "/solutions/automation",
    cue: "Business Automation",
  },
  {
    id: "websites",
    title: "Build a website or online store",
    line: "Explore professional websites, redesigns and e-commerce.",
    href: "/solutions/websites",
    cue: "Websites, E-commerce & Growth",
  },
];

// --- 03 What We Do -------------------------------------------------------------------

export const DIRECTORY = {
  eyebrow: "What we do",
  title: "Technology that works for your business",
  intro:
    "From exploring AI and automating processes to building websites and bespoke systems, Solvitech helps businesses put the right technology to work.",
};

export interface FamilyLink {
  label: string;
  href: string;
}

export interface Family {
  id: "ai" | "automation" | "websites" | "software";
  /** In-page anchor. */
  anchor: string;
  title: string;
  /** Who it is for, in one short line above the title. */
  kicker: string;
  description: string;
  /** Coverage, as one list or as named groups. */
  coverage: { heading?: string; items: string[] }[];
  links: FamilyLink[];
  /** Spoken description of the illustrative visual. */
  visualLabel: string;
}

export const FAMILIES: Family[] = [
  {
    id: "ai",
    anchor: "ai",
    title: "AI & Intelligent Solutions",
    kicker: "From first questions to working systems",
    description:
      "Understand where AI can benefit your business, explore practical opportunities and implement intelligent applications designed around your needs.",
    coverage: [
      { heading: "Advisory & adoption", items: ["AI discovery and advisory", "AI adoption planning", "Business decision support"] },
      { heading: "Engineering & implementation", items: ["AI implementation", "Intelligent applications", "Bespoke AI-enabled systems"] },
    ],
    links: [{ label: "Explore AI & Intelligent Solutions", href: "/solutions/ai" }],
    visualLabel:
      "Illustration: an analytics application with a highlighted finding recommending a review of trade account pricing.",
  },
  {
    id: "automation",
    anchor: "automation",
    title: "Business Automation",
    kicker: "Less admin, more done",
    description: "Reduce repetitive administration, streamline everyday processes and create more efficient ways of working.",
    coverage: [
      {
        items: [
          "Process automation",
          "Workflow improvement",
          "Administrative task automation",
          "Operational efficiency",
          "Automation between existing business tools",
          "AI-assisted automation where appropriate",
        ],
      },
    ],
    links: [{ label: "Explore Business Automation", href: "/solutions/automation" }],
    visualLabel:
      "Illustration: a new work request assigned automatically to a free slot in a weekly schedule, with the customer notified.",
  },
  {
    id: "websites",
    anchor: "websites",
    title: "Websites, E-commerce & Growth",
    kicker: "Make the right impression, and be found",
    description:
      "Professional business websites, online stores and tailored digital experiences, plus the search visibility that helps the right customers find you.",
    coverage: [
      { heading: "Websites & e-commerce", items: ["Business websites and redesigns", "E-commerce", "Bespoke digital experiences", "Responsive design and development"] },
      { heading: "Digital growth", items: ["SEO and search visibility", "Conversion improvements", "Clear measurement"] },
    ],
    links: [
      { label: "Explore Websites & E-commerce", href: "/solutions/websites" },
      { label: "Explore SEO & Digital Growth", href: "/solutions/digital-growth" },
    ],
    visualLabel:
      "Illustration: an original concept online store for a fictional ceramics brand, shown on a desktop browser and a phone.",
  },
  {
    id: "software",
    anchor: "software",
    title: "Custom Software & Integrations",
    kicker: "Built around how you operate",
    description: "Develop software around your business requirements and connect the systems you already rely on.",
    coverage: [
      { heading: "Custom software", items: ["Bespoke applications", "Internal business platforms", "Operational systems", "Client and staff portals"] },
      { heading: "Integrations", items: ["Systems integration", "Connected business applications"] },
    ],
    links: [
      { label: "Explore Custom Software", href: "/solutions/custom-software" },
      { label: "Explore Systems Integration", href: "/solutions/integrations" },
    ],
    visualLabel:
      "Illustration: a bespoke jobs management application connected to a separate accounts application, with a completed job synced as an invoice.",
  },
];

// --- 05 About Solvitech ----------------------------------------------------------------------

export const ABOUT_HOME = {
  eyebrow: "About Solvitech",
  title: ["Technology expertise.", "Business understanding"],
  statement:
    "Solvitech is a founder-led, engineering-led technology business that helps organisations make technology work more effectively.",
  body: "We start with how your business actually operates, the people, the processes and the goals, and only then recommend what to change. What gets built is tailored to you and engineered to keep working long after launch.",
  link: { label: "More about Solvitech", href: "/about" },
};

// --- 04 Why Solvitech -------------------------------------------------------

export const WHY = {
  eyebrow: "Why Solvitech",
  title: "How we approach your business",
  lead:
    "Good technology decisions come from understanding the business first. This is what you can expect from the way we work.",
  /** Dedicated About page. */
  aboutPage: "/about" as string | undefined,
  aboutLabel: "More about Solvitech",
};

export interface Principle {
  title: string;
  body: string;
}

/** Three principles, each annotating part of the example project outline. */
export const PRINCIPLES: Principle[] = [
  {
    title: "Business first",
    body: "We understand the real business challenge, its constraints and the outcome you want before deciding which technology is appropriate.",
  },
  {
    title: "Engineering with purpose",
    body: "Solutions are chosen for genuine operational need, maintainability and practical value, not novelty. Sometimes the right answer is the smaller change.",
  },
  {
    title: "Direct accountability",
    body: "Clear communication and founder-led involvement throughout the engagement you agree, with decisions explained in plain English.",
  },
];

/**
 * The neutral project-planning surface the principles annotate. An example
 * outline, labelled as such: not a client project.
 */
export const PLAN_OUTLINE: { label: string; value: string; note?: string; principle: 0 | 1 | 2 }[] = [
  { label: "Problem", value: "Enquiries wait too long to reach the right person", principle: 0 },
  { label: "Constraints", value: "Keep the current finance system · small team", principle: 0 },
  { label: "Intended outcome", value: "Every enquiry has an owner the day it arrives", principle: 0 },
  { label: "Options weighed", value: "A · Replace the customer system", note: "B · Connect existing tools and automate routing", principle: 1 },
  { label: "Recommendation", value: "Option B: less disruption, builds on what already works", principle: 1 },
  { label: "Responsibility", value: "Scoped, delivered and reported on by the founder", principle: 2 },
  { label: "Communication", value: "Progress and decisions shared in plain English", principle: 2 },
];

// --- 05 Our Approach -----------------------------------------------------------

export const APPROACH = {
  eyebrow: "Our approach",
  title: "From first conversation to a result you can rely on",
  intro:
    "Every project moves through four stages. Each one ends with something concrete for you to review, and nothing moves forward without your agreement.",
  /** Dedicated page. */
  page: "/approach" as string | undefined,
};

export interface Stage {
  id: "discover" | "design" | "engineer" | "launch";
  name: string;
  summary: string;
  happens: string;
  youContribute: string;
  weDeliver: string;
  decision: string;
}

export const STAGES: Stage[] = [
  {
    id: "discover",
    name: "Discover",
    summary: "Understand the business, the problem and what success looks like.",
    happens:
      "Conversations with you and the people who do the work, a look at your current tools and data, and an honest view of what is worth solving first.",
    youContribute:
      "Time with the right people, access to the relevant systems or examples, and clarity about priorities and constraints.",
    weDeliver:
      "A written summary of the problem, a recommended approach and an outline of scope, with the main risks and unknowns called out.",
    decision: "Whether to proceed, and with which priorities.",
  },
  {
    id: "design",
    name: "Design",
    summary: "Agree exactly what will be built before building it.",
    happens:
      "Workflows, screens, data and integrations are mapped in detail. Scope, responsibilities, third-party services and the delivery plan are pinned down.",
    youContribute: "Feedback on designs and workflows, and decisions on the options presented.",
    weDeliver:
      "An agreed specification and plan: what is in scope, what is not, how it will be delivered and what it will cost.",
    decision: "Sign-off of the scope and plan before engineering starts.",
  },
  {
    id: "engineer",
    name: "Engineer",
    summary: "Build, test and show progress in working increments.",
    happens:
      "The system is built in stages, with working versions shared as they are ready. Testing covers functionality, edge cases, security basics and the integrations it depends on.",
    youContribute:
      "Prompt feedback on each increment, test data or test accounts where needed, and user testing before launch.",
    weDeliver: "Working software at each milestone, regular progress updates and early warning of anything that affects scope.",
    decision: "Acceptance of each milestone, and approval of any change to scope.",
  },
  {
    id: "launch",
    name: "Launch & Evolve",
    summary: "Go live carefully, hand over properly and keep improving.",
    happens:
      "A planned launch, monitoring through the first period of real use, and quick fixes for anything that only shows up in practice.",
    youContribute: "Launch timing that suits your business, and feedback from the people using it.",
    weDeliver:
      "The live system, documentation and a handover of accounts and access, plus agreed support and a shortlist of sensible next improvements.",
    decision: "Go-live, and whether to continue with ongoing support or further development.",
  },
];

/** Homepage: why each stage matters. */
export const STAGE_WHY: Record<Stage["id"], string> = {
  discover: "Solving the right problem first is the surest way to spend well.",
  design: "Agreeing the detail up front avoids surprises in cost and scope.",
  engineer: "You see real progress early and can steer it as it takes shape.",
  launch: "Technology earns its value in daily use, not on launch day.",
};

/** Homepage one-liners for each stage (the /approach page keeps its fuller copy). */
export const STAGE_HOME_LINES: Record<Stage["id"], string> = {
  discover: "Clarify the need, the context, the constraints and what success looks like.",
  design: "Map the experience and the architecture before anything is built.",
  engineer: "Implement and test capabilities that fit the purpose.",
  launch: "Agree the launch, the handover and what to improve next.",
};

export const STAGE_LABELS = {
  happens: "What happens",
  youContribute: "Your part",
  weDeliver: "What we deliver",
  decision: "Decision point",
};

// --- 06 Working Together ----------------------------------------------------------

export const WORKING = {
  eyebrow: "Working together",
  title: "Clear engagements, agreed before work begins",
  intro:
    "There are different ways to work with Solvitech, depending on what you need. Every engagement is scoped and agreed in writing before work starts, so you know what you are committing to.",
  /** Dedicated page. */
  page: "/working-together" as string | undefined,
};

/** Homepage treatment of the three engagement formats. */
export const HOME_MODELS: { id: "defined" | "bespoke" | "partnership"; name: string; line: string; shape: string }[] = [
  { id: "defined", name: "Defined Projects", line: "Clearly scoped work with agreed objectives and deliverables.", shape: "One clear scope" },
  { id: "bespoke", name: "Bespoke Systems", line: "Tailored engineering engagements for more complex business requirements.", shape: "Several connected parts, in milestones" },
  { id: "partnership", name: "Ongoing Partnerships", line: "Continuing development, improvement or support where separately agreed.", shape: "A continuing cycle of improvement" },
];

// --- 07 Start a Conversation --------------------------------------------------------

export const CONTACT = {
  eyebrow: "Start a conversation",
  title: "Tell us what you want to improve",
  intro:
    "Describe the process you want to improve, the work you want to automate, the systems you want to connect or the product you want to build. It doesn't need to be a finished brief: a few sentences is enough to start.",
  expectations: [
    "A reply from the founder, not an automated sales sequence.",
    "An initial conversation to understand the problem, with no obligation.",
    "An honest view on whether, and how, Solvitech can help.",
  ],
  /**
   * Delivery configuration. Until one is set, the form works as a preview: it
   * validates and prepares the enquiry, then says plainly that it has not
   * been sent.
   *   email    -- opens the visitor's email app with the enquiry filled in
   *   page     -- the dedicated Contact page
   */
  email: undefined as string | undefined,
  page: "/contact" as string | undefined,
};

/** Homepage closing chapter (the Contact page keeps CONTACT above). */
export const CLOSING = {
  eyebrow: "Start a conversation",
  title: "Let’s discuss what your business could do better",
  intro:
    "Whether you have a specific project in mind or are exploring what’s possible, start with a conversation. You don’t need a technical specification.",
  /** Shown while no booking route exists: says exactly what the actions do. */
  previewNote:
    "Online booking isn’t connected yet. Both options open the Contact page, where you can prepare your enquiry; it says clearly that messages aren’t being delivered yet.",
};

/** Optional "service interest" choices on the enquiry form: the official service names. */
export const ENQUIRY_INTERESTS = [...SERVICES.map((s) => s.name), "Not sure yet"];
