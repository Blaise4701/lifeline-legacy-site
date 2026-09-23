# LLFG Retirement Acquisition Engine — Phase 1 GHL Build Checklist
### Data Foundation Only — built from the locked framework, v2.8

**Companion to:** LLFG Retirement Acquisition Engine (main framework doc), Section 5.4. This document is the flat, ready-to-execute version — no rationale, no revision history, just what to build and in what order. If anything here looks wrong, the main doc is the source of truth; this checklist should be regenerated from it, not hand-edited to disagree with it.

---

## ⛔ Before you start: what NOT to build yet

Phase 1 writes data. It does not send anything. Do not activate, connect, or configure any of the following — all remain fully specified for later, none are in scope now:

- [ ] AI Follow-Up Agent conversations
- [ ] Admin/Concierge assignment workflows
- [ ] Blaise escalation alerts
- [ ] SMS/email nurture sequences
- [ ] Any Tier-specific live outbound automation (calls, texts, emails triggered by a field value)

If you find yourself building a workflow that *sends* something based on one of the fields below, stop — that's Phase 2 (Section 5.2 of the main doc), not this checklist.

**No open decisions remain from the prior version of this checklist.** Last Name, Planning Track's "Education," and Stress-Test Status's "Abandoned" are all resolved — see Sections 1, 3, and 4 below.

---

## Build Order

### 1. Contact Fields — Identity (native GHL Contact fields, not custom fields)

| # | Field Name | Type | Notes |
|---|---|---|---|
| 1.1 | First Name | Native Contact field | **Required.** Trimmed; non-empty is the only bar. |
| 1.2 | Last Name | Native Contact field | **Required.** Maps directly to GHL's native Last Name field — do not build this as a custom field, and do not populate it by parsing a combined Full Name input. Trimmed, non-empty. |
| 1.3 | Email | Native Contact field | **Required.** Receives `email_normalized` (lowercase, trimmed, syntax-validated) — see 1.3a. |
| 1.3a | `email_raw` | Text (custom field) | As typed, pre-normalization — debugging only |
| 1.4 | Mobile Phone | Native Contact field | **Required.** Receives `mobile_normalized` (E.164, e.g. `+12149075087`) — see 1.4a. |
| 1.4a | `mobile_raw` | Text (custom field) | As typed, pre-normalization — debugging only |
| 1.5 | Consent Captured | Checkbox (custom field) | |
| 1.6 | Consent Timestamp | Date/Time (custom field) | |
| 1.7 | Consent Language Version | Text (custom field) | Ties the lead to the exact disclosure text shown — independent of whether that text has cleared compliance review |
| 1.8 | Verification Status | Single Select (custom field) | Options: `Pending` / `Verified` / `Failed` |
| 1.9 | OTP Verified Timestamp | Date/Time | |

---

### 2. Custom Fields — Stress-Test Raw Answers (code + label + points, per field)

Build all three sub-fields for each row before moving to the next field — don't build every `_code` field first and circle back for labels, since it's easy to lose track of which pair goes together.

**2A. Retirement Horizon**

| Sub-field | Type |
|---|---|
| `retirement_horizon_code` | Single Select (see options) |
| `retirement_horizon_label` | Text (auto-fill from code, human-editable) |
| `retirement_horizon_points` | Number (auto-fill from code) |

| Code | Label | Points |
|---|---|---|
| `already_retired` | Already Retired | 30 |
| `0_to_2_years` | Within 0–2 Years | 30 |
| `3_to_5_years` | Within 3–5 Years | 25 |
| `6_to_10_years` | Within 6–10 Years | 20 |
| `gt_10_years` | 10+ Years Out | 5 |
| `unsure_horizon` | Timing Not Yet Set | 10 |

**2B. Investable Asset Range**

| Sub-field | Type |
|---|---|
| `investable_assets_code` | Single Select |
| `investable_assets_label` | Text |
| `investable_assets_points` | Number |

| Code | Label | Points |
|---|---|---|
| `under_100k` | Under $100K | 0 |
| `100k_250k` | $100K–$250K | 10 |
| `250k_500k` | $250K–$500K | 20 |
| `500k_1m` | $500K–$1M | 30 |
| `1m_plus` | $1M+ | 30 |
| `undisclosed` | Not Disclosed | 15 |

**2C. Written Plan Status**

| Sub-field | Type |
|---|---|
| `written_plan_status_code` | Single Select |
| `written_plan_status_label` | Text |
| `written_plan_status_points` | Number |

