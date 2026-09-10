# TDC Job Order Checklist

A condensed job order intake tool, forked from
[RHJOForm](https://github.com/davshe06/RHJOForm) as a starting point.

The parent app is a long-form intake builder. This project is intended to become
a **shorter, checklist-style** version of the same idea — same underlying engine
and role data, fewer questions and a faster path through the call.

## Running it

There is no build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

For GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | Page shell; loads the catalogs, then the engine |
| `app.js` | Generic render engine — wizard steps, state, exports, theming |
| `styles.css` | All styling, including the light/dark and per-business accent themes |
| `docx.js` | Dependency-free Word (.docx) generator |
| `roles-management.js` | Management Resources catalog (PTS) |
| `roles-tech.js` | Tech catalog (TTS) |
| `roles-digital.js` | Digital & Marketing catalog (TTS) |
| `api/analyze.js` | Vercel serverless function for the AI analysis |

### How the forms are wired

Each `roles-*.js` file is an IIFE that registers itself into `window.FORMS`:

```js
window.FORMS.management = {
  id: "management",
  label: "Management Resources",
  business: "pts",          // which business selector tab hosts it
  stackLabel: "Systems & Skills",
  brand: APP_BRAND,
  common: COMMON,           // basics / logistics / team / closing steps
  roles: ROLES,             // role configs keyed by id
  roleOrder: ROLE_ORDER     // display order in the picker
};
```

`app.js` is generic: it reads whatever is registered and renders it. To add or
remove a form, add or delete a catalog file and its `<script>` tag — no engine
changes needed. To condense the flow, the main levers are:

- `wizardSteps()` in `app.js` — which steps exist and their order
- each catalog's `COMMON` — the role-agnostic questions
- each role's `focusAreas[].deepDive.questions` — the drill-down questions

## Storage keys

This app namespaces its own `localStorage` keys (`tdc-jo-checklist-*`) so it does
**not** collide with RHJOForm when both are served from `davshe06.github.io`,
which is a single origin.

## Cache busting

`index.html` appends `?v=N` to every asset. Bump `N` on each deploy so browsers
and the GitHub Pages CDN fetch fresh files instead of serving a stale copy.

## AI analysis

The "Analyze job order" button calls `api/analyze.js`, deployed on Vercel with
`ANTHROPIC_API_KEY` set server-side (never in the browser). When hosting on
GitHub Pages, paste the full Vercel endpoint URL into the endpoint settings on
the Review & Export step.
