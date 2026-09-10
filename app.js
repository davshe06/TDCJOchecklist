/* TDC Job Order Checklist
   ------------------------------------------------------------------
   A one-page, no-capture checklist. Reps work it during a live client
   call to confirm they've asked everything needed to write the job
   order; the actual notes come from the Teams transcript and email.

   Nothing here stores answers — only which prompts have been ticked.
   Role knowledge still lives entirely in the roles-*.js catalogs; this
   file derives the prompts from that data and never hard-codes a role.
*/

/* ---------- constants ---------- */

const STORE_KEY = "tdc-jo-checklist-ticks";
const THEME_KEY = "tdc-jo-checklist-theme";

const BUSINESSES = [
  { id: "pts", label: "PTS", title: "Project & Talent Solutions" },
  { id: "tts", label: "TTS", title: "Technology & Transformation Solutions" }
];

/* Asked on every job order, whatever the role. */
const UNIVERSAL = [
  { id: "work_model", label: "Remote, hybrid, or onsite?" },
  { id: "work_address", label: "If hybrid or onsite — what address?",
    note: "Pin the actual site. “Hybrid” with an unstated location kills submittals late." },
  { id: "start_date", label: "Start date?" },
  { id: "interview_process", label: "Interview process?",
    note: "How many rounds, who is involved, and how fast is feedback?" },
  { id: "pay_rate", label: "Pay rate?" },
  { id: "contract_length", label: "Length of contract / contract-to-perm?" },
  { id: "engagement_terms", label: "C2C or 1099 OK?" }
];

/* ---------- state ---------- */

const state = {
  business: "pts",
  form: null,
  role: null,
  ticks: {},
  theme: "auto"
};

function formsFor(business) {
  return Object.values(window.FORMS || {}).filter(f => f.business === business);
}
function activeForm() { return (window.FORMS || {})[state.form] || null; }
function activeRole() {
  const f = activeForm();
  return f && state.role ? f.roles[state.role] : null;
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    if (raw && typeof raw === "object") {
      state.ticks = raw.ticks && typeof raw.ticks === "object" ? raw.ticks : {};
      if (raw.business) state.business = raw.business;
      if (raw.form) state.form = raw.form;
      if (raw.role) state.role = raw.role;
    }
  } catch (e) { /* corrupt or unavailable storage — start clean */ }
  try { state.theme = localStorage.getItem(THEME_KEY) || "auto"; } catch (e) {}

  /* Repair anything that no longer exists in the catalogs. */
  if (!formsFor(state.business).length) state.business = BUSINESSES[0].id;
  if (!activeForm() || activeForm().business !== state.business) {
    const first = formsFor(state.business)[0];
    state.form = first ? first.id : null;
    state.role = null;
  }
  if (state.role && !activeRole()) state.role = null;
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      ticks: state.ticks, business: state.business, form: state.form, role: state.role
    }));
  } catch (e) {}
}

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", state.theme);
  if (state.form) root.setAttribute("data-form", state.form);
  else root.removeAttribute("data-form");
  try { localStorage.setItem(THEME_KEY, state.theme); } catch (e) {}
}

/* ---------- prompt derivation ----------
   The catalogs carry far more depth than a live call allows, so each
   focus area is condensed to one ticked item: the area itself, its
   recruiter framing note, and the two questions worth asking out loud.
   We prefer the area's opening (framing) question plus one that drives
   a coaching tip, so the checklist keeps the catalog's judgement about
   what actually separates candidates. */

function tipRefs(deepDive) {
  const ids = new Set();
  (deepDive.tips || []).forEach(t => {
    if (typeof t.when !== "function") return;
    const found = String(t.when).match(/\ba\.([A-Za-z_0-9]+)/g) || [];
    found.forEach(m => ids.add(m.slice(2)));
  });
  return ids;
}

