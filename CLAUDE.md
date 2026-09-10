# TDC Job Order Checklist — working notes

## What this is

A staffing **job order intake** web app for sales reps to capture requirements
during a client intake call. A behind-the-scenes decision tree surfaces relevant
follow-up questions based on the role and the focus areas selected.

This repo was forked from [RHJOForm](https://github.com/davshe06/RHJOForm) (the
full long-form version) to become a **shorter, checklist-style** variant. The
engine and role data are inherited wholesale; the work here is condensing the
flow. **The parent repo is a separate project — do not edit it from here.**

## Stack

Vanilla JS, vanilla CSS, no build step, no dependencies, no framework. Open
`index.html` directly or `python3 -m http.server 8000`. The only dependency
anywhere is `@anthropic-ai/sdk` inside the Vercel function.

Keep it that way unless asked — the whole point is that a rep can open a file
and it works, and that it deploys to GitHub Pages as static files.

## Architecture

`app.js` is a **generic render engine**. It knows nothing about specific roles;
it renders whatever the catalogs register. Role knowledge lives entirely in data.

Each `roles-*.js` is an IIFE registering into `window.FORMS`:

```js
window.FORMS.management = {
  id: "management",
  label: "Management Resources",
  business: "pts",              // which business tab hosts it (pts | tts)
  stackLabel: "Systems & Skills", // optional: overrides the "Tech Stack" step label
  brand: APP_BRAND,
  common: COMMON,               // basics / logistics / team / closing steps
  roles: ROLES,                 // role configs keyed by id
  roleOrder: ROLE_ORDER         // display order in the picker
};
```

The IIFE wrapper matters: every catalog declares top-level `COMMON`, `ROLES`,
`ROLE_ORDER`, so without it they collide.

Two-level nav: **business selector** (PTS / TTS) → **form toggle** (only shown
when a business hosts more than one form). Each form keeps a fully independent
job order in the store; `state` is a live pointer to the active one, which is
why the rest of the engine needs no awareness of forms.

### A role config

```js
role_id: {
  label, icon, tagline,
  about,        // 2–3 sentence plain-language explainer, shown in the notes rail
  blurb,        // recruiter-facing coaching note on the Focus Areas step
  timePrompt,   // the "top 3 things" question for that role
  focusAreas: [{ id, label, icon, deepDive: { intro, questions, tips } }],
  specialists:  [{ label, overlapsArea }],   // overlapsArea must be a focusArea id
  profileRules: [{ must: [focusAreaIds], profile, detail }],
  stackCategories: [{ id, label, placeholder, options }],
  aiUseCases, aiTools, metrics, backgrounds
}
```

Question types: `text`, `textarea`, `number`, `select`, `radio`, `chips`
(multi-select, always allows custom "+ Other…" entries), `textlist` (N numbered
short-answer boxes). Conditional display via `showIf(answers, state)`. Tips via
`when(answers, state)`; `areaPriority(state, id)` reads a focus area's priority
(`"must" | "nice" | "skip"`).

## Condensing levers

- `wizardSteps()` in `app.js` — which steps exist and their order
- each catalog's `COMMON` — the role-agnostic questions
- each role's `focusAreas[].deepDive.questions` — the drill-downs

Prefer cutting **data** over adding engine branches. If a step should disappear
for one form only, add a form-level flag (like `stackLabel`) rather than
hard-coding form ids in the engine.

## Conventions

**Cache busting is mandatory.** `index.html` appends `?v=N` to every asset.
**Bump `N` on every deploy** — GitHub Pages sits behind a CDN and browsers cache
JS hard, so without a bump users keep running old code. This has bitten before.

**Storage keys are namespaced** `tdc-jo-checklist-*`. RHJOForm and this app are
both served from `davshe06.github.io`, and `localStorage` is per-**origin**, not
per-path. Never revert these to the parent's keys.

**Verify in a real browser before committing.** Playwright is available at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; drive `file://` against
`index.html`, assert the behavior, and check `pageerror` + console errors are
empty. Syntax checks alone have missed real bugs here.

**Validate catalogs after editing them:**

```js
// every profileRule.must and specialist.overlapsArea must be a real focusArea id
```

**Theming.** Colors are CSS custom properties. Light lives on bare `:root`; dark
is duplicated across `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`, with `:root[data-theme="light"]` pinning light. The
active form is stamped on `<html>` as `data-form`, and per-business accents key
off it — Management Resources is red (`#ad0019`), Tech/Digital blue (`#2456d6`).
Never hard-code an accent color in a component; use the tokens (including
`--accent-ring` for focus rings) so both themes follow.

**Exports** must stay in sync when questions change: on-screen summary, markdown
copy, Word (`docx.js`), print/PDF, and the candidate PDF. The candidate export
strips commercial terms — see `CANDIDATE_EXCLUDE_IDS` / `CANDIDATE_EXCLUDE_SECTIONS`.

## Deployment

- **GitHub Pages:** Settings → Pages → branch `main`, folder `/ (root)`.
- **AI analysis:** `api/analyze.js` on Vercel with `ANTHROPIC_API_KEY` set
  server-side. The key must never reach the browser. When hosted on Pages, the
  endpoint URL is pasted into the AI settings on the Review & Export step.

## Commit trailer

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: <session url>
```

Never put a model identifier in code comments, PR titles/bodies, or any other
pushed artifact — commit trailers only.
