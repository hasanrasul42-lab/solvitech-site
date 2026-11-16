/**
 * /solutions/ai -- AI Consulting & Implementation (AI Service Page 3D
 * Experience Plan V1.0, 15 November 2026). All copy lives here, in British
 * English, as supplied in the plan. No clients, results, prices, timescales,
 * certifications or guarantees. The knowledge-assistant example is fictional
 * and answers only from the three sample sources below.
 */

export const AI_PAGE = {
  meta: {
    title: "AI Consulting & Implementation for Businesses | Solvitech",
    description:
      "Explore practical AI consulting, adoption and custom AI implementation for businesses. Discover opportunities, intelligent applications and responsible integration with Solvitech.",
  },
  /** Page / navigation label (the homepage family is "AI & Intelligent Solutions"). */
  label: "AI Consulting & Implementation",
};

// --- 01 Hero ---------------------------------------------------------------------------

export const AI_HERO = {
  eyebrow: "AI Consulting & Implementation",
  title: "Make AI useful in your business",
  lead: "Not sure where AI fits? Already have an idea you want to build? Solvitech helps businesses identify practical opportunities, design intelligent applications and introduce AI into the way they work.",
  support: "From first exploration to bespoke implementation, the aim is useful technology that addresses a real business need.",
  primary: { label: "Discuss AI for Your Business", href: "/contact" },
  secondary: { label: "See Where AI Can Help", href: "#ai-help" },
  visualLabel:
    "Illustration: a knowledge assistant answers “How do we handle an urgent enquiry?”, with the three source documents it draws on floating around it.",
};

// --- 02 Pain -------------------------------------------------------------------------

export const AI_PAIN = {
  eyebrow: "Where AI can help",
  title: "Your business has information. Using it is the hard part",
  body: "Answers sit across documents and messages. Routine information takes time to review. Important details can be difficult to spot when people are already busy. AI may be able to reduce that effort, provided it is applied to the right problem.",
  items: [
    { title: "Finding answers", body: "Valuable knowledge is spread across files and people." },
    { title: "Handling information", body: "Documents and messages need repeated reading, sorting or summarising." },
    { title: "Knowing what matters", body: "Signals can be easy to miss among everyday activity." },
  ],
  visualLabel:
    "Illustration: a scattered pile of files, a spreadsheet, a sticky note, a team chat and an overdue reminder, with one urgent customer message lifted out of it.",
};

// --- 03 Offerings -----------------------------------------------------------------------

export const AI_OFFERS = {
  eyebrow: "How we help",
  title: "Start with the business need. Then choose the technology",
  intro:
    "Some businesses need a clearer plan. Others need a tailored application or help making AI work with their existing systems. The starting point should match the requirement.",
  items: [
    {
      title: "AI discovery & adoption",
      body: "Understand business processes, identify realistic opportunities, assess suitability and plan an appropriate next step.",
    },
    {
      title: "Custom AI applications",
      body: "Develop intelligent assistants, document tools or application features around the information and tasks your business actually uses.",
    },
    {
      title: "AI implementation & integration",
      body: "Introduce selected AI capabilities into existing workflows and systems with suitable testing, access controls and human review.",
    },
  ],
  micro: { lead: "Not sure which applies?", label: "Discuss your challenge", href: "/contact" },
  visualLabel:
    "Illustration: three cards stepping towards the viewer: a discovery map, a custom AI tool and an integration linking a CRM and an inbox through AI.",
};

// --- Sample sources (fictional; used in the visuals) ----------------------------------------

export interface AiSource {
  id: "guide" | "escalation" | "handover";
  title: string;
  /** The single sample extract the assistant may draw on. */
  extract: string;
  section: string;
}

/** The fictional sample corpus. The assistant answers only from these. */
export const AI_SOURCES: AiSource[] = [
  {
    id: "guide",
    title: "Customer Enquiries Guide",
    section: "Section 2 · Urgent enquiries",
    extract: "Urgent enquiries must be marked urgent and assigned an owner on the same working day.",
  },
  {
    id: "escalation",
    title: "Escalation Rules",
    section: "Rule 4 · Unresolved urgent enquiries",
    extract: "An urgent enquiry that remains unresolved two working hours after assignment must be escalated to a team lead.",
  },
  {
    id: "handover",
    title: "Handover Checklist",
    section: "Item 1 · Escalation handovers",
    extract: "Every escalation handover must include the original request, current owner, action taken and next action.",
  },
];

// --- 05 Applications ----------------------------------------------------------------------

