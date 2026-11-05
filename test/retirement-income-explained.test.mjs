import assert from "node:assert/strict";
import { register } from "node:module";
import test, { afterEach, beforeEach } from "node:test";

register("./support/alias-hooks.mjs", import.meta.url);

const lib = await import("../src/lib/retirement-income-explained.ts");
const { POST } = await import("../src/app/api/lead/route.ts");

// ---------- Mock GoHighLevel ----------
let calls;
let existingTags;
let failUpsert;
let failFields;
const realFetch = globalThis.fetch;
const realNow = Date.now;

beforeEach(() => {
  calls = [];
  existingTags = [];
  failUpsert = false;
  failFields = false;
  process.env.GHL_PRIVATE_INTEGRATION_TOKEN = "test-token";
  process.env.GHL_LOCATION_ID = "test-location";
  Date.now = () => Date.parse("2026-11-05T12:00:00-06:00");
  globalThis.fetch = async (url, init = {}) => {
    const path = new URL(url).pathname;
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ path, method: init.method ?? "GET", body });
    if (path === "/contacts/upsert") {
      return failUpsert ? new Response("{}", { status: 500 }) : Response.json({ contact: { id: "c1" } });
    }
    if (path === "/contacts/c1/tags" && init.method === "POST") {
      existingTags = [...new Set([...existingTags, ...body.tags.map((tag) => tag.toLowerCase())])];
      return Response.json({ tags: existingTags });
    }
    if (path === "/contacts/c1/tags" && init.method === "DELETE") {
      existingTags = existingTags.filter((tag) => !body.tags.includes(tag));
      return Response.json({ tags: existingTags });
    }
    if (path === "/contacts/c1/notes") return Response.json({ note: { id: "n1" } }, { status: 201 });
    if (path === "/contacts/search/duplicate") {
      return Response.json({ contact: existingTags.includes("llfg-event-2026-11-12") ? { id: "c1", tags: existingTags } : null });
    }
    if (path === "/contacts/c1" && init.method === "PUT") {
      return failFields ? new Response("{}", { status: 422 }) : Response.json({ contact: { id: "c1" } });
    }
    throw new Error(`Unexpected GHL call ${init.method} ${path}`);
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
  Date.now = realNow;
});

const base = {
  type: "event-registration",
  eventId: "fretz-november-12-workshop",
  session: "workshop",
  firstName: "Test",
  lastName: "Registrant",
  email: "test-registrant@example.com",
  phone: "(214) 555-0100",
  state: "",
  guestCount: "0",
  guests: [],
  age50Plus: "",
  industryProfessional: "",
  consent: true,
  smsConsent: false,
  marketingConsent: false,
  website: "",
  attribution: { source: "facebook", medium: "paid", campaign: "nov12", landingPath: "/retirement-income-explained", referrer: "https://m.facebook.com/x?fbclid=secret" },
};

function post(body) {
  return POST(new Request("https://lifelinelegacyfinancial.com/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "https://lifelinelegacyfinancial.com", host: "lifelinelegacyfinancial.com" },
    body: JSON.stringify(body),
  }));
}

const tagCalls = () => calls.filter((call) => call.path === "/contacts/c1/tags" && call.method === "POST").map((call) => call.body.tags);
const noteCalls = () => calls.filter((call) => call.path === "/contacts/c1/notes");

// ---------- Event library ----------
test("session times are Central and close at each session start", () => {
  assert.equal(new Date(lib.rieSessions.workshop.start).toISOString(), "2026-11-12T20:00:00.000Z");
  assert.equal(new Date(lib.rieSessions.seminar.start).toISOString(), "2026-11-12T23:00:00.000Z");
  assert.equal(new Date(lib.rieSessions.both.end).toISOString(), "2026-11-13T01:00:00.000Z");
  assert.equal(lib.isSessionClosed("workshop", Date.parse("2026-11-12T13:59:59-06:00")), false);
  assert.equal(lib.isSessionClosed("workshop", Date.parse("2026-11-12T14:00:00-06:00")), true);
  assert.equal(lib.isSessionClosed("both", Date.parse("2026-11-12T14:00:00-06:00")), true);
  assert.equal(lib.isSessionClosed("seminar", Date.parse("2026-11-12T16:59:59-06:00")), false);
});

test("calendar files and links carry the exact session window and venue", () => {
  const ics = lib.icsFor("seminar");
  assert.match(ics, /DTSTART:20261112T230000Z\r\n/);
  assert.match(ics, /DTEND:20261113T010000Z\r\n/);
  assert.match(ics, /Fretz Park Branch Library\\, 6990 Belt Line Road\\, Dallas\\, TX 75254/);
  const google = new URL(lib.googleCalendarUrl("workshop"));
  assert.equal(google.searchParams.get("dates"), "20261112T200000Z/20261112T230000Z");
  assert.equal(google.searchParams.get("ctz"), "America/Chicago");
});

