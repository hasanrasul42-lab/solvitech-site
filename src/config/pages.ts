/**
 * Company pages: /about, /approach, /working-together, /contact.
 *
 * Working headlines follow Master Blueprint V1.4 (section 09); they are
 * working copy, not final approved copy. Content rules: no invented founder
 * biography, credentials, team, prices, deposits, response times, support
 * guarantees or legal terms. Where a business policy is not yet decided, the
 * copy says it is agreed per project, and FOUNDER_DECISIONS lists it.
 */

import type { ServiceSlug } from "./services";

// --- About -----------------------------------------------------------------------

/**
 * Founder details. Leave fields undefined until the founder approves exactly
 * what may be published; the About page only shows what is set here.
 */
export const FOUNDER = {
  name: undefined as string | undefined,
  role: "Founder",
  /** Approved first-person introduction (paragraphs). */
  introduction: undefined as string[] | undefined,
  /** Path under /public to an approved photograph. */
  photo: undefined as string | undefined,
};

export const ABOUT = {
  meta: {
    title: "About",
    description:
      "Solvitech is a founder-led engineering company building bespoke software, AI, automation and integrations around how businesses actually operate.",
  },
  eyebrow: "About Solvitech",
  headline: "Built on technical depth. Driven by business outcomes",
  intro:
    "Solvitech is an engineering-led technology company. We design and build software, AI, automation and integrations for businesses whose tools no longer fit the way they work, and we judge that work by whether it makes the business run better.",
  what: {
    title: "What Solvitech is",
    paragraphs: [
      "Most businesses don't need more technology. They need the technology they have to fit how they actually operate: information entered once, routine work handled reliably, and a clear view of what is happening.",
      "Solvitech exists to engineer that fit. Sometimes that means a purpose-built system, sometimes an AI capability inside an existing process, an automation, or a connection between tools that should already talk to each other. Websites and digital growth sit alongside, built to the same standard.",
    ],
  },
  founderLed: {
    title: "Founder-led, and honest about it",
    paragraphs: [
      "Solvitech is currently led and delivered by its founder. That is a deliberate choice for this stage of the company: the person who discusses your problem is the person who scopes it, designs the solution and is accountable for delivering it.",
      "It also means we take on a focused amount of work at a time, scope it responsibly and tell you plainly if something is outside what we can deliver well. Where a project needs specialist input, that is discussed openly before it starts.",
    ],
  },
  beliefs: {
    title: "What drives the work",
    items: [
      { title: "Engineering, not decoration", body: "Systems are designed to be dependable, maintainable and secure. How something is built matters as much as how it looks." },
      { title: "Operations first", body: "Good solutions come from understanding how the work really happens, including the exceptions and workarounds nobody wrote down." },
      { title: "Bespoke where it counts", body: "We don't force a business into a generic product, and we don't build custom software where an existing tool already does the job well." },
      { title: "Responsible delivery", body: "Clear scopes, honest estimates, testing before launch and documentation after it. No surprises that could have been raised earlier." },
      { title: "Long-term improvement", body: "The measure of a project is whether the business works better months later, not whether the technology was impressive on launch day." },
    ],
  },
  expertise: {
    title: "Where our expertise sits",
    intro: "Our core work is in four connected areas, with websites and digital growth as supporting capabilities.",
  },
  standards: {
    title: "How we hold ourselves accountable",
    items: [
      "Written scopes that say what is included and what is not",
      "Working software shown at milestones, not just at the end",
      "Testing against real scenarios before anything goes live",
      "Documentation and a proper handover of accounts and access",
      "Plain-English explanations of risks, limits and costs",
    ],
  },
};

// --- Our Approach ------------------------------------------------------------------

export interface StageDetail {
  id: "discover" | "design" | "engineer" | "launch";
  /** What the stage is for. */
  purpose: string;
  /** The single outcome the stage ends with (Blueprint V1.4). */
  outcome: string;
  /** Typical outputs; which apply depends on the project. */
  outputs: string[];
  /** Practical topics covered within this stage. */
  inPractice: { title: string; body: string }[];
}

