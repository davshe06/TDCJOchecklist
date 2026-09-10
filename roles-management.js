/* Management Resources (PTS) role catalog — registers into the FORMS registry. */
(function () {
  window.FORMS = window.FORMS || {};

/* =========================================================================
   Management Resources Job Order Intake — Role Configurations
   ---------------------------------------------------------------------------
   Senior-level finance, accounting, and business-advisory consulting roles.
   Step 1 selects a ROLE; everything downstream (focus areas, drill-downs,
   systems, success metrics, candidate backgrounds, and the recruiter
   targeting profile) is driven by the selected role's config below.

   To add a role: add an entry to ROLES and list its id in ROLE_ORDER.
   app.js is a generic engine and needs no changes.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Management Resources capability matrix — the four strategic pillars and the
   capabilities under each. Captured on the intake so the engagement maps to
   how the practice positions itself with CFO / CAO / CAE / CTO / CHRO / CPO /
   COO buyers.
   ------------------------------------------------------------------------- */

const PILLAR_BAU = "Accounting, Finance, Tax, Treasury & Audit";
const PILLAR_TRANSFORM = "Finance Transformation";
const PILLAR_DATA = "Data, Systems & ERP";
const PILLAR_PERF = "Performance Optimization & Business Analytics";

const CAPABILITY_PILLARS = [PILLAR_BAU, PILLAR_TRANSFORM, PILLAR_DATA, PILLAR_PERF];

const CAP_BAU = ["Fractional CFO / Controllership", "Consolidations & Month-End Close", "Technical Accounting",
                 "Audit & Tax", "SOX", "IFRS", "Compliance", "Remediation & Controls",
                 "IPO Readiness", "Financial Restatements", "Treasury & Cash Management"];
const CAP_TRANSFORM = ["Order to Cash (O2C)", "Procure to Pay (P2P)", "Record to Report (R2R)",
                       "Shared Services Optimization", "Accounting Close Acceleration",
                       "M&A Integration & Carve-Outs", "Process Improvement"];
const CAP_DATA = ["Data Readiness for AI", "Data Integration & Migration",
                  "EPM Tools: Reporting, Forecasting & BI", "Project Management", "Change Management"];
const CAP_PERF = ["FP&A & Data Analytics", "Pricing, Predictive Modeling & Scenario Analysis",
                  "Supply Chain & Procurement"];

const EXEC_SPONSORS = ["CFO", "CAO", "CAE", "CTO", "CHRO", "CPO", "COO",
                       "VP Finance", "Controller", "Audit Committee", "Other"];

const COMMON = {
  basics: {
    title: "Basic Information",
    subtitle: "Tell us about this engagement.",
    coach: "Best practice: run a full intake with your perm team and solutions partner. Introduce Perm as an option on every JO, as well as FTEP.",
    questions: [
      { id: "client_company", type: "text", label: "Client company", placeholder: "Acme Corp" },
      { id: "company_website", type: "text", label: "Company website", placeholder: "https://www.client.com" },
      { id: "client_contact", type: "text", label: "Client contact(s) on the call", placeholder: "Name, title" },
      { id: "exec_sponsor", type: "chips", label: "Which executive does this engagement serve?", options: EXEC_SPONSORS },
      { id: "job_title", type: "text", label: "Exact title on the req", placeholder: "e.g., Interim Controller" },
      { id: "why_hiring", type: "textarea", label: "Why are you hiring? What business problem are you trying to solve?",
        placeholder: "The driver — a close that's slipping, an audit, a system implementation, a leave of absence, growth…" },
      /* MR capability matrix: pillar first, then the specific capabilities under
         each selected pillar (each list only appears once its pillar is chosen) */
      { id: "capability_pillar", type: "chips", label: "Which Management Resources capability areas does this engagement cover?",
        options: CAPABILITY_PILLARS },
      { id: "cap_bau", type: "chips", label: "Accounting, Finance, Tax, Treasury & Audit — which capabilities?",
        options: CAP_BAU, showIf: a => (a.capability_pillar || []).includes(PILLAR_BAU) },
      { id: "cap_transform", type: "chips", label: "Finance Transformation — which capabilities?",
        options: CAP_TRANSFORM, showIf: a => (a.capability_pillar || []).includes(PILLAR_TRANSFORM) },
      { id: "cap_data", type: "chips", label: "Data, Systems & ERP — which capabilities?",
        options: CAP_DATA, showIf: a => (a.capability_pillar || []).includes(PILLAR_DATA) },
      { id: "cap_perf", type: "chips", label: "Performance Optimization & Business Analytics — which capabilities?",
        options: CAP_PERF, showIf: a => (a.capability_pillar || []).includes(PILLAR_PERF) },
      { id: "replacement_or_new", type: "radio", label: "Replacement or new position?",
        options: ["Replacement", "New position", "Project / interim coverage"] },
      { id: "replacement_why", type: "textarea", label: "What happened with the previous person?",
        placeholder: "Why did they leave? What would the client change about the profile?",
        showIf: a => a.replacement_or_new === "Replacement" },
      { id: "project_driver", type: "chips", label: "What's driving the project?",
        options: ["Leave of absence", "Vacancy / gap coverage", "System implementation", "Audit / remediation",
                  "M&A or divestiture", "Month-end / close support", "Restructuring", "Growth / scaling", "IPO / readiness"],
        showIf: a => a.replacement_or_new === "Project / interim coverage" },
      { id: "open_how_long", type: "select", label: "How long has the position been open?",
        options: ["Brand new", "Under 2 weeks", "2–4 weeks", "1–3 months", "3+ months"] },
      { id: "how_else_filling", type: "textarea", label: "How else are you filling it? Other firms?",
        placeholder: "Internal recruiters, competing firms, Big 4, referrals…" },
      { id: "strategic_vs_hands_on", type: "radio", label: "How strategic vs. hands-on is this role?",
        options: ["Mostly strategic / advisory", "Balanced", "Mostly hands-on / in the details"] },
      { id: "engagement_type", type: "chips", label: "Engagement type discussed",
        options: ["Consulting / interim", "Contract-to-hire", "Direct hire (Perm)", "FTEP", "Project-based (SOW)"] }
    ],
    tips: [
      { when: a => a.open_how_long === "3+ months",
        text: "Open 3+ months — dig into why. Unrealistic requirements, a low rate, or a slow decision process usually explains it. This is your chance to reset expectations." },
      { when: a => (a.how_else_filling || "").toLowerCase().includes("big 4") || (a.how_else_filling || "").toLowerCase().includes("firm"),
        text: "Competing firms in play — ask about exclusivity, how many profiles they've seen, and why nobody has been engaged yet." },
      { when: a => a.strategic_vs_hands_on === "Mostly hands-on / in the details",
        text: "Hands-on roles need candidates who are still in the weeds — confirm they'll be doing the work, not directing it, so you don't send an over-titled profile." },
      { when: a => (a.capability_pillar || []).length >= 3,
        text: "Three or more capability pillars in one engagement is a scope flag — either this is a program needing multiple consultants, or the client hasn't defined the work. Push them to name the primary deliverable." },
      { when: a => (a.cap_bau || []).includes("IPO Readiness") || (a.cap_bau || []).includes("Financial Restatements"),
        text: "IPO readiness and restatements are high-stakes, deadline-driven work — target consultants with public-company and SEC reporting experience, and set premium rate expectations." },
      { when: a => (a.cap_data || []).includes("Data Readiness for AI"),
        text: "Data readiness for AI is a newer MR capability — position it as governance, data quality, and integration work, not model building, so the client scopes it correctly." },
      { when: a => (a.cap_transform || []).includes("M&A Integration & Carve-Outs"),
        text: "Carve-outs and integrations run on deal timelines that don't move — confirm the close date and staffing ramp before committing." },
      { when: a => (a.exec_sponsor || []).includes("CAE") || (a.exec_sponsor || []).includes("Audit Committee"),
        text: "A CAE or audit-committee sponsor means independence and credentials matter — expect certification requirements and a more formal reporting line." },
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
      { id: "working_hours", type: "text", label: "Working hours", placeholder: "e.g., 8–5 CT; heavier during close" },
      { id: "close_crunch", type: "radio", label: "Extra hours expected during close / busy season?",
        options: ["Yes — significant", "Some", "No"] },
      { id: "start_date", type: "text", label: "Clear start date", placeholder: "e.g., ASAP, first week of August" },
      { id: "assignment_length", type: "text", label: "Length of assignment", placeholder: "e.g., 3 months, 6 months, through year-end" },
      { id: "extension_likely", type: "radio", label: "Likelihood of extension or conversion?",
        options: ["Likely to extend", "Likely to convert to perm", "Hard end date", "Not sure"] },
      { id: "budget", type: "text", label: "Budget (bill rate / salary range)", placeholder: "e.g., $75–95/hr, $130–150k" },
      { id: "conversion_fees", type: "text", label: "Conversion fees discussed?", placeholder: "Terms, timing, fee schedule" },
      { id: "bill_to", type: "text", label: "Bill to", placeholder: "Billing contact / entity / PO requirements" }
    ],
    tips: [
      { when: a => a.work_model === "Remote",
        text: "Fully remote widens the pool but also the competition — confirm any time-zone or state restrictions, and whether system access allows it." },
      { when: a => !(a.budget || "").trim() && !!a.work_model,
        text: "No budget yet — don't leave the call without a number or range. Everything downstream depends on it." },
      { when: a => a.close_crunch === "Yes — significant",
        text: "Heavy close/busy-season hours — set that expectation with candidates up front. It's a common reason consultants drop mid-engagement." }
    ]
  },
  team: {
    title: "Team Structure",
    subtitle: "How is the finance organization set up?",
    questions: [
      { id: "reports_to", type: "text", label: "Who does this person report to?", placeholder: "Title and name (e.g., CFO, VP Finance)" },
      { id: "team_size", type: "text", label: "How big is the finance / accounting team?", placeholder: "e.g., 12" },
      { id: "direct_reports", type: "radio", label: "Will this person manage anyone?",
        options: ["Yes", "No", "Not sure"] },
      { id: "direct_reports_who", type: "text", label: "Who will they manage?", placeholder: "Roles / count",
        showIf: a => a.direct_reports === "Yes" },
      /* specialists chip options injected from role.specialists */
      { id: "specialists", type: "chips", label: "What roles already exist on the team?", options: [] },
      { id: "generalist_or_specialist", type: "radio", label: "Is this role a specialist or a generalist?",
        options: ["Specialist", "Generalist / wears many hats", "Somewhere in between"] },
      { id: "company_stage", type: "radio", label: "Company profile?",
        options: ["Public", "Private equity-backed", "Privately held", "Non-profit / government", "Pre-IPO"] },
      { id: "shared_services", type: "radio", label: "Shared services or decentralized finance?",
        options: ["Shared services / centralized", "Decentralized by business unit", "Mix"] }
    ],
    tips: [
      { when: a => a.generalist_or_specialist === "Generalist / wears many hats",
        text: "Generalist roles are the hardest to fill and score. Push extra hard on the 'top 3 things' question in the Focus Areas step." },
      { when: a => a.company_stage === "Public",
        text: "Public company means SOX, SEC reporting, and audit scrutiny — confirm whether public-company experience is a true must-have." },
      { when: a => a.company_stage === "Private equity-backed",
        text: "PE-backed environments move fast and report hard — screen for candidates who've survived sponsor reporting and aggressive timelines." }
    ]
  },
  closing: {
    title: "Closing Questions",
    subtitle: "Lock in the process before you hang up.",
    questions: [
      { id: "assessment_required", type: "text", label: "Assessment or case study required?",
        placeholder: "e.g., Excel modeling test, technical accounting case, none" },
      { id: "computer_provided", type: "radio", label: "Computer provided by…",
        options: ["Company provided", "Robert Half provided", "Personal computer"] },
      { id: "system_access", type: "text", label: "System access / onboarding lead time?",
        placeholder: "e.g., ERP credentials take 5 business days, VPN token required" },
      { id: "background_check", type: "radio", label: "Background check?", options: ["Yes", "No"] },
      { id: "background_check_details", type: "textarea", label: "Background check specifics",
        placeholder: "Type of check, vendor, lookback period, credit check, disqualifiers, timing…",
        showIf: a => a.background_check === "Yes" },
      { id: "drug_screen", type: "radio", label: "Drug screen?", options: ["Yes", "No"] },
      { id: "drug_screen_details", type: "textarea", label: "Drug screen specifics",
        placeholder: "Panel type, timing (pre-start / pre-offer), vendor…",
        showIf: a => a.drug_screen === "Yes" },
      { id: "feedback_turnaround", type: "text", label: "Resume / interview feedback turnaround?", placeholder: "e.g., within 48 hours" },
      { id: "next_steps", type: "textarea", label: "Agreed next steps",
        placeholder: "When you'll send candidates, follow-up call scheduled…" }
    ],
    tips: [
      { when: a => /credit/i.test(a.background_check_details || ""),
        text: "Credit checks are common for finance roles but disqualify otherwise-strong candidates — confirm the standard before you submit." },
      { when: a => /excel|model/i.test(a.assessment_required || ""),
        text: "Excel/modeling tests cause drop-off among senior candidates — confirm the time expectation and whether it's skippable for strong profiles." }
    ]
  }
};

/* Common ideal-candidate backgrounds reused by several roles */
const BG_COMMON = ["Public accounting (Big 4)", "Public accounting (regional)", "Public company", "Private equity-backed",
                   "Privately held", "Manufacturing", "Healthcare", "Financial Services", "Technology / SaaS",
                   "Retail / consumer", "Non-profit", "Government"];

/* Systems categories shared by most finance roles */
const ERP_OPTIONS = ["SAP", "Oracle / NetSuite", "Workday", "Microsoft Dynamics", "Sage", "QuickBooks", "Great Plains", "Infor", "JD Edwards"];
const REPORTING_OPTIONS = ["Excel (advanced)", "Power BI", "Tableau", "Hyperion / HFM", "OneStream", "Adaptive Insights", "Anaplan", "Cognos"];

/* =========================================================================
   ROLE CONFIGS
   ========================================================================= */

const ROLES = {

  /* --------------------------------------------------- INTERIM CFO */
  interim_cfo: {
    label: "Interim CFO / Finance Director",
    icon: "🎯",
    tagline: "Senior finance leadership on an interim basis",
    about: "An interim CFO or Finance Director steps into the top finance seat temporarily — covering a departure, a leave, or a transition, or bringing in expertise a company doesn't have yet. They own the numbers, the reporting relationships with lenders and boards, and often the fixes the last person didn't make.",
    blurb: "Interim finance leadership hires turn on situational fit — a turnaround CFO is a different animal from a steady-state one, and a PE-backed board is a different audience from a family owner. Pin the situation, the stakeholders, and what must be true in 90 days.",
    timePrompt: "“If this leader only had time to be exceptional at three things in the first 90 days, what would they be — and roughly what share of their time does each take?”",
    focusAreas: [
      { id: "leadership", label: "Finance Leadership & Strategy", icon: "🧭", deepDive: {
        intro: "Clarify what they own versus advise on, and who they answer to.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Own the finance function", "Board / investor reporting", "Strategic planning", "Capital structure",
                      "Cost reduction", "Turnaround / restructuring", "Build the finance team"] },
          { id: "stakeholders", type: "chips", label: "Key stakeholders?",
            options: ["Board", "PE sponsor", "Lenders / banks", "CEO / owner", "Auditors", "Business unit leaders"] },
          { id: "authority", type: "radio", label: "Decision authority?",
            options: ["Full — acts as the CFO", "Recommends, CEO decides", "Advisory only"] }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Turnaround / restructuring"),
            text: "Turnaround work is a specialist track — target CFOs with documented restructuring or distressed experience, not just steady-state leadership." },
          { when: a => (a.stakeholders || []).includes("PE sponsor"),
            text: "PE sponsor reporting demands speed and precision — screen for candidates who've lived through sponsor cadence and lender covenants." }
        ] } },
      { id: "reporting_close", label: "Reporting & Close Oversight", icon: "📗", deepDive: {
        intro: "How much of the close and reporting they personally own.",
        questions: [
          { id: "involvement", type: "radio", label: "Involvement in the close?",
            options: ["Reviews and signs off", "Hands-on in the close", "Delegates entirely"] },
          { id: "reporting", type: "chips", label: "Reporting responsibilities?",
            options: ["Board packages", "Lender / covenant reporting", "Investor reporting", "Monthly management reporting", "SEC filings"] },
          { id: "gaap", type: "radio", label: "Reporting basis?",
            options: ["US GAAP", "IFRS", "Cash / tax basis", "Mixed"] }
        ], tips: [] } },
      { id: "cash_capital", label: "Cash, Treasury & Capital", icon: "💰", deepDive: {
        intro: "Cash pressure changes the profile you need entirely.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Cash forecasting", "Working capital", "Debt / refinancing", "Fundraising", "Banking relationships", "Covenant compliance"] },
          { id: "pressure", type: "radio", label: "Is there cash pressure?",
            options: ["Yes — tight / distressed", "Manageable", "No — well capitalized"] }
        ],
        tips: [
          { when: a => a.pressure === "Yes — tight / distressed",
            text: "Cash-constrained situations need a CFO who has managed 13-week cash flows and lender conversations — make that a screening question." }
        ] } },
      { id: "team_build", label: "Team Building & Mentoring", icon: "👥", deepDive: {
        intro: "Interim leaders are often asked to fix the team, not just the numbers.",
        questions: [
          { id: "scope", type: "chips", label: "People responsibilities?",
            options: ["Assess the team", "Hire / restructure", "Mentor and develop", "Backfill their own seat", "Manage through change"] },
          { id: "team_state", type: "radio", label: "State of the team?",
            options: ["Strong", "Mixed / gaps", "Struggling / turnover"] }
        ], tips: [] } },
      { id: "ma_transactions", label: "M&A & Transactions", icon: "🤝", deepDive: {
        intro: "Deal work is a distinct experience set.",
        questions: [
          { id: "scope", type: "chips", label: "Transaction scope?",
            options: ["Buy-side diligence", "Sell-side / exit prep", "Integration", "Carve-out / divestiture", "Valuation"] },
          { id: "timeline", type: "text", label: "Deal timeline?", placeholder: "e.g., LOI signed, close targeted Q4" }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Sell-side / exit prep"),
            text: "Exit prep means the client is being diligenced — target CFOs who've been through a sale process and can withstand buyer scrutiny." }
        ] } },
      { id: "systems_transformation", label: "Systems & Process Transformation", icon: "⚙️", deepDive: {
        intro: "Many interim mandates are really change projects.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["ERP selection / implementation", "Process redesign", "Automation", "Internal controls build-out", "Reporting overhaul"] },
          { id: "system", type: "chips", label: "Which systems?", options: ERP_OPTIONS }
        ], tips: [] } },
      { id: "compliance_oversight", label: "Compliance & Risk Oversight", icon: "🛡️", deepDive: {
        intro: "Audit and control obligations define how much rigor is required.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["External audit management", "SOX / internal controls", "Tax oversight", "Insurance / risk", "Regulatory reporting"] },
          { id: "audit_state", type: "radio", label: "Audit status?",
            options: ["Clean", "Findings to remediate", "First-time audit", "Not audited"] }
        ],
        tips: [
          { when: a => a.audit_state === "Findings to remediate",
            text: "Remediation work needs someone who's cleaned up findings before — ask for a specific example and the outcome." }
        ] } }
    ],
    specialists: [
      { label: "Controller", overlapsArea: "reporting_close" },
      { label: "FP&A Lead", overlapsArea: null },
      { label: "Treasury Manager", overlapsArea: "cash_capital" },
      { label: "Accounting Manager", overlapsArea: "reporting_close" },
      { label: "Internal Audit", overlapsArea: "compliance_oversight" },
      { label: "External auditors", overlapsArea: "compliance_oversight" }
    ],
    profileRules: [
      { must: ["cash_capital", "leadership"], profile: "Turnaround / restructuring CFO",
        detail: "Target CFOs with distressed or PE-backed experience. 13-week cash flow, lender negotiation, and cost takeout are the filters." },
      { must: ["ma_transactions", "leadership"], profile: "Transaction-focused CFO",
        detail: "Target CFOs who've closed deals. Diligence, integration, and exit readiness are the filters." },
      { must: ["reporting_close", "compliance_oversight"], profile: "Technical / controls-focused CFO",
        detail: "Target CFOs from public or audited environments. GAAP depth, SOX, and clean audits are the filters." },
      { must: ["systems_transformation", "team_build"], profile: "Transformation CFO",
        detail: "Target change agents who've rebuilt finance functions. ERP implementations and team turnarounds are the filters." }
    ],
    stackCategories: [
      { id: "erp", label: "ERP", placeholder: "SAP, NetSuite, Workday…", options: ERP_OPTIONS },
      { id: "reporting", label: "Reporting / consolidation", placeholder: "Hyperion, OneStream…", options: REPORTING_OPTIONS },
      { id: "planning", label: "Planning / FP&A tools", placeholder: "Anaplan, Adaptive…", options: ["Anaplan", "Adaptive Insights", "Vena", "Planful", "Excel models"] },
      { id: "treasury", label: "Treasury / banking", placeholder: "Kyriba, bank portals…", options: ["Kyriba", "GTreasury", "Bank portals", "Excel cash forecasts"] }
    ],
    aiUseCases: ["Board deck drafting", "Variance commentary", "Scenario modeling", "Contract / document review",
                 "Meeting summaries", "Forecast automation", "Policy drafting"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "Power BI Copilot", "Anaplan / planning AI"],
    metrics: ["EBITDA", "Cash flow", "Close cycle time", "Forecast accuracy", "Covenant compliance", "Audit outcome",
              "Cost savings delivered", "Board / sponsor satisfaction", "Team retention"],
    backgrounds: BG_COMMON
  },

  /* ----------------------------------------------------- CONTROLLER */
  controller: {
    label: "Controller / Assistant Controller",
    icon: "📘",
    tagline: "Close, reporting, controls, and the accounting team",
    about: "A Controller owns a company's accounting operations — making sure the books close on time and correctly, financial statements are accurate, and internal controls hold up. They typically lead the accounting team and are the main point of contact for external auditors.",
    blurb: "“Controller” spans a hands-on player-coach at a $20M company to an oversight role at a $2B one. Pin the size, the complexity (consolidations? multi-entity? public?), and how much they personally do versus review.",
    timePrompt: "“Between the close, reporting, controls, and managing the team — what three things carry most of the month, and roughly what percentage each?”",
    focusAreas: [
      { id: "close", label: "Month-End Close", icon: "📅", deepDive: {
        intro: "The close is the heartbeat — find out its state and their role in it.",
        questions: [
          { id: "role", type: "radio", label: "Their role in the close?",
            options: ["Owns and runs the close", "Reviews and approves", "Hands-on preparer", "Player-coach"] },
          { id: "duration", type: "select", label: "Current close duration?",
            options: ["1–3 days", "4–5 days", "6–10 days", "10+ days", "Not sure"] },
          { id: "pain", type: "chips", label: "Known close problems?",
            options: ["Takes too long", "Manual / spreadsheet-heavy", "Reconciliation backlog", "Late adjustments", "No documentation", "None — it's clean"] },
          { id: "improve", type: "radio", label: "Is improving the close part of the mandate?",
            options: ["Yes — a primary goal", "Nice to have", "No — just keep it running"] }
        ],
        tips: [
          { when: a => ["6–10 days", "10+ days"].includes(a.duration),
            text: "A long close usually signals process or staffing problems, not just skill gaps — probe what's actually broken so you set the consultant up to succeed." },
          { when: a => a.improve === "Yes — a primary goal",
            text: "Close improvement is a project, not just coverage — target candidates with documented close-acceleration wins and ask for the before/after." }
        ] } },
      { id: "financial_reporting", label: "Financial Reporting", icon: "📑", deepDive: {
        intro: "What they produce, for whom, and under what standard.",
        questions: [
          { id: "outputs", type: "chips", label: "What do they produce?",
            options: ["Monthly financial statements", "Board packages", "Lender / covenant reporting", "SEC filings (10-Q/10-K)",
                      "Consolidated statements", "Statutory / local filings"] },
          { id: "basis", type: "radio", label: "Reporting basis?",
            options: ["US GAAP", "IFRS", "Cash / tax basis", "Mixed"] },
          { id: "consolidations", type: "radio", label: "Consolidations involved?",
            options: ["Yes — multi-entity", "Yes — with foreign currency", "No — single entity"] }
        ],
        tips: [
          { when: a => a.consolidations === "Yes — with foreign currency",
            text: "Multi-currency consolidations are a real filter — screen for FX translation, intercompany eliminations, and the specific system they used." },
          { when: a => (a.outputs || []).includes("SEC filings (10-Q/10-K)"),
            text: "SEC reporting requires public-company experience — this narrows the pool significantly and raises the rate. Confirm it's a must-have." }
        ] } },
      { id: "technical_accounting", label: "Technical Accounting", icon: "📐", deepDive: {
        intro: "Specific standards separate strong candidates from generalists.",
        questions: [
          { id: "areas", type: "chips", label: "Which technical areas?",
            options: ["Revenue recognition (ASC 606)", "Leases (ASC 842)", "Stock comp (ASC 718)", "Business combinations (ASC 805)",
                      "Impairment", "Derivatives / hedging", "Income taxes (ASC 740)"] },
          { id: "memos", type: "radio", label: "Will they write technical memos?",
            options: ["Yes", "Occasionally", "No"] },
          { id: "cpa", type: "radio", label: "CPA required?",
            options: ["Required", "Strongly preferred", "Nice to have", "Not important"] }
        ],
        tips: [
          { when: a => (a.areas || []).includes("Revenue recognition (ASC 606)"),
            text: "ASC 606 depth is a genuine differentiator — ask for a specific example of a complex revenue arrangement they worked through." },
          { when: a => a.cpa === "Required",
            text: "A hard CPA requirement narrows the pool and raises the rate — confirm it's truly required versus preferred." }
        ] } },
      { id: "controls", label: "Internal Controls & Audit", icon: "🛡️", deepDive: {
        intro: "Control environment and audit posture.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Manage external audit", "SOX compliance", "Design / document controls", "Remediate deficiencies", "Policy writing"] },
          { id: "sox", type: "radio", label: "SOX environment?",
            options: ["Yes — public / SOX", "SOX-like (PE or pre-IPO)", "No formal SOX"] },
          { id: "audit_timing", type: "text", label: "Audit timing?", placeholder: "e.g., fieldwork begins in October" }
        ],
        tips: [
          { when: a => a.sox === "Yes — public / SOX",
            text: "SOX experience is a hard filter — screen for candidates who've owned control testing and worked directly with external auditors." }
        ] } },
      { id: "team_management", label: "Team Management", icon: "👥", deepDive: {
        intro: "How much of this role is leading versus doing.",
        questions: [
          { id: "size", type: "select", label: "Team size they'll manage?",
            options: ["None", "1–3", "4–8", "9–15", "15+"] },
          { id: "scope", type: "chips", label: "Management responsibilities?",
            options: ["Review work", "Coach / develop", "Hiring", "Performance management", "Workload planning"] }
        ], tips: [] } },
      { id: "ap_ar", label: "AP / AR & Transactional", icon: "🔁", deepDive: {
        intro: "Transactional oversight is common at smaller companies.",
        questions: [
          { id: "scope", type: "chips", label: "What do they oversee?",
            options: ["Accounts payable", "Accounts receivable / collections", "Payroll", "Fixed assets", "Inventory", "Expense reporting"] },
          { id: "hands_on", type: "radio", label: "Hands-on or oversight?",
            options: ["Hands-on when needed", "Oversight only"] }
        ], tips: [] } },
      { id: "systems", label: "Systems & Process", icon: "⚙️", deepDive: {
        intro: "System work is a common reason Controllers are brought in.",
        questions: [
          { id: "scope", type: "chips", label: "System involvement?",
            options: ["ERP implementation", "System conversion / migration", "Automation of manual work", "Reporting build-out", "No system work"] },
          { id: "system", type: "chips", label: "Which ERP?", options: ERP_OPTIONS }
        ],
        tips: [
          { when: a => (a.scope || []).includes("ERP implementation"),
            text: "ERP implementation experience on the finance side is scarce — prioritize candidates who've done that exact system, and reset timeline expectations." }
        ] } }
    ],
    specialists: [
      { label: "Assistant Controller", overlapsArea: "close" },
      { label: "Accounting Manager", overlapsArea: "close" },
      { label: "Staff / Senior Accountants", overlapsArea: "team_management" },
      { label: "FP&A team", overlapsArea: null },
      { label: "AP / AR clerks", overlapsArea: "ap_ar" },
      { label: "Internal Audit", overlapsArea: "controls" },
      { label: "External auditors", overlapsArea: "controls" }
    ],
    profileRules: [
      { must: ["close", "financial_reporting"], profile: "Operational Controller",
        detail: "Target Controllers who own the close end to end. Close speed, statement accuracy, and system fluency are the filters." },
      { must: ["technical_accounting", "controls"], profile: "Technical Controller",
        detail: "Target Big 4-trained CPAs with public-company exposure. Technical memos, SOX, and audit management are the filters." },
      { must: ["systems", "close"], profile: "Systems / transformation Controller",
        detail: "Target Controllers who've run implementations. Specific ERP experience and process redesign wins are the filters." },
      { must: ["team_management", "close"], profile: "Player-coach Controller",
        detail: "Target hands-on leaders comfortable both reviewing and preparing. Small-team leadership is the filter." }
    ],
    stackCategories: [
      { id: "erp", label: "ERP", placeholder: "NetSuite, SAP, Dynamics…", options: ERP_OPTIONS },
      { id: "reporting", label: "Reporting / consolidation", placeholder: "Hyperion, OneStream…", options: REPORTING_OPTIONS },
      { id: "close_tools", label: "Close / reconciliation tools", placeholder: "BlackLine, FloQast…",
        options: ["BlackLine", "FloQast", "Trintech", "Excel only", "None"] },
      { id: "other_systems", label: "Other systems", placeholder: "Concur, Avalara, Bill.com…",
        options: ["Concur", "Bill.com", "Avalara", "Coupa", "ADP / payroll", "Salesforce"] }
    ],
    aiUseCases: ["Variance commentary", "Reconciliation review", "Technical research", "Policy / memo drafting",
                 "Anomaly detection", "Close checklist automation", "Report drafting"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "BlackLine AI", "FloQast AI", "ERP-embedded AI"],
    metrics: ["Close cycle time", "Audit findings", "Reconciliation completeness", "Reporting accuracy", "On-time filings",
              "Control deficiencies", "Team retention", "Process improvements delivered"],
    backgrounds: BG_COMMON
  },

  /* ---------------------------------------------- ACCOUNTING MANAGER */
  accounting_manager: {
    label: "Accounting Manager",
    icon: "📗",
    tagline: "Hands-on close leadership and team supervision",
    about: "An Accounting Manager runs the day-to-day accounting operations — supervising staff accountants, reviewing journal entries and reconciliations, and driving the monthly close. It sits between the senior accountants doing the work and the Controller who owns the results.",
    blurb: "Accounting Managers are the workhorses of the close. The key questions are how much they prepare versus review, how big the team is, and whether they're expected to fix process or just run it.",
    timePrompt: "“Between preparing, reviewing, supervising, and reporting — what three things carry most of the month, and roughly what percentage each?”",
    focusAreas: [
      { id: "close_execution", label: "Close Execution", icon: "📅", deepDive: {
        intro: "The core of the job — what they own in the close.",
        questions: [
          { id: "role", type: "radio", label: "Preparer or reviewer?",
            options: ["Primarily preparer", "Primarily reviewer", "Both — player-coach"] },
          { id: "areas", type: "chips", label: "Which close areas?",
            options: ["Journal entries", "Account reconciliations", "Accruals", "Revenue", "Payroll", "Fixed assets", "Inventory", "Intercompany"] },
          { id: "duration", type: "select", label: "Close duration?", options: ["1–3 days", "4–5 days", "6–10 days", "10+ days", "Not sure"] }
        ],
        tips: [
          { when: a => a.role === "Primarily preparer",
            text: "A preparer-heavy 'manager' role is really a senior accountant with a title — set candidate expectations so you don't lose them at offer." }
        ] } },
      { id: "supervision", label: "Team Supervision", icon: "👥", deepDive: {
        intro: "How many people and how much development.",
        questions: [
          { id: "size", type: "select", label: "Direct reports?", options: ["None", "1–2", "3–5", "6–10", "10+"] },
          { id: "scope", type: "chips", label: "Supervisory responsibilities?",
            options: ["Review staff work", "Assign workload", "Train / develop", "Performance reviews", "Hiring input"] }
        ], tips: [] } },
      { id: "reconciliations", label: "Reconciliations & Accuracy", icon: "🧾", deepDive: {
        intro: "Reconciliation backlogs are a frequent reason for the hire.",
        questions: [
          { id: "state", type: "radio", label: "State of reconciliations?",
            options: ["Current and clean", "Some backlog", "Significant backlog", "Not sure"] },
          { id: "accounts", type: "chips", label: "Which reconciliations?",
            options: ["Bank", "Balance sheet", "Intercompany", "Inventory", "Payroll", "Prepaid / accrual"] }
        ],
        tips: [
          { when: a => a.state === "Significant backlog",
            text: "A significant backlog means cleanup work, not steady-state — target candidates who've cleaned up messy books and enjoy that work." }
        ] } },
      { id: "technical", label: "Technical Accounting", icon: "📐", deepDive: {
        intro: "Depth needed beyond routine entries.",
        questions: [
          { id: "areas", type: "chips", label: "Technical areas?",
            options: ["Revenue recognition (ASC 606)", "Leases (ASC 842)", "Accruals / estimates", "Fixed assets", "Inventory costing", "Equity"] },
          { id: "cpa", type: "radio", label: "CPA expectation?", options: ["Required", "Preferred", "Not important"] }
        ], tips: [] } },
      { id: "audit_support", label: "Audit Support", icon: "🔍", deepDive: {
        intro: "Audit prep often falls to this role.",
        questions: [
          { id: "scope", type: "chips", label: "Audit responsibilities?",
            options: ["Prepare PBC schedules", "Respond to auditor requests", "Coordinate the audit", "Remediate findings"] },
          { id: "audit_type", type: "radio", label: "Audit type?",
            options: ["Full external audit", "Review / compilation", "SOX testing", "None"] }
        ], tips: [] } },
      { id: "process_improvement", label: "Process Improvement", icon: "⚡", deepDive: {
        intro: "Is this steady-state coverage or a fix-it mandate?",
        questions: [
          { id: "scope", type: "chips", label: "Improvement scope?",
            options: ["Automate manual work", "Document procedures", "Standardize the close", "System optimization", "None — keep it running"] }
        ], tips: [] } },
      { id: "transactional", label: "Transactional Oversight", icon: "🔁", deepDive: {
        intro: "AP/AR/payroll oversight is common in leaner teams.",
        questions: [
          { id: "scope", type: "chips", label: "What do they oversee?",
            options: ["Accounts payable", "Accounts receivable", "Payroll", "Expense reports", "Billing"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Controller", overlapsArea: "close_execution" },
      { label: "Senior Accountants", overlapsArea: "supervision" },
      { label: "Staff Accountants", overlapsArea: "supervision" },
      { label: "AP / AR team", overlapsArea: "transactional" },
      { label: "Payroll", overlapsArea: "transactional" },
      { label: "External auditors", overlapsArea: "audit_support" }
    ],
    profileRules: [
      { must: ["close_execution", "supervision"], profile: "Close-focused Accounting Manager",
        detail: "Target managers who run a close with a small team. Review discipline and deadline reliability are the filters." },
      { must: ["reconciliations", "process_improvement"], profile: "Cleanup / remediation Manager",
        detail: "Target candidates who've cleaned up backlogs. Ask for the before/after on a messy set of books." },
      { must: ["technical", "audit_support"], profile: "Technical Accounting Manager",
        detail: "Target CPAs with public accounting roots. Technical areas and audit interaction are the filters." }
    ],
    stackCategories: [
      { id: "erp", label: "ERP / accounting system", placeholder: "NetSuite, QuickBooks…", options: ERP_OPTIONS },
      { id: "close_tools", label: "Close / reconciliation tools", placeholder: "BlackLine, FloQast…",
        options: ["BlackLine", "FloQast", "Trintech", "Excel only", "None"] },
      { id: "reporting", label: "Reporting", placeholder: "Excel, Power BI…", options: REPORTING_OPTIONS },
      { id: "other_systems", label: "Other systems", placeholder: "Bill.com, Concur…",
        options: ["Bill.com", "Concur", "ADP / payroll", "Avalara", "Coupa"] }
    ],
    aiUseCases: ["Reconciliation review", "Variance explanations", "Journal entry review", "Documentation drafting",
                 "Anomaly detection", "Close checklist automation"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "BlackLine AI", "FloQast AI"],
    metrics: ["Close cycle time", "Reconciliation completeness", "Audit adjustments", "Error / rework rate",
              "On-time deliverables", "Team development", "Backlog cleared"],
    backgrounds: BG_COMMON
  },

  /* ------------------------------------------------------ FP&A */
  fpa_analyst: {
    label: "FP&A / Financial Analyst",
    icon: "📈",
    tagline: "Budgeting, forecasting, modeling, and business partnering",
    about: "FP&A (Financial Planning & Analysis) is the forward-looking side of finance — building budgets and forecasts, modeling scenarios, and explaining why results differ from plan. Strong FP&A people act as business partners, helping operators make decisions rather than just reporting numbers.",
    blurb: "FP&A roles range from report-builders to true business partners who influence decisions. Pin the modeling depth, who they partner with, and whether they own the forecast or just support it.",
    timePrompt: "“Between forecasting, reporting, modeling, and partnering with the business — what three things carry most of the month, and roughly what percentage each?”",
    focusAreas: [
      { id: "budgeting", label: "Budgeting & Forecasting", icon: "🗓️", deepDive: {
        intro: "Ownership of the plan is the core question.",
        questions: [
          { id: "ownership", type: "radio", label: "Their role in the forecast?",
            options: ["Owns the forecast process", "Builds their piece", "Supports / consolidates"] },
          { id: "cadence", type: "chips", label: "Planning cadence?",
            options: ["Annual budget", "Monthly forecast", "Quarterly reforecast", "Rolling forecast", "Long-range plan"] },
          { id: "scope", type: "text", label: "What do they forecast?", placeholder: "Revenue, opex, headcount, capex, cash…" }
        ],
        tips: [
          { when: a => a.ownership === "Owns the forecast process",
            text: "Owning the forecast means driving other people's inputs — screen for stakeholder management, not just modeling skill." }
        ] } },
      { id: "modeling", label: "Financial Modeling", icon: "🧮", deepDive: {
        intro: "Modeling depth is the biggest differentiator in this market.",
        questions: [
          { id: "complexity", type: "radio", label: "Modeling complexity?",
            options: ["Advanced — builds models from scratch", "Intermediate — maintains and extends", "Basic — updates templates"] },
          { id: "types", type: "chips", label: "Model types?",
            options: ["Three-statement", "Scenario / sensitivity", "Unit economics", "Driver-based", "Valuation / DCF", "Cash flow"] },
          { id: "excel", type: "radio", label: "Excel expectation?",
            options: ["Expert (complex models, no VBA needed)", "Advanced", "Intermediate"] }
        ],
        tips: [
          { when: a => a.complexity === "Advanced — builds models from scratch",
            text: "From-scratch modeling is a real filter — consider a modeling test, and ask candidates to describe a model they built and what decision it drove." }
        ] } },
      { id: "reporting_analysis", label: "Reporting & Variance Analysis", icon: "📊", deepDive: {
        intro: "The recurring deliverables.",
        questions: [
          { id: "outputs", type: "chips", label: "What do they produce?",
            options: ["Monthly management reporting", "Board / investor decks", "KPI dashboards", "Variance analysis", "Departmental reporting"] },
          { id: "depth", type: "radio", label: "Analysis depth expected?",
            options: ["Explains the 'why' and recommends", "Explains variances", "Reports the numbers"] }
        ],
        tips: [
          { when: a => a.depth === "Explains the 'why' and recommends",
            text: "Insight-level analysis is what separates senior FP&A from reporting analysts — ask for an example where their analysis changed a decision." }
        ] } },
      { id: "business_partnering", label: "Business Partnering", icon: "🤝", deepDive: {
        intro: "Who they work with outside finance.",
        questions: [
          { id: "partners", type: "chips", label: "Who do they partner with?",
            options: ["Sales", "Marketing", "Operations", "Engineering / R&D", "HR", "Executive team", "Business unit leaders"] },
          { id: "seniority", type: "radio", label: "How senior is the audience?",
            options: ["C-suite / board", "VP / director", "Manager level"] }
        ], tips: [] } },
      { id: "systems_data", label: "Systems & Data", icon: "🗄️", deepDive: {
        intro: "Tooling determines how much time goes to wrangling versus analysis.",
        questions: [
          { id: "tools", type: "chips", label: "Planning / BI tools?", options: REPORTING_OPTIONS },
          { id: "sql", type: "radio", label: "SQL / database skills needed?",
            options: ["Required", "Preferred", "Not needed"] },
          { id: "implementation", type: "radio", label: "Any system implementation in scope?",
            options: ["Yes — implementing new tool", "No", "Possibly"] }
        ],
        tips: [
          { when: a => a.sql === "Required",
            text: "SQL requirements narrow the FP&A pool considerably — confirm it's genuinely required versus a nice-to-have from the job description." }
        ] } },
      { id: "specialized_analysis", label: "Specialized Analysis", icon: "🔬", deepDive: {
        intro: "Domain-specific analysis narrows the target profile.",
        questions: [
          { id: "areas", type: "chips", label: "Which areas?",
            options: ["Revenue / pricing", "Cost / margin", "Headcount planning", "Capex / ROI", "SaaS metrics (ARR, churn)",
                      "Inventory / supply chain", "Project profitability"] }
        ],
        tips: [
          { when: a => (a.areas || []).includes("SaaS metrics (ARR, churn)"),
            text: "SaaS metrics fluency (ARR, NRR, CAC, churn) is a distinct skill set — target candidates from subscription businesses." }
        ] } },
      { id: "pricing_predictive", label: "Pricing & Predictive Modeling", icon: "🎯", deepDive: {
        intro: "A named MR capability — pricing strategy and forward-looking scenario work.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Price setting / strategy", "Margin / profitability analysis", "Discounting & rebates",
                      "Price increase modeling", "Elasticity analysis", "Customer / product profitability"] },
          { id: "predictive", type: "chips", label: "Predictive / scenario work?",
            options: ["Scenario & sensitivity analysis", "Predictive forecasting", "Statistical modeling", "Monte Carlo / simulation", "None"] },
          { id: "tools", type: "chips", label: "Tools used?",
            options: ["Excel", "Power BI", "Tableau", "Python / R", "SQL", "Pricing software"] }
        ],
        tips: [
          { when: a => (a.predictive || []).includes("Statistical modeling") || (a.predictive || []).includes("Monte Carlo / simulation"),
            text: "Statistical modeling pushes this beyond traditional FP&A — confirm whether the client needs a finance analyst with modeling chops or a data scientist." },
          { when: a => (a.scope || []).includes("Price increase modeling"),
            text: "Pricing actions are board-visible and margin-critical — target analysts who've modeled and defended a real price change, not just reported on margin." }
        ] } },
      { id: "process_improvement", label: "Process & Automation", icon: "⚡", deepDive: {
        intro: "Many FP&A hires are brought in to fix the process.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Automate reporting", "Rebuild models", "Standardize templates", "Improve forecast accuracy", "Documentation"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "FP&A Manager / Director", overlapsArea: "budgeting" },
      { label: "Other Financial Analysts", overlapsArea: "reporting_analysis" },
      { label: "Controller / accounting team", overlapsArea: null },
      { label: "Data / BI Analyst", overlapsArea: "systems_data" },
      { label: "Business unit finance leads", overlapsArea: "business_partnering" }
    ],
    profileRules: [
      { must: ["modeling", "budgeting"], profile: "Core FP&A analyst",
        detail: "Target analysts who own models and the forecast cycle. Advanced Excel and forecast accuracy are the filters." },
      { must: ["business_partnering", "reporting_analysis"], profile: "Business partner / commercial finance",
        detail: "Target FP&A professionals embedded with operators. Influence and communication are the filters as much as technical skill." },
      { must: ["systems_data", "process_improvement"], profile: "FP&A systems / transformation analyst",
        detail: "Target analysts who've implemented planning tools. Anaplan/Adaptive experience and automation wins are the filters." }
    ],
    stackCategories: [
      { id: "planning", label: "Planning tools", placeholder: "Anaplan, Adaptive…",
        options: ["Anaplan", "Adaptive Insights", "Vena", "Planful", "Hyperion", "Excel models"] },
      { id: "bi", label: "BI / reporting", placeholder: "Power BI, Tableau…", options: REPORTING_OPTIONS },
      { id: "erp", label: "ERP source system", placeholder: "SAP, NetSuite…", options: ERP_OPTIONS },
      { id: "data", label: "Data / query tools", placeholder: "SQL, Snowflake…",
        options: ["SQL", "Snowflake", "Alteryx", "Python", "Power Query"] }
    ],
    aiUseCases: ["Variance commentary", "Forecast automation", "Scenario modeling", "Deck drafting",
                 "Data cleanup", "Formula / model building", "Summarizing results"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "Power BI Copilot", "Anaplan / Adaptive AI", "Tableau Pulse"],
    metrics: ["Forecast accuracy", "Budget variance", "Reporting timeliness", "Decision impact", "Revenue / margin outcomes",
              "Cost savings identified", "Model quality", "Stakeholder satisfaction"],
    backgrounds: BG_COMMON.concat(["Investment banking", "Consulting", "SaaS / subscription"])
  },

  /* -------------------------------------------------- INTERNAL AUDIT */
  internal_auditor: {
    label: "Internal Auditor / Audit Manager",
    icon: "🔍",
    tagline: "Controls testing, risk assessment, and SOX",
    about: "Internal auditors independently test whether a company's controls and processes actually work — reviewing financial, operational, and compliance risks and reporting findings to management and the audit committee. In public companies much of this is SOX testing; elsewhere it's broader operational auditing.",
    blurb: "Internal audit roles split between SOX-driven controls testing and broader operational/risk auditing. Pin which one, the certification bar, and whether they're building the function or running it.",
    timePrompt: "“Between planning, testing, reporting, and remediation follow-up — what three things carry most of the time, and roughly what percentage each?”",
    focusAreas: [
      { id: "sox", label: "SOX Compliance", icon: "📋", deepDive: {
        intro: "SOX work is the most common internal-audit mandate.",
        questions: [
          { id: "scope", type: "chips", label: "SOX responsibilities?",
            options: ["Walkthroughs", "Control testing", "Documentation / narratives", "Deficiency evaluation", "PCAOB coordination", "Scoping / risk assessment"] },
          { id: "maturity", type: "radio", label: "SOX program maturity?",
            options: ["Established / mature", "Being built out", "First year of compliance", "Pre-IPO readiness"] },
          { id: "itgc", type: "radio", label: "IT general controls (ITGC) in scope?",
            options: ["Yes", "No", "Some"] }
        ],
        tips: [
          { when: a => a.maturity === "First year of compliance" || a.maturity === "Pre-IPO readiness",
            text: "First-year SOX or IPO readiness is build work, not maintenance — target candidates who've stood up a program, not just tested an existing one." },
          { when: a => a.itgc === "Yes",
            text: "ITGC testing requires IT audit skills that many financial auditors lack — confirm whether they need a dedicated IT auditor instead." }
        ] } },
      { id: "operational_audit", label: "Operational Audits", icon: "🏭", deepDive: {
        intro: "Beyond financial controls — process and efficiency audits.",
        questions: [
          { id: "areas", type: "chips", label: "Which areas?",
            options: ["Procurement", "Inventory / supply chain", "Revenue cycle", "Payroll / HR", "IT", "Treasury", "Compliance"] },
          { id: "objective", type: "radio", label: "Primary objective?",
            options: ["Risk identification", "Efficiency / cost savings", "Compliance verification", "Fraud detection"] }
        ], tips: [] } },
      { id: "risk_assessment", label: "Risk Assessment & Planning", icon: "🎲", deepDive: {
        intro: "Building the audit plan versus executing one.",
        questions: [
          { id: "role", type: "radio", label: "Their role in planning?",
            options: ["Builds the annual audit plan", "Contributes to planning", "Executes an existing plan"] },
          { id: "framework", type: "chips", label: "Frameworks used?",
            options: ["COSO", "COBIT", "IIA standards", "ERM", "NIST", "None formal"] }
        ], tips: [] } },
      { id: "reporting_findings", label: "Reporting & Audit Committee", icon: "📢", deepDive: {
        intro: "Who they report to shapes the seniority needed.",
        questions: [
          { id: "audience", type: "chips", label: "Reporting audience?",
            options: ["Audit committee", "CFO / CAE", "Process owners", "External auditors", "Board"] },
          { id: "writing", type: "radio", label: "Report writing expectation?",
            options: ["Writes final audit reports", "Drafts findings", "Supports documentation"] }
        ],
        tips: [
          { when: a => (a.audience || []).includes("Audit committee"),
            text: "Audit-committee exposure means a more senior, polished communicator — screen for presentation experience, not just testing skill." }
        ] } },
      { id: "remediation", label: "Remediation & Follow-Up", icon: "🔧", deepDive: {
        intro: "Fixing findings versus just reporting them.",
        questions: [
          { id: "scope", type: "chips", label: "What's expected?",
            options: ["Track remediation", "Design new controls", "Retest", "Advise process owners", "Not in scope"] },
          { id: "state", type: "radio", label: "Current deficiency state?",
            options: ["Material weaknesses exist", "Significant deficiencies", "Minor findings", "Clean"] }
        ],
        tips: [
          { when: a => a.state === "Material weaknesses exist",
            text: "Material weaknesses are urgent and visible to auditors and the board — this needs a senior, remediation-experienced candidate." }
        ] } },
      { id: "data_analytics", label: "Audit Data Analytics", icon: "📉", deepDive: {
        intro: "Analytics-driven auditing is increasingly expected.",
        questions: [
          { id: "tools", type: "chips", label: "Analytics tools?",
            options: ["ACL / Galvanize", "IDEA", "Alteryx", "Power BI", "SQL", "Excel only"] },
          { id: "scope", type: "chips", label: "Analytics use?",
            options: ["Full-population testing", "Continuous monitoring", "Fraud analytics", "Sampling"] }
        ], tips: [] } },
      { id: "certifications", label: "Certifications & Standards", icon: "🎓", deepDive: {
        intro: "Certification requirements are a real filter here.",
        questions: [
          { id: "certs", type: "chips", label: "Which certifications?",
            options: ["CPA", "CIA", "CISA", "CFE", "CRMA", "None required"] },
          { id: "requirement", type: "radio", label: "How firm is the requirement?",
            options: ["Required", "Strongly preferred", "Nice to have"] }
        ],
        tips: [
          { when: a => a.requirement === "Required",
            text: "A hard certification requirement significantly narrows the pool — confirm which certs are acceptable and whether equivalents count." }
        ] } }
    ],
    specialists: [
      { label: "Chief Audit Executive", overlapsArea: "risk_assessment" },
      { label: "IT Auditor", overlapsArea: "sox" },
      { label: "Other internal auditors", overlapsArea: "operational_audit" },
      { label: "SOX Manager", overlapsArea: "sox" },
      { label: "Compliance team", overlapsArea: null },
      { label: "External auditors", overlapsArea: "sox" }
    ],
    profileRules: [
      { must: ["sox", "remediation"], profile: "SOX / controls specialist",
        detail: "Target auditors from public companies or Big 4 with heavy SOX cycles. Testing depth and remediation wins are the filters." },
      { must: ["operational_audit", "risk_assessment"], profile: "Operational / risk auditor",
        detail: "Target IIA-credentialed auditors with broad process experience. Audit plan ownership is the filter." },
      { must: ["data_analytics", "sox"], profile: "Analytics-driven auditor",
        detail: "Target auditors who use ACL/Alteryx/SQL for full-population testing. Analytics fluency is the differentiator." }
    ],
    stackCategories: [
      { id: "audit_tools", label: "Audit management tools", placeholder: "AuditBoard, Workiva…",
        options: ["AuditBoard", "Workiva", "SAP GRC", "MetricStream", "TeamMate", "Excel / SharePoint"] },
      { id: "analytics", label: "Analytics tools", placeholder: "ACL, Alteryx…",
        options: ["ACL / Galvanize", "IDEA", "Alteryx", "Power BI", "SQL", "Tableau"] },
      { id: "erp", label: "ERP systems audited", placeholder: "SAP, Oracle…", options: ERP_OPTIONS },
      { id: "grc", label: "GRC / compliance", placeholder: "ServiceNow GRC…",
        options: ["ServiceNow GRC", "Archer", "LogicGate", "SAP GRC", "None"] }
    ],
    aiUseCases: ["Risk assessment support", "Control testing documentation", "Report drafting", "Anomaly / fraud detection",
                 "Full-population analysis", "Policy review", "Sampling optimization"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "AuditBoard AI", "Workiva AI", "Alteryx AI", "Excel Copilot"],
    metrics: ["Audit plan completion", "Findings identified", "Remediation rate", "SOX testing on time",
              "Material weaknesses", "Cost savings identified", "Audit committee satisfaction"],
    backgrounds: BG_COMMON.concat(["Internal audit function", "Risk consulting"])
  },

  /* --------------------------------------------------- TAX */
  tax_manager: {
    label: "Tax Manager / Director",
    icon: "🧾",
    tagline: "Provision, compliance, planning, and audits",
    about: "Tax professionals handle a company's tax obligations — preparing or reviewing returns, calculating the tax provision that flows into financial statements, and planning to legally minimize tax. Specialties diverge sharply: income tax, sales and use, international, and transfer pricing are largely different careers.",
    blurb: "Tax is the most specialized area in finance — income vs. indirect vs. international are different candidate pools entirely. Pin the exact specialty, the provision requirement, and whether it's compliance or planning work.",
    timePrompt: "“Between provision, compliance, planning, and audit defense — what three things carry most of the year, and roughly what percentage each?”",
    focusAreas: [
      { id: "provision", label: "Tax Provision (ASC 740)", icon: "📊", deepDive: {
        intro: "Provision work is the hardest tax skill to find.",
        questions: [
          { id: "role", type: "radio", label: "Their role in the provision?",
            options: ["Owns and prepares the provision", "Reviews the provision", "Supports / schedules only", "Not in scope"] },
          { id: "frequency", type: "radio", label: "Provision frequency?",
            options: ["Quarterly (public)", "Annual", "Both"] },
          { id: "complexity", type: "chips", label: "Complexity drivers?",
            options: ["Valuation allowance", "Uncertain tax positions (FIN 48)", "Multi-jurisdiction", "Stock comp", "NOLs", "Purchase accounting"] }
        ],
        tips: [
          { when: a => a.role === "Owns and prepares the provision" && a.frequency === "Quarterly (public)",
            text: "Quarterly public-company provision ownership is a narrow, expensive skill set — set rate expectations accordingly." }
        ] } },
      { id: "income_tax", label: "Income Tax Compliance", icon: "📄", deepDive: {
        intro: "Federal, state, and the preparer/reviewer split.",
        questions: [
          { id: "scope", type: "chips", label: "Which returns?",
            options: ["Federal corporate (1120)", "State / multistate", "Partnership (1065)", "S-corp", "Consolidated returns"] },
          { id: "role", type: "radio", label: "Prepare or review?",
            options: ["Prepares returns", "Reviews returns", "Manages outside firm"] },
          { id: "states", type: "text", label: "How many states?", placeholder: "e.g., 25+ states, nexus in 12" }
        ],
        tips: [
          { when: a => a.role === "Manages outside firm",
            text: "If an outside firm does the returns, this is a review/management role — target in-house tax managers, not preparers from public accounting." }
        ] } },
      { id: "indirect_tax", label: "Indirect Tax (Sales & Use)", icon: "🏷️", deepDive: {
        intro: "Indirect tax is a different specialty from income tax.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Sales & use tax", "Nexus analysis", "Exemption certificates", "VAT / GST", "Property tax", "Excise"] },
          { id: "automation", type: "chips", label: "Tax engines used?",
            options: ["Avalara", "Vertex", "Sovos", "Manual / in-house", "None"] }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Nexus analysis"),
            text: "Post-Wayfair nexus work is in demand — target candidates who've done multistate nexus studies and registrations." }
        ] } },
      { id: "international", label: "International Tax", icon: "🌍", deepDive: {
        intro: "International adds a scarce, premium skill layer.",
        questions: [
          { id: "scope", type: "chips", label: "International scope?",
            options: ["GILTI / Subpart F", "Transfer pricing", "Foreign tax credits", "Treaty analysis", "Local country filings", "Pillar Two"] },
          { id: "countries", type: "text", label: "Which countries?", placeholder: "e.g., UK, Germany, Singapore" }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Transfer pricing"),
            text: "Transfer pricing is a specialist discipline — most generalist tax managers can't do it. Confirm whether they need a dedicated TP specialist." }
        ] } },
      { id: "planning", label: "Tax Planning & Strategy", icon: "♟️", deepDive: {
        intro: "Planning work versus compliance execution.",
        questions: [
          { id: "scope", type: "chips", label: "Planning scope?",
            options: ["Effective tax rate management", "Entity structuring", "M&A tax", "Credits & incentives (R&D)", "State planning"] },
          { id: "weight", type: "radio", label: "How much of the role is planning?",
            options: ["Majority", "Some", "Minimal — mostly compliance"] }
        ], tips: [] } },
      { id: "audits", label: "Tax Audits & Controversy", icon: "⚖️", deepDive: {
        intro: "Active audits change the urgency of the hire.",
        questions: [
          { id: "active", type: "radio", label: "Any active audits?",
            options: ["Yes — IRS", "Yes — state", "Yes — foreign", "No"] },
          { id: "scope", type: "chips", label: "Their role?",
            options: ["Respond to IDRs", "Lead the defense", "Support outside counsel", "Negotiate settlements"] }
        ],
        tips: [
          { when: a => (a.active || "").startsWith("Yes"),
            text: "An active audit means immediate need and real exposure — prioritize candidates who've defended an audit of that type." }
        ] } },
      { id: "credentials", label: "Credentials & Systems", icon: "🎓", deepDive: {
        intro: "Certification and software fluency.",
        questions: [
          { id: "certs", type: "chips", label: "Credentials?",
            options: ["CPA", "JD / LLM in Tax", "EA", "MST", "None required"] },
          { id: "software", type: "chips", label: "Tax software?",
            options: ["OneSource", "Corptax", "GoSystem", "CCH Axcess", "Avalara", "Vertex", "Excel only"] }
        ],
        tips: [
          { when: a => (a.software || []).includes("Corptax") || (a.software || []).includes("OneSource"),
            text: "Corptax/OneSource experience is a genuine filter for corporate tax roles — treat it as a must-have if the client says so." }
        ] } }
    ],
    specialists: [
      { label: "Tax Director / VP Tax", overlapsArea: "planning" },
      { label: "Tax Analysts / Seniors", overlapsArea: "income_tax" },
      { label: "Sales & Use Tax Specialist", overlapsArea: "indirect_tax" },
      { label: "International Tax Specialist", overlapsArea: "international" },
      { label: "Outside tax firm", overlapsArea: "income_tax" },
      { label: "Controller / accounting team", overlapsArea: "provision" }
    ],
    profileRules: [
      { must: ["provision", "income_tax"], profile: "Corporate income tax manager",
        detail: "Target in-house corporate tax or Big 4 tax managers. ASC 740 provision depth is the primary filter." },
      { must: ["indirect_tax"], profile: "Indirect / sales & use tax specialist",
        detail: "Target dedicated indirect tax professionals. Nexus, Avalara/Vertex, and multistate registrations are the filters." },
      { must: ["international", "planning"], profile: "International tax specialist",
        detail: "Target international tax professionals from multinationals or Big 4. GILTI, transfer pricing, and treaties are the filters." },
      { must: ["audits", "income_tax"], profile: "Tax controversy specialist",
        detail: "Target candidates who've defended audits. IDR response and settlement experience are the filters." }
    ],
    stackCategories: [
      { id: "tax_software", label: "Tax compliance software", placeholder: "OneSource, Corptax…",
        options: ["OneSource", "Corptax", "GoSystem", "CCH Axcess", "Lacerte", "UltraTax"] },
      { id: "provision_tools", label: "Provision tools", placeholder: "OneSource Tax Provision…",
        options: ["OneSource Tax Provision", "Corptax Provision", "Longview", "Excel"] },
      { id: "indirect_tools", label: "Indirect tax engines", placeholder: "Avalara, Vertex…",
        options: ["Avalara", "Vertex", "Sovos", "Manual"] },
      { id: "erp", label: "ERP", placeholder: "SAP, NetSuite…", options: ERP_OPTIONS },
      { id: "research", label: "Research tools", placeholder: "Checkpoint, BNA…",
        options: ["Checkpoint", "Bloomberg BNA", "CCH IntelliConnect", "LexisNexis"] }
    ],
    aiUseCases: ["Tax research", "Return review", "Nexus analysis", "Memo drafting", "Data extraction",
                 "Provision automation", "Notice response drafting"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Checkpoint Edge AI", "Blue J Tax", "Excel Copilot", "Avalara AI"],
    metrics: ["On-time filings", "Effective tax rate", "Provision accuracy", "Audit outcomes", "Penalties avoided",
              "Tax savings identified", "Compliance penalties", "Return review cycle time"],
    backgrounds: BG_COMMON.concat(["Big 4 tax", "Regional tax firm", "Multinational corporate tax"])
  },

  /* ------------------------------------------------ COMPLIANCE / RISK */
  compliance_risk: {
    label: "Compliance / Risk Manager",
    icon: "🛡️",
    tagline: "Regulatory compliance, policy, and enterprise risk",
    about: "Compliance and risk professionals make sure a company follows the laws and regulations that govern its industry — writing policies, monitoring for violations, training staff, and managing regulatory exams. In banking and healthcare especially, this is a heavily regulated, specialized function.",
    blurb: "Compliance is industry-specific: a bank BSA/AML expert is not interchangeable with a healthcare HIPAA specialist. Pin the regulatory regime first, then the depth of program ownership.",
    timePrompt: "“Between monitoring, policy work, training, and regulatory interaction — what three things carry most of the time, and roughly what percentage each?”",
    focusAreas: [
      { id: "regulatory", label: "Regulatory Compliance", icon: "📜", deepDive: {
        intro: "The regulatory regime is the single biggest filter.",
        questions: [
          { id: "regimes", type: "chips", label: "Which regulations?",
            options: ["SOX", "BSA / AML", "SEC / FINRA", "HIPAA", "GDPR / privacy", "FCPA / anti-bribery",
                      "OSHA / safety", "Government contracting (FAR/DFARS)", "Banking (OCC/FDIC/Fed)", "Insurance"] },
          { id: "industry", type: "text", label: "Industry context?", placeholder: "e.g., regional bank, medical device, defense contractor" },
          { id: "exams", type: "radio", label: "Regulatory exams / inspections?",
            options: ["Yes — regularly examined", "Occasionally", "No"] }
        ],
        tips: [
          { when: a => (a.regimes || []).includes("BSA / AML"),
            text: "BSA/AML is a distinct, in-demand specialty — target candidates with bank or fintech backgrounds and CAMS certification." },
          { when: a => a.exams === "Yes — regularly examined",
            text: "Regular examination means the client needs someone who has faced regulators directly — ask for specific exam experience." }
        ] } },
      { id: "policy", label: "Policy & Procedure", icon: "📝", deepDive: {
        intro: "Writing versus enforcing policy.",
        questions: [
          { id: "scope", type: "chips", label: "Policy responsibilities?",
            options: ["Write policies", "Update / maintain", "Enforce", "Gap assessment", "Map to regulations"] },
          { id: "state", type: "radio", label: "State of current policies?",
            options: ["Mature and current", "Outdated", "Being built from scratch", "Not sure"] }
        ],
        tips: [
          { when: a => a.state === "Being built from scratch",
            text: "Building a program from scratch is different from maintaining one — target candidates who've stood up a compliance function." }
        ] } },
      { id: "monitoring", label: "Monitoring & Testing", icon: "📡", deepDive: {
        intro: "How compliance is actually verified.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Transaction monitoring", "Compliance testing", "Issue tracking", "Root cause analysis", "Reporting to committees"] },
          { id: "frequency", type: "radio", label: "Testing cadence?",
            options: ["Continuous", "Monthly / quarterly", "Annual", "Ad hoc"] }
        ], tips: [] } },
      { id: "erm", label: "Enterprise Risk Management", icon: "🎲", deepDive: {
        intro: "Broader risk work beyond regulatory compliance.",
        questions: [
          { id: "scope", type: "chips", label: "Risk responsibilities?",
            options: ["Risk assessments", "Risk register / taxonomy", "Third-party / vendor risk", "Business continuity",
                      "Operational risk", "Risk appetite framework"] },
          { id: "framework", type: "chips", label: "Frameworks?",
            options: ["COSO ERM", "ISO 31000", "NIST", "Basel", "None formal"] }
        ], tips: [] } },
      { id: "training", label: "Training & Culture", icon: "🎓", deepDive: {
        intro: "Employee-facing compliance work.",
        questions: [
          { id: "scope", type: "chips", label: "What's expected?",
            options: ["Build training content", "Deliver training", "Track completion", "Culture / awareness campaigns", "Code of conduct"] }
        ], tips: [] } },
      { id: "investigations", label: "Investigations & Reporting", icon: "🔎", deepDive: {
        intro: "Handling issues when they surface.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Internal investigations", "Hotline / whistleblower", "SAR filing", "Regulatory reporting", "Coordinate with legal"] },
          { id: "volume", type: "text", label: "Typical case volume?", placeholder: "e.g., 5–10 investigations per year" }
        ], tips: [] } },
      { id: "credentials", label: "Certifications", icon: "🏅", deepDive: {
        intro: "Certifications matter more in compliance than most finance roles.",
        questions: [
          { id: "certs", type: "chips", label: "Which certifications?",
            options: ["CAMS", "CRCM", "CCEP", "CISA", "CIA", "CFE", "CIPP", "None required"] },
          { id: "requirement", type: "radio", label: "How firm?", options: ["Required", "Preferred", "Nice to have"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Chief Compliance Officer", overlapsArea: "regulatory" },
      { label: "Compliance Analysts", overlapsArea: "monitoring" },
      { label: "Internal Audit", overlapsArea: "monitoring" },
      { label: "Legal / General Counsel", overlapsArea: "investigations" },
      { label: "Risk Manager", overlapsArea: "erm" },
      { label: "Information Security", overlapsArea: null }
    ],
    profileRules: [
      { must: ["regulatory", "monitoring"], profile: "Regulatory compliance specialist",
        detail: "Target compliance professionals from the same regulated industry. Exam experience and the specific regime are the filters." },
      { must: ["erm", "policy"], profile: "Enterprise risk manager",
        detail: "Target ERM professionals with framework experience. Risk assessment and governance are the filters." },
      { must: ["investigations", "regulatory"], profile: "Investigations / financial crime specialist",
        detail: "Target BSA/AML or fraud investigators. CAMS/CFE credentials and case experience are the filters." }
    ],
    stackCategories: [
      { id: "grc", label: "GRC platforms", placeholder: "Archer, LogicGate…",
        options: ["Archer", "LogicGate", "ServiceNow GRC", "MetricStream", "Workiva", "AuditBoard"] },
      { id: "monitoring_tools", label: "Monitoring / screening", placeholder: "Actimize, Verafin…",
        options: ["NICE Actimize", "Verafin", "Fenergo", "LexisNexis", "World-Check", "In-house"] },
      { id: "training_tools", label: "Training platforms", placeholder: "NAVEX, KnowBe4…",
        options: ["NAVEX", "KnowBe4", "Skillsoft", "In-house LMS"] },
      { id: "case_mgmt", label: "Case management", placeholder: "EthicsPoint, i-Sight…",
        options: ["EthicsPoint", "i-Sight", "ServiceNow", "Excel / manual"] }
    ],
    aiUseCases: ["Regulatory change monitoring", "Policy drafting", "Transaction monitoring", "Investigation support",
                 "Training content", "Risk assessment", "Document review"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Archer AI", "Actimize AI", "Regulatory intelligence tools"],
    metrics: ["Exam / audit findings", "Policy currency", "Training completion", "Issue closure rate",
              "Regulatory penalties", "Risk assessment coverage", "Investigation cycle time"],
    backgrounds: BG_COMMON.concat(["Banking / credit union", "Insurance", "Broker-dealer", "Healthcare provider", "Defense / government contractor"])
  },

  /* --------------------------------------------- FINANCIAL SYSTEMS */
  financial_systems: {
    label: "Financial Systems Analyst",
    icon: "⚙️",
    tagline: "ERP implementation, integrations, and finance process automation",
    about: "Financial systems analysts sit between accounting and IT — they configure and support the systems finance runs on (ERP, planning, reporting tools), lead implementations and upgrades, and automate manual processes. They speak both accounting and technology, which is why they're hard to find.",
    blurb: "This role lives between finance and IT — the pool is small because it requires both. Pin the specific system, whether it's implementation or support, and how technical the client actually needs them to be.",
    timePrompt: "“Between implementation work, day-to-day support, reporting build, and process automation — what three things carry most of the time, and roughly what percentage each?”",
    focusAreas: [
      { id: "erp_implementation", label: "ERP Implementation", icon: "🚀", deepDive: {
        intro: "Implementation experience on a specific platform is the hardest filter.",
        questions: [
          { id: "system", type: "chips", label: "Which system?", options: ERP_OPTIONS },
          { id: "phase", type: "chips", label: "Which phase?",
            options: ["Selection / RFP", "Design / blueprint", "Configuration", "Data migration", "Testing / UAT", "Go-live / hypercare", "Post-go-live optimization"] },
          { id: "role", type: "radio", label: "Their role?",
            options: ["Lead the finance workstream", "Functional analyst / configurer", "Business user / SME", "Project manager"] },
          { id: "timeline", type: "text", label: "Project timeline?", placeholder: "e.g., go-live targeted for January" }
        ],
        tips: [
          { when: a => (a.phase || []).includes("Data migration"),
            text: "Data migration is where implementations fail — screen specifically for candidates who've mapped and validated finance data conversions." },
          { when: a => a.role === "Lead the finance workstream",
            text: "Leading a workstream requires prior full-cycle implementation experience on that system — treat it as a hard requirement." }
        ] } },
      { id: "system_support", label: "System Support & Administration", icon: "🔧", deepDive: {
        intro: "Day-to-day ownership of the finance systems.",
        questions: [
          { id: "scope", type: "chips", label: "Support responsibilities?",
            options: ["User access / security roles", "Chart of accounts maintenance", "Troubleshooting", "Month-end system support",
                      "Upgrades / patches", "Vendor management"] },
          { id: "depth", type: "radio", label: "Admin depth?",
            options: ["Full system admin", "Functional configuration", "Power user"] }
        ], tips: [] } },
      { id: "integrations", label: "Integrations & Data Flow", icon: "🔌", deepDive: {
        intro: "Connecting finance systems to everything else.",
        questions: [
          { id: "systems", type: "chips", label: "What integrates?",
            options: ["CRM (Salesforce)", "Payroll / HRIS", "Banking", "Expense (Concur)", "AP automation", "Tax engines", "Data warehouse"] },
          { id: "technical", type: "radio", label: "Technical depth needed?",
            options: ["Builds integrations (API/scripting)", "Configures connectors", "Coordinates with IT"] }
        ],
        tips: [
          { when: a => a.technical === "Builds integrations (API/scripting)",
            text: "Hands-on integration building pushes this toward a technical profile — confirm whether they want a developer or a functional analyst." }
        ] } },
      { id: "reporting_build", label: "Reporting & Dashboards", icon: "📊", deepDive: {
        intro: "Building the reporting layer on top of the system.",
        questions: [
          { id: "tools", type: "chips", label: "Reporting tools?", options: REPORTING_OPTIONS },
          { id: "scope", type: "chips", label: "What do they build?",
            options: ["Financial statements", "Operational dashboards", "Ad hoc reports", "Self-service enablement", "Data models"] }
        ], tips: [] } },
      { id: "automation", label: "Process Automation", icon: "⚡", deepDive: {
        intro: "Automating manual finance work.",
        questions: [
          { id: "scope", type: "chips", label: "Automation scope?",
            options: ["Close automation", "AP / invoice automation", "Reconciliation automation", "Reporting automation", "RPA / bots"] },
          { id: "tools", type: "chips", label: "Automation tools?",
            options: ["Power Automate", "UiPath", "Alteryx", "BlackLine", "Excel macros / VBA", "Python"] }
        ], tips: [] } },
      { id: "accounting_knowledge", label: "Accounting Knowledge", icon: "📘", deepDive: {
        intro: "How much real accounting they need to know.",
        questions: [
          { id: "depth", type: "radio", label: "Accounting depth required?",
            options: ["Strong — must understand the close and GAAP", "Moderate — understands finance processes", "Light — technical role"] },
          { id: "background", type: "radio", label: "Preferred background?",
            options: ["Accountant who learned systems", "IT person who learned finance", "Either"] }
        ],
        tips: [
          { when: a => a.depth === "Strong — must understand the close and GAAP",
            text: "Requiring real accounting depth plus system skills is the classic unicorn ask — flag it early and discuss which side matters more." }
        ] } },
      { id: "project_management", label: "Project & Change Management", icon: "🗓️", deepDive: {
        intro: "Leading people through system change.",
        questions: [
          { id: "scope", type: "chips", label: "PM responsibilities?",
            options: ["Project planning", "Stakeholder management", "Training / documentation", "Change management", "Vendor coordination"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "IT / ERP team", overlapsArea: "system_support" },
      { label: "Controller / accounting team", overlapsArea: "accounting_knowledge" },
      { label: "FP&A team", overlapsArea: "reporting_build" },
      { label: "Implementation partner / consultants", overlapsArea: "erp_implementation" },
      { label: "Data / BI Analyst", overlapsArea: "reporting_build" },
      { label: "Project Manager", overlapsArea: "project_management" }
    ],
    profileRules: [
      { must: ["erp_implementation", "accounting_knowledge"], profile: "ERP implementation consultant (finance)",
        detail: "Target consultants who've run finance workstreams on that exact ERP. Full-cycle implementations are the filter." },
      { must: ["system_support", "reporting_build"], profile: "Financial systems administrator",
        detail: "Target in-house systems analysts. Platform admin depth and reporting build-out are the filters." },
      { must: ["integrations", "automation"], profile: "Finance automation / technical analyst",
        detail: "Target technically strong analysts. API/RPA/Alteryx skills and delivered automations are the filters." }
    ],
    stackCategories: [
      { id: "erp", label: "ERP", placeholder: "NetSuite, SAP, Workday…", options: ERP_OPTIONS },
      { id: "reporting", label: "Reporting / BI", placeholder: "Power BI, Hyperion…", options: REPORTING_OPTIONS },
      { id: "automation_tools", label: "Automation tools", placeholder: "Power Automate, UiPath…",
        options: ["Power Automate", "UiPath", "Alteryx", "BlackLine", "VBA", "Python"] },
      { id: "integration_tools", label: "Integration / data", placeholder: "Boomi, MuleSoft, SQL…",
        options: ["Boomi", "MuleSoft", "Celigo", "SQL", "REST APIs", "Snowflake"] }
    ],
    aiUseCases: ["Configuration documentation", "Test script generation", "Data mapping", "Report building",
                 "Process documentation", "Troubleshooting", "Training materials"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Power BI Copilot", "ERP-embedded AI", "GitHub Copilot", "Alteryx AI"],
    metrics: ["Implementation milestones", "Go-live success", "System uptime", "Ticket resolution time",
              "Manual hours eliminated", "Report adoption", "Data accuracy", "User satisfaction"],
    backgrounds: BG_COMMON.concat(["ERP consulting firm", "Systems integrator", "Shared services"])
  },

  /* ------------------------------------------------------ TREASURY */
  treasury: {
    label: "Treasury Analyst / Manager",
    icon: "🏦",
    tagline: "Cash management, forecasting, debt, and banking",
    about: "Treasury manages a company's actual cash — forecasting what's coming in and out, moving money between accounts and entities, managing bank relationships and debt, and hedging currency or interest-rate risk. When cash is tight, treasury becomes the most important function in the building.",
    blurb: "Treasury ranges from daily cash positioning at a mid-size company to sophisticated hedging and debt management at a global one. Pin the complexity — multi-entity, multi-currency, debt covenants — and whether it's operational or strategic.",
    timePrompt: "“Between daily cash operations, forecasting, banking, and debt/risk work — what three things carry most of the week, and roughly what percentage each?”",
    focusAreas: [
      { id: "cash_management", label: "Cash Management", icon: "💵", deepDive: {
        intro: "Daily operational cash work.",
        questions: [
          { id: "scope", type: "chips", label: "Daily responsibilities?",
            options: ["Cash positioning", "Wire / ACH processing", "Account funding", "Concentration / sweeps", "Intercompany transfers", "Bank reconciliation"] },
          { id: "accounts", type: "text", label: "How many bank accounts / entities?", placeholder: "e.g., 40 accounts across 12 entities" },
          { id: "currencies", type: "radio", label: "Multi-currency?",
            options: ["Yes — multiple currencies", "Single currency"] }
        ],
        tips: [
          { when: a => a.currencies === "Yes — multiple currencies",
            text: "Multi-currency treasury requires FX and cross-border experience — a meaningfully smaller candidate pool." }
        ] } },
      { id: "forecasting", label: "Cash Forecasting", icon: "📉", deepDive: {
        intro: "Forecast horizon and stakes.",
        questions: [
          { id: "horizon", type: "chips", label: "Forecast horizon?",
            options: ["Daily / weekly", "13-week", "Monthly", "Annual", "Rolling"] },
          { id: "stakes", type: "radio", label: "Cash position?",
            options: ["Tight / distressed", "Adequate", "Strong / excess cash"] },
          { id: "method", type: "radio", label: "Forecast method?",
            options: ["Direct method", "Indirect method", "Both"] }
        ],
        tips: [
          { when: a => a.stakes === "Tight / distressed",
            text: "13-week cash forecasting in a tight situation is a specialist skill — target candidates from restructuring or PE-backed environments." }
        ] } },
      { id: "banking", label: "Banking Relationships", icon: "🤝", deepDive: {
        intro: "Managing the bank side.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Bank relationship management", "Account opening / closing", "Bank fee analysis", "KYC / documentation", "RFPs / bank selection"] },
          { id: "banks", type: "text", label: "Which banks?", placeholder: "e.g., JPMorgan, Wells Fargo, regional partners" }
        ], tips: [] } },
      { id: "debt_capital", label: "Debt & Capital Structure", icon: "📜", deepDive: {
        intro: "Debt work adds seniority requirements.",
        questions: [
          { id: "scope", type: "chips", label: "Debt responsibilities?",
            options: ["Covenant compliance / reporting", "Borrowing base", "Revolver management", "Refinancing support", "Interest calculations", "Lender reporting"] },
          { id: "structure", type: "chips", label: "Capital structure?",
            options: ["Revolver / ABL", "Term loan", "Bonds", "Mezzanine", "Sponsor equity", "None — debt free"] }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Borrowing base"),
            text: "Borrowing base certificates are an ABL-specific skill — target candidates from asset-based lending environments." }
        ] } },
      { id: "risk_management", label: "FX & Interest Rate Risk", icon: "📐", deepDive: {
        intro: "Hedging is a specialist layer.",
        questions: [
          { id: "scope", type: "chips", label: "Risk management scope?",
            options: ["FX hedging", "Interest rate hedging", "Commodity hedging", "Exposure analysis", "Hedge accounting (ASC 815)"] },
          { id: "instruments", type: "chips", label: "Instruments used?",
            options: ["Forwards", "Swaps", "Options", "Collars", "None"] }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Hedge accounting (ASC 815)"),
            text: "Hedge accounting is rare and technical — most treasury analysts don't have it. Confirm whether accounting or execution is the real need." }
        ] } },
      { id: "treasury_systems", label: "Treasury Systems", icon: "🖥️", deepDive: {
        intro: "TMS experience versus spreadsheet-driven treasury.",
        questions: [
          { id: "tms", type: "chips", label: "Treasury system?",
            options: ["Kyriba", "GTreasury", "FIS / Quantum", "Coupa Treasury", "Bank portals only", "Excel only"] },
          { id: "implementation", type: "radio", label: "Implementation in scope?",
            options: ["Yes — implementing a TMS", "No", "Possibly"] }
        ], tips: [] } },
      { id: "working_capital", label: "Working Capital", icon: "🔄", deepDive: {
        intro: "Optimizing the cash conversion cycle.",
        questions: [
          { id: "scope", type: "chips", label: "Working capital scope?",
            options: ["DSO / collections", "DPO / payment terms", "Inventory", "Supply chain finance", "Cash conversion cycle analysis"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Treasurer / VP Treasury", overlapsArea: "debt_capital" },
      { label: "Cash Analysts", overlapsArea: "cash_management" },
      { label: "Controller / accounting team", overlapsArea: null },
      { label: "FP&A team", overlapsArea: "forecasting" },
      { label: "AR / collections", overlapsArea: "working_capital" },
      { label: "Banking partners", overlapsArea: "banking" }
    ],
    profileRules: [
      { must: ["cash_management", "forecasting"], profile: "Operational treasury analyst",
        detail: "Target hands-on treasury analysts. Daily cash positioning and forecast accuracy are the filters." },
      { must: ["debt_capital", "forecasting"], profile: "Treasury manager (debt-focused)",
        detail: "Target candidates who've managed covenants and lender reporting. ABL/borrowing base experience is the filter." },
      { must: ["risk_management", "treasury_systems"], profile: "Technical treasury specialist",
        detail: "Target candidates with hedging and TMS experience. FX programs and Kyriba/GTreasury are the filters." }
    ],
    stackCategories: [
      { id: "tms", label: "Treasury management system", placeholder: "Kyriba, GTreasury…",
        options: ["Kyriba", "GTreasury", "FIS / Quantum", "Coupa Treasury", "Bank portals only", "Excel only"] },
      { id: "banking_platforms", label: "Banking platforms", placeholder: "JPM Access, CEO…",
        options: ["JPMorgan Access", "Wells Fargo CEO", "Bank of America CashPro", "Citi Direct", "Regional bank portals"] },
      { id: "erp", label: "ERP", placeholder: "SAP, NetSuite…", options: ERP_OPTIONS },
      { id: "analysis", label: "Analysis tools", placeholder: "Excel, Power BI…", options: REPORTING_OPTIONS }
    ],
    aiUseCases: ["Cash forecast automation", "Bank fee analysis", "Variance explanations", "Covenant tracking",
                 "Reconciliation", "Reporting", "Scenario modeling"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "Kyriba AI", "Power BI Copilot"],
    metrics: ["Forecast accuracy", "Days cash on hand", "Bank fees reduced", "Covenant compliance",
              "Cash conversion cycle", "Idle cash / yield", "Wire accuracy", "DSO / DPO"],
    backgrounds: BG_COMMON.concat(["Banking", "PE-backed / leveraged", "Multinational treasury"])
  },

  /* ------------------------------------------- FINANCE TRANSFORMATION */
  finance_transformation: {
    label: "Finance Transformation Consultant",
    icon: "🔄",
    tagline: "O2C, P2P, R2R, shared services, and process redesign",
    about: "Finance transformation consultants redesign how finance actually works — the end-to-end cycles like order-to-cash, procure-to-pay, and record-to-report. They map current processes, find the waste and the manual workarounds, and rebuild them, often alongside a system change or a shared-services move.",
    blurb: "Transformation engagements are defined by which cycle is broken and how far the mandate goes — assess and recommend, or design and implement. Pin the cycle, the scope of change, and who owns adoption after the consultant leaves.",
    timePrompt: "“Between assessment, design, implementation, and change management — what three things carry most of the engagement, and roughly what percentage each?”",
    focusAreas: [
      { id: "o2c", label: "Order to Cash (O2C)", icon: "💳", deepDive: {
        intro: "The revenue cycle — from order entry through cash application.",
        questions: [
          { id: "scope", type: "chips", label: "Which sub-processes?",
            options: ["Order management", "Billing / invoicing", "Credit management", "Collections", "Cash application", "Disputes / deductions", "Revenue recognition"] },
          { id: "pain", type: "chips", label: "Known pain points?",
            options: ["High DSO", "Manual invoicing", "Billing errors", "Slow cash application", "Poor collections process", "Disputes backlog"] },
          { id: "mandate", type: "radio", label: "Mandate?",
            options: ["Assess and recommend", "Design the future state", "Implement the change", "End to end"] }
        ],
        tips: [
          { when: a => (a.pain || []).includes("High DSO"),
            text: "DSO reduction is a measurable, board-visible win — get the current DSO and target so the consultant has a scoreboard." }
        ] } },
      { id: "p2p", label: "Procure to Pay (P2P)", icon: "🧾", deepDive: {
        intro: "The spend cycle — requisition through payment.",
        questions: [
          { id: "scope", type: "chips", label: "Which sub-processes?",
            options: ["Requisition / approval", "Purchase orders", "Vendor onboarding", "Invoice processing", "Three-way match", "Payments", "Expense management"] },
          { id: "automation", type: "radio", label: "Automation maturity?",
            options: ["Highly manual", "Partially automated", "Mostly automated"] },
          { id: "tools", type: "chips", label: "P2P tools in play?",
            options: ["Coupa", "Ariba", "Bill.com", "Concur", "Tipalti", "ERP-native", "None"] }
        ], tips: [] } },
      { id: "r2r", label: "Record to Report (R2R)", icon: "📗", deepDive: {
        intro: "The close-and-report cycle end to end.",
        questions: [
          { id: "scope", type: "chips", label: "Which sub-processes?",
            options: ["Journal entries", "Reconciliations", "Intercompany", "Consolidation", "Financial reporting", "Close calendar / governance"] },
          { id: "state", type: "radio", label: "Current state?",
            options: ["Documented and controlled", "Partially documented", "Tribal knowledge / undocumented"] }
        ],
        tips: [
          { when: a => a.state === "Tribal knowledge / undocumented",
            text: "Undocumented processes mean the first deliverable is documentation — set that expectation so the client doesn't expect immediate savings." }
        ] } },
      { id: "close_acceleration", label: "Accounting Close Acceleration", icon: "⏱️", deepDive: {
        intro: "A named MR capability — compressing the close.",
        questions: [
          { id: "current", type: "select", label: "Current close duration?",
            options: ["1–3 days", "4–5 days", "6–10 days", "10+ days", "Not sure"] },
          { id: "target", type: "text", label: "Target close duration?", placeholder: "e.g., 5 days by year-end" },
          { id: "levers", type: "chips", label: "Levers in scope?",
            options: ["Task standardization", "Automation / tooling", "Pre-close activities", "Materiality thresholds",
                      "Reconciliation redesign", "Org / role changes", "System configuration"] }
        ],
        tips: [
          { when: a => ["10+ days"].includes(a.current),
            text: "A 10+ day close usually has structural causes — staffing, systems, or data. Make sure the client isn't expecting a consultant to fix it by working harder." }
        ] } },
      { id: "shared_services", label: "Shared Services Optimization", icon: "🏢", deepDive: {
        intro: "Centralizing or improving a shared-services organization.",
        questions: [
          { id: "stage", type: "radio", label: "Stage?",
            options: ["Building a new SSC", "Optimizing an existing SSC", "Migrating work into an SSC", "Evaluating outsourcing"] },
          { id: "scope", type: "chips", label: "Functions in scope?",
            options: ["AP", "AR", "Payroll", "General accounting", "Travel & expense", "Master data"] },
          { id: "geography", type: "text", label: "Locations involved?", placeholder: "e.g., US + Manila captive center" }
        ],
        tips: [
          { when: a => a.stage === "Building a new SSC",
            text: "Standing up a shared-services center is a multi-workstream program — confirm whether they need one consultant or a team, and who owns change management." }
        ] } },
      { id: "ma_integration", label: "M&A Integration & Carve-Outs", icon: "🤝", deepDive: {
        intro: "Deal-driven finance work on a fixed timeline.",
        questions: [
          { id: "type", type: "radio", label: "Transaction type?",
            options: ["Acquisition integration", "Carve-out / divestiture", "Merger of equals", "Multiple / roll-up"] },
          { id: "scope", type: "chips", label: "Finance scope?",
            options: ["Chart of accounts harmonization", "Systems integration", "Process alignment", "Opening balance sheet",
                      "TSA management", "Standalone cost modeling", "Day-1 readiness"] },
          { id: "timeline", type: "text", label: "Deal timeline?", placeholder: "e.g., close 9/30, Day 1 integration 10/1" }
        ],
        tips: [
          { when: a => a.type === "Carve-out / divestiture",
            text: "Carve-outs require standalone cost and TSA experience — a distinct skill from integration. Screen for the specific side of the deal." }
        ] } },
      { id: "process_improvement", label: "Process Improvement & Controls", icon: "⚡", deepDive: {
        intro: "General process redesign and the controls that come with it.",
        questions: [
          { id: "methodology", type: "chips", label: "Methodology expected?",
            options: ["Lean / Six Sigma", "Process mapping (BPMN)", "RPA / automation", "Benchmarking", "No formal method"] },
          { id: "deliverables", type: "chips", label: "Deliverables?",
            options: ["Current-state assessment", "Future-state design", "SOPs / documentation", "Roadmap / business case", "Implemented change"] },
          { id: "savings", type: "text", label: "Savings or efficiency target?", placeholder: "e.g., 20% reduction in manual hours" }
        ], tips: [] } }
    ],
    specialists: [
      { label: "Controller / accounting team", overlapsArea: "r2r" },
      { label: "AP / P2P team", overlapsArea: "p2p" },
      { label: "AR / collections team", overlapsArea: "o2c" },
      { label: "Shared services leadership", overlapsArea: "shared_services" },
      { label: "PMO / project managers", overlapsArea: "process_improvement" },
      { label: "IT / systems team", overlapsArea: null },
      { label: "Internal Audit", overlapsArea: "process_improvement" }
    ],
    profileRules: [
      { must: ["o2c", "p2p"], profile: "Transactional cycle specialist",
        detail: "Target consultants who've redesigned O2C or P2P end to end. Cycle metrics (DSO, invoice cost) are the filters." },
      { must: ["r2r", "close_acceleration"], profile: "Close acceleration consultant",
        detail: "Target consultants with documented close-compression wins. Ask for the before/after days and how they got there." },
      { must: ["ma_integration", "process_improvement"], profile: "M&A integration consultant",
        detail: "Target Big 4 transaction-services or corporate development finance backgrounds. Day-1 readiness and TSAs are the filters." },
      { must: ["shared_services", "process_improvement"], profile: "Shared services / operating model consultant",
        detail: "Target consultants who've built or optimized an SSC. Migration and change management are the filters." }
    ],
    stackCategories: [
      { id: "erp", label: "ERP", placeholder: "SAP, Oracle, NetSuite…", options: ERP_OPTIONS },
      { id: "p2p_tools", label: "P2P / AP automation", placeholder: "Coupa, Ariba, Bill.com…",
        options: ["Coupa", "Ariba", "Bill.com", "Concur", "Tipalti", "Esker", "AvidXchange"] },
      { id: "o2c_tools", label: "O2C / billing tools", placeholder: "HighRadius, Zuora…",
        options: ["HighRadius", "Zuora", "Salesforce CPQ", "BillingPlatform", "ERP-native"] },
      { id: "close_tools", label: "Close / automation", placeholder: "BlackLine, FloQast…",
        options: ["BlackLine", "FloQast", "Trintech", "Power Automate", "UiPath", "Alteryx"] },
      { id: "process_tools", label: "Process / PM tools", placeholder: "Visio, Lucidchart, Jira…",
        options: ["Visio", "Lucidchart", "Celonis", "Signavio", "Jira", "Smartsheet"] }
    ],
    aiUseCases: ["Process documentation", "Current-state analysis", "Invoice / document processing", "Anomaly detection",
                 "SOP drafting", "Business case modeling", "Workflow automation"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Power Automate", "UiPath", "Celonis process mining", "Alteryx AI"],
    metrics: ["Close cycle time", "DSO / DPO", "Cost per invoice", "Manual hours eliminated", "Process cycle time",
              "Cost savings delivered", "Automation rate", "Day-1 readiness", "Error / rework rate"],
    backgrounds: BG_COMMON.concat(["Big 4 consulting", "Transaction services", "Shared services center", "ERP consulting firm"])
  },

  /* ----------------------------------------------- EPM / DATA & ANALYTICS */
  epm_data: {
    label: "EPM / Data & Analytics Consultant",
    icon: "🧠",
    tagline: "EPM tools, BI, data integration, and AI readiness",
    about: "These consultants build the reporting and planning layer finance runs on — implementing EPM tools like Hyperion, OneStream, or Anaplan, building BI dashboards, and integrating or migrating financial data between systems. Increasingly they also prepare a company's data so it's clean and governed enough for AI to use.",
    blurb: "This is the Data, Systems & ERP pillar — part finance, part data engineering. Pin the specific platform, whether it's implementation or reporting build-out, and how much data plumbing versus analysis the client actually needs.",
    timePrompt: "“Between tool implementation, data work, report building, and enabling users — what three things carry most of the engagement, and roughly what percentage each?”",
    focusAreas: [
      { id: "epm_tools", label: "EPM Tools & Implementation", icon: "🛠️", deepDive: {
        intro: "The platform is the single hardest filter on this pool.",
        questions: [
          { id: "platform", type: "chips", label: "Which EPM platform?",
            options: ["Hyperion / HFM", "OneStream", "Anaplan", "Adaptive Insights", "Planful", "Vena", "SAP BPC", "Oracle EPM Cloud"] },
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["New implementation", "Upgrade / migration", "Model build", "Consolidation build", "Planning / budgeting build", "Admin & support"] },
          { id: "role", type: "radio", label: "Their role?",
            options: ["Lead consultant / architect", "Build and configure", "Support existing model", "Business SME"] }
        ],
        tips: [
          { when: a => (a.platform || []).includes("OneStream") || (a.platform || []).includes("Anaplan"),
            text: "OneStream and Anaplan certified builders are scarce and command premium rates — confirm certification requirements and reset budget early." }
        ] } },
      { id: "data_integration", label: "Data Integration & Migration", icon: "🔀", deepDive: {
        intro: "Moving and connecting financial data between systems.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["ERP data migration", "System-to-system integration", "Data mapping", "Data cleansing", "Historical conversion", "Validation / reconciliation"] },
          { id: "sources", type: "text", label: "Which systems are being connected?", placeholder: "e.g., NetSuite → Snowflake → Power BI" },
          { id: "technical", type: "radio", label: "Technical depth needed?",
            options: ["Builds pipelines (SQL/ETL)", "Configures integration tools", "Defines requirements only"] }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Historical conversion"),
            text: "Historical data conversion is where migrations blow up — screen for candidates who've reconciled converted balances, not just moved files." }
        ] } },
      { id: "reporting_bi", label: "Reporting & BI", icon: "📊", deepDive: {
        intro: "Building the reporting layer that finance and the business consume.",
        questions: [
          { id: "tools", type: "chips", label: "BI tools?", options: REPORTING_OPTIONS },
          { id: "deliverables", type: "chips", label: "What do they build?",
            options: ["Executive dashboards", "Financial statements", "Operational KPIs", "Self-service models", "Data models / semantic layer"] },
          { id: "audience", type: "radio", label: "Primary audience?",
            options: ["Executives / board", "Finance team", "Business operators", "All of the above"] }
        ], tips: [] } },
      { id: "ai_readiness", label: "Data Readiness for AI", icon: "🤖", deepDive: {
        intro: "A named MR capability — getting data governed and clean enough for AI.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Data quality assessment", "Data governance / ownership", "Master data management", "Taxonomy / metadata",
                      "Data lineage & documentation", "Security & access controls", "AI use-case identification"] },
          { id: "maturity", type: "radio", label: "Current data maturity?",
            options: ["Ad hoc / spreadsheets", "Some governance", "Governed and documented", "Not sure"] },
          { id: "ai_goal", type: "textarea", label: "What does the client want AI to do eventually?",
            placeholder: "Forecasting, anomaly detection, close automation, self-service analytics…" }
        ],
        tips: [
          { when: a => a.maturity === "Ad hoc / spreadsheets",
            text: "If the data lives in spreadsheets, AI readiness is really a governance and infrastructure project — scope it as foundational work, not an AI build." },
          { when: (a, s) => areaPriority(s, "ai_readiness") === "must",
            text: "Data readiness for AI is a newer positioning for MR — make sure the client and the consultant agree on whether the deliverable is governance or working models." }
        ] } },
      { id: "master_data", label: "Master Data & Chart of Accounts", icon: "🗂️", deepDive: {
        intro: "Structural data work that underpins everything else.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Chart of accounts redesign", "Cost center / hierarchy structure", "Vendor / customer master",
                      "Product master", "Data standards", "Governance process"] },
          { id: "driver", type: "radio", label: "What's driving it?",
            options: ["ERP implementation", "M&A harmonization", "Reporting problems", "Cleanup / hygiene"] }
        ], tips: [] } },
      { id: "analytics_build", label: "Advanced Analytics", icon: "📈", deepDive: {
        intro: "Beyond dashboards — modeling and statistical analysis.",
        questions: [
          { id: "scope", type: "chips", label: "Analytics scope?",
            options: ["Predictive modeling", "Scenario analysis", "Driver-based models", "Statistical analysis", "Machine learning"] },
          { id: "tools", type: "chips", label: "Tools?",
            options: ["Python", "R", "SQL", "Alteryx", "Excel", "Databricks", "Snowflake"] }
        ],
        tips: [
          { when: a => (a.tools || []).includes("Python") || (a.tools || []).includes("R"),
            text: "Python/R requirements move this toward a data-science profile — confirm whether the client needs a finance analyst or a data scientist." }
        ] } },
      { id: "enablement", label: "User Enablement & Documentation", icon: "🎓", deepDive: {
        intro: "Making the build stick after the consultant leaves.",
        questions: [
          { id: "scope", type: "chips", label: "What's expected?",
            options: ["Training delivery", "Documentation / runbooks", "Train-the-trainer", "Ongoing support handoff", "Adoption tracking"] }
        ], tips: [] } }
    ],
    specialists: [
      { label: "FP&A team", overlapsArea: "reporting_bi" },
      { label: "IT / data engineering", overlapsArea: "data_integration" },
      { label: "BI / Data Analyst", overlapsArea: "reporting_bi" },
      { label: "ERP / systems team", overlapsArea: "epm_tools" },
      { label: "Data governance lead", overlapsArea: "ai_readiness" },
      { label: "Implementation partner", overlapsArea: "epm_tools" }
    ],
    profileRules: [
      { must: ["epm_tools", "enablement"], profile: "EPM implementation consultant",
        detail: "Target certified consultants on the named platform. Full-cycle implementations and model builds are the filters." },
      { must: ["data_integration", "master_data"], profile: "Finance data / integration consultant",
        detail: "Target consultants who've run data conversions. Mapping, cleansing, and reconciliation of converted data are the filters." },
      { must: ["reporting_bi", "analytics_build"], profile: "Finance analytics consultant",
        detail: "Target analysts who build the reporting layer. BI tool depth plus finance fluency are the filters." },
      { must: ["ai_readiness", "master_data"], profile: "Data governance / AI readiness consultant",
        detail: "Target consultants with governance and MDM experience. Data quality frameworks and stewardship models are the filters." }
    ],
    stackCategories: [
      { id: "epm", label: "EPM platforms", placeholder: "OneStream, Anaplan…",
        options: ["Hyperion / HFM", "OneStream", "Anaplan", "Adaptive Insights", "Planful", "Vena", "SAP BPC", "Oracle EPM Cloud"] },
      { id: "bi", label: "BI / visualization", placeholder: "Power BI, Tableau…", options: REPORTING_OPTIONS },
      { id: "data_platform", label: "Data platform", placeholder: "Snowflake, Databricks…",
        options: ["Snowflake", "Databricks", "Azure Synapse", "BigQuery", "Redshift", "SQL Server"] },
      { id: "integration_tools", label: "Integration / ETL", placeholder: "Boomi, Alteryx, SQL…",
        options: ["Boomi", "MuleSoft", "Alteryx", "Informatica", "Fivetran", "SQL", "Power Query"] },
      { id: "erp", label: "ERP source systems", placeholder: "SAP, NetSuite…", options: ERP_OPTIONS }
    ],
    aiUseCases: ["Data quality assessment", "Report building", "Model documentation", "Data mapping",
                 "Forecast automation", "Anomaly detection", "Self-service enablement"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Power BI Copilot", "Databricks AI", "Alteryx AI",
              "OneStream / Anaplan AI", "Snowflake Cortex"],
    metrics: ["Implementation milestones", "Report adoption", "Data quality scores", "Forecast accuracy",
              "Manual reporting hours eliminated", "System uptime", "User satisfaction", "Time to insight"],
    backgrounds: BG_COMMON.concat(["EPM consulting firm", "Big 4 consulting", "Systems integrator", "Data / analytics consultancy"])
  },

  /* --------------------------------------- PROJECT & CHANGE MANAGEMENT */
  project_change: {
    label: "Project / Change Management Consultant",
    icon: "🗓️",
    tagline: "Finance PMO, program delivery, and change adoption",
    about: "These consultants run the finance side of major projects — system implementations, transformations, integrations — keeping workstreams, timelines, and stakeholders coordinated. The change-management half focuses on the people side: making sure the new process is actually adopted rather than worked around.",
    blurb: "Finance PMO roles range from a scheduler tracking a plan to a program lead who owns delivery across workstreams. Pin the authority level, the program type, and whether change management is genuinely in scope or an afterthought.",
    timePrompt: "“Between planning, stakeholder management, execution oversight, and change/adoption work — what three things carry most of the week, and roughly what percentage each?”",
    focusAreas: [
      { id: "program_delivery", label: "Program & Project Delivery", icon: "📋", deepDive: {
        intro: "What they're actually delivering and how much they own.",
        questions: [
          { id: "program_type", type: "chips", label: "Program type?",
            options: ["ERP implementation", "EPM / reporting implementation", "Finance transformation", "M&A integration",
                      "Shared services build", "Close acceleration", "Compliance / remediation"] },
          { id: "authority", type: "radio", label: "Authority level?",
            options: ["Owns delivery — program lead", "Manages a workstream", "Coordinates / tracks", "PMO support"] },
          { id: "scale", type: "text", label: "Program scale?", placeholder: "e.g., 6 workstreams, 40 people, $3M budget" }
        ],
        tips: [
          { when: a => a.authority === "Owns delivery — program lead",
            text: "Program-lead authority requires someone who's carried a program end to end — ask what went wrong on their last one and how they handled it." }
        ] } },
      { id: "change_management", label: "Change Management & Adoption", icon: "🔁", deepDive: {
        intro: "The people side — a named MR capability.",
        questions: [
          { id: "scope", type: "chips", label: "Change scope?",
            options: ["Stakeholder analysis", "Communications plan", "Training strategy", "Adoption measurement",
                      "Resistance management", "Org design / role changes"] },
          { id: "methodology", type: "chips", label: "Methodology?",
            options: ["Prosci / ADKAR", "Kotter", "In-house framework", "No formal method"] },
          { id: "impact", type: "text", label: "How many people are affected?", placeholder: "e.g., 200 finance and ops users across 3 sites" }
        ],
        tips: [
          { when: a => (a.methodology || []).includes("Prosci / ADKAR"),
            text: "Prosci certification is a real credential in change management — treat it as a filter if the client named it." },
          { when: (a, s) => areaPriority(s, "change_management") === "must",
            text: "If change management is a must-have, confirm the client will actually fund communications and training — otherwise the consultant gets blamed for poor adoption." }
        ] } },
      { id: "stakeholders", label: "Stakeholder & Executive Management", icon: "🤝", deepDive: {
        intro: "Who they manage up to and across.",
        questions: [
          { id: "audience", type: "chips", label: "Stakeholders?",
            options: ["C-suite / steering committee", "Finance leadership", "IT leadership", "Business unit leaders",
                      "External vendors / SI", "Board"] },
          { id: "reporting", type: "chips", label: "Reporting cadence?",
            options: ["Weekly status", "Steering committee decks", "Executive dashboards", "Ad hoc escalation"] }
        ], tips: [] } },
      { id: "planning_governance", label: "Planning & Governance", icon: "🧭", deepDive: {
        intro: "The mechanics of running the program.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Project plan / schedule", "RAID log (risks, issues)", "Budget tracking", "Resource planning",
                      "Vendor / SOW management", "Governance framework", "Status reporting"] },
          { id: "methodology", type: "radio", label: "Delivery methodology?",
            options: ["Waterfall", "Agile", "Hybrid", "Whatever works"] }
        ], tips: [] } },
      { id: "testing_cutover", label: "Testing & Cutover", icon: "🚦", deepDive: {
        intro: "Getting from build to live without breaking the close.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["UAT coordination", "Test script development", "Defect triage", "Cutover planning",
                      "Parallel run", "Hypercare / post-go-live"] },
          { id: "timing", type: "text", label: "Go-live timing?", placeholder: "e.g., cutover over year-end close" }
        ],
        tips: [
          { when: a => (a.scope || []).includes("Parallel run"),
            text: "A parallel run doubles the workload for the finance team during the transition — make sure staffing accounts for it." }
        ] } },
      { id: "finance_sme", label: "Finance Subject-Matter Depth", icon: "📘", deepDive: {
        intro: "How much finance knowledge the PM personally needs.",
        questions: [
          { id: "depth", type: "radio", label: "Finance depth required?",
            options: ["Strong — must understand accounting/close", "Moderate — understands finance processes", "Light — pure PM"] },
          { id: "certs", type: "chips", label: "Certifications?",
            options: ["PMP", "Prosci", "CPA", "Agile / Scrum", "Six Sigma", "None required"] }
        ],
        tips: [
          { when: a => a.depth === "Strong — must understand accounting/close",
            text: "A PM who genuinely knows accounting is rare — that's the whole reason to source through Management Resources rather than a generic PMO firm." }
        ] } }
    ],
    specialists: [
      { label: "PMO / other project managers", overlapsArea: "planning_governance" },
      { label: "Business analysts", overlapsArea: "testing_cutover" },
      { label: "Controller / accounting team", overlapsArea: "finance_sme" },
      { label: "IT project team", overlapsArea: null },
      { label: "Systems integrator / vendor", overlapsArea: "program_delivery" },
      { label: "Change / training team", overlapsArea: "change_management" }
    ],
    profileRules: [
      { must: ["program_delivery", "finance_sme"], profile: "Finance program manager",
        detail: "Target PMs who've led finance system or transformation programs. Finance depth plus delivery track record are the filters." },
      { must: ["change_management", "stakeholders"], profile: "Change management consultant",
        detail: "Target Prosci-certified change practitioners. Adoption outcomes and communications experience are the filters." },
      { must: ["testing_cutover", "planning_governance"], profile: "Implementation / cutover PM",
        detail: "Target PMs who've run UAT and go-live for finance systems. Cutover planning and hypercare are the filters." }
    ],
    stackCategories: [
      { id: "pm_tools", label: "PM / tracking tools", placeholder: "MS Project, Jira, Smartsheet…",
        options: ["MS Project", "Jira", "Smartsheet", "Asana", "Monday", "Planview", "Excel"] },
      { id: "collab", label: "Collaboration / docs", placeholder: "Confluence, SharePoint…",
        options: ["Confluence", "SharePoint", "Notion", "Teams", "Miro"] },
      { id: "erp", label: "Systems being implemented", placeholder: "SAP, NetSuite, OneStream…", options: ERP_OPTIONS },
      { id: "reporting", label: "Reporting / dashboards", placeholder: "Power BI, Excel…", options: REPORTING_OPTIONS }
    ],
    aiUseCases: ["Status report drafting", "Meeting summaries", "Risk analysis", "Plan / timeline drafting",
                 "Training material creation", "Communications drafting", "Documentation"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Jira / Atlassian Intelligence", "Notion AI", "AI meeting notes (Otter / Fireflies)"],
    metrics: ["On-time delivery", "On-budget delivery", "Go-live success", "Adoption / utilization rate",
              "Scope adherence", "Defect / rework rate", "Stakeholder satisfaction", "Milestone completion"],
    backgrounds: BG_COMMON.concat(["Big 4 consulting", "Systems integrator", "Internal PMO", "Change management consultancy"])
  },

  /* ------------------------------------------ SUPPLY CHAIN & PROCUREMENT */
  supply_chain: {
    label: "Supply Chain & Procurement Consultant",
    icon: "📦",
    tagline: "Sourcing, spend analytics, inventory, and cost reduction",
    about: "These consultants work the cost side of the business — analyzing what a company buys and from whom, renegotiating supplier contracts, and optimizing inventory so cash isn't tied up on shelves. It sits between finance and operations, and the deliverable is usually measurable savings.",
    blurb: "This is the cost-and-operations edge of the Performance Optimization pillar. Pin whether the mandate is analysis (find the savings) or execution (go negotiate them), and how much operations versus finance experience the client actually needs.",
    timePrompt: "“Between spend analysis, sourcing/negotiation, inventory work, and process improvement — what three things carry most of the engagement, and roughly what percentage each?”",
    focusAreas: [
      { id: "spend_analytics", label: "Spend Analytics", icon: "📉", deepDive: {
        intro: "Understanding where the money actually goes.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Spend cube / categorization", "Supplier rationalization", "Tail spend analysis",
                      "Savings opportunity identification", "Benchmarking", "Contract compliance / leakage"] },
          { id: "spend_size", type: "select", label: "Addressable spend?",
            options: ["Under $10M", "$10M–$50M", "$50M–$250M", "$250M–$1B", "$1B+", "Unknown"] },
          { id: "data_state", type: "radio", label: "State of spend data?",
            options: ["Clean and categorized", "Messy / needs cleansing", "Scattered across systems", "Not sure"] }
        ],
        tips: [
          { when: a => a.data_state === "Scattered across systems",
            text: "If spend data is scattered, the first month is data cleansing, not savings — set that expectation so nobody expects quick wins." }
        ] } },
      { id: "sourcing", label: "Strategic Sourcing & Negotiation", icon: "🤝", deepDive: {
        intro: "Execution side — running events and negotiating deals.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["RFP / RFQ events", "Supplier negotiation", "Contract redlining", "Category strategy",
                      "Supplier consolidation", "Should-cost modeling"] },
          { id: "categories", type: "chips", label: "Which categories?",
            options: ["Direct materials", "Indirect / MRO", "IT & telecom", "Professional services", "Logistics / freight",
                      "Facilities", "Travel", "Marketing"] },
          { id: "authority", type: "radio", label: "Negotiating authority?",
            options: ["Leads negotiations", "Supports the client's negotiator", "Analysis only"] }
        ],
        tips: [
          { when: a => (a.categories || []).includes("Direct materials"),
            text: "Direct materials sourcing requires industry and manufacturing knowledge — a very different profile from indirect/professional services buyers." }
        ] } },
      { id: "inventory", label: "Inventory & Working Capital", icon: "🏭", deepDive: {
        intro: "Where supply chain and finance meet on the balance sheet.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Inventory optimization", "Excess & obsolete analysis", "Safety stock / reorder points",
                      "Demand planning", "S&OP process", "Inventory accounting / costing"] },
          { id: "issue", type: "radio", label: "Primary issue?",
            options: ["Too much inventory / cash tied up", "Stockouts / service issues", "Inaccurate counts", "Costing problems"] }
        ],
        tips: [
          { when: a => a.issue === "Too much inventory / cash tied up",
            text: "Inventory reduction is a cash-release story — get the current inventory value and turns so the consultant has a measurable target." }
        ] } },
      { id: "procurement_ops", label: "Procurement Operations", icon: "⚙️", deepDive: {
        intro: "The process and systems side of buying.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["P2P process redesign", "Procurement policy", "Approval workflows", "Supplier onboarding",
                      "Catalog management", "System implementation"] },
          { id: "tools", type: "chips", label: "Procurement systems?",
            options: ["Coupa", "Ariba", "Jaggaer", "GEP", "Ivalua", "ERP-native", "None"] }
        ], tips: [] } },
      { id: "supplier_risk", label: "Supplier Risk & Performance", icon: "🛡️", deepDive: {
        intro: "Managing the supply base beyond price.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Supplier risk assessment", "Performance scorecards", "Diversity spend", "ESG / sustainability",
                      "Business continuity", "Single-source mitigation"] }
        ], tips: [] } },
      { id: "cost_reduction", label: "Cost Reduction Programs", icon: "✂️", deepDive: {
        intro: "Broader cost takeout beyond procurement.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Cost takeout program", "Zero-based budgeting", "Make vs. buy analysis", "Outsourcing evaluation",
                      "Footprint / logistics optimization"] },
          { id: "target", type: "text", label: "Savings target?", placeholder: "e.g., $5M annualized within 12 months" },
          { id: "tracking", type: "radio", label: "How are savings validated?",
            options: ["Finance-validated / P&L", "Procurement-reported", "Not defined"] }
        ],
        tips: [
          { when: a => a.tracking === "Not defined",
            text: "Undefined savings validation is where these engagements go sideways — push the client to agree up front how savings hit the P&L." }
        ] } }
    ],
    specialists: [
      { label: "CPO / procurement leadership", overlapsArea: "sourcing" },
      { label: "Category managers / buyers", overlapsArea: "sourcing" },
      { label: "Supply chain / planning team", overlapsArea: "inventory" },
      { label: "FP&A team", overlapsArea: "cost_reduction" },
      { label: "Operations leadership", overlapsArea: null },
      { label: "AP / P2P team", overlapsArea: "procurement_ops" }
    ],
    profileRules: [
      { must: ["spend_analytics", "cost_reduction"], profile: "Spend / cost analytics consultant",
        detail: "Target analytical consultants who build spend cubes and savings pipelines. Data skills and validated savings are the filters." },
      { must: ["sourcing", "supplier_risk"], profile: "Strategic sourcing consultant",
        detail: "Target category sourcing professionals. Negotiated savings and category depth are the filters." },
      { must: ["inventory", "procurement_ops"], profile: "Supply chain operations consultant",
        detail: "Target consultants with planning and inventory experience. S&OP and working-capital results are the filters." }
    ],
    stackCategories: [
      { id: "procurement_tools", label: "Procurement / sourcing systems", placeholder: "Coupa, Ariba…",
        options: ["Coupa", "Ariba", "Jaggaer", "GEP", "Ivalua", "Zycus", "ERP-native"] },
      { id: "erp", label: "ERP", placeholder: "SAP, Oracle…", options: ERP_OPTIONS },
      { id: "planning_tools", label: "Supply chain planning", placeholder: "Kinaxis, o9, Blue Yonder…",
        options: ["Kinaxis", "o9", "Blue Yonder", "SAP IBP", "Excel"] },
      { id: "analytics", label: "Analytics tools", placeholder: "Power BI, Alteryx, Excel…", options: REPORTING_OPTIONS }
    ],
    aiUseCases: ["Spend classification", "Contract analysis", "Should-cost modeling", "Demand forecasting",
                 "Supplier research", "RFP drafting", "Savings tracking"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Coupa AI", "Alteryx AI", "Power BI Copilot", "Excel Copilot"],
    metrics: ["Savings delivered", "Spend under management", "Inventory turns", "Days inventory outstanding",
              "Supplier consolidation", "Contract compliance", "Cost avoidance", "Working capital released"],
    backgrounds: BG_COMMON.concat(["Procurement consulting", "Manufacturing operations", "Distribution / logistics", "Big 4 consulting"])
  },

  /* ------------------------------ TECHNICAL ACCOUNTING & IPO READINESS */
  technical_accounting: {
    label: "Technical Accounting & IPO Readiness Consultant",
    icon: "📐",
    tagline: "Complex GAAP, restatements, SEC reporting, and going public",
    about: "Technical accounting consultants handle the hard, unusual accounting questions — revenue recognition on complex contracts, acquisitions, equity structures — and write the memos that support those positions to auditors. IPO readiness is a specialty within it: getting a private company's financials, controls, and reporting to public-company standard.",
    blurb: "This is the deep end of accounting expertise — almost always Big 4-trained CPAs. Pin the specific standards, whether SEC reporting is involved, and whether the mandate is advisory (write the memo) or execution (rebuild the financials).",
    timePrompt: "“Between technical research, documentation, reporting, and audit interaction — what three things carry most of the engagement, and roughly what percentage each?”",
    focusAreas: [
      { id: "ipo_readiness", label: "IPO Readiness", icon: "🔔", deepDive: {
        intro: "A named MR capability — getting to public-company standard.",
        questions: [
          { id: "stage", type: "radio", label: "Where are they in the process?",
            options: ["Exploring / early prep", "Actively preparing (12–24 months out)", "In registration (S-1 drafting)", "Recently public"] },
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["S-1 / registration statement", "Carve-out or predecessor financials", "3-year audited financials",
                      "SOX readiness", "Public-company close calendar", "Segment reporting", "EPS / capitalization",
                      "MD&A drafting", "Comfort letter support"] },
          { id: "auditor", type: "text", label: "Auditor and underwriters?", placeholder: "e.g., audited by Deloitte, bankers TBD" }
        ],
        tips: [
          { when: a => a.stage === "In registration (S-1 drafting)",
            text: "An active S-1 is an all-hands, deadline-driven sprint — target consultants who've been through registration before and can start immediately." },
          { when: a => (a.scope || []).includes("Carve-out or predecessor financials"),
            text: "Carve-out financials are highly specialized — target Big 4 transaction services or SEC reporting specialists specifically." }
        ] } },
      { id: "revenue", label: "Revenue Recognition (ASC 606)", icon: "💵", deepDive: {
        intro: "The most commonly requested technical specialty.",
        questions: [
          { id: "complexity", type: "chips", label: "Complexity drivers?",
            options: ["Multiple performance obligations", "Variable consideration", "Principal vs. agent", "Contract modifications",
                      "Licensing / IP", "Percentage of completion", "SaaS / subscription", "Standalone selling price"] },
          { id: "scope", type: "radio", label: "Mandate?",
            options: ["Implement ASC 606", "Review existing policy", "Write memos for specific contracts", "Remediate an error"] },
          { id: "volume", type: "text", label: "Contract volume / type?", placeholder: "e.g., 200 enterprise SaaS contracts" }
        ],
        tips: [
          { when: a => a.scope === "Remediate an error",
            text: "Revenue errors often mean a restatement is in play — confirm materiality and whether the auditors have been notified." }
        ] } },
      { id: "restatements", label: "Restatements & Error Remediation", icon: "🚨", deepDive: {
        intro: "High-stakes cleanup work.",
        questions: [
          { id: "severity", type: "radio", label: "Severity?",
            options: ["Material weakness / restatement", "Significant deficiency", "Out-of-period adjustment", "Under investigation"] },
          { id: "areas", type: "chips", label: "Which areas?",
            options: ["Revenue", "Inventory", "Accruals / estimates", "Equity", "Leases", "Consolidation", "Cash flows"] },
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Root cause analysis", "Restate prior periods", "Remediate controls", "Communicate with auditors", "SEC correspondence"] }
        ],
        tips: [
          { when: a => a.severity === "Material weakness / restatement",
            text: "Restatements are urgent, visible, and audit-committee-level — this needs a senior SEC reporting specialist, and rate resistance should be low." }
        ] } },
      { id: "complex_transactions", label: "Complex Transactions", icon: "🧩", deepDive: {
        intro: "One-off accounting for unusual events.",
        questions: [
          { id: "areas", type: "chips", label: "Which transactions?",
            options: ["Business combinations (ASC 805)", "Purchase price allocation", "Goodwill / impairment (ASC 350/360)",
                      "Equity & stock comp (ASC 718)", "Debt / derivatives (ASC 815)", "Leases (ASC 842)",
                      "Discontinued operations", "Variable interest entities"] },
          { id: "deliverable", type: "radio", label: "Deliverable?",
            options: ["Technical memo", "Journal entries and support", "Both", "Advisory only"] }
        ],
        tips: [
          { when: a => (a.areas || []).includes("Purchase price allocation"),
            text: "PPA work usually needs valuation coordination — confirm whether a third-party valuation firm is engaged or the consultant must manage it." }
        ] } },
      { id: "sec_reporting", label: "SEC Reporting", icon: "📄", deepDive: {
        intro: "The periodic filing machine.",
        questions: [
          { id: "filings", type: "chips", label: "Which filings?",
            options: ["10-K", "10-Q", "8-K", "S-1 / S-4", "Proxy", "XBRL tagging"] },
          { id: "role", type: "radio", label: "Their role?",
            options: ["Owns the filing process", "Prepares sections", "Reviews", "Backfills during a gap"] },
          { id: "tools", type: "chips", label: "Reporting tools?",
            options: ["Workiva (WDesk)", "Active Disclosure", "Excel / Word", "Other"] }
        ],
        tips: [
          { when: a => (a.tools || []).includes("Workiva (WDesk)"),
            text: "Workiva experience is a common hard requirement for SEC reporting roles — treat it as a filter." }
        ] } },
      { id: "policy_documentation", label: "Policy & Documentation", icon: "📚", deepDive: {
        intro: "Building the accounting rulebook.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["Accounting policy manual", "Technical memos", "Position papers", "Whitepapers for auditors", "Training the team"] },
          { id: "state", type: "radio", label: "Current documentation?",
            options: ["Mature", "Partial / outdated", "None"] }
        ], tips: [] } },
      { id: "audit_interaction", label: "Auditor Interaction", icon: "🔍", deepDive: {
        intro: "Defending positions to the audit firm.",
        questions: [
          { id: "scope", type: "chips", label: "What's expected?",
            options: ["Present positions to auditors", "Respond to audit inquiries", "Negotiate adjustments",
                      "Coordinate PBC delivery", "National office consultations"] },
          { id: "firm", type: "text", label: "Which audit firm?", placeholder: "e.g., EY, regional firm" }
        ], tips: [] } },
      { id: "ifrs", label: "IFRS & Multi-GAAP", icon: "🌍", deepDive: {
        intro: "A named MR capability — reporting under more than one framework.",
        questions: [
          { id: "scope", type: "chips", label: "What's in scope?",
            options: ["IFRS conversion", "Dual reporting (US GAAP + IFRS)", "Local statutory GAAP", "Group reporting packages"] },
          { id: "countries", type: "text", label: "Which jurisdictions?", placeholder: "e.g., UK, Germany, Brazil" }
        ],
        tips: [
          { when: (a, s) => areaPriority(s, "ifrs") === "must",
            text: "IFRS depth is scarce in the US market — expect a smaller pool, and consider candidates with international or foreign-parent experience." }
        ] } }
    ],
    specialists: [
      { label: "Controller / Assistant Controller", overlapsArea: "sec_reporting" },
      { label: "SEC Reporting Manager", overlapsArea: "sec_reporting" },
      { label: "Technical Accounting Manager", overlapsArea: "complex_transactions" },
      { label: "External auditors", overlapsArea: "audit_interaction" },
      { label: "Internal Audit / SOX", overlapsArea: "restatements" },
      { label: "Legal / securities counsel", overlapsArea: "ipo_readiness" },
      { label: "Valuation firm", overlapsArea: "complex_transactions" }
    ],
    profileRules: [
      { must: ["ipo_readiness", "sec_reporting"], profile: "IPO readiness / SEC reporting specialist",
        detail: "Target Big 4 SEC reporting alumni who've been through registration. S-1 and public-company close experience are the filters." },
      { must: ["restatements", "complex_transactions"], profile: "Technical accounting remediation specialist",
        detail: "Target senior technical CPAs with restatement experience. Root cause analysis and auditor negotiation are the filters." },
      { must: ["revenue", "policy_documentation"], profile: "Revenue recognition specialist",
        detail: "Target ASC 606 implementation veterans. Memo writing and contract analysis at volume are the filters." },
      { must: ["ifrs", "sec_reporting"], profile: "Multi-GAAP / international reporting specialist",
        detail: "Target candidates with IFRS and foreign-parent reporting experience. Dual-reporting depth is the filter." }
    ],
    stackCategories: [
      { id: "reporting_tools", label: "SEC reporting tools", placeholder: "Workiva, Active Disclosure…",
        options: ["Workiva (WDesk)", "Active Disclosure", "Certent", "Excel / Word"] },
      { id: "research", label: "Technical research", placeholder: "Checkpoint, PwC Viewpoint…",
        options: ["Checkpoint", "PwC Viewpoint", "Deloitte DART", "EY Atlas", "KPMG Accounting Research Online", "Codification (FASB)"] },
      { id: "erp", label: "ERP / consolidation", placeholder: "SAP, NetSuite, HFM…", options: ERP_OPTIONS },
      { id: "close_tools", label: "Close / controls tools", placeholder: "BlackLine, AuditBoard…",
        options: ["BlackLine", "FloQast", "AuditBoard", "Workiva"] }
    ],
    aiUseCases: ["Technical research", "Memo drafting", "Contract review at volume", "Policy drafting",
                 "Disclosure checklist review", "Filing preparation", "Precedent search"],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Checkpoint Edge AI", "Workiva AI", "PwC Viewpoint AI", "Excel Copilot"],
    metrics: ["On-time filings", "Audit adjustments", "Material weaknesses remediated", "Memo turnaround",
              "Restatement completion", "IPO milestone readiness", "Auditor acceptance of positions"],
    backgrounds: ["Big 4 audit", "Big 4 technical accounting / national office", "SEC reporting function",
                  "Public company", "Pre-IPO / recently public", "Transaction services"]
  }
};

/* Order roles appear in the picker */
const ROLE_ORDER = [
  /* Accounting, Finance, Tax, Treasury & Audit — business as usual */
  "interim_cfo",
  "controller",
  "accounting_manager",
  "technical_accounting",
  "tax_manager",
  "treasury",
  "internal_auditor",
  "compliance_risk",
  /* Performance Optimization & Business Analytics */
  "fpa_analyst",
  "supply_chain",
  /* Finance Transformation */
  "finance_transformation",
  /* Data, Systems & ERP */
  "financial_systems",
  "epm_data",
  "project_change"
];

  const APP_BRAND = { title: "Management Resources", subtitle: "Job Order Intake" };

  window.FORMS.management = {
    id: "management",
    label: "Management Resources",
    business: "pts",
    stackLabel: "Systems & Skills",
    brand: APP_BRAND,
    common: COMMON,
    roles: ROLES,
    roleOrder: ROLE_ORDER
  };
})();
