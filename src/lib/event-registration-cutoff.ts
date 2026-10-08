export const WYLIE_OCTOBER_12_CUTOFF = {
  eventId: "wylie-october-12",
  timeZone: "America/Chicago",
  localDateTime: "2026-10-12T18:00:00",
  instant: "2026-10-12T18:00:00-05:00",
} as const;

export function eventRegistrationCutoff(
  eventId: string,
  eventDateTime: string,
) {
  return eventId === WYLIE_OCTOBER_12_CUTOFF.eventId
    ? WYLIE_OCTOBER_12_CUTOFF.instant
    : eventDateTime;
}

export function isEventRegistrationClosed(
  eventId: string,
  eventDateTime: string,
  now = Date.now(),
) {
  return now >= Date.parse(eventRegistrationCutoff(eventId, eventDateTime));
}
