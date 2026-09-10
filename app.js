/* =========================================================================
   Digital & Marketing Job Order Intake — render engine + role-aware state
   ---------------------------------------------------------------------------
   Step 1 picks a role. The role drives focus areas, deep dives, tech-stack
   categories, success metrics, candidate backgrounds, and the targeting
   profile. Config lives in roles.js; this engine is generic.
   ========================================================================= */

const STORAGE_KEY = "tdc-jo-checklist-v1";

/* ---------- state ----------
   common: role-agnostic step answers (shared across roles)
   roles[roleId]: { stack, success, areas, deepDives } — namespaced per role
   so switching roles never clobbers another role's answers. */

/* ---------- business + form registry ----------
   FORMS is populated by the roles-*.js catalogs, each tagged with the line of
   business it belongs to. Businesses are the top-level selector (PTS / TTS);
   each hosts one or more forms. The store keeps a fully independent job order
   per form; `state` is a live pointer to the active form's job order, so the
   rest of the engine is unchanged. */

const BUSINESSES = {
  pts: { id: "pts", label: "PTS", full: "Project & Talent Solutions" },
  tts: { id: "tts", label: "TTS", full: "Technology & Transformation Solutions" }
};
const BUSINESS_ORDER = ["pts", "tts"];

/* every registered form, in catalog-declaration order */
function allFormIds() { return Object.keys(FORMS); }

/* forms belonging to a business, in declaration order */
function formsFor(businessId) {
  return allFormIds().filter(id => FORMS[id].business === businessId);
}

function activeBusiness() { return store.businessId; }
function activeForm() { return FORMS[store.formId]; }

/* Combined drill-down + tools step. "Tech Stack" reads wrong on a finance job
   order, so a form can override the label via form.stackLabel. */
function stackStepLabel() {
  const f = activeForm();
  return (f && f.stackLabel) || "Tech Stack";
}

function blankJobOrder() {
  return {
    roleId: null,
    common: { basics: {}, logistics: {}, team: {}, closing: {} },
    roles: {},
    notes: { pretext: "", live: "", pretextH: null, liveH: null, railW: null },
    aiAnalysis: null
  };
}

function defaultStore() {
  const forms = {};
  allFormIds().forEach(id => { forms[id] = blankJobOrder(); });
  const businessId = BUSINESS_ORDER.find(b => formsFor(b).length) || BUSINESS_ORDER[0];
  return { businessId, formId: formsFor(businessId)[0], forms };
}

let store = loadStore();
let state = store.forms[store.formId];       // active form's job order
let currentStep = 0;
const formSteps = {};                         // remembered step per form
const businessForm = {};                      // remembered form per business

function loadStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.forms) {
      const base = defaultStore();
      if (FORMS[saved.formId]) {
        base.formId = saved.formId;
        base.businessId = FORMS[saved.formId].business;   // business follows the form
      }
      allFormIds().forEach(id => {
        const s = saved.forms[id];
        if (!s) return;
        const jo = base.forms[id];
        jo.roleId = s.roleId || null;
        jo.common = Object.assign(jo.common, s.common || {});
        jo.roles = s.roles || {};
        jo.notes = Object.assign(jo.notes, s.notes || {});
        jo.aiAnalysis = s.aiAnalysis || null;
      });
      return base;
    }
    /* migrate a single-form save from the standalone Tech app */
    if (saved && saved.common) {
      const base = defaultStore();
      const jo = base.forms.tech;
      base.businessId = "tts";
      base.formId = "tech";
      jo.roleId = saved.roleId || null;
      jo.common = Object.assign(jo.common, saved.common || {});
      jo.roles = saved.roles || {};
      jo.notes = Object.assign(jo.notes, saved.notes || {});
      jo.aiAnalysis = saved.aiAnalysis || null;
      return base;
    }
  } catch (e) { /* corrupted — start fresh */ }
  return defaultStore();
}

function switchForm(id) {
  if (id === store.formId || !FORMS[id]) return;
  formSteps[store.formId] = currentStep;
  store.formId = id;
  store.businessId = FORMS[id].business;
  businessForm[store.businessId] = id;
  state = store.forms[id];
  currentStep = formSteps[id] || 0;
  saveState();
  render();
}

/* Switching business lands on that business's remembered form (or its first). */
function switchBusiness(bid) {
  if (bid === store.businessId || !BUSINESSES[bid]) return;
  const forms = formsFor(bid);
  if (!forms.length) return;
  const target = forms.includes(businessForm[bid]) ? businessForm[bid] : forms[0];
  businessForm[store.businessId] = store.formId;
  switchForm(target);
}

let saveTimer = null;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 200);
}
function flushSave() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) {}
}
/* Flush any pending debounced save before the page goes away, so a quick
   reload or tab close never drops the last edit. */
window.addEventListener("pagehide", flushSave);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushSave();
});

/* ---------- theme ----------
   "auto" follows the system preference via the prefers-color-scheme media
   query; "light"/"dark" pin it by stamping data-theme on <html>. Stored under
   its own key — a UI preference, so "Start new job order" leaves it alone. */

const THEME_KEY = "tdc-jo-checklist-theme";

function themePref() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : "auto";
  } catch (e) { return "auto"; }
}

