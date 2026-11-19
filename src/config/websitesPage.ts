/**
 * /solutions/websites — Websites & Digital Experiences page copy (supplied by
 * the founder, November 2026). British English. Sample content in the
 * visuals is fictional and illustrative.
 */

export const WEB_PAGE = {
  label: "Websites & Digital Experiences",
  meta: {
    title: "Website Design & Development for Businesses | Solvitech",
    description:
      "Professional websites built around your business: business websites, e-commerce, booking sites, redesigns, content-managed sites and custom web applications, planned around what visitors need and the actions you want them to take.",
  },
};

// --- 00 Introduction --------------------------------------------------------------------

export const WEB_HERO = {
  eyebrow: "Website design & development",
  title: "Professional websites, built around your business.",
  lead: "Whether you are launching a new business, replacing an outdated site or building an online store, the website should make a clear impression and help customers take the next step.",
  paragraphs: [
    "Solvitech designs and develops websites for businesses that need more than a basic online presence. From straightforward company sites to e-commerce stores and bespoke digital experiences, we combine clear design with the functionality the business needs.",
    "We look at how the site looks, how visitors move through it, what information they need and the actions you want them to take. The result is a website planned around those requirements.",
  ],
  primary: { label: "Discuss Your Website", href: "/contact" },
  secondary: { label: "What We Build", href: "#website-services" },
  visualLabel:
    "Illustration: a website's sections lifting out of the browser frame: navigation, a headline, three service cards, an enquiry form and a footer.",
};

// --- 01 Recognising the Need --------------------------------------------------------------

export const WEB_NEED = {
  eyebrow: "Recognising the need",
  title: "Starting from scratch, or ready for something better?",
  body: [
    "Every business needs something different from its website.",
    "You might be creating an online presence for the first time, updating a site that no longer reflects the company, or adding functionality the current site cannot provide.",
    "Whatever the starting point, it helps to be clear about what needs to improve before deciding how the website should look or be built.",
  ],
  items: [
    {
      title: "You are launching a new business",
      body: [
        "A new business needs credibility and a clear way for potential customers to understand what you offer.",
        "A professional website gives you a dedicated place where visitors can learn about the services, find essential information and get in touch.",
        "A solid structure from the start also makes later additions easier.",
      ],
    },
    {
      title: "Your existing website feels outdated",
      body: [
        "The business may have moved on since the website was first built.",
        "Branding may have changed, new services may have been added, or the site no longer matches the standard of the work you do.",
        "A redesign is a chance to improve the presentation, content, navigation and overall experience while keeping what still works.",
      ],
    },
    {
      title: "Customers struggle to find what they need",
      body: [
        "Visitors should be able to understand your services and locate important information without extra effort.",
        "Confusing navigation, unclear descriptions and poorly organised pages make it harder for people to decide whether the business is right for them.",
        "A clearer structure helps them find relevant information and see what to do next.",
      ],
    },
    {
      title: "You need more than a basic website",
      body: [
        "The business might need online bookings, customer enquiries, product sales, payments or a connection to an existing system.",
        "These requirements need to be part of the design and technical structure from the beginning, not added later.",
      ],
    },
    {
      title: "Your business has outgrown its current website",
      body: [
        "A site that worked when the business was smaller may no longer fit.",
        "You may need extra service pages, easier content management, new integrations or a better way to support customers online.",
        "A considered redevelopment can address those needs while leaving room for future changes.",
      ],
    },
  ],
  close: "Whether you need a first website or a more capable replacement, the starting point is understanding what the business needs it to achieve.",
  visualLabel: "Illustration: a dated website with cluttered text and a tiny contact link, a gauge showing slow loading, and the same page breaking on a phone.",
};

// --- 02 Website Design & User Experience ------------------------------------------------------

export const WEB_UX = {
  eyebrow: "Website design & user experience",
  title: "A better experience for visitors. Better opportunities for your business.",
  body: [
    "A successful business website has to work for two audiences: the people visiting it and the business behind it.",
    "Customers want useful information, clear navigation and confidence in their decisions. The business needs to communicate its services, show its value and encourage enquiries, bookings or purchases.",
    "We bring those requirements together through considered design, content structure and user experience.",
  ],
  steps: [
    {
      title: "Attract the right visitors",
      body: "The website should clearly show what the business offers and who it is for. Relevant page content, clear service descriptions and solid search foundations give potential customers a useful starting point.",
    },
    {
      title: "Engage through useful information",
      body: "Visitors should not have to work hard to understand the business. Well-organised pages, clear content, intuitive navigation and carefully chosen visuals help people explore the offering and find the answers they need.",
    },
    {
      title: "Make the next step straightforward",
      body: "A customer who is interested should know how to proceed. That might mean submitting an enquiry, requesting a quotation, arranging an appointment or buying a product. We plan layouts, calls to action and functionality around those actions.",
    },
    {
      title: "Support the relationship beyond the first visit",
      body: "A useful website can keep supporting customers after the first enquiry or purchase. That might include appointment information, order updates, customer accounts, helpful resources or connections to existing systems. What makes sense depends on the business and the project.",
    },
  ],
  close: "Good website design is about making information accessible, journeys understandable and important actions easier to complete.",
  visualLabel: "Illustration: four phone screens fanned like playing cards: arrive, decide, act and follow through.",
};

