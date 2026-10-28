/**
 * The Solutions offering: the /solutions hub and the six service pages.
 *
 * Copy rules: no invented clients, results, statistics, credentials or
 * guarantees. Every example below is an illustrative scenario (labelled as
 * such on the page), not a description of a delivered project.
 *
 * Each service has one `feature` block that differs by type, so the pages
 * share a structure without being the same page with different words.
 */

export type ServiceSlug = "custom-software" | "ai" | "automation" | "integrations" | "websites" | "digital-growth";

export interface TextItem {
  title: string;
  body: string;
}

export interface Example {
  title: string;
  /** The situation, written as a hypothetical. */
  situation: string;
  /** What could be built. */
  approach: string;
}

export type Feature =
  | { kind: "comparison"; title: string; intro: string; columns: [string, string]; rows: { label: string; a: string; b: string }[] }
  | { kind: "checklist"; title: string; intro: string; items: TextItem[] }
  | { kind: "principles"; title: string; intro: string; items: TextItem[] };

export interface Service {
  slug: ServiceSlug;
  href: `/solutions/${ServiceSlug}`;
  tier: "core" | "supporting";
  /** Full name, used in headings and page titles. */
  name: string;
  /** Short label for navigation and cross-links. */
  short: string;
  meta: { title: string; description: string };
  /** One-line summary for the hub and cross-links. */
  summary: string;
  hero: { headline: string; intro: string };
  /** What the service actually involves. */
  involves: { title: string; paragraphs: string[] };
  /** Recognisable business problems, in the visitor's words. */
  problems: string[];
  /** What Solvitech can design or engineer. */
  builds: TextItem[];
  examples: Example[];
  feature: Feature;
  /** What a typical engagement looks like for this service. */
  engagement: { steps: TextItem[]; note: string };
  considerations: TextItem[];
  related: { slug: ServiceSlug; why: string }[];
  cta: { title: string; body: string };
}