test("session is read back from GHL tags", () => {
  assert.equal(lib.sessionFromTags(["llf - website", "llfg-both-2026-11-12"]), "both");
  assert.equal(lib.sessionFromTags(["LLFG-Seminar-2026-11-12"]), "seminar");
  assert.equal(lib.sessionFromTags(["other"]), null);
});

// ---------- /api/lead ----------
test("new workshop registration: one contact, one note, session tag before trigger tags, fields written", async () => {
  const response = await post({ ...base, smsConsent: true });
  const result = await response.json();
  assert.equal(response.status, 201);
  assert.deepEqual(result, { ok: true, alreadyRegistered: false, session: "workshop" });

  const upsert = calls.find((call) => call.path === "/contacts/upsert").body;
  assert.equal(upsert.createNewIfDuplicateAllowed, false);
  assert.equal(upsert.state, undefined, "state is optional and omitted when blank");
  assert.equal(upsert.lastName, "Registrant");

  const batches = tagCalls();
  assert.equal(batches.length, 3);
  assert.ok(batches[0].includes("llfg-event-registration"));
  assert.ok(!batches[0].includes("llfg-email-education-consent"), "no marketing tag without consent");
  assert.ok(!batches[0].some((tag) => tag.includes("age-50-plus")), "no qualification tags when unanswered");
  assert.ok(batches[1].includes("llfg-workshop-2026-11-12"));
  assert.ok(batches[1].includes("llfg-event-fretz-november-12-workshop-sms-consent"));
  assert.ok(batches[1].includes("llfg-event-fretz-november-12-workshop-status-registered"));
  assert.deepEqual(batches[2], ["llfg-event-fretz-november-12-workshop", "llfg-event-2026-11-12"], "trigger tags are added last");

  assert.equal(noteCalls().length, 1);
  const note = JSON.parse(noteCalls()[0].body.body);
  assert.equal(note.session, "workshop");
  assert.equal(note.sessionTime, "2:00 PM to 5:00 PM");
  assert.equal(note.seatsReserved, 1);
  assert.equal(note.smsEventConsent, true);
  assert.equal(note.marketingEmailConsent, false);
  assert.equal(note.attribution.campaign, "nov12");
  assert.equal(note.attribution.referrer, "https://m.facebook.com/x", "referrer query string is stripped");

  const fields = calls.find((call) => call.method === "PUT").body.customFields;
  assert.deepEqual(fields.find((field) => field.key === "llfg_nov_12_session").field_value, "Afternoon Workshop (2:00 PM to 5:00 PM)");
  assert.deepEqual(fields.find((field) => field.key === "llfg_nov_12_attribution").field_value, "facebook / paid / nov12");
});

test("both sessions with one guest counts two seats and stores the guest only in the note", async () => {
  const guest = { firstName: "Pat", lastName: "Guest", relationship: "Spouse/Partner" };
  const response = await post({ ...base, session: "both", guestCount: "1", guests: [guest], marketingConsent: true });
  assert.equal(response.status, 201);
  const note = JSON.parse(noteCalls()[0].body.body);
  assert.equal(note.seatsReserved, 2);
  assert.deepEqual(note.guests, [guest]);
  assert.ok(tagCalls()[0].includes("llfg-email-education-consent"));
  assert.ok(tagCalls()[1].includes("llfg-both-2026-11-12"));
  assert.ok(tagCalls()[1].includes("llfg-event-fretz-november-12-workshop-guests-1"));
  assert.ok(!tagCalls()[1].includes("llfg-event-fretz-november-12-workshop-sms-consent"), "no SMS tag without consent");
  assert.equal(calls.filter((call) => call.path === "/contacts/upsert").length, 1, "guest is never a contact");
});

test("repeat submission returns the session on file and creates no second registration", async () => {
  existingTags = ["llfg-event-fretz-november-12-workshop", "llfg-event-2026-11-12", "llfg-seminar-2026-11-12"];
  const response = await post({ ...base, session: "workshop" });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, alreadyRegistered: true, session: "seminar" });
  assert.equal(noteCalls().length, 0);
  assert.ok(!existingTags.includes("llfg-workshop-2026-11-12"), "session is not silently changed");
});

