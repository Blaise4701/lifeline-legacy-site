# Lifeline Legacy Financial Group

Production-oriented Next.js website for Lifeline Legacy Financial Group. The experience is organized around the Continuity Bridge™ Framework and follows an education-first, invitation-second hierarchy.

## Included

- Responsive homepage using the official LLFG logo, gold mark, and Blaise Tamo portrait
- Expanded Continuity Bridge™ methodology page
- Five-question, persona-adaptive Continuity Checkup
- Retirement income, family continuity, and business continuity pathways
- Learning center with the complete ten-session fall 2026 seminar and workshop schedule
- Complete first-person founder story and the lived experience behind the Continuity Bridge™ Framework
- Draft privacy, terms, and disclosure pages
- Metadata, favicon, sitemap, robots file, custom 404, print styles, focus states, reduced-motion support, and mobile navigation

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Education-first homepage |
| `/continuity-bridge` | Full framework explanation |
| `/checkup` | Interactive Continuity Checkup |
| `/retirement-income` | Eight retirement-income questions |
| `/family-continuity` | Family continuity pathway |
| `/business-continuity` | Business owner pathway |
| `/learn` | Guides and the fall 2026 seminar and workshop schedule |
| `/about` | Blaise Tamo and LLFG story |
| `/privacy` | Pre-launch privacy draft |
| `/terms` | Pre-launch terms draft |
| `/disclosures` | Pre-launch disclosure draft |

## Run locally

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
npm run start -- -H 127.0.0.1
```

## Pre-launch items

1. Reconfirm the licensing disclosure whenever the approved state list changes.
2. Obtain final compliance approval for privacy, terms, disclosures, titles, and all educational copy.
3. Connect the GoHighLevel review form and calendar. Until then, the preview form intentionally transmits nothing and says so on screen.
4. Replace the workshop “Registration coming soon” labels with the approved GoHighLevel registration destination.
5. Finish or remove resources currently labeled “in development.”
6. Add any approved credentials beyond the current public title.
7. Connect analytics only after defining privacy and consent requirements.
8. Create the Git repository, link the Vercel project, review the preview URL, and switch the production domain only after approval.

## GoHighLevel handoff

The future review request should send only the information the visitor explicitly submits plus a minimal summary:

- First name
- Email
- State
- Selected pathway: retirement, family, or business
- Three descriptive summary labels: Continuity, Certainty, Legacy
- Selected learning interest

Do not send balances, account numbers, free-form financial details, or raw Checkup answers to advertising platforms. Confirm state availability before offering a scheduling slot.

## Current public contact details

- Office: 972-764-8516
- Direct: 469-354-9924
- Email: info@lifelinelegacyfinancial.com
- Public title: Founder & CEO · Retirement Income & Legacy Protection Specialist
- Licensed states: TX, AZ, FL, KS, ME, MI, NC, OH

## Verification completed

- ESLint: passing
- Next.js production build and TypeScript: passing
- Every public route: HTTP 200 with one page-level heading
- Unknown route: custom HTTP 404
- Desktop and mobile rendering: no horizontal overflow, broken images, or browser console errors
- Continuity Checkup: completed end to end with the correct persona-specific recommendation
- Automated accessibility audit: no detected violations across the public routes

The site is not deployed and no external form, calendar, analytics, repository, or domain change has been made.
