# Fall 2026 seminar registration: GHL setup and release guide

Status: **implementation draft, no attendee workflow published**. Use the `codex/ghl-automation-hardening` Preview to verify the website. Do not promise email or SMS delivery until the GHL workflows below pass a test and are published. The generic `Event Registration` workflow in the `LLFG Website` folder is a draft; its unsafe email using `{{contact.llfg_learning_interest}}` was removed on September 27. Keep the generic workflow unpublished. That field can change when one person signs up for two seminars.

## What the website sends

`/api/lead` validates the primary registrant, the stable event ID, zero to three guests, qualifications, and service communication consents. It upserts one GHL contact by email/phone using `createNewIfDuplicateAllowed: false`, preserving other tags. It adds general source/qualification tags, and reads the complete tag set returned by the tag API. If `llfg-event-{id}` already exists, it returns `alreadyRegistered: true` without creating another event registration note or triggering another confirmation. A repeat submission can change only this event's SMS consent; changes to guest details require contacting LLFG directly. Otherwise it writes a **contact note with the event snapshot**, then adds event-specific status, qualification and consent tags, and finally adds `llfg-event-{id}`. The note stores the event ID, title, subtitle, date, ISO start/end when known, display time, venue, address, type, guest count/names/relationships, answers, consents, source, and initial status. Guests are not contacts and are never added to messaging workflows. A contact's shared `llfg_learning_interest` is not used for event messaging.

The site does not itself send seminar emails or SMS. The successful website response means CRM capture and event tagging succeeded. It does not prove message delivery or guarantee a seat against a capacity limit; capacities are not yet configured. Do not enable waitlists or capacity claims until real inventory exists. Duplicate handling depends on GHL upsert and tag readback; parallel requests in different server instances can still race, so verify GHL workflow enrollment settings and monitor for duplicate contact notes during the first rollout.

The CRM token needs `contacts.write` for upsert, additive tags, and contact notes. The token must stay in the server environment. The browser needs no GHL credential. Do not add unverified custom-field keys; current contact fields remain first/last name, email, phone, state and `llfg_selected_pathway` = Retirement. Event details are stored in the contact note; GHL email/SMS copy is **static inside each event workflow**, keyed by the immutable ID. There are no mandatory new GHL custom fields for this design.

## Event map

Copy dates and copy from `src/lib/site-data.ts` whenever editing workflows. All start timestamps carry their Dallas local UTC offset. Where `endDateTime` is null, verify the actual end time with the venue before listing it in reminders. September 29 is historical and November 10 is cancelled; neither needs a new attendee workflow. The seven remaining events require event-specific setup and tests.

| Stable ID and GHL trigger | Date, start | Title, venue and address | Type / known end; status |
| --- | --- | --- | --- |
| `retirement-countdown` | Sep 29, 6:00 PM CDT | The 10-Year Retirement Countdown; Renner Frankford Branch Library, 6400 Frankford Road, Dallas, TX 75252 | Seminar / unknown; past, registration closed |
| `assumptions-meet-reality` | Oct 1, 6:00 PM CDT | When Assumptions Meet Reality; Renner Frankford Branch Library, 6400 Frankford Road, Dallas, TX 75252 | Seminar / unknown; upcoming |
| `written-retirement-income-plan` | Oct 3, 11:00 AM CDT | Build Your Written Retirement Income Plan; Renner Frankford Branch Library, 6400 Frankford Road, Dallas, TX 75252 | Workshop / 1:00 PM; upcoming |
| `wylie-october-06` | Oct 6, 6:00 PM CDT | Reduce Retirement Risk. Build More Reliable Income.; Rita & Truett Smith Public Library, 300 Country Club Road, Building 300, Wylie, TX 75098 | Seminar / unknown; upcoming |
| `wylie-october-12` | Oct 12, 6:00 PM CDT | Retirement Mindset & Roadmap; Rita & Truett Smith Public Library, 300 Country Club Road, Building 300, Wylie, TX 75098 | Seminar / unknown; upcoming |
| `wylie-october-29` | Oct 29, 6:00 PM CDT | Build Your Written Retirement Income Plan; Rita & Truett Smith Public Library, 300 Country Club Road, Building 300, Wylie, TX 75098 | Workshop / unknown; upcoming |
| `november-10-first-five-years` | Nov 10, 6:00 PM CST | The First Five Years of Retirement; no confirmed venue | Seminar / unknown; cancelled, no registration or workflow |
| `fretz-november-12-workshop` | Nov 12, 2:00 PM CST | Build Your Written Retirement Income Plan; Fretz Park Branch Library, 6990 Belt Line Road, Dallas, TX 75254 | Two-Part Workshop / 7:30 PM; upcoming |
| `renner-november-14-workshop` | Nov 14, 10:00 AM CST | Build Your Written Retirement Income Plan; Renner Frankford Branch Library, 6400 Frankford Road, Dallas, TX 75252 | Workshop / unknown; upcoming |

