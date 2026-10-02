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
2. Build one `Trigger Link Clicked` workflow per band, filtered to the matching link. At the top, exit if `cmap:booked` exists. If the same band is already stored, exit without changing the score or restarting nurture. Otherwise remove the other two score tags and `cmap:no-score`, set `cmap_gap_band` to its exact stored value, update the existing opportunity without moving a later stage backward, stop the scoped Map workflows A–E, and only then add the matching score tag. That tag starts the matching B/C/D workflow once. A later different click replaces the prior band and stops the prior sequence before the new band tag is applied.
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
- **Booking:** Use the dedicated **Your Family Continuity Review** calendar. Its optional four-choice score answer is stored separately from `cmap_gap_band`; three guarded workflow branches copy a band only when the stored band is empty. The fourth answer (“I haven’t completed it yet”) leaves it empty. On a confirmed appointment on this calendar only, add `cmap:booked`, move the same opportunity to Booked without moving a later stage backward, stop the scoped Map workflows A–E, and preserve source and any existing score. The native calendar owns BK1 and the one-day-before BK2; the Map booking workflow handles CRM changes and sends no duplicate confirmation/reminder. Native calendar SMS remains disabled. On cancellation, retain booking history and suppress reminders; on reschedule, use the new appointment time without restarting nurture. Mark Review Held only after a real completed appointment; mark Client only after confirmed conversion.

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

As of 2026-10-02, the reconciliation commit `71dfdf9d` remains in this branch's history. PR #16 is Draft, open, and unmerged. **No merge, production deployment, workflow publication, or delivery-gate change is authorized by this checkpoint. `GHL_CMAP_DELIVERY_READY` remains false.** Previously passed application checks and GHL acceptance tests were carried forward. The earlier October 2 continuation corrected the PDF attachment and recorded the operator's completed manual tests and BK2 inspection. The final sender continuation changed only the explicitly authorized shared Dedicated Header From Email and performed one successful controlled sender test plus its reply. No application code, workflow, calendar, campaign sender, DNS, enrollment, appointment, deployment, or opt-out was changed, and no completed manual test was repeated.

All nine Map workflows exist and remain **Draft/unpublished**, with zero active enrollments at the closing inspection: A Delivery + Score; B 11+; C 4–10; D 0–3; E No Score; the three score processors; and Booking. All thirteen Map contact fields exist. The two consent timestamp fields use single-line text to retain ISO 8601 UTC precision. The campaign tags, three tracked score links, and six-stage Continuity Map Leads pipeline exist.

The dedicated **Your Family Continuity Review** calendar remains active. BK1 uses the native confirmed-appointment notification; BK2 is a native reminder one day before the appointment, eligible only for Unconfirmed or Confirmed status. Native calendar SMS, reschedule email, cancellation email, and follow-up email are disabled. Reschedule and cancellation links remain allowed. The earlier internal October 5 QA appointment remains Cancelled; its stored 11+ score and booking history were preserved.

The operator completed the public booking and Cloudflare human-verification path on October 2. The correct Map booking began around 10:32 America/Chicago, received the correct confirmation/calendar assignment, and did not enroll the legacy published Appointment workflow or send its generic confirmation, Pre-Appointment Checklist, or 24 Hours Out sequence. The same Map appointment was rescheduled from October 2 to October 6 and then cancelled, without duplicate or inappropriate prospect messaging. Generic messages around 09:52–09:55 belonged to a separate accidental booking on **Continuity Review with Blaise Tamo**, which was cancelled; they are not a Map defect. These operator-verified PASS results were accepted without rerunning them.

Read-only inspection identified the correct public Map event as `YXIksyomtFQZT2LeqefP`, on calendar `yjjwWIGXevOKiGVlkYwT`, showing **Rescheduled, Cancelled** for October 6, 2026, 08:00–09:00 America/Chicago. BK2's Contact email reminder remains enabled, one day before appointment start. The native reminder editor explicitly restricts eligibility to Unconfirmed or Confirmed status. This event is therefore **suppressed by status eligibility while Cancelled: technical PASS**. Its nominal reminder window would be October 5 at 08:00 CDT (13:00 UTC). No queue/job state or removed/skipped audit is exposed by the inspected UI/connector, so this finding does not claim physical queue deletion or observation of a future send-time event.