function applyTheme(pref) {
  if (pref === "light" || pref === "dark") {
    document.documentElement.dataset.theme = pref;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

function setThemePref(pref) {
  try {
    if (pref === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch (e) {}
  applyTheme(pref);
}

applyTheme(themePref());

/* ---------- role helpers ---------- */

function activeRole() { return state.roleId ? activeForm().roles[state.roleId] : null; }

function ensureRole(id) {
  if (!id) return null;
  if (!state.roles[id]) state.roles[id] = { stack: {}, success: {}, areas: {}, deepDives: {} };
  const r = state.roles[id];
  if (!r.custom) r.custom = { areas: [], stack: [] };
  activeForm().roles[id].focusAreas.concat((r.custom.areas || []).map(customAreaDef)).forEach(a => {
    if (!r.areas[a.id]) r.areas[a.id] = { priority: "skip", pct: 0 };
    if (!r.deepDives[a.id]) r.deepDives[a.id] = {};
  });
  return r;
}

function roleState() { return ensureRole(state.roleId); }

/* ---------- custom (user-added) entries ----------
   Custom focus areas and stack categories live in the job-order state
   (state.roles[id].custom), so "Start new job order" clears them. */

function slugId(label) {
  return "custom_" + label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    + "_" + Math.random().toString(36).slice(2, 6);
}

/* A user-added focus area gets a generic deep dive. */
function customAreaDef(c) {
  return { id: c.id, label: c.label, icon: "➕", custom: true, deepDive: {
    intro: "Custom focus area — capture what it involves and how the client will evaluate it.",
    questions: [
      { id: "details", type: "textarea", label: "What does this involve? Key requirements?",
        placeholder: "Responsibilities, expectations, seniority…" },
      { id: "tools", type: "text", label: "Specific tools / skills?",
        placeholder: "Tools, platforms, certifications…" }
    ],
    tips: [] } };
}

/* Built-in focus areas for the active role plus any user-added ones. */
function roleFocusAreas() {
  const role = activeRole();
  if (!role) return [];
  return role.focusAreas.concat((roleState().custom.areas || []).map(customAreaDef));
}

/* Used by tip functions in roles.js */
function areaPriority(s, areaId) {
  if (!s.roleId || !s.roles[s.roleId]) return "skip";
  return (s.roles[s.roleId].areas[areaId] || {}).priority || "skip";
}

/* ---------- wizard structure ---------- */

function wizardSteps() {
  return [
    { kind: "basics" },
    { kind: "config", key: "team" },
    { kind: "allocator" },
    { kind: "deepdives" },   /* combined focus-area drill-downs + tools ("Tech Stack") */
    { kind: "config", key: "success" },
    { kind: "config", key: "logistics" },
    { kind: "config", key: "closing" },
    { kind: "review" }
  ];
}

function stepTitle(w) {
  if (w.kind === "basics") return "Role & Basics";
  if (w.kind === "allocator") return "Focus Areas & % of Time";
  if (w.kind === "deepdives") return stackStepLabel();
  if (w.kind === "review") return "Review & Export";
  return { logistics: "Logistics & Budget", team: "Team Structure",
           success: "Success & Candidate", closing: "Closing" }[w.key];
}

/* Build the {title, subtitle, coach, questions, tips, answers} definition for
   a config-style step. Role-dependent option lists are injected here so both
   rendering and summary collection use identical question sets. */
function configStepDef(key) {
  const role = activeRole();
  if (key === "logistics") return Object.assign({}, activeForm().common.logistics, { answers: state.common.logistics });
  if (key === "closing")   return Object.assign({}, activeForm().common.closing,   { answers: state.common.closing, extra: (c) => renderCloseNext(c) });
  if (key === "team") {
    const qs = activeForm().common.team.questions.map(q =>
      q.id === "specialists" ? Object.assign({}, q, { options: role ? role.specialists.map(s => s.label) : [] }) : q);
    return { title: activeForm().common.team.title, subtitle: activeForm().common.team.subtitle, questions: qs,
             tips: activeForm().common.team.tips, answers: state.common.team };
  }
  if (key === "stack") {
    if (!role) return null;
    const rs = roleState();
    const questions = role.stackCategories.map(c => {
      if (c.options) {
        /* migrate a legacy free-text answer into the chip array */
        const v = rs.stack[c.id];
        if (typeof v === "string" && v.trim()) rs.stack[c.id] = [v.trim()];
        return { id: c.id, type: "chips", label: c.label, options: c.options };
      }
      return { id: c.id, type: "text", label: c.label, placeholder: c.placeholder };
    })
      .concat((rs.custom.stack || []).map(c => {
        const v = rs.stack[c.id];
        if (typeof v === "string" && v.trim()) rs.stack[c.id] = [v.trim()];
        return { id: c.id, type: "chips", label: c.label, options: [], custom: true };
      }))
      .concat([
        { id: "ai_usage", type: "chips", label: "How are you currently using AI in this function?", options: role.aiUseCases },
        { id: "ai_requirement", type: "radio", label: "Is AI experience preferred or required?",
          options: ["Required", "Preferred", "Not important"] },
        { id: "ai_tools", type: "chips", label: "Which AI tools / skills should they have experience with?",
          options: role.aiTools || [],
          showIf: a => a.ai_requirement === "Required" || a.ai_requirement === "Preferred" },
        { id: "ai_expectations", type: "textarea", label: "What should they use AI for in this role?",
          placeholder: "The outcomes the client expects from AI — speed up delivery, automate reporting, draft content, cut costs…",
          showIf: a => a.ai_requirement === "Required" || a.ai_requirement === "Preferred" }
      ]);
    return {
      title: stackStepLabel(), subtitle: "Ask them to list every tool they use.",
      questions,
      tips: [{ when: a => a.ai_requirement === "Required" && (a.ai_usage || []).length === 0,
        text: "AI experience is 'required' but they couldn't name current AI use cases — clarify what AI skill they'd actually test for." }],
      answers: rs.stack,
      extra: (container) => {
        const box = el("div", "custom-add");
        const row = el("div", "custom-add-row");
        const input = el("input");
        input.type = "text";
        input.placeholder = "Add a tool category that isn't listed…";
        const btn = el("button", "btn", "+ Add category");
        const add = () => {
          const v = input.value.trim();
          if (!v) return;
          const all = role.stackCategories.concat(rs.custom.stack || []);
          if (all.some(c => c.label.toLowerCase() === v.toLowerCase())) { input.value = ""; return; }
          rs.custom.stack.push({ id: slugId(v), label: v });
          saveState();
          render();
        };
        btn.addEventListener("click", add);
        input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); add(); } });
        row.appendChild(input);
        row.appendChild(btn);
        box.appendChild(row);
        if ((rs.custom.stack || []).length) {
          const rmRow = el("div", "custom-remove-row");
          rs.custom.stack.forEach(c => {
            const rm = el("button", "chip-remove", "× " + esc(c.label));
            rm.title = "Remove this category";
            rm.addEventListener("click", () => {
              rs.custom.stack = rs.custom.stack.filter(x => x.id !== c.id);
              delete rs.stack[c.id];
              saveState();
              render();
            });
            rmRow.appendChild(rm);
          });
          box.appendChild(rmRow);
        }
        /* place the add-category control with the stack fields, before the AI questions */
        const aiWrap = container.querySelector('[data-qid="ai_usage"]');
        if (aiWrap) container.insertBefore(box, aiWrap);
        else container.appendChild(box);
      }
    };
  }
  if (key === "success") {
    if (!role) return null;
    return {
      title: "Success & Ideal Candidate", subtitle: "How will this person be measured, and who fits?",
      questions: [
        { id: "top3", type: "textlist", count: 3, label: "What are the Top 3 things the candidate needs to have?",
          placeholder: "Short answer — one must-have per line" },
        { id: "metrics", type: "chips", label: "How will this person be measured?", options: role.metrics },
        { id: "success_6_12", type: "textarea", label: "What does success look like after 6–12 months?",
          placeholder: "Concrete outcomes the client will judge this hire on" },
        { id: "background", type: "chips", label: "Would the ideal candidate come from…", options: role.backgrounds },
        { id: "years_experience", type: "select", label: "Years of experience?", options: ["1–3", "3–5", "5–8", "8–12", "12+"] },
        { id: "industry_required", type: "radio", label: "Is industry experience required?",
          options: ["Required", "Preferred", "Not important"] },
        { id: "industry_which", type: "text", label: "Which industry?", placeholder: "e.g., healthcare SaaS",
          showIf: a => a.industry_required === "Required" || a.industry_required === "Preferred" },
        { id: "soft_skills", type: "textarea", label: "Soft skills?",
          placeholder: "Communication with execs, cross-functional collaboration, autonomy…" },
        { id: "non_negotiables", type: "textarea", label: "Non-negotiables",
          placeholder: "Hard dealbreakers — location, tools, work authorization, portfolio…" }
      ],
      tips: [{ when: a => (a.metrics || []).length > 6,
        text: "More than six success metrics usually means the client hasn't decided what this role is for. Ask which ONE metric gets this person a great review." }],
      answers: roleState().success
    };
  }
  return null;
}

/* ---------- DOM + rendering utilities ---------- */