// --- 03 Website Design & Development Services ----------------------------------------------------

export const WEB_SERVICES = {
  anchor: "website-services",
  eyebrow: "Website design & development services",
  title: "Whatever your business needs online, let’s build it properly.",
  lead: [
    "Different businesses need different websites.",
    "Some need a clear online presence with reliable enquiry options. Others need e-commerce, booking systems or more complex applications.",
    "Our design and development services are shaped around the purpose, functionality and scale of the project.",
  ],
  items: [
    {
      title: "Business Websites",
      tagline: "Professional websites that represent the company clearly.",
      body: [
        "A business website gives customers a place to learn about the company, understand the services and make contact.",
        "We can build sites with dedicated service pages, company information, enquiry forms and other content that fits the business.",
        "Whether you are an independent professional, a local service provider or an established organisation, the design and structure should reflect the offering and the audience.",
      ],
    },
    {
      title: "E-commerce Websites",
      tagline: "Online stores designed around your products and customers.",
      body: [
        "An e-commerce site needs more than attractive product pages. Customers must be able to browse, understand their options and complete purchases through a clear checkout.",
        "Depending on the requirements, the store may include product categories, filtering, product options, payment integrations, delivery information and order management.",
        "We can plan the experience around the products, operational needs and preferred platform.",
      ],
    },
    {
      title: "Booking & Appointment Websites",
      tagline: "Make it easier for customers to arrange your services.",
      body: [
        "Businesses that work through appointments, reservations or scheduled services often benefit from booking functionality.",
        "A booking site can let customers explore available services, submit details, request appointments or select available times where the chosen system supports it.",
        "The right approach depends on how availability, confirmations, cancellations and existing scheduling tools are managed.",
      ],
    },
    {
      title: "Website Redesigns",
      tagline: "Improve an existing website without losing what matters.",
      body: [
        "A redesign is a chance to reassess appearance, content, navigation, performance and functionality.",
        "We can review the current site, identify what needs improvement and develop a more suitable experience around today’s business needs.",
        "Where search visibility and existing URLs matter, the work also includes content preservation, redirects and migration planning.",
      ],
    },
    {
      title: "Custom Web Applications",
      tagline: "Functionality beyond a conventional business website.",
      body: [
        "Some projects need more than standard pages and contact forms.",
        "Custom web applications can include client portals, interactive tools, specialist forms, user accounts, business workflows and interfaces connected to other systems.",
        "These projects are planned around specific functional requirements and may involve bespoke software development.",
      ],
    },
    {
      title: "Content-Managed Websites",
      tagline: "Keep website information manageable as the business changes.",
      body: [
        "Many businesses need to update service descriptions, publish news, manage product information or change other content over time.",
        "A suitable content management system makes these tasks straightforward without needing a developer for every routine edit.",
        "We choose the approach based on the site’s structure, functionality and who will be responsible for updates.",
      ],
    },
  ],
  close: "You do not need to know which platform or development approach is right. We can start with what the website needs to do and evaluate suitable options from there.",
  visualLabel:
    "Illustration: the parts of a website floating around a page outline: a booking calendar, a basket, a content editor, a login, an accessibility check and a fast-loading indicator.",
};

// --- 04 Website Quality & Development Standards ----------------------------------------------------