The operator also verified real handset delivery, inbound STOP, automatic SMS DND, and a subsequent outbound attempt blocked with `Cannot send message as DND is active`. Do not clear this real opt-out or repeat the handset test. Native calendar SMS remains disabled.

The PDF's seven old phone-number occurrences were corrected to the already approved **469-354-9924**. Its six pages, Decision-makers section, full-score page, and 269 form fields were preserved. A1 now has one corrected attachment. An internal A1 test email received on October 2 confirmed six pages, seven approved-number occurrences, zero old-number occurrences, and unchanged form fields. The old GHL media asset remains available for rollback; its URL is not stored here.

The subsequent operator handoff closed the reply-forwarding test and narrowed this continuation to the From-address/dedicated-header gate. Reply-forwarding is recorded as operator-verified PASS without repeating its manual mailbox test. Public booking/lifecycle, SMS, PDF, workflow, and application checks were not repeated. The operator additionally confirmed the correct Map booking did not send an incorrect generic tomorrow reminder, stayed Confirmed after its October 6 reschedule, and did not re-enroll in the legacy Appointment workflow. Its later cancellation and BK2 technical PASS remain preserved.

With explicit authorization, the shared Dedicated Header From Email was changed from `blaise@mg.lifelinelegacyfinancial.com` to `blaise.tamo@lifelinelegacyfinancial.com`. From Name `Blaise Dzudie Tamo`, sending domain `mg.lifelinelegacyfinancial.com`, enabled header, DNS/authentication, domain warmup, and every other Email Services setting were preserved. GHL showed a generic possible-DMARC warning after save, so the runtime result was treated as authoritative: controlled Gmail message `1a0fdca46a293ec7` displayed `Blaise Dzudie Tamo <blaise.tamo@lifelinelegacyfinancial.com>` and passed SPF, both DKIM signatures, and DMARC. Gmail showed the requested identity directly, with no `X-Google-Original-From`, `X-Original-Sender`, or `X-Envelope-From` substitution header and no visible `via` regression. Its Reply-To remained `blaise.tamo@mg.lifelinelegacyfinancial.com`; reply `1a0fdcba8b752384` arrived in GHL conversation `Kuvhnk7bc4oV1UYAJagk`. Read-only inspection confirmed forwarding still targets `info@lifelinelegacyfinancial.com` and Reply Address remains blank. The prior operator-verified forwarding-delivery PASS is carried forward without repeating that mailbox test.

### Acceptance evidence

PASS below means the stated observation passed, with its scope shown. Operator-verified manual results are identified explicitly. BK2's technical PASS establishes cancelled-status ineligibility, not an observed queue deletion or future send-time run. BLOCKED rows retain previously recorded evidence limits outside the operator's expressly narrowed From-only launch gate; they were not exercised or reclassified by this continuation.