function areaPrompts(area, max) {
  const dd = area.deepDive || {};
  const qs = dd.questions || [];
  if (!qs.length) return [];
  const refs = tipRefs(dd);
  const picked = [];
  const take = q => { if (q && picked.indexOf(q) === -1 && picked.length < max) picked.push(q); };

  take(qs[0]);                                   /* the framing question */
  qs.forEach(q => { if (refs.has(q.id)) take(q); }); /* then the load-bearing ones */
  qs.forEach(take);                              /* then whatever is left */
  return picked.map(q => q.label);
}

function roleItems(role) {
  const items = [];
  if (role.timePrompt) {
    items.push({
      id: "time_split",
      label: "Top 3 priorities & split of the week",
      note: stripQuotes(role.timePrompt)
    });
  }
  (role.focusAreas || []).forEach(area => {
    items.push({
      id: "area_" + area.id,
      label: (area.icon ? area.icon + " " : "") + area.label,
      note: (area.deepDive || {}).intro || "",
      prompts: areaPrompts(area, 2)
    });
  });
  return items;
}

/* Blurbs often open with a quoted role name (“Controller” spans…), so only
   unwrap a string that is quoted end to end — never a stray leading quote. */
function stripQuotes(s) {
  const t = String(s).trim();
  return /^[“"'].*[”"']$/.test(t) ? t.slice(1, -1) : t;
}

function allItems() {
  const role = activeRole();
  return (role ? roleItems(role) : []).concat(UNIVERSAL);
}

function tickKey(item) { return (state.form || "-") + "." + (state.role || "-") + "." + item.id; }

/* ---------- DOM helpers ---------- */

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

/* ---------- render ---------- */

function render() {
  applyTheme();
  const app = document.getElementById("app");
  app.textContent = "";

  app.appendChild(renderHeader());

  const main = el("main", "page");
  if (!activeRole()) main.appendChild(renderRolePicker());
  else main.appendChild(renderChecklist());
  app.appendChild(main);
}

function renderHeader() {
  const form = activeForm();
  const head = el("header", "topbar");

  const brandWrap = el("div", "brand");
  brandWrap.appendChild(el("div", "brand-title", form ? form.brand.title : "TDC"));
  brandWrap.appendChild(el("div", "brand-sub", "Job Order Checklist"));
  head.appendChild(brandWrap);

  const nav = el("div", "topnav");

  /* business selector */
  const bseg = el("div", "seg-group");
  BUSINESSES.forEach(b => {
    if (!formsFor(b.id).length) return;
    const btn = el("button", "seg-btn" + (state.business === b.id ? " active" : ""), b.label);
    btn.title = b.title;
    btn.addEventListener("click", () => {
      if (state.business === b.id) return;
      state.business = b.id;
      const first = formsFor(b.id)[0];
      state.form = first ? first.id : null;
      state.role = null;
      saveState(); render();
    });
    bseg.appendChild(btn);
  });
  nav.appendChild(bseg);

  /* form toggle — only when the business hosts more than one catalog */
  const siblings = formsFor(state.business);
  if (siblings.length > 1) {
    const fseg = el("div", "seg-group");
    siblings.forEach(f => {
      const btn = el("button", "seg-btn" + (state.form === f.id ? " active" : ""), f.label);
      btn.addEventListener("click", () => {
        if (state.form === f.id) return;
        state.form = f.id; state.role = null;
        saveState(); render();
      });
      fseg.appendChild(btn);
    });
    nav.appendChild(fseg);
  }

  const tseg = el("div", "seg-group");
  [["auto", "◐"], ["light", "☀️"], ["dark", "🌙"]].forEach(([id, icon]) => {
    const btn = el("button", "seg-btn icon-btn" + (state.theme === id ? " active" : ""), icon);
    btn.title = id[0].toUpperCase() + id.slice(1) + " theme";
    btn.addEventListener("click", () => { state.theme = id; saveState(); render(); });
    tseg.appendChild(btn);
  });
  nav.appendChild(tseg);

  head.appendChild(nav);
  return head;
}

function renderRolePicker() {
  const form = activeForm();
  const wrap = el("section", "picker");
  wrap.appendChild(el("h1", null, "Which role is this job order for?"));
  wrap.appendChild(el("p", "sub", "Pick the role — it sets the questions worth asking on the call."));

  if (!form) {
    wrap.appendChild(el("p", "sub", "No catalog is available for this business."));
    return wrap;
  }

  const grid = el("div", "role-grid");
  form.roleOrder.forEach(id => {
    const role = form.roles[id];
    if (!role) return;
    const card = el("button", "role-card");
    card.appendChild(el("span", "role-icon", role.icon || "•"));
    const body = el("span", "role-body");
    body.appendChild(el("span", "role-label", role.label));
    if (role.tagline) body.appendChild(el("span", "role-tagline", role.tagline));
    card.appendChild(body);
    card.addEventListener("click", () => {
      state.role = id; saveState(); render();
      window.scrollTo(0, 0);
    });
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  return wrap;
}

function renderChecklist() {
  const role = activeRole();
  const wrap = el("section", "sheet");

  /* --- role header + explainer --- */
  const top = el("div", "sheet-head");
  const back = el("button", "back-btn", "← All roles");
  back.addEventListener("click", () => { state.role = null; saveState(); render(); });
  top.appendChild(back);

  const title = el("h1", "role-title");
  title.appendChild(el("span", "role-title-icon", role.icon || "•"));
  title.appendChild(el("span", null, role.label));
  top.appendChild(title);
  if (role.tagline) top.appendChild(el("p", "sub", role.tagline));
  if (role.about) top.appendChild(el("p", "about", role.about));
  if (role.blurb) top.appendChild(el("p", "coach", stripQuotes(role.blurb)));
  wrap.appendChild(top);

  const items = allItems();
  const roleCount = items.length - UNIVERSAL.length;

  wrap.appendChild(renderProgress(items));
  wrap.appendChild(renderGroup("Ask for this role", items.slice(0, roleCount)));
  wrap.appendChild(renderGroup("Every job order", items.slice(roleCount)));

  const foot = el("div", "sheet-foot");
  const reset = el("button", "ghost-btn", "Clear ticks");
  reset.addEventListener("click", () => {
    items.forEach(i => { delete state.ticks[tickKey(i)]; });
    saveState(); render();
  });
  const print = el("button", "ghost-btn", "🖨 Print");
  print.addEventListener("click", () => window.print());
  foot.appendChild(reset);
  foot.appendChild(print);
  wrap.appendChild(foot);

  return wrap;
}

function renderProgress(items) {
  const done = items.filter(i => state.ticks[tickKey(i)]).length;
  const box = el("div", "progress");
  const bar = el("div", "progress-bar");
  const fill = el("div", "progress-fill");
  fill.style.width = items.length ? Math.round(done / items.length * 100) + "%" : "0%";
  if (done === items.length && items.length) fill.classList.add("complete");
  bar.appendChild(fill);
  box.appendChild(bar);
  box.appendChild(el("span", "progress-label", done + " of " + items.length + " covered"));
  return box;
}

function renderGroup(title, items) {
  const sec = el("section", "group");
  sec.appendChild(el("h2", null, title));
  const list = el("ul", "checklist");
  items.forEach(item => list.appendChild(renderItem(item)));
  sec.appendChild(list);
  return sec;
}

function renderItem(item) {
  const key = tickKey(item);
  const li = el("li", "check-item" + (state.ticks[key] ? " done" : ""));

  const label = el("label", "check-label");
  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = !!state.ticks[key];
  box.addEventListener("change", () => {
    if (box.checked) state.ticks[key] = true; else delete state.ticks[key];
    saveState(); render();
  });
  label.appendChild(box);

  const body = el("span", "check-body");
  body.appendChild(el("span", "check-title", item.label));
  if (item.note) body.appendChild(el("span", "check-note", item.note));
  if (item.prompts && item.prompts.length) {
    const ul = el("ul", "prompts");
    item.prompts.forEach(p => ul.appendChild(el("li", null, p)));
    body.appendChild(ul);
  }
  label.appendChild(body);
  li.appendChild(label);
  return li;
}

/* ---------- boot ---------- */

loadState();
render();
