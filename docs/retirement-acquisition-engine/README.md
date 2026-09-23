# LLFG Retirement Acquisition Engine

Locked operating framework, GHL Phase 1 build checklist, and a working preview of the 11-screen Retirement Income Stress-Test — built for Lifeline Legacy Financial Group.

## Structure

```
docs/
  framework.md              — the full locked framework (v2.9): architecture, Fit/Engagement scoring,
                               classification engine, GHL field-mapping spec, economics, open items
  ghl-build-checklist.md    — flat, execution-ready checklist for building Phase 1 custom fields
                               and pipeline stages directly in GHL
preview/
  index.html                — self-contained, working front-end preview of the Stress-Test,
                               including a Reviewer/Architect diagnostic drawer (hidden by
                               default — click "Reviewer Mode" top-right)
vercel.json                — routes all traffic to /preview/index.html for zero-config deploy
```

## Status

Architecture is locked (v2.9). Persona QA has passed 12/12 against the shipped scoring/routing
logic. GHL Phase 1 (data foundation only — no live automation) is spec'd and ready to build.
See `docs/framework.md`'s Revision Log and Open Items for exactly what's settled and what still
needs a real-world answer (compliance sign-off, actual staffing cost, real close-rate data).

## Deploying the preview

This repo needs no build step — `preview/index.html` is a single self-contained file.

1. Push this repo to GitHub.
2. Import it in Vercel (New Project → import from GitHub). No framework preset needed —
   Vercel will serve it as a static site; `vercel.json` routes the root to the preview.
3. Every push to `main` auto-deploys. Use a Vercel preview URL for internal review before
   promoting anything to a real domain.

**This is a demo/reviewer tool, not the production build.** The Reviewer Mode drawer exposes
the full Fit Score/Engagement logic in page source by design — see `docs/framework.md`
Revision Log v1.7 for why that's fine here and not fine once this becomes the real GHL-backed
build (Fit Score must move server-side before then).

## Working with this repo

`docs/framework.md` is the source of truth. If you're extending the Stress-Test, changing
scoring, or touching GHL field mappings, update that document first — `preview/index.html`
and `docs/ghl-build-checklist.md` are downstream of it and should be kept in sync, not edited
independently.