function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function esc(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderQuestions(container, questions, answers, scopeId, onChange) {
  const wrappers = {};

  questions.forEach(q => {
    const wrap = el("div", "question");
    wrap.dataset.qid = q.id;
    wrappers[q.id] = wrap;
    wrap.appendChild(el("label", "q-label", esc(q.label)));
    if (q.help) wrap.appendChild(el("p", "q-help", esc(q.help)));

    const name = scopeId + "__" + q.id;
    const val = answers[q.id];

    if (q.type === "text" || q.type === "number") {
      const input = el("input");
      input.type = q.type;
      input.placeholder = q.placeholder || "";
      input.value = val != null ? val : "";
      input.addEventListener("input", () => { answers[q.id] = input.value; changed(); });
      wrap.appendChild(input);
    } else if (q.type === "textarea") {
      const ta = el("textarea");
      ta.placeholder = q.placeholder || "";
      ta.rows = 3;
      ta.value = val || "";
      ta.addEventListener("input", () => { answers[q.id] = ta.value; changed(); });
      wrap.appendChild(ta);
    } else if (q.type === "textlist") {
      /* a fixed number of short-answer boxes stored as a ranked array */
      const count = q.count || 3;
      if (!Array.isArray(answers[q.id])) answers[q.id] = [];
      const list = el("div", "textlist");
      for (let i = 0; i < count; i++) {
        const row = el("div", "textlist-row");
        row.appendChild(el("span", "textlist-num", (i + 1) + "."));
        const input = el("input");
        input.type = "text";
        input.placeholder = q.placeholder || "";
        input.value = answers[q.id][i] || "";
        input.addEventListener("input", () => { answers[q.id][i] = input.value; changed(); });
        row.appendChild(input);
        list.appendChild(row);
      }
      wrap.appendChild(list);
    } else if (q.type === "select") {
      const sel = el("select");
      sel.appendChild(el("option", null, "— select —"));
      q.options.forEach(o => {
        const opt = el("option", null, esc(o));
        opt.value = o;
        if (val === o) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener("change", () => {
        answers[q.id] = sel.selectedIndex === 0 ? undefined : sel.value;
        changed();
      });
      wrap.appendChild(sel);
    } else if (q.type === "radio") {
      const group = el("div", "seg-group");
      q.options.forEach(o => {
        const lab = el("label", "seg");
        const input = el("input");
        input.type = "radio"; input.name = name; input.value = o;
        if (val === o) input.checked = true;
        input.addEventListener("change", () => { answers[q.id] = o; changed(); });
        lab.appendChild(input);
        lab.appendChild(el("span", null, esc(o)));
        group.appendChild(lab);
      });
      wrap.appendChild(group);
    } else if (q.type === "chips") {
      /* Chip groups accept custom entries: values in the answer array that
         aren't suggested options render as removable custom chips, and a
         "+ Other…" inline input adds new ones. */
      const group = el("div", "chip-group");
      if (!Array.isArray(answers[q.id])) answers[q.id] = [];

      const buildChips = (focusAdder) => {
        group.innerHTML = "";
        const custom = (answers[q.id] || []).filter(v => !q.options.includes(v));
        q.options.concat(custom).forEach(o => {
          const isCustom = !q.options.includes(o);
          const lab = el("label", "chip" + (isCustom ? " custom" : ""));
          const input = el("input");
          input.type = "checkbox";
          input.checked = (answers[q.id] || []).includes(o);
          input.addEventListener("change", () => {
            const cur = answers[q.id] || (answers[q.id] = []);
            if (input.checked) { if (!cur.includes(o)) cur.push(o); }
            else answers[q.id] = cur.filter(x => x !== o);
            changed();
            if (isCustom && !input.checked) buildChips(false); // unchecked custom chip disappears
          });
          lab.appendChild(input);
          lab.appendChild(el("span", null, esc(o)));
          group.appendChild(lab);
        });

        const addLab = el("label", "chip chip-add");
        const addInput = el("input");
        addInput.type = "text";
        addInput.placeholder = "+ Other…";
        const commit = (refocus) => {
          const v = addInput.value.trim();
          if (!v) return;
          const cur = answers[q.id] || (answers[q.id] = []);
          if (!cur.includes(v)) cur.push(v);
          changed();
          buildChips(refocus);
        };
        addInput.addEventListener("keydown", e => {
          if (e.key === "Enter") { e.preventDefault(); commit(true); }
        });
        addInput.addEventListener("blur", () => commit(false));
        addLab.appendChild(addInput);
        group.appendChild(addLab);
        if (focusAdder) addInput.focus();
      };

      buildChips(false);
      wrap.appendChild(group);
    }

    container.appendChild(wrap);
  });

  function updateVisibility() {
    questions.forEach(q => {
      if (!q.showIf) return;
      wrappers[q.id].classList.toggle("hidden", !q.showIf(answers, state));
    });
  }
  function changed() { updateVisibility(); saveState(); if (onChange) onChange(); }
  updateVisibility();
}

function renderTips(container, rules, answers) {
  container.innerHTML = "";
  (rules || []).forEach(rule => {
    let show = false;
    try { show = !!rule.when(answers, state); } catch (e) {}
    if (show) container.appendChild(el("div", "tip", "💡 " + esc(rule.text)));
  });
}

/* ---------- Close To The Next Steps (closing-step scheduler) ----------
   Bubble selectors for the close path. The four "main" paths are mutually
   exclusive; Resume/Portfolio Review can ride alongside any one of them.
   Selecting a path reveals its scheduler (date + time, or date + time
   range). ICMs first asks how many (1–4), then a range block per ICM. */

const CLOSE_PATHS = [
  { id: "direct_start", label: "Direct Start", sched: "single" },
  { id: "resume_review", label: "Resume / Portfolio Review", sched: "single" },
  { id: "working_interview", label: "Working Interview", sched: "single" },
  { id: "icm_pending", label: "ICM with Pending Start Date", sched: "days" },
  { id: "icms", label: "ICMs", sched: "icms" }
];
const CLOSE_MAINS = ["direct_start", "working_interview", "icm_pending", "icms"];

function closeNextState() {
  const c = state.common.closing;
  if (!c.close_next || typeof c.close_next !== "object") c.close_next = {};
  const cn = c.close_next;
  if (!Array.isArray(cn.selected)) cn.selected = [];
  if (!cn.schedules || typeof cn.schedules !== "object") cn.schedules = {};
  if (!Array.isArray(cn.icms)) cn.icms = [];
  if (!(cn.icm_count >= 1 && cn.icm_count <= 4)) cn.icm_count = cn.icm_count || null;
  return cn;
}

function toggleClosePath(cn, id, on) {
  if (!on) {
    cn.selected = cn.selected.filter(x => x !== id);
    if (id === "icms") { cn.icm_count = null; cn.icms = []; }
    return;
  }
  if (CLOSE_MAINS.includes(id)) {
    /* a main is exclusive with the other mains — drop any main already on,
       but leave Resume/Portfolio Review (not a main) in place */
    cn.selected = cn.selected.filter(x => !CLOSE_MAINS.includes(x));
    cn.icm_count = null; cn.icms = [];   /* clear any prior ICM schedule */
  }
  if (!cn.selected.includes(id)) cn.selected.push(id);
}

function renderCloseNext(container) {
  const host = el("div", "close-next");
  /* sits at the top of the Closing step, in place of the old interview
     process question */
  container.insertBefore(host, container.firstChild);
  drawCloseNext(host);
}

function drawCloseNext(host) {
  host.innerHTML = "";
  const cn = closeNextState();
  host.appendChild(el("h3", "subhead", "🤝 Close To The Next Steps"));
  host.appendChild(el("p", "subtitle", "How are we closing this? Pick the path, then lock in the date and time for each step."));
  host.appendChild(el("p", "close-next-reminder", "Remind the client: These candidates are pre-vetted by experienced specialist recruiters and this skillset is in high demand. A proven, condensed process improves your likelihood of hiring the right person and not losing them to another company."));

  const group = el("div", "chip-group");
  CLOSE_PATHS.forEach(p => {
    const lab = el("label", "chip");
    const input = el("input");
    input.type = "checkbox";
    input.checked = cn.selected.includes(p.id);
    input.addEventListener("change", () => {
      toggleClosePath(cn, p.id, input.checked);
      saveState();
      drawCloseNext(host);
    });
    lab.appendChild(input);
    lab.appendChild(el("span", null, esc(p.label)));
    group.appendChild(lab);
  });
  host.appendChild(group);

  /* schedulers, in canonical order */
  CLOSE_PATHS.forEach(p => {
    if (!cn.selected.includes(p.id)) return;
    if (p.sched === "icms") host.appendChild(buildIcmsBlock(cn, host));
    else host.appendChild(buildScheduler(p, cn));
  });
}

function dateField(obj, key) {
  const wrap = el("label", "sched-field");
  wrap.appendChild(el("span", "sched-field-lab", "Date"));
  const inp = el("input");
  inp.type = "date";
  inp.value = obj[key] || "";
  inp.addEventListener("change", () => { obj[key] = inp.value; saveState(); });
  wrap.appendChild(inp);
  return wrap;
}

function timeField(obj, key, labelTxt) {
  const wrap = el("label", "sched-field");
  wrap.appendChild(el("span", "sched-field-lab", labelTxt));
  const inp = el("input");
  inp.type = "time";
  inp.value = obj[key] || "";
  inp.addEventListener("change", () => { obj[key] = inp.value; saveState(); });
  wrap.appendChild(inp);
  return wrap;
}

function buildScheduler(p, cn) {
  const sc = cn.schedules[p.id] || (cn.schedules[p.id] = {});
  if (p.sched === "days") return buildDayWindows(sc, esc(p.label) + " — propose two days", false);
  const row = el("div", "sched-row");
  row.appendChild(el("div", "sched-label", esc(p.label)));
  const controls = el("div", "sched-controls");
  controls.appendChild(dateField(sc, "date"));
  if (p.sched === "range") {
    controls.appendChild(timeField(sc, "start", "Start"));
    controls.appendChild(el("span", "sched-dash", "–"));
    controls.appendChild(timeField(sc, "end", "End"));
  } else {
    controls.appendChild(timeField(sc, "time", "Time"));
  }
  row.appendChild(controls);
  return row;
}

function buildIcmsBlock(cn, host) {
  const box = el("div", "sched-block");
  const countRow = el("div", "sched-row");
  countRow.appendChild(el("div", "sched-label", "ICMs — how many?"));
  const counts = el("div", "chip-group");
  [1, 2, 3, 4].forEach(n => {
    /* 1–2 ICMs read as an easy close (green); 3–4 signal a drawn-out
       process worth flagging (light red) */
    const lab = el("label", "chip icm-count " + (n <= 2 ? "good" : "warn"));
    const input = el("input");
    input.type = "radio";
    input.name = "icm_count";
    input.checked = cn.icm_count === n;
    input.addEventListener("change", () => {
      cn.icm_count = n;
      cn.icms = cn.icms.slice(0, n);
      while (cn.icms.length < n) cn.icms.push({ date: "", start: "", end: "" });
      saveState();
      drawCloseNext(host);
    });
    lab.appendChild(input);
    lab.appendChild(el("span", null, String(n)));
    counts.appendChild(lab);
  });
  countRow.appendChild(counts);
  box.appendChild(countRow);

  if (cn.icm_count) {
    for (let i = 0; i < cn.icm_count; i++) {
      const sc = cn.icms[i] || (cn.icms[i] = { date: "", start: "", end: "" });
      if (i === 0) { box.appendChild(buildDayWindows(sc, "ICM #1 — propose two days", true)); continue; }
      const row = el("div", "sched-row indented");
      row.appendChild(el("div", "sched-label", "ICM #" + (i + 1)));
      const controls = el("div", "sched-controls");
      controls.appendChild(dateField(sc, "date"));
      controls.appendChild(timeField(sc, "start", "Start"));
      controls.appendChild(el("span", "sched-dash", "–"));
      controls.appendChild(timeField(sc, "end", "End"));
      row.appendChild(controls);
      box.appendChild(row);
    }
  }
  return box;
}

/* A "day/window" scheduler offers two candidate days, each with two proposed
   time windows. Shared by ICM #1 and ICM with Pending Start Date. The richer
   shape (sc.days) is migrated from any plain {date,start,end}. */
function ensureDayWindows(sc) {
  if (!Array.isArray(sc.days)) {
    sc.days = [
      { date: sc.date || "", ranges: [{ start: sc.start || "", end: sc.end || "" }, { start: "", end: "" }] },
      { date: "", ranges: [{ start: "", end: "" }, { start: "", end: "" }] }
    ];
  }
  while (sc.days.length < 2) sc.days.push({ date: "", ranges: [] });
  sc.days.forEach(d => {
    if (!Array.isArray(d.ranges)) d.ranges = [];
    while (d.ranges.length < 2) d.ranges.push({ start: "", end: "" });
  });
  return sc.days;
}

function buildDayWindows(sc, title, indent) {
  const days = ensureDayWindows(sc);
  const block = el("div", "sched-block daywin-block" + (indent ? " indented" : ""));
  block.appendChild(el("div", "sched-label", title));
  days.forEach((d, di) => {
    const row = el("div", "sched-row daywin-day");
    row.appendChild(el("div", "sched-sublabel", "Day " + (di + 1)));
    const controls = el("div", "sched-controls");
    controls.appendChild(dateField(d, "date"));
    d.ranges.forEach((r, ri) => {
      const grp = el("div", "sched-window");
      grp.appendChild(el("span", "sched-window-lab", "Window " + (ri + 1)));
      const inner = el("div", "sched-range");
      inner.appendChild(timeField(r, "start", "Start"));
      inner.appendChild(el("span", "sched-dash", "–"));
      inner.appendChild(timeField(r, "end", "End"));
      grp.appendChild(inner);
      controls.appendChild(grp);
    });
    row.appendChild(controls);
    block.appendChild(row);
  });
  return block;
}

/* ---- Close-plan formatting for exports ---- */

function fmtDate(d) {
  if (!d) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(undefined,
    { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(t) {
  if (!t) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  let h = +m[1]; const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + m[2] + " " + ap;
}
function fmtWhen(sc, kind) {
  const date = fmtDate(sc.date);
  if (kind === "range") {
    const range = [fmtTime(sc.start), fmtTime(sc.end)].filter(Boolean).join("–");
    return [date, range].filter(Boolean).join(", ");
  }
  return [date, fmtTime(sc.time)].filter(Boolean).join(" at ");
}

/* Day/window export lines — one per proposed day, listing its filled windows.
   `prefix` labels the lines (e.g. "ICM #1" or the pending-start path label). */
function dayWindowLines(sc, prefix, indent) {
  const days = ensureDayWindows(sc);
  const pad = indent ? "  " : "";
  const out = [];
  days.forEach((d, di) => {
    const date = fmtDate(d.date);
    const windows = (d.ranges || [])
      .map(r => [fmtTime(r.start), fmtTime(r.end)].filter(Boolean).join("–"))
      .filter(Boolean);
    if (!date && !windows.length) return;
    const val = [date, windows.join(", ")].filter(Boolean).join(" — ");
    const key = prefix.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
    out.push({ label: pad + prefix + " · Day " + (di + 1), value: val, id: "close_" + key + "_day" + di });
  });
  return out;
}

/* Returns [{label,value}] lines for the close plan, or [] if nothing set. */
function closeNextLines() {
  const c = state.common.closing;
  const cn = c && c.close_next;
  if (!cn || !Array.isArray(cn.selected) || !cn.selected.length) return [];
  const lines = [];
  CLOSE_PATHS.forEach(p => {
    if (!cn.selected.includes(p.id)) return;
    if (p.sched === "icms") {
      const n = cn.icm_count || 0;
      lines.push({ label: "ICMs", value: n ? n + " scheduled" : "count not set", id: "close_icms" });
      (cn.icms || []).slice(0, n).forEach((sc, i) => {
        if (i === 0) {
          const l1 = dayWindowLines(sc, "ICM #1", true);
          if (l1.length) lines.push(...l1);
          else lines.push({ label: "  ICM #1", value: "date/time not set", id: "close_icm_0" });
          return;
        }
        const when = fmtWhen(sc, "range");
        lines.push({ label: "  ICM #" + (i + 1), value: when || "date/time not set", id: "close_icm_" + i });
      });
    } else if (p.sched === "days") {
      const sc = (cn.schedules || {})[p.id] || {};
      const dl = dayWindowLines(sc, p.label, false);
      if (dl.length) lines.push(...dl);
      else lines.push({ label: p.label, value: "date/time not set", id: "close_" + p.id });
    } else {
      const sc = (cn.schedules || {})[p.id] || {};
      const when = fmtWhen(sc, p.sched);
      lines.push({ label: p.label, value: when || "date/time not set", id: "close_" + p.id });
    }
  });
  return lines;
}

function renderConfigLike(main, def) {
  main.appendChild(el("h2", null, esc(def.title)));
  if (def.subtitle) main.appendChild(el("p", "subtitle", esc(def.subtitle)));
  if (def.coach) main.appendChild(el("div", "coach", "🎯 " + esc(def.coach)));

  const qContainer = el("div", "questions");
  const tipsContainer = el("div", "tips");
  main.appendChild(qContainer);
  main.appendChild(tipsContainer);

  const refresh = () => renderTips(tipsContainer, def.tips, def.answers);
  renderQuestions(qContainer, def.questions, def.answers, def.title, refresh);
  if (def.extra) def.extra(qContainer);
  refresh();
}

/* ---------- step 1: role picker + basics ---------- */

function renderBasics(main) {
  main.appendChild(el("h2", null, "Role & Basic Information"));
  main.appendChild(el("p", "subtitle", "Pick the role — it tailors the rest of the intake — then capture the basics."));

  const pickerWrap = el("div", "picker-wrap");
  pickerWrap.appendChild(el("div", "q-label", "Which role is this job order for?"));
  const grid = el("div", "role-grid");
  activeForm().roleOrder.forEach(id => {
    const r = activeForm().roles[id];
    const card = el("button", "role-card" + (state.roleId === id ? " selected" : ""));
    card.innerHTML =
      "<span class='role-icon'>" + r.icon + "</span>" +
      "<span class='role-label'>" + esc(r.label) + "</span>" +
      "<span class='role-tag'>" + esc(r.tagline) + "</span>";
    card.addEventListener("click", () => { state.roleId = id; ensureRole(id); saveState(); render(); });
    grid.appendChild(card);
  });
  pickerWrap.appendChild(grid);
  main.appendChild(pickerWrap);

  if (state.roleId) {
    main.appendChild(el("div", "role-note",
      activeForm().roles[state.roleId].icon + " <strong>" + esc(activeForm().roles[state.roleId].label) + "</strong> selected — the Focus Areas, Deep Dives, Tech Stack, and Success steps are now tailored to it."));
  }

  main.appendChild(el("hr", "divider"));

  if (activeForm().common.basics.coach) main.appendChild(el("div", "coach", "🎯 " + esc(activeForm().common.basics.coach)));
  const qContainer = el("div", "questions");
  const tipsContainer = el("div", "tips");
  main.appendChild(qContainer);
  main.appendChild(tipsContainer);
  const refresh = () => renderTips(tipsContainer, activeForm().common.basics.tips, state.common.basics);
  renderQuestions(qContainer, activeForm().common.basics.questions, state.common.basics, "basics", refresh);
  refresh();
}

/* ---------- role-required guard ---------- */

function needsRoleNotice(main, what) {
  main.appendChild(el("h2", null, what));
  const notice = el("div", "tip warn",
    "⚠️ Pick a role on the first step to load the tailored " + what.toLowerCase() + ".");
  main.appendChild(notice);
  const btn = el("button", "btn primary", "← Go to Role & Basics");
  btn.addEventListener("click", () => { currentStep = 0; render(); });
  main.appendChild(el("div", "actions")).appendChild(btn);
}

/* ---------- focus-area allocator ---------- */

function renderAllocatorStep(main) {
  const role = activeRole();
  if (!role) return needsRoleNotice(main, "Focus Areas & % of Time");

  main.appendChild(el("h2", null, "Focus Areas & % of Time"));
  main.appendChild(el("p", "subtitle", role.timePrompt));
  main.appendChild(el("div", "coach", "🎯 " + esc(role.blurb)));

  const areas = roleFocusAreas();
  const table = el("div", "allocator");
  const head = el("div", "alloc-row alloc-head");
  head.appendChild(el("div", "alloc-name", "Function"));
  head.appendChild(el("div", "alloc-priority", "Priority"));
  head.appendChild(el("div", "alloc-pct", "% of time"));
  table.appendChild(head);

  const rs = roleState();
  areas.forEach(area => {
    const a = rs.areas[area.id];
    const row = el("div", "alloc-row");
    const nameCell = el("div", "alloc-name", area.icon + " " + esc(area.label));
    if (area.custom) {
      const rm = el("button", "alloc-remove", "×");
      rm.title = "Remove this focus area";
      rm.addEventListener("click", () => {
        rs.custom.areas = rs.custom.areas.filter(c => c.id !== area.id);
        delete rs.areas[area.id];
        delete rs.deepDives[area.id];
        saveState();
        render();
      });
      nameCell.appendChild(rm);
    }
    row.appendChild(nameCell);

    const prio = el("div", "alloc-priority seg-group compact");
    [["must", "Must have"], ["nice", "Nice to have"], ["skip", "—"]].forEach(([valKey, labelTxt]) => {
      const lab = el("label", "seg");
      const input = el("input");
      input.type = "radio"; input.name = "prio__" + area.id;
      input.checked = a.priority === valKey;
      input.addEventListener("change", () => {
        a.priority = valKey;
        if (valKey === "skip") a.pct = 0;
        pctInput.value = a.pct || "";
        pctInput.disabled = valKey === "skip";
        changed();
      });
      lab.appendChild(input);
      lab.appendChild(el("span", null, labelTxt));
      prio.appendChild(lab);
    });
    row.appendChild(prio);

    const pctWrap = el("div", "alloc-pct");
    const pctInput = el("input");
    pctInput.type = "number"; pctInput.min = 0; pctInput.max = 100; pctInput.step = 5;
    pctInput.placeholder = "%"; pctInput.value = a.pct || "";
    pctInput.disabled = a.priority === "skip";
    pctInput.addEventListener("input", () => {
      a.pct = Math.max(0, Math.min(100, parseInt(pctInput.value, 10) || 0));
      changed();
    });
    pctWrap.appendChild(pctInput);
    row.appendChild(pctWrap);
    table.appendChild(row);
  });
  main.appendChild(table);

  /* Add a focus area the client needs that isn't suggested */
  const addBox = el("div", "custom-add");
  const addRow = el("div", "custom-add-row");
  const addInput = el("input");
  addInput.type = "text";
  addInput.placeholder = "Add a focus area that isn't listed…";
  const addBtn = el("button", "btn", "+ Add");
  const addArea = () => {
    const v = addInput.value.trim();
    if (!v) return;
    const exists = roleFocusAreas().some(a => a.label.toLowerCase() === v.toLowerCase());
    if (exists) { addInput.value = ""; return; }
    rs.custom.areas.push({ id: slugId(v), label: v });
    ensureRole(state.roleId);
    saveState();
    render();
  };
  addBtn.addEventListener("click", addArea);
  addInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addArea(); } });
  addRow.appendChild(addInput);
  addRow.appendChild(addBtn);
  addBox.appendChild(addRow);
  main.appendChild(addBox);

  const totalBar = el("div", "total-bar");
  const totalFill = el("div", "total-fill");
  totalBar.appendChild(totalFill);
  const totalLabel = el("p", "total-label");
  main.appendChild(totalBar);
  main.appendChild(totalLabel);

  const guidance = el("div", "tips");
  main.appendChild(guidance);
  const profileCard = el("div");
  main.appendChild(profileCard);

  function changed() { saveState(); refresh(); }
  function refresh() {
    const active = areas.filter(a => rs.areas[a.id].priority !== "skip");
    const musts = areas.filter(a => rs.areas[a.id].priority === "must");
    const total = active.reduce((sum, a) => sum + (rs.areas[a.id].pct || 0), 0);

    totalFill.style.width = Math.min(total, 100) + "%";
    totalFill.classList.toggle("over", total > 100);
    totalFill.classList.toggle("good", total === 100);
    totalLabel.textContent = "Total allocated: " + total + "% " +
      (total === 100 ? "✓" : total > 100 ? "(over 100 — trim it back)" : "(aim for 100%)");

    guidance.innerHTML = "";
    if (musts.length > 3) {
      guidance.appendChild(el("div", "tip warn",
        "⚠️ " + musts.length + " must-haves selected. Push the client to pick their top 3 — every additional must-have shrinks the candidate pool. Ask: “If a candidate had everything except one of these, which would you drop?”"));
    } else if (musts.length > 0 && musts.length < 3 && active.length >= 3) {
      guidance.appendChild(el("div", "tip",
        "💡 Aim for about 3 must-haves and up to 3 nice-to-haves — that gives recruiters a clear target."));
    }
    const mustPct = musts.reduce((sum, a) => sum + (rs.areas[a.id].pct || 0), 0);
    if (musts.length >= 2 && total > 0 && mustPct < 60) {
      guidance.appendChild(el("div", "tip warn",
        "⚠️ Must-haves only account for " + mustPct + "% of the week. Best practice: must-haves should cover 70–80% of their time. Revisit priorities or percentages."));
    }
    renderProfileCard(profileCard);
  }
  refresh();
}

function computeProfile() {
  const role = activeRole();
  if (!role) return null;
  const rs = roleState();
  const musts = roleFocusAreas().filter(a => rs.areas[a.id].priority === "must").map(a => a.id);
  if (musts.length === 0) return null;
  if (musts.length >= 5) {
    return { profile: "Unicorn alert 🦄",
      detail: musts.length + " must-have areas means you're hunting a generalist who is elite at everything. These candidates are extremely rare. Recommend prioritizing before the search starts — or resetting the budget expectation upward." };
  }
  for (const rule of role.profileRules) {
    if (rule.must.every(id => musts.includes(id))) return rule;
  }
  const labels = musts.map(id => roleFocusAreas().find(a => a.id === id).label);
  return { profile: "Custom profile: " + labels.join(" + "),
    detail: "Recruit around demonstrated results in " + labels.join(", ") + ". Ask candidates how their week actually breaks down and match it to the client's percentages." };
}

function renderProfileCard(container) {
  container.innerHTML = "";
  const p = computeProfile();
  if (!p) return;
  const card = el("div", "profile-card");
  card.appendChild(el("div", "profile-kicker", "Recruiter targeting profile"));
  card.appendChild(el("div", "profile-name", esc(p.profile)));
  card.appendChild(el("p", "profile-detail", esc(p.detail)));
  container.appendChild(card);
}

/* ---------- deep dives ---------- */

function renderDeepDivesStep(main) {
  const role = activeRole();
  if (!role) return needsRoleNotice(main, stackStepLabel());

  main.appendChild(el("h2", null, esc(stackStepLabel())));
  const rs = roleState();
  const musts = roleFocusAreas().filter(a => rs.areas[a.id].priority === "must");
  const nices = roleFocusAreas().filter(a => rs.areas[a.id].priority === "nice");

  if (!musts.length && !nices.length) {
    main.appendChild(el("p", "subtitle", "No focus areas selected yet — go back one step and mark the must-haves, and their skill drill-downs will appear here above the general tool questions."));
  } else {
    main.appendChild(el("p", "subtitle",
      "Skill drill-downs selected by your focus-area choices — must-haves expanded, nice-to-haves collapsed — followed by the general tool questions."));
  }

  [...musts, ...nices].forEach(area => {
    const isMust = rs.areas[area.id].priority === "must";
    const pct = rs.areas[area.id].pct || 0;
    const details = el("details", "dive" + (isMust ? " must" : ""));
    if (isMust) details.open = true;

    const summary = el("summary");
    summary.appendChild(el("span", "dive-title", area.icon + " " + esc(area.label)));
    summary.appendChild(el("span", "dive-badge" + (isMust ? " badge-must" : " badge-nice"),
      (isMust ? "Must have" : "Nice to have") + (pct ? " · " + pct + "%" : "")));
    details.appendChild(summary);

    const body = el("div", "dive-body");
    if (area.deepDive.intro) body.appendChild(el("p", "q-help", esc(area.deepDive.intro)));
    const answers = rs.deepDives[area.id];
    const qContainer = el("div", "questions");
    const tipsContainer = el("div", "tips");
    body.appendChild(qContainer);
    body.appendChild(tipsContainer);
    const refresh = () => renderTips(tipsContainer, area.deepDive.tips, answers);
    renderQuestions(qContainer, area.deepDive.questions, answers, "dive_" + area.id, refresh);
    refresh();
    details.appendChild(body);
    main.appendChild(details);
  });

  /* cross-check: existing specialists overlapping must-have areas */
  const specialists = state.common.team.specialists || [];
  const crossTips = el("div", "tips");
  musts.forEach(area => {
    const spec = role.specialists.find(s => s.overlapsArea === area.id);
    if (spec && specialists.includes(spec.label)) {
      crossTips.appendChild(el("div", "tip warn",
        "⚠️ A " + esc(spec.label) + " already exists on the team, but " + esc(area.label) +
        " is a must-have for this role. Clarify how the two roles divide the work — overlap kills placements at the offer stage."));
    }
  });
  main.appendChild(crossTips);

  /* ---- general tool / platform questions (formerly their own step) ---- */
  const stackDef = configStepDef("stack");
  if (stackDef) {
    main.appendChild(el("h3", "subhead", "🧰 Tools & Platforms"));
    main.appendChild(el("p", "subtitle", esc(stackDef.subtitle)));
    const qContainer = el("div", "questions");
    const tipsContainer = el("div", "tips");
    main.appendChild(qContainer);
    main.appendChild(tipsContainer);
    const refresh = () => renderTips(tipsContainer, stackDef.tips, stackDef.answers);
    renderQuestions(qContainer, stackDef.questions, stackDef.answers, "stacksec", refresh);
    if (stackDef.extra) stackDef.extra(qContainer);
    refresh();
  }
}

/* ---------- review + export ---------- */

function answerLine(label, value, id) {
  if (value == null) return null;
  if (Array.isArray(value)) return value.length ? { label, value: value.join(", "), id } : null;
  const v = String(value).trim();
  return v ? { label, value: v, id } : null;
}

/* Make a bare domain clickable — exports render hrefs as real hyperlinks. */
function normalizeUrl(v) {
  const s = String(v).trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : "https://" + s;
}

function collectConfigSection(def) {
  const lines = [];
  def.questions.forEach(q => {
    if (q.showIf && !q.showIf(def.answers, state)) return;
    /* ranked lists (e.g. Top 3 must-haves) export as a numbered sequence */
    if (q.type === "textlist") {
      const items = (def.answers[q.id] || []).map(v => String(v || "").trim()).filter(Boolean);
      if (items.length) lines.push({ label: q.label, value: items.map((v, i) => (i + 1) + ") " + v).join("  "), id: q.id });
      return;
    }
    const line = answerLine(q.label, def.answers[q.id], q.id);
    if (line) lines.push(line);
  });
  return lines.length ? { title: def.title, lines } : null;
}

function collectSummary() {
  const sections = [];
  const role = activeRole();

  /* Basics (prepend role) */
  const basicsLines = [];
  if (role) basicsLines.push({ label: "Role type", value: role.label });
  activeForm().common.basics.questions.forEach(q => {
    if (q.showIf && !q.showIf(state.common.basics, state)) return;
    const line = answerLine(q.label, state.common.basics[q.id], q.id);
    if (line) {
      if (q.id === "company_website") line.href = normalizeUrl(line.value);
      basicsLines.push(line);
    }
  });
  if (basicsLines.length) sections.push({ title: "Role & Basic Information", lines: basicsLines });

  /* Output ordered by what a recruiter needs first: what the role is, what
     the candidate must have, the deal parameters, then the skill detail,
     team context, process, and finally the analysis and raw notes. */
  if (role) {
    const success = collectConfigSection(configStepDef("success")); if (success) sections.push(success);
  }
  const logistics = collectConfigSection(configStepDef("logistics")); if (logistics) sections.push(logistics);

  /* Focus areas */
  if (role) {
    const rs = roleState();
    const active = roleFocusAreas().filter(a => rs.areas[a.id].priority !== "skip")
      .sort((a, b) => (rs.areas[b.id].pct || 0) - (rs.areas[a.id].pct || 0));
    if (active.length) {
      const lines = active.map(a => ({
        label: a.label,
        value: (rs.areas[a.id].pct || 0) + "% (" + (rs.areas[a.id].priority === "must" ? "must have" : "nice to have") + ")"
      }));
      const profile = computeProfile();
      if (profile) lines.push({ label: "Recruiter targeting profile", value: profile.profile + " — " + profile.detail, id: "recruiter_profile" });
      sections.push({ title: "Focus Areas & % of Time", lines });
    }
    /* Deep dives */
    roleFocusAreas().forEach(area => {
      const prio = rs.areas[area.id].priority;
      if (prio === "skip") return;
      const answers = rs.deepDives[area.id];
      const lines = [];
      area.deepDive.questions.forEach(q => {
        if (q.showIf && !q.showIf(answers, state)) return;
        const line = answerLine(q.label, answers[q.id], q.id);
        if (line) lines.push(line);
      });
      if (lines.length) sections.push({
        title: area.label + (prio === "must" ? " (must have)" : " (nice to have)"), lines });
    });
    const stack = collectConfigSection(configStepDef("stack")); if (stack) sections.push(stack);
  }

  const team = collectConfigSection(configStepDef("team")); if (team) sections.push(team);
  const closing = collectConfigSection(configStepDef("closing")); if (closing) sections.push(closing);
  const closeLines = closeNextLines(); if (closeLines.length) sections.push({ title: "Close To The Next Steps", lines: closeLines });

  /* AI analysis → free-text section */
  if (state.aiAnalysis && (state.aiAnalysis.text || "").trim())
    sections.push({ title: "AI Analysis", text: state.aiAnalysis.text.trim() });

  /* Persistent notes → free-text sections at the end of the output */
  if ((state.notes.live || "").trim())
    sections.push({ title: "Live Notes", text: state.notes.live.trim() });
  if ((state.notes.pretext || "").trim())
    sections.push({ title: "Job Description / Pre-Meeting Info", text: state.notes.pretext.trim() });

  return sections;
}

function jobTitleLine() {
  const b = state.common.basics;
  const base = b.job_title || (activeRole() ? activeRole().label : "Job Order");
  return base + (b.client_company ? " — " + b.client_company : "");
}

/* ---------- feedback email ----------
   mailto: only works when a desktop mail client is registered as the handler.
   On a machine using Outlook on the web (or any browser with no mail handler)
   the click silently does nothing, so we try mailto first and fall back to the
   Outlook web compose deep link if the page never loses focus. */

const FEEDBACK_TO = "david.sheehan@roberthalf.com";
const FEEDBACK_SUBJECT = "RH Job Order Form Feedback";

function feedbackMailto() {
  return "mailto:" + FEEDBACK_TO + "?subject=" + encodeURIComponent(FEEDBACK_SUBJECT);
}

function feedbackWebUrl() {
  return "https://outlook.office.com/mail/deeplink/compose"
    + "?to=" + encodeURIComponent(FEEDBACK_TO)
    + "&subject=" + encodeURIComponent(FEEDBACK_SUBJECT);
}

function openFeedbackEmail() {
  /* If a desktop client takes the mailto, the browser loses focus — treat that
     as success. If focus never leaves, no handler exists: open Outlook on the
     web instead. */
  let handedOff = false;
  const markHandled = () => { handedOff = true; };
  window.addEventListener("blur", markHandled, { once: true });
  document.addEventListener("visibilitychange", markHandled, { once: true });

  try { window.location.href = feedbackMailto(); } catch (e) { /* blocked */ }

  setTimeout(() => {
    window.removeEventListener("blur", markHandled);
    document.removeEventListener("visibilitychange", markHandled);
    if (handedOff || document.hidden) return;      // a mail app opened
    window.open(feedbackWebUrl(), "_blank", "noopener");
  }, 1200);
}

/* Reliable download — anchor MUST be attached to the DOM for click() to fire
   in Firefox and others. */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function printSummary() {
  printDoc(jobTitleLine(), "Intake completed " + new Date().toLocaleDateString(), collectSummary());
}

/* Candidate-facing export: strips commercial terms and internal intel so
   the doc is safe to share with a candidate. Excluded question ids +
   internal-only sections are listed here — adjust as needed. */
const CANDIDATE_EXCLUDE_IDS = new Set([
  "budget", "conversion_fees", "bill_to",              /* money / commercial terms */
  "replacement_why", "how_else_filling", "open_how_long", /* internal client intel */
  "feedback_turnaround", "next_steps",                 /* rep↔client agreements */
  "recruiter_profile"                                  /* recruiter targeting notes */
]);
const CANDIDATE_EXCLUDE_SECTIONS = new Set(["AI Analysis", "Live Notes", "Job Description / Pre-Meeting Info", "Close To The Next Steps"]);

function collectCandidateSummary() {
  return collectSummary()
    .filter(sec => !CANDIDATE_EXCLUDE_SECTIONS.has(sec.title))
    .map(sec => sec.text ? sec : { title: sec.title, lines: sec.lines.filter(l => !CANDIDATE_EXCLUDE_IDS.has(l.id)) })
    .filter(sec => sec.text || sec.lines.length);
}

function printCandidateBrief() {
  printDoc(jobTitleLine(), "Candidate brief — prepared " + new Date().toLocaleDateString(), collectCandidateSummary());
}

function printDoc(title, subtitle, sections) {
  let rows = "";
  sections.forEach(sec => {
    rows += "<h2>" + esc(sec.title) + "</h2>";
    if (sec.text) { rows += "<p class='note'>" + esc(sec.text).replace(/\n/g, "<br>") + "</p>"; return; }
    rows += "<dl>";
    sec.lines.forEach(l => {
      const val = l.href
        ? '<a href="' + esc(l.href) + '">' + esc(l.value) + "</a>"
        : esc(l.value).replace(/\n/g, "<br>");
      rows += "<dt>" + esc(l.label) + "</dt><dd>" + val + "</dd>";
    });
    rows += "</dl>";
  });
  if (!sections.length) rows = "<p>No details captured yet.</p>";

  const doc =
    "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + esc(title) + "</title><style>" +
    "*{box-sizing:border-box}body{font-family:Calibri,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a2233;margin:40px;line-height:1.5}" +
    "h1{font-size:26px;margin:0 0 4px}.date{color:#5b6577;font-size:13px;margin:0 0 20px}" +
    "h2{font-size:13px;text-transform:uppercase;letter-spacing:.8px;color:#2456d6;border-bottom:1px solid #e2e7f0;padding-bottom:5px;margin:22px 0 8px}" +
    "dl{margin:0;display:grid;grid-template-columns:240px 1fr;gap:5px 16px}" +
    "dt{font-weight:600;color:#5b6577;font-size:13.5px}dd{margin:0;font-size:13.5px}" +
    "a{color:#2456d6}" +
    "p.note{white-space:pre-wrap;font-size:13.5px;margin:0}" +
    "@page{margin:18mm}</style></head><body>" +
    "<h1>" + esc(title) + "</h1><p class='date'>" + esc(subtitle) + "</p>" +
    rows + "</body></html>";

  const w = window.open("", "_blank");
  if (!w) { window.print(); return; }
  w.document.open(); w.document.write(doc); w.document.close(); w.focus();
  const go = () => w.print();
  if (w.document.readyState === "complete") setTimeout(go, 150);
  else w.onload = () => setTimeout(go, 150);
}

function fileBase() {
  const b = state.common.basics;
  const base = b.job_title || (activeRole() ? activeRole().label : "job-order");
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "job-order";
}

/* ---------- AI analysis ----------
   Calls the /api/analyze serverless endpoint (Vercel function holding the
   Anthropic API key). Endpoint + optional team code are UI settings stored
   under their own key, so "Start new job order" keeps them; the analysis
   RESULT lives in job-order state and is cleared by reset. */

const AI_CONFIG_KEY = "tdc-jo-checklist-ai-config";

function aiConfig() {
  try {
    const c = JSON.parse(localStorage.getItem(AI_CONFIG_KEY)) || {};
    return { endpoint: c.endpoint || "/api/analyze", code: c.code || "" };
  } catch (e) { return { endpoint: "/api/analyze", code: "" }; }
}

function saveAiConfig(cfg) {
  try { localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg)); } catch (e) {}
}

/* Minimal markdown renderer for the analysis output (headings, bold, lists). */
function mdToHtml(md) {
  const lines = esc(md).split(/\r?\n/);
  let html = "", inList = false, para = [];
  const flushPara = () => {
    if (para.length) { html += "<p>" + para.join("<br>") + "</p>"; para = []; }
  };
  const closeList = () => { if (inList) { html += "</ul>"; inList = false; } };
  const inline = s => s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
  lines.forEach(line => {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (h) { flushPara(); closeList(); html += "<h4>" + inline(h[2]) + "</h4>"; }
    else if (li) { flushPara(); if (!inList) { html += "<ul>"; inList = true; } html += "<li>" + inline(li[1]) + "</li>"; }
    else if (!line.trim()) { flushPara(); closeList(); }
    else { closeList(); para.push(inline(line)); }
  });
  flushPara(); closeList();
  return html;
}

function renderAiSection(main) {
  const box = el("div", "ai-box");
  box.appendChild(el("div", "ai-head", "🤖 AI Analysis"));
  box.appendChild(el("p", "q-help",
    "Sends the completed job order to your team's AI endpoint for a fillability read, gap check, sourcing kit, and candidate pitch. The result is added to the export."));

  const controls = el("div", "actions");
  const runBtn = el("button", "btn primary", state.aiAnalysis ? "🔄 Re-analyze job order" : "✨ Analyze job order");
  controls.appendChild(runBtn);
  box.appendChild(controls);

  /* endpoint / team-code settings, collapsed by default */
  const cfg = aiConfig();
  const settings = el("details", "ai-settings");
  settings.appendChild(el("summary", null, "Endpoint settings"));
  const epRow = el("div", "custom-add-row");
  const epInput = el("input");
  epInput.type = "text";
  epInput.placeholder = "/api/analyze or https://your-app.vercel.app/api/analyze";
  epInput.value = cfg.endpoint;
  const codeInput = el("input");
  codeInput.type = "text";
  codeInput.placeholder = "Team code (optional)";
  codeInput.value = cfg.code;
  codeInput.style.maxWidth = "180px";
  const persist = () => saveAiConfig({ endpoint: epInput.value.trim() || "/api/analyze", code: codeInput.value.trim() });
  epInput.addEventListener("input", persist);
  codeInput.addEventListener("input", persist);
  epRow.appendChild(epInput);
  epRow.appendChild(codeInput);
  settings.appendChild(epRow);
  settings.appendChild(el("p", "q-help",
    "When the app is served from Vercel, the default /api/analyze works as-is. When hosted elsewhere (e.g. GitHub Pages), paste your Vercel deployment's full endpoint URL."));
  box.appendChild(settings);

  const status = el("div", "ai-status");
  box.appendChild(status);

  const result = el("div", "ai-result");
  if (state.aiAnalysis && state.aiAnalysis.text) {
    result.innerHTML = mdToHtml(state.aiAnalysis.text);
    result.classList.add("filled");
  }
  box.appendChild(result);

  runBtn.addEventListener("click", async () => {
    const conf = aiConfig();
    runBtn.disabled = true;
    runBtn.textContent = "⏳ Analyzing… (can take up to a minute)";
    status.textContent = "";
    try {
      const headers = { "Content-Type": "application/json" };
      if (conf.code) headers["x-access-code"] = conf.code;
      const resp = await fetch(conf.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          summary: summaryMarkdown(),
          role: activeRole() ? activeRole().label : ""
        })
      });
      let data = null;
      try { data = await resp.json(); } catch (e) {}
      if (!resp.ok || !data || !data.analysis) {
        throw new Error((data && data.error) || ("Request failed (" + resp.status + ")"));
      }
      state.aiAnalysis = { text: data.analysis, at: new Date().toISOString() };
      flushSave();
      render(); // refresh the review step so the summary includes the analysis
      return;
    } catch (err) {
      status.textContent = "⚠️ " + (err && err.message ? err.message : "Analysis failed — check the endpoint settings.");
      runBtn.textContent = state.aiAnalysis ? "🔄 Re-analyze job order" : "✨ Analyze job order";
    } finally {
      runBtn.disabled = false;
    }
  });

  main.appendChild(box);
}