Each workflow must use its own `llfg-event-{id}` trigger and its own **literal** title, subtitle, date, time, location, address and preparation instructions. `{{event.title}}`, `{{event.date}}` etc. below are **editor placeholders**, not verified GHL merge fields. Replace with static values for that workflow before saving. The only contact merge field needed in attendee templates is `{{contact.first_name}}`. Never insert `{{contact.llfg_learning_interest}}` into an event email/SMS. If a venue or schedule changes, update the website config and every affected draft/active template, inspect queued waits, and notify already registered people manually.

## Tags and state

General tags: `llf - website`, `llfg-event-registration`, `llfg-event-guests-{0..3}`, `llfg-event-age-50-plus-{yes|no|prefer-not-to-say}`, `llfg-event-industry-professional-{yes|no}`, and `llfg-email-service-consent`. Also add `llfg-under-50` for No and `llfg-industry-professional` for Yes. A previous interaction may have added `llfg-sms-service-consent`, but an event registration never sets this global SMS tag. These general tags are for searching and segmentation, **not** for matching a specific registration, because they can describe different submissions by the same contact.

For each event ID, the website adds:

- `llfg-event-{id}` only at the end; this is the confirmation/reminder trigger.
- `llfg-event-{id}-status-registered`.
- `llfg-event-{id}-age-50-plus-{answer}` and `llfg-event-{id}-industry-professional-{answer}`.
- `llfg-event-{id}-sms-consent` **only** if the registrant checked SMS consent for this event. All SMS branches must require this exact event tag; a generic SMS tag from an earlier interaction does not qualify.

Allowed per-event statuses: `registered`, `confirmed`, `attended`, `no-show`, `cancelled`, `waitlist`, `seat-offered`. Use the tag prefix `llfg-event-{id}-status-`. An operator changing status must first remove every other status tag for **that event**, then add exactly one new status tag. Do not change another event's status. For `confirmed`, require an actual confirmation source (for example a reply or staff check); registration alone stays `registered`. Attendance and no-show require check-in or staff verification. For the current site, `waitlist` and `seat-offered` are reserved for future capacity management and never set automatically.

Contact notes preserve the initial snapshot even when staff changes status. For later status changes, append a new dated note with the same event ID and the staff/source rather than overwriting the registration note. Maintain an event-specific consent audit trail. If a guest independently contacts LLFG later, collect their own contact information and consent separately before any messaging.

## Build seven upcoming GHL workflows by hand

The published GHL workflow API exposes retrieval, not a supported create/edit endpoint for these workflows. The current website integration has contact write access, not workflow editing. Configure in GHL's `LLFG Website` workflow folder. Use the seven rows marked upcoming in the event map:

1. Make a workflow named `LLFG | {id} | registration and reminders`. Set location/workflow timezone to `America/Chicago`; verify the UI displays the expected CDT/CST start. Permit at most one active enrollment per contact for this event; do not configure re-entry on an existing tag. Trigger **Contact Tag Added** filtered to the exact `llfg-event-{id}` tag. Do not trigger on `llfg-event-registration` or a tag name that is only a prefix.
2. If `status-cancelled` or `status-waitlist` is present, end; otherwise confirm that `status-registered` or `status-confirmed` is present. Send the immediate registration email below once. If `llfg-event-{id}-sms-consent` is present, send the immediate SMS; otherwise skip SMS.
3. If `llfg-event-{id}-industry-professional-yes` is present, send an internal notification to Blaise/admin with contact name/email/phone, **this workflow's fixed event title and time**, and “Registrant identified themselves as a financial advisor, insurance agent, or broker.” Keep this internal; the visitor receives ordinary registration copy.
4. Set **Event Start Date/Time** to this workflow's fixed date/time in Dallas local time. Configure **Wait for Event/Appointment Time** at one day before; choose the platform option to skip missed communications when a registrant joins after that point, never send a stale reminder. Immediately before each send, recheck event status: only `registered` or `confirmed`, never `cancelled`, `waitlist`, `attended` or `no-show`. Send the one-day email and, with the event-specific consent tag, one-day SMS.
5. Wait until two hours before the event. Apply the same missed-time and status checks. Send the two-hour email and optionally the two-hour SMS if the consent tag exists. The `oneHourBeforeSms` setting is false for all current events; add a one-hour branch only if a future event explicitly enables it, and check status and SMS consent again.
6. End the reminder workflow before the event. **Do not infer attendance from a wait step.** After the event, staff mark attendees and absences from reliable check-in. Use separate workflows for attended and no-show. Use the event-specific status tag as a trigger and a fixed event title in follow-up copy. Ensure only one status is active. Under-50 routes to general retirement education instead of the primary pre-retiree invitation; industry professionals receive the same respectful event messaging and a separate internal alert.
7. Add a **Contact Tag Added** trigger for `llfg-event-{id}-status-cancelled` in a cancellation workflow. Remove the contact from the matching reminder workflow or ensure all future waits/actions stop on cancelled status, preserve their contact and note, and record released seat count manually until capacity is implemented. If a future waitlist exists, a cancellation may prompt staff to mark the next contact `seat-offered`; do not automate an offer without inventory and a reply window. A cancellation link is not provided by the current website.
8. Test on a controlled internal contact, inspect the action history for event title, exact timezone, branch eligibility, consent, and enrollment. Publish only after the test passes. The generic draft workflow must remain disabled to avoid duplicate or cross-event messages.

