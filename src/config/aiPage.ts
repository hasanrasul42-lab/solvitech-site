/**
 * /solutions/ai — AI Consulting & Implementation page copy (supplied by the
 * founder, November 2026). British English. Sample content in the visuals is
 * fictional and illustrative.
 */

export const AI_PAGE = {
  label: "AI Consulting & Implementation",
  meta: {
    title: "AI Consulting & Implementation for Businesses | Solvitech",
    description:
      "AI consulting and implementation for businesses: find where AI could make a difference, from after-hours call answering and bookings to enquiries and paperwork, then design and implement a solution that works with how you operate.",
  },
};

const SURVEY_URL = "https://www.gov.uk/government/publications/ai-adoption-survey-2026/ai-adoption-survey-report-2026-executive-summary";

// --- 00 Introduction --------------------------------------------------------------------

export const AI_HERO = {
  eyebrow: "AI Consulting & Implementation",
  title: "AI adoption has doubled. What could it do for your business?",
  stat: {
    from: { year: "2025", value: "16%" },
    to: { year: "2026", value: "32%" },
    caption: "UK businesses using at least one AI technology, according to the UK Government AI Adoption Survey 2026.",
    href: SURVEY_URL,
  },
  paragraphs: [
    "AI is showing up in more businesses. Using it so it actually helps is the part that still needs work.",
    "ChatGPT and Claude made artificial intelligence familiar. AI can also handle customer enquiries, assist with bookings, process documents and take on the everyday tasks that keep a business moving.",
  ],
  close: "Solvitech helps you find where it could make a difference, then designs and implements the solution so it works with the way you already operate.",
  primary: { label: "Explore AI Opportunities", href: "#ai-applications" },
  secondary: { label: "Request a Call", href: "/contact" },
  cards: [
    {
      title: "Beyond the chat window",
      body: "AI does not have to be another tool the team opens. With the right implementation it can become part of how the business answers customers, manages information and gets work done.",
    },
    {
      title: "From curiosity to practical use",
      body: "You do not need an AI strategy or a technical specification to begin. We help identify worthwhile opportunities, evaluate the options and turn suitable ideas into working solutions.",
    },
  ],
  visualLabel:
    "Illustration: an AI assistant at the centre of ordinary business work, with an after-hours call, a booking request and an enquiry around it, each handled and ready for the team.",
};

// --- 01 AI Consulting & Discovery --------------------------------------------------------------

export const AI_DISCOVERY = {
  eyebrow: "AI consulting & discovery",
  title: "Not sure where AI fits? We start there",
  body: [
    "You do not need a finished idea or an understanding of the technology.",
    "We begin by learning how the business operates. How customers get in touch. Which tasks take the most time. Where information gets lost, work piles up or opportunities are missed.",
    "From that picture we can see where AI could make a practical difference, what existing tools can already do and where a tailored solution would be worthwhile.",
  ],
  steps: [
    { title: "Understand your business", body: "Look at operations, customer interactions, existing systems and the everyday challenges that affect the team." },
    { title: "Identify opportunities", body: "Find where AI could reduce manual work, improve customer communication, support staff or make information easier to use." },
    {
      title: "Plan the right solution",
      body: "Evaluate what is practical, what it involves and which approach fits the business, whether that is an existing tool or a bespoke application.",
    },
  ],
  close: "The aim is to use AI only where it can make a meaningful difference.",
  visualLabel:
    "Illustration: three cards stepping towards the viewer: understanding how the business runs, an opportunity circled on a process map, and a plan choosing between an existing tool and a tailored build.",
};

// --- 02 Practical AI Applications ----------------------------------------------------------------

export const AI_APPS = {
  anchor: "ai-applications",
  eyebrow: "Practical AI applications",
  title: "AI can take everyday pressure off the team",
  lead: "From answering a call after closing time to organising booking information, it can support the routine work that otherwise pulls attention away from customers.",
  items: [
    {
      headline: "Never miss an out-of-hours enquiry",
      label: "AI telephone answering",
      body: "An AI voice assistant answers calls when the team is unavailable, handles routine questions and collects the customer details. The enquiry is captured instead of lost.",
    },
    {
      headline: "Turn enquiries into organised bookings",
      label: "AI booking assistance",
      body: "A customer calls or messages to book. The assistant interprets the request, collects the details and, when connected to a suitable booking system, checks availability and helps schedule the appointment. The information reaches the right place without manual re-entry.",
    },
    {
      headline: "Respond to customer enquiries more efficiently",
      label: "Intelligent enquiry handling",
      body: "AI reads incoming emails, website messages and forms, works out what is needed and helps prepare the response. Straightforward enquiries follow the agreed process. More complicated requests go to the right person.",
    },
    {
      headline: "Reduce repetitive paperwork",
      label: "Document and information processing",
      body: "Invoices, forms and customer documents often contain details that someone must read and type into a system. AI can extract and organise the relevant information so it is ready for checking.",
    },
    {
      headline: "Help employees find the answers they need",
      label: "Internal knowledge assistants",
      body: "An intelligent assistant lets staff ask questions and receive answers drawn from approved documents, procedures and internal knowledge. Less time is spent searching folders or asking the same question twice.",
    },
    {
      headline: "Spot operational issues sooner",
      label: "Business intelligence and decision support",
      body: "AI can review operational information, customer feedback and business records to highlight patterns, recurring problems and areas worth a closer look. Managers get a clearer view of what deserves attention.",
    },
  ],
  close: "Every business is different. The right solution depends on the challenges, the existing systems and where the technology can provide genuine value.",
  visualLabel:
    "Illustration: four tiles for calls, bookings, enquiries and documents, with the documents tile producing invoice details extracted and ready to check.",
};

