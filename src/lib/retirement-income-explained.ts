// November 12, 2026 "Retirement Income Explained" event: two sessions under one
// stable event ID. The website registers people; GoHighLevel workflows send the
// confirmation and reminder messages (see docs/retirement-income-explained-ghl.md).

export const RIE_EVENT_ID = "fretz-november-12-workshop";
export const RIE_PATH = "/retirement-income-explained";
export const RIE_THANK_YOU_PATH = "/retirement-income-explained/thank-you";
export const RIE_MANAGE_PATH = "/retirement-income-explained/manage";

// Added only when the registrant agreed to the current SMS wording, which includes
// one post-event thank-you text. Earlier registrants agreed to reminders only.
export const RIE_SMS_THANKYOU_TAG = "llfg-event-fretz-november-12-workshop-sms-thankyou-consent";
// A change/cancel request from the manage page. GHL removes the contact from the
// reminder workflow and alerts staff, who confirm the change.
export const RIE_CHANGE_REQUEST_TAG = "llfg-event-2026-11-12-change-requested";
export const rieChangeRequestTypes = ["cancel", "workshop", "seminar", "both", "guest", "other"] as const;
export type RieChangeRequest = (typeof rieChangeRequestTypes)[number];

// GHL stores tags in lower case. These are the owner-requested tags
// (LLFG-Event-2026-11-12, LLFG-Workshop-2026-11-12, ...) as GHL will show them.
export const RIE_EVENT_TAG = "llfg-event-2026-11-12";

export const rieSessionKeys = ["workshop", "seminar", "both"] as const;
export type RieSessionKey = (typeof rieSessionKeys)[number];

export const rieEvent = {
  title: "Retirement Income Explained",
  subtitle: "How to Turn Your Retirement Savings Into a Retirement Paycheck",
  dayDate: "Thursday, November 12, 2026",
  date: "November 12, 2026",
  venue: "Fretz Park Branch Library",
  street: "6990 Belt Line Road",
  cityLine: "Dallas, TX 75254",
  address: "6990 Belt Line Road, Dallas, TX 75254",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fretz+Park+Branch+Library+6990+Belt+Line+Road+Dallas+TX+75254",
  timeZone: "America/Chicago",
  timeZoneLabel: "Central Time",
  host: "Blaise D. Tamo, Founder & CEO, Lifeline Legacy Financial Group",
} as const;

export const rieSessions: Record<RieSessionKey, {
  key: RieSessionKey;
  label: string;
  optionLabel: string;
  time: string;
  title: string;
  start: string;
  end: string;
  tag: string;
  fieldValue: string;
}> = {
  workshop: {
    key: "workshop",
    label: "Afternoon Workshop",
    optionLabel: "Afternoon Workshop | 2:00 PM to 5:00 PM",
    time: "2:00 PM to 5:00 PM",
    title: "Build Your Written Retirement Paycheck Plan",
    start: "2026-11-12T14:00:00-06:00",
    end: "2026-11-12T17:00:00-06:00",
    tag: "llfg-workshop-2026-11-12",
    fieldValue: "Afternoon Workshop (2:00 PM to 5:00 PM)",
  },
  seminar: {
    key: "seminar",
    label: "Evening Seminar",
    optionLabel: "Evening Seminar | 5:00 PM to 7:00 PM",
    time: "5:00 PM to 7:00 PM",
    title: "Retirement Income Explained",
    start: "2026-11-12T17:00:00-06:00",
    end: "2026-11-12T19:00:00-06:00",
    tag: "llfg-seminar-2026-11-12",
    fieldValue: "Evening Seminar (5:00 PM to 7:00 PM)",
  },
  both: {
    key: "both",
    label: "Both Sessions",
    optionLabel: "Both Sessions | 2:00 PM to 7:00 PM",
    time: "2:00 PM to 7:00 PM",
    title: "Afternoon Workshop and Evening Seminar",
    start: "2026-11-12T14:00:00-06:00",
    end: "2026-11-12T19:00:00-06:00",
    tag: "llfg-both-2026-11-12",
    fieldValue: "Both Sessions (2:00 PM to 7:00 PM)",
  },
};

