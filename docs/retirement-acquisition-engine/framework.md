# LLFG Retirement Acquisition Engine
### Locked Operating Framework — v2.8
*Lifeline Legacy Financial Group | Blaise Tamo, Founder & CEO*

---

## Revision Log

- **v1.0** — Initial blueprint built from the original locked sequence.
- **v1.1** — Corrected: OTP moved post-insight, single-angle launch sequencing, fork added for Tier routing.
- **v1.2** — Corrected: Fit and Engagement no longer blend into one score or one lookup table. Fit determines qualification (WHO); Engagement determines treatment (HOW); Engagement cannot promote or demote Fit Tier. Verification made a separate third dimension (Pending/Verified/Failed), independent of Fit. Classification Engine now produces five outputs per lead instead of two scores. Tier C promotion requires a qualification-data change, not engagement volume — explicit rule, not implied.
- **v1.3** — Added: Engagement Score rubric with 14-day rolling decay (closes the v1.2 gap). Added Appointment Status as a distinct signal that outranks Engagement for active leads. Added the Follow-Up Ownership Engine (Automation / AI Agent / Admin / Blaise) — resolves the v1.2 capacity question. Renamed "speed-to-lead" to "speed-to-relevant-response." Added High-Intent Events as a trigger class independent of score.
- **v1.4** — Added Acquisition Economics v1.0 (Section 6.4–6.7): replaces the CAC/budget/case-value placeholders that survived three versions unanswered. **Corrected on the way in:** the $400/client operations allocation from the source economics draft was a variable cost applied to what is actually a fixed-cost resource (Layer 3 admin hire) — Marketing CAC and Fully Loaded CAC are kept as two distinct governing metrics for exactly this reason; see 6.4. **Open gaps: actual AI/admin operating cost is still unknown (only now correctly structured as fixed, not sized), real Review-to-client close rate is unknown, and whether $5,000 avg. client value means submitted, placed, or received first-year revenue is unconfirmed — all three are provisional modeling assumptions, not LLFG-specific data yet.**
- **v1.5** — Architecture frozen; this and future revisions are definition/measurement fixes and real-data updates, not new structure. Restored an internal, deterministic Fit Score (Section 3.1) — v1.2 correctly stopped blending Fit and Engagement into one score, but had also dropped point-based precision within Fit alone, leaving no way to classify a household that doesn't match a clean profile. Locked cohort-based (not calendar-month) attribution for Marketing CAC (Section 6.7) — the funnel's built-in lag would otherwise misstate CAC in exactly the early months that matter most. Locked "Client" = Appropriate Implementation, not Written Plan delivery (Section 6.7) — resolves the submitted/placed/received ambiguity by fixing the definition to placed business. Close rate reframed as a 20/25/33% scenario range, not a single assumed number (Section 6.8). **Added: full Retirement Income Stress-Test implementation specification (Section 2) — the first Framework Design → Implementation artifact.**
- **v1.6** — UX/visual design layer added to Section 2 (one-question-per-screen, phase-based progress indicator, four-card results layout, tier-specific result copy, Second-Opinion track copy). **Corrected on the way in:** the design pass had expanded the answer options on Screens 2, 5, 6, and 7 without assigning Fit Score or Planning Track values to the new options — Section 11 (Full Results) can't compute what it promises to show without them. Every new option now has an explicit value; Fit Score range and cutoffs recalculated accordingly (now sourced only from Section 2, not duplicated in Section 3.1, to prevent the two from drifting apart again). "Client" definition sharpened from a single event to a tracked status chain (Plan Delivered → Implementation Started → Implementation Placed/Activated → Revenue Received), with "Client" pinned to Implementation Placed/Activated specifically. Consent language now carries a build-gated `COMPLIANCE REVIEW REQUIRED` flag rather than a note that could be missed. Screen 7's "near-term decision" answer now also fires as a High-Intent Event (Section 3.9), not just a Fit Score contributor.
- **v1.7** — First working preview built from this spec (not production): an 11-screen self-contained HTML build with a Reviewer/Architect diagnostic drawer exposing Fit Score (with per-question breakdown), Fit Tier, Engagement Score/Level, Verification Status, Consent Captured, Planning Track, Primary Concern, all raw Stress-Test fields, attribution stubs, Acquisition Cohort, current route/next action, and Assigned Follow-Up Owner — for QA against this document. **Flagged, not yet resolved: the reviewer drawer is a client-side preview convenience, not a security boundary — the real build must compute Fit Score server-side (GHL workflow/webhook) so the scoring logic isn't exposed in page source regardless of any admin-gating on the drawer itself.** Tier A next-step copy softened (see Section 2, Screen 11) — the earlier draft ("Your situation calls for...") implied the questionnaire itself had made a formal planning determination, which runs against the education-first principle in Section 1.2.
- **v1.8** — Replaced invented Tier B/C education titles with the canonical LLFG education map (Section 2, Tier C experience). **Corrected on the way in:** the supplied map's example keys (`sequence`, `survivor`, `healthcare`, `social_security`) didn't match Screen 5's actual locked field values (`market_decline`, `survivor_income`, `healthcare_ltc`, `timing`) — copying them as given would have silently broken routing for four of nine concerns. Remapped to the real field names. The supplied map also had no row for `legacy` and included a ninth row actually keyed to Retirement Horizon, not Primary Concern — kept as a separate horizon-based override rather than folded into concern routing. **Open item: canonical `legacy` row still needed — currently falls back to the Retirement Income Explained umbrella.**
- **v1.9** — Persona QA run against the shipped build (12 personas, programmatically executed against the actual extracted constants/logic, not hand-computed). 10 PASS outright; 1 PASS with a flagged field-mapping note (pre-v1.6 persona wording); 1 FAIL — the preview only implemented 4 of Section 3.2's 9 locked Engagement events, making "High" engagement (18+) mathematically unreachable (max achievable was 14). Closed by adding the remaining 5 events (`returns_to_results`, `clicks_link`, `replies`, `attends_webinar`, `completes_booking`) with unchanged point values, plus manual simulation controls in Reviewer Mode for events with no natural trigger in a static preview. Re-running the failed persona with all 9 events now reaches 35 and correctly bands as High, with Fit Tier still holding at C as required. **New open item, surfaced rather than fixed:** summing every event in Section 3.2's original rubric totals 35, not the nominal "0–30" range stated there — that mismatch predates this build and is now visible instead of hidden. Needs a decision: raise the stated range, cap accumulation at 30, or accept the overflow as-is.
- **v2.0** — Two schema decisions locked: Engagement Score range corrected to **0–35** (High 18–35), matching the rubric's actual arithmetic rather than capping it — no point values changed. Canonical `legacy` education row added (Estate & Survivor Planning / The Written Retirement Income Sequence™) — **flagged, not silently accepted:** this is identical to `survivor_income`'s primary title, so those two concerns now share a lead-in rather than staying fully distinct. Four previously-provisional economics figures (Phase 1 ad budget $50→$100/day, $5,000 avg. client value, $850 Marketing CAC target, $1,100 ceiling) reclassified from "unconfirmed guess" to **locked Phase 1 operating assumptions** — still not verified as LLFG's actual financial data, just no longer relitigated each revision. **Added: Section 5.4, the GHL Field-Mapping Specification (Phase 1 — Data Foundation only).** Scope explicitly excludes live outbound automation (Section 5.2 stays deferred to Phase 2) — this phase validates that data lands correctly before any message, call, or AI conversation fires from it. Version-tracking fields added (Fit Model, Engagement Model, Stress-Test Version) using actual Revision Log milestones — Fit Model v1.6 (Fit Score table last changed), Engagement Model v1.3 (point-value rubric locked), Stress-Test Build v2.8 (last screen/copy change) — not the round-number placeholders first proposed, and not just copies of the current document version, since a Fit or Engagement field that moved with every document edit would make "scored under an old model" indistinguishable from "the document had an unrelated edit."
- **v2.1** — Formalized the code/label/points schema pattern across every scored or routed answer (Section 5.4B): `_code` (stable, recalculation key), `_label` (editable presentation copy), `_points` (derived, scored fields only). Extended to Primary Concern and Account Inventory as code+label with no points field, since Section 3.1 excludes both from scoring — an explicit empty cell, not an oversight. Staffing dependency resolved: no dedicated Admin/Concierge hire and no live AI agent at Phase 1 launch (Open Items 5–6, now closed) — Blaise plus existing support cover Phase 1 manually; Layer 2/3 activates once volume proves the bottleneck. **Corrected on the way in:** the proposed 5-value Ownership enum doesn't cleanly cover `OWNER_MATRIX`'s 9 actual output strings — split into a clean enum (for GHL workflow branching) plus a Detail field (the full string, unabridged), with an explicit collapse table between them. **Flagged: the enum's "Admin Recommended" value has no current combo that maps to it standalone — every Admin-inclusive combo also includes AI.**
- **v2.2** — Ownership schema finalized: dropped the Detail text field from v2.1 (unnecessary — the full `OWNER_MATRIX` string is always re-derivable from Fit Tier + Engagement Level, already-stored fields, the same recoverability logic already locked for Fit Score's `_points` fields). Enum locked to 6 stable snake_case values (`automation`/`ai`/`admin`/`ai_admin`/`blaise`/`blaise_support`) with separate display labels — "Recommended" moved out of every value into the field name itself. `admin` and `blaise` kept as real reserved values for future `OWNER_MATRIX` states even though no current combo maps to either standalone. Added a native "Actual Assigned Owner" field, distinct from the recommended value, empty/unassigned in Phase 1 wherever a role isn't staffed. **Flagged: two of the nine `OWNER_MATRIX` combos (A-Medium's escalation, B-High's "if intent strong") describe a condition or sequence a static enum value can't represent — a Phase 2 automation-logic question, not a schema one, noted now so it's visible before Section 5.2 activates.**
- **v2.3** — Closed the v2.2 flag: added Section 3.4.1, the escalation rule for A-Medium/B-High. Default queue priority is A-Medium before B-High (Fit Tier outranks Engagement — a direct application of Section 3.3's existing signal hierarchy, not a new precedence rule). Recommended Follow-Up Owner moves `ai_admin` → `blaise_support` for either row when Appointment Status becomes Active or a High-Intent Event fires; the override is absolute regardless of default tier ordering, but Engagement Level reaching High alone never triggers it. No change to Fit Tier or Engagement scoring. Open Item 11 closed.
- **v2.4** — Published the LLFG Phase 1 GHL Build Checklist — the flat, execution-ready version of Section 5.4, cross-referenced from it. Compiling every field's exhaustive option list (not just describing fields at a summary level) surfaced two new gaps: Planning Track's "Education" value (Section 3.6) is never actually produced by any Screen 6 answer — `PLANNING_TRACK` only maps to three outcomes, not four; and "Stress-Test Status: Abandoned" has no defined trigger anywhere in the build. Both flagged in the checklist and added as Open Items 12–13, not silently completed.
- **v2.5** — Closed both. Planning Track: `education` now fires when Intent = `mainly_researching`, taking precedence over the plan-status default — except `has_current_plan`, which stays unconditionally `second_opinion` regardless of Intent, since that's a different signal (what they have, not how they're engaging). `understand_options` considered and deliberately excluded from the trigger as a narrower reading of "researching/learning"; flagged for revisit. Planning Track picked up the code/label split (Section 5.4C) already used elsewhere. Stress-Test Status formalized as a three-state machine — `in_progress` / `abandoned` (24+ consecutive hours of inactivity, the only thing that sets it) / `completed` — with returning activity moving `abandoned → in_progress`, not directly to `completed`. **Corrected on the way in:** Section 5.2's existing recovery-SMS trigger read "1 hr after abandonment," which would have read as the recovery message waiting on the new 24-hour status — reworded to make explicit that recovery timing and the formal status are independent, exactly the conflation this lock exists to prevent.
- **v2.6** — Last Name added to Screen 9, required, mapping directly to GHL's native Contact Last Name field — explicitly not inferred or parsed from a combined Full Name input, since name-splitting heuristics fail in visible, foreseeable ways (multi-word surnames, single-name entries, non-Western naming order). **Clarified while in Section 5.4A anyway:** First Name, Last Name, Email, and Mobile Phone are native GHL Contact fields, not custom fields — building any of them as custom would silently duplicate a slot GHL already provides.
- **v2.7** — All four Screen 9 fields locked required: First Name, Last Name, Mobile Number, Email. Closes the inconsistency flagged in v2.6 (Last Name enforced, the other three weren't). Preview build updated to validate all four for presence before advancing to OTP. **Scope note: this is presence validation only** — non-empty, trimmed — not format validation (a syntactically invalid email or phone number still passes). Format validation is a separate, unaddressed decision, not silently added under "required."
- **v2.8** — Format validation added, closing the v2.7 scope note. Email: standard syntax check, normalized to lowercase/trimmed — verified against exact accept/reject examples (rejects `blaise@`, `blaise.com`, `@gmail.com`; accepts `blaise@example.com`). Mobile: US-only at launch (+1 default), accepts common entry formats, normalizes to E.164, rejects wrong digit counts and NANP-invalid area/exchange codes — the last check (area/exchange code can't start 0/1) was an interpretive addition beyond what was explicitly specified, flagged as such. Raw and normalized values stored separately for both fields (`email_raw`/`email_normalized`, `mobile_raw`/`mobile_normalized`); GHL's native fields receive the normalized values. Explicit non-goal: no email deliverability check — syntax only. OTP remains the actual reachability/ownership proof, unchanged. Preview build now validates live, per-field, inline — replacing the alert()-based submit-time check — with the CTA disabled until all four fields are valid and consent is checked.
- **v2.9** — GitHub/Vercel migration audit sync. Fixed a shipped-preview navigation defect that skipped Screen 4 (Account Inventory) after Screen 3; `investable_assets` now advances to Screen 4 as the 11-screen spec requires. Synced the preview to the v2.5 Planning Track lock so `mainly_researching` now produces `education` (except `has_current_plan`, which remains `second_opinion`). Removed the stale standalone `403b` Screen 4 option from the prose spec so it matches the canonical `401k_403b` code used by the checklist and preview. Stress-Test Build Version advanced to `v2.8` because Screens 9 validation/contact behavior changed after v1.6; Fit Model remains v1.6 and Engagement Model remains v1.3 because their scoring point systems did not change. No Fit points, Tier cutoffs, Engagement points, owner rules, or routing thresholds changed.

---

## ⚠️ Assumptions & Deviations From Your Original Framework

This document treats your original framework as the base. Everywhere I deviated or filled a gap, it's flagged below — nothing was silently changed.

| Area | Original | Change / Assumption | Confidence |
|---|---|---|---|
| OTP timing | Before calendar booking | Moved to *after* Stress-Test results are shown, before booking | [Likely] correct call — reduces top-funnel drop-off |
| Ad angles at launch | 5 angles simultaneously | Sequenced: 1 angle first (Written Plan), others added after 2–3 weeks of clean data | [Certain] this follows your own stated principle |
| Target CAC / cost-per-client ceiling | Not stated | **Locked (v2.0):** Marketing CAC ≤$850 target / $1,100 ceiling — operating assumption for Phase 1, not verified LLFG financial data. Fully Loaded CAC ≤$1,250 target / $1,500 ceiling stays pending until Layer 2/3 costs are real (Section 6.4) | [Guessing] — locked as the assumption to build against, not confirmed real data |
| Avg. commissionable case value | Not stated | **Locked (v2.0):** $5,000 average client value — operating assumption for Phase 1 | [Guessing] — revenue basis (submitted/placed/received) still explicitly unconfirmed, see Open Items |
| Monthly ad budget | Not stated | **Locked (v2.0):** $1,500/month ($50/day) at launch, scaling to $3,000/month ($100/day) once downstream economics support it — see Section 6.6 | [Guessing] — locked as the assumption to build against, not a confirmed hard ceiling from you |
| Compliance layer | Not addressed | Added TCPA/SMS consent and state insurance-solicitation disclosure requirements as a build dependency | [Certain] this is a real regulatory exposure, not optional |

**Still needed before these are real numbers, not modeling assumptions:** confirmation that $5,000 reflects the revenue basis you actually want to manage against (Section 6.4), and real AI/admin cost once Layer 2/3 are staffed (Section 6.5).

---

## 1. Final Blueprint

### 1.1 Funnel Architecture — LOCKED v1.2 fork, unchanged in v1.3 (2026-09-22)

```
Meta Traffic
        ↓
One Specific Retirement Problem (single angle at launch — see 4.1)
        ↓
Retirement Income Stress-Test
        ↓
Qualification Questions
        ↓
Preliminary Personalized Insight
        ↓
Contact Information + Consent  (TCPA/SMS consent language lives HERE)
        ↓
SMS OTP Verification
        ↓
Full Retirement Income Stress-Test Results
        ↓
CLASSIFICATION ENGINE — five independent outputs, not one score:
   Fit Tier (A/B/C) · Verification Status (Pending/Verified/Failed)
   Engagement Level (High/Medium/Low) · Planning Track · Primary Concern
        ↓
        ┌─────────────────────────────┴─────────────────────────────┐
        ↓                                                             ↓
   TIER A / B                                                    TIER C (education)
        ↓                                                             ↓
   Blaise Introduction                                    Concern-Matched Education
        ↓                                                             ↓
   Tier-specific Review CTA                              Retirement Income Explained /
   (strength/urgency varies by                            Seminars / Workshops / Email
    Fit×Engagement — see 3.3)                                         ↓
        ↓                                                  Periodic Requalification
   Calendar + Follow-up                                       (data change required —
   (speed varies by Engagement)                                see 3.5, not engagement volume)
        ↓                                                             ↓
        └─────────────────┬───────────────────┘          Still C  ←──┴──→  Promoted to A/B
                           ↓                                              (re-enters left fork)
              RETIREMENT INCOME REVIEW
                           ↓
              WRITTEN RETIREMENT INCOME PLAN
                           ↓
                   CONTINUITY BRIDGE™
                           ↓
               APPROPRIATE IMPLEMENTATION
                           ↓
                     CLIENT OUTCOME
                           ↓
         MARKETING FEEDBACK LOOP → creative, angle sequencing, classification rules
```

**Why this fork now actually works:** Tier A and B merge back into the same Review path (both are booking-eligible, differentiated by CTA strength and follow-up speed, not by whether they get a Review at all). Tier C has its own loop entirely — education, then requalification — and only re-enters the booking side when its *qualification data* changes, never on engagement alone. That distinction is now an explicit rule (Section 3.7), not an implication.

**Why Contact Info + Consent sits before OTP:** correct location for TCPA/SMS consent language — captured at the point contact info is collected, not retrofitted later. OTP then verifies what consent was already given for.

**Why Verification is its own dimension, not folded into Fit:** a lead can look like Tier A off the Stress-Test alone, before their phone is verified. Collapsing verification into the Fit score would either throw away pre-verification signal or let an unverified lead masquerade as fully qualified. Kept separate: display as "Tier A Candidate — Unverified" pre-OTP, "Tier A Priority — Verified" post-OTP.

### 1.2 Core Operating Principles (v1.0 base, renamed/extended in v1.3 — see Revision Log)

- Optimize for qualified conversations, not cheap leads
- Let the funnel do much of the targeting
- Use intentional friction to improve lead quality
- Verify mobile numbers with OTP
- Introduce Blaise before the first phone call
- Speed-to-relevant-response (renamed from speed-to-lead, v1.3): every prospect gets an immediate response, but not the same response — Tier A gets immediate personalized movement toward a conversation, Tier B gets immediate acknowledgment plus a relevant next step, Tier C gets immediate education
- Do not discard prospects who aren't ready — route to Tier C nurture
- Build a repeatable testing engine for audiences, offers, hooks, creatives
- Scale channels only after Meta + funnel economics are proven **(now actually enforced in the rollout plan — see Section 7)**
- Blaise is the planner and relationship authority, not the lead-chasing mechanism (v1.3) — the Follow-Up Ownership Engine (Section 3.8) exists so automation, AI, and admin do the repetitive work, and Blaise's time goes where his involvement materially changes the outcome

### 1.3 What "Proven" Means Before You Add a Second Channel

Don't move to Google/YouTube/seminars/retargeting until, over a rolling 3-week window:
- Cost per qualified household is at or below your ceiling (placeholder: $150 — replace)
- At least 8 Retirement Income Reviews have been booked and attended
- At least 1 client has closed from the funnel (proves the full chain works, not just the top)

---

## 2. Retirement Income Stress-Test — Implementation Specification (v1.6)

**This is the first Framework Design → Implementation artifact.** Every screen below specifies exact copy, exact answer values, the GHL field it writes to, its Fit Score contribution (Section 3.1), and what happens next. **v1.6 correction:** the answer sets on Screens 2, 5, 6, and 7 were expanded for better UX and personalization — that expansion is kept, but every new option below now carries an explicit Fit Score and/or Planning Track value. None of the new options shipped without one; that was the gap this revision closes.

**Locked UX principle:** one question per screen, not a multi-question form. Progress indicator reads as three phases, not "Question X of 11": **Your Retirement Picture → Priorities → Results.** Screens 8–11 aren't questions and don't count against the visible progress bar.

**Design direction:** warm ivory/white canvas, LLFG emerald + restrained gold accents, substantial whitespace, Blaise photography/video, large readable typography. No progress clutter, no insurance imagery, no stock-photo retirees on beaches. Mobile-first, one-thumb-completable.

**Design principle for question inclusion:** every question either qualifies (feeds Fit Score), segments (feeds Planning Track or Primary Concern), or builds emotional investment. Cut anything that does none of the three.

---

### Screen 1 — Entry
No question. Framing only.

> *"How prepared is your retirement income plan for the years ahead? In under 2 minutes, find out — and get your personalized Retirement Income results."*

CTA button: **Start My Retirement Income Stress-Test →**
GHL action: creates contact record (anonymous), sets Pipeline Stage = **New Lead**, tags Ad Angle Attribution from the click-through UTM.

---

### Screen 2 — Retirement Horizon

> **"When do you expect to retire or begin relying substantially on your retirement savings?"**

| Answer | GHL field value | Fit Score | Notes |
|---|---|---|---|
| Already retired | `already_retired` | +30 | |
| 0–2 years | `0_to_2_years` | +30 | Same weight as already-retired — imminent need |
| 3–5 years | `3_to_5_years` | +25 | **New band (v1.6)** |
| 6–10 years | `6_to_10_years` | +20 | |
| More than 10 years | `gt_10_years` | +5 | |
| Unsure | `unsure_horizon` | +10 | **New (v1.6)** — neutral-low, not disqualifying; same treatment logic as "prefer not to say" on assets |

GHL field: `retirement_horizon`
**⚠️ [Guessing]** All point values placeholder pending real cohort tuning, same status as every other numeric threshold in this document.

---

### Screen 3 — Retirement Assets

> **"About how much have you accumulated for retirement?"** *(with a short clarifying note on what counts — 401(k)/IRA/savings/investments, not home equity)*

| Answer | GHL field value | Fit Score | Notes |
|---|---|---|---|
| Under $100K | `under_100k` | +0 | |
| $100K–$250K | `100k_250k` | +10 | |
| $250K–$500K | `250k_500k` | +20 | |
| $500K–$1M | `500k_1m` | +30 | |
| $1M+ | `1m_plus` | +30 | |
| Prefer not to say | `undisclosed` | +15 | Neutral midpoint — does not disqualify or penalize privacy |

GHL field: `investable_assets`

---

### Screen 4 — Retirement Pieces (multi-select, no Fit Score contribution)

> **"Which of these are part of your retirement picture?"** *(select all that apply)*

Options: `401k_403b` · `ira_traditional` · `ira_roth` · `tsp` · `pension` · `brokerage` · `annuity` · `social_security` · `business_ownership` · `real_estate` · `none_yet`

GHL field: `account_inventory` (multi-value)
**Purpose:** qualification rapport and personalization data for the advisor conversation — does not feed Fit Score, Tier, or branching.

---

### Screen 5 — Primary Concern (drives content personalization, not Fit Score)

> **"What concerns you most about retirement right now?"** *(single-select)*

| Answer | GHL field value | Concern-matched insight sentence (used on Screen 8 and in nurture) |
|---|---|---|
| Creating dependable income | `income` | "Turning what you've accumulated into dependable, lasting income is one of the most common — and most fixable — planning gaps once you have a written plan." |
| Taxes | `taxes` | "Most people underestimate how much of their retirement income tax rules will claim — a written plan is where that gets addressed directly." |
| A market decline near retirement | `market_decline` | "A downturn in the years right around retirement can do outsized damage to your income — this is called sequence-of-returns risk, and it's rarely addressed by account statements alone." |
| Outliving my savings (longevity) | `longevity` | "Planning for a retirement that could last 25–30+ years is different from planning for a fixed number of years — a written plan accounts for that directly." |
| Survivor income for my spouse | `survivor_income` | "Making sure your spouse is fully provided for if something happens to you is exactly what a written retirement income plan is built to solve." |
| Healthcare / long-term care costs | `healthcare_ltc` | "Healthcare and long-term care costs are one of the biggest unplanned drains on retirement income — this is a standard part of a coordinated written plan." |
| Timing my retirement decisions | `timing` | "Knowing exactly when to retire, claim Social Security, or start drawing income is a timing question a written plan is built to answer." |
| Coordinating everything I have | `coordination` | "Having several accounts and pieces is common — the question is whether they're working together, which is exactly what plan coordination solves." |
| Legacy for my family | `legacy` | "Making sure what you've built lasts beyond you is a legacy question a written retirement income plan directly addresses." |

GHL field: `primary_concern`

---

### Screen 6 — Written Plan (highest-leverage question — feeds both Fit Score and Planning Track)

> **"Do you currently have a written retirement income plan?"**

| Answer | GHL field value | Fit Score | Planning Track assigned |
|---|---|---|---|
| No plan | `no_plan` | +20 | **Build My First Written Plan** |
| I have accounts, but no coordinated plan | `accounts_no_plan` | +18 | **Build My First Written Plan** — **New (v1.6):** distinct from "no plan" for messaging (they've accumulated something), same Planning Track |
| I have projections, but not a real income plan | `projections_only` | +15 | **Update & Coordinate My Plan** — **New (v1.6)** |
| My plan is outdated or I don't fully trust it | `outdated_plan` | +15 | **Update & Coordinate My Plan** |
| I have a current, trusted plan | `has_current_plan` | +5 | **Second Opinion** |

GHL field: `written_plan_status`

---

### Screen 7 — Intent

> **"What are you hoping to accomplish?"**

| Answer | GHL field value | Fit Score | Notes |
|---|---|---|---|
| Build a written plan | `build_plan` | +15 | |
| Verify my income is on track | `verify_income` | +15 | **New (v1.6)** |
| Get a second opinion | `second_opinion` | +15 | |
| Make a near-term decision | `near_term_decision` | +20 | **New (v1.6)** — weighted above the others: this is the strongest stated-urgency signal on this screen and should also register as a **High-Intent Event (Section 3.9)**, not just a Fit Score contributor |
| Understand my options | `understand_options` | +10 | **New (v1.6)** — mid-weight: more engaged than pure research, less committed than the above |
| Mainly researching | `mainly_researching` | +0 | |

GHL field: `stated_intent`
**Note:** low-intent answers don't zero out Fit Score earned on Screens 2/3/6 — Section 3's governing rule (a label describes readiness for outreach style, not qualification) still holds.

---

### Recalculated Fit Score Range & Cutoffs (v1.6)

Max possible: Screen 2 (30) + Screen 3 (30) + Screen 6 (20) + Screen 7 (20) = **100.** Cutoffs: **A = 70+ · B = 40–69 · C = below 40.** **⚠️ [Guessing]** Same placeholder status as before — these move once real cohort data exists (Section 6.4).

**Worked example, updated for the v1.6 options:** 3–5 years out (+25), $250K–$500K (+20), accounts but no coordinated plan (+18), near-term decision (+20) = **83 → Tier A**, and this lead also fires a High-Intent Event from Screen 7.

---

### Screen 8 — Preliminary Insight (no full results, no contact info yet)

Fit Score calculated silently (Screens 2, 3, 6, 7). **No numerical score shown at this stage** — a qualitative teaser only, using the Primary Concern sentence from Screen 5:

> *"You've accumulated several retirement resources, but your responses suggest [concern-matched insight, softened to a discovery framing rather than a verdict]. Enter your info below to get your complete results."*

Pipeline Stage → **Insight Shown — No Consent Yet**.

---

### Screen 9 — Contact + Consent

> **"Where should we send your complete results?"**

Fields: First Name (**required**), Last Name (**required**), Mobile Number (**required**), Email (**required**). Consent language sits directly beneath the phone field, not in a footer or modal.

**Format validation — LOCKED v2.8, syntax only, not deliverability or reachability:**

| Field | Rule |
|---|---|
| First Name / Last Name | Trim leading/trailing whitespace. Non-empty after trim is the only bar — no arbitrary minimum length beyond that. |
| Email | Must match standard email syntax (`local@domain.tld` shape) before submission. Normalize to lowercase, trimmed. Rejects: `blaise@`, `blaise.com`, `@gmail.com`. Accepts: `blaise@example.com`. **Syntax only — this does not verify the mailbox exists.** |
| Mobile Number | US-only at launch, default country +1. Strip formatting, accept common entry styles (`(214) 907-5087`, `214-907-5087`, `2149075087`). Normalize to E.164 (`+12149075087`). Reject if digit count isn't 10 (or 11 with a leading 1) or if the resulting area code / exchange code starts with 0 or 1 (NANP-invalid). **This confirms the number is well-formed, not that this specific person controls it — OTP (Screen 10) remains the actual reachability/ownership proof.** |

**Store raw and normalized separately for Email and Mobile** — same principle as Section B's `_code`/`_label` split, applied here for a different reason: the normalized value is what OTP and GHL should act on, the raw value is what the person actually typed, kept for debugging rather than as a prominent CRM field.
```
email_raw = " Blaise@Example.com "        email_normalized = "blaise@example.com"
mobile_raw = "(214) 907-5087"             mobile_normalized = "+12149075087"
```

**Error UX:** inline, per-field, live — not a generic error on submit. "Please enter a valid email address." / "Please enter a valid mobile number." / "First name is required." / "Last name is required." The submit CTA stays disabled until all four fields are valid and consent is checked, not just until the person clicks a button that then rejects them.

**Last Name is its own input, not derived from a combined Full Name field.** It writes directly to GHL's native Contact "Last Name" field — never parsed or split from a single name string. This matters beyond tidiness: name-splitting heuristics fail visibly and often (multi-word surnames, single-name entries, cultural naming order), and every failure would land as a data-quality problem discovered downstream, in the CRM, rather than caught at the point of entry.

**Consent checkbox (required, not pre-checked) — status: `COMPLIANCE REVIEW REQUIRED`, build-gated:**

> *"By providing your number, you agree to receive text messages and calls from Lifeline Legacy Financial Group about your Retirement Income Stress-Test results, including by automated means. Message and data rates may apply. Consent is not a condition of any purchase. Reply STOP to opt out."*

**This exact string must not ship to production without compliance/E&O sign-off — it carries a `COMPLIANCE REVIEW REQUIRED` flag in the build itself (e.g., a feature-flag or a hard-coded warning banner in the CMS entry), not just a note in this document. A placeholder that quietly graduates to production because nobody remembered to swap it is a foreseeable failure mode; the build should make that impossible, not just unlikely.**

**Fields map to GHL's native Contact fields, not custom fields** — First Name, Last Name, Mobile Phone, and Email all have standard native slots in GHL; building any of them as a custom field would create a silent duplicate of data GHL already has a home for. Custom fields are for everything GHL doesn't natively model (Section 5.4B onward) — Consent Captured, Consent Timestamp, Consent Language Version, `sms_consent`.

Pipeline Stage → **Consent Captured — Unverified**

---

### Screen 10 — OTP Verification

> *"Verify your mobile number — we texted you a 6-digit code."* Clean verification UI with resend and change-number options.

On success: `otp_verified` = true, Verification Status = **Verified**, Pipeline Stage → **Verified**, Engagement Score +15 (Section 3.2).
On repeated failure: Verification Status = **Failed**, trigger the alternate-verification-path automation (Section 3.5).

---

### Screen 11 — Full Results + Next Step

Fit Score finalized → Fit Tier assigned (per the recalculated cutoffs above). Full Classification Engine output assigned: **Fit Tier, Verification Status, Engagement Level, Planning Track, Primary Concern.**

**Layout — four premium diagnostic cards, not a numeric score:**

```
Retirement Stage          [e.g., "Within 3–5 Years"]
Planning Status           [e.g., "Written Income Plan Gap Identified"]
Primary Concern           [e.g., "Creating Dependable Retirement Income"]
Planning Track            [e.g., "Build Your Written Retirement Income Plan"]
```

Followed by a short interpretation, e.g.:

> *"You've done important work accumulating retirement assets. Based on your responses, the next planning question may be how those resources work together to create dependable income once the paycheck stops."*

**No "Score: 67/100, you're at risk" framing anywhere.** This is a diagnostic result, not a lead-gen score reveal.

**Tier A experience:** Next-step copy — *"Based on your responses, a Retirement Income Review may be the appropriate next step. This is where we can look at how your retirement pieces fit together and determine whether a written income plan would be helpful."* **(v1.7: softened from an earlier, more deterministic draft — "Your situation calls for a full Retirement Income Review" implied the questionnaire itself had made a formal planning determination, which runs against the education-first principle in Section 1.2.)** Blaise appears via short personal video — *"Hi, I'm Blaise Tamo. Based on the kind of situation that brought you here…"* (framed as responding to the pattern of answers, never implying he personally reviewed this specific submission — that would be a false claim). CTA: **Schedule My Retirement Income Review →**, followed by "What we'll examine" (income sources, accounts, timing decisions, taxes, risks, whether the pieces are working together). AI/admin follow-up begins immediately behind the scenes (Section 3.8).

**Tier B experience:** same personalized results and Blaise appearance, softened urgency — *"You're at a good point to begin organizing the retirement income picture."* Two parallel CTAs: **Schedule a Retirement Income Review** or **Continue My Retirement Income Education** (concern-matched).

**Tier C experience:** no calendar push. *"Your next step is education and preparation."* Concern-matched recommendations, using the canonical LLFG education map below — not invented titles — plus "Upcoming LLFG Workshops" and a retake-later option. The relationship is preserved, not ended, until circumstances or intent change (Section 3.7's promotion rule still governs).

**Canonical LLFG Education Map (v2.0) — routing titles, not a claim every asset is published:**

| Primary Concern (Screen 5 field value) | Primary Recommendation | Supporting Recommendation |
|---|---|---|
| `income` | The 10-Year Retirement Countdown | The Written Retirement Income Sequence™ |
| `taxes` | Retirement Taxes | The Written Retirement Income Sequence™ |
| `market_decline` | Market & Sequence Risk | The 10-Year Retirement Countdown |
| `longevity` | Inflation & Longevity | Retirement Income Explained |
| `survivor_income` | Estate & Survivor Planning | Retirement Income Explained |
| `healthcare_ltc` | Medicare & Healthcare | The 10-Year Retirement Countdown |
| `timing` | Social Security Explained | The 10-Year Retirement Countdown |
| `coordination` | Retirement Income Explained | The Written Retirement Income Sequence™ |
| `legacy` | Estate & Survivor Planning | The Written Retirement Income Sequence™ |

**⚠️ Flagged, not an error:** `legacy` and `survivor_income` now share an identical Primary Recommendation. That's a deliberate editorial call (estate planning content genuinely spans both), but it means those two distinct Primary Concerns surface the same lead-in title rather than fully distinct content paths — worth knowing if "every concern gets visibly different content" was an implicit design goal.

**Horizon override (separate from concern-based routing, keyed off Screen 2 not Screen 5):** `already_retired` → **First Five Years of Retirement** / **When Retirement Does Not Go as Planned**, shown regardless of Primary Concern.

"Retirement Income Explained" is the parent umbrella library everything above sits under. All nine Primary Concerns now have canonical rows — no fallback logic remains in the build.

**Second-Opinion Track (Planning Track = Second Opinion, any Fit Tier):** distinct language, never "you failed our test" framing. *"You already have a retirement plan. The question may be whether you'd benefit from a second set of eyes."* CTA: **Request a Retirement Income Second Opinion →**.

**Hidden system behind Screen 11 (what GHL receives vs. what the visitor sees):** Fit Score, Fit Tier, Verification Status, Engagement Score, Engagement Level, Planning Track, Primary Concern, Retirement Horizon, Asset Range, Account Inventory, Written Plan Status, Intent, Acquisition Cohort, Traffic Source, Campaign, Ad Set, Ad, Ad Angle, Creative, Current Journey Stage, Assigned Follow-Up Owner. Simple experience on the front end, full classification detail behind it — this is the same principle Section 3.7's full lead profile already established, applied to the actual screen.

Pipeline Stage moves to **Tier A/B — Not Booked**, **Tier C — Nurture**, or the Second-Opinion track per Section 5.1. From here, the Follow-Up Ownership Engine (Section 3.8) takes over — this screen is the last thing the Stress-Test itself controls.

---

## 3. Classification Engine (v1.2 — replaces the single blended-score model)

**⚠️ Fit Tier thresholds below still use placeholder dollar amounts — replace once you send real numbers. Engagement Level thresholds below are a proposed rubric to close the gap the v1.2 correction left open — confirm or revise before building GHL workflows against it.**

**Governing rule:** Fit determines WHO the household is. Engagement determines HOW we work them. **Engagement cannot promote or demote Fit Tier.** A $1.2M household retiring in 2 years who skips Blaise's video is still Tier A — just Tier A with a different (not lesser) treatment. A 45-year-old with $90K who watches everything and attends seminars is still Tier C — a valuable one, not a promoted one.

### 3.1 Fit Tier (A/B/C) — LOCKED v1.6: deterministic Fit Score, not a profile description

**Correction (v1.5):** v1.2 replaced the original point-based Fit Score with a qualitative profile ("~0–5 yrs, $500K+...") to fix the real problem — Fit and Engagement being blended into one number. That correction was right. Going further and dropping points *within* Fit alone was not required by it, and left no way to resolve a household that doesn't match a clean profile. Restored an internal, deterministic Fit Score, used only within this dimension.

**Authoritative source (v1.6):** the exact per-answer point values live in Section 2, next to each screen's actual answer options — Screen 2 (Retirement Horizon), Screen 3 (Assets), Screen 6 (Written Plan), Screen 7 (Intent), plus the "Recalculated Fit Score Range & Cutoffs" note immediately after Screen 7. Kept in one place, next to the copy it scores, rather than duplicated here where the two versions drifted out of sync once Screen answer sets were revised in v1.6 — that duplication is exactly what caused this section to need a fix in the first place.

**Governing rule, unchanged:** Fit determines WHO the household is. Engagement determines HOW we work them. **Engagement cannot promote or demote Fit Tier.** A $1.2M household retiring in 2 years who skips Blaise's video is still Tier A. A 45-year-old with $90K who watches everything and attends seminars is still Tier C.

### 3.2 Engagement Level (High / Medium / Low) — LOCKED v2.0: range corrected to 0–35

**The v1.2 gap is closed.** Hidden numeric Engagement Score (0–35), calculated over a **rolling 14-day window** for active lead handling, with a separate 30–90 day rolling window kept for reactivation history. Simple email opens are excluded (too noisy); speed-of-completion is not scored as a negative unless real data later proves it predictive.

| Behavior | Points |
|---|---|
| Completes Stress-Test | +3 |
| Views full results after OTP | +3 |
| Watches 50%+ of Blaise intro | +3 |
| Watches 90%+ of Blaise intro | +2 additional |
| Opens booking page | +3 |
| Returns to results/website | +2 |
| Clicks concern-matched email/SMS link | +2 |
| Replies to SMS/email | +4 |
| Attends webinar/seminar | +5 |
| Books Retirement Income Review | +8 |

**Bands (LOCKED v2.0 — no artificial cap):** High = 18–35 · Medium = 8–17 · Low = 0–7. The rubric's 9 events genuinely sum to 35, not 30 — the range is now stated to match the arithmetic rather than the arithmetic being capped to match a rounder-looking range. Starting operating thresholds — recalibrate after 60–90 days against what actually predicts booking and attendance.

**Decay is deliberate, not a bug:** a Tier B prospect who engaged heavily in one month and disappears for two doesn't keep a stale "High Engagement" label — their Fit Tier stays put, their current Engagement Level falls to Low on the rolling window, and it rises again if they re-engage (e.g., attending a later seminar). This is what makes the label operationally trustworthy rather than a historical artifact.

### 3.3 Appointment Status — outranks Engagement for active leads (new in v1.3)

Once someone books a Retirement Income Review, debating whether they're "High Engagement" stops being useful — they become **Appointment Active**, and that status takes priority over the Engagement label for routing purposes. A lead who booked yesterday but hasn't watched the intro video is more actionable than one who watched every video but hasn't booked, and the system should treat them that way.

**Signal hierarchy (sort/routing precedence, not a weighted score):**
```
Fit Tier → Verification → Appointment Status → Engagement Level → Planning Track → Primary Concern
```
This order answers "which field should a routing rule check first when two signals point in different directions" — e.g., an Appointment Active lead is never bumped down a queue by a Low Engagement Level, because Appointment Status is checked first. It is not a scoring formula and nothing here overrides the Section 3.7 rule that only qualification-data changes move Fit Tier.

### 3.4 The Operating Matrix — Fit × Engagement → Named Owner (v1.3, replaces the unresolved v1.2 matrix)

| Fit | Engagement | Primary Owner | Treatment |
|---|---|---|---|
| A | High | Blaise + AI/Admin support | Immediate priority |
| A | Medium | Admin/AI → Blaise escalation | Same-day contact |
| A | Low | AI/Admin | Re-engage, preserve A status |
| B | High | Admin/AI, Blaise if intent strong | Review push |
| B | Medium | AI + automation | Nurture + booking opportunity |
| B | Low | Automation/AI | Qualified nurture |
| C | High | Automation/AI | Education + requalification |
| C | Medium | Automation | Educational nurture |
| C | Low | Automation | Low-frequency nurture |

The v1.2 capacity question — who does "same-day human follow-up" at volume — is resolved by Section 3.8's ownership layers below. It is not resolved by simply naming Blaise in more cells; Blaise appears in exactly two rows (Tier A + High, and any explicit escalation), by design.

### 3.4.1 Escalation Rule for A-Medium and B-High — LOCKED v2.3

Two rows above describe a condition, not a fixed state: A-Medium's "→ Blaise escalation" and B-High's "Blaise if intent strong." This rule resolves both, and sets default queue priority between them:

- **Default ordering:** A-Medium precedes B-High in the working queue, because Fit Tier outranks Engagement in Section 3.3's signal hierarchy — this isn't a new precedence rule, it's that hierarchy applied to this specific comparison.
- **Escalation trigger (identical for both rows):** Recommended Follow-Up Owner moves from `ai_admin` to `blaise_support` when either fires — **Appointment Status becomes Active** (Section 3.3), or **a High-Intent Event fires** (Section 3.9). Nothing else moves it; Engagement Level reaching High on its own does not.
- **The override is absolute:** a booked appointment or High-Intent Event promotes the record regardless of tier — a B-High lead that books outranks an unescalated A-Medium lead in the working queue, even though A-Medium outranks B-High by default. Engagement score alone never does this — B-High does not outrank A-Medium on engagement score alone.
- **No change to Fit Tier or Engagement scoring.** This rule only moves the Recommended Follow-Up Owner value and queue position; it doesn't touch how either score is computed.

### 3.5 Verification Status (independent dimension)

| Status | Meaning | Display |
|---|---|---|
| Pending | Fit Tier assigned from Stress-Test answers, OTP not yet complete | "Tier A Candidate — Unverified" |
| Verified | OTP complete | "Tier A Priority — Verified" |
| Failed | OTP attempted, not completed after retries | Re-target with alternate verification path (call vs. text) before dropping to nurture |

### 3.6 Planning Track — LOCKED v2.5: code/label, driven by Written Plan Status with an Intent-based override

**Four values, stable codes:**

| Code | Label |
|---|---|
| `build_first_plan` | Build My First Written Plan |
| `update_coordinate` | Update & Coordinate My Plan |
| `second_opinion` | Second Opinion |
| `education` | Education |

**Assignment rule, in this precedence order:**

1. **`written_plan_status == has_current_plan` → always `second_opinion`.** Unconditional — Intent does not override this. Someone with a trusted plan who's casually researching still gets "second set of eyes" framing, because Second Opinion is driven by *what they have*, not *how actively they're seeking help*; those are different signals and shouldn't collapse into one.
2. **Else, if `stated_intent == mainly_researching` → `education`.** This is the fix for the previously-unreachable value: Education wasn't produced by any Written Plan Status alone, because it isn't really a plan-status signal — it's an intent signal. `understand_options` was a plausible second trigger for this rule and was deliberately excluded, kept narrower to the more literal "primarily researching/learning" case; revisit if that's too narrow in practice.
3. **Else,** the plan-status default applies: `no_plan` / `accounts_no_plan` → `build_first_plan`; `projections_only` / `outdated_plan` → `update_coordinate`.

**Do not equate Fit Tier with Planning Track.** A Tier C lead who states an active intent (not `mainly_researching`) still gets `build_first_plan` or `update_coordinate`, not `education` — Fit Tier, Planning Track, and public routing (Section 2, Screen 11) are three separate dimensions that happen to correlate often, not one collapsed into the other. A Tier A lead who says `mainly_researching` gets `education` as their Planning Track even though their Fit-based routing still sends them toward a Review CTA — the two aren't forced to agree.

### 3.7 Tier C Promotion Rule (explicit — this is the fix to the "fork" problem)

Tier C promotes to A/B **only** when qualification data changes:
- Retakes the Stress-Test with a changed situation
- Updates retirement horizon
- Updates reported assets
- Develops a specific planning concern
- Intent shifts from research to planning
- Attends an event and explicitly requests a planning conversation
- Blaise/team manually requalifies after a substantive interaction

High engagement alone **never** promotes Fit Tier. It can trigger a soft requalification prompt ("It may be time to reassess where you stand") — the prompt is earned by engagement, the promotion is earned by new data. **High-Intent Events (Section 3.10) can elevate follow-up priority through the same never-changes-Fit-Tier rule.**

### 3.8 Follow-Up Ownership Engine (new in v1.3 — resolves the v1.2 capacity question)

Four layers, escalating in cost and in when Blaise's time is actually the scarce resource being spent:

**Layer 1 — GHL Automation.** Handles, for everyone, automatically: results delivery, SMS/email confirmation, the Blaise intro video, calendar links, reminders, abandoned-test recovery, general nurture, requalification invitations.

**Layer 2 — AI Follow-Up Agent.** Handles the first conversational touch for Tier A/B leads: confirms interest, checks whether results were received, answers approved FAQs, explains what the Retirement Income Review is, helps schedule/reschedule/confirm appointments, follows up after incomplete booking, identifies whether the prospect wants a human conversation, routes urgent questions, collects non-sensitive additional information, reactivates qualified leads. **It does not independently make individualized financial recommendations or recommend specific products** — that stays with Blaise/the licensed planning process. **⚠️ [Likely] Unresolved: disclosure requirements (is the prospect told they're messaging an AI?) and whether AI-agent messaging about retirement income concerns needs the same compliance review as anything sent under Blaise's license — flag this for your compliance/E&O contact before Layer 2 goes live, not after.**

**Layer 3 — Admin / Retirement Client Concierge.** The human bridge: calls qualified households, confirms appointments, answers process questions, helps with scheduling, follows up with no-shows, ensures documents are received, escalates planning questions, keeps the CRM clean, identifies high-intent households for Blaise. Can start part-time before it needs to be a full-time role. **⚠️ This is a real payroll/contractor cost, structured as fixed not variable — see Section 6.5.**

**Layer 4 — Blaise.** Reserved for the highest-value escalation, not the default follow-up engine: Tier A + High Engagement, Tier A + booked meeting, Tier A + explicit request to speak with an advisor, Tier A + high-value/complex planning situation, Tier B + High Engagement + strong intent, and any AI/admin escalation flagged for complexity or urgency.

**Ownership moves automatically as classification changes** — e.g., a Verified Tier A/Medium-Engagement lead gets an automated response, then an AI-agent conversation, then an admin task; if the exchange pushes Engagement Score past 18 (High), a Blaise alert fires. Blaise doesn't watch the CRM — the system tells him when a household has become worth his immediate attention.

**Illustrative capacity math (placeholder volume, not a commitment):** at 50 leads/week (roughly 12 Tier A / 15 Tier B / 23 Tier C under current placeholder thresholds), automation touches all 50, the AI agent engages the ~27 Tier A/B households, admin personally touches 15–20, and Blaise receives roughly 6–10 high-priority escalations plus scheduled Reviews. At 100 leads/week, the plan is to add admin capacity, not double Blaise's call load — but "add admin capacity" isn't yet a numbered trigger (e.g., "hire a second concierge at X leads/week sustained for Y weeks"); that threshold should be set before volume forces the decision under pressure.

### 3.9 High-Intent Events (trigger class independent of Engagement Score)

These elevate follow-up priority regardless of current score, but — consistent with Section 3.7 — **do not by themselves change Fit Tier**:
- Explicit requests for a call or help
- Statements indicating an imminent life/retirement transition (e.g., retiring this year, recently left an employer, a change in household circumstances)
- Explicit uncertainty about a specific dollar amount sitting in an account
- Repeated visits to the booking page
- A completed booking
- An SMS/email reply requesting a conversation
- **Screen 7 = "Make a near-term decision" (Section 2)** — the strongest stated-urgency answer on the Stress-Test itself; fires this trigger automatically, not just its Fit Score points

### 3.10 Full Lead Profile (what every completed Stress-Test produces)

Every prospect record now carries eight fields, not five:

```
WHO ARE THEY?          Fit Tier: A / B / C
CAN WE CONTACT THEM?   Verification: Verified / Pending / Failed
HOW ACTIVE ARE THEY?   Engagement: High / Medium / Low (Score: 0–35, 14-day rolling)
IS AN APPOINTMENT LIVE? Appointment Status: Active / None
WHAT ARE THEY DOING?   Planning Track
WHAT WORRIES THEM?     Primary Concern
WHO HANDLES THEM?      Owner: Automation / AI / Admin / Blaise
HOW URGENT?            Priority: Immediate / Same-Day / Nurture
```

Example GHL record:

```
Fit Tier: A — Priority          Fit basis: $500K–$999K, 2-yr horizon, no plan
Verification: Verified          Engagement: Medium (Score: 14)
Appointment Status: None        Planning Track: Build My First Written Plan
Primary Concern: Survivor Income
Source: Meta / Written Retirement Income Plan / Blaise Video 03
Current Stage: Results Viewed — Not Booked
Owner: Admin/AI → Blaise escalation      Priority: Same-Day
```

---

## 4. Meta Campaign Architecture

### 4.1 Phase 1 Structure (Days 1–21, single angle — see disagreement above)

**Campaign objective:** Leads (or Conversions if pixel/CAPI is mature enough — confirm with GHL setup)

**Single ad set, 2–4 creative variants, one angle:** "Written Retirement Income Plan"
- Creative 1: Blaise to-camera, problem-agitate-solve, 30–45 sec
- Creative 2: Static/carousel — "3 signs you don't have a real retirement income plan"
- Creative 3: Client-outcome-style testimonial format (once you have real ones; use a credible placeholder framework until then — never fabricate a testimonial)
- Creative 4: Direct-response static ad with the Stress-Test as the explicit CTA

**Audience:** broad, age 55–70, DFW metro + [confirm radius], let Meta's algorithm + your funnel friction do the targeting per your own principle — don't over-narrow interest targeting on Day 1.

**Budget:** placeholder $100–150/day for Phase 1 (replace with real ceiling).

### 4.2 Phase 2 (Days 22–45) — add angle #2

Only after Section 1.3's "proven" bar is cleared. Add "sequence-of-returns risk" as angle #2 (matches Screen 5's most commonly-selected concern in most retirement audiences — confirm with your own data once live).

### 4.3 Phase 3 (Days 46+) — full 5-angle rotation + retargeting

- Retargeting campaign: stress-test starters who didn't finish, OTP-abandoners, booked-but-no-show
- Lookalike audience built from Tier A closed clients (needs 50+ conversions minimum to be reliable — don't build this early)

### 4.4 Compliance Flag [Certain on the base items, Likely on the v1.3 addition]

Insurance/annuity advertising and SMS outreach are regulated. Before launch, confirm:
- TCPA consent language is present at the OTP/phone-capture step (explicit opt-in for SMS/calls, not implied)
- Ad creative doesn't imply guaranteed returns or make claims that require state-specific insurance-advertising disclosures
- Meta's financial-services ad category restrictions (special ad category rules, if applicable in your case) are checked before the campaign is submitted for review
- **New (v1.3, unresolved):** before the AI Follow-Up Agent (Section 3.8, Layer 2) goes live, confirm with your compliance/E&O contact whether (a) prospects need to be disclosed that they're messaging an AI, per applicable state bot-disclosure rules, and (b) AI-agent messages discussing retirement income concerns or explaining the Review require the same review/retention standard as communications sent under Blaise's license. This is a build dependency for Layer 2, not a nice-to-have.

---

## 5. GHL Pipeline & Automation Architecture

### 5.1 Pipeline Stages (updated to match the locked funnel)

1. **New Lead** (stress-test started, not completed)
2. **Insight Shown — No Consent Yet** (preliminary insight shown, contact info/consent not yet captured)
3. **Consent Captured — Unverified** (contact info + TCPA consent given, OTP not yet done)
4. **Verified** (OTP complete, full results shown, Fit/Engagement/Tier/Planning Track assigned)
5. **Tier A/B — Not Booked** (routed toward booking)
6. **Tier C — Nurture** (routed to education track; re-enters stage 5 if re-scored up)
7. **Booked** (Retirement Income Review on calendar)
8. **Attended**
9. **No-Show**
10. **Plan Delivered**
11. **Implementation Started**
12. **Client — Implementation Placed/Activated** (this is the stage that counts as "Client" for CAC and close-rate purposes — Section 6.7)
13. **Revenue Received** (lagging, tracked separately — does not retroactively change when someone was counted as a client)
14. **Second-Opinion Track** (Planning Track = Second Opinion, runs parallel to stages 5–13 with different content/offer framing)

**Stage 5 vs. 5-with-low-engagement:** per Section 3.4's operating matrix, a Tier A lead at Low Engagement should trigger the "high-value re-engagement" task instead of the standard automated stage-5 sequence — build this as a conditional branch on the Engagement Level field, not a separate pipeline stage. This is now handled by the Follow-Up Ownership Engine (Section 3.8) rather than an unresolved question.

### 5.2 Automation Triggers

| Trigger | Action | Timing |
|---|---|---|
| Stress-test started, not finished | SMS/email: "You're 2 questions from your Retirement Income Score" | 1 hr after last activity — a recovery attempt, distinct from the formal `abandoned` Stress-Test Status, which only fires at 24hrs (Section 5.4D). Sending this earlier does not and must not change the stored status. |
| Stress-test completed, OTP not done | SMS: "Your results are ready — verify your number to unlock them" | Immediate, then +2 hrs, then +1 day |
| OTP verified, not booked | Blaise intro video sent + booking link | Immediate |
| Verified, not booked after 24 hrs | SMS/call task created for team | +24 hrs |
| Booked | Confirmation + calendar invite + Blaise photo/intro | Immediate |
| Booked | Reminder sequence: 1 day, 2 hr, 1 hr before | Scheduled |
| No-show | 5-day no-show re-engagement sequence (reuse existing seminar no-show sequence logic already built) | +0, +1, +3, +5 days |
| Attended, plan not yet delivered | Internal task: deliver written plan within 5 business days | On attendance |
| Plan delivered | Client-outcome story request (only after implementation, with consent) | Post-close |
| Tier C / exploring | Enter Kitchen Table Coffee weekly nurture + seminar invites | Immediate, ongoing |

### 5.3 Custom Fields Needed (superseded by Section 5.4's full spec — kept for change history)

- Fit Tier (A/B/C)
- Verification Status (Pending/Verified/Failed)
- Engagement Level (High/Medium/Low) — computed from the point rubric in Section 3.2 until real thresholds are confirmed
- Planning Track (Build First Plan / Update & Coordinate / Second Opinion / Education)
- Primary Concern (from Screen 5)
- Written Plan Status (from Screen 6)
- Consent Captured (bool + timestamp — needed for TCPA record-keeping, not just a flag)
- Ad Angle Attribution (which creative/angle sourced the lead — critical for your testing engine)

**This reuses your existing GHL infrastructure** (custom fields, QR/check-in logic, chatbot) rather than duplicating it — the seminar funnel and this funnel should share the same CRM backbone with different pipeline stages, not live as separate systems.

### 5.4 GHL Field-Mapping Specification — Phase 1: Data Foundation Only (LOCKED v2.0)

**Execution version of this section:** LLFG Phase 1 GHL Build Checklist (v2.8) — flat, ordered, no rationale, built to be worked through top-to-bottom while actually creating fields in GHL. This section stays the reasoning; that document is what to click through.

**Scope boundary, stated explicitly because it's a safety decision, not just a sequencing one:** this phase writes data. It does not send anything. Stress-Test → Contact → Custom Fields → Attribution → Classification → Pipeline/Opportunity State — and stops there. This validates *"did the right lead land in the right stage"* before anyone tests *"did the right automation fire."*

**Explicitly NOT activated in Phase 1** (all remain fully specified in Section 3.8 and Section 5.2 for when they do activate):
- AI Follow-Up Agent conversations
- Admin/Concierge assignment workflows
- Blaise escalation alerts
- SMS/email nurture sequences
- Any Tier-specific live outbound automation

Field types below use generic GHL custom-field categories (Text, Number, Date/DateTime, Checkbox, Single Select, Multi-Select) — confirm exact type names against your GHL account's available field types before building, since naming varies by plan/version. **Exception: First Name, Last Name, Email, and Mobile Phone are native GHL Contact fields, not custom fields — see the note under Section A.**

#### A. Identity & Contact

| Field | Type | Source | Notes |
|---|---|---|---|
| First Name | Native Contact field | Screen 9 | **Required (v2.7)** |
| Last Name | Native Contact field | Screen 9 | **Required (v2.6/v2.7).** Maps directly to GHL's native Contact Last Name field — never inferred or parsed from a combined Full Name string. |
| Email | Native Contact field | Screen 9 | **Required (v2.7). Format-validated and normalized (v2.8) — see below.** The native field receives `email_normalized`. |
| `email_raw` | Text (custom field) | Screen 9 | As typed, pre-normalization — debugging only, not a prominent CRM field |
| Mobile Phone | Native Contact field | Screen 9 | **Required (v2.7). Format-validated and normalized to E.164 (v2.8) — see below.** The native field receives `mobile_normalized`. |
| `mobile_raw` | Text (custom field) | Screen 9 | As typed, pre-normalization — debugging only |
| Consent Captured | Checkbox (custom field) | Screen 9 | bool |
| Consent Timestamp | DateTime (custom field) | Screen 9 | |
| Consent Language Version | Text | Screen 9 | Already specced in Section 2 — ties a lead to the exact disclosure text shown, independent of the `COMPLIANCE REVIEW REQUIRED` build gate |
| Verification Status | Single Select (Pending/Verified/Failed) | Screen 10 | Section 3.5 |
| OTP Verified Timestamp | DateTime | Screen 10 | New — wasn't in the original Screen 10 spec; add it, since "when verified" matters for cohort attribution (Section 6.7) same as "when acquired" does |

#### B. Stress-Test Raw Answers — LOCKED schema pattern (v2.1): code / label / points, kept as separate fields

**Pattern, applied to every scored or routed answer:**
```
{field}_code    = stable internal key, e.g. "6_to_10_years"   — never edited once in use
{field}_label   = presentation copy, e.g. "6–10 years"        — freely editable, no scoring impact
{field}_points  = derived Fit Score contribution                — only for the four scored fields
```
Recalculation always keys off `_code`. `_label` can be rewritten for tone or clarity at any time without touching historical scoring, because nothing that determines a score is stored only in prose.

| Field | Code (stable, source of truth) | Label (presentation) | Points | Source |
|---|---|---|---|---|
| Retirement Horizon | `retirement_horizon_code` | `retirement_horizon_label` | `retirement_horizon_points` | Screen 2 |
| Investable Asset Range | `investable_assets_code` | `investable_assets_label` | `investable_assets_points` | Screen 3 |
| Written Plan Status | `written_plan_status_code` | `written_plan_status_label` | `written_plan_status_points` | Screen 6 |
| Intent | `stated_intent_code` | `stated_intent_label` | `stated_intent_points` | Screen 7 |
| Primary Concern | `primary_concern_code` | `primary_concern_label` | *(none — not scored, Section 3.1)* | Screen 5 |
| Account Inventory | `account_inventory_codes` (Multi-Select, codes) | `account_inventory_labels` (derived, display-only) | *(none — not scored)* | Screen 4 |

Primary Concern and Account Inventory get code + label only — no points field, because Section 3.1 deliberately excludes both from Fit Score. Adding an unused points column for them would misleadingly imply they score something they don't; the empty cell is the accurate representation, not an oversight.

**This is what the build already does internally** (`state.answers.retirement_horizon` stores the code; `HORIZON_LABELS[code]` and `FIT_POINTS.horizon[code]` derive label and points at render time) — this section formalizes that existing pattern as the GHL schema rather than introducing new logic.

#### C. Derived Classification — raw and derived, kept separate per the locked rule

| Field | Type | Derivation |
|---|---|---|
| Fit Score Total | Number | Sum of the four `_points` fields in Section B |
| Fit Tier | Single Select (A/B/C) | Section 3.1 cutoffs |
| Engagement Score | Number (0–35) | Section 3.2, corrected range — see Revision Log v2.0 |
| Engagement Level | Single Select (Low/Medium/High) | Low 0–7, Medium 8–17, High 18–35 |
| `planning_track_code` | Single Select: `build_first_plan` / `update_coordinate` / `second_opinion` / `education` | Section 3.6 — all four now reachable |
| `planning_track_label` | Text (auto-fill from code) | Build My First Written Plan / Update & Coordinate My Plan / Second Opinion / Education |

The four individual Fit component points moved to Section B (v2.1) under the `_points` naming convention, living directly beside the `_code`/`_label` they're derived from rather than separated into a different section — reduces the chance of the code and its score drifting apart in the schema even though they never should in practice. Planning Track picked up the same code/label split in v2.5, for the same reason.

**No field stores only a derived point value without its raw source sitting next to it.** This is the explicit rule for this spec: if the scoring model is ever revised, every historical lead's Fit Score must be re-derivable from what they actually answered (via the stable `_code`, not the editable `_label`), not just trusted as a number GHL happened to store at the time.

#### D. Journey

| Field | Type | Notes |
|---|---|---|
| Stress-Test Status | Single Select: `in_progress` / `abandoned` / `completed` | See state machine below — LOCKED v2.5 |
| Current Journey Stage | Single Select | Maps to Section 5.1's pipeline stages |
| Results Viewed | Checkbox | Fires at Screen 11 |
| Appointment Status | Single Select (Active/None) | Section 3.3 — outranks Engagement for routing precedence, not stored as a routing decision itself in Phase 1 |
| Recommended Next Action | Text | Human-readable, matches the logic already built and QA'd in the preview's `nextActionFor()` |

**Stress-Test Status state machine (v2.5):**

```
Started (Screen 2 reached)
    ↓
in_progress ──(24 consecutive hours with no activity)──→ abandoned
    ↑                                                          │
    └──────────────(any returning activity)───────────────────┘
    ↓
completed (Intent answered, Screen 7 done)
```

- **`in_progress`:** started, not yet complete, less than 24 consecutive hours of inactivity.
- **`abandoned`:** started, not yet complete, 24+ consecutive hours of inactivity. This is the only condition that sets it — nothing else does.
- **`completed`:** Screen 7 (Intent) answered. Terminal — doesn't revert to `in_progress` or `abandoned` afterward.
- **Returning activity moves `abandoned → in_progress`**, not directly to `completed` — completion still requires actually finishing Screen 7.
- **Recovery automation timing is independent of this field.** Section 5.2's 1-hour recovery SMS may fire well before the 24-hour mark — that's a marketing timing decision, not a redefinition of when the persistent status changes. Don't let a workflow's trigger timing quietly become the field's definition.

#### E. Ownership — LOCKED v2.2: code/label enum + native assignment, not a Detail text field

**Staffing decision (v2.1, unchanged):** at Phase 1 launch, no dedicated Admin/Concierge hire and no live AI conversational agent. GHL records the Recommended Follow-Up Owner: automated confirmations/transactional messages run; Blaise personally handles booked and high-intent qualified households; existing support helps manually where it makes sense; AI prospect conversations stay deferred until compliance/disclosure review clears (Section 4.4); dedicated Layer 2/3 staffing gets added once real volume proves the bottleneck. Resolves Open Items 5–6 (No, deferred).

**Two fields — one recommended, one real:**

| Field | Type | Notes |
|---|---|---|
| Recommended Follow-Up Owner | Single Select — see enum below | Derived, deterministic — see collapse table |
| Actual Assigned Owner | Native GHL user/owner assignment | Empty/unassigned in Phase 1 wherever the recommended role isn't staffed yet — e.g. Recommended = `admin` while no admin exists means this stays unassigned, not defaulted to someone |

**Enum — value (stable, used in logic) / label (display):**

| Value | Label |
|---|---|
| `automation` | Automation |
| `ai` | AI Agent |
| `admin` | Admin / Concierge |
| `ai_admin` | AI + Admin |
| `blaise` | Blaise |
| `blaise_support` | Blaise + Support |

`admin` and `blaise` are kept as real, intentional values even though — see the collapse table below — no current `OWNER_MATRIX` combo maps to either standalone. Both stay valid because the architecture allows them once the org chart changes (a staffed concierge role for `admin`; a fully-manual VIP escalation path for `blaise`, bypassing AI/Admin entirely), and reserving the value now means the picklist never needs editing later, only the mapping logic behind it. This is different from "Admin Recommended" in the earlier draft: "Recommended" belongs in the field name, once, not baked into every value.

**Collapse table — Fit × Engagement → enum, no Detail field needed (see reasoning above the table in this section's lead-in):**

| Fit-Engagement | `OWNER_MATRIX` string (Section 3.4, unchanged) | Enum value |
|---|---|---|
| A-High | Blaise + AI/Admin support | `blaise_support` |
| A-Medium | Admin/AI → Blaise escalation | `ai_admin` *(sequential — see flag below)* |
| A-Low | AI/Admin (high-value re-engagement, retains Tier A) | `ai_admin` |
| B-High | Admin/AI, Blaise if intent strong | `ai_admin` *(conditional — see flag below)* |
| B-Medium | AI + automation | `ai` |
| B-Low | Automation/AI | `automation` |
| C-High | Automation/AI | `automation` |
| C-Medium | Automation | `automation` |
| C-Low | Automation | `automation` |

**Resolved (v2.3), was flagged in v2.2:** A-Medium and B-High both start at `ai_admin` and move to `blaise_support` when Appointment Status becomes Active or a High-Intent Event fires — Section 3.4.1 has the full rule, including default queue priority between the two rows when neither trigger has fired. This is still a Phase 2 automation-logic question in the sense that nothing *executes* it until Section 5.2 activates, but the rule itself is no longer open — Phase 1 can store the field knowing exactly what will move it later.

Storing the recommended value without assigning a real owner is what lets you audit "is the routing logic correct" against real leads before Blaise, Admin, or AI exist as live processes for all of them.

#### F. Attribution

| Field | Type |
|---|---|
| Acquisition Cohort | Text (Section 6.7 — cohort-based, not calendar-month) |
| Source | Text |
| Medium | Text |
| Campaign | Text |
| Ad Set | Text |
| Ad | Text |
| Ad Angle | Text |
| Creative | Text |
| Landing Page | Text/URL |
| UTM Source / UTM Medium / UTM Campaign / UTM Content / UTM Term | Text, where applicable |

**Why this matters more than its length suggests:** Section 6.8's entire scenario-range methodology (and every cost-per-stage target in Section 6) depends on being able to trace a closed client back to the specific angle/creative that acquired them. If attribution is lost at the Stress-Test → GHL handoff, the testing engine Section 1.2 commits to building has nothing to measure.

#### G. Version Tracking (new in v2.0 — inexpensive now, load-bearing later)

| Field | Type | Value at time of this lock |
|---|---|---|
| Stress-Test Build Version | Text | v2.8 (last version to change Screen 9 contact/validation behavior; migration audit v2.9 did not change public copy or scoring) |
| Fit Model Version | Text | v1.6 (last version to change `FIT_POINTS` values or Fit Tier cutoffs) |
| Engagement Model Version | Text | v1.3 (the point-value rubric itself was locked in v1.3 — v1.9/v2.0 fixed implementation completeness and the range label, not the point values) |

**Deliberately not tied to the overall document revision number.** These three track the specific models a lead was scored under, not "which conversation turn produced this document." The document's version climbs on every edit, including ones with no scoring impact (this section itself, for instance); a Fit Model Version field that moved in lockstep with document version would make "this lead was scored under an old model" impossible to tell from "the document had an unrelated edit that day." Bump each field only when its own model actually changes — the next time `FIT_POINTS` changes, Fit Model Version moves to v2.0 or whatever the document version is at that moment; until then, it stays at the version where the formula was last actually different.

#### H. Pipeline (state-writing only in Phase 1 — no automation triggers from any transition below)

```
Stress-Test Started
        ↓
Stress-Test Completed — Verification Pending
        ↓
   ┌────────────┼────────────┐
   ↓            ↓            ↓
Verified —   Verified —   Tier C
Tier A       Tier B       Education
   └────────────┴────────────┘
        ↓ (manually advanced in Phase 1 — no auto-booking flow yet)
   Review Booked
```

This mirrors Section 5.1's fuller pipeline (which includes Attended, No-Show, Plan Delivered, and the Implementation chain from Section 6.7) — Phase 1 stops at Review Booked because everything past that point currently depends on Layer 2/3 (Section 3.8) actually existing, which per the Open Items list is still undecided.

---

## 6. Dashboard / KPI Structure

**⚠️ Targets below are now real modeling assumptions (Section 6.4), not blind placeholders — but still provisional until LLFG-specific cohort data replaces the working assumptions in 6.5.**

| Metric | Formula | Target | Warning Ceiling |
|---|---|---|---|
| Raw CPL | Ad spend ÷ stress-test completions | ≤$20 | ~$25 |
| Cost per verified lead | Ad spend ÷ OTP-verified leads | ≤$28 | ~$36 |
| Cost per qualified household (Tier A+B) | Ad spend ÷ (Tier A + Tier B leads) | ≤$80 | ~$103 |
| Cost per booked review | Ad spend ÷ bookings | ≤$160 | ~$206 |
| **Cost per attended review** | Ad spend ÷ shows | **≤$213 — this is the metric to watch most closely (see 6.4)** | ~$275 |
| Show rate | Attended ÷ Booked | >70% (75% modeled) | — |
| Marketing CAC | Ad spend ÷ closed clients | ≤$850 | ~$1,100 |
| Fully Loaded CAC | (Ad spend + actual fixed admin/AI cost) ÷ closed clients | ≤$1,250 | ~$1,500 |
| Revenue per attended review | Avg. client value × review-to-client close rate | ~$1,250 (at $5,000 value, 25% close) | — |
| Client Value ÷ CAC | Avg. client value ÷ Fully Loaded CAC | ≥4.0x target | ≥3.3x provisional floor |
| Assets/premium opportunity generated | Sum of disclosed assets × pipeline stage weighting | Track, no fixed target yet | — |
| Angle-level cost per qualified household | Segmented by Ad Angle Attribution field | Used to decide which angle to scale first | — |

**Build this as a weekly-reviewed dashboard, not daily.** At $50/day, weekly volume won't be statistically meaningful day-to-day — daily monitoring on small numbers will make you chase noise.

### 6.4 Acquisition Economics v1.0 — LOCKED, provisional pending real data

**Starting economics (working assumptions, not confirmed LLFG figures):**

| Input | Value |
|---|---|
| Average client value | $5,000 (revenue basis — submitted/placed/received — unconfirmed, see 6.5) |
| Starting Meta spend | $50/day ≈ $1,500/month |
| Scale level | $100/day ≈ $3,000/month |
| Target Marketing CAC | ≤$850 |
| Target Fully Loaded CAC | ≤$1,250 (25% of client value) |
| Maximum Fully Loaded CAC | $1,500 (30% of client value) |

**Working funnel conversion assumptions (provisional, not LLFG data yet):**

| Stage | Rate |
|---|---|
| Raw lead → OTP verified | 70% |
| Verified → Tier A/B qualified | 35% |
| Qualified → Review booked | 50% |
| Booked → Attended | 75% |
| Attended → Client | 25% |

Under these assumptions, roughly 44 raw leads produce 1 client, which is what generates the per-stage targets in the table above.

**Don't scale from CPL — scale from downstream proof.** The progression is: cheap leads arriving → verifying → qualifying → booking → showing → converting to clients → Fully Loaded CAC in range → *then* increase spend. If any link breaks, fix that link before adding budget.

| Fully Loaded CAC | Action |
|---|---|
| <$1,000 with adequate sample | Strong scale candidate |
| $1,000–$1,250 | Healthy — scale cautiously |
| $1,250–$1,500 | Hold spend, optimize |
| >$1,500 | Diagnose before increasing spend |

Diagnostic table for *where* to look when CAC is out of range: cheap CPL but poor qualification → fix targeting/message; good qualification but poor booking → fix trust/offer/calendar; good booking but poor show rate → fix confirmation/pre-frame; good shows but poor client conversion → fix the Review/planning process itself.

**Don't react to 1–2 leads.** At $50/day the sample is small — look for patterns across weeks and cohorts, not daily fluctuation.

### 6.5 Marketing CAC vs. Fully Loaded CAC — corrected structure (v1.4)

**[Certain] The source model for this section treated the ~$400/client operations allocation as a variable cost. It isn't one.** Layer 3 (Section 3.8) is a payroll or contractor hire — a fixed monthly cost, not something that scales down to near-zero in a slow month and up in a strong one. Applying `$400 × clients` produces Fully Loaded CAC figures that look fine in low-volume months precisely because the fixed cost is being understated in exactly those months.

**Correct structure — two separate, honestly-different metrics:**

- **Marketing CAC = Ad spend ÷ closed clients.** This is real from Day 1 and is what governs Phase 1, because it's the only cost that exists before anyone is hired. Target ≤$850, ceiling ~$1,100.
- **Fully Loaded CAC = (Ad spend + actual fixed admin cost + actual AI platform/usage cost) ÷ closed clients**, calculated only once Layer 2/3 costs are real numbers, not estimates. When Layer 3 is staffed, use the fixed monthly cost as-is (don't divide it by clients before adding it in) — the formula divides the total once, at the end.

**Recommendation, unchanged from last turn:** track Marketing CAC alone through Phase 1. The week either Layer 2 or 3 actually goes live, add its real fixed/usage cost into Fully Loaded CAC — that will very likely be a step change (e.g., a $1,200/month admin hire lands as $1,200 the month it starts, not $400 scaled by however many clients happened to close), and the dashboard should show that as the step it is, not smooth it into a per-client average that hides it.

| Cost line | Status |
|---|---|
| Meta ad spend | Tracked from Day 1, variable, real |
| Admin/Concierge (payroll or contractor) | **Not yet quantified** — will be fixed monthly once Layer 3 is staffed |
| AI Agent platform/usage cost | **Not yet quantified** — likely partly fixed (subscription) + partly variable (usage), confirm structure once selected |
| GHL/tooling cost already in place | Existing overhead, not new to this framework |

### 6.6 Scale Targets by Spend Level (provisional, corrected for fixed-cost timing)

At $50/day (~$1,500/month), Marketing CAC alone: 2 clients/month lands inside target ($750), 3 is strong ($500), 1 is not a failed experiment but isn't yet in-range economics ($1,500) — especially accounting for attribution lag in an early month. At $100/day (~$3,000/month), aim for at least 3–4 clients/month on Marketing CAC alone (3 = acceptable at $1,000, 4 = solid at $750, 5 = very strong at $600). **Do not layer a fully-loaded figure onto these until Section 6.5's real cost lines exist** — the source model's fully-loaded column for this table is removed here for that reason; add it back once Layer 2/3 costs are confirmed.

### 6.7 Measurement Definitions — LOCKED v1.5 (closes two gaps the v1.4 economics lock left open)

**Attribution: cohort-based, not calendar-month.** Marketing CAC must be tracked by acquisition cohort (leads generated in a given week/month, followed through to their eventual close whenever it happens), not `this month's ad spend ÷ this month's new clients`. The funnel has real lag built in — booked → attended → plan delivered → implementation — so a client closing in month 2 may have been acquired by month 1's spend. Calendar-month CAC will misstate reality in exactly the early months where the scale/hold/diagnose decision in Section 6.4 matters most. **Build the Ad Angle Attribution field (Section 5.3) to carry a cohort/acquisition-date tag through to the closed-client stage**, so CAC can always be recomputed cohort-first even if a monthly view is also shown for convenience.

**What counts as "Client" / "Review → Client" — LOCKED v1.6, sharpened from a single event to a tracked status chain:** the close-rate scenarios below (and every dashboard metric built on them) need one specific, non-negotiable trigger event, but the path to it has real intermediate stages worth tracking separately rather than collapsing into one binary flag:

```
Plan Delivered → Implementation Started → Implementation Placed/Activated → Revenue Received
```

**"Client" for CAC and close-rate purposes = Implementation Placed/Activated** — a placed product/service, not merely a written plan delivered. A prospect who receives a written plan but doesn't implement is a valuable relationship, not a closed client, for the purposes of every CAC and close-rate number in this document. **Revenue Received is a separate, later, lagging metric** — track it, but don't wait for it to count someone as a client, since placed business and actually-received first-year revenue can differ and arrive on different timelines. This also resolves the earlier open item on whether the $5,000 average client value is submitted, placed, or received revenue: **it tracks the same event as the Client trigger — Implementation Placed/Activated** — for internal consistency; add a separate Revenue Received line to the dashboard once real data exists rather than conflating it with CAC.

### 6.8 Close-Rate Scenarios (Review → Client is now a range, not a single assumed number)

25% was a single assumed number holding up the entire per-stage cost table. It's now a base-case scenario, bracketed by a conservative and strong case, so a target cost range replaces a single number until real cohort data narrows it:

| Metric | 20% Close (Conservative) | 25% Close (Base Case) | 33% Close (Strong) |
|---|---|---|---|
| Raw CPL | ~$16 | ~$20 | ~$26 |
| Verified lead | ~$22 | ~$28 | ~$37 |
| Qualified household | ~$64 | ~$80 | ~$105 |
| Booked Review | ~$128 | ~$160 | ~$210 |
| Attended Review | ~$170 | ~$213 | ~$281 |
| Marketing CAC | $850 (held constant — this is the input, not the output) | $850 | $850 |

**Use this range, not a single number, when evaluating early cost-per-stage data** — a $24 raw CPL isn't automatically a problem; it depends on where your actual close rate lands once you have enough cohort data to know it.

**Sample-size discipline:** treat the first 10 attended, qualified Reviews as directional only — do not update the close-rate assumption off them. Treat 20+ as the start of an actual LLFG-specific benchmark. 2 closes out of the first 5 attended (40%) proves nothing; 0 out of the first 4 proves nothing. Once you have enough data to have a real number, replace every placeholder in this document that depends on it — not before.

### 6.9 Executive View (target shape, once real costs exist)

```
META SPEND                  $[actual]
AI / ADMIN / TECH           $[actual fixed, not back-calculated]
TOTAL ACQUISITION COST      $[sum]

QUALIFIED HOUSEHOLDS         [count]
RETIREMENT REVIEWS BOOKED    [count]
REVIEWS ATTENDED             [count]
CLIENTS ACQUIRED             [count]

MARKETING CAC                $[ad spend ÷ clients]
FULLY LOADED CAC             $[total cost ÷ clients]

CLIENT VALUE GENERATED       $[clients × avg value]
ACQUISITION CONTRIBUTION     $[client value − total acquisition cost]
                              (before service/overhead/chargebacks/taxes)
```

### 6.10 Fit × Engagement Cross-Tab (per ad angle / per creative)

The reason to keep Fit and Engagement separate only pays off if the reporting reflects it. A creative producing 24 Tier A leads at 4 High / 8 Medium / 12 Low engagement is not the same creative as one producing 18 Tier A leads at 11 High / 5 Medium / 2 Low — the second will likely book and close at a materially higher rate even with fewer raw Tier A leads. Track this per campaign/angle, not just aggregate Tier counts:

| Campaign / Angle | Tier A (High/Med/Low) | Tier B (High/Med/Low) | Tier C (High/Med/Low) |
|---|---|---|---|
| [angle name] | _ / _ / _ | _ / _ / _ | _ / _ / _ |

Watch for creatives that generate high engagement concentrated in Tier C — interesting content, wrong audience for client acquisition spend.

---

## 7. 90-Day Rollout Plan

### Days 1–14: Build
- Finalize Stress-Test landing page (Section 2) — build on existing GHL/custom-front-end infrastructure
- Set up OTP gate post-results (not pre-results)
- Configure GHL pipeline stages, custom fields, automations (Section 5)
- Build single-angle creative set (Section 4.1)
- Compliance check: TCPA consent language, ad-review readiness
- Confirm real economics (CAC ceiling, avg case value, budget) — **replace every placeholder in this document before spending a dollar**

### Days 15–35: Launch — Single Angle
- Launch Phase 1 Meta campaign, one angle, $100–150/day placeholder
- Daily creative/copy monitoring for approval issues only (not performance chasing yet)
- Weekly dashboard review starting Week 3 once volume exists
- Goal: hit the "proven" bar from Section 1.3 by Day 35

### Days 36–55: Prove or Fix
- If proven: add angle #2 (Section 4.2), begin retargeting warm audiences
- If not proven: diagnose which stage is leaking (use the dashboard's stage-by-stage CPL, not gut feel) before adding spend or angles
- First client-outcome story collected (if a client has closed) → feed into creative refresh

### Days 56–90: Scale Within Meta
- Full angle rotation if Phase 2 metrics hold (Section 4.3)
- Begin lookalike audience only if 50+ conversions exist
- Evaluate second channel (Google Search likely first candidate given high-intent "written retirement plan" search terms) — but only plan it, don't launch it, until Meta economics are proven across a full 90-day window
- Full 90-day retro: angle-level, tier-level, and stage-level performance review; decide what gets cut before anything gets added

---

## Open Items — Needed From You Before This Is Truly "Locked"

**Locked as Phase 1 operating assumptions (v2.0) — not yet verified as your actual financial data, but no longer relitigated each revision:** Marketing CAC ≤$850 target/$1,100 ceiling, $5,000 avg. client value, $1,500→$3,000/month ($50→$100/day) ad budget (Section 6.4).

**Still genuinely unresolved:**

1. Does $5,000 avg. client value mean submitted, placed, or actually received first-year revenue? (Section 6.5) — the target CAC numbers mean something different depending on which.
2. Confirm: does your current GHL setup have CAPI/pixel integration mature enough for Meta Conversions objective, or should Phase 1 run on Leads objective?
3. State(s) you're licensed/advertising in, for the compliance check in Section 4.4
4. Compliance/E&O confirmation on AI-agent disclosure and message-review requirements — still needed before Layer 2 activates, whenever that turns out to be (Section 4.4, Section 3.8)
5. ~~Whether the AI Follow-Up Agent (Layer 2) is enabled at Phase 1 launch~~ — **Resolved (v2.1): No, deferred until compliance clears and volume justifies it** (Section 5.4E)
6. ~~Whether an Admin/Concierge (Layer 3) is staffed at launch~~ — **Resolved (v2.1): No, deferred until volume proves the bottleneck; Blaise + existing support cover Phase 1 manually** (Section 5.4E)
7. Actual Admin/Concierge staffing cost and actual AI platform/usage cost — no longer gating launch (per items 5–6), but still needed before Fully Loaded CAC (Section 6.5) is real once either layer eventually activates.
8. A numbered trigger for adding admin capacity (e.g., "hire a second concierge at X sustained leads/week for Y weeks") — now the actual activation trigger for items 5–6, not just a future nice-to-have. Still not defined.
9. Real Review-to-client close rate — currently a 25% provisional assumption driving the entire per-stage cost table in Section 6. Every target in that table moves if this is wrong; it's the single highest-leverage unknown left in the model.
10. ~~Confirm the Ownership enum's fifth value ("Admin Recommended") against a real combo, or drop it~~ — **Resolved (v2.2): kept `admin` and `blaise` as real reserved values (architecture allows both eventually), dropped "Recommended" from every value since it belongs in the field name once, not per-value** (Section 5.4E).
11. ~~What actually moves a lead's Recommended Owner from `ai_admin` to `blaise_support`, or triggers B-High's "if intent strong" condition~~ — **Resolved (v2.3): Appointment Status → Active, or a High-Intent Event, for either row; A-Medium outranks B-High by default, but either override applies regardless of tier** (Section 3.4.1).
12. ~~Planning Track's fourth conceptual value, "Education," is never actually produced~~ — **Resolved (v2.5): `education` fires when `stated_intent == mainly_researching`, overriding the plan-status default (except `has_current_plan`, which stays unconditionally `second_opinion`)** (Section 3.6).
13. ~~"Stress-Test Status: Abandoned" has no defined trigger~~ — **Resolved (v2.5): `abandoned` = started, incomplete, 24+ consecutive hours of inactivity; recovery automation may fire earlier without changing this field** (Section 5.4D).