| Case | Result | Evidence and scope |
| --- | --- | --- |
| Application build, typecheck, changed-file ESLint, security/HTTP checks | PASS | Previously completed at the reconciliation state; not repeated for documentation/PDF changes. |
| Repository-wide lint | FAIL | Existing `react-hooks/set-state-in-effect` error in unchanged `src/components/continuity-review-form.tsx:149`; separate from Map acceptance. |
| Consent/attribution, SMS separation, DND/API failure handling | PASS | Previously completed local and simulated GHL checks; not a live website upsert test. |
| Actual A1 delivery and six-page PDF | PASS | Prior inbox receipt included Decision-makers and full score. |
| Corrected PDF attachment | PASS | October 2 focused A1 test mail verified the actual received attachment; no full delivery rerun. |
| Repeat PDF request | PASS | A1 sent; nurture did not reopen; existing opportunity could not move backward. |
| A1 name and visible unsubscribe | PASS | Latest actual workflow A1 rendered the saved QA name and native visible unsubscribe, with one-click headers and no literal token. A focused Send test mail preview does not reproduce the native visible footer. |
| Score processors for 0–3, 4–10, 11+ | PASS | Previously completed draft processor tests. |
| Repeat score | PASS | Exited without changing the stored score or restarting nurture. |
| Changed band to 4–10 and 11+ | PASS | Prior changed-band runs replaced the old band and stopped A–E before applying the new band tag. |
| Score change while delivery active | PASS | Prior execution proved delivery stopped before the new band tag. |
| Booked-contact score click | PASS | October 1 log showed the booked exit after the booking test; 11+ remained stored. |
| Booking while Map workflow active | PASS | Prior draft booking run added `cmap:booked`, moved the same opportunity to Booked, stopped scoped A–E, and retained source and stored score. |
| Booking score cannot overwrite stored score | PASS | Prior booking run preserved the existing band. Empty-score branches and the separate optional-answer field are configured; “not completed” leaves the band unset. |
| Blank stored score: each optional booking answer | BLOCKED | Guards inspected; separate runtime evidence for every empty-score answer is not in the retained acceptance record. |
| BK1 inbox, greeting, calendar phone footer | PASS | Prior actual internal confirmation arrived; fallback renders “Hi there,” and the footer uses the approved business number. |
| SPF, DKIM, DMARC after approved header change | PASS | Controlled Gmail message `1a0fdca46a293ec7` passed SPF, DKIM for `mg.lifelinelegacyfinancial.com` and `mailgun.org`, and DMARC aligned to `lifelinelegacyfinancial.com`. No DNS change was made. |
| Approved From identity | PASS | The enabled dedicated header now uses From Name `Blaise Dzudie Tamo` and From Email `blaise.tamo@lifelinelegacyfinancial.com`. The actual received message displayed that exact identity with no visible `via` or original-sender substitution regression. |
| Reply routing into GHL after header change | PASS | Reply `1a0fdcba8b752384` to the message's observed mg Reply-To arrived in QA2 conversation `Kuvhnk7bc4oV1UYAJagk`. |
| Approved/monitored personal reply-forwarding | PASS | The operator's completed forwarding test remains PASS and was not repeated. Post-change read-only inspection confirms the configured destination is still `info@lifelinelegacyfinancial.com`, Forward to assigned user is off, and Reply Address is blank. |
| Reschedule and cancellation state/history | PASS | Same internal appointment rescheduled to 09:00 October 5, then Cancelled; no nurture restart; no matching active event on the checked primary Google calendar. |
| Public Map reschedule/cancellation and messaging | PASS | Operator verified October 2: correct Map booking rescheduled to October 6, 08:00–09:00 CDT, stayed on the dedicated calendar and Confirmed after reschedule, with no legacy re-enrollment; later cancelled without duplicate, inappropriate, or unexpected prospect messaging. The earlier technical inspection confirmed its final Cancelled state. |
| BK2 timing/status configuration and duplicate ownership | PASS | One-day-before native reminder, only Unconfirmed/Confirmed eligible; booking workflow has no competing email/reminder action and no active enrollment. |
| Cancelled October 6 appointment: native BK2 technical suppression | PASS | Correct event `YXIksyomtFQZT2LeqefP` is Cancelled and therefore ineligible under the native reminder's explicit Unconfirmed/Confirmed rule. Queue removal/cancel/skip mechanics and future send-time execution are not exposed/observed. October 1 Send test emails were previews, not scheduled BK2 sends. |
| Delivery email DND suppression | PASS | October 2 QA2 draft A run followed the DND alert/exit branch, finished, sent no A1, and performed no opportunity action. Only the temporary QA email-DND flag was restored afterward. |
| B SMS consent/DND/phone guard and STOP copy | PASS | Configuration only: Map consent tag, matching band, nonempty phone, SMS DND clear, and STOP wording. No unrelated service-consent tag is used. |
| Real handset delivery, STOP, automatic SMS DND, subsequent suppression | PASS | Operator verified October 2: handset received SMS, GHL received STOP and enabled SMS DND, and a later outbound attempt was blocked with `Cannot send message as DND is active`. Not rerun; the real opt-out must remain intact. |
| Formal A2P registration evidence | BLOCKED | Handset delivery passed, but the retained record does not independently establish formal registration status. No phone/global setting was inspected or changed in this continuation. |
| Day 10 no-score scheduler and late-score exit | BLOCKED | Removal/exit logic is configured; an elapsed-time run is not established by the retained results. |
| Three tracked links: real click/redirect and forwarded-link behavior | BLOCKED | Processor tests passed; the retained results do not prove every inbox link redirect or forwarded-recipient case. |
| Live website opt-in, rapid repeat, attribution/dedup and booking handoff | BLOCKED | Form remains gated and workflows Draft. Confirm integration permissions and email-priority matching as part of the controlled launch check. |
| Public booking, Cloudflare verification, Map BK1 and calendar assignment | PASS | Operator completed the normal public human-verification path and verified the correct dedicated Map calendar and confirmation on October 2. No repeat booking or bypass was attempted. |
| Legacy Appointment workflow isolation | PASS | Operator verified the correct Map booking did not enroll/re-enroll in the legacy published Appointment workflow or trigger its generic confirmation/Pre-Appointment Checklist/24 Hours Out/incorrect tomorrow reminder. Earlier generic messages belonged to the separate accidental old-calendar booking. |
| Mobile/keyboard acceptance | BLOCKED | Page/HTTP checks passed; the retained record does not establish the full manual mobile/keyboard acceptance case. |
| PDF URL exclusion | PASS | Prior security checks carried forward; no public PDF URL or application change was introduced in the continuation. |