export const rieSessionTags = rieSessionKeys.map((key) => rieSessions[key].tag);

export function isRieSession(value: string): value is RieSessionKey {
  return (rieSessionKeys as readonly string[]).includes(value);
}

export function sessionFromTags(tags: string[]): RieSessionKey | null {
  const lower = tags.map((tag) => tag.toLowerCase());
  return rieSessionKeys.find((key) => lower.includes(rieSessions[key].tag)) ?? null;
}

// A session cannot be booked once it has started.
export function isSessionClosed(key: RieSessionKey, now = Date.now()) {
  return now >= Date.parse(rieSessions[key].start);
}

// GHL contact custom fields for this event (created in GHL Settings → Custom Fields).
// Written best effort after the tags and note; the registration note stays the record.
export const rieCustomFieldKeys = {
  session: "llfg_nov_12_session",
  guestCount: "llfg_nov_12_guest_count",
  guestName: "llfg_nov_12_guest_name",
  attribution: "llfg_nov_12_attribution",
  // Message merge fields. Written before the trigger tag so no message can send
  // with an empty session name, time or calendar link.
  sessionName: "llfg_nov_12_session_name",
  sessionTime: "llfg_nov_12_session_time",
  startTime: "llfg_nov_12_start_time",
  calendarLink: "llfg_nov_12_calendar_link",
} as const;

export function startTimeLabel(key: RieSessionKey) {
  return rieSessions[key].time.split(" to ")[0];
}

export function calendarLink(key: RieSessionKey) {
  return `https://lifelinelegacyfinancial.com${RIE_PATH}/calendar/${key}`;
}

export const RIE_SMS_CONSENT_VERSION = "2026-11-05-v2";
export const RIE_SMS_CONSENT_TEXT =
  "Yes, text me my registration confirmation, event reminders, and one post-event thank-you for Retirement Income Explained at the mobile number above. Up to 4 messages. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not required to register.";
export const RIE_MARKETING_CONSENT_TEXT =
  "Yes, email me occasional LLFG retirement education and future event invitations. I can unsubscribe at any time.";
export const RIE_EMAIL_NOTICE =
  "By registering, you agree that LLFG may email you about this registration, including your confirmation, reminders, and any schedule changes.";

function toIcsUtc(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(key: RieSessionKey) {
  const session = rieSessions[key];
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${rieEvent.title}: ${session.label}`,
    dates: `${toIcsUtc(session.start)}/${toIcsUtc(session.end)}`,
    details: `Free educational event with Blaise D. Tamo, Lifeline Legacy Financial Group. ${session.label}, ${session.time} Central Time. Details: https://lifelinelegacyfinancial.com${RIE_PATH}`,
    location: `${rieEvent.venue}, ${rieEvent.address}`,
    ctz: rieEvent.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function icsFor(key: RieSessionKey) {
  const session = rieSessions[key];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lifeline Legacy Financial Group//Retirement Income Explained//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:llfg-2026-11-12-${key}@lifelinelegacyfinancial.com`,
    "DTSTAMP:20261105T000000Z",
    `DTSTART:${toIcsUtc(session.start)}`,
    `DTEND:${toIcsUtc(session.end)}`,
    `SUMMARY:${escapeIcs(`${rieEvent.title}: ${session.label}`)}`,
    `LOCATION:${escapeIcs(`${rieEvent.venue}, ${rieEvent.address}`)}`,
    `DESCRIPTION:${escapeIcs(`Free educational event with Blaise D. Tamo, Lifeline Legacy Financial Group. ${session.label}: ${session.time} Central Time. Questions: 972-764-8516. https://lifelinelegacyfinancial.com${RIE_PATH}`)}`,
    `URL:https://lifelinelegacyfinancial.com${RIE_PATH}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