export const WEB_QUALITY = {
  eyebrow: "Website quality & development standards",
  title: "The details that make a better website.",
  body: [
    "What happens behind the scenes matters as much as what visitors see.",
    "A well-designed website should be straightforward to use, work across different devices and have a technical foundation that matches its purpose.",
    "We consider the practical details that affect the experience at launch and as the site develops.",
  ],
  items: [
    {
      title: "Easy to Navigate",
      body: "Visitors should know where they are, find useful information and move between relevant pages without confusion. Clear menus, logical page structures, descriptive headings and obvious next steps make the site easier to explore.",
    },
    {
      title: "Works Across Devices",
      body: "Customers use websites on phones, tablets, laptops and desktop computers. Responsive design means more than shrinking a desktop layout. Content, navigation, images and interactive elements need to work on different screen sizes and ways of interacting.",
    },
    {
      title: "Built for Performance",
      body: "Large images, unnecessary scripts and inefficient functionality can make a site slow or frustrating. We consider page loading, image optimisation, responsive interactions and the performance impact of design and development choices.",
    },
    {
      title: "Ready to Be Found",
      body: "Search engines need to understand the structure and content of a website. Relevant headings, descriptive page titles, meaningful content, internal links and appropriate technical foundations support search engine visibility. A technically sound site provides a starting point for SEO, but competitive rankings usually also need additional content work and ongoing effort.",
    },
    {
      title: "Easy to Maintain",
      body: "Websites need occasional updates, technical attention and sometimes new functionality. We consider how content will be managed, what ongoing services may be required and how future changes could be accommodated. The right approach depends on the platform and the agreed scope.",
    },
  ],
  note: "Security, accessibility, privacy and the proper handling of customer information are considered throughout the design and development process. The specific requirements depend on the functionality, integrations and information the site handles.",
  visualLabel: "Illustration: the same website on a desktop, a tablet and a phone, with checks for navigation, loading speed and search-friendly structure.",
};

// --- 05 Websites for Different Business Needs ------------------------------------------------------

export const WEB_SCENARIOS = {
  eyebrow: "Websites for different business needs",
  title: "Different businesses. Different website needs.",
  body: [
    "A website should reflect what a business needs today while leaving room for where it may be heading.",
    "A small business establishing its online presence will have different requirements from a retailer introducing online sales or an established organisation replacing an ageing site.",
  ],
  items: [
    {
      stage: "Starting Out",
      title: "Establish a Professional Presence",
      body: [
        "Imagine a new service business preparing to launch.",
        "Its immediate priority is to explain what it offers, where it operates and how customers can get in touch.",
        "A suitable website might include a clear homepage, individual service pages, information about the business and a straightforward enquiry process.",
        "The focus is on establishing a credible digital presence without adding functionality the business does not yet need.",
      ],
    },
    {
      stage: "Ready to Grow",
      title: "Introduce More Functionality",
      body: [
        "Consider an established business that wants customers to do more online.",
        "It might need appointment booking, a product catalogue, online purchases or connections between website enquiries and an existing business system.",
        "The project may involve extending the current site or creating a new platform that better accommodates those requirements.",
        "The important consideration is how the new functionality fits into day-to-day operations.",
      ],
    },
    {
      stage: "Ready for Change",
      title: "Modernise an Existing Website",
      body: [
        "An established company may have a website that no longer reflects its services, identity or customer expectations.",
        "Its priority might be clearer content, updated design, improved mobile usability and a more manageable structure.",
        "A redevelopment can also provide a chance to review existing pages, retain valuable information and address technical limitations.",
        "Where appropriate, search visibility and existing traffic are considered during migration planning.",
      ],
    },
  ],
  disclaimer:
    "These are illustrative scenarios, not completed client projects. Every website begins with understanding the business, the people who will use it and the outcome the project needs to support.",
  visualLabel: "Illustration: three websites side by side, growing from a simple starter site to a site with bookings and a shop, and an older site being modernised.",
};

// --- 06 Website Projects, Costs & Expectations ------------------------------------------------------

export const WEB_COSTS = {
  eyebrow: "Website projects, costs & expectations",
  title: "Know what you are investing in.",
  body: [
    "A website is an investment in the business, and understanding what is involved helps decide how to move forward.",
    "A straightforward company website, a large e-commerce store and a bespoke online platform have very different requirements.",
    "The scope, technical approach and ongoing considerations should be discussed before work begins.",
  ],
  items: [
    {
      title: "Project Scope",
      tagline: "Understand what is being designed and developed.",
      body: [
        "The cost and complexity depend on the number of pages, content requirements, design detail, functionality and integrations.",
        "A site with a handful of informational pages has different requirements from one with customer accounts, online payments and specialist business features.",
        "A clear scope identifies the work required and separates essential functionality from features that can be added later.",
      ],
    },
    {
      title: "Ongoing Requirements",
      tagline: "Understand what happens after launch.",
      body: [
        "Websites typically involve domain registration, hosting, software subscriptions, technical maintenance and content updates.",
        "Depending on the platform, additional services may be needed for payment processing, booking systems, email delivery or other integrations.",
        "These requirements should be identified during planning so it is clear which elements are part of the initial project and which may involve ongoing costs.",
      ],
    },
    {
      title: "Beyond Launch",
      tagline: "Understand the difference between launching and growing.",
      body: [
        "Publishing a website makes it available online, but does not automatically bring visitors, enquiries or sales.",
        "Search engine optimisation, content development, marketing and ongoing improvements can all help build a stronger online presence.",
        "The appropriate next steps depend on the business, its audience and the objectives of the website.",
      ],
    },
  ],
  close:
    "Our approach begins with understanding the requirements and discussing an appropriate scope, rather than assuming every business needs the same website or level of investment.",
  related: { label: "Related service: SEO & Digital Growth", href: "/solutions/digital-growth" },
  visualLabel: "Illustration: a project scope sheet separating essential features from later additions, beside a card of ongoing items such as domain, hosting and maintenance.",
};

