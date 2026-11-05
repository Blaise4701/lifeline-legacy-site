# Retirement Income Explained (Nov 12, 2026): funnel, CRM mapping and workflows

Landing page: `/retirement-income-explained` · Confirmation page: `/retirement-income-explained/thank-you`
Event ID (stable, unchanged): `fretz-november-12-workshop` · Config: `src/lib/retirement-income-explained.ts`

| Session | Time (America/Chicago, CST) | Session tag |
| --- | --- | --- |
| Afternoon Workshop: Build Your Written Retirement Paycheck Plan | Thu Nov 12, 2:00 PM to 5:00 PM | `llfg-workshop-2026-11-12` |
| Evening Seminar: Retirement Income Explained | Thu Nov 12, 5:00 PM to 7:00 PM | `llfg-seminar-2026-11-12` |
| Both Sessions | Thu Nov 12, 2:00 PM to 7:00 PM | `llfg-both-2026-11-12` |

Venue: Fretz Park Branch Library, 6990 Belt Line Road, Dallas, TX 75254. GHL stores tags in lower case, so the owner-requested `LLFG-Event-2026-11-12` appears as `llfg-event-2026-11-12`.

## What `/api/lead` does for this event

1. Validates server-side: first/last name, email, 10 to 15 digit mobile, session (`workshop|seminar|both`), 0 or 1 guest (name required if 1). State and qualification questions are optional for this funnel. A session cannot be booked after it starts (workshop/both close 2:00 PM, everything closes 5:00 PM).
2. Upserts one contact by email/phone with `createNewIfDuplicateAllowed: false`. Guests are never contacts.
3. Adds general tags: `llf - website`, `llfg-event-registration`, `llfg-event-guests-{0|1}`, `llfg-email-service-consent`, and `llfg-email-education-consent` only if the optional marketing box was checked.
4. **Duplicate check:** if the contact already has `llfg-event-fretz-november-12-workshop`, it returns `alreadyRegistered` with the session on file. No second note, no new trigger, and the session is not changed. The thank-you page says "You're already registered" and how to change it.
5. Writes one **contact note** "LLFG event registration: fretz-november-12-workshop" (JSON): session, times, guest name, `seatsReserved` (1 + guest), consents with the exact SMS/marketing wording shown, submitted time, and attribution (UTM source/medium/campaign, landing path, referrer without query string).
6. Adds status tags: `llfg-event-fretz-november-12-workshop-status-registered`, the **session tag**, `llfg-event-fretz-november-12-workshop-guests-{0|1}`, and `llfg-event-fretz-november-12-workshop-sms-consent` **only** if the SMS box was checked.
7. Adds the **trigger tags last**: `llfg-event-fretz-november-12-workshop` and `llfg-event-2026-11-12`.
8. Best effort: writes contact custom fields `llfg_nov_12_session`, `llfg_nov_12_guest_count`, `llfg_nov_12_guest_name`, `llfg_nov_12_attribution` (source / medium / campaign). A failure here is logged and does not fail the registration, because the note and tags already hold the record.

Consent records are separate: email registration notice (transactional), SMS (event-specific tag + note text), marketing email (`llfg-email-education-consent` + note text). Registration works with neither optional box checked.

## GHL workflows (folder `LLFG Website`, timezone America/Chicago)

One workflow handles everything so a "Both" registrant gets one set of reminders, timed from their first session.

**`LLFG | 2026-11-12 Retirement Income Explained | confirmation + reminders`**
- Trigger: Contact Tag Added = `llfg-event-2026-11-12`. Re-entry off.
- Immediately: confirmation email (below). If `llfg-event-fretz-november-12-workshop-sms-consent`: confirmation SMS.
- If/else on session tag: **Workshop or Both** → first session 2:00 PM; **Seminar** → 5:00 PM.
- Reminder 1 (24 h before first session): Workshop/Both Wed Nov 11, 2:00 PM; Seminar Wed Nov 11, 5:00 PM. Use "Wait until" that exact date/time and **skip if the time has passed** (late registrants get only the reminders still in the future).
- Reminder 2 (3 h before first session): Workshop/Both Thu Nov 12, 11:00 AM; Seminar Thu Nov 12, 2:00 PM. Same skip rule.
- Before each reminder: continue only if `...-status-registered` or `...-status-confirmed` is present and `...-status-cancelled` is not. Send SMS only with the event SMS consent tag.
- Post-event: Fri Nov 13, 10:00 AM, thank-you email with an optional Continuity Review invitation, only if not cancelled. (Attendance is not inferred.)

**`LLFG | 2026-11-12 Retirement Income Explained | cancellation`**
- Trigger: Contact Tag Added = `llfg-event-fretz-november-12-workshop-status-cancelled` → remove from the workflow above, internal notification.

