# Family Continuity Map: GHL setup and launch runbook

This repository implements the Map pages and the `/api/lead` opt-in. The current private integration only manages contacts and their tags. The GHL assets below are configured separately in the Lifeline Legacy Insurance Group sub-account; this repository does not create them.

**Keep `GHL_CMAP_DELIVERY_READY=false` until every launch check at the end passes.** The form stays unavailable and the endpoint returns HTTP 503 while this is false. Do not place the blank PDF under `public/`, in a website page, or in an API response. An unlisted PDF URL can still be opened by anyone who receives the link; it is not access control. Completed worksheets stay with the household.

## 1. Prepare the sub-account

1. In LLFG's GHL sub-account, upload the supplied **six-page blank** `Family_Continuity_Map.pdf` to Media Library. Attach that file directly to A1, or insert its Media Library link only inside delivery emails in place of `[MAP LINK]`. If using a link, open it in a signed-out browser to confirm what recipients can access, and check whether it is indexed. Do not add the URL to Vercel environment variables or this repository. Confirm page 2 includes Decision-makers and page 6 includes the full score. If a later email offers the Map again, attach the same file or insert the verified link there as well.
2. Verify SPF, DKIM, and DMARC for `lifelinelegacyfinancial.com` in the sending setup and DNS. Verify sender `Blaise Dzudie Tamo <blaise.tamo@lifelinelegacyfinancial.com>`, the unsubscribe link, and postal footer. Send a real test to an external mailbox. Record results before enabling the form.
3. Confirm GHL phone/A2P registration is active before enabling any SMS actions. Every Map SMS branch must check both the Map-specific consent tag and a mobile number, plus channel DND. The email workflow must respect email unsubscribe and DND, and notify an operator if it cannot deliver. Never clear DND automatically from this opt-in.
4. Give the website private integration token `contacts.read` **and** `contacts.write` access. The endpoint upserts a contact, reads it back to confirm email DND is not active, and only then applies the delivery trigger tag. If that check fails or permission is unknown, the visitor gets an error instead of a thank-you page. Confirm the GHL account's duplicate-contact matching prioritizes email for this form, including when another contact has the optional phone number.