// --- 03 From Idea to Implementation -------------------------------------------------------------

export const AI_APPROACH = {
  eyebrow: "From idea to implementation",
  title: "Finding the opportunity is only the start",
  lead: [
    "Making it work reliably inside the business is the next step.",
    "The solution needs to fit current operations, work with the systems already in use and make everyday tasks easier rather than adding complexity.",
    "Solvitech helps you move from the initial idea to a practical implementation.",
  ],
  stages: [
    { title: "Discover", body: "Understand the business challenge, identify where AI could help and define what a useful outcome looks like." },
    { title: "Evaluate & Plan", body: "Explore suitable technologies, assess feasibility, consider costs and requirements, and agree a practical way forward." },
    { title: "Build & Integrate", body: "Configure existing AI tools or develop tailored applications and connect them to the relevant systems and workflows." },
    { title: "Launch & Improve", body: "Test the solution, introduce it into everyday operations and refine it based on feedback and actual use." },
  ],
  note: {
    title: "The right solution does not have to be the most complicated one.",
    body: "Not every business needs a bespoke AI application. Sometimes an existing tool, configured correctly and connected to the right systems, is the better choice.",
    close: "We focus on finding an appropriate solution and implementing it properly.",
  },
  cta: { label: "Learn About Our Approach", href: "/approach" },
  visualLabel: "Illustration: four stage bars stepping forward: Discover, Evaluate & Plan, Build & Integrate, and Launch & Improve, with the last marked as in use.",
};

// --- 04 AI That Works Alongside Your Team ----------------------------------------------------------

export const AI_ALONGSIDE = {
  eyebrow: "AI that works alongside your team",
  title: "More support for the team. Less time on routine work",
  intro: [
    "AI does not have to replace existing systems or change the personal service customers value.",
    "Often the most useful place to begin is with one everyday task that takes too much time.",
  ],
  story: [
    {
      label: "After Hours",
      title: "The enquiry does not have to wait.",
      body: "A customer calls to arrange an appointment after the team has finished. An AI assistant can answer, explain the available services and collect the details needed. The customer receives an immediate response instead of an unanswered phone.",
    },
    {
      label: "The Booking",
      title: "Information reaches the right place.",
      body: "If the request is straightforward and the assistant is connected to an appropriate booking system, it can check availability and help arrange the appointment within the agreed rules. Details are recorded without manual transfer. Requests that need clarification or personal judgement are passed to a team member.",
    },
    {
      label: "The Handover",
      title: "The team starts with the information it needs.",
      body: "When staff return, the customer’s details, enquiry and any booking status are ready for review. Employees can focus on the situations that need their attention instead of catching up on missed calls and incomplete messages.",
    },
  ],
  control: {
    title: "The technology supports the process. The team stays in control.",
    body: "AI handles suitable routine interactions while the business decides what information it can access, which actions it may take and when a person should step in.",
  },
  close: "Start with one useful improvement. Expand when it proves worthwhile.",
  disclaimer: "Illustrative example. Actual capabilities depend on the chosen AI solution, telephone service, booking system and agreed business rules.",
  visualLabel:
    "Illustration: an evening call answered by an AI assistant that collects the details and checks availability, and the next morning the team finds the enquiry ready, with an unusual request flagged for a person.",
};

// --- 05 Start a Conversation -------------------------------------------------------------------

export const AI_CLOSE = {
  eyebrow: "Explore AI opportunities",
  title: "What could AI take off your team’s plate?",
  body: [
    "You do not need an AI strategy, a technical team or a finished project idea to begin.",
    "Perhaps the business misses calls after hours. Maybe reception is constantly busy, booking details take too long to organise or employees spend too much time on the same enquiries.",
    "Or you simply want a clear view of what is realistic.",
    "Tell us how the business works and where you would like it to improve. We can explore the opportunities, discuss what is practical and identify a sensible next step.",
  ],
  primary: { label: "Request a Call", href: "/contact" },
  secondary: { label: "Discuss Your Business", href: "/contact" },
  signoff: "You bring the business challenge. We help explore the technology.",
  related: [
    { label: "Business Automation", href: "/solutions/automation" },
    { label: "Custom Software & Business Systems", href: "/solutions/custom-software" },
    { label: "Systems Integration", href: "/solutions/integrations" },
  ],
  attribution: {
    text: "Research attribution: UK Government, AI Adoption Survey 2026, published 29 October 2026. The survey found AI adoption among UK businesses increased from 16% in the 2025 survey to 32% in the 2026 survey.",
    label: "Source",
    href: SURVEY_URL,
  },
  visualLabel: "Illustration: a phone conversation about missed after-hours calls, beside a card for a first conversation: your challenge, whether AI fits and a practical next step.",
};