function renderReviewStep(main) {
  main.appendChild(el("h2", null, "Review & Export"));

  const role = activeRole();
  const b = state.common.basics, lg = state.common.logistics;
  const rs = role ? roleState() : null;
  const musts = role ? roleFocusAreas().filter(a => rs.areas[a.id].priority === "must") : [];
  const total = role ? roleFocusAreas().reduce((s, a) => s + (rs.areas[a.id].pct || 0), 0) : 0;

  const checks = [
    { ok: !!role, text: "Role selected" },
    { ok: !!(b.client_company || "").trim(), text: "Client company captured" },
    { ok: !!(b.why_hiring || "").trim(), text: "Business problem / reason for hiring captured" },
    { ok: !!(lg.budget || "").trim(), text: "Budget captured" },
    { ok: !!(lg.start_date || "").trim(), text: "Clear start date captured" },
    { ok: musts.length >= 1 && musts.length <= 3, text: "1–3 must-have focus areas selected" },
    { ok: total === 100, text: "Time allocation totals 100%" },
    { ok: !!(rs && (rs.success.success_6_12 || "").trim()), text: "6–12 month success definition captured" },
    { ok: closeNextLines().length > 0, text: "Close-to-next-steps path selected" }
  ];
  const list = el("div", "checklist");
  checks.forEach(c => list.appendChild(el("div", "check " + (c.ok ? "ok" : "miss"), (c.ok ? "✅ " : "⬜ ") + esc(c.text))));
  main.appendChild(list);
  const missing = checks.filter(c => !c.ok).length;
  if (missing > 0) {
    main.appendChild(el("div", "tip warn",
      "⚠️ " + missing + " item(s) still open. A job order without budget, timeline, and 3 clear must-haves is a wish, not an order."));
  }

  const actions = el("div", "actions");
  const copyBtn = el("button", "btn primary", "📋 Copy summary");
  copyBtn.addEventListener("click", async () => {
    const md = summaryMarkdown();
    try { await navigator.clipboard.writeText(md); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = md; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    copyBtn.textContent = "✓ Copied";
    setTimeout(() => (copyBtn.textContent = "📋 Copy summary"), 1500);
  });
  const wordBtn = el("button", "btn", "📄 Download Word doc");
  wordBtn.addEventListener("click", () => {
    const bytes = buildJobOrderDocx(jobTitleLine(), new Date().toLocaleDateString(), collectSummary());
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    downloadBlob(blob, fileBase() + "-job-order.docx");
    wordBtn.textContent = "✓ Downloaded";
    setTimeout(() => (wordBtn.textContent = "📄 Download Word doc"), 1500);
  });
  const printBtn = el("button", "btn", "🖨️ Save as PDF");
  printBtn.addEventListener("click", printSummary);
  const candBtn = el("button", "btn", "👤 Candidate PDF");
  candBtn.title = "Candidate-safe version — no bill rate, fees, or internal notes";
  candBtn.addEventListener("click", printCandidateBrief);
  actions.appendChild(copyBtn); actions.appendChild(wordBtn); actions.appendChild(printBtn); actions.appendChild(candBtn);
  main.appendChild(actions);

  renderAiSection(main);

  const summary = el("div", "summary");
  summary.appendChild(el("h3", null, esc(jobTitleLine())));
  const sections = collectSummary();
  if (!sections.length) summary.appendChild(el("p", "q-help", "Nothing captured yet — work through the steps and the summary will build itself here."));
  sections.forEach(sec => {
    summary.appendChild(el("h4", null, esc(sec.title)));
    if (sec.text) { summary.appendChild(el("div", "summary-note", esc(sec.text))); return; }
    const dl = el("dl");
    sec.lines.forEach(l => {
      dl.appendChild(el("dt", null, esc(l.label)));
      dl.appendChild(el("dd", null, l.href
        ? '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.value) + "</a>"
        : esc(l.value)));
    });
    summary.appendChild(dl);
  });
  main.appendChild(summary);
}

function summaryMarkdown() {
  let md = "# Job Order: " + jobTitleLine() + "\n\n_Intake completed " + new Date().toLocaleDateString() + "_\n";
  collectSummary().forEach(sec => {
    md += "\n## " + sec.title + "\n\n";
    if (sec.text) { md += sec.text + "\n"; return; }
    sec.lines.forEach(l => {
      md += "- **" + l.label + ":** " + (l.href ? "[" + l.value + "](" + l.href + ")" : l.value) + "\n";
    });
  });
  return md;
}

/* ---------- shell ---------- */

function stepDone(w) {
  if (w.kind === "basics") return !!state.roleId || Object.keys(state.common.basics).some(k => truthy(state.common.basics[k]));
  if (w.kind === "config") {
    const def = configStepDef(w.key);
    if (!def) return false;
    return def.questions.some(q => truthy(def.answers[q.id]));
  }
  if (w.kind === "allocator") return !!activeRole() && roleFocusAreas().some(a => roleState().areas[a.id].priority !== "skip");
  if (w.kind === "deepdives") {
    if (!activeRole()) return false;
    const dd = roleFocusAreas().some(a =>
      roleState().areas[a.id].priority !== "skip" &&
      Object.keys(roleState().deepDives[a.id]).some(k => truthy(roleState().deepDives[a.id][k])));
    const def = configStepDef("stack");
    const st = !!def && def.questions.some(q => truthy(def.answers[q.id]));
    return dd || st;
  }
  return false;
}
function truthy(v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); }

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  /* stamp the active form so its accent theme applies (see per-business
     accent theme in styles.css) */
  document.documentElement.dataset.form = store.formId;
  const steps = wizardSteps();
  /* saved step indexes can exceed the step count after a layout change */
  if (currentStep >= steps.length) currentStep = steps.length - 1;

  const side = el("nav", "sidebar");
  const brand = activeForm().brand;
  side.appendChild(el("div", "brand", brand.title + "<br><span>" + brand.subtitle + "</span>"));
  if (state.roleId) side.appendChild(el("div", "role-chip", activeForm().roles[state.roleId].icon + " " + esc(activeForm().roles[state.roleId].label)));
  steps.forEach((w, i) => {
    const btn = el("button", "nav-step" + (i === currentStep ? " active" : "") + (stepDone(w) ? " done" : ""));
    btn.innerHTML = "<span class='nav-num'>" + (i + 1) + "</span> " + esc(stepTitle(w));
    btn.addEventListener("click", () => { currentStep = i; render(); });
    side.appendChild(btn);
  });
  /* theme toggle: Auto follows system preference; Light/Dark pin it */
  const themeBox = el("div", "theme-toggle");
  [["auto", "◐ Auto"], ["light", "☀️ Light"], ["dark", "🌙 Dark"]].forEach(([val, labelTxt]) => {
    const btn = el("button", "theme-btn" + (themePref() === val ? " active" : ""), labelTxt);
    btn.addEventListener("click", () => {
      setThemePref(val);
      themeBox.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    themeBox.appendChild(btn);
  });
  side.appendChild(themeBox);

  const reset = el("button", "nav-reset", "🗑 Start new job order");
  let armed = false, armTimer = null;
  reset.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      reset.textContent = "⚠️ Click again to clear everything";
      reset.classList.add("armed");
      armTimer = setTimeout(() => {
        armed = false;
        reset.textContent = "🗑 Start new job order";
        reset.classList.remove("armed");
      }, 4000);
      return;
    }
    clearTimeout(armTimer);
    state = blankJobOrder();
    store.forms[store.formId] = state;
    flushSave();
    currentStep = 0;
    render();
  });
  side.appendChild(reset);

  /* feedback — opens a pre-addressed draft (desktop Outlook, else Outlook web) */
  const feedback = el("a", "nav-feedback", "✉️ Feedback? Email David Sheehan");
  feedback.href = feedbackMailto();          /* keeps right-click → copy address */
  feedback.addEventListener("click", e => { e.preventDefault(); openFeedbackEmail(); });
  side.appendChild(feedback);

  app.appendChild(side);

  const main = el("main", "panel");

  /* Business selector (PTS / TTS), then the form toggle for that business.
     Every switch lands on a fully separate job order. */
  const bizBar = el("div", "form-toggle business-toggle");
  bizBar.appendChild(el("span", "form-toggle-label", "Business"));
  const bizSeg = el("div", "form-seg");
  BUSINESS_ORDER.forEach(bid => {
    if (!formsFor(bid).length) return;
    const b = BUSINESSES[bid];
    const btn = el("button", "form-seg-btn" + (store.businessId === bid ? " active" : ""), b.label);
    btn.title = b.full;
    btn.addEventListener("click", () => switchBusiness(bid));
    bizSeg.appendChild(btn);
  });
  bizBar.appendChild(bizSeg);
  main.appendChild(bizBar);

  /* form toggle — only shown when the business hosts more than one form */
  const bizForms = formsFor(store.businessId);
  if (bizForms.length > 1) {
    const formBar = el("div", "form-toggle");
    formBar.appendChild(el("span", "form-toggle-label", "HSJF Job Order Type"));
    const seg = el("div", "form-seg");
    bizForms.forEach(id => {
      const btn = el("button", "form-seg-btn" + (store.formId === id ? " active" : ""), FORMS[id].label);
      btn.addEventListener("click", () => switchForm(id));
      seg.appendChild(btn);
    });
    formBar.appendChild(seg);
    main.appendChild(formBar);
  }

  const w = steps[currentStep];
  if (w.kind === "basics") renderBasics(main);
  else if (w.kind === "config") renderConfigLike(main, configStepDef(w.key));
  else if (w.kind === "allocator") renderAllocatorStep(main);
  else if (w.kind === "deepdives") renderDeepDivesStep(main);
  else renderReviewStep(main);

  const nav = el("div", "step-nav");
  if (currentStep > 0) {
    const prev = el("button", "btn", "← Back");
    prev.addEventListener("click", () => { currentStep--; render(); });
    nav.appendChild(prev);
  }
  if (currentStep < steps.length - 1) {
    const next = el("button", "btn primary", "Next →");
    next.addEventListener("click", () => { currentStep++; render(); });
    nav.appendChild(next);
  }
  main.appendChild(nav);
  app.appendChild(main);

  renderNotesPanel(app);
}

