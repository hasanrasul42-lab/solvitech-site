/**
 * Homepage chapters 04-07: Why Solvitech, Our Approach, Working Together and
 * Start a Conversation. All copy lives here so it can be edited without
 * touching layout code.
 *
 * Ground rules for this copy: no invented clients, credentials, team size,
 * prices, timescales or contractual promises. Anything commercial is phrased
 * as "agreed during scoping" until the founder approves specific terms.
 */

// --- 04 Why Solvitech -------------------------------------------------------

export const WHY = {
  eyebrow: "Why Solvitech",
  title: "Engineering that starts with how your business works",
  lead:
    "Solvitech is a founder-led engineering practice. We take on a focused number of projects so that each one gets senior attention from first conversation to launch, and the person who scopes your project is the person accountable for delivering it.",
  /** Dedicated About page. */
  aboutPage: "/about" as string | undefined,
  aboutLabel: "More about Solvitech",
};

export interface Principle {
  title: string;
  body: string;
}

export const PRINCIPLES: Principle[] = [
  {
    title: "Problems before technology",
    body: "We start by understanding the process, the people involved and where time or information is being lost. The technology is chosen to fit the problem, not the other way round.",
  },
  {
    title: "Practical business sense",
    body: "Every recommendation is weighed against what it costs to build and run, how it changes day-to-day work, and whether your team will actually use it.",
  },
  {
    title: "Real engineering depth",
    body: "Software, AI, automation and integrations are designed and built properly: maintainable code, sensible security, tested before launch and documented after it.",
  },
  {
    title: "Built for you, not adapted from a template",
    body: "Your workflows, data and customers are specific to you. Where an existing tool already does the job well, we will say so; where it doesn't, we build what fits.",
  },
  {
    title: "Direct founder accountability",
    body: "You deal directly with the founder throughout. Decisions, questions and problems don't pass through layers of account management.",
  },
  {
    title: "Clear communication, honest scoping",
    body: "Plain-English explanations, written scopes and regular updates. If something is uncertain, risky or not worth building, you hear it early.",
  },
];

// --- 05 Our Approach -----------------------------------------------------------

export const APPROACH = {
  eyebrow: "Our approach",
  title: "From first conversation to a system you rely on",
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
    "There is no fixed price list, because no two systems are the same. Instead, every engagement is scoped and quoted in writing before work starts, so you know what you are committing to.",
  /** Dedicated page. */
  page: "/working-together" as string | undefined,
};

export interface Engagement {
  id: "defined" | "bespoke" | "partnership";
  name: string;
  bestFor: string;
  description: string;
  examples: string;
}

export const ENGAGEMENTS: Engagement[] = [
  {
    id: "defined",
    name: "Defined projects",
    bestFor: "A clear goal with a well-understood scope.",
    description:
      "A single, contained piece of work: an automation, an integration between two systems, a website or a focused internal tool. Scope and price are agreed up front.",
    examples: "Automating a reporting process · Connecting a CRM to accounting software · A new company website",
  },
  {
    id: "bespoke",
    name: "Bespoke systems",
    bestFor: "Larger platforms where requirements need to be shaped first.",
    description:
      "Custom software, AI applications or business platforms built in milestones. Discovery and design come first, so the build is planned and priced on firm ground.",
    examples: "An operations or job-management platform · An AI assistant working with company data · A customer portal",
  },
  {
    id: "partnership",
    name: "Ongoing partnerships",
    bestFor: "Businesses that want continuing technical support and improvement.",
    description:
      "An agreed monthly arrangement for support, maintenance and continuous improvement of systems we have built, or a planned roadmap of new work.",
    examples: "Support and maintenance · Monthly improvement time · A phased automation roadmap",
  },
];

export const COST_FACTORS = {
  title: "What shapes cost and timeline",
  items: [
    { name: "Requirements", body: "How much the system needs to do, and for how many types of user." },
    { name: "Complexity", body: "Business rules, edge cases, AI behaviour and the level of reliability needed." },
    { name: "Integrations", body: "How many existing systems are involved, and how well documented their data and APIs are." },
    { name: "Scope of delivery", body: "Design, content, data migration, training and documentation included." },
    { name: "Ongoing support", body: "Hosting, monitoring, maintenance and further development after launch." },
  ],
};

export const AGREED_IN_SCOPING = {
  title: "Agreed in writing during scoping",
  items: [
    "Deliverables and what is out of scope",
    "Milestones, timeline and payment stages",
    "Ownership of code, content and data",
    "Third-party costs such as hosting, software licences and AI usage",
    "Responsibilities on both sides",
    "Support and maintenance after launch",
  ],
};

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

/** Optional "service interest" choices on the enquiry form. */
export const ENQUIRY_INTERESTS = [
  "Custom software or business system",
  "AI or intelligent application",
  "Automation",
  "Connecting systems",
  "Website or e-commerce",
  "SEO and digital growth",
  "Not sure yet",
];