export const SERVICES: Service[] = [
  // --- Core ---------------------------------------------------------------------
  {
    slug: "custom-software",
    href: "/solutions/custom-software",
    tier: "core",
    name: "Custom Software & Business Systems",
    short: "Custom Software",
    meta: {
      title: "Custom Software & Business Systems",
      description:
        "Bespoke business software built around how you operate: portals, operational platforms, job management, scheduling, dashboards and internal tools.",
    },
    summary: "Portals, operational platforms and internal tools designed around how your business actually runs.",
    hero: {
      headline: "Software shaped around the way you work",
      intro:
        "When spreadsheets, shared inboxes and off-the-shelf tools no longer fit how your business runs, a purpose-built system can. We design and engineer business software around your real workflows, so your team works in one place instead of around the gaps.",
    },
    involves: {
      title: "What custom software involves",
      paragraphs: [
        "Custom software is built for a specific organisation and the way it operates. That might be an internal platform your team uses all day, a portal for customers or suppliers, or a focused tool that replaces a fragile spreadsheet.",
        "The work is as much about understanding the process as writing code: who does what, what information they need, where the exceptions are and what has to be recorded. The software then reflects those rules, rather than forcing your team to adapt to a generic product.",
      ],
    },
    problems: [
      "Our operation runs on spreadsheets that only one or two people fully understand.",
      "We pay for several tools and still re-type the same information between them.",
      "Off-the-shelf software covers 70% of what we need, and the rest is workarounds.",
      "Customers keep emailing to ask for updates we could show them directly.",
      "Managers can't see the state of jobs, orders or cases without asking around.",
    ],
    builds: [
      { title: "Operational platforms", body: "The central system for jobs, orders, cases or projects: statuses, assignments, history and the rules that move work along." },
      { title: "Scheduling & job management", body: "Bookings, rotas, capacity and dispatch, with the constraints that matter in your business built in." },
      { title: "Customer & supplier portals", body: "Secure areas where outside users submit requests, upload documents, track progress and see their own records." },
      { title: "Dashboards & reporting", body: "Live views of the numbers people actually make decisions on, drawn from the system rather than compiled by hand." },
      { title: "Internal tools", body: "Focused applications that replace a spreadsheet, a paper form or a manual check with something reliable and auditable." },
      { title: "Extending existing systems", body: "New modules, interfaces or data models added alongside software you already run, where replacing it would be wasteful." },
    ],
    examples: [
      {
        title: "A field-service job board",
        situation: "A maintenance company tracks jobs in a spreadsheet and coordinates engineers by phone and WhatsApp.",
        approach:
          "A job-management system with a scheduling board, engineer assignments, mobile job sheets with photos and sign-off, and automatic customer updates when a visit is booked or completed.",
      },
      {
        title: "A supplier onboarding portal",
        situation: "A distributor collects supplier documents and certificates by email and loses track of renewals.",
        approach:
          "A portal where suppliers upload and update their documents, with expiry tracking, internal review steps and reminders before anything lapses.",
      },
      {
        title: "An operations dashboard",
        situation: "Directors receive a weekly report that takes half a day to assemble and is out of date when it arrives.",
        approach: "A live dashboard fed from the operational systems, with drill-down to the underlying records and agreed definitions for each figure.",
      },
    ],
    feature: {
      kind: "comparison",
      title: "Off-the-shelf or bespoke?",
      intro: "Bespoke is not always the right answer. We will recommend an existing product when it genuinely fits.",
      columns: ["Off-the-shelf software", "Custom software"],
      rows: [
        { label: "Fit", a: "Built for the average business in a category", b: "Built around your workflows and rules" },
        { label: "Start-up time", a: "Fast to start using", b: "Takes time to design and build" },
        { label: "Cost profile", a: "Ongoing per-user subscriptions", b: "Upfront build, then hosting and support" },
        { label: "Change", a: "Depends on the vendor's roadmap", b: "Changes when your business needs them" },
        { label: "Best when", a: "Your process is standard", b: "Your process is how you compete" },
      ],
    },
    engagement: {
      steps: [
        { title: "Discovery", body: "Mapping the process, users and data, and deciding what the first version must do." },
        { title: "Design", body: "Screens, data model and permissions agreed before building, with the scope written down." },
        { title: "Build in milestones", body: "Working software released in stages for you to test with real users." },
        { title: "Launch & support", body: "Data migration, training, go-live and an agreed arrangement for support and improvements." },
      ],
      note: "Most systems start with a focused first version that replaces the most painful part of the process, then grow from there.",
    },
    considerations: [
      { title: "Ownership and running costs", body: "Custom software needs hosting, maintenance and occasional updates. Ownership of the code and data is agreed during scoping." },
      { title: "Time from your team", body: "The people who do the work need to be involved in design and testing. Their input is what makes the system fit." },
      { title: "Data migration", body: "Moving existing records across is often underestimated. It is planned and tested as part of the project, not left to the end." },
    ],
    related: [
      { slug: "integrations", why: "Connect the new system to the tools you keep, such as accounting or CRM." },
      { slug: "automation", why: "Remove the routine steps once the process lives in one place." },
      { slug: "ai", why: "Add document reading, search or assistance inside the system." },
    ],
    cta: { title: "Have a process that has outgrown its tools?", body: "Tell us how the work happens today and where it breaks down." },
  },
  {
    slug: "ai",
    href: "/solutions/ai",
    tier: "core",
    name: "AI & Intelligent Applications",
    short: "AI",
    meta: {
      title: "AI & Intelligent Applications",
      description:
        "AI assistants, document understanding, knowledge retrieval and decision support, built into the way your business works, with appropriate human oversight and data protection.",
    },
    summary: "AI assistants, document understanding and knowledge retrieval, built in with the right checks around them.",
    hero: {
      headline: "AI that does useful work, with the right checks around it",
      intro:
        "Modern AI can read documents, answer questions from your own information and draft the routine parts of a job. We design and build AI into real business processes, with clear limits, human review where it matters and careful handling of your data.",
    },
    involves: {
      title: "What AI work involves",
      paragraphs: [
        "Most valuable business uses of AI are not chatbots on a homepage. They are specific tasks inside a process: pulling the key details out of an invoice, finding the relevant clause in a contract, drafting a reply for a person to check, or summarising a long case history.",
        "Building these well means choosing the right model and approach, connecting it to the right information, deciding what the AI may do on its own and what needs a person, and testing it against real examples before anyone relies on it.",
      ],
    },
    problems: [
      "Staff spend hours reading documents to copy a handful of details into another system.",
      "The answer is somewhere in our files, policies or past emails, but finding it takes too long.",
      "Every enquiry gets a similar first reply, written by hand each time.",
      "We tried a general AI tool, but it doesn't know our business and we're unsure what happens to our data.",
      "We want to use AI but don't know which tasks it is actually reliable enough for.",
    ],
    builds: [
      { title: "AI assistants", body: "Assistants for your team or customers that answer from your approved information and hand over to a person when they should." },
      { title: "Document understanding", body: "Reading invoices, forms, contracts or reports and extracting structured data, with confidence checks and review queues." },
      { title: "Knowledge retrieval", body: "Search across policies, manuals, tickets and records that returns answers with links to the sources they came from." },
      { title: "Drafting & summarising", body: "First drafts of replies, reports or case notes, prepared for a person to review and send." },
      { title: "Decision support", body: "Classifying, prioritising and flagging items for attention, so people spend their time where judgement is needed." },
      { title: "AI inside existing software", body: "Adding these capabilities to systems you already use, rather than creating another separate tool." },
    ],
    examples: [
      {
        title: "Invoice and delivery-note processing",
        situation: "An accounts team keys supplier invoices into the finance system and checks them against orders by hand.",
        approach:
          "AI reads each invoice, extracts supplier, amounts and order references, matches them to the purchase order, and sends anything that doesn't match to a person with the discrepancy highlighted.",
      },
      {
        title: "An internal policy assistant",
        situation: "Staff regularly ask HR and operations the same questions about procedures and policies.",
        approach:
          "An assistant that answers only from the approved policy library, shows which document each answer comes from, and refers anything outside it to the right person.",
      },
      {
        title: "Enquiry triage",
        situation: "A shared inbox receives a mix of sales enquiries, support requests and supplier messages.",
        approach:
          "Each message is categorised, key details are extracted, and it is routed to the right queue with a suggested reply drafted for a person to approve.",
      },
    ],
    feature: {
      kind: "principles",
      title: "Oversight, accuracy and data protection",
      intro: "AI is powerful but not infallible. These decisions are designed in from the start, not added afterwards.",
      items: [
        { title: "A person decides where it matters", body: "Anything with financial, legal, safety or customer impact can require human approval. The AI prepares; a person decides." },
        { title: "Answers show their sources", body: "Where AI answers from your information, it cites the documents used, so answers can be checked rather than trusted blindly." },
        { title: "Tested on real examples", body: "Accuracy is measured against a set of your own cases before launch, and monitored afterwards, including the cases it gets wrong." },
        { title: "Your data is handled deliberately", body: "We choose providers and settings with data protection in mind, limit what is sent to AI services, and document where data goes." },
      ],
    },
    engagement: {
      steps: [
        { title: "Identify the task", body: "Pinpoint the specific, repeated task where AI could help, and what a good result looks like." },
        { title: "Prove it on your data", body: "A small, contained trial against real examples to measure how reliable the approach is." },
        { title: "Build it into the process", body: "Integrate the working approach into your systems, with review steps, logging and controls." },
        { title: "Monitor and refine", body: "Track accuracy and usage after launch, and adjust prompts, data or rules as you learn." },
      ],
      note: "A short proof stage before full development means you see how well AI handles your material before committing to a larger build.",
    },
    considerations: [
      { title: "Accuracy is never 100%", body: "AI makes mistakes, sometimes confidently. Processes are designed so that errors are caught before they matter." },
      { title: "Ongoing usage costs", body: "AI services are usually charged by use. Expected running costs are estimated during scoping and monitored after launch." },
      { title: "Good inputs matter", body: "An assistant is only as good as the information it can draw on. Outdated or contradictory documents need addressing first." },
      { title: "Regulation and sensitive data", body: "Personal, financial or regulated data needs extra care, and some tasks are better kept away from AI altogether." },
    ],
    related: [
      { slug: "automation", why: "Put AI results to work: route, notify and update systems automatically." },
      { slug: "integrations", why: "Give AI access to the right data in the systems you already use." },
      { slug: "custom-software", why: "Build the interface and review screens around an AI capability." },
    ],
    cta: { title: "Wondering where AI would genuinely help?", body: "Describe the task you have in mind and we'll give you an honest view of whether AI suits it." },
  },
  {
    slug: "automation",
    href: "/solutions/automation",
    tier: "core",
    name: "Business Process Automation",
    short: "Automation",
    meta: {
      title: "Business Process Automation",
      description:
        "Automation for repetitive work, approvals, notifications, scheduled tasks and cross-platform workflows, with clear handling of exceptions.",
    },
    summary: "Workflows that handle repetitive steps, approvals and follow-ups automatically, and flag the exceptions.",
    hero: {
      headline: "Let the routine work run itself",
      intro:
        "Much of the work that fills a week is predictable: copying data, chasing approvals, sending the same updates, checking the same things. We automate those steps reliably, and make sure the exceptions still reach a person.",
    },
    involves: {
      title: "What automation involves",
      paragraphs: [
        "Automation takes a task that follows clear steps and has a system carry them out: when something happens, check these conditions, then do these things. It can run inside one application or across several.",
        "The important design work is in the edges. What happens when information is missing, an approval is overdue or a system is unavailable? Good automation handles the normal case quietly and raises the unusual ones clearly.",
      ],
    },
    problems: [
      "We copy the same details from one system into another every day.",
      "Approvals stall because nobody knows they are waiting.",
      "Customers and colleagues need status updates that someone has to remember to send.",
      "Month-end reports are assembled manually from several sources.",
      "Things slip through the cracks when the person who usually handles them is away.",
    ],
    builds: [
      { title: "Workflow automation", body: "Multi-step processes that move work from one stage to the next, with the right people and systems involved." },
      { title: "Approvals & reminders", body: "Requests routed to the right approver, with reminders and escalation when they are not dealt with in time." },
      { title: "Notifications & updates", body: "Customers, staff and suppliers told what they need to know, when they need to know it, through the right channel." },
      { title: "Scheduled tasks", body: "Regular jobs such as reports, reconciliations, data checks and clean-ups, run on time without anyone starting them." },
      { title: "Exception handling", body: "Clear queues and alerts for the cases automation cannot resolve, with the context needed to deal with them." },
      { title: "Cross-platform automation", body: "Workflows that span your email, CRM, accounting, spreadsheets and operational systems." },
    ],
    examples: [
      {
        title: "Purchase approval routing",
        situation: "Purchase requests are emailed to managers and often wait days for a decision.",
        approach:
          "Requests are submitted through a form, routed by value and department, reminded after a set time, escalated if still pending, and recorded with a full approval history.",
      },
      {
        title: "Order-to-invoice handover",
        situation: "When an order is completed, someone re-enters the details into the accounting system to raise an invoice.",
        approach: "Completed orders create draft invoices automatically, with mismatches or missing data held back for review instead of being sent.",
      },
      {
        title: "Weekly operations report",
        situation: "A manager spends every Monday morning compiling figures from three systems into a spreadsheet.",
        approach: "The figures are gathered on a schedule, checked for obvious gaps, and the report is delivered before the working week starts.",
      },
    ],
    feature: {
      kind: "comparison",
      title: "Rule-based automation and AI decision support",
      intro: "They solve different problems, and many workflows use both. Knowing which is which keeps automation reliable.",
      columns: ["Rule-based automation", "AI decision support"],
      rows: [
        { label: "Works by", a: "Following explicit rules: if this, then that", b: "Interpreting content such as text and documents" },
        { label: "Best for", a: "Predictable, structured steps", b: "Unstructured inputs and judgement-like tasks" },
        { label: "Behaviour", a: "Same input, same result, every time", b: "Usually right, occasionally wrong" },
        { label: "Oversight", a: "Monitor for failures and exceptions", b: "Review or approval where the stakes are high" },
        { label: "Example", a: "Remind the approver after two days", b: "Read the request and suggest who should approve it" },
      ],
    },
    engagement: {
      steps: [
        { title: "Map the process", body: "Document how the work happens now, including the exceptions people handle without thinking about them." },
        { title: "Choose the approach", body: "Decide what to automate, what to leave with people, and which tools or platforms to use." },
        { title: "Build and test", body: "Implement the workflow and test it against real scenarios, including failures and missing data." },
        { title: "Run and monitor", body: "Launch with logging and alerts, so you can see what ran, what failed and what needs attention." },
      ],
      note: "Automation projects are often relatively contained. A single valuable workflow is a sensible place to start.",
    },
    considerations: [
      { title: "Messy processes automate badly", body: "If a process is inconsistent, automating it can multiply the confusion. Sometimes the first step is simplifying it." },
      { title: "Dependent on other systems", body: "Automations rely on the applications they connect. Changes to those systems can require updates." },
      { title: "Platform and licence costs", body: "Some automation platforms charge per run or per user. These costs are estimated during scoping." },
    ],
    related: [
      { slug: "integrations", why: "Most automations depend on systems that can exchange data." },
      { slug: "ai", why: "Handle the steps that need reading or interpretation, not just rules." },
      { slug: "custom-software", why: "Give a complex process a proper home before automating around it." },
    ],
    cta: { title: "Got a task your team repeats every day?", body: "Describe it, including the awkward exceptions, and we'll suggest how much of it could run itself." },
  },
  {
    slug: "integrations",
    href: "/solutions/integrations",
    tier: "core",
    name: "Systems Integration",
    short: "Integrations",
    meta: {
      title: "Systems Integration",
      description:
        "Connecting the software you already use: APIs, data synchronisation, CRM and accounting integrations and third-party systems, so information flows instead of being re-typed.",
    },
    summary: "Connecting your CRM, finance, e-commerce and operational systems, so information stops being re-typed.",
    hero: {
      headline: "Make your systems work as one",
      intro:
        "Most businesses run on several good tools that don't talk to each other. We connect them, so customer, order, financial and operational information moves where it is needed, accurately and without someone re-typing it.",
    },
    involves: {
      title: "What integration involves",
      paragraphs: [
        "An integration links two or more systems so they can exchange data or trigger actions in each other. Most modern software provides an API (a structured way for other software to read and update it), and integrations are built on these.",
        "The work includes agreeing which system is the source of truth for each piece of information, how records are matched between systems, how often data moves, and what happens when something fails or conflicts.",
      ],
    },
    problems: [
      "The same customer exists in three systems with slightly different details.",
      "Orders from our online shop are re-entered into our stock or accounting system by hand.",
      "Sales can't see invoices, and finance can't see what sales has agreed.",
      "Reports disagree because each system has its own version of the numbers.",
      "We avoid changing software because everything is held together with manual steps.",
    ],
    builds: [
      { title: "API integrations", body: "Direct connections between systems using their APIs, built to handle authentication, limits and errors properly." },
      { title: "Data synchronisation", body: "Keeping records such as customers, products, stock and orders consistent across systems, on a schedule or in real time." },
      { title: "CRM & accounting integrations", body: "Joining up sales, customer and financial systems so each team sees the information it needs." },
      { title: "E-commerce connections", body: "Linking online shops to stock, fulfilment, accounting and customer systems." },
      { title: "Custom connectors", body: "Bridges for systems without a ready-made connection, including file-based exchanges with older software." },
      { title: "Integration monitoring", body: "Logs, alerts and retry handling, so you know when data didn't arrive and why." },
    ],
    examples: [
      {
        title: "Shop, stock and accounts in step",
        situation: "An online retailer updates stock levels manually and re-keys daily sales into the accounting system.",
        approach:
          "Orders flow from the shop to the stock system and accounting automatically, stock levels update back to the shop, and failed transfers are flagged with the reason.",
      },
      {
        title: "One customer record",
        situation: "Sales, support and finance each keep their own customer list, which drift apart.",
        approach:
          "A defined source of truth for customer details, with synchronisation to the other systems and a matching process for existing duplicates.",
      },
      {
        title: "Legacy system bridge",
        situation: "A long-standing industry system has no modern API but holds critical data.",
        approach: "A scheduled export and import process with validation, so its data reaches newer tools without replacing it.",
      },
    ],
    feature: {
      kind: "checklist",
      title: "What determines whether an integration is feasible",
      intro: "Feasibility depends on the systems involved and the access available. These are checked early, before anything is promised.",
      items: [
        { title: "API availability", body: "Whether each system offers an API, and what it allows other software to read and change." },
        { title: "Access and permissions", body: "Accounts, credentials and plan levels needed. Some vendors restrict API access to higher tiers." },
        { title: "Data quality", body: "Duplicates, inconsistent formats and missing fields that need cleaning before data can flow reliably." },
        { title: "Limits and timing", body: "Rate limits, batch sizes and how quickly changes need to appear on the other side." },
        { title: "Vendor terms", body: "Conditions set by software providers on how their systems may be connected and used." },
      ],
    },
    engagement: {
      steps: [
        { title: "Assess the systems", body: "Review APIs, access, data and limits for each system involved, and confirm what is possible." },
        { title: "Design the data flow", body: "Agree sources of truth, field mappings, matching rules, frequency and error handling." },
        { title: "Build and test", body: "Implement against test or sandbox accounts where available, including failure scenarios." },
        { title: "Go live and monitor", body: "Launch with logging and alerts, and keep connections working as vendors change their systems." },
      ],
      note: "A short technical assessment at the start avoids promising integrations that the systems cannot support.",
    },
    considerations: [
      { title: "Third-party changes", body: "Vendors update their APIs and sometimes retire features. Integrations need occasional maintenance as a result." },
      { title: "Sometimes the answer is fewer systems", body: "If two tools overlap heavily, consolidating them can be better than connecting them. We will say so." },
      { title: "Data protection", body: "Moving personal data between systems needs to respect where it is stored and who can access it." },
    ],
    related: [
      { slug: "automation", why: "Once systems are connected, workflows can run across them." },
      { slug: "custom-software", why: "When no existing tool fits, a central system can tie the others together." },
      { slug: "websites", why: "Connect your website and online shop to the systems behind them." },
    ],
    cta: { title: "Tired of systems that don't talk to each other?", body: "Tell us which tools you use and where information gets stuck between them." },
  },

  // --- Supporting ----------------------------------------------------------------
  {
    slug: "websites",
    href: "/solutions/websites",
    tier: "supporting",
    name: "Websites & Digital Experiences",
    short: "Websites",
    meta: {
      title: "Websites & Digital Experiences",
      description:
        "High-quality websites, web applications, booking journeys, portals and e-commerce, engineered for performance, usability, accessibility and conversion.",
    },
    summary: "Fast, accessible websites, e-commerce and web applications, built to the same engineering standard.",
    hero: {
      headline: "Websites engineered as carefully as the systems behind them",
      intro:
        "Your website is often the first system a customer uses. We design and build websites, booking journeys, e-commerce and web applications that are fast, accessible and clear, and that connect properly to the rest of your business.",
    },
    involves: {
      title: "What a website project involves",
      paragraphs: [
        "A good website starts with the people using it: what they need to find out, what they need to do, and what would stop them. Structure, content and design are planned around those journeys before anything is built.",
        "The build then matters as much as the look. Fast loading, accessibility, search-friendly structure, security and a content setup your team can actually manage are all engineering decisions, not finishing touches.",
      ],
    },
    problems: [
      "Our website looks dated and doesn't reflect the quality of what we do.",
      "Visitors arrive but rarely enquire or book.",
      "Updating the site needs a developer for every small change.",
      "The site is slow, especially on mobile.",
      "Bookings or orders from the website still need re-typing into our systems.",
    ],
    builds: [
      { title: "Company & marketing websites", body: "Clear, credible sites that explain what you do and make it easy to get in touch." },
      { title: "Booking & enquiry journeys", body: "Step-by-step flows for bookings, quotes and applications that collect the right information first time." },
      { title: "E-commerce", body: "Online shops built around your products, fulfilment and payment needs, connected to stock and accounting." },
      { title: "Web applications & portals", body: "Logged-in areas and interactive tools that go beyond a brochure site." },
      { title: "Content management", body: "Editing set up so your team can update pages and content confidently without breaking the design." },
      { title: "Performance & accessibility", body: "Improving the speed, accessibility and technical quality of an existing site." },
    ],
    examples: [
      {
        title: "A service business booking journey",
        situation: "A clinic takes bookings by phone and email, leading to back-and-forth over availability.",
        approach: "An online booking flow showing real availability, collecting the right details upfront, sending confirmations and adding bookings to the calendar system.",
      },
      {
        title: "A trade e-commerce site",
        situation: "A wholesaler takes trade orders by email from a PDF price list.",
        approach: "A trade ordering site with account-specific pricing, order history and orders passed directly to the stock and accounting systems.",
      },
      {
        title: "A company website rebuild",
        situation: "A growing firm's website no longer describes its services accurately and is hard to update.",
        approach: "A restructured site with clear service pages, an editable content system and enquiry forms that reach the right person.",
      },
    ],
    feature: {
      kind: "checklist",
      title: "What we build into every website",
      intro: "These are standard engineering practice in our work, not optional extras.",
      items: [
        { title: "Performance", body: "Fast loading on real mobile connections, with images and code optimised and measured." },
        { title: "Accessibility", body: "Built to WCAG guidance: keyboard use, screen-reader structure, contrast and readable text." },
        { title: "Search-friendly structure", body: "Clean URLs, semantic headings, metadata and technical foundations that search engines can read." },
        { title: "Security & privacy", body: "Up-to-date frameworks, secure forms and cookie and consent handling appropriate to what the site does." },
        { title: "Manageable content", body: "A sensible content setup and handover, so the site stays accurate after launch." },
      ],
    },
    engagement: {
      steps: [
        { title: "Goals & journeys", body: "Agree who the site is for, what they need to do, and what the site needs to achieve for the business." },
        { title: "Structure & design", body: "Plan pages and content, then design layouts and key journeys for review." },
        { title: "Build & content", body: "Develop the site, load content and connect forms, bookings or e-commerce to your systems." },
        { title: "Launch & handover", body: "Test across devices, launch, set up analytics and hand over editing and access." },
      ],
      note: "Content (the words, photos and product information) is usually the part that takes longest. Planning it early keeps the project on track.",
    },
    considerations: [
      { title: "Content takes effort", body: "A website needs accurate, current content. Responsibility for writing and supplying it is agreed during scoping." },
      { title: "Running costs", body: "Hosting, domains, plugins, e-commerce platforms and payment providers carry their own fees." },
      { title: "A website alone doesn't create demand", body: "A better site converts more of the visitors you have. Attracting more visitors is a separate effort." },
    ],
    related: [
      { slug: "digital-growth", why: "Help the right people find the site and measure what they do there." },
      { slug: "integrations", why: "Pass bookings, enquiries and orders straight into your systems." },
      { slug: "custom-software", why: "When a portal or application needs to go further than a website." },
    ],
    cta: { title: "Website no longer doing its job?", body: "Tell us what it needs to achieve and what is getting in the way." },
  },
  {
    slug: "digital-growth",
    href: "/solutions/digital-growth",
    tier: "supporting",
    name: "SEO & Digital Growth",
    short: "Digital Growth",
    meta: {
      title: "SEO & Digital Growth",
      description:
        "Technical SEO, local search, content architecture, analytics and conversion improvements that help the right people find your business and act, with honest measurement.",
    },
    summary: "Technical SEO, local search, analytics and conversion improvements, measured honestly.",
    hero: {
      headline: "Be found by the right people, and understand what they do next",
      intro:
        "Visibility comes from solid technical foundations, useful content and clear measurement. We improve how search engines understand your site, how local customers find you and how visitors move towards getting in touch, and we report on it plainly.",
    },
    involves: {
      title: "What digital growth work involves",
      paragraphs: [
        "Search visibility depends on three things: whether search engines can crawl and understand your site, whether your content genuinely answers what people are searching for, and how your business is represented in local and external listings.",
        "Growth also depends on what happens after someone arrives. Measuring visits, enquiries and the steps between them shows where people drop away, and that evidence guides what to improve next.",
      ],
    },
    problems: [
      "We don't appear when people search for what we do in our area.",
      "We have no clear idea which marketing actually produces enquiries.",
      "Our site has pages, but they don't seem to match what customers search for.",
      "Traffic arrives, but very few visitors take the next step.",
      "We've paid for SEO before and never understood what was done.",
    ],
    builds: [
      { title: "Technical SEO", body: "Fixing crawlability, indexing, site structure, speed, structured data and the other technical factors search engines rely on." },
      { title: "Local search", body: "Business profiles, location pages and consistent business information for customers searching nearby." },
      { title: "Content architecture", body: "Planning pages and topics around what your customers actually search for and need to know." },
      { title: "Analytics & tracking", body: "Measurement set up correctly, with enquiries and key actions tracked and privacy respected." },
      { title: "Conversion improvements", body: "Clearer pages, forms and calls to action, guided by how visitors really behave." },
      { title: "Reporting", body: "Plain-English reports on what changed, what the numbers show and what we recommend next." },
    ],
    examples: [
      {
        title: "Local visibility for a service business",
        situation: "A multi-location service company rarely appears in local search results for its own towns.",
        approach: "Corrected business profiles, consistent listings, well-structured location pages and tracking of calls and enquiries by location.",
      },
      {
        title: "Fixing technical foundations",
        situation: "A site rebuild left many old pages broken and search traffic fell.",
        approach: "An audit of crawling and indexing, redirects from old to new addresses, and monitoring as search engines re-process the site.",
      },
      {
        title: "Measuring what produces enquiries",
        situation: "A business spends on several channels with no reliable view of which ones lead to enquiries.",
        approach: "Analytics and enquiry tracking set up consistently, so each channel's contribution can be seen and compared.",
      },
    ],
    feature: {
      kind: "principles",
      title: "What we will and won't promise",
      intro: "Search engines and markets are outside anyone's control. Honest growth work is clear about that.",
      items: [
        { title: "No guaranteed rankings", body: "Nobody controls search engine results. We improve the factors that influence them and report what changes." },
        { title: "No promised enquiry volumes", body: "Results depend on demand, competition and your offer, as well as your website. We set expectations with evidence, not targets plucked from the air." },
        { title: "Transparent work", body: "You will know what was changed, why, and what effect it had. No mystery packages." },
        { title: "Measurement first", body: "Without reliable measurement it is impossible to tell what worked. Tracking comes before optimisation." },
      ],
    },
    engagement: {
      steps: [
        { title: "Audit & baseline", body: "Review technical health, content, local presence and current measurement, and record a starting point." },
        { title: "Fix foundations", body: "Resolve technical issues and set up measurement properly before anything else." },
        { title: "Improve content & journeys", body: "Strengthen key pages, local presence and conversion paths, based on the audit." },
        { title: "Measure & iterate", body: "Review results regularly, report plainly and adjust priorities." },
      ],
      note: "Search improvements take time to show. A typical arrangement is an initial project followed by regular, measured improvement.",
    },
    considerations: [
      { title: "It takes time", body: "Search engines re-evaluate sites gradually. Meaningful changes in visibility usually take months, not days." },
      { title: "Competition varies", body: "How hard it is to be visible depends on your market, location and the competitors around you." },
      { title: "Privacy and consent", body: "Analytics must respect cookie and consent rules, which can limit what is measured." },
    ],
    related: [
      { slug: "websites", why: "Technical and content changes are often easiest with a well-built site." },
      { slug: "automation", why: "Route and follow up the enquiries that growth work brings in." },
      { slug: "integrations", why: "Connect enquiry data to your CRM to see which leads become customers." },
    ],
    cta: { title: "Want to be easier to find?", body: "Tell us what you offer, where your customers are and what you have tried so far." },
  },
];