### Closed From-address gate and preserved evidence record

1. The authorized shared header change is saved and verified at runtime. Only From Email changed; From Name, enabled header, sending domain, DNS/authentication, warmup, forwarding, blank Reply Address, and all other Email Services settings were preserved.
2. The focused internal test closed the visible From and authentication gate. One successful message was delivered, its raw headers passed SPF/DKIM/DMARC, and its reply returned to GHL Conversations. The first selected QA contact was blocked before send because Email DND was active; that DND was left unchanged, the draft was discarded, and the successful test used the existing QA2 contact.
3. The completed forwarding PASS remains valid; the post-change configuration still names `info@lifelinelegacyfinancial.com`. The pre-existing blank-score, elapsed no-score/late-score, tracked-link/forwarded-link, live website/dedup, formal A2P, and mobile/keyboard evidence limits remain recorded above without new testing or invented PASS results. They are outside the operator's expressly narrowed From-only launch gate.

**The From-address gate is closed, and all Task 4 launch gates identified by the operator's narrowed checkpoint are closed. PR #16 stays Draft/open/unmerged; all nine Map workflows stay Draft/unpublished; `GHL_CMAP_DELIVERY_READY=false` is preserved pending separate release authorization. No merge, publication, flag change, or production deployment follows from this result.** Build and other passed checks need no repeat unless subsequent code/configuration changes invalidate them.

HighLevel behavior references: [dedicated-domain default headers](https://help.gohighlevel.com/support/solutions/articles/155000004428-default-headers-for-dedicated-sending-domains), [Reply & Forward settings](https://help.gohighlevel.com/support/solutions/articles/48001155000-email-services-configuration-reply-forward-settings), [native unsubscribe](https://help.gohighlevel.com/support/solutions/articles/48001225534-managing-default-unsubscribe-links-in-lc-email), [calendar notifications](https://help.gohighlevel.com/support/solutions/articles/155000003441-calendar-email-in-app-sms-whatsapp-appointment-notifications), and [channel DND/STOP](https://help.gohighlevel.com/support/solutions/articles/48001214849-how-to-use-do-not-disturb-dnd-). Calendar notification email is transactional and can bypass Email DND; it must not contain a competing Map nurture sequence. Calendar SMS remains off.

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
One hour, your Map, and a clear next step.

Body:

Hi {{contact.first_name}},

No pressure here. I know this isn’t the most fun thing on your list.

When you’re ready, Your Family Continuity Review is 60 minutes (one hour).

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
Business: 972-764-8516
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
