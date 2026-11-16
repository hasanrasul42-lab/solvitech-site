/**
 * /solutions/automation — Business Automation page copy (Business Automation
 * 3D Service Page Plan V1.0, without the interactive demo section, matching
 * the AI page). British English. No invented metrics, outcomes or claims:
 * sample content in the visuals is fictional and illustrative.
 */

export const AUTO_PAGE = {
  label: "Business Automation",
  meta: {
    title: "Business Process Automation Services for Businesses | Solvitech",
    description:
      "Reduce repetitive admin and improve everyday workflows with business process automation. Explore practical automation, careful implementation and workflow design from Solvitech.",
  },
};

// --- 01 Hero ------------------------------------------------------------------------------

export const AUTO_HERO = {
  eyebrow: "Business process automation",
  title: "Less chasing. More work moving",
  lead: "From incoming enquiries and routine admin to task hand-offs and updates, repetitive work can slow a business down. Solvitech helps you understand the process, remove unnecessary steps and automate the parts that make sense.",
  support: "Keep people focused on the work that needs them, while routine tasks follow a clearer path.",
  primary: { label: "Discuss an Automation Challenge", href: "/contact" },
  secondary: { label: "See What Automation Changes", href: "#how-it-works" },
  visualLabel:
    "Illustration: a site visit request has arrived in the inbox and sits in an Unassigned tray marked “Waiting for assignment”, beside a diary with an unallocated slot.",
};

// --- 02 Pain --------------------------------------------------------------------------------

export const AUTO_PAIN = {
  eyebrow: "The work that builds up",
  title: "The task is rarely the whole task",
  body: "An enquiry becomes a spreadsheet entry. A job needs assigning. Somebody checks the diary, sends an update, then follows up because nobody knows what happened. Small manual steps accumulate, and important work ends up waiting in the gaps.",
  items: [
    { title: "Re-entering information", body: "The same details are copied between messages, records and other tools." },
    { title: "Waiting for hand-offs", body: "Work stalls because the next person or action is unclear." },
    { title: "Chasing updates", body: "Staff spend time checking progress instead of progressing the work." },
    { title: "Handling exceptions", body: "Missing details and unusual requests need to reach the right person." },
  ],
  visualLabel:
    "Illustration: one customer enquiry stacked with the admin it creates: an intake form, a task ticket, a calendar page and a follow-up reminder.",
};

// --- 03 What automation changes ----------------------------------------------------------------

export const AUTO_HOW = {
  anchor: "how-it-works",
  eyebrow: "What automation changes",
  title: "Make routine steps happen when they should",
  body: "A well-designed workflow can recognise an event, check the information, take the appropriate routine action and notify the right person. If something is missing or unusual, it can pause for review rather than guessing.",
  stages: [
    { title: "A trigger", body: "A request arrives or a status changes." },
    { title: "A check", body: "The workflow verifies the required details or conditions." },
    { title: "An action", body: "A task, record or update is created in the appropriate place." },
    { title: "A safeguard", body: "Unclear or exceptional cases are held for review." },
  ],
  cta: { label: "Discuss a Workflow Like This", href: "/contact" },
  visualLabel:
    "Illustration: incoming requests pass a check and are routed into three lanes: Ready to process, Needs information and Needs review.",
};

// --- 04 Applications -------------------------------------------------------------------------

export const AUTO_APPS = {
  eyebrow: "Practical possibilities",
  title: "Start with the repetitive work your team already knows",
  lead: "The right automation depends on the tools, rules and people involved. These are examples of the kinds of processes worth exploring, not claims of universal compatibility or guaranteed savings.",
  items: [
    { title: "Enquiries and follow-ups", body: "Capture incoming requests, prepare records, assign the right queue and keep follow-up tasks visible." },
    { title: "Scheduling and coordination", body: "Coordinate availability, assignments and reminders where the system and business rules allow it." },
    { title: "Records and updates", body: "Reduce duplicate entry and keep routine information changes consistent across approved tools." },
    { title: "Approvals and internal hand-offs", body: "Route decisions to the right people, track their status and continue the workflow after an authorised response." },
  ],
  related: [
    { lead: "AI may help with information-heavy steps.", label: "AI Consulting & Implementation", href: "/solutions/ai" },
    { lead: "Systems may need to exchange data.", label: "Systems Integration", href: "/solutions/integrations" },
    { lead: "Existing tools may not fit.", label: "Custom Software", href: "/solutions/custom-software" },
  ],
  visualLabel:
    "Illustration: four different work objects: an enquiry slip gaining an owner, a diary slot with a proposed allocation, a customer record field updated to match, and a purchase approval waiting at a review control.",
};