export const AI_APPS = {
  eyebrow: "Where it can apply",
  title: "The right AI depends on the work you need to improve",
  lead: "Different businesses need different capabilities. These examples illustrate how AI might assist people with information-heavy tasks.",
  items: [
    {
      title: "Internal knowledge & search",
      body: "Help people find relevant answers in approved policies, procedures and reference material, with source references where appropriate.",
    },
    {
      title: "Document understanding",
      body: "Extract, classify or summarise information from documents for staff to review, reducing repeated manual reading and entry.",
    },
    {
      title: "Decision support",
      body: "Bring relevant information together, surface patterns or exceptions and present recommendations that people can assess.",
    },
    {
      title: "AI-assisted operations",
      body: "Help teams prepare responses, categorise requests or complete information-heavy steps within existing workflows, with suitable checks.",
    },
  ],
  clarification: "These are illustrative possibilities, not guaranteed outcomes or client examples.",
  visualLabel:
    "Illustration: four capability tiles, knowledge search, document understanding, decision support and AI-assisted operations, with the document tile producing extracted invoice details ready to check.",
};

// --- 06 Approach ---------------------------------------------------------------------------

export const AI_APPROACH = {
  eyebrow: "From idea to implementation",
  title: "A considered route from possibility to practical use",
  lead: "We begin with the challenge, evaluate whether AI is appropriate, develop the solution and plan how it will be used. The work and level of involvement are agreed around the project.",
  stages: [
    { name: "Discover", body: "Understand the business objective, current work, information sources and constraints.", sheet: "Objective" },
    {
      name: "Design",
      body: "Assess suitability, data access, expected behaviour, risks, measures of success and the right implementation approach.",
      sheet: "Solution design",
    },
    { name: "Engineer", body: "Develop and test the application or integration against agreed requirements, including realistic exceptions.", sheet: "Test evidence" },
    { name: "Launch & Evolve", body: "Introduce the solution, review how it performs and identify improvements or support needs as agreed.", sheet: "Rollout checklist" },
  ],
  cta: { label: "Learn About Our Approach", href: "/approach" },
  visualLabel:
    "Illustration: four stage bars stepping forward, Discover, Design, Engineer and Launch & evolve, with the last marked as in use.",
};

// --- 07 Responsible -------------------------------------------------------------------------

export const AI_TRUST = {
  eyebrow: "Responsible by design",
  title: "Useful AI needs the right boundaries",
  body: "The best solution depends on the information available, how the business works and where human judgement is needed. We consider access to information, reliability, testing and review rather than assuming every task should be automated by AI.",
  principles: [
    { title: "Relevant information and access", body: "Use appropriate information sources and decide who can access what." },
    { title: "Evidence and checking", body: "Make important outputs reviewable and test behaviour against real-world cases." },
    { title: "Human control", body: "Keep appropriate review and approval steps where decisions require judgement or accountability." },
  ],
  faq: [
    {
      q: "Do we need a large amount of data to start?",
      a: "Not necessarily. It depends on the use case, what information is available and the quality and access requirements. We can begin by evaluating a specific problem.",
    },
    {
      q: "Can AI work with our existing software?",
      a: "Often, depending on the systems and their integration options. We would assess what can be connected and whether the approach makes sense.",
    },
    {
      q: "Does every business need a custom AI system?",
      a: "No. An existing product, simpler automation or an improved process may be the better choice. Bespoke development is appropriate when there is a clear need for it.",
    },
    {
      q: "Can we start with a small project?",
      a: "A focused use case or prototype can be a sensible way to test value and suitability before considering a wider implementation. Scope and costs would be agreed first.",
    },
    {
      q: "How is pricing determined?",
      a: "It depends on the problem, complexity, information sources, integration requirements and ongoing services. We would discuss the requirements before proposing a scope.",
    },
  ],
  cta: { lead: "Have a question about AI?", label: "Let’s talk", href: "/contact" },
  visualLabel:
    "Illustration: a question passing through three gates, access, evidence and approval, and coming out as an answer approved by a team lead.",
};

// --- 08 Conversation -------------------------------------------------------------------------

export const AI_CLOSE = {
  eyebrow: "Start a conversation",
  title: "You don’t need an AI plan to start",
  body: "Tell us what you’re trying to improve, where your team spends time, or what you’ve been considering. We can discuss whether AI makes sense and what a practical next step might look like.",
  primary: { label: "Discuss Your AI Goals", href: "/contact" },
  secondary: { label: "Explore Other Solutions", href: "/solutions" },
  related: [
    { label: "Business Automation", href: "/solutions/automation" },
    { label: "Custom Software", href: "/solutions/custom-software" },
    { label: "Systems Integration", href: "/solutions/integrations" },
  ],
  visualLabel:
    "Illustration: a phone conversation about finding answers in old documents, beside a card for a first conversation: your challenge, whether AI fits and a practical next step.",
};