test("invalid submissions are rejected with 400 before any CRM call", async () => {
  for (const body of [
    { ...base, session: "" },
    { ...base, session: "evening" },
    { ...base, guestCount: "2", guests: [{ firstName: "A", lastName: "B", relationship: "" }, { firstName: "C", lastName: "D", relationship: "" }] },
    { ...base, guestCount: "1", guests: [] },
    { ...base, email: "not-an-email" },
    { ...base, phone: "12345" },
    { ...base, lastName: "" },
    { ...base, consent: false },
  ]) {
    const response = await post(body);
    assert.equal(response.status, 400, JSON.stringify(body).slice(0, 120));
  }
  assert.equal(calls.length, 0);
});

test("a session that has started is refused; the evening seminar stays open", async () => {
  Date.now = () => Date.parse("2026-11-12T14:30:00-06:00");
  const workshop = await post({ ...base, session: "workshop" });
  assert.equal(workshop.status, 422);
  assert.match((await workshop.json()).message, /Afternoon Workshop has already started/);
  const both = await post({ ...base, session: "both" });
  assert.equal(both.status, 422);
  const seminar = await post({ ...base, session: "seminar" });
  assert.equal(seminar.status, 201);
});

test("all registration closes at the seminar start", async () => {
  Date.now = () => Date.parse("2026-11-12T17:00:00-06:00");
  const response = await post({ ...base, session: "seminar" });
  assert.equal(response.status, 422);
});

test("honeypot submissions succeed silently without touching the CRM", async () => {
  const response = await post({ ...base, website: "spam" });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 0);
});

test("CRM upsert failure shows an error and records nothing", async () => {
  failUpsert = true;
  const response = await post(base);
  assert.equal(response.status, 502);
  assert.equal(noteCalls().length, 0);
});

test("a custom-field failure stops before the trigger tags so no message sends with blank fields", async () => {
  failFields = true;
  const response = await post(base);
  assert.equal(response.status, 502);
  assert.ok(!tagCalls().flat().includes("llfg-event-2026-11-12"));
});

test("other events keep their original required fields and tags", async () => {
  const plano = {
    type: "event-registration", eventId: "plano-november-21-catch-up", firstName: "Test", lastName: "Other",
    email: "other@example.com", phone: "2145550101", state: "Texas", guestCount: "0", guests: [],
    age50Plus: "yes", industryProfessional: "no", consent: true, smsConsent: false, website: "",
  };
  assert.equal((await post({ ...plano, state: "" })).status, 400);
  assert.equal((await post({ ...plano, age50Plus: "" })).status, 400);
  const response = await post(plano);
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true, alreadyRegistered: false });
  const all = tagCalls().flat();
  assert.ok(all.includes("llfg-event-plano-november-21-catch-up"));
  assert.ok(all.includes("llfg-event-age-50-plus-yes"));
  assert.ok(!all.some((tag) => tag.includes("2026-11-12")));
  assert.equal(calls.filter((call) => call.method === "PUT").length, 0);
});

test("session merge fields are saved before trigger tags, and SMS consent adds the thank-you tag", async () => {
  const response = await post({ ...base, session: "seminar", smsConsent: true });
  assert.equal(response.status, 201);
  const putIndex = calls.findIndex((call) => call.method === "PUT");
  const triggerIndex = calls.findIndex((call) => call.body?.tags?.includes("llfg-event-2026-11-12"));
  assert.ok(putIndex > -1 && putIndex < triggerIndex);
  const fields = Object.fromEntries(calls[putIndex].body.customFields.map((f) => [f.key, f.field_value]));
  assert.equal(fields.llfg_nov_12_session_name, "Evening Seminar");
  assert.equal(fields.llfg_nov_12_start_time, "5:00 PM");
  assert.equal(fields.llfg_nov_12_calendar_link, "https://lifelinelegacyfinancial.com/retirement-income-explained/calendar/seminar");
  assert.ok(tagCalls().flat().includes("llfg-event-fretz-november-12-workshop-sms-thankyou-consent"));
});

test("change request: registered contact gets a note and the request tag; unknown email gets the same reply", async () => {
  const req = { type: "event-change-request", firstName: "T", email: "test-registrant@example.com", request: "cancel", details: "", website: "" };
  const unknown = await post(req);
  assert.equal(unknown.status, 200);
  const unknownBody = await unknown.json();
  assert.equal(noteCalls().length, 0);
  existingTags = ["llfg-event-2026-11-12"];
  const known = await post(req);
  assert.equal(known.status, 200);
  assert.deepEqual(await known.json(), unknownBody);
  assert.equal(noteCalls().length, 1);
  assert.ok(existingTags.includes("llfg-event-2026-11-12-change-requested"));
  assert.equal(calls.filter((call) => call.path === "/contacts/upsert").length, 0, "never creates a contact");
  assert.equal((await post({ ...req, request: "other", details: "" })).status, 400);
});
