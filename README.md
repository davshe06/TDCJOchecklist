# TDC Job Order Checklist

A **one-page checklist** for staffing reps to work during a live client intake
call, forked from [RHJOForm](https://github.com/davshe06/RHJOForm).

It captures nothing. The notes come from the Teams call transcription and the
follow-up email — this page exists so the rep can confirm they asked
everything needed to write the job order afterwards.

Pick a business, pick a role, and you get:

- a plain-language explainer of what that role actually does,
- a recruiter coaching note on where the role varies,
- the questions worth asking for that role, drawn from the role catalogs,
- and the fixed block every job order needs — work model and address, start
  date, interview process, pay rate, contract length and conversion, C2C/1099.

Every role renders 14–16 items and prints to a single page.

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
| `app.js` | Generic render engine — nav, role picker, checklist, theming |
| `styles.css` | Styling, including light/dark and per-business accents, and the print rules |
| `roles-management.js` | Management Resources catalog (PTS) — 14 roles |
| `roles-tech.js` | Tech & Engineering catalog (TTS) — 13 roles |
| `roles-digital.js` | Digital & Marketing catalog (TTS) — 9 roles |

`api/analyze.js` and `vercel.json` are left over from the long-form app and are
no longer referenced by the page.

### How the forms are wired

Each `roles-*.js` file is an IIFE that registers itself into `window.FORMS`:

```js
window.FORMS.management = {
  id: "management",
  label: "Management Resources",
  business: "pts",          // which business selector tab hosts it
  brand: APP_BRAND,
  common: COMMON,           // retained, no longer rendered
  roles: ROLES,
  roleOrder: ROLE_ORDER
};
```

`app.js` is generic: it reads whatever is registered and renders it. To add or
remove a catalog, add or delete the file and its `<script>` tag — no engine
changes needed.

### How the checklist is built

Each role contributes one item per **focus area**, plus its "top 3 priorities"
prompt. For each area the app shows the area's framing question and one
question that drives a coaching tip in the catalog, so the checklist keeps the
decision-tree's judgement about what separates candidates without asking all
512 drill-down questions the long form contained.

The catalogs still hold that full depth (`COMMON`, `stackCategories`,
`profileRules`, `metrics`, `backgrounds`). Nothing was deleted from them — they
are the source if a question needs promoting back onto the sheet.

## Storage

Tick state and theme are kept in `localStorage` under `tdc-jo-checklist-*` so
they do **not** collide with RHJOForm, which shares the `davshe06.github.io`
origin. No answers are stored, because none are collected.

## Cache busting

`index.html` appends `?v=N` to every asset. Bump `N` on each deploy so browsers
and the GitHub Pages CDN fetch fresh files instead of serving a stale copy.
