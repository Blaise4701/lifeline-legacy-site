# Lifeline Legacy Financial Group — Website

**Protecting Families — Building Legacies**

A single-page marketing site for Lifeline Legacy Financial Group, serving DFW-area families and small businesses with life insurance, mortgage protection, retirement planning, and financial literacy education.

## About

Lifeline Legacy Financial Group helps families secure their financial future through:

- **Life insurance with living benefits** — coverage that can advance cash while the policyholder is alive during a critical, chronic, or terminal illness
- **Mortgage protection** — strategies so families can keep their home through the unexpected
- **Tax-advantaged retirement (IUL)** — Indexed Universal Life plans offering downside protection and potential tax-free retirement income
- **Estate planning resources** — guidance on wills, trusts, and legacy strategies
- **Financial literacy workshops** — sessions for parents, school staff, and communities on budgeting, debt elimination, and protection planning
- **Teacher & small-business solutions** — key-person insurance, executive bonus designs, and supplemental benefits

The approach is education-first: plain-English options, no-pressure consultations, and plans tailored to each family's budget and goals.

## Site structure

| Section | Purpose |
|---|---|
| Header / Nav | Sticky nav with logo, links to Services / Why Us / Process / Contact, and a "Book a 30-min Call" CTA |
| Hero | Headline, value proposition, trust badges, and a quick-stats snapshot card |
| Services | Six core offerings, each as a card |
| Why Us | Three differentiators — education over pressure, tailored plans, DFW community focus |
| Process | Four-step engagement flow: Book → Discover → Design → Implement |
| Testimonials | Placeholder client quotes |
| Contact | Calendly booking link, email, phone, and a quick-inquiry form (submits via `mailto:`) |
| Thank You | Standalone confirmation section for a `/#thank-you` anchor |
| Footer | Contact info, quick links, disclosures, and copyright |

## Tech stack

- Plain HTML5 + inline CSS (custom properties for theming — emerald/gold brand palette)
- No build step, no external dependencies — a single self-contained file
- Vanilla JS for the copyright year and the contact form's `mailto:` handoff (no server, no data stored)

## Key contact info (as currently set in the site)

- **Booking:** [calendly.com/lifelinelegacy/30min](https://calendly.com/lifelinelegacy/30min)
- **Email:** blaise.tamo@thelifelineleague.com
- **Phone:** (469) 354-9924

## Notes / things to double-check before launch

- `og:image` meta tag is currently empty — add a social-share image URL
- Testimonials are placeholder quotes — replace with real (permissioned) client feedback
- Confirm licensing/disclosure language with compliance before publishing (currently: *"Information is educational and not financial, tax, or legal advice... subject to underwriting and approvals."*)
- Contact form has no backend — it opens the visitor's email client with a prefilled message rather than submitting anywhere

## Deploying

This is a static file, so it can be hosted anywhere that serves static HTML (GitHub Pages, Netlify, Vercel, or traditional hosting) and pointed at a custom domain via DNS.