export const APPROACH_PAGE = {
  meta: {
    title: "Our Approach",
    description:
      "How Solvitech projects run: Discover, Design, Engineer, Launch & Evolve. What happens at each stage, what you contribute, the decisions made and what you receive.",
  },
  eyebrow: "Our approach",
  headline: "Clarity before complexity",
  intro:
    "Every project moves from understanding the problem to a working, supported system in four stages. Each stage ends with something concrete for you to review, and nothing moves forward without your agreement.",
  flexibility: {
    title: "The same principles, sized to the project",
    body: "Not every engagement needs every step in full. A focused automation may move through discovery and design in a single conversation and a short written scope; a larger platform may spend weeks on them. What stays constant is that the problem is understood, the scope is agreed and the result is tested before it goes live.",
  },
  stages: [
    {
      id: "discover",
      purpose: "Establish what the real problem is, what success would look like and whether it is worth solving now.",
      outcome: "A clearly defined problem",
      outputs: ["Summary of the problem and objectives", "Notes on current tools, data and constraints", "Recommended approach and outline scope", "Key risks and open questions"],
      inPractice: [
        { title: "Discovery and requirements", body: "Conversations with you and the people who do the work, to understand the process, the exceptions and what the business needs it to achieve." },
        { title: "Existing system assessment", body: "A look at the software, data and accounts already in place: what can be reused, what can be connected and what is holding things back." },
        { title: "Technical feasibility", body: "Checking early that what is proposed is possible with the systems and access available, especially for integrations and AI." },
      ],
    },
    {
      id: "design",
      purpose: "Decide exactly what will be built, how it will work and what it will take, before building it.",
      outcome: "An approved plan",
      outputs: ["Written scope and deliverables", "Workflows, screens or data designs", "Architecture and technology choices", "Milestones, quotation and commercial terms"],
      inPractice: [
        { title: "Scope and deliverables", body: "A written statement of what is included and what is not, so both sides share the same expectations." },
        { title: "Architecture and design decisions", body: "Choosing how the system is structured, where data lives, which services it depends on and why, explained in plain terms." },
        { title: "Commercial agreement", body: "Milestones, payment stages, ownership and third-party costs are set out alongside the plan for you to approve." },
      ],
    },
    {
      id: "engineer",
      purpose: "Build, integrate and test the agreed solution, with progress you can see along the way.",
      outcome: "An acceptance-ready deliverable",
      outputs: ["Working software at agreed milestones", "Integrations with your existing systems", "Test results and fixes", "Progress updates and early warnings"],
      inPractice: [
        { title: "Development and integration", body: "Built in stages, with working versions shared as they are ready rather than revealed only at the end." },
        { title: "Testing and acceptance", body: "Testing covers the normal paths, edge cases, failure handling and integrations. You test it with real scenarios and confirm it meets the agreed scope." },
        { title: "Managing changes in scope", body: "If something new comes up, its effect on cost and timing is set out in writing, and it only goes ahead once you approve it." },
      ],
    },
    {
      id: "launch",
      purpose: "Go live carefully, hand over properly and keep the system working and improving.",
      outcome: "Clear responsibilities after launch",
      outputs: ["Live system and launch checks", "Documentation and handover of access", "Agreed support arrangement", "Shortlist of sensible next improvements"],
      inPractice: [
        { title: "Launch and handover", body: "A planned go-live at a time that suits your business, with monitoring through the first period of real use." },
        { title: "Documentation", body: "Clear records of how the system works, how to use it and how it is configured, so you are never dependent on memory." },
        { title: "Maintenance and ongoing improvement", body: "Hosting, updates and support are arranged as agreed. Many systems then improve in stages as the business learns from using them." },
      ],
    },
  ] as StageDetail[],
  communication: {
    title: "Throughout the project",
    items: [
      { title: "One point of contact", body: "You deal directly with the founder, who is accountable for the work from scope to handover." },
      { title: "Plain-English updates", body: "Progress, decisions and risks explained without jargon, at a rhythm agreed at the start." },
      { title: "Early warnings", body: "If something is likely to affect cost, timing or scope, you hear about it as soon as it is known." },
    ],
  },
};

// --- Working Together ------------------------------------------------------------------

