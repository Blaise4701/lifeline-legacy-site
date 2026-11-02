import { POST as registerEvent } from "@/app/api/lead/route";
import { workshops } from "@/lib/site-data";
import { isRegistrationClosed } from "@/lib/workshop-status";
import { normalizeVoiceRegistration, validVoiceCredential, VOICE_EVENT_ID } from "@/lib/voice-event-registration";

export const runtime = "nodejs";

// SHA-256 verifier only. The random 256-bit credential lives in Ella's action,
// never in source. This credential is restricted to the single event below.
const credentialDigest = "a8156a269b58fe705fca10b1e7f0fcaedeee988e1e411fc7ce92ff5cf4fe12f1";
const MAX_BYTES = 20_480;

export async function POST(request: Request) {
  const reply = (data: object, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
  if (!validVoiceCredential(request.headers.get("authorization"), credentialDigest)) {
    return reply({ ok: false, registered: false, message: "Registration action is not authorized. Offer the registration link or staff assistance." }, 401);
  }
  const workshop = workshops.find((event) => event.id === VOICE_EVENT_ID);
  if (!workshop || isRegistrationClosed(workshop)) {
    return reply({ ok: false, registered: false, message: "Registration has closed. Offer staff assistance; do not promise a seat." }, 422);
  }
  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) { await reader.cancel(); return reply({ ok: false, registered: false, message: "Registration request is too large." }, 413); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return reply({ ok: false, registered: false, message: "Registration details could not be read. Offer the registration link." }, 400); }
  const submission = normalizeVoiceRegistration(raw);
  if (!submission) return reply({ ok: false, registered: false, message: "Confirm communication permissions and guest details before trying again." }, 400);
  const validationOnly = new URL(request.url).searchParams.get("mode") === "validate";
  // The existing handler validates the entire payload before its honeypot exit.
  // Validation mode exercises that validation without creating contacts or messages.
  const response = await registerEvent(new Request(new URL("/api/lead", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...submission, ...(validationOnly ? { website: "voice-validation-only" } : {}) }),
  }));
  const result = await response.json() as { ok?: boolean; message?: string; alreadyRegistered?: boolean };
  if (!response.ok || !result.ok) return reply({ ...result, registered: false }, response.status);
  if (validationOnly) return reply({ ok: true, registered: false, validationOnly: true, message: "Validation passed. No seat was reserved and no communications were sent." });
  return reply({ ok: true, registered: true, alreadyRegistered: result.alreadyRegistered === true, eventId: VOICE_EVENT_ID, message: result.alreadyRegistered ? "The caller already has a reservation for November 21 at Harrington Library." : "The caller's seat is reserved for November 21, 2026, 10:00 AM to 12:30 PM Central, at Harrington Library, 1501 18th St, Plano, TX 75074." }, response.status);
}