| Code | Label | Points |
|---|---|---|
| `no_plan` | No plan | 20 |
| `accounts_no_plan` | Accounts, but no coordinated plan | 18 |
| `projections_only` | Projections, but not a real income plan | 15 |
| `outdated_plan` | My plan is outdated or I don't fully trust it | 15 |
| `has_current_plan` | I have a current, trusted plan | 5 |

**2D. Intent**

| Sub-field | Type |
|---|---|
| `stated_intent_code` | Single Select |
| `stated_intent_label` | Text |
| `stated_intent_points` | Number |

| Code | Label | Points |
|---|---|---|
| `build_plan` | Build a written plan | 15 |
| `verify_income` | Verify my income is on track | 15 |
| `second_opinion` | Get a second opinion | 15 |
| `near_term_decision` | Make a near-term decision | 20 |
| `understand_options` | Understand my options | 10 |
| `mainly_researching` | Mainly researching | 0 |

**2E. Primary Concern** *(code + label only — not scored, no points field)*

| Sub-field | Type |
|---|---|
| `primary_concern_code` | Single Select |
| `primary_concern_label` | Text |

| Code | Label |
|---|---|
| `income` | Creating Dependable Retirement Income |
| `taxes` | Retirement Taxes |
| `market_decline` | A Market Decline Near Retirement |
| `longevity` | Outliving My Savings |
| `survivor_income` | Survivor Income for My Spouse |
| `healthcare_ltc` | Healthcare / Long-Term Care Costs |
| `timing` | Timing My Retirement Decisions |
| `coordination` | Coordinating Everything I Have |
| `legacy` | Legacy for My Family |

**2F. Account Inventory** *(multi-select, code + label only — not scored)*

| Sub-field | Type |
|---|---|
| `account_inventory_codes` | Multi-Select |
| `account_inventory_labels` | Text (derived, display-only) |

| Code | Label |
|---|---|
| `401k_403b` | 401(k) / 403(b) |
| `tsp` | TSP |
| `ira_traditional` | Traditional IRA |
| `ira_roth` | Roth IRA |
| `pension` | Pension |
| `brokerage` | Brokerage / Investment Account |
| `annuity` | Annuity |
| `social_security` | Social Security |
| `business_ownership` | Business Ownership |
| `real_estate` | Real Estate |
| `none_yet` | None Yet |

---

### 3. Custom Fields — Derived Classification

| # | Field Name | Type | Notes |
|---|---|---|---|
| 3.1 | Fit Score Total | Number | Sum of the four `_points` fields in Section 2 (2A–2D) |
| 3.2 | Fit Tier | Single Select | Options: `A` / `B` / `C` — A ≥70, B 40–69, C <40 |
| 3.3 | Engagement Score | Number | Range 0–35, not 0–30 |
| 3.4 | Engagement Level | Single Select | Options: `Low` / `Medium` / `High` — Low 0–7, Medium 8–17, High 18–35 |
| 3.5 | `planning_track_code` | Single Select | Options: `build_first_plan` / `update_coordinate` / `second_opinion` / `education` — all four reachable, see assignment rule below |
| 3.6 | `planning_track_label` | Text | Build My First Written Plan / Update & Coordinate My Plan / Second Opinion / Education |

**Planning Track assignment rule:** (1) `stated_intent = mainly_researching` → `education`, including when `written_plan_status = has_current_plan`. (2) Else, `written_plan_status = has_current_plan` AND `stated_intent = second_opinion` → `second_opinion`. (3) Else, `written_plan_status = has_current_plan` → `education`. (4) Else, plan-status default: `no_plan`/`accounts_no_plan` → `build_first_plan`; `projections_only`/`outdated_plan` → `update_coordinate`. Fit Tier does not determine Planning Track; Tier/High-Intent routing can still offer a Review without relabeling the Planning Track.

---

### 4. Custom Fields — Journey

| # | Field Name | Type | Notes |
|---|---|---|---|
| 4.1 | Stress-Test Status | Single Select | Options: `in_progress` / `abandoned` / `completed` — see state machine below |
| 4.2 | Current Journey Stage | Single Select | See Section 6 pipeline stages below — Phase 1 subset only |
| 4.3 | Results Viewed | Checkbox | Fires when Screen 11 loads |
| 4.4 | Appointment Status | Single Select | Options: `Active` / `None` |
| 4.5 | Recommended Next Action | Text | Auto-filled, human-readable (e.g. "Tier A — Not Booked: strong Review CTA") |