/* Persistent notes rail — visible on every step, saved to state, and rolled
   into the final output. Editing it does NOT re-render (so typing never loses
   focus); it just updates state and autosaves. */
function renderNotesPanel(app) {
  const panel = el("aside", "notes-panel");

  /* plain-language explainer of the selected role, for reps outside the domain */
  const role = activeRole();
  if (role && role.about) {
    const box = el("div", "role-about");
    /* "an" before vowel-sounding starts (ERP, AI) — U reads as "you", so "a UX" */
    const article = /^[AEIO]/.test(role.label) ? "an" : "a";
    box.appendChild(el("div", "role-about-title", role.icon + " What is " + article + " " + esc(role.label) + "?"));
    box.appendChild(el("p", "role-about-text", esc(role.about)));
    panel.appendChild(box);
  }

  panel.appendChild(el("div", "notes-head", "🗒️ Notes"));
  panel.appendChild(el("p", "notes-sub", "Kept across every step and added to the exported job order."));
  panel.appendChild(notesField("Job description / pre-meeting info", "pretext",
    "Paste the job description or anything the client shared before the call…"));
  panel.appendChild(notesField("Live notes", "live",
    "Jot anything they mention that isn't a field on this screen…"));
  app.appendChild(panel);
}

/* One notes field. Text autosaves; a manual vertical resize is captured via
   ResizeObserver and stored (…H), then reapplied so the chosen height
   survives step changes. Width is responsive — the rail flexes to fill the
   space left over after the sidebar and main panel, so both boxes always
   span the remaining screen width. */
function notesField(labelText, key, placeholder) {
  const hKey = key + "H";
  const block = el("div", "notes-block");
  block.appendChild(el("label", "notes-label", labelText));
  const ta = el("textarea");
  ta.placeholder = placeholder;
  ta.value = state.notes[key] || "";
  if (state.notes[hKey]) ta.style.height = state.notes[hKey] + "px";
  ta.addEventListener("input", () => { state.notes[key] = ta.value; saveState(); });

  if (typeof ResizeObserver !== "undefined") {
    let lastH = null;
    const ro = new ResizeObserver(() => {
      const h = ta.offsetHeight;
      if (!h) return;
      if (lastH === null) { lastH = h; return; }   // first measurement = baseline
      if (h !== lastH) { lastH = h; state.notes[hKey] = h; saveState(); }
    });
    ro.observe(ta);
  }

  block.appendChild(ta);
  return block;
}

document.addEventListener("DOMContentLoaded", render);
