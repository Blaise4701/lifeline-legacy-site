import { createHash, timingSafeEqual } from "node:crypto";

export const VOICE_EVENT_ID = "plano-november-21-catch-up";

export function validVoiceCredential(header: string | null, digest: string) {
  if (!header?.startsWith("Bearer ") || header.length > 200) return false;
  const actual = createHash("sha256").update(header.slice(7)).digest();
  const expected = Buffer.from(digest, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function permission(value: unknown): boolean | null {
  if (value === true || value === "yes") return true;
  if (value === false || value === "no") return false;
  return null;
}

// All fields are still validated by the shared event registration handler.
export function normalizeVoiceRegistration(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const consent = permission(body.consent);
  const smsConsent = permission(body.smsConsent);
  if (consent === null || smsConsent === null) return null;
  let guests: unknown;
  try { guests = typeof body.guestsJson === "string" ? JSON.parse(body.guestsJson) : null; }
  catch { return null; }
  if (!Array.isArray(guests) || guests.length > 3) return null;
  return {
    type: "event-registration",
    eventId: VOICE_EVENT_ID,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    state: body.state,
    age50Plus: body.age50Plus,
    industryProfessional: body.industryProfessional,
    guestCount: String(body.guestCount ?? ""),
    guests,
    consent,
    smsConsent,
    website: "",
  };
}
