import { site } from "@/lib/site-data";
export { createEmailChallenge, verifyEmailChallenge } from "@/lib/lifeline-guide-email-challenge";

const TEST_TURNSTILE_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export function validGuideEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : null;
}

export async function verifyGuideTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || !token || token.length > 2048) return false;
  if (process.env.VERCEL_ENV === "production" && TEST_TURNSTILE_SECRETS.has(secret)) return false;
  const allowedHostnames = (process.env.GUIDE_TURNSTILE_HOSTNAMES || "")
    .split(",").map((hostname) => hostname.trim().toLowerCase()).filter(Boolean);
  if (!allowedHostnames.length) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean; hostname?: string; action?: string };
    const testKey = TEST_TURNSTILE_SECRETS.has(secret);
    const correctAction = result.action === "guide-email" ||
      (testKey && process.env.VERCEL_ENV !== "production" && result.action === "test");
    return Boolean(result.success && correctAction && result.hostname && allowedHostnames.includes(result.hostname.toLowerCase()));
  } catch {
    return false;
  }
}

export function guideEmailConfigured(): boolean {
  if (process.env.VERCEL_ENV === "production" && TEST_TURNSTILE_SECRETS.has(process.env.TURNSTILE_SECRET_KEY || "")) {
    return false;
  }
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.GUIDE_SUMMARY_FROM &&
    process.env.GUIDE_SUMMARY_SIGNING_SECRET &&
    process.env.GUIDE_SUMMARY_SIGNING_SECRET.length >= 32 &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.GUIDE_TURNSTILE_HOSTNAMES,
  );
}

export async function sendGuideEmail(to: string, subject: string, text: string, idempotencyKey: string): Promise<boolean> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ from: process.env.GUIDE_SUMMARY_FROM, to: [to], subject, text }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    console.error("Lifeline Guide email delivery failed", response.status);
  }
  return response.ok;
}

export function guideOwnerEmail(): string {
  // The recipient is controlled by the server, never a client-provided address.
  return validGuideEmail(process.env.GUIDE_SUMMARY_RECIPIENT) || site.email;
}