**Stress-Test Status state machine:** `in_progress` = started, incomplete, <24 consecutive hours of inactivity. `abandoned` = started, incomplete, 24+ consecutive hours of inactivity — the only thing that sets it. `completed` = Intent (Screen 7) answered; terminal. Returning activity moves `abandoned → in_progress`, not straight to `completed`. **Recovery automation (Section 5.2's 1-hour "you're 2 questions away" SMS) fires independently of this field — do not build a workflow that reads or writes Stress-Test Status based on that 1-hour timer; it's a separate, earlier trigger.**

---

### 5. Custom Fields — Ownership

| # | Field Name | Type | Notes |
|---|---|---|---|
| 5.1 | Recommended Follow-Up Owner | Single Select | See options below |
| 5.2 | Actual Assigned Owner | Native GHL user/owner field | Leave unassigned in Phase 1 wherever the recommended role isn't staffed — do not default to a person |

**Recommended Follow-Up Owner options:**

| Value | Label |
|---|---|
| `automation` | Automation |
| `ai` | AI Agent |
| `admin` | Admin / Concierge |
| `ai_admin` | AI + Admin |
| `blaise` | Blaise |
| `blaise_support` | Blaise + Support |

**Assignment logic (Fit Tier × Engagement Level → value):**

| Fit | Engagement | Value |
|---|---|---|
| A | High | `blaise_support` |
| A | Medium | `ai_admin` → `blaise_support` if Appointment Active or a High-Intent Event fires |
| A | Low | `ai_admin` |
| B | High | `ai_admin` → `blaise_support` if Appointment Active or a High-Intent Event fires |
| B | Medium | `ai` |
| B | Low | `automation` |
| C | High | `automation` |
| C | Medium | `automation` |
| C | Low | `automation` |

`admin` and `blaise` are valid picklist values but no current combo assigns either automatically — reserved for future states (a staffed concierge role; a fully-manual VIP path). Don't remove them; don't expect to see them yet.

---

### 6. Custom Fields — Attribution

| # | Field Name | Type |
|---|---|---|
| 6.1 | Acquisition Cohort | Text |
| 6.2 | Source | Text |
| 6.3 | Medium | Text |
| 6.4 | Campaign | Text |
| 6.5 | Ad Set | Text |
| 6.6 | Ad | Text |
| 6.7 | Ad Angle | Text |
| 6.8 | Creative | Text |
| 6.9 | Landing Page | Text/URL |
| 6.10 | UTM Source | Text |
| 6.11 | UTM Medium | Text |
| 6.12 | UTM Campaign | Text |
| 6.13 | UTM Content | Text |
| 6.14 | UTM Term | Text |

---

### 7. Custom Fields — Version Tracking

| # | Field Name | Type | Value to hard-code for every contact created under this lock |
|---|---|---|---|
| 7.1 | Stress-Test Build Version | Text | `v2.11` |
| 7.2 | Fit Model Version | Text | `v1.6` |
| 7.3 | Engagement Model Version | Text | `v1.3` |

These do not change per-contact — every lead scored under the current spec gets the same three values. They only change when the corresponding model itself changes (see main doc's Revision Log), not on every document edit.

---

### 8. Pipeline / Opportunity Stages (Phase 1 subset)

State-writing only — no automation fires on any transition below.

- [ ] Stress-Test Started
- [ ] Stress-Test Completed — Verification Pending
- [ ] Verified — Tier A
- [ ] Verified — Tier B
- [ ] Tier C Education
- [ ] Review Booked *(manually advanced in Phase 1 — no auto-booking flow yet)*

**Do not build these yet** (they exist in the main doc's Section 5.1 for later phases, once Layer 2/3 exist): Attended, No-Show, Plan Delivered, Implementation Started, Client — Implementation Placed/Activated, Revenue Received, Second-Opinion Track as a pipeline branch.

---

## Post-Build Verification

Before calling Phase 1 done, confirm:

- [ ] A test contact run through all 11 Stress-Test screens lands with every field in Sections 1–7 populated correctly (cross-check against the working preview's Reviewer Mode drawer for the same inputs)
- [ ] Fit Score Total matches the sum of the four points fields, every time — spot-check at least one A, one B, one C persona
- [ ] No workflow, automation, or trigger fires a message, call, or task as a side effect of any field above being set
- [ ] All four Screen 9 fields (First Name, Last Name, Mobile, Email) are required and confirmed writing to their native Contact fields (none parsed from a combined input)
- [ ] Email and Mobile pass format validation (not just presence) before Screen 10, and the native fields receive the normalized value, not the raw typed value
