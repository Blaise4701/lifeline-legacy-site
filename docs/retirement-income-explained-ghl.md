# Retirement Income Explained (Nov 12, 2026): funnel, CRM mapping and workflows

Landing page: `/retirement-income-explained` · Confirmation page: `/retirement-income-explained/thank-you` · Change or cancel form: `/retirement-income-explained/manage` (noindex)
Event ID (stable, unchanged): `fretz-november-12-workshop` · Config: `src/lib/retirement-income-explained.ts`

| Session | Time (America/Chicago, CST) | Session tag |
| --- | --- | --- |
| Afternoon Workshop: Build Your Written Retirement Paycheck Plan | Thu Nov 12, 2:00 PM to 5:00 PM | `llfg-workshop-2026-11-12` |
| Evening Seminar: Retirement Income Explained | Thu Nov 12, 5:00 PM to 7:00 PM | `llfg-seminar-2026-11-12` |
| Both Sessions | Thu Nov 12, 2:00 PM to 7:00 PM | `llfg-both-2026-11-12` |

Venue: Fretz Park Branch Library, 6990 Belt Line Road, Dallas, TX 75254. GHL stores tags in lower case, so the owner-requested `LLFG-Event-2026-11-12` appears as `llfg-event-2026-11-12`.

## What `/api/lead` does for a registration

1. Validates server-side: first/last name, email, 10 to 15 digit mobile, session (`workshop|seminar|both`), 0 or 1 guest (name required if 1). State and qualification questions are optional for this funnel. A session cannot be booked after it starts (workshop/both close 2:00 PM, everything closes 5:00 PM).
2. Upserts one contact by email/phone with `createNewIfDuplicateAllowed: false`. Guests are never contacts.
3. Adds general tags: `llf - website`, `llfg-event-registration`, `llfg-event-guests-{0|1}`, `llfg-email-service-consent`, and `llfg-email-education-consent` only if the optional marketing box was checked.
4. **Duplicate check:** if the contact already has `llfg-event-fretz-november-12-workshop`, it returns `alreadyRegistered` with the session on file. No second note, no new trigger, and the session is not changed. A repeat submission can still turn SMS consent on or off (adds or removes the SMS consent tags with a note).
5. Writes one **contact note** "LLFG event registration: fretz-november-12-workshop" (JSON): session, times, guest name, `seatsReserved` (1 + guest), consents with the exact SMS/marketing wording shown (SMS consent version `2026-11-05-v2`), submitted time, and attribution.
6. **Writes the message merge fields before any trigger tag.** If this write fails the request returns 502 and no trigger tag is added, so no message can go out with blank details:

   | Custom field | Example value | Used in |
   | --- | --- | --- |
   | `llfg_nov_12_session` | Afternoon Workshop (2:00 PM to 5:00 PM) | reporting |
   | `llfg_nov_12_session_name` | Afternoon Workshop | emails |
   | `llfg_nov_12_session_time` | 2:00 PM to 5:00 PM | emails, SMS 1 |
   | `llfg_nov_12_start_time` | 2:00 PM | SMS 2, SMS 3 |
   | `llfg_nov_12_calendar_link` | https://lifelinelegacyfinancial.com/retirement-income-explained/calendar/workshop | emails |
   | `llfg_nov_12_guest_count`, `llfg_nov_12_guest_name`, `llfg_nov_12_attribution` | | reporting |

7. Adds status tags: `llfg-event-fretz-november-12-workshop-status-registered`, the **session tag**, `llfg-event-fretz-november-12-workshop-guests-{0|1}`, and, **only** if the SMS box was checked, `llfg-event-fretz-november-12-workshop-sms-consent` plus `llfg-event-fretz-november-12-workshop-sms-thankyou-consent` (the v2 wording covers up to 4 messages including one post-event thank-you).
8. Adds the **trigger tags last**: `llfg-event-fretz-november-12-workshop` and `llfg-event-2026-11-12`.

Consent records are separate: email registration notice (transactional), SMS (event-specific tags + note text), marketing email (`llfg-email-education-consent` + note text). Registration works with neither optional box checked.

## Change or cancel requests (`/retirement-income-explained/manage`)

The form posts `type: "event-change-request"` to `/api/lead` with email, optional first name, request (`cancel|workshop|seminar|both|guest|other`) and details. The API looks the contact up by email and, **only if it already has `llfg-event-2026-11-12`**, writes a note "LLFG event change request: 2026-11-12" and removes and re-adds the tag `llfg-event-2026-11-12-change-requested` (so a second request triggers again). It never creates contacts and always returns the same generic message, so the form does not reveal who is registered. On a CRM error it asks the person to call 972-764-8516.

## GHL workflows (folder `LLFG Website`, account timezone US/Central)

v2 was **published 2026-11-06**. The v1 workflows (`… Retirement Income Explained | confirmation + reminders` and `… | SMS (consent only)`) were set back to **Draft** the same day and are kept for reference; do not republish them.

Every dated wait uses GHL's default "if this date has passed: skip outbound messages until the next wait", so late registrants only get messages still in the future. Each contact enters each workflow once, so a "Both" registrant gets one set of messages timed from the 2:00 PM start. Emails use the account default sender; GHL appends its own unsubscribe link to every email.

