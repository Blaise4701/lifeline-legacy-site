export type ScheduledWorkshop = {
  dateTime: string;
  endDateTime?: string | null;
  cancelled?: boolean;
  registrationClosed?: boolean;
};

// Explicit UTC offsets in event data preserve Dallas time across daylight saving changes.
export function hasWorkshopEnded(workshop: ScheduledWorkshop, now = Date.now()) {
  const end = Date.parse(workshop.endDateTime ?? workshop.dateTime);
  return !Number.isFinite(end) || now >= end;
}

export function isRegistrationClosed(workshop: ScheduledWorkshop, now = Date.now()) {
  const start = Date.parse(workshop.dateTime);
  return Boolean(workshop.cancelled || workshop.registrationClosed) || !Number.isFinite(start) || now >= start;
}