export const CORE_SERVICES = SERVICES.filter((s) => s.tier === "core");
export const SUPPORTING_SERVICES = SERVICES.filter((s) => s.tier === "supporting");
export const getService = (slug: ServiceSlug) => SERVICES.find((s) => s.slug === slug)!;

/** The /solutions hub. */
export const HUB = {
  meta: {
    title: "Solutions",
    description:
      "Bespoke software, AI, automation and systems integration, plus websites and digital growth. An overview of what Solvitech designs and engineers, and how to find the right starting point.",
  },
  eyebrow: "Solutions",
  headline: "Engineering for the way your business works",
  intro:
    "Solvitech designs and builds software, AI and automation for businesses whose tools no longer fit how they operate, and connects them to the systems you already rely on. Websites and digital growth complete the picture.",
  coreLabel: "Core expertise",
  coreIntro: "Most projects start here: systems, intelligence, automation and the connections between them.",
  supportingLabel: "Also from the same team",
  supportingIntro: "Customer-facing websites and growth work, built to the same engineering standard.",
  finder: {
    title: "Not sure where to start?",
    intro: "Start from the problem. Pick the statement closest to yours.",
    items: [
      { problem: "We re-type the same information into several systems.", slug: "integrations" },
      { problem: "Our team repeats the same steps, reminders and checks every day.", slug: "automation" },
      { problem: "We're running the business on spreadsheets and workarounds.", slug: "custom-software" },
      { problem: "People spend hours reading documents or searching for answers.", slug: "ai" },
      { problem: "Our website doesn't reflect us or produce enquiries.", slug: "websites" },
      { problem: "Customers can't find us when they search.", slug: "digital-growth" },
    ] as { problem: string; slug: ServiceSlug }[],
  },
  together: {
    title: "One team, joined-up solutions",
    body: "Real problems rarely fit neatly into one service. An automation needs systems that can exchange data; an AI assistant needs a place in your software; a website needs to pass enquiries somewhere useful. Because the same team designs all of it, the pieces are built to fit together from the start.",
    /** Illustrative: one enquiry passing through several capabilities. */
    chain: [
      { slug: "websites", step: "A customer requests a quote on the website" },
      { slug: "ai", step: "The request is read and its details extracted" },
      { slug: "integrations", step: "The customer is matched in the CRM" },
      { slug: "custom-software", step: "A job is created in the operations system" },
      { slug: "automation", step: "Follow-ups and reminders run on schedule" },
    ] as { slug: ServiceSlug; step: string }[],
  },
};