// --- Common questions -------------------------------------------------------------------------

export const WEB_FAQ = {
  title: "Common Questions About Website Design",
  items: [
    {
      q: "How much does a business website cost?",
      a: [
        "Website development costs vary with the project’s requirements.",
        "A smaller informational website involves different levels of design and development work from an e-commerce store or bespoke application.",
        "The number of pages, required features, content preparation, integrations and ongoing services all affect the cost.",
        "The most useful starting point is to outline what you need and establish the scope before discussing a quotation.",
      ],
    },
    {
      q: "How long does it take to design and build a website?",
      a: [
        "The timescale depends on the size and complexity of the project, the availability of content and how quickly important decisions can be made.",
        "A relatively straightforward business website requires less development work than an e-commerce platform or application with custom functionality.",
        "Project milestones and expected delivery arrangements should be agreed as part of planning.",
      ],
    },
    {
      q: "Can you redesign my existing website?",
      a: [
        "Yes. Website redesign and redevelopment are among the projects Solvitech considers.",
        "A redesign might involve improving appearance, navigation, content structure, mobile usability or technical functionality.",
        "Before recommending a rebuild, it helps to understand what currently works, what needs improvement and whether any existing functionality or content should be preserved.",
      ],
    },
    {
      q: "Will my new website appear on Google?",
      a: [
        "A website can be developed with technical and content foundations that help search engines discover and understand its pages.",
        "Appearing in search results and achieving competitive rankings are different things.",
        "Indexing, rankings and traffic depend on factors beyond simply launching a site, including competition, relevance, content quality and the website’s wider search presence.",
        "Dedicated SEO work may be appropriate when improving search visibility is an important objective.",
      ],
    },
    {
      q: "Will my website work on mobile phones?",
      a: [
        "Responsive design is an important part of modern website development.",
        "The layout, navigation, images and interactive features should be considered across mobile, tablet and desktop devices.",
        "The precise testing and compatibility requirements can be established during project planning.",
      ],
    },
    {
      q: "Can I update the website myself?",
      a: [
        "That depends on the platform and content management approach chosen for the project.",
        "Some websites can be configured so authorised users can update text, images, products or other content through an administration interface.",
        "If managing content independently is important, it should be included in the initial requirements.",
      ],
    },
    {
      q: "Can you add online booking, payments or other functionality?",
      a: [
        "Websites can incorporate booking systems, payment services, enquiry workflows and other features where suitable technology and integrations are available.",
        "The right implementation depends on the business process, the existing systems involved and any security or operational requirements.",
        "More specialised functionality may require bespoke software or systems integration work.",
      ],
    },
    {
      q: "What happens after the website launches?",
      a: [
        "Ongoing responsibilities vary according to the website’s platform, hosting arrangements and agreed services.",
        "These may include domain renewals, hosting, updates, technical maintenance, content changes and future enhancements.",
        "It is important to establish which responsibilities belong to the website owner, hosting provider, third-party platforms or any agreed support arrangement.",
      ],
    },
  ],
};

// --- 07 Start Your Website Project ------------------------------------------------------------

export const WEB_CLOSE = {
  eyebrow: "Start your website project",
  title: "Ready for a better online presence?",
  body: [
    "Whether you need a first business website, want to modernise an existing one or have plans for a more advanced digital platform, we would like to understand what you want to achieve.",
    "Tell us about the business, the people you want to reach and what the website needs to do.",
    "You do not need to know which technology or platform to use. We can start with the requirements and explore an appropriate way forward.",
  ],
  primary: { label: "Request a Website Consultation", href: "/contact" },
  secondary: { label: "Explore Our Approach", href: "/approach" },
  signoff: "From professional business websites to e-commerce and bespoke digital experiences, the right starting point is a conversation about the business.",
  related: [
    { label: "SEO & Digital Growth", body: "Explore how search optimisation and digital marketing can support your online presence.", href: "/solutions/digital-growth" },
    { label: "Custom Software & Business Systems", body: "Explore tailored functionality and business applications beyond a conventional website.", href: "/solutions/custom-software" },
    { label: "Systems Integration", body: "Explore connecting your website to the other software your business uses.", href: "/solutions/integrations" },
  ],
  visualLabel: "Illustration: a new website being drawn on a blueprint grid, behind a browser address bar.",
};