**Timing:** reminders are relative to **event start**, not registration submission. HighLevel's Event Start Date and Wait actions support this pattern. For late registrations, send the immediate confirmation and only the reminders whose scheduled times are still in the future. Keep quiet-hour, sender and deliverability settings consistent with the GHL account and phone registration requirements. If the builder cannot set an absolute event datetime safely in a contact workflow, use a validated fixed date/time wait per event; test one day/two hour offsets with a test event before publishing. Do not claim that an untested builder step is live.

### Confirmation (immediate)

**Subject:** You’re registered: `{{event.title}}`

Hi `{{contact.first_name}}`,

Your seat is reserved for:

`{{event.title}}`  
`{{event.subtitle}}`

Date: `{{event.date}}`  
Time: `{{event.time}}`  
Location: `{{event.location}}`  
`{{event.address}}`

We’ll send you a few reminders as the event gets closer. If you registered a guest, their seat has been included with your reservation.

This is an educational event from Lifeline Legacy Financial Group. You do not need to bring account numbers or sensitive financial information unless the event description specifically asks you to bring planning documents.

We look forward to seeing you.

Blaise Tamo  
Founder & CEO  
Lifeline Legacy Financial Group  
Protecting Families. Building Legacies.

**SMS, only with this event's SMS consent:** Hi `{{contact.first_name}}`, your seat is reserved for `{{event.title}}` on `{{event.date}}` at `{{event.time}}`. We look forward to seeing you. Lifeline Legacy Financial Group

### One day before

**Subject:** Tomorrow: `{{event.title}}`

Hi `{{contact.first_name}}`,

A quick reminder that `{{event.title}}` is tomorrow.

Date: `{{event.date}}`  
Time: `{{event.time}}`  
Location: `{{event.location}}`  
`{{event.address}}`

Please plan to arrive about 10 to 15 minutes early so we can begin on time.

`{{event.preparation}}`

We look forward to seeing you.

Blaise Tamo  
Lifeline Legacy Financial Group

**SMS, only with this event's SMS consent:** Reminder: `{{event.title}}` is tomorrow at `{{event.time}}` at `{{event.location}}`. Please arrive 10 to 15 minutes early. LLFG

For seminars, preparation is “No preparation is required. Bring your questions.” For written income plan workshops, use the full `writtenPlanPreparation` in `site-data.ts`, including the instruction not to share credentials. For November 12 also include: Workshop 2:00 PM–7:30 PM; Part 1 2:00–4:15 PM; break 4:15–4:45 PM; Part 2 4:45–7:00 PM; Q&A and planning conversations 7:00–7:30 PM. No other event should receive this two-part copy.

### Two hours before

**Email subject:** Today: `{{event.title}}`

Hi `{{contact.first_name}}`,

`{{event.title}}` begins at `{{event.time}}` today. We look forward to seeing you at `{{event.location}}`, `{{event.address}}`.

Blaise Tamo  
Lifeline Legacy Financial Group

**SMS, only with this event's SMS consent:** We’ll see you soon. `{{event.title}}` begins in about 2 hours at `{{event.location}}`. Safe travels. LLFG

### Follow-up after verified attendance

For each event use a separate trigger `llfg-event-{id}-status-attended` and the matching fixed event title. Check that `llfg-event-{id}-age-50-plus-no` is absent before including the review invitation; if it is present, replace the CTA with “Explore more retirement education” linking to `/learn`. Send approximately 1–2 hours after the event when check-in is promptly completed, or the following morning after staff verifies attendance. Never send automatically merely because the event ended.