export const WORKING_PAGE = {
  meta: {
    title: "Working Together",
    description:
      "How to engage Solvitech: defined projects, bespoke systems and ongoing partnerships. What shapes a quotation and what is agreed in writing before work starts.",
  },
  eyebrow: "Working together",
  headline: "A clear scope. A considered investment",
  intro:
    "You should know what you are getting, what it costs and who is responsible for what before any work begins. Every engagement is scoped and quoted in writing first, whatever its size.",
  models: [
    {
      id: "defined",
      name: "Defined projects",
      summary: "Focused, clearly scoped pieces of work.",
      body: "A single automation, an integration between two systems, a website, an improvement to an existing tool or a contained technical task. The scope is agreed up front and quoted as a whole.",
      suits: "When you know what you need and the work can be described clearly from the start.",
      examples: ["A website or booking journey", "Automating a reporting or approval process", "Connecting two existing systems", "Fixing or extending an existing tool"],
      related: ["websites", "automation", "integrations"] as ServiceSlug[],
    },
    {
      id: "bespoke",
      name: "Bespoke systems",
      summary: "Larger applications, integrations and operational platforms.",
      body: "Custom software, AI applications and multi-system integrations, delivered in milestones. Discovery and design come first so that the build is planned and priced on firm ground rather than guesswork.",
      suits: "When requirements need shaping, several systems are involved or the solution is central to how you operate.",
      examples: ["An operations or job-management platform", "A customer or supplier portal", "An AI capability built into your processes", "Integration across CRM, finance and operations"],
      related: ["custom-software", "ai", "integrations"] as ServiceSlug[],
    },
    {
      id: "partnership",
      name: "Ongoing partnerships",
      summary: "Agreed, continuing support and improvement.",
      body: "A defined arrangement for maintenance, support and improvement of systems we have built, or a planned programme of automation or digital-growth work. The scope of each arrangement is set out in writing.",
      suits: "When technology is part of how you operate day to day and should keep improving.",
      examples: ["Maintenance and support of a delivered system", "Regular improvement time", "A phased automation roadmap", "Ongoing SEO and conversion work"],
      related: ["automation", "digital-growth"] as ServiceSlug[],
    },
  ],
  quoteFactors: {
    title: "What influences a quotation",
    intro: "There is no fixed price list. A quotation reflects the work actually involved, which depends on:",
    items: [
      { title: "Scope and complexity", body: "How much the solution must do, how many types of user it serves and how many rules and exceptions it handles." },
      { title: "Required functionality", body: "The features, screens, reports and automations needed in the first version, and what can sensibly wait." },
      { title: "Integrations and access", body: "How many existing systems are involved, the quality of their APIs and the access available." },
      { title: "Data and security", body: "Data migration, personal or sensitive information, permissions and any compliance requirements." },
      { title: "Testing and delivery", body: "The level of testing, user acceptance, training and launch support the project needs." },
      { title: "Hosting and third-party services", body: "Hosting, software licences, AI usage and other services the solution depends on." },
      { title: "Maintenance and support", body: "What support, monitoring and further development is needed after launch." },
    ],
  },
  agreed: {
    title: "Defined during scoping, confirmed in the agreement",
    intro: "These are set out for each project before work starts, rather than assumed:",
    items: [
      { title: "Deliverables", body: "What will be delivered, what is out of scope and how acceptance works." },
      { title: "Ownership", body: "Who owns the code, content and data, and who holds the accounts and access." },
      { title: "Payment milestones", body: "When payments fall due across the project." },
      { title: "Third-party costs", body: "Which services are needed, who holds each account and who pays for it." },
      { title: "After launch", body: "Support, maintenance and responsibilities once the work is live." },
    ],
  },
  questions: {
    title: "Common questions",
    items: [
      {
        q: "How much will my project cost?",
        a: "It depends on the factors above, so we don't publish prices. After an initial conversation and enough scoping to understand the work, you receive a written quotation before committing to anything.",
      },
      {
        q: "Who owns the finished work?",
        a: "Ownership of code, content and data, and access to the accounts involved, is set out in the agreement for each project before work begins.",
      },
      {
        q: "Who pays for hosting, licences and AI usage?",
        a: "Third-party services are identified during scoping. The agreement states which accounts are needed, who holds them and who pays for them.",
      },
      {
        q: "What happens if our requirements change?",
        a: "Change is normal. Any change to the agreed scope is described in writing with its effect on cost and timing, and only goes ahead once you approve it.",
      },
      {
        q: "What support is available after launch?",
        a: "Support arrangements are agreed for each project. Some clients need only a handover; others choose an ongoing partnership for maintenance and improvement.",
      },
      {
        q: "Can we start small?",
        a: "Yes. A focused first project is often the best way to solve the most pressing problem and see how we work before anything larger.",
      },
    ],
  },
};

// --- Contact ------------------------------------------------------------------------------

export const CONTACT_PAGE = {
  meta: {
    title: "Start a Project",
    description:
      "Tell Solvitech what you want to improve, automate, connect or build. Describe the problem in a few sentences to start a conversation.",
  },
  eyebrow: "Start a project",
  headline: "What could work better in your business",
  intro:
    "Tell us about the process, system or idea you have in mind. It doesn't need to be a finished brief: a few sentences about the problem is the best place to start.",
  topicsTitle: "Things we can discuss",
  topics: [
    { label: "Replacing spreadsheets and workarounds with a proper system", slug: "custom-software" },
    { label: "Using AI to read documents, find answers or draft work", slug: "ai" },
    { label: "Automating repetitive tasks, approvals and follow-ups", slug: "automation" },
    { label: "Connecting systems that don't talk to each other", slug: "integrations" },
    { label: "A new website, booking journey or online shop", slug: "websites" },
    { label: "Being easier to find and measuring what works", slug: "digital-growth" },
  ] as { label: string; slug: ServiceSlug }[],
  next: {
    title: "What happens next",
    steps: [
      { title: "Your message is read by the founder", body: "Not routed through a sales team or an automated sequence." },
      { title: "A reply to arrange a conversation", body: "If it sounds like something we can help with, we suggest a time to talk it through." },
      { title: "An initial conversation", body: "To understand the problem, your priorities and any constraints. No obligation to go further." },
      { title: "A clear proposal", body: "If it makes sense to proceed, a written scope and quotation for you to consider." },
    ],
  },
};

/**
 * Decisions the founder still needs to make before these pages can say more
 * (Master Blueprint V1.4, sections 09 and 12). Kept here so they are visible
 * to whoever edits the copy.
 */
export const FOUNDER_DECISIONS = [
  "Founder name, introduction and photograph for the About page",
  "Whether the introductory conversation is free, and whether paid discovery or audits are offered",
  "Validated starting prices, if any are to be published",
  "Deposit and payment milestone policy",
  "Default ownership and source-access terms",
  "Hosting, API and licence arrangements",
  "Support and maintenance options or tiers",
  "Enquiry delivery: recipient address and sending method",
  "Response-time expectations for enquiries",
];