HighLevel references: [contact upsert](https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact/), [get contact](https://marketplace.gohighlevel.com/docs/ghl/contacts/get-contact/), [tag trigger](https://help.gohighlevel.com/support/solutions/articles/155000002482-workflow-trigger-contact-tag), [trigger link click](https://help.gohighlevel.com/support/solutions/articles/155000003263), and [appointment status trigger](https://help.gohighlevel.com/support/solutions/articles/155000002619).

## 2. Create contact data

Under Settings → Custom Fields, create these **contact** fields before enabling the form. Use these exact API keys. GHL already supplies standard first name, email, phone, and source. If an existing field has the same purpose and exact key, reuse it rather than duplicating it.

| Key | Type | Meaning |
| --- | --- | --- |
| `cmap_download_date` | Date | Date of the Map request, **not** proof of download or receipt. |
| `cmap_source` | Single-line text | Attribution source. |
| `cmap_utm_campaign` | Single-line text | Campaign on the request. |
| `cmap_utm_medium` | Single-line text | Medium on the request. |
| `cmap_landing_path` | Single-line text | Form page path. |
| `cmap_referrer` | Single-line text or text area | First-touch referrer, if present. |
| `cmap_email_consent_at` | Text/date-time | Server timestamp, ISO 8601 UTC. |
| `cmap_email_consent_version` | Single-line text | Consent text version. |
| `cmap_email_consent_text` | Text area | Exact consent sentence shown. |
| `cmap_sms_consent_at` | Text/date-time | Written only when this form's SMS box was checked. |
| `cmap_sms_consent_version` | Single-line text | Written only with SMS consent. |
| `cmap_sms_consent_text` | Text area | Exact optional SMS consent sentence shown. |
| `cmap_gap_band` | Dropdown | Fixed values **`0–3`**, **`4–10`**, **`11+`**. Leave empty if unknown. These are the stable stored values; website route slugs are `0-3`, `4-10`, `11-plus`. |

Version currently sent: `family-continuity-map-2026-09-28`. Email consent text: “Email me the Family Continuity Map and related follow-up about using it. I can unsubscribe at any time.” SMS text: “If I provide my mobile number, I agree to receive texts about the Map or a Continuity Review. Texts are optional; I can reply STOP to opt out.” If either text changes, change the shared constant and version in `src/lib/family-continuity-map.ts`, then redeploy. This Map permission is scoped to delivery and related follow-up; it is not a general newsletter subscription.

Create the tags below under Settings → Tags, or confirm GHL auto-creates them when added. The endpoint adds `lead-magnet:continuity-map`, `cmap:downloaded`, and `cmap:delivery-requested` after a successful upsert and email permission check. Here `downloaded` is the campaign's legacy tag name; it records a request, **not** a confirmed file open. The endpoint adds `cmap:sms-consent` only if the visitor supplied a phone and checked the optional SMS box; it removes that Map tag when a repeat opt-in leaves it unchecked.

| Tag | Purpose |
| --- | --- |
| `lead-magnet:continuity-map` | Contact attribution. |
| `cmap:downloaded` | Map requested. |
| `cmap:delivery-requested` | Added by the website to start delivery; the website removes it before repeat requests. |
| `cmap:sms-consent` | Consent for this Map's SMS branch only. |
| `cmap:score-0-3`, `cmap:score-4-10`, `cmap:score-11plus` | Exactly one current score band. |
| `cmap:no-score` | Day 10 handoff; remove on a late score. |
| `cmap:booked`, `cmap:review-held`, `cmap:client` | Review and client progress. |

Create pipeline **Continuity Map Leads**, in this order: **Downloaded → Score Reported → Invited → Booked → Review Held → Client**. Configure workflow actions to find/update the existing opportunity for this contact in this pipeline instead of creating another on a repeated opt-in or score click. Use only one current opportunity per contact in this campaign.

## 3. Trigger link setup

1. Under Marketing → Trigger Links, create three links whose destinations are the corresponding website pages. Name them `CMap 0-3`, `CMap 4-10`, `CMap 11-plus`. Destinations: `https://www.lifelinelegacyfinancial.com/family-continuity-map/score/0-3`, `/score/4-10`, and `/score/11-plus` respectively, using the full domain for each. Use the **GHL trigger link object** in the email buttons, not a plain page URL. The link click associates the action with the email recipient; the score result page itself records nothing. A forwarded email can attribute a click to the original recipient, so never infer another person's score from a forwarded link.
2. Build one `Trigger Link Clicked` workflow per band, filtered to the matching link. At the top, exit if `cmap:booked` exists. If the same band is already stored and its workflow is active or finished, avoid restarting the sequence. Otherwise remove the other two score tags and `cmap:no-score`, set `cmap_gap_band` to its exact stored value, update the opportunity to Score Reported, remove the contact from A/E and any old B/C/D score workflow, add the matching score tag, then enroll it in the matching B/C/D workflow once. The score workflow may then move the opportunity to Invited where specified. A later different click replaces the prior band and stops the prior sequence.
3. Test all three links from an actual contact email, including a second click, changed band, late click after Day 10, booked contact, and a forwarded email. Directly opening a result-page URL must leave GHL unchanged. Do not put contact IDs, addresses, scores, or tokens in the destination URL.

## 4. Workflow A: delivery and score capture

1. Under Automation → Workflows, create **CMap A: Delivery + Score**. Trigger: Contact Tag Added = `cmap:delivery-requested`. Configure re-entry for a later request, but do not let a contact have two simultaneous active runs. Verify this behavior with two rapid requests and a later repeat request. The endpoint removes/re-adds the trigger tag; GHL must actually observe the re-add as a new event.
2. First check email DND/unsubscribe and the contact email. If suppressed, do not send; alert the operator and exit. Add the two campaign attribution tags if absent. Set/request date and source from the existing website fields. Find/update one pipeline opportunity at Downloaded only if no later stage exists.
3. For a previously scored or booked contact asking again, send **only A1** with the fresh PDF link; do not reopen nurture, lower the opportunity stage, or erase score/booking data. Otherwise send A1 immediately, A2 two days after original opt-in, A3 on Day 5, and A4 on Day 9. Before *each* send, if any score tag or `cmap:booked` is present, exit A. Check email DND again. Use the exact templates in the appendix.
4. Day 10 is measured from the **original request**, not nine days after A4. If still unscored and unbooked, add `cmap:no-score`, remove from A, and enter E. E1 is sent on Day 30 after the original request. If a score arrives later, remove `cmap:no-score` and stop E.

## 5. Workflows B, C, D, E, and booking

- **B (11+):** Trigger on `cmap:score-11plus`, stop A/E/old band, move to Invited, notify Blaise once, then B1 immediately, B2 Day 3 and B3 Day 7 if not booked. Optional B-SMS within 24 hours only with `cmap:sms-consent`, phone, and SMS DND clear.
- **C (4–10):** Trigger on `cmap:score-4-10`, move to Invited and use the C1–C5 timings in the appendix. Stop if booked or if the score changes.
- **D (0–3):** Trigger on `cmap:score-0-3`, send D1, D1b on Day 4 or 5, and D2 at Month 11 if still appropriate. The review invitation stays low pressure. The referral link in D1b is the public **opt-in landing page**, not the PDF or a trigger link.
- **E (no score):** Trigger on `cmap:no-score`, send E1 on **Day 30 from the original opt-in**. Stop if scored or booked. Transfer to a separate newsletter only if a **separate applicable newsletter permission** exists; otherwise end.
- **Booking:** Create a dedicated calendar event named **Your Family Continuity Review**. In its form, only ask the optional four-choice gap question when `cmap_gap_band` is empty. The fourth answer (“I haven’t completed it yet”) leaves the score field empty. On a confirmed booking, add `cmap:booked`, move the same opportunity to Booked, stop A–E, preserve source/score, and start BK1/BK2/optional BK-SMS. Use appointment-based triggers and waits tied to the current appointment time. On cancellation, stop reminders and retain history; on reschedule, clear the stale reminders and schedule from the new time without restarting nurture. Mark Review Held only after a real completed appointment; mark Client only after confirmed conversion.

In all workflows, configure the GHL sender, first-name fallback (“there”), unsubscribe link, and postal footer. Keep the supplied financial, legal, and insurance wording as written. The booking confirmation must use the appointment context so `{{appointment.start_time}}` and reschedule link resolve. Test personalized fields before publishing. Never send an SMS based on the unrelated `llfg-sms-service-consent` tag.

## 6. Server configuration and verification

Set `GHL_PRIVATE_INTEGRATION_TOKEN` and `GHL_LOCATION_ID` in the appropriate Vercel environments. Set `GHL_FAMILY_CONTINUITY_REVIEW_URL` to the tested HTTPS URL of the dedicated GHL calendar. The internal `/family-continuity-map/book` page redirects there; without it, it shows a clear email fallback. Both the booking link and availability flag are baked into statically rendered pages, so **redeploy after changing either**.

After all assets are published and tested, set `GHL_CMAP_DELIVERY_READY=true` in Vercel and redeploy the preview. Verify the complete flow there, then repeat after approving production. The flag is an operator assertion; it does not programmatically create or test GHL workflows.

| Test | Required observation |
| --- | --- |
| First name + email only | One upserted contact, consent time/text/version, delivery tag, A1 sent, thank-you redirect. |
| Phone without SMS consent | No `cmap:sms-consent` and no Map SMS. |
| Phone with optional SMS consent | Consent timestamp/text/version, Map tag, SMS only if A2P and DND checks pass. |
| UTM and referrer | Correct fields recorded, without household worksheet data. |
| Opted-out/DND address or failed GHL call | Endpoint returns an error; no success redirect or delivery trigger. |
| 0–3, 4–10, 11+ trigger links | Exactly one correct band/sequence, source retained, correct page redirect. |
| Day 10 without score, then late score | E entry, then E stops and old no-score tag clears. |
| Repeated opt-in, double click, changed score | One contact/opportunity and at most one active relevant sequence. |
| Book, cancel, reschedule | All nurture stops on booking; reminders use current status and time. |
| Mobile and keyboard | Forms, thank-you, score pages, validation, and CTA are usable. |
| PDF link inspection | No blank PDF URL in site HTML, JS, sitemap, API responses, or repository. |

Build a GHL dashboard for opt-ins by source/medium/campaign; A1 opens and clicks; percentage with a reported score; band split; no-score percentage; bookings by band/source; reviews held; and client conversion. Email opens are indicative rather than proof of reading. Never upload completed Maps for reporting.

## Launch status

As of 2026-09-28, the uploaded six-page PDF was verified in this sub-account's Media Storage and attached to A1 in the **unpublished** `CMap A: Delivery + Score` workflow. Its `cmap:delivery-requested` trigger, email DND branch, A1, two-day wait, day-two booked/scored/DND exit check, A2 email with all three tracked score links, and an additional three-day wait are saved. The three score trigger links exist. The `Continuity Map Leads` pipeline has the six specified stages. All campaign tags exist. Eleven of thirteen contact fields exist in the `Family Continuity Map` folder; `cmap_email_consent_at` and `cmap_sms_consent_at` are outstanding because the account's Date picker preview only shows a calendar date, while the website supplies precise ISO 8601 timestamps. Do not replace those timestamps with date-only values. A3–A4 and the rest of A, B–E, score click processing, booking automation, dedicated calendar, email authentication and A2P checks, and live end-to-end tests remain outstanding. `GHL_CMAP_DELIVERY_READY` stays false; the website remains gated.

## Appendix: approved workflow copy and timing

The following section is copied from the supplied implementation brief. Replace `[MAP LINK]`, `[SCORE BUTTONS]`, `[BOOK BUTTON]`, `[OPT-IN PAGE LINK]`, and `[RESCHEDULE LINK]` inside GHL only. Do not place the Map URL in the website.

17. WORKFLOW A — DELIVERY + SCORE CAPTURE
==================================================

Trigger:
new Family Continuity Map opt-in

Entry actions:
- tag lead-magnet:continuity-map
- tag cmap:downloaded
- set cmap_download_date
- set cmap_source
- create/move opportunity to Downloaded

GLOBAL RULE:
If contact reports a score OR books, stop this sequence immediately.

A1 Day 0 immediately

Subject:
Your Family Continuity Map is here

Preview:
Start with page 2. Ten minutes is enough.

Body:

Hi {{contact.first_name}},

Here’s your Family Continuity Map:

[MAP LINK]

You don’t need to finish it today. Most people never fill in every line, and that’s fine.

Start with one section: Decision-makers on page 2. It asks who makes medical and financial decisions if you can’t, and whether a signed document backs that up. It takes about ten minutes, and it’s the section families are most surprised by.

When you’re ready, the last page turns your blanks into a gap score. That number tells you where you stand.

Tip: open the file in Adobe Reader or Preview so your answers save.

[Standard sign-off]

A2 Day 2

Subject:
What’s your number, {{contact.first_name}}?

Preview:
One click. No forms.

Body:

Hi {{contact.first_name}},

If you’ve completed enough of your Family Continuity Map to calculate the full gap score, which range are you in?

[SCORE BUTTONS]

One click is all it takes. I’ll send you what’s most useful for where you are, and nothing that isn’t.

Haven’t started? Open the Map and do only the Decision-makers section on page 2. Count the “N” answers. That is not your full gap score, but it will show you where to begin.

[Standard sign-off]

A3 Day 5

Subject:
The phone call nobody plans for

Preview:
It’s rarely about money at first.

Body:

Hi {{contact.first_name}},

When something happens to the person who “handles everything,” the first problem is usually not money. It’s information.

Who do we call? Where’s the will? Which account pays the mortgage? Families can lose valuable time looking for answers that could have been written down in advance.

That’s what your Map is for.

If you’ve counted your gaps, tell me where you landed:

[SCORE BUTTONS]

[Standard sign-off]

A4 Day 9

Subject:
Last note about your Map

Preview:
One click, or one conversation.

Body:

Hi {{contact.first_name}},

This is my last note about the Family Continuity Map.

If you counted your gaps, click your range and I’ll send what fits:

[SCORE BUTTONS]

If you’d rather talk it through, you can book Your Family Continuity Review. It’s a complimentary conversation. No pitch, no pressure.

[BOOK BUTTON]

[Standard sign-off]

Day 10 after original opt-in (not after the last email):
If no score tag and no booking:
- apply cmap:no-score
- exit Workflow A
- enter Workflow E

If a score arrives after this handoff, remove `cmap:no-score` and stop Workflow E before starting the matching score sequence.

==================================================
18. WORKFLOW B — 11+ GAPS
==================================================

Highest-priority follow-up.

Entry:
cmap:score-11plus

Actions:
- move pipeline to Invited
- internal alert to Blaise
- stop Workflow A

B1 immediately

Subject:
About your 11+ score

Preview:
Common, and fixable.

Body:

Hi {{contact.first_name}},

Thank you for being honest with your Map.

An 11+ score usually means too much of the family plan still depends on one person knowing what to do, where things are, or who should act.

That is common, and it is fixable, because the gaps are visible now.

The next step is a conversation, not a product.

In Your Family Continuity Review, we’ll go through your Map together, sort your gaps by what matters most, and leave you with a short list of next steps.

It’s complimentary.

[BOOK BUTTON]

Bring your Map, even half-finished.

[Standard sign-off]

B-SMS within 24 hours
ONLY if explicit SMS consent exists.

Hi {{contact.first_name}}, it’s Blaise from Lifeline Legacy. Thanks for sharing your Family Continuity Map score. Happy to walk through it with you, no pitch. Here’s my calendar: [BOOK LINK]. Reply STOP to opt out.

Internal alert (last name may be absent because the opt-in asks only for first name):
11+ gap score:
{{contact.first_name}} {{contact.last_name}}
{{contact.email}}
{{contact.phone}}
Source: {{contact.cmap_source}}
Personal follow-up within 24 hrs.

B2 Day 3 if not booked

Subject:
The one gap to close first

Preview:
If you only fix one thing.

Body:

Hi {{contact.first_name}},

If you only close one gap this month, start with this question:

Who can legally make decisions for you if you can’t?

Without appropriate legal authority in place, your family may face delays, additional legal steps, or even court involvement before someone can act on your behalf.

If your Map identifies this gap, consider discussing it with a qualified estate-planning attorney.

In Your Family Continuity Review, we can identify how this issue fits with the rest of your Map and help you organize the next steps.

[BOOK BUTTON]

[Standard sign-off]

B3 Day 7 if not booked

Subject:
Still here when you’re ready

Preview:
Thirty minutes, your Map, and a clear next step.

Body:

Hi {{contact.first_name}},

No pressure here. I know this isn’t the most fun thing on your list.

When you’re ready, Your Family Continuity Review is about 30 minutes.

You bring the Map.

You leave knowing which gaps deserve attention first and what your next steps may be.

[BOOK BUTTON]

Or reply to this email with a question.

[Standard sign-off]

==================================================
19. WORKFLOW C — 4–10 GAPS
==================================================

Entry:
cmap:score-4-10

Move pipeline:
Invited

C1 immediately

Subject:
Your 4–10 score, and what it means

Preview:
The foundation is there.

Body:

Hi {{contact.first_name}},

A 4–10 score means your family has real pieces in place.

It also means a sudden change could expose a few weak points.

Over the next week, I’ll send three short notes. Each covers one gap families commonly find and what addressing it may look like.

No homework beyond what you choose to do.

[Standard sign-off]

C2 Day 2 — Beneficiaries

Subject:
The form that may matter more than your will

Preview:
Most people haven’t looked at it in years.

Body:

Hi {{contact.first_name}},

For many life insurance policies and retirement accounts, the beneficiary designation controls who receives the asset, regardless of what a will may say.

That means an outdated form can create a result the family never intended.

Your ten-minute step:

Find the current beneficiary designation for each policy and retirement account and confirm it still reflects your intentions.

If legal or tax questions come up, review them with the appropriate professional.

[Standard sign-off]

C3 Day 5 — Decision-makers

Subject:
A name isn’t a plan

Preview:
Why the “Signed document?” column matters.

Body:

Hi {{contact.first_name}},

On page 2 of your Map, you wrote who would make medical and financial decisions if you couldn’t.

Look at the last column.

Did you write “Y” or “N”?

A name alone may not give someone legal authority to act.

If any answer is “N,” consider putting “talk to an estate-planning attorney” on this month’s calendar.

[Standard sign-off]

C4 Day 9 — Household backup

Subject:
Who pays the bills if you can’t?

Preview:
The quietest gap on the Map.

Body:

Hi {{contact.first_name}},

In many households, one person pays the bills.

Often nobody else knows which account pays what or when.

That can become a problem very quickly during a disruption.

Your step:

Fill in the “Monthly household essentials” table on page 5 and show it to your backup.

Fifteen minutes can give the family a much clearer picture of what “normal” costs.

[Standard sign-off]

C5 Day 14

Subject:
Want a second set of eyes on your Map?

Preview:
A complimentary conversation.

Body:

Hi {{contact.first_name}},

Over the past two weeks, we’ve covered beneficiaries, decision-makers, and the household backup.

If you’d like help deciding which of your gaps deserve attention first, book Your Family Continuity Review.

We’ll go through your Map together and leave you with a short, clear list of next steps.

It’s complimentary. No pitch, no pressure.

[BOOK BUTTON]

[Standard sign-off]

==================================================
20. WORKFLOW D — 0–3 GAPS
==================================================

Entry:
cmap:score-0-3

Do not push aggressively.

D1 immediately

Subject:
Your family has a Map

Preview:
That puts you ahead of many households.

Body:

Hi {{contact.first_name}},

A score of 0–3 means your family has a real written structure with relatively few gaps.

Well done.

Two small things help keep it that way:

1. Review the Map once a year and after any major life change.
2. Make sure two trusted people know where it is stored.

If you’d ever like a second set of eyes on your plan, Your Family Continuity Review is available.

[BOOK BUTTON]

[Standard sign-off]

D1b Day 4 or 5

Subject:
Know a family that should have one of these?

Body:

Hi {{contact.first_name}},

If someone you care about would benefit from putting their family plan on paper, feel free to send them this link.

[OPT-IN PAGE LINK]

The Family Continuity Map is free and educational.

[Standard sign-off]

D2 Month 11

Subject:
Time for your yearly Map check

Preview:
Ten minutes. Anything changed this year?

Body:

Hi {{contact.first_name}},

About a year ago, you completed your Family Continuity Map.

Time for a quick review.

Anything change this year?

A new job, a new home, a new grandchild, a policy renewed or dropped?

Each change can affect a beneficiary, a contact, a responsibility, or a document location.

Here’s a fresh copy if you need it:

[MAP LINK]

Want to walk through it together this time?

[BOOK BUTTON]

[Standard sign-off]

==================================================
21. WORKFLOW E — NO SCORE REPORTED
==================================================

Entry:
cmap:no-score

After E1, enter general nurture/newsletter only when a separate applicable subscription permission is recorded. The required Map-related email consent alone must not be treated as an unlimited newsletter opt-in. Otherwise end this sequence after E1.

E1 Day 30 after original opt-in, not Day 30 after entering Workflow E

Subject:
Ten minutes, one section

Preview:
You don’t have to finish the whole Map.

Body:

Hi {{contact.first_name}},

A month ago you downloaded the Family Continuity Map.

If it’s still sitting unopened, you’re in good company.

Here’s the smallest useful step:

Open it and fill in only the Decision-makers table on page 2.

Five rows.

Count the “N” answers.

That is not your full gap score, but it can quickly show you where the first planning gaps may be.

[MAP LINK]

If you later complete the Map, tell me your full range:

[SCORE BUTTONS]

[Standard sign-off]

==================================================
22. BOOKING WORKFLOW
==================================================

Calendar event name:

Your Family Continuity Review

GLOBAL BOOKING RULE:

If someone books at any point:

- apply cmap:booked
- move pipeline stage to Booked
- stop Workflows A–E
- preserve source and score band
- enter booking confirmation workflow only
- on cancellation or reschedule, handle GHL appointment status and timing explicitly; do not restart a stopped nurture sequence or send stale reminders

Booking form:

If cmap_gap_band already exists:
do not ask again

If missing, ask:

“When you completed the Family Continuity Map, about how many gaps did you identify?”

Choices:
0–3
4–10
11+
I haven’t completed it yet

The last answer leaves `cmap_gap_band` unset; it is not a fourth score band. If the person already reported a score, do not overwrite it with an empty booking answer.

BK1 immediately on booking

Subject:
You’re booked: Your Family Continuity Review

Preview:
{{appointment.start_time}}. Here’s what to bring.

Body:

Hi {{contact.first_name}},

You’re confirmed for Your Family Continuity Review on {{appointment.start_time}}.

What to bring:

Your Family Continuity Map, even if it’s half-finished.

The blanks are useful. They show us where the questions are.

What to expect:

We’ll go through your Map together, sort the gaps by what matters most, and leave you with a short list of next steps.

No pitch, no pressure.

Need to reschedule?

[RESCHEDULE LINK]

[Standard sign-off]

BK2 24 hours before

Subject:
Tomorrow: Your Family Continuity Review

Preview:
Have your Map handy.

Body:

Hi {{contact.first_name}},

A quick reminder that we meet tomorrow at {{appointment.start_time}}.

If you have ten minutes before then, review the Decision-makers section on page 2.

Need a new time?

[RESCHEDULE LINK]

[Standard sign-off]

BK-SMS 1 hour before
ONLY if explicit SMS consent exists.

Hi {{contact.first_name}}, Blaise here. Looking forward to Your Family Continuity Review at {{appointment.start_time}}. Have your Map handy. Reply STOP to opt out.

==================================================
23. STANDARD EMAIL FOOTER
==================================================

Sender:
Blaise Dzudie Tamo
blaise.tamo@lifelinelegacyfinancial.com

Standard sign-off:

Blaise Dzudie Tamo
The Continuity Architect™
Lifeline Legacy Financial Group
Direct: 214-907-5087
www.lifelinelegacyfinancial.com

Every email must include:
- unsubscribe link
- 9451 LBJ Freeway, Suite 118, Dallas, TX 75243

Do not hardcode unsubscribe mechanics in website code if GHL handles them.

==================================================
24. SMS COMPLIANCE
==================================================

SMS may only be sent when explicit SMS consent exists.

SMS checkbox:
- unchecked by default
- separate from email delivery consent

Use compliant language appropriate for event/appointment/service communication.

Include STOP language where appropriate.

Do not enroll phone-only users into SMS nurture without consent.

Confirm that A2P registration is active before production launch.

If A2P status cannot be verified programmatically, document it as a required manual launch check.

==================================================
25. EMAIL DOMAIN AUTHENTICATION
==================================================

Before launch, verify/document that lifelinelegacyfinancial.com has appropriate email authentication configured:

- SPF
- DKIM
- DMARC

If this cannot be verified from the repository, list it clearly as a manual launch requirement.

Do not invent verification results.

==================================================
