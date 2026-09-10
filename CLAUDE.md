# TDC Job Order Checklist — working notes

## What this is

A **one-page checklist** a staffing rep works during a live client intake
call. It does **not** capture data: the notes come from the Teams call
transcription and follow-up email. The page's only job is to make sure the
rep has *asked* everything needed to write the job order afterwards.

Picking a role surfaces an explainer plus the questions worth asking for
that role. Every job order also carries a fixed block (work model, address,
start date, interview process, pay rate, contract length, C2C/1099).

This repo was forked from [RHJOForm](https://github.com/davshe06/RHJOForm)
(the full long-form intake app). The role catalogs are inherited wholesale;
the wizard, the answer capture and the exports were removed.
**The parent repo is a separate project — do not edit it from here.**

## Stack

Vanilla JS, vanilla CSS, no build step, no dependencies, no framework. Open
`index.html` directly or `python3 -m http.server 8000`.

Keep it that way unless asked — the whole point is that a rep can open a file
and it works, and that it deploys to GitHub Pages as static files.

## Architecture

`app.js` is a **generic render engine**. It knows nothing about specific
roles; it renders whatever the catalogs register. Role knowledge lives
entirely in data.

Each `roles-*.js` is an IIFE registering into `window.FORMS`:

```js
window.FORMS.management = {
  id: "management",
  label: "Management Resources",
  business: "pts",        // which business tab hosts it (pts | tts)
  brand: APP_BRAND,
  common: COMMON,         // retained by the catalogs, no longer rendered
  roles: ROLES,
  roleOrder: ROLE_ORDER
};
```

The IIFE wrapper matters: every catalog declares top-level `COMMON`, `ROLES`,
`ROLE_ORDER`, so without it they collide.

Two-level nav: **business selector** (PTS / TTS) → **form toggle** (only shown
when a business hosts more than one form) → **role picker** → the checklist.

### What the page renders from a role config

| Field | Used for |
| --- | --- |
| `label`, `icon`, `tagline` | role picker card and sheet heading |
| `about` | the plain-language explainer under the title |
| `blurb` | the recruiter coaching note |
| `timePrompt` | the "top 3 priorities" checklist item |
| `focusAreas[]` | **one checklist item each** — label, `deepDive.intro` as the note, and up to two prompts |

`COMMON`, `stackCategories`, `specialists`, `profileRules`, `metrics` and
`backgrounds` are still present in the catalogs but are **not rendered**. They
are left in place deliberately: they are the source of truth if a question
ever needs promoting back onto the sheet.

### How prompts are chosen

`areaPrompts()` condenses each focus area's `deepDive.questions` (512 across
the corpus) down to two: the area's **opening framing question**, then the
first question that **drives a coaching tip** (detected by scanning the tip
`when` closures for `a.<id>` references). This keeps the catalogs' judgement
about what actually separates candidates without rendering the long form.

To change how much surfaces, change the `max` passed to `areaPrompts()` — not
the catalogs.

## Conventions

**It stays one page.** Every role currently renders 14–16 checklist items and
prints to a single A4 page (worst case ~985px against ~1030px usable). If you
add items, re-measure in print media before committing.

**No data capture.** Checkboxes store tick state only. Never add a text input,
a summary, or an export — the transcript is the record.

**Cache busting is mandatory.** `index.html` appends `?v=N` to every asset.
**Bump `N` on every deploy** — GitHub Pages sits behind a CDN and browsers cache
JS hard, so without a bump users keep running old code. This has bitten before.

**Storage keys are namespaced** `tdc-jo-checklist-*` (`-ticks`, `-theme`).
RHJOForm and this app are both served from `davshe06.github.io`, and
`localStorage` is per-**origin**, not per-path. Never revert these to the
parent's keys.

**Verify in a real browser before committing.** Playwright is available at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; drive `file://` against
`index.html`, assert the behavior, and check `pageerror` + console errors are
empty. Syntax checks alone have missed real bugs here — the last two (an
`&amp;` rendering literally in a brand title, and a half-stripped curly quote)
were both invisible to `node --check`.

**Catalog strings are plain text, not HTML.** `app.js` renders via
`textContent`. Never put HTML entities (`&amp;`) in a catalog string — write
the literal character.

**Theming.** Colors are CSS custom properties. Light lives on bare `:root`; dark
is duplicated across `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`, with `:root[data-theme="light"]` pinning light. The
active form is stamped on `<html>` as `data-form`, and per-business accents key
off it — Management Resources is red (`#ad0019`), Tech/Digital blue (`#2456d6`).
Never hard-code an accent color in a component; use the tokens (including
`--accent-ring` for focus rings) so both themes follow.

## Deployment

**GitHub Pages:** Settings → Pages → branch `main`, folder `/ (root)`.

`api/analyze.js` and `vercel.json` are left over from the long-form app's AI
analysis and are no longer referenced by the page.

## Commit trailer

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: <session url>
```

Never put a model identifier in code comments, PR titles/bodies, or any other
pushed artifact — commit trailers only.