### Correcting or cancelling a registration (staff)
- **Change session:** remove the old session tag, add the new one, update `llfg_nov_12_session`, and add a dated note. If the first session time changed, remove the contact from the reminder workflow and add them back (re-sends confirmation with the new session).
- **Add/remove a guest:** update `llfg_nov_12_guest_count` / `llfg_nov_12_guest_name`, swap `...-guests-{0|1}` tag, add a dated note.
- **Cancel:** remove `...-status-registered`, add `...-status-cancelled`. Never delete the contact or the original note.

## Message copy (static per workflow; only merge field is `{{contact.first_name}}`)

Session text per branch: Workshop = "Afternoon Workshop, 2:00 PM to 5:00 PM"; Seminar = "Evening Seminar, 5:00 PM to 7:00 PM"; Both = "Afternoon Workshop and Evening Seminar, 2:00 PM to 7:00 PM". Calendar link per branch: `https://lifelinelegacyfinancial.com/retirement-income-explained/calendar/{workshop|seminar|both}`.

**Confirmation email.** Subject: You're registered: Retirement Income Explained, Nov 12
> Hi {{contact.first_name}}, your free seat is reserved for Retirement Income Explained: How to Turn Your Retirement Savings Into a Retirement Paycheck.
> Your session: {session text} (Central Time), Thursday, November 12, 2026.
> Location: Fretz Park Branch Library, 6990 Belt Line Road, Dallas, TX 75254.
> Add to your calendar: {calendar link}
> What to expect: an educational event with plain-language explanations and time for questions. Workshop attendees may bring general information about their retirement income goals, expenses, and income sources. Please do not bring account numbers, Social Security numbers, passwords, or financial statements.
> Bringing a guest: if you registered a guest, their seat is included with yours. To add a guest, change your session, or cancel, reply to this email or call 972-764-8516.
> This event is for general educational purposes only and does not provide individualized financial, investment, legal, or tax advice.

**Confirmation SMS:** LLFG: You're registered for Retirement Income Explained, Thu Nov 12, {session time} CT, Fretz Park Library, 6990 Belt Line Rd, Dallas. Reply STOP to opt out.

**Reminder 1 email (24 h).** Subject: Tomorrow: Retirement Income Explained. Same details + "See you tomorrow."
**Reminder 1 SMS:** LLFG reminder: Retirement Income Explained is tomorrow, {session time} CT, Fretz Park Library, 6990 Belt Line Rd, Dallas. Reply STOP to opt out.
**Reminder 2 email (3 h).** Subject: Today at {first session start}: Retirement Income Explained.
**Reminder 2 SMS:** LLFG: See you today at {first session start} CT at Fretz Park Library, 6990 Belt Line Rd, Dallas. Reply STOP to opt out.
**Post-event email (Nov 13).** Subject: Thank you for joining Retirement Income Explained
> Thank you for your interest in yesterday's Retirement Income Explained event. If you would like to talk through your own retirement income questions, you can request a complimentary Continuity Review: https://lifelinelegacyfinancial.com/continuity-review. There is no obligation. Educational disclosure as above.

## Reporting (GHL Contacts → filters / Smart Lists)
- Total registrants: tag `llfg-event-2026-11-12` (minus `...-status-cancelled`).
- Workshop seats: `llfg-workshop-2026-11-12` + `llfg-both-2026-11-12`, plus guests (`...-guests-1`) in those groups.
- Evening seminar seats: `llfg-seminar-2026-11-12` + `llfg-both-2026-11-12`, plus guests.
- Guests: `llfg-event-fretz-november-12-workshop-guests-1`.
- Sources: custom field `llfg_nov_12_attribution` (column in a Smart List) or the note's attribution block.

## Analytics
`src/lib/funnel-analytics.ts` pushes `LandingPageView`, `RegistrationStarted`, `RegistrationCompleted`, `WorkshopRegistration`, `SeminarRegistration`, `BothSessionsRegistration` to `window.dataLayer` / `fbq` **only if** those tools are already loaded. As of this branch the site loads neither, so nothing is sent until a tag manager or pixel is added with appropriate consent. No contact details are included in events.

## Previous schedule
The old listing (2:00 to 7:30 PM two-part workshop) used the same event ID. On 2026-11-05 GHL had **no** `llfg-event-fretz-november-12-workshop` tag, so there were no website registrations under the old schedule to reconcile. If any appear (e.g. phone registrations entered by hand), keep their original note and ask them to confirm a session; do not assume "Both".

## Tests
`npm run test:retirement-income-explained` runs the real `/api/lead` handler against a mocked GHL (new registration, both + guest, duplicate, invalid input, session closing, honeypot, CRM failure, custom-field failure, other events unchanged).
