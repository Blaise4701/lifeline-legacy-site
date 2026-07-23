# Lifeline AI — Missed-Call Exposure Statement Calculator

An interactive, single-file discovery tool for Lifeline AI Systems. Prospects enter their call volume and average customer value; the page itemizes what missed calls are costing them and projects what a 24/7 AI answering line could recover.

**Concept:** presented as a "statement" — charges (revenue at risk) vs. credits (projected recovery) vs. a balance/ROI summary — rather than a generic SaaS dashboard.

## Features

- Industry-specific benchmarks (dental, HVAC, legal, real estate, etc.) with editable assumptions
- Conservative / Base / Upside scenario toggle
- Live-calculated monthly and annual exposure, projected recovery, ROI, payback period, and break-even
- Two-column layout: inputs on the left, exposure statement sticky on the right (stacks on mobile)
- Lead-capture modal ("Get My Recovery Plan")
- Print/download support for the statement
- No build step, no dependencies — a single self-contained HTML file

## Tech stack

- Plain HTML5, CSS (custom properties), and vanilla JS
- Fonts loaded from Google Fonts (Fraunces, IBM Plex Sans, IBM Plex Mono)
- No frameworks, no bundler

## File

- `lifeline-ai-missed-call-calculator.html` — the entire app (markup, styles, and logic in one file)

## Hosting

This is a static file, so it can be hosted anywhere that serves static HTML:

- **GitHub Pages** — push to a repo, enable Pages in Settings, done
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop or connect the repo
- Point a custom domain (`lifelineaisystems.com`) at whichever host via DNS (A records for the root domain, CNAME for a subdomain)

## Customizing

- **Industries & benchmarks:** edit the `INDUSTRIES` array near the top of the `<script>` block (id, label, noun, operating days, average value, and default qualified/capture/conversion rates).
- **Scenario deltas:** edit `SCENARIO_DELTA` to change how much the Conservative/Upside scenarios shift the benchmark rates.
- **Colors/type:** all theme values are CSS custom properties at the top of the `<style>` block (`:root { ... }`), so palette and font changes are centralized there.

## Disclaimer

The tool states this is for planning and discussion purposes only — not guaranteed revenue, and not accounting, legal, or financial advice. Keep that disclaimer visible in any future edits.
