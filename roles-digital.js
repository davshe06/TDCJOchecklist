/* Digital & Marketing role catalog — registers into the FORMS registry. */
(function () {
  window.FORMS = window.FORMS || {};

/* =========================================================================
   Digital & Marketing Job Order Intake — Role Configurations
   ---------------------------------------------------------------------------
   Step 1 selects a ROLE. Everything downstream (focus areas, deep-dive
   question sets, team specialists, tech-stack categories, success metrics,
   candidate backgrounds, AI use cases, and the recruiter-targeting profile)
   is driven by the selected role's config below.

   To add a role: add an entry to ROLES and list its id in ROLE_ORDER.
   app.js is a generic engine and needs no changes.

   Question types: text, textarea, number, select, radio, chips (multi-select)
   Conditional questions use showIf(answers, state).
   Tips use when(answers, state); areaPriority(state, id) reads the active
   role's focus-area priority ("must" | "nice" | "skip").
   ========================================================================= */

/* -------------------------------------------------------------------------
   Shared/common steps (role-agnostic parts). Options that depend on the role
   (team specialists, stack categories, metrics, backgrounds, AI use cases)
   are injected by app.js from the active role's config.
   ------------------------------------------------------------------------- */

const COMMON = {
  basics: {
    title: "Basic Information",
    subtitle: "Tell us about this role.",
    coach: "Best practice: schedule a job order intake session and include your perm team and TDC partner. Introduce Perm as an option on every JO, as well as FTEP.",
    questions: [
      { id: "client_company", type: "text", label: "Client company", placeholder: "Acme Corp" },
      { id: "company_website", type: "text", label: "Company website", placeholder: "https://www.client.com" },
      { id: "client_contact", type: "text", label: "Client contact(s) on the call", placeholder: "Name, title" },
      { id: "job_title", type: "text", label: "Exact job title on the req", placeholder: "e.g., Senior UX Designer" },
      { id: "why_hiring", type: "textarea", label: "Why are you hiring? What business problem are you trying to solve?",
        placeholder: "The pain behind the req — a launch, a growth target, a gap on the team…" },
      { id: "replacement_or_new", type: "radio", label: "Replacement or new position?",
        options: ["Replacement", "New position"] },
      { id: "replacement_why", type: "textarea", label: "What happened with the previous person?",
        placeholder: "Why did they leave? What would the client change about the profile?",
        showIf: a => a.replacement_or_new === "Replacement" },
      { id: "open_how_long", type: "select", label: "How long has the position been open?",
        options: ["Brand new", "Under 2 weeks", "2–4 weeks", "1–3 months", "3+ months"] },
      { id: "how_else_filling", type: "textarea", label: "How else are you filling it? Other recruiting firms?",
        placeholder: "Internal recruiters, job boards, competing agencies, referrals…" },
      { id: "strategic_vs_hands_on", type: "radio", label: "How strategic vs. hands-on is this role?",
        options: ["Mostly strategic", "Balanced", "Mostly hands-on"] },
      { id: "engagement_type", type: "chips", label: "Engagement type discussed",
        options: ["Contract", "Contract-to-hire", "Direct hire (Perm)", "FTEP"] }
    ],
    tips: [
      { when: a => a.open_how_long === "3+ months",
        text: "Open 3+ months — dig into why. Unrealistic requirements, low budget, or a slow interview process usually explains it. This is your chance to reset expectations." },
      { when: a => (a.how_else_filling || "").toLowerCase().includes("firm") || (a.how_else_filling || "").toLowerCase().includes("agenc"),
        text: "Competing firms in play — ask about exclusivity, how many resumes they've seen, and why nobody has been hired yet." },
      { when: a => !((a.engagement_type || []).includes("Direct hire (Perm)")),
        text: "Reminder: introduce Perm as an option on every job order, as well as FTEP." }
    ]
  },
  logistics: {
    title: "Logistics & Budget",
    subtitle: "The deal parameters.",
    questions: [
      { id: "work_model", type: "radio", label: "Remote / hybrid / onsite?",
        options: ["Remote", "Hybrid", "Onsite"] },
      { id: "location", type: "text", label: "Location / office", placeholder: "City, state",
        showIf: a => a.work_model === "Hybrid" || a.work_model === "Onsite" },
      { id: "days_in_office", type: "select", label: "Days in office per week",
        options: ["1", "2", "3", "4", "5"],
        showIf: a => a.work_model === "Hybrid" },
      { id: "working_hours", type: "text", label: "Working hours", placeholder: "e.g., 9–5 ET, core hours 10–3" },
      { id: "start_date", type: "text", label: "Clear start date", placeholder: "e.g., ASAP, first week of August" },
      { id: "assignment_length", type: "text", label: "Length of assignment", placeholder: "e.g., 6 months, 12 months, ongoing" },
      { id: "budget", type: "text", label: "Budget (bill rate / salary range)", placeholder: "e.g., $70–85/hr, $110–130k" },
      { id: "conversion_fees", type: "text", label: "Conversion fees discussed?", placeholder: "Terms, timing, fee schedule" },
      { id: "bill_to", type: "text", label: "Bill to", placeholder: "Billing contact / entity / PO requirements" }
    ],
    tips: [
      { when: a => a.work_model === "Remote",
        text: "Fully remote widens the pool but also the competition — confirm any time-zone or state restrictions now." },
      { when: a => !(a.budget || "").trim() && !!a.work_model,
        text: "No budget yet — don't leave the call without a number or range. Everything downstream depends on it." }
    ]
  },
  team: {
    title: "Team Structure",
    subtitle: "How is the team organized?",
    questions: [
      { id: "reports_to", type: "text", label: "Who does this person report to?", placeholder: "Title and name" },
      { id: "team_size", type: "text", label: "How many people are on the team?", placeholder: "e.g., 6" },
      { id: "direct_reports", type: "radio", label: "Will this person manage anyone?",
        options: ["Yes", "No", "Not sure"] },
      { id: "direct_reports_who", type: "text", label: "Who will they manage?", placeholder: "Roles / count",
        showIf: a => a.direct_reports === "Yes" },
      /* specialists chip options injected from role.specialists */
      { id: "specialists", type: "chips", label: "What specialists already exist on the team?", options: [] },
      { id: "generalist_or_specialist", type: "radio", label: "Is this role a specialist or a generalist?",
        options: ["Specialist", "Generalist / jack-of-all-trades", "Somewhere in between"] }
    ],
    tips: [
      { when: a => a.generalist_or_specialist === "Generalist / jack-of-all-trades",
        text: "Generalist roles are the hardest to fill and score. Push extra hard on the 'top 3 things' question in the Focus Areas step." }
    ]
  },
  closing: {
    title: "Closing Questions",
    subtitle: "Lock in the process before you hang up.",
    questions: [
      { id: "portfolio_or_test", type: "text", label: "Portfolio, code test, or assignment required?",
        placeholder: "e.g., portfolio review, take-home exercise, live coding" },
      { id: "computer_provided", type: "radio", label: "Computer provided by…",
        options: ["Company provided", "Robert Half provided", "Personal computer"] },
      { id: "background_check", type: "radio", label: "Background check?", options: ["Yes", "No"] },
      { id: "background_check_details", type: "textarea", label: "Background check specifics",
        placeholder: "Type of check, vendor, lookback period, disqualifiers, timing…",
        showIf: a => a.background_check === "Yes" },
      { id: "drug_screen", type: "radio", label: "Drug screen?", options: ["Yes", "No"] },
      { id: "drug_screen_details", type: "textarea", label: "Drug screen specifics",
        placeholder: "Panel type, timing (pre-start / pre-offer), vendor…",
        showIf: a => a.drug_screen === "Yes" },
      { id: "feedback_turnaround", type: "text", label: "Resume / interview feedback turnaround?", placeholder: "e.g., within 48 hours" },
      { id: "next_steps", type: "textarea", label: "Agreed next steps",
        placeholder: "When you'll send candidates, follow-up call scheduled…" }
    ],
    tips: []
  }
};

/* Common ideal-candidate backgrounds reused by several roles */
const BG_COMMON = ["B2B", "B2C", "SaaS", "Agency", "Enterprise", "Startup", "E-commerce"];

/* =========================================================================
   ROLE CONFIGS
   ========================================================================= */

const ROLES = {

  /* ---------------------------------------------------------------- DMM */
  digital_marketing_manager: {
    label: "Digital Marketing Manager",
    icon: "📈",
    tagline: "Full-funnel marketing generalist or channel lead",
    about: "A Digital Marketing Manager owns a company's online marketing — paid ads, email, SEO, social, and the analytics that tie it all to revenue. The exact mix varies enormously by company, which is why this intake pins down where they'll actually spend their time.",
    blurb: "“Digital Marketing Manager” can mean 10 different jobs depending on the company — the intake matters more than the job description. Identify where they'll spend 70–80% of their time, then recruit around those core competencies.",
    timePrompt: "“If this person only had time to be exceptional at three things, what would those three things be — and roughly what percentage of their job would each represent?”",
    focusAreas: [
      { id: "paid_media", label: "Paid Media", icon: "📣", deepDive: {
        intro: "Paid media ownership varies wildly — nail down channels, spend, and accountability.",
        questions: [
          { id: "channels", type: "chips", label: "Which channels will they own?",
            options: ["Google Ads", "Meta", "LinkedIn", "Display", "Programmatic", "Other"] },
          { id: "ad_spend", type: "select", label: "Monthly ad spend?",
            options: ["Under $10k", "$10k–$50k", "$50k–$100k", "$100k–$500k", "$500k+", "Unknown"] },
          { id: "managed_by", type: "radio", label: "Agency or in-house today?",
            options: ["In-house", "Agency", "Hybrid"] },
          { id: "agency_mgmt", type: "radio", label: "Will this person manage the agency relationship?",
            options: ["Yes", "No", "Not sure"], showIf: a => a.managed_by === "Agency" || a.managed_by === "Hybrid" },
          { id: "roas", type: "text", label: "ROAS / CPA expectations?", placeholder: "e.g., 4x ROAS, CPA under $150" }
        ],
        tips: [
          { when: a => ["$100k–$500k", "$500k+"].includes(a.ad_spend),
            text: "High ad spend — screen for hands-on platform depth and budget-pacing experience, not just strategy." },
          { when: a => (a.channels || []).includes("LinkedIn"),
            text: "LinkedIn ads usually signal B2B — probe for lead-gen forms, ABM campaigns, and cost-per-lead benchmarks." }
        ] } },
      { id: "marketing_automation", label: "Marketing Automation", icon: "⚙️", deepDive: {
        intro: "Platform expertise is often the single biggest filter on the candidate pool.",
        questions: [
          { id: "platform", type: "radio", label: "Which platform?",
            options: ["HubSpot", "Marketo", "Pardot", "SFMC", "Adobe", "Other / None yet"] },
          { id: "responsibilities", type: "chips", label: "What will they build?",
            options: ["Workflows", "Lead scoring", "Nurture campaigns", "Segmentation"] },
          { id: "depth", type: "radio", label: "Admin-level or user-level?",
            options: ["Admin / owner of the instance", "Power user", "Light user"] }
        ],
        tips: [
          { when: a => ["Marketo", "SFMC", "Adobe"].includes(a.platform),
            text: "Enterprise platform expertise (Marketo, SFMC, Adobe) is rare — expect a narrower pool and higher rates." }
        ] } },
      { id: "email", label: "Email Marketing", icon: "✉️", deepDive: {
        intro: "Separate strategy, copywriting, building, and analysis — few candidates do all four well.",
        questions: [
          { id: "responsibilities", type: "chips", label: "Will they…",
            options: ["Create campaigns", "Write emails", "Build journeys", "Analyze performance"] },
          { id: "frequency", type: "radio", label: "Send frequency?",
            options: ["Daily", "Weekly", "Monthly", "Ad hoc / campaign-based"] },
          { id: "esp", type: "text", label: "Which email platform / ESP?", placeholder: "e.g., HubSpot, Klaviyo, Mailchimp" }
        ],
        tips: [
          { when: a => (a.responsibilities || []).includes("Write emails"),
            text: "Writing the emails themselves means copywriting samples matter — ask for a portfolio in screening." }
        ] } },
      { id: "seo", label: "SEO", icon: "🔍", deepDive: {
        intro: "Technical SEO and content SEO are different skill sets — find out which they need.",
        questions: [
          { id: "involvement", type: "chips", label: "How involved?",
            options: ["Technical SEO", "Content SEO", "Keyword research", "Local SEO"] },
          { id: "dev_team", type: "radio", label: "Will they work with a dev team on implementation?",
            options: ["Yes", "No", "Not sure"], showIf: a => (a.involvement || []).includes("Technical SEO") },
          { id: "seo_tools", type: "text", label: "SEO tools in use?", placeholder: "e.g., Ahrefs, Semrush, Screaming Frog" }
        ],
        tips: [
          { when: a => (a.involvement || []).includes("Technical SEO") && a.dev_team === "No",
            text: "Technical SEO without dev support means they implement fixes themselves — screen for hands-on CMS/HTML skills." }
        ] } },
      { id: "website", label: "Website / CRO", icon: "🌐", deepDive: {
        intro: "Clarify whether they touch the site directly or route everything through developers.",
        questions: [
          { id: "cms", type: "chips", label: "Which CMS platforms?",
            options: ["WordPress", "Drupal", "Shopify", "Sitecore", "Webflow", "Other"] },
          { id: "responsibilities", type: "chips", label: "Will they…",
            options: ["Update the website", "Manage developers", "Create landing pages", "Improve conversion rates (CRO)"] },
          { id: "cro_tools", type: "text", label: "Which testing / CRO tools?", placeholder: "e.g., Optimizely, VWO, Hotjar",
            showIf: a => (a.responsibilities || []).includes("Improve conversion rates (CRO)") }
        ],
        tips: [
          { when: a => (a.cms || []).includes("Sitecore"),
            text: "Sitecore experience is enterprise-niche — flag this early; it materially narrows the pool." }
        ] } },
      { id: "analytics", label: "Analytics", icon: "📊", deepDive: {
        intro: "Distinguish between reading dashboards and building them.",
        questions: [
          { id: "tools", type: "chips", label: "Which tools?",
            options: ["GA4", "Adobe Analytics", "Tableau", "Looker", "Power BI", "Other"] },
          { id: "responsibilities", type: "chips", label: "Will they…",
            options: ["Build dashboards", "Executive reporting", "Campaign optimization", "Attribution"] }
        ],
        tips: [
          { when: a => (a.responsibilities || []).includes("Build dashboards") && ((a.tools || []).includes("Tableau") || (a.tools || []).includes("Looker") || (a.tools || []).includes("Power BI")),
            text: "Building BI dashboards is closer to an analyst skill set — confirm whether an analytics team already covers this." }
        ] } },
      { id: "content", label: "Content", icon: "📝", deepDive: {
        intro: "Creator or editor? Many 'content' roles are really vendor management.",
        questions: [
          { id: "creates", type: "chips", label: "What will they create?",
            options: ["Blogs", "Whitepapers", "Videos", "Social content"] },
          { id: "mode", type: "radio", label: "Create it themselves or manage freelancers?",
            options: ["Creates themselves", "Manages freelancers / agency", "Both"] }
        ],
        tips: [
          { when: a => (a.creates || []).includes("Videos") && a.mode === "Creates themselves",
            text: "In-house video creation is specialized — confirm expectations (shooting/editing vs. scripting only)." }
        ] } },
      { id: "social", label: "Social Media", icon: "💬", deepDive: {
        intro: "Organic and paid social are different jobs — and paid social may overlap with Paid Media.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Organic", "Paid", "Community management", "Influencers"] },
          { id: "platforms", type: "text", label: "Which platforms?", placeholder: "LinkedIn, Instagram, TikTok…" }
        ],
        tips: [
          { when: (a, s) => (a.scope || []).includes("Paid") && areaPriority(s, "paid_media") === "skip",
            text: "Paid social is in scope but Paid Media isn't a focus area — clarify who owns ad budgets and platform execution." }
        ] } }
    ],
    specialists: [
      { label: "SEO Specialist", overlapsArea: "seo" },
      { label: "Paid Media Manager", overlapsArea: "paid_media" },
      { label: "Marketing Automation Manager", overlapsArea: "marketing_automation" },
      { label: "Designer", overlapsArea: null },
      { label: "Copywriter", overlapsArea: "content" },
      { label: "Web Developer", overlapsArea: "website" },
      { label: "Analytics Team", overlapsArea: "analytics" }
    ],
    profileRules: [
      { must: ["paid_media", "analytics"], profile: "Performance / growth marketer",
        detail: "Target candidates from performance agencies or in-house growth teams. Portfolio = spend managed, ROAS delivered." },
      { must: ["marketing_automation", "email"], profile: "Marketing operations / lifecycle marketer",
        detail: "Target marketing-ops and lifecycle titles. Platform certifications and journey architecture are the screening filters." },
      { must: ["content", "seo"], profile: "Content & brand marketer",
        detail: "Target content-marketing titles with SEO chops. Writing samples and organic-traffic wins are the screening filters." }
    ],
    stackCategories: [
      { id: "crm", label: "CRM", placeholder: "Salesforce, HubSpot CRM…", options: ["Salesforce","HubSpot CRM","Dynamics 365","Zoho","Pipedrive"] },
      { id: "creative", label: "Creative", placeholder: "Figma, Adobe CC, Canva…", options: ["Figma","Adobe Creative Cloud","Canva","CapCut"] }
    ],
    aiUseCases: ["Content creation", "Email drafting", "SEO optimization", "Paid ad optimization",
                 "Campaign reporting", "Personalization", "Image creation", "Workflow automation"],
    aiTools: ["ChatGPT / Claude","Jasper / Copy.ai","Midjourney / DALL·E","HubSpot AI","Google Ads AI / PMax","Canva AI","SEO AI (Surfer / Clearscope)"],
    metrics: ["Leads generated", "Pipeline", "Revenue", "ROAS", "Website traffic", "Conversions",
              "Email performance", "CAC", "MQLs", "SQLs", "Marketing ROI"],
    backgrounds: BG_COMMON.concat(["Manufacturing", "Healthcare", "Financial Services", "Retail"])
  },

  /* -------------------------------------------------------- UX DESIGNER */
  ux_designer: {
    label: "UX Designer / Researcher",
    icon: "🎨",
    tagline: "Product design, interaction, and user research",
    about: "UX designers shape how digital products look, feel, and flow — from researching users to wireframes to polished interfaces, usually in Figma. Dedicated researchers focus on studying users; designers focus on crafting the experience.",
    blurb: "“UX Designer” spans pure research to pixel-level UI. Pin down where on the research↔design spectrum this role sits, and whether they own the whole product or one slice. Aim to identify the 70–80% of the week and recruit for it.",
    timePrompt: "“If this person only had time to be exceptional at three things across research and design, what would they be — and roughly what share of the week does each take?”",
    focusAreas: [
      { id: "research", label: "User Research", icon: "🔬", deepDive: {
        intro: "Generative vs. evaluative research are different muscles — clarify which and how often.",
        questions: [
          { id: "methods", type: "chips", label: "Which methods?",
            options: ["User interviews", "Usability testing", "Surveys", "Field studies", "Card sorting", "A/B / experiments"] },
          { id: "recruiting", type: "radio", label: "Who recruits participants?",
            options: ["This person", "Research ops / panel", "Not sure"] },
          { id: "dedicated", type: "radio", label: "Is this a dedicated researcher or a designer who researches?",
            options: ["Dedicated researcher", "Designer who researches", "Split"] },
          { id: "research_tools", type: "text", label: "Research tools?", placeholder: "Dovetail, UserTesting, Maze, Optimal Workshop" }
        ],
        tips: [
          { when: a => a.dedicated === "Dedicated researcher",
            text: "A dedicated researcher is a distinct market from product designers — target UX Researcher titles and academic/HCI backgrounds." }
        ] } },
      { id: "interaction", label: "Interaction & UI Design", icon: "🖌️", deepDive: {
        intro: "Fidelity, platform, and whether they design from scratch or within a system all narrow the pool.",
        questions: [
          { id: "tools", type: "chips", label: "Primary design tool?",
            options: ["Figma", "Sketch", "Adobe XD", "Framer", "Other"] },
          { id: "platforms", type: "chips", label: "Which platforms?",
            options: ["Responsive web", "iOS", "Android", "Desktop app", "Design system only"] },
          { id: "visual_weight", type: "radio", label: "How visual/polish-heavy is the role?",
            options: ["Highly polished visual/UI", "Balanced UX + UI", "Mostly UX / lower-fi"] }
        ],
        tips: [
          { when: a => (a.platforms || []).includes("iOS") || (a.platforms || []).includes("Android"),
            text: "Native mobile design needs platform-pattern fluency (HIG / Material) — screen for shipped app work, not just web." }
        ] } },
      { id: "prototyping", label: "Prototyping", icon: "🧩", deepDive: {
        intro: "Prototypes for testing vs. for engineering handoff imply different fidelity and skills.",
        questions: [
          { id: "fidelity", type: "radio", label: "Fidelity expected?",
            options: ["Low-fi / wireflows", "High-fi interactive", "Motion / advanced (Framer, code)"] },
          { id: "purpose", type: "chips", label: "Prototypes for…",
            options: ["Usability testing", "Stakeholder buy-in", "Engineering handoff"] }
        ],
        tips: [
          { when: a => a.fidelity === "Motion / advanced (Framer, code)",
            text: "Advanced/coded prototyping is a niche skill — expect a smaller pool; confirm it's truly required." }
        ] } },
      { id: "design_systems", label: "Design Systems", icon: "🧱", deepDive: {
        intro: "Owning a system is different from consuming one.",
        questions: [
          { id: "involvement", type: "radio", label: "Relationship to the system?",
            options: ["Build / own the system", "Contribute components", "Consume an existing system"] },
          { id: "tokens", type: "radio", label: "Design tokens / theming in play?",
            options: ["Yes", "No", "Not sure"] }
        ],
        tips: [
          { when: a => a.involvement === "Build / own the system",
            text: "Owning a design system is a specialist track — target designers with named design-system experience and governance stories." }
        ] } },
      { id: "ia", label: "Information Architecture", icon: "🗂️", deepDive: {
        intro: "IA-heavy roles suit content-dense or enterprise products.",
        questions: [
          { id: "activities", type: "chips", label: "Which activities?",
            options: ["Navigation / taxonomy", "Card sorting", "Tree testing", "Content modeling"] }
        ], tips: [] } },
      { id: "content_design", label: "Content Design / UX Writing", icon: "✍️", deepDive: {
        intro: "Some UX roles own the words; some hand off to a writer.",
        questions: [
          { id: "scope", type: "radio", label: "Ownership of UX copy?",
            options: ["Owns UX writing", "Collaborates with a writer", "Not in scope"] }
        ], tips: [] } },
      { id: "accessibility", label: "Accessibility", icon: "♿", deepDive: {
        intro: "Accessibility can be a checkbox or a core requirement — find out which.",
        questions: [
          { id: "level", type: "radio", label: "Compliance target?",
            options: ["WCAG 2.1 AA", "WCAG AAA", "Section 508", "Best-effort / unspecified"] },
          { id: "activities", type: "chips", label: "What's expected?",
            options: ["Accessible design from the start", "Audits / remediation", "ARIA / dev collaboration"] }
        ],
        tips: [
          { when: a => ["WCAG 2.1 AA", "WCAG AAA", "Section 508"].includes(a.level),
            text: "A hard accessibility standard is a real screening filter — ask for examples of accessible work shipped to that standard." }
        ] } }
    ],
    specialists: [
      { label: "UX Researcher", overlapsArea: "research" },
      { label: "UI / Visual Designer", overlapsArea: "interaction" },
      { label: "Content Designer / UX Writer", overlapsArea: "content_design" },
      { label: "Design System Lead", overlapsArea: "design_systems" },
      { label: "Front-End Developer", overlapsArea: null },
      { label: "Product Manager", overlapsArea: null }
    ],
    profileRules: [
      { must: ["research", "accessibility"], profile: "UX Researcher (evaluative-leaning)",
        detail: "Target dedicated researcher titles. Portfolio = study plans, findings, and impact on product decisions." },
      { must: ["interaction", "prototyping"], profile: "Product / UX Designer",
        detail: "Target product designer titles. Portfolio = end-to-end case studies with prototypes and shipped outcomes." },
      { must: ["design_systems", "interaction"], profile: "Design Systems Designer",
        detail: "Target designers who've built or owned a system. Component libraries, tokens, and governance are the filters." }
    ],
    stackCategories: [
      { id: "prototyping", label: "Prototyping", placeholder: "Figma, Framer, ProtoPie", options: ["Figma","Framer","ProtoPie","Principle","Axure"] },
      { id: "handoff", label: "Handoff / dev", placeholder: "Figma Dev Mode, Zeplin, Storybook", options: ["Figma Dev Mode","Zeplin","Storybook"] },
      { id: "analytics", label: "Product analytics", placeholder: "Amplitude, Hotjar, FullStory", options: ["Amplitude","Hotjar","FullStory","Mixpanel","GA4"] },
      { id: "collab", label: "Collaboration", placeholder: "FigJam, Miro, Notion", options: ["FigJam","Miro","Notion","Confluence"] }
    ],
    aiUseCases: ["Design variations / ideation", "Research synthesis", "UX copy generation",
                 "Rapid prototyping", "Image / asset generation", "Summarizing user feedback"],
    aiTools: ["Figma AI","ChatGPT / Claude","Midjourney / DALL·E","v0 / Lovable","Dovetail AI","UserTesting AI"],
    metrics: ["Usability scores (SUS)", "Task success rate", "Time on task", "Feature adoption",
              "Retention", "Conversion", "NPS / CSAT", "Accessibility compliance", "Design-system adoption"],
    backgrounds: ["B2B SaaS", "Consumer apps", "Enterprise software", "Agency / consultancy",
                  "E-commerce", "Fintech", "Healthcare", "Startup", "Design studio"]
  },

  /* ------------------------------------------------ MARKETING AUTOMATION */
  marketing_automation: {
    label: "Marketing Automation Specialist",
    icon: "⚙️",
    tagline: "Platform ops, journeys, lead management, and data",
    about: "Marketing automation specialists run platforms like HubSpot and Marketo that send automated email journeys, score leads, and hand the best ones to sales. It's the operational engine behind modern marketing — part marketer, part systems administrator.",
    blurb: "Automation roles live and die by the platform and the data behind it. Pin the exact platform, how deep the admin/ops work goes, and whether this is a builder, a strategist, or a data-plumbing role. Recruit for the 70–80%.",
    timePrompt: "“Between platform ops, campaign building, data, and reporting — what three things carry most of the week, and roughly what percentage each?”",
    focusAreas: [
      { id: "platform_admin", label: "Platform Administration", icon: "🛠️", deepDive: {
        intro: "The platform is the single biggest filter on the pool.",
        questions: [
          { id: "platform", type: "radio", label: "Which platform?",
            options: ["HubSpot", "Marketo", "Pardot / Account Engagement", "Salesforce Marketing Cloud", "Adobe / Eloqua", "Other"] },
          { id: "depth", type: "radio", label: "Admin depth?",
            options: ["Full admin / instance owner", "Power user / builder", "Campaign user"] },
          { id: "migration", type: "radio", label: "Any platform migration in scope?",
            options: ["Yes — migrating", "No", "Possibly"] },
          { id: "certification", type: "radio", label: "Certification expectation?",
            options: ["Required", "Preferred", "Not important"] }
        ],
        tips: [
          { when: a => ["Marketo", "Salesforce Marketing Cloud", "Adobe / Eloqua"].includes(a.platform),
            text: "Enterprise platform admins (Marketo, SFMC, Eloqua) are scarce and command premium rates — set budget expectations accordingly." },
          { when: a => a.migration === "Yes — migrating",
            text: "A migration in scope means you want someone who's done that exact migration before — ask the client to prioritize it." }
        ] } },
      { id: "journeys", label: "Workflows & Journeys", icon: "🔀", deepDive: {
        intro: "Complexity and channel breadth define the seniority needed.",
        questions: [
          { id: "complexity", type: "radio", label: "Journey complexity?",
            options: ["Simple triggers", "Multi-step nurtures", "Complex multi-channel orchestration"] },
          { id: "channels", type: "chips", label: "Which channels?",
            options: ["Email", "SMS", "Push", "Ads / retargeting", "Direct mail"] }
        ], tips: [] } },
      { id: "lead_mgmt", label: "Lead Management & Scoring", icon: "🎯", deepDive: {
        intro: "Scoring and lifecycle work sits between marketing and sales.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Lead scoring models", "Lifecycle stages", "MQL→SQL handoff", "Routing / assignment"] },
          { id: "sla", type: "radio", label: "Is there a marketing↔sales SLA to manage?",
            options: ["Yes", "No", "Not sure"] }
        ], tips: [] } },
      { id: "data", label: "CRM Integration & Data", icon: "🗄️", deepDive: {
        intro: "Data hygiene and CRM sync are where automation roles quietly get hard.",
        questions: [
          { id: "crm", type: "radio", label: "Which CRM?",
            options: ["Salesforce", "Microsoft Dynamics", "HubSpot CRM", "Other", "None"] },
          { id: "work", type: "chips", label: "Data responsibilities?",
            options: ["Sync / integrations", "Data hygiene / dedup", "Enrichment", "Field mapping / architecture"] }
        ],
        tips: [
          { when: (a, s) => a.crm === "Salesforce" && areaPriority(s, "data") === "must",
            text: "Salesforce + data ownership pushes this toward a marketing-ops engineer — confirm whether Salesforce admin skills are truly required." }
        ] } },
      { id: "segmentation", label: "Segmentation & Personalization", icon: "🧬", deepDive: {
        intro: "Dynamic content and list strategy separate operators from strategists.",
        questions: [
          { id: "scope", type: "chips", label: "What's expected?",
            options: ["List / segment strategy", "Dynamic content", "Personalization tokens", "Predictive / AI segments"] }
        ], tips: [] } },
      { id: "reporting", label: "Reporting & Attribution", icon: "📊", deepDive: {
        intro: "Attribution maturity tells you how analytical this role really is.",
        questions: [
          { id: "scope", type: "chips", label: "Reporting scope?",
            options: ["Campaign dashboards", "Funnel / pipeline reporting", "Multi-touch attribution", "Revenue reporting"] },
          { id: "tools", type: "text", label: "Reporting / BI tools?", placeholder: "Platform native, Tableau, Power BI…" }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Email Marketer", overlapsArea: "journeys" },
      { label: "Demand Gen Manager", overlapsArea: "lead_mgmt" },
      { label: "Salesforce / CRM Admin", overlapsArea: "data" },
      { label: "Data Analyst", overlapsArea: "reporting" },
      { label: "Content Marketer", overlapsArea: null },
      { label: "Web Developer", overlapsArea: null }
    ],
    profileRules: [
      { must: ["platform_admin", "data"], profile: "Marketing Ops Engineer",
        detail: "Target marketing-ops / MOps titles with admin + CRM depth. Certifications and integration work are the filters." },
      { must: ["journeys", "lead_mgmt"], profile: "Demand Gen / Lifecycle Marketer",
        detail: "Target demand-gen and lifecycle titles. Nurture performance and pipeline contribution are the filters." },
      { must: ["reporting", "data"], profile: "Marketing Ops Analyst",
        detail: "Target ops-analyst titles. Attribution modeling and BI fluency are the filters." }
    ],
    stackCategories: [
      { id: "data", label: "Data / CDP", placeholder: "Segment, Snowflake, ZoomInfo…", options: ["Segment","Snowflake","ZoomInfo","Clearbit","Census"] },
      { id: "web", label: "CMS / landing pages", placeholder: "WordPress, Unbounce…", options: ["WordPress","Unbounce","Webflow","HubSpot CMS","Instapage"] },
      { id: "ads", label: "Ad platforms", placeholder: "Google Ads, LinkedIn…", options: ["Google Ads","LinkedIn Ads","Meta Ads","Microsoft Ads"] }
    ],
    aiUseCases: ["Email drafting", "Subject-line optimization", "Segmentation", "Predictive lead scoring",
                 "Content generation", "Workflow suggestions", "Reporting summaries"],
    aiTools: ["HubSpot AI / Breeze","Salesforce Einstein","Marketo AI","ChatGPT / Claude","Predictive lead scoring","Zapier AI / agents"],
    metrics: ["MQLs", "SQLs", "Pipeline", "Conversion rates", "Email performance", "Deliverability",
              "Lead velocity", "Campaign ROI", "Data quality", "Funnel conversion"],
    backgrounds: BG_COMMON.concat(["Manufacturing", "Healthcare", "Financial Services"])
  },

  /* -------------------------------------------------------- DIGITAL PM */
  digital_pm: {
    label: "Digital Project Manager",
    icon: "🗓️",
    tagline: "Delivery, agile, stakeholders, and budgets",
    about: "Digital project managers keep website, app, and campaign projects on schedule and on budget — coordinating designers, developers, clients, and vendors. Many also run agile/scrum delivery processes for their teams.",
    blurb: "A Digital PM can be a scrum-focused delivery lead, a client-facing account-style PM, or a program manager juggling budgets. Pin the methodology, who they answer to, and what they're accountable for. Recruit for the 70–80%.",
    timePrompt: "“What three things will consume most of this PM's week — and roughly what percentage each?”",
    focusAreas: [
      { id: "delivery", label: "Project Planning & Delivery", icon: "📋", deepDive: {
        intro: "The type and size of projects define the seniority.",
        questions: [
          { id: "project_types", type: "chips", label: "What kinds of projects?",
            options: ["Websites", "Web / mobile apps", "Marketing campaigns", "Platform / systems", "Content / creative"] },
          { id: "concurrent", type: "select", label: "Concurrent projects managed?",
            options: ["1–2", "3–5", "6–10", "10+"] },
          { id: "tools", type: "text", label: "PM tools?", placeholder: "Jira, Asana, Monday, Smartsheet" }
        ],
        tips: [
          { when: a => ["6–10", "10+"].includes(a.concurrent),
            text: "Many concurrent projects means portfolio/juggling skill over deep single-project focus — screen for that explicitly." }
        ] } },
      { id: "agile", label: "Agile / Scrum", icon: "🔄", deepDive: {
        intro: "Agile fluency vs. formal scrum-master duties are different asks.",
        questions: [
          { id: "role", type: "radio", label: "Formal agile role?",
            options: ["Scrum Master", "Product Owner", "Agile PM (hybrid)", "Waterfall / traditional"] },
          { id: "cert", type: "radio", label: "Certification expectation?",
            options: ["Required (CSM/PMP/etc.)", "Preferred", "Not important"] },
          { id: "ceremonies", type: "radio", label: "Do they run ceremonies (standups, retros, planning)?",
            options: ["Yes", "No", "Sometimes"] }
        ],
        tips: [
          { when: a => a.role === "Scrum Master" && a.cert === "Required (CSM/PMP/etc.)",
            text: "A certified Scrum Master requirement narrows the pool — confirm it's a true must-have vs. a nice-to-have." }
        ] } },
      { id: "stakeholders", label: "Stakeholder & Client Mgmt", icon: "🤝", deepDive: {
        intro: "Internal-only vs. external client-facing changes the personality fit.",
        questions: [
          { id: "audience", type: "chips", label: "Who do they manage?",
            options: ["Internal teams", "External clients", "Executive stakeholders", "Cross-functional partners"] },
          { id: "comms", type: "radio", label: "How senior is the audience?",
            options: ["Working teams", "Director level", "VP / C-suite"] }
        ],
        tips: [
          { when: a => (a.audience || []).includes("External clients"),
            text: "Client-facing PMs need account-management polish — agency backgrounds usually fit best." }
        ] } },
      { id: "budget", label: "Budget & Resource Mgmt", icon: "💰", deepDive: {
        intro: "Owning a budget and resourcing is a real accountability jump.",
        questions: [
          { id: "budget_size", type: "select", label: "Budget owned?",
            options: ["None", "Under $250k", "$250k–$1M", "$1M–$5M", "$5M+"] },
          { id: "resourcing", type: "radio", label: "Do they allocate / forecast resources?",
            options: ["Yes", "No", "Partially"] }
        ], tips: [] } },
      { id: "vendors", label: "Vendor / Agency Management", icon: "🏢", deepDive: {
        intro: "Managing external teams is a distinct skill from internal delivery.",
        questions: [
          { id: "manages", type: "radio", label: "Manage external vendors/agencies?",
            options: ["Yes", "No", "Occasionally"] },
          { id: "scope", type: "text", label: "Which vendors / scope?", placeholder: "Dev shops, creative agencies, contractors",
            showIf: a => a.manages === "Yes" }
        ], tips: [] } },
      { id: "launch", label: "QA & Launch Management", icon: "🚀", deepDive: {
        intro: "Owning go-live and risk is where digital PMs earn their keep.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["QA coordination", "UAT", "Go-live / cutover", "Risk / issue management"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Scrum Master", overlapsArea: "agile" },
      { label: "Product Owner", overlapsArea: "agile" },
      { label: "Business Analyst", overlapsArea: null },
      { label: "Account Manager", overlapsArea: "stakeholders" },
      { label: "Developer(s)", overlapsArea: null },
      { label: "Designer(s)", overlapsArea: null }
    ],
    profileRules: [
      { must: ["agile", "delivery"], profile: "Agile Delivery Manager",
        detail: "Target Scrum Master / agile PM titles. Certifications, velocity, and team-health stories are the filters." },
      { must: ["stakeholders", "budget"], profile: "Client-facing / senior PM",
        detail: "Target account-style or senior PM titles. Budget ownership and exec comms are the filters." },
      { must: ["delivery", "vendors"], profile: "Program / vendor-heavy PM",
        detail: "Target program manager titles. Multi-workstream and vendor governance are the filters." }
    ],
    stackCategories: [
      { id: "roadmap", label: "Roadmapping", placeholder: "Aha!, Productboard, Roadmunk…", options: ["Aha!","Productboard","Roadmunk","Jira Advanced Roadmaps"] },
      { id: "docs", label: "Docs / collaboration", placeholder: "Confluence, Notion, Google Workspace…", options: ["Confluence","Notion","Google Workspace","SharePoint"] },
      { id: "design", label: "Design / handoff", placeholder: "Figma, Miro…", options: ["Figma","Miro","Adobe XD"] },
      { id: "analytics", label: "Analytics / reporting", placeholder: "GA4, Looker, Power BI…", options: ["GA4","Looker","Power BI","Tableau"] },
      { id: "resource", label: "Time / resourcing", placeholder: "Harvest, Float, Smartsheet…", options: ["Harvest","Float","Smartsheet","Monday"] }
    ],
    aiUseCases: ["Status reporting", "Meeting summaries", "Risk analysis", "Resource planning",
                 "Documentation", "Timeline / estimate assistance"],
    aiTools: ["ChatGPT / Claude","Microsoft Copilot (M365)","Notion AI","Jira AI / Atlassian Intelligence","AI meeting notes (Otter / Fireflies)"],
    metrics: ["On-time delivery", "On-budget delivery", "Scope adherence", "Team velocity",
              "Stakeholder satisfaction", "Defect / rework rate", "Utilization", "Launch success", "Cycle time"],
    backgrounds: ["Agency", "In-house", "B2B", "B2C", "SaaS", "E-commerce", "Enterprise", "Startup", "Consulting"]
  },

  /* --------------------------------------------------- FRONT END DEV */
  frontend_developer: {
    label: "Front-End Developer",
    icon: "💻",
    tagline: "Framework, UI engineering, performance, and integration",
    about: "Front-end developers build the part of a website or web app that users see and interact with, using JavaScript frameworks like React. They turn designs into fast, responsive, accessible interfaces in the browser.",
    blurb: "“Front-End Developer” ranges from markup-and-styling to full JS engineering with SSR and APIs. Pin the framework, the TypeScript bar, and how close to design vs. backend the role sits. Recruit for the 70–80%.",
    timePrompt: "“Where will this developer spend most of the week — framework work, styling/UI, performance, integration? Roughly what percentage each?”",
    focusAreas: [
      { id: "framework", label: "JS Framework", icon: "⚛️", deepDive: {
        intro: "The framework is the hardest filter on the pool — get specific.",
        questions: [
          { id: "framework", type: "radio", label: "Primary framework?",
            options: ["React", "Vue", "Angular", "Svelte", "Next.js / Remix", "Other / vanilla"] },
          { id: "state", type: "text", label: "State management?", placeholder: "Redux, Zustand, Pinia, Context, RxJS" },
          { id: "years", type: "select", label: "Years in that framework expected?",
            options: ["1–2", "3–4", "5–7", "8+"] }
        ],
        tips: [
          { when: a => a.framework === "Angular",
            text: "Angular pools are smaller and distinct from React — don't assume a React dev cross-applies; confirm it's required." }
        ] } },
      { id: "styling", label: "HTML / CSS & Styling", icon: "🎨", deepDive: {
        intro: "Styling approach signals how design-adjacent the role is.",
        questions: [
          { id: "approach", type: "chips", label: "Styling approach?",
            options: ["CSS / SCSS", "Tailwind", "CSS-in-JS", "CSS Modules", "Component library"] },
          { id: "pixel", type: "radio", label: "Pixel-perfect design implementation expected?",
            options: ["Yes — high fidelity to design", "Reasonable fidelity", "Not a focus"] },
          { id: "responsive", type: "radio", label: "Responsive / cross-browser rigor?",
            options: ["Critical", "Standard", "Low"] }
        ],
        tips: [
          { when: a => a.pixel === "Yes — high fidelity to design",
            text: "Pixel-perfect fidelity means design sensibility matters — favor devs with strong CSS and design-collaboration stories." }
        ] } },
      { id: "typescript", label: "TypeScript", icon: "🟦", deepDive: {
        intro: "The TypeScript bar meaningfully filters the pool.",
        questions: [
          { id: "level", type: "radio", label: "TypeScript expectation?",
            options: ["Required — strong", "Required — basic", "Preferred", "Not used"] }
        ],
        tips: [
          { when: a => a.level === "Required — strong",
            text: "Strong TypeScript is a real filter — screen for typed codebases, generics, and typed API layers, not just '.ts files'." }
        ] } },
      { id: "performance", label: "Performance", icon: "⚡", deepDive: {
        intro: "Performance-critical roles need measurable experience, not vibes.",
        questions: [
          { id: "focus", type: "chips", label: "Performance focus?",
            options: ["Core Web Vitals", "Bundle size", "Lazy loading / code splitting", "Rendering / SSR", "Caching"] },
          { id: "measured", type: "radio", label: "Is performance a measured KPI?",
            options: ["Yes", "No", "Not sure"] }
        ], tips: [] } },
      { id: "accessibility", label: "Accessibility", icon: "♿", deepDive: {
        intro: "A11y can be a compliance requirement or an afterthought.",
        questions: [
          { id: "level", type: "radio", label: "Compliance target?",
            options: ["WCAG 2.1 AA", "Section 508", "Best-effort", "Not a focus"] },
          { id: "activities", type: "chips", label: "What's expected?",
            options: ["Semantic HTML / ARIA", "Automated a11y testing", "Screen-reader testing", "Remediation"] }
        ],
        tips: [
          { when: a => ["WCAG 2.1 AA", "Section 508"].includes(a.level),
            text: "A hard a11y standard is a genuine screening filter — ask for examples of accessible components shipped to it." }
        ] } },
      { id: "testing", label: "Testing", icon: "🧪", deepDive: {
        intro: "Testing expectations separate product engineers from prototypers.",
        questions: [
          { id: "types", type: "chips", label: "Which testing?",
            options: ["Unit", "Integration", "E2E", "Visual regression"] },
          { id: "tools", type: "text", label: "Testing tools?", placeholder: "Jest, Vitest, Cypress, Playwright, Testing Library" }
        ], tips: [] } },
      { id: "integration", label: "API / Backend Integration", icon: "🔌", deepDive: {
        intro: "How far toward the backend the role reaches changes the target profile.",
        questions: [
          { id: "apis", type: "chips", label: "Integration surface?",
            options: ["REST", "GraphQL", "BFF / API layer", "SSR / server components", "WebSockets / real-time"] },
          { id: "fullstack", type: "radio", label: "Any backend / full-stack expectation?",
            options: ["Front-end only", "Light backend (Node/BFF)", "Full-stack"] }
        ],
        tips: [
          { when: a => a.fullstack === "Full-stack",
            text: "Full-stack expectation changes the market entirely — confirm the backend depth and language, and reset budget if needed." }
        ] } },
      { id: "tooling", label: "Build Tooling & CI", icon: "🔧", deepDive: {
        intro: "Ownership of build/CI signals a more senior engineer.",
        questions: [
          { id: "tools", type: "chips", label: "Build / CI in play?",
            options: ["Vite", "Webpack", "Turbopack", "CI/CD pipelines", "Monorepo (Nx/Turborepo)"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Back-End Developer", overlapsArea: "integration" },
      { label: "Full-Stack Developer", overlapsArea: "integration" },
      { label: "UI / UX Designer", overlapsArea: "styling" },
      { label: "DevOps Engineer", overlapsArea: "tooling" },
      { label: "QA Engineer", overlapsArea: "testing" },
      { label: "Tech Lead", overlapsArea: null }
    ],
    profileRules: [
      { must: ["framework", "typescript"], profile: "Modern front-end engineer",
        detail: "Target product-engineer titles in the named framework. Typed codebases and shipped features are the filters." },
      { must: ["performance", "accessibility"], profile: "UX-focused front-end specialist",
        detail: "Target front-end specialists who obsess over CWV and a11y. Measurable perf/a11y wins are the filters." },
      { must: ["framework", "integration"], profile: "Full-stack-leaning front-end",
        detail: "Target devs comfortable across the API boundary. SSR, BFF, and backend collaboration are the filters." }
    ],
    stackCategories: [
      { id: "ci", label: "Version control / CI", placeholder: "GitHub Actions, GitLab CI…", options: ["GitHub Actions","GitLab CI","CircleCI","Azure DevOps"] },
      { id: "hosting", label: "Hosting / cloud", placeholder: "Vercel, Netlify, AWS…", options: ["Vercel","Netlify","AWS","Cloudflare","Azure"] }
    ],
    aiUseCases: ["Code generation / completion", "Code review", "Test generation", "Debugging",
                 "Documentation", "Refactoring"],
    aiTools: ["GitHub Copilot","Cursor","Claude Code","v0","Vercel AI SDK","OpenAI / Anthropic APIs"],
    metrics: ["Core Web Vitals", "Page load / Lighthouse", "Accessibility compliance", "Test coverage",
              "Bug / defect rate", "Sprint velocity", "Uptime", "Bundle size"],
    backgrounds: ["Agency", "Product company", "B2B SaaS", "Consumer apps", "E-commerce",
                  "Fintech", "Enterprise", "Startup"]
  },

  /* --------------------------------------------------- GENAI ARTIST */
  genai_artist: {
    label: "GenAI Artist",
    icon: "🖼️",
    tagline: "Generative image, video, and concept art with AI tooling",
    about: "GenAI artists create images, video, and other visuals using AI tools like Midjourney and Stable Diffusion. The skill is directing the AI — prompting, keeping characters and brand style consistent — then finishing the output with traditional tools like Photoshop.",
    blurb: "“GenAI Artist” spans marketing creative, concept art, product visuals, and full motion — and the tool stack changes the pool completely. Pin the primary tools, whether they train/fine-tune models, and how much traditional craft (Photoshop, compositing, art direction) the role still needs. Recruit for the 70–80%.",
    timePrompt: "“If this artist only had time to be exceptional at three things across generation, editing, and direction, what would they be — and roughly what share of the week does each take?”",
    focusAreas: [
      { id: "image_gen", label: "Image Generation", icon: "🎨", deepDive: {
        intro: "The tool is the single biggest filter — each has a distinct craft and community.",
        questions: [
          { id: "tools", type: "chips", label: "Primary generation tools?",
            options: ["Midjourney", "DALL·E", "Stable Diffusion", "Flux", "Adobe Firefly", "Ideogram", "Other"] },
          { id: "control", type: "chips", label: "Control techniques expected?",
            options: ["ControlNet", "Inpainting / outpainting", "Img2img", "Reference / style transfer", "Regional prompting"] },
          { id: "volume", type: "select", label: "Output volume?",
            options: ["A few hero pieces", "Steady campaign volume", "High-volume production", "Unknown"] }
        ],
        tips: [
          { when: a => (a.tools || []).includes("Stable Diffusion") || (a.tools || []).includes("Flux"),
            text: "Stable Diffusion / Flux signal a hands-on, technical artist (ControlNet, local pipelines) — a different pool from Midjourney-only prompt artists." }
        ] } },
      { id: "prompt_craft", label: "Prompt Craft", icon: "✍️", deepDive: {
        intro: "Prompt fluency separates consistent pros from lucky one-offs.",
        questions: [
          { id: "consistency", type: "radio", label: "Is character / style consistency required?",
            options: ["Yes — recurring characters/brand", "Somewhat", "Not important"] },
          { id: "systems", type: "radio", label: "Prompt libraries / systems maintained?",
            options: ["Yes — documented system", "Informal", "No"] }
        ],
        tips: [
          { when: a => a.consistency === "Yes — recurring characters/brand",
            text: "Consistent characters/brand across generations is genuinely hard — screen for portfolios showing the SAME subject across many scenes, not one-off images." }
        ] } },
      { id: "fine_tuning", label: "Model Training / Fine-Tuning", icon: "🧠", deepDive: {
        intro: "Custom models (LoRAs, embeddings) push this toward a technical specialist.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Training LoRAs", "Textual inversion / embeddings", "Fine-tuning base models", "Dataset curation"] },
          { id: "infra", type: "radio", label: "Local GPU / cloud pipeline expected?",
            options: ["Yes — runs own pipeline", "Uses hosted services", "Not sure"] }
        ],
        tips: [
          { when: (a, s) => areaPriority(s, "fine_tuning") === "must",
            text: "Fine-tuning as a must-have narrows the pool to technically deep artists — expect higher rates and screen for actual trained models, not just usage." }
        ] } },
      { id: "post", label: "Post-Production / Editing", icon: "🖌️", deepDive: {
        intro: "Most production-grade GenAI work still needs real editing chops.",
        questions: [
          { id: "tools", type: "chips", label: "Editing tools?",
            options: ["Photoshop", "After Effects", "Illustrator", "DaVinci / Premiere", "Figma", "Nuke / compositing"] },
          { id: "role", type: "radio", label: "How much manual finishing?",
            options: ["Heavy — AI is a starting point", "Moderate cleanup", "Minimal — mostly raw generations"] }
        ],
        tips: [
          { when: a => a.role === "Minimal — mostly raw generations",
            text: "If raw generations ship as-is, the bar is prompt/curation taste over craft — but confirm the client's quality expectations match that." }
        ] } },
      { id: "video", label: "Video / Motion", icon: "🎬", deepDive: {
        intro: "AI video is a distinct, fast-moving skill set from still images.",
        questions: [
          { id: "tools", type: "chips", label: "Which video tools?",
            options: ["Runway", "Sora", "Pika", "Kling", "Luma", "Veo", "Other"] },
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Short social clips", "Ads / commercials", "Animation", "VFX / compositing"] }
        ],
        tips: [
          { when: (a, s) => areaPriority(s, "video") === "must",
            text: "AI video specialists are scarce and the tooling shifts monthly — screen for a recent reel, not just tool names on a résumé." }
        ] } },
      { id: "art_direction", label: "Art Direction / Brand", icon: "🎯", deepDive: {
        intro: "Directing a look is different from executing prompts.",
        questions: [
          { id: "scope", type: "chips", label: "Direction responsibilities?",
            options: ["Own the visual style", "Maintain brand consistency", "Direct other creatives", "Client / stakeholder pitching"] },
          { id: "seniority", type: "radio", label: "Executor or director?",
            options: ["Hands-on executor", "Player-coach", "Primarily director"] }
        ],
        tips: [
          { when: a => a.seniority === "Primarily director",
            text: "A director-level hire needs a traditional art/creative-direction background plus AI fluency — a rarer, more expensive profile." }
        ] } },
      { id: "threed", label: "3D / Asset Generation", icon: "🧊", deepDive: {
        intro: "3D and game-asset generation is an emerging niche.",
        questions: [
          { id: "tools", type: "chips", label: "3D / asset tools?",
            options: ["Meshy", "Luma / Genie", "Blender", "Spline", "Texture generation", "Other"] },
          { id: "pipeline", type: "text", label: "Where do assets go?", placeholder: "Game engine, product viz, AR/VR, print…" }
        ], tips: [] } },
      { id: "ethics", label: "Rights, Licensing & Ethics", icon: "⚖️", deepDive: {
        intro: "Commercial GenAI work lives or dies on usage rights.",
        questions: [
          { id: "concerns", type: "chips", label: "What matters here?",
            options: ["Commercial-safe models", "Copyright / IP clearance", "Likeness / consent", "Disclosure requirements"] },
          { id: "commercial", type: "radio", label: "Is the output used commercially?",
            options: ["Yes — public campaigns", "Internal only", "Not sure"] }
        ],
        tips: [
          { when: a => a.commercial === "Yes — public campaigns",
            text: "Public commercial use means IP-safe tooling (e.g., Firefly) and clearance awareness are real requirements — screen for it." }
        ] } }
    ],
    specialists: [
      { label: "Graphic / Visual Designer", overlapsArea: "post" },
      { label: "Motion Designer", overlapsArea: "video" },
      { label: "Art Director", overlapsArea: "art_direction" },
      { label: "3D Artist", overlapsArea: "threed" },
      { label: "ML / AI Engineer", overlapsArea: "fine_tuning" },
      { label: "Brand / Creative Team", overlapsArea: null }
    ],
    profileRules: [
      { must: ["image_gen", "post"], profile: "Production GenAI artist",
        detail: "Target designers/illustrators who pair AI generation with real editing craft. Portfolio = finished, shipped creative, not raw grids." },
      { must: ["fine_tuning", "threed"], profile: "Technical GenAI artist",
        detail: "Target artists who train models and build pipelines. LoRAs, ControlNet, and custom workflows are the filters." },
      { must: ["art_direction", "image_gen"], profile: "AI-fluent art director",
        detail: "Target art directors who've adopted AI. Style ownership and brand consistency are the filters." }
    ],
    stackCategories: [
      { id: "workflow", label: "Workflow / pipeline", placeholder: "ComfyUI, Automatic1111, APIs…", options: ["ComfyUI","Automatic1111","APIs / scripting","Photoshop plugins"] },
      { id: "collab", label: "Collaboration / DAM", placeholder: "Figma, Frame.io, Notion…", options: ["Figma","Frame.io","Notion","Google Drive","Air"] }
    ],
    aiUseCases: ["Concept / ideation", "Campaign creative", "Product / marketing visuals", "Storyboards",
                 "Style exploration", "Video generation", "Asset variations", "Personalized creative"],
    aiTools: ["Midjourney","Stable Diffusion / Flux","Runway / Sora","ComfyUI","Adobe Firefly","ElevenLabs","Custom LoRAs / fine-tuning"],
    metrics: ["Output volume", "Turnaround time", "Creative approval rate", "Brand consistency",
              "Campaign performance", "Cost per asset", "Stakeholder satisfaction"],
    backgrounds: ["Agency", "Brand / in-house creative", "Entertainment / media", "Gaming",
                  "E-commerce", "Advertising", "Startup", "Design studio"]
  },

  /* ----------------------------------------------------- VIBE CODER */
  vibe_coder: {
    label: "Vibe Coder",
    icon: "🛠️",
    tagline: "AI-native builder shipping fast with agentic coding tools",
    about: "A vibe coder builds software by directing AI coding tools (Cursor, Claude Code, v0) rather than hand-writing most of the code — turning ideas into working apps extremely fast. The best pair strong product instincts with enough engineering judgment to keep the AI's output solid.",
    blurb: "A “Vibe Coder” builds and ships with AI coding tools (Cursor, Claude Code, v0, Lovable, Replit) far faster than a traditional dev — but the depth ranges from polished prototyper to production engineer. Pin how far the output has to go (throwaway demo vs. production) and how much real engineering judgment the role needs. Recruit for the 70–80%.",
    timePrompt: "“What will this builder actually spend the week doing — prototyping, shipping features, product/design, wiring integrations? Roughly what percentage each?”",
    focusAreas: [
      { id: "ai_tools", label: "AI Coding Tools", icon: "🤖", deepDive: {
        intro: "Tool fluency is the defining trait — get specific about the stack.",
        questions: [
          { id: "tools", type: "chips", label: "Which AI build tools?",
            options: ["Cursor", "Claude Code", "GitHub Copilot", "v0", "Lovable", "Replit / Agent", "Bolt", "Windsurf"] },
          { id: "agentic", type: "radio", label: "Agentic / autonomous coding depth?",
            options: ["Drives multi-file agentic work", "Assisted / inline completions", "Light usage"] }
        ],
        tips: [
          { when: a => a.agentic === "Drives multi-file agentic work",
            text: "Driving agentic tools well is its own skill — screen for how they scope, review, and correct AI output, not just which tools they name." }
        ] } },
      { id: "prototyping", label: "Rapid Prototyping / MVPs", icon: "⚡", deepDive: {
        intro: "Speed-to-demo is the whole point — clarify what 'done' means.",
        questions: [
          { id: "output", type: "radio", label: "What does the output need to be?",
            options: ["Throwaway demos / mockups", "Working MVPs", "Production features"] },
          { id: "cadence", type: "text", label: "Expected shipping cadence?", placeholder: "e.g., a prototype a week, feature every few days" }
        ],
        tips: [
          { when: a => a.output === "Production features",
            text: "If AI-built code must hit production, you need real engineering judgment on top of vibe-coding speed — screen for testing, review, and debugging discipline." }
        ] } },
      { id: "product", label: "Product & Design Sense", icon: "✨", deepDive: {
        intro: "Great vibe coders are often product people who can build.",
        questions: [
          { id: "scope", type: "chips", label: "Product responsibilities?",
            options: ["Define what to build", "UI / UX decisions", "User feedback loops", "Prioritization"] },
          { id: "design", type: "radio", label: "Design ownership?",
            options: ["Owns look & feel", "Works from designs", "Not a focus"] }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Define what to build"),
            text: "If they decide WHAT to build, this is a product-engineer / founder-type profile — target builders with 0→1 and side-project track records." }
        ] } },
      { id: "fullstack", label: "Full-Stack Fundamentals", icon: "🧱", deepDive: {
        intro: "AI accelerates output, but fundamentals decide whether it holds up.",
        questions: [
          { id: "stack", type: "text", label: "Typical stack?", placeholder: "Next.js, React, Node, Supabase, Postgres…" },
          { id: "depth", type: "radio", label: "How deep must the fundamentals go?",
            options: ["Strong CS/engineering fundamentals", "Solid working knowledge", "Can rely on AI for most of it"] }
        ],
        tips: [
          { when: a => a.depth === "Can rely on AI for most of it",
            text: "Leaning on AI for fundamentals is fine for prototypes but risky for anything users depend on — make sure the client's risk tolerance matches." }
        ] } },
      { id: "shipping", label: "Deployment & Shipping", icon: "🚀", deepDive: {
        intro: "Getting it live is part of the job for AI-native builders.",
        questions: [
          { id: "platforms", type: "chips", label: "Deploy / hosting?",
            options: ["Vercel", "Netlify", "Replit", "Supabase", "Cloudflare", "AWS / GCP", "Other"] },
          { id: "ops", type: "radio", label: "Own their own deploys / infra?",
            options: ["Yes — end to end", "With support", "No"] }
        ], tips: [] } },
      { id: "integration", label: "APIs & Integrations", icon: "🔌", deepDive: {
        intro: "Most AI-built apps are glue between APIs and LLMs.",
        questions: [
          { id: "surface", type: "chips", label: "What do they wire together?",
            options: ["Third-party APIs", "LLM / AI APIs", "Auth / payments", "Databases", "Automation (Zapier/n8n)"] },
          { id: "ai_features", type: "radio", label: "Building AI features into the product?",
            options: ["Yes — core to the product", "Some", "No"] }
        ],
        tips: [
          { when: a => a.ai_features === "Yes — core to the product",
            text: "Building AI INTO the product (prompts, RAG, agents) is distinct from using AI to code — confirm which the client actually needs." }
        ] } },
      { id: "iteration", label: "Debugging & Iteration", icon: "🔁", deepDive: {
        intro: "Reviewing and fixing AI output is where quality is won or lost.",
        questions: [
          { id: "practices", type: "chips", label: "Quality practices expected?",
            options: ["Code review of AI output", "Testing", "Version control discipline", "Refactoring"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Software Engineer", overlapsArea: "fullstack" },
      { label: "Product Manager", overlapsArea: "product" },
      { label: "Designer", overlapsArea: "product" },
      { label: "DevOps / Platform", overlapsArea: "shipping" },
      { label: "AI Engineer", overlapsArea: "integration" },
      { label: "Founder / Technical Lead", overlapsArea: null }
    ],
    profileRules: [
      { must: ["ai_tools", "product"], profile: "AI-native product builder",
        detail: "Target 0→1 builders and technical founders. Shipped side projects and live demos matter more than a traditional résumé." },
      { must: ["fullstack", "shipping"], profile: "AI-accelerated full-stack engineer",
        detail: "Target engineers who've adopted agentic tools. Real fundamentals plus AI speed are the filters." },
      { must: ["integration", "prototyping"], profile: "Prototyper / hacker",
        detail: "Target fast builders who wire APIs and LLMs into working demos. A portfolio of live projects is the filter." }
    ],
    stackCategories: [
      { id: "ai", label: "AI / LLM APIs", placeholder: "Anthropic, OpenAI, LangChain…", options: ["Anthropic / Claude","OpenAI","Google Gemini","LangChain","Vercel AI SDK"] },
      { id: "automation", label: "Automation / glue", placeholder: "Zapier, n8n, Make…", options: ["Zapier","n8n","Make","Retool","Airtable"] }
    ],
    aiUseCases: ["Building the app itself", "Prototyping features", "Debugging", "Refactoring",
                 "Writing tests", "Wiring integrations", "Generating UI", "Product ideation"],
    aiTools: ["Cursor","Claude Code","GitHub Copilot","v0 / Lovable","Replit Agent","Anthropic / OpenAI APIs","LangChain"],
    metrics: ["Shipping velocity", "Time to prototype", "Features shipped", "Product outcomes",
              "User adoption", "Iteration speed", "Uptime / reliability"],
    backgrounds: ["Startup", "Founder / indie hacker", "Product company", "Agency",
                  "Freelance", "Big tech", "Bootcamp / self-taught"]
  },

  /* ---------------------------------------- CHATBOT DEVELOPER/DESIGNER */
  chatbot_developer: {
    label: "Chatbot Developer / Designer",
    icon: "💬",
    tagline: "Conversational AI, assistants, and LLM-powered agents",
    about: "Chatbot developers and designers build conversational AI — customer-service bots, virtual assistants, and voice agents. Today that usually means LLM-powered assistants connected to company knowledge and systems; the design side crafts the conversation flows and personality.",
    blurb: "This role swings from conversation design (the words and flows) to engineering (NLU, LLMs, integrations) — and a modern “chatbot” usually means an LLM agent, not an intent tree. Pin whether the client needs a designer, an engineer, or a hybrid, and whether it's classic NLU or GenAI. Recruit for the 70–80%.",
    timePrompt: "“Between conversation design, AI/NLU engineering, integrations, and optimization — what three things carry the week, and roughly what percentage each?”",
    focusAreas: [
      { id: "convo_design", label: "Conversation Design", icon: "🗨️", deepDive: {
        intro: "Designing the dialogue is a craft distinct from building it.",
        questions: [
          { id: "scope", type: "chips", label: "Design responsibilities?",
            options: ["Dialogue flows", "Persona / tone", "Error / fallback handling", "Multilingual", "Voice + chat"] },
          { id: "dedicated", type: "radio", label: "Dedicated designer or design + build?",
            options: ["Dedicated conversation designer", "Designs and builds", "Mostly builds"] }
        ],
        tips: [
          { when: a => a.dedicated === "Dedicated conversation designer",
            text: "A pure conversation designer is a UX-adjacent profile (writing, linguistics, UX) — a different pool from bot engineers." }
        ] } },
      { id: "llm", label: "LLM / GenAI", icon: "🧠", deepDive: {
        intro: "Most new builds are LLM-based — pin the depth of GenAI engineering.",
        questions: [
          { id: "approach", type: "chips", label: "GenAI techniques in scope?",
            options: ["Prompt engineering", "RAG / knowledge base", "Function calling / tools", "Agents / multi-step", "Fine-tuning"] },
          { id: "models", type: "text", label: "Which models / providers?", placeholder: "Claude, GPT, Gemini, open models…" },
          { id: "eval", type: "radio", label: "Evaluation / quality process expected?",
            options: ["Yes — formal evals", "Informal / spot checks", "Not defined"] }
        ],
        tips: [
          { when: a => (a.approach || []).includes("RAG / knowledge base") || (a.approach || []).includes("Agents / multi-step"),
            text: "RAG and agentic flows are real AI-engineering work — screen for shipped LLM apps with retrieval/tools, not just prompt tinkering." }
        ] } },
      { id: "nlu", label: "NLU / Intent Platforms", icon: "🎯", deepDive: {
        intro: "Classic intent-based platforms are a different skill from LLMs.",
        questions: [
          { id: "platform", type: "chips", label: "Which platforms?",
            options: ["Dialogflow", "Rasa", "Microsoft Bot Framework", "Amazon Lex", "IBM watsonx", "Kore.ai", "Other"] },
          { id: "hybrid", type: "radio", label: "Classic NLU, LLM, or hybrid?",
            options: ["Classic intent/NLU", "LLM-based", "Hybrid"] }
        ],
        tips: [
          { when: a => (a.platform || []).includes("Rasa"),
            text: "Rasa signals a code-first, self-hosted NLU build — a narrower, more engineering-heavy pool than low-code platforms." }
        ] } },
      { id: "channels", label: "Channels & Platforms", icon: "📱", deepDive: {
        intro: "Where the bot lives shapes the integration and design work.",
        questions: [
          { id: "channels", type: "chips", label: "Which channels?",
            options: ["Web chat", "WhatsApp / SMS", "Slack / Teams", "Voice / IVR", "Mobile app", "Social DMs"] },
          { id: "voice", type: "radio", label: "Voice in scope?",
            options: ["Yes — voice / IVR", "No — text only", "Both"] }
        ],
        tips: [
          { when: a => a.voice === "Yes — voice / IVR" || (a.channels || []).includes("Voice / IVR"),
            text: "Voice adds speech (ASR/TTS), latency, and barge-in concerns — a meaningfully different and smaller skill pool than text bots." }
        ] } },
      { id: "integration", label: "Backend & Integrations", icon: "🔌", deepDive: {
        intro: "A useful bot is wired into real systems.",
        questions: [
          { id: "systems", type: "chips", label: "Integrations expected?",
            options: ["CRM", "Ticketing / helpdesk", "Databases / APIs", "Auth", "Payments", "Live-agent handoff"] },
          { id: "lang", type: "text", label: "Backend language / stack?", placeholder: "Python, Node, etc." }
        ], tips: [] } },
      { id: "analytics", label: "Analytics & Optimization", icon: "📊", deepDive: {
        intro: "Post-launch tuning is where containment and CSAT are won.",
        questions: [
          { id: "scope", type: "chips", label: "What's tracked / improved?",
            options: ["Containment / deflection", "Intent accuracy", "CSAT", "Drop-off analysis", "A/B testing"] },
          { id: "tools", type: "text", label: "Analytics tools?", placeholder: "Platform native, Botanalytics, Dashbot…" }
        ], tips: [] } },
      { id: "safety", label: "Guardrails & Safety", icon: "🛡️", deepDive: {
        intro: "LLM bots need guardrails against hallucination and misuse.",
        questions: [
          { id: "concerns", type: "chips", label: "What's required?",
            options: ["Hallucination controls", "PII / privacy", "Content moderation", "Compliance (HIPAA/finance)", "Prompt-injection defense"] }
        ],
        tips: [
          { when: a => (a.concerns || []).includes("Compliance (HIPAA/finance)"),
            text: "Regulated-domain bots (health/finance) demand compliance experience — a real screening filter that narrows the pool." }
        ] } }
    ],
    specialists: [
      { label: "Conversation Designer", overlapsArea: "convo_design" },
      { label: "AI / ML Engineer", overlapsArea: "llm" },
      { label: "NLU Engineer", overlapsArea: "nlu" },
      { label: "Backend Developer", overlapsArea: "integration" },
      { label: "UX Writer", overlapsArea: "convo_design" },
      { label: "Data Analyst", overlapsArea: "analytics" }
    ],
    profileRules: [
      { must: ["llm", "integration"], profile: "Conversational AI engineer",
        detail: "Target engineers who've shipped LLM assistants with RAG/tools and real integrations. Production GenAI apps are the filter." },
      { must: ["convo_design", "channels"], profile: "Conversation designer",
        detail: "Target conversation-design / UX-writing titles. Flow design, persona, and dialogue samples are the filters." },
      { must: ["nlu", "analytics"], profile: "Bot platform developer",
        detail: "Target Dialogflow/Rasa/Lex builders. Intent modeling and an optimization track record are the filters." }
    ],
    stackCategories: [
      { id: "data", label: "Data / vector store", placeholder: "Pinecone, pgvector, Elastic…", options: ["Pinecone","pgvector","Elasticsearch","Weaviate","Redis"] },
    ],
    aiUseCases: ["The bot itself (core product)", "Intent generation", "Response drafting", "Test conversation generation",
                 "Summarizing transcripts", "Knowledge-base retrieval", "Sentiment analysis"],
    aiTools: ["Claude / Anthropic API","OpenAI API","LangChain / LangGraph","RAG / vector DBs","Voice AI (ElevenLabs / Vapi)","Evals / guardrails tooling"],
    metrics: ["Containment / deflection rate", "CSAT", "Intent accuracy", "Resolution rate",
              "Fallback rate", "Handoff rate", "Engagement", "Response latency"],
    backgrounds: ["SaaS", "Customer support / CX", "Enterprise", "Healthcare", "Financial Services",
                  "E-commerce", "Agency", "Startup"]
  },

  /* ------------------------------------------ VR / AR DESIGNER/DEVELOPER */
  vr_ar_developer: {
    label: "VR / AR Designer / Developer",
    icon: "🥽",
    tagline: "Immersive, spatial, and mixed-reality experiences",
    about: "VR/AR developers and designers build immersive experiences for headsets like Meta Quest and Apple Vision Pro, and phone-based augmented reality — games, training simulations, product visualization. Most build in Unity or Unreal; designers focus on spatial UX.",
    blurb: "Immersive roles split between design (spatial UX, interaction) and development (Unity/Unreal engineering), across very different hardware (Quest, Vision Pro, mobile AR, HoloLens). Pin the engine, the target device, and whether this is a designer, a developer, or a hybrid. Recruit for the 70–80%.",
    timePrompt: "“Across engine work, interaction/spatial design, 3D assets, and optimization — what three things carry most of the week, and roughly what percentage each?”",
    focusAreas: [
      { id: "engine", label: "Engine / Development", icon: "🎮", deepDive: {
        intro: "The engine is the hardest filter on the pool.",
        questions: [
          { id: "engine", type: "radio", label: "Primary engine?",
            options: ["Unity", "Unreal", "WebXR (three.js/Babylon)", "Native (RealityKit/ARKit)", "Other"] },
          { id: "lang", type: "text", label: "Language?", placeholder: "C#, C++, JavaScript, Swift…" },
          { id: "years", type: "select", label: "Years in that engine expected?",
            options: ["1–2", "3–4", "5–7", "8+"] }
        ],
        tips: [
          { when: a => a.engine === "Unreal",
            text: "Unreal (C++/Blueprints) is a distinct, smaller pool from Unity (C#) — don't assume crossover; confirm which is truly required." }
        ] } },
      { id: "interaction", label: "Interaction & Spatial Design", icon: "🖐️", deepDive: {
        intro: "Spatial UX is a newer design discipline — clarify the depth.",
        questions: [
          { id: "scope", type: "chips", label: "Design responsibilities?",
            options: ["Spatial UI / UX", "Hand / controller interaction", "Gaze / voice input", "Locomotion", "Onboarding / tutorials"] },
          { id: "dedicated", type: "radio", label: "Dedicated designer or design + build?",
            options: ["Dedicated XR designer", "Designs and builds", "Mostly builds"] }
        ],
        tips: [
          { when: a => a.dedicated === "Dedicated XR designer",
            text: "A dedicated immersive/spatial designer is rare — target XR/product designers with shipped headset UX, a different pool from engine developers." }
        ] } },
      { id: "platform", label: "Platform / Hardware", icon: "📟", deepDive: {
        intro: "Target hardware drives SDKs, constraints, and the pool.",
        questions: [
          { id: "devices", type: "chips", label: "Target devices?",
            options: ["Meta Quest", "Apple Vision Pro", "HoloLens", "Mobile AR (ARKit/ARCore)", "PCVR / SteamVR", "PlayStation VR"] },
          { id: "type", type: "radio", label: "Primary modality?",
            options: ["VR (fully immersive)", "AR (overlay)", "MR / passthrough", "Mix"] }
        ],
        tips: [
          { when: a => (a.devices || []).includes("Apple Vision Pro"),
            text: "Vision Pro work (visionOS / RealityKit / Swift) is a young, small talent pool — expect scarcity and reset timeline expectations." }
        ] } },
      { id: "assets", label: "3D Modeling & Assets", icon: "🧊", deepDive: {
        intro: "Who makes the 3D content changes the profile.",
        questions: [
          { id: "tools", type: "chips", label: "3D / asset tools?",
            options: ["Blender", "Maya", "3ds Max", "Substance", "Photogrammetry / scanning", "AI 3D gen"] },
          { id: "responsibility", type: "radio", label: "Do they create assets or integrate them?",
            options: ["Creates 3D assets", "Integrates existing assets", "Both"] }
        ],
        tips: [
          { when: a => a.responsibility === "Creates 3D assets",
            text: "Expecting one person to both engineer AND model 3D is a rare combo — confirm it's required vs. splitting the work." }
        ] } },
      { id: "performance", label: "Performance & Optimization", icon: "⚡", deepDive: {
        intro: "Headset performance (framerate, comfort) is make-or-break.",
        questions: [
          { id: "focus", type: "chips", label: "Optimization focus?",
            options: ["Frame rate / draw calls", "Poly / texture budgets", "Thermal / battery", "Foveated rendering", "Occlusion / LODs"] },
          { id: "target", type: "text", label: "Performance target?", placeholder: "e.g., 72/90/120 fps on Quest" }
        ],
        tips: [
          { when: (a, s) => areaPriority(s, "performance") === "must",
            text: "Standalone-headset performance work is specialized — screen for shipped experiences that held target framerate, not just PCVR demos." }
        ] } },
      { id: "comfort", label: "UX Comfort & Accessibility", icon: "🌀", deepDive: {
        intro: "Motion sickness and comfort are unique XR concerns.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Motion-sickness mitigation", "Comfort options", "Accessibility", "Ergonomics / session length"] }
        ], tips: [] } },
      { id: "prototyping", label: "Prototyping", icon: "🧩", deepDive: {
        intro: "Rapid immersive prototyping is a valued, distinct skill.",
        questions: [
          { id: "tools", type: "chips", label: "Prototyping tools?",
            options: ["ShapesXR", "Bezi", "Figma + XR plugins", "In-engine grayboxing", "Gravity Sketch"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Unity / Unreal Developer", overlapsArea: "engine" },
      { label: "3D Artist", overlapsArea: "assets" },
      { label: "XR / Spatial Designer", overlapsArea: "interaction" },
      { label: "Technical Artist", overlapsArea: "performance" },
      { label: "Product Manager", overlapsArea: null },
      { label: "QA (device testing)", overlapsArea: null }
    ],
    profileRules: [
      { must: ["engine", "performance"], profile: "XR / immersive developer",
        detail: "Target Unity/Unreal engineers with shipped headset apps. Engine depth and on-device performance are the filters." },
      { must: ["interaction", "comfort"], profile: "XR / spatial designer",
        detail: "Target immersive designers. Spatial UX, interaction patterns, and comfort-aware design are the filters." },
      { must: ["engine", "assets"], profile: "Technical artist / generalist",
        detail: "Target XR generalists who both build and model. Shipped end-to-end experiences are the filter." }
    ],
    stackCategories: [
      { id: "sdk", label: "XR SDKs", placeholder: "OpenXR, ARKit, ARCore, MRTK…", options: ["OpenXR","ARKit","ARCore","MRTK","XR Interaction Toolkit","Meta XR SDK"] },
    ],
    aiUseCases: ["3D asset generation", "Code generation", "Environment / scene generation",
                 "NPC / interaction logic", "Texture generation", "Prototyping"],
    aiTools: ["AI 3D generation (Meshy / Luma)","Unity Muse / Sentis","GitHub Copilot","NPC / dialogue AI (Inworld / Convai)","Texture generation","OpenAI / Anthropic APIs"],
    metrics: ["Frame rate / performance", "Comfort / sickness scores", "Session length", "User engagement",
              "Crash / stability rate", "Load times", "Task completion"],
    backgrounds: ["Gaming / game studio", "Entertainment / media", "Enterprise / training",
                  "Healthcare / simulation", "Product company", "Agency", "Startup", "Defense / aerospace"]
  }
};

/* Order roles appear in the picker */
const ROLE_ORDER = [
  "digital_marketing_manager",
  "ux_designer",
  "marketing_automation",
  "digital_pm",
  "frontend_developer",
  "genai_artist",
  "vibe_coder",
  "chatbot_developer",
  "vr_ar_developer"
];


  /* Digital catalog had no APP_BRAND (brand was hardcoded); define it here. */
  const APP_BRAND = { title: "Digital &amp; Marketing", subtitle: "Job Order Intake" };

  window.FORMS.digital = {
    id: "digital",
    label: "Digital",
    business: "tts",
    brand: APP_BRAND,
    common: COMMON,
    roles: ROLES,
    roleOrder: ROLE_ORDER
  };
})();
