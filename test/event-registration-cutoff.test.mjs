import assert from "node:assert/strict";
import test from "node:test";

import {
  eventRegistrationCutoff,
  isEventRegistrationClosed,
  WYLIE_OCTOBER_12_CUTOFF,
} from "../src/lib/event-registration-cutoff.ts";

const eventDateTime = "2026-10-12T18:00:00-05:00";
const oneMillisecondBefore = Date.parse(WYLIE_OCTOBER_12_CUTOFF.instant) - 1;
const atCutoff = Date.parse(WYLIE_OCTOBER_12_CUTOFF.instant);

test("Wylie registration remains open immediately before the cutoff", () => {
  assert.equal(
    isEventRegistrationClosed(WYLIE_OCTOBER_12_CUTOFF.eventId, eventDateTime, oneMillisecondBefore),
    false,
  );
});

test("Wylie registration is rejected exactly at the cutoff", () => {
  assert.equal(
    isEventRegistrationClosed(WYLIE_OCTOBER_12_CUTOFF.eventId, eventDateTime, atCutoff),
    true,
  );
});

test("Wylie registration is rejected after the cutoff", () => {
  assert.equal(
    isEventRegistrationClosed(WYLIE_OCTOBER_12_CUTOFF.eventId, eventDateTime, atCutoff + 1),
    true,
  );
});

test("the cutoff resolves to 6:00 PM in America/Chicago with DST applied", () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: WYLIE_OCTOBER_12_CUTOFF.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date(eventRegistrationCutoff(WYLIE_OCTOBER_12_CUTOFF.eventId, eventDateTime)));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  assert.deepEqual(
    {
      year: values.year,
      month: values.month,
      day: values.day,
      hour: values.hour,
      minute: values.minute,
      timeZoneName: values.timeZoneName,
    },
    {
      year: "2026",
      month: "10",
      day: "12",
      hour: "18",
      minute: "00",
      timeZoneName: "GMT-5",
    },
  );
});