**Subject:** Thank you for joining us

Hi `{{contact.first_name}}`,

Thank you for joining us for `{{event.title}}`. I hope the conversation helped you see your retirement decisions with greater clarity.

These sessions help you understand how income, risk, taxes, healthcare, survivor planning, and legacy decisions fit together. If the seminar uncovered questions you would like to explore, you are welcome to schedule a Retirement Income Review.

**CTA:** Schedule Your Retirement Income Review (use the approved, working calendar URL once available).

Thank you again for spending part of your day with us.

Blaise Tamo  
Lifeline Legacy Financial Group

For under-50 registrants, use this branch in place of the CTA: “You can explore more retirement education and choose another session at [Upcoming Events](https://lifelinelegacyfinancial.com/learn).” Do not link an unconfigured calendar. Confirm final copy and compliance before publishing.

### Follow-up after verified no-show

For each event trigger `llfg-event-{id}-status-no-show`, wait until the **following morning in Dallas**, then send once, only if no subsequent `attended` or `cancelled` status. Do not send the appointment CTA.

**Subject:** Sorry we missed you

Hi `{{contact.first_name}}`,

We missed you at `{{event.title}}`. I know schedules change.

If you would still like to learn about the topic, you can [view upcoming events](https://lifelinelegacyfinancial.com/learn) and choose another session that works better for you.

We hope to see you at a future conversation.

Blaise Tamo  
Lifeline Legacy Financial Group

## Manual build and go-live checklist

1. Confirm the GHL location's duplicate-contact settings, the website token's `contacts.write` scope and contact note API access, timezone, sender email, SMS sending/opt-in and compliance requirements. The current GHL account has a shared sending domain; verify deliverability to a test mailbox before sending externally.
2. Run an **internal test registration** through Preview (not a public prospect). Verify one contact, exact event note, additive general/event tags, no guest contact, and `alreadyRegistered` on repeat. Inspect `llfg-event-{id}-sms-consent` absence for email-only registrants. Test a second event on the same contact and verify the first note/tag remains unchanged.
3. The generic mutable-field email was removed from the existing **draft** workflow on September 27; keep its `llfg-event-registration` trigger unpublished. Build and test the seven upcoming exact-tag workflows above. Validate `America/Chicago` and daylight saving on October versus November events. Do not build a new September 29 workflow or November 10 reminders.
4. Set up the per-event status changes and attended/no-show/cancellation workflows. Train staff to mark attendance manually from an actual roll or check-in; audit tags after each update.
5. Send a **test email/SMS only to an approved test contact** with SMS consent. Check message content, event/title, link, one-day/two-hour schedules, suppression of SMS without consent, and cancellation before publishing. Verify actual delivery in GHL message logs.
6. After branch review, merge by normal PR approval, confirm the Vercel deployment/environment, and test the production endpoint once. Publish each GHL workflow only after corresponding production code, sender setup and test results are confirmed. Monitor the first live registrations and check for duplicate tags, notes, messages or 502 responses. Reconcile partial failures manually if necessary.

The website rate-limit/spam controls for `/api/lead` should be reviewed before broad promotion. Same-origin checks and a honeypot remain present; a honeypot is not a substitute for a verified rate limit.

## Verification matrix

| Case | Required result |
| --- | --- |
| 1. Age 50+, no guest, email + SMS | 201, one note, event/status/consent tags; SMS branch eligible |
| 2. Under 50, spouse guest | 201; under-50 and event-age tags, guest only in primary note; education follow-up |
| 3. Industry professional | 201; industry tag and internal alert with exact event; ordinary attendee copy |
| 4. Two guests | Two named guests in one note; no guest contacts |
| 5. Email consent only | 201, no event SMS consent tag; **zero SMS** in every branch |
| 6. Workshop vs seminar | Matching event type/preparation; no wrong-event title |
| 7. Nov 12 two-part | Fretz date/time and correct schedule, 7:30 PM end, workshop preparation |
| 8. Submission error | 400/502 with visible error, no confirmation; recoverable retry |
| 9. Same email + same event | 200 `alreadyRegistered`, no second note or event trigger; different event gets its own note and tag |
| 10. Mobile | Single-column form, conditional guest fields, clear loading/success, no overflow or reload |

This matrix is the release gate. The code can be tested with a mocked GHL; real GHL email/SMS and queued wait behavior require a separate controlled test in the dashboard before publishing.