// --- 05 Approach -----------------------------------------------------------------------------

export const AUTO_APPROACH = {
  eyebrow: "Our approach",
  title: "Start with the process. Engineer the right change",
  lead: "We examine how the work happens today, decide which steps are suitable for automation, build and test the workflow, then introduce it in a controlled way. The scope, responsibilities and any ongoing support are agreed for the engagement.",
  stages: [
    { title: "Discover", body: "Map the current process, who does what, which tools are involved and where it slows down." },
    { title: "Design", body: "Specify triggers, conditions, actions, exceptions, access and the desired outcome." },
    { title: "Engineer", body: "Implement the workflow, connect suitable systems and test routine and exceptional cases." },
    { title: "Launch & Evolve", body: "Introduce the workflow, review its behaviour and agree any refinement or support needs." },
  ],
  cta: { label: "See Our Approach", href: "/approach" },
  visualLabel:
    "Illustration: a planning board with three columns, the current process with an unclear hand-off circled, proposed rules, and test cases for normal and exceptional requests.",
};

// --- 06 Trust --------------------------------------------------------------------------------

export const AUTO_TRUST = {
  eyebrow: "Automation with oversight",
  title: "Reliable workflows need to know when to stop",
  body: "Good automation accounts for incomplete information, failed actions and steps that require judgement. We consider validation, access, failure handling and human checkpoints so the process remains understandable and can be reviewed.",
  principles: [
    { title: "Clear conditions", body: "Know what starts a workflow and what information it requires." },
    { title: "Visible exceptions", body: "Make missing details, unusual cases and failed actions easy to spot." },
    { title: "Human control", body: "Keep appropriate review and authorisation where a person should decide." },
    { title: "Operational visibility", body: "Make statuses and actions understandable so teams can see what happened and what needs attention." },
  ],
  faq: [
    {
      q: "Do we need to replace our current software?",
      a: "Not necessarily. The starting point is to review what you already use and whether suitable integration or automation options are available.",
    },
    {
      q: "Can every task be automated?",
      a: "No. Some tasks need human judgement, and some are not worthwhile or suitable to automate. We look at the business need before recommending an approach.",
    },
    {
      q: "What if a workflow fails or information is missing?",
      a: "That needs to be part of the design. We consider validation, visible exception states, appropriate recovery and who should be notified or asked to review a case.",
    },
    {
      q: "Can automation include AI?",
      a: "Yes, where it is appropriate. AI can help with information-heavy steps, but many valuable workflows use clear rules and existing software without AI.",
    },
    {
      q: "How much does business automation cost?",
      a: "It depends on the process, the systems involved, the number of decisions and exceptions, and any ongoing requirements. We would agree scope before work begins.",
    },
    {
      q: "What about data protection and access?",
      a: "The design must account for what information is processed, which systems are involved and who should be allowed to access or approve actions. Specific controls depend on the proposed solution.",
    },
  ],
  cta: { lead: "Need systems to exchange data?", label: "Explore Systems Integration", href: "/solutions/integrations" },
  visualLabel:
    "Illustration: a status register beside three tickets with different outcomes: a duplicate held for review, a request held for a missing field, and a valid request that progressed, with a review control for a person to decide.",
};

// --- 07 Close --------------------------------------------------------------------------------

export const AUTO_CLOSE = {
  eyebrow: "Start with a process",
  title: "What’s taking more time than it should?",
  body: "Tell us about the admin your team repeats, the hand-offs that slow work down or the tools that don’t work well together. You don’t need a process diagram or a technical specification to start a conversation.",
  primary: { label: "Discuss Your Process", href: "/contact" },
  secondary: { label: "Explore All Solutions", href: "/solutions" },
  related: [
    { label: "AI Consulting & Implementation", href: "/solutions/ai" },
    { label: "Systems Integration", href: "/solutions/integrations" },
    { label: "Our Approach", href: "/approach" },
  ],
  visualLabel: "Illustration: a note on a desk stand asking “What keeps getting repeated?”, beside an open diary.",
};