**`LLFG | 2026-11-12 RIE | MASTER email sequence (v2)`** (re-entry off, stop-on-response off)
- Trigger: Contact Tag Added = `llfg-event-2026-11-12`.
- If/else **Session**: Workshop / Seminar / Both Sessions by session tag. No session tag → internal email to all users ("registration has no session tag"); nothing is sent to the contact.
- Each branch: Email 1 confirmation (immediately) → wait Mon Nov 9 9:00 AM → Email 2 preparation → wait Wed Nov 11 2:00 PM (Seminar: 5:00 PM) → Email 3 24-hour reminder → wait Fri Nov 13 9:00 AM → If/else **Attendance**:
  - `...-status-attended` → Email 4A thank you → wait Mon Nov 16 10:00 AM → Email 5 only if tags include `llfg-email-education-consent` **and** do not include `llfg-continuity-review-request`.
  - `...-status-no-show` → Email 4B "We missed you".
  - neither tag → Email 4C (attendance unknown).

**`LLFG | 2026-11-12 RIE | SMS sequence (consent only) (v2)`** (re-entry off, stop-on-response off)
- Trigger: Contact Tag Added = `llfg-event-2026-11-12`.
- If/else: Workshop / Seminar / Both, each requiring the session tag **and** `llfg-event-fretz-november-12-workshop-sms-consent`. Anyone else exits without a text.
- Each branch: SMS 1 confirmation → wait Nov 11 2:00 PM (Seminar 5:00 PM) → SMS 2 → wait Nov 12 11:00 AM "Good morning" (Seminar 2:00 PM "Good afternoon") → SMS 3 → wait Nov 13 9:00 AM → SMS 4A (attended) or 4B (no-show), only if the contact also has `...-sms-thankyou-consent`. Attendance unknown → no text.
- Known limit: a person who first opts in to SMS on a repeat registration gets no SMS series (safe default).

**`LLFG | 2026-11-12 RIE | Change or cancel request (stop reminders + alert staff)`** (re-entry **on**)
- Trigger: Contact Tag Added = `llfg-event-2026-11-12-change-requested`.
- Removes the contact from the MASTER v2, SMS v2 and both v1 workflows, then emails all users with the contact's name, email, phone, session and a pointer to the note.

### After the event (staff)
Add `llfg-event-fretz-november-12-workshop-status-attended` or `...-status-no-show` to each registrant **before Fri Nov 13 9:00 AM**. Anyone with neither tag gets Email 4C and no text.

### Correcting or cancelling a registration (staff)
Requests from the form arrive as an internal email; the contact has already been removed from all Nov 12 sequences.
- **Cancel:** remove `...-status-registered`, add `...-status-cancelled`, add a dated note, confirm with the person. Never delete the contact or the original note.
- **Change session:** swap the session tag; update `llfg_nov_12_session`, `llfg_nov_12_session_name`, `llfg_nov_12_session_time`, `llfg_nov_12_start_time` and `llfg_nov_12_calendar_link` to the values in the table above for the new session; add a dated note. Because re-entry is off, re-add them by enrolling the contact manually in the two v2 workflows (Enrollment history → Add contact), after the fields are correct.
- **Add/remove a guest:** update `llfg_nov_12_guest_count` / `llfg_nov_12_guest_name`, swap the `...-guests-{0|1}` tag, add a dated note.

### Test records
Test contacts are tagged `llfg-test-record`; exclude them from seat counts. "Testing Wylie" (Workshop + SMS) received v2 Email 1 and SMS 1 on 2026-11-06 (all merge fields resolved; its four new fields were filled by hand because it registered before v2) and stays enrolled in both v2 workflows as a live check of the dated steps.

## Message copy

The approved copy (owner-supplied) is in the GHL actions as built: Email 1 confirmation, Email 2 preparation ("Before November 12, I Have One Question for You"), Email 3 24-hour reminder, Email 4A/4B/4C post-event, Email 5 optional next step, SMS 1 to 4B. Every email ends with the common footer (Lifeline Legacy Financial Group, 9451 LBJ Freeway, Suite 118, Dallas, TX 75243, website, educational disclaimer). Placeholders map to `{{contact.first_name}}` and the custom fields above; the manage link is the fixed URL `https://lifelinelegacyfinancial.com/retirement-income-explained/manage`.

## Reporting (GHL Contacts → filters / Smart Lists)
- Total registrants: tag `llfg-event-2026-11-12` (minus `...-status-cancelled`).
- Workshop seats: `llfg-workshop-2026-11-12` + `llfg-both-2026-11-12`, plus guests (`...-guests-1`) in those groups.
- Evening seminar seats: `llfg-seminar-2026-11-12` + `llfg-both-2026-11-12`, plus guests.
- Guests: `llfg-event-fretz-november-12-workshop-guests-1`.
- Open change requests: `llfg-event-2026-11-12-change-requested`.
- Sources: custom field `llfg_nov_12_attribution` or the note's attribution block.

## Analytics
`src/lib/funnel-analytics.ts` pushes `LandingPageView`, `RegistrationStarted`, `RegistrationCompleted`, `WorkshopRegistration`, `SeminarRegistration`, `BothSessionsRegistration` to `window.dataLayer` / `fbq` **only if** those tools are already loaded. The site currently loads neither, so nothing is sent until a tag manager or pixel is added with appropriate consent. No contact details are included in events.

## Previous schedule
The old listing (2:00 to 7:30 PM two-part workshop) used the same event ID. On 2026-11-05 GHL had **no** `llfg-event-fretz-november-12-workshop` tag, so there were no website registrations under the old schedule to reconcile. If any appear (e.g. phone registrations entered by hand), keep their original note and ask them to confirm a session; do not assume "Both".

## Tests
`npm run test:retirement-income-explained` runs the real `/api/lead` handler against a mocked GHL (new registration, both + guest, duplicate, invalid input, session closing, honeypot, CRM failure, custom-field failure blocks triggers, merge fields saved before triggers, thank-you consent tag, change requests, other events unchanged).
