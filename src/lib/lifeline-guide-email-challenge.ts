import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

type EmailChallenge = {
  version: 1;
  summaryId: string;
  email: string;
  expiresAt: number;
  codeHash: string;
};

const TEN_MINUTES = 10 * 60 * 1000;

export function createEmailChallenge(email: string, summaryId: string, secret: string, now = Date.now()) {
  if (secret.length < 32) throw new Error("Email verification is not configured");
  const code = randomInt(0, 100_000_000).toString().padStart(8, "0");
  const codeHash = createHmac("sha256", secret).update(`${summaryId}:${email}:${code}`).digest("base64url");
  const challenge: EmailChallenge = { version: 1, summaryId, email, expiresAt: now + TEN_MINUTES, codeHash };
  const encoded = Buffer.from(JSON.stringify(challenge)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return { code, challengeToken: `${encoded}.${signature}` };
}

export function verifyEmailChallenge(
  token: string,
  code: string,
  email: string,
  summaryId: string,
  secret: string,
  now = Date.now(),
): boolean {
  if (secret.length < 32 || token.length > 1000 || !/^\d{8}$/.test(code)) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part))) return false;

  const [encoded, signature] = parts;
  const supplied = Buffer.from(signature, "base64url");
  const expected = createHmac("sha256", secret).update(encoded).digest();
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;

  try {
    const value: unknown = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!value || typeof value !== "object") return false;
    const challenge = value as Partial<EmailChallenge>;
    if (
      challenge.version !== 1 ||
      challenge.summaryId !== summaryId ||
      challenge.email !== email ||
      typeof challenge.expiresAt !== "number" ||
      challenge.expiresAt <= now ||
      challenge.expiresAt > now + TEN_MINUTES ||
      typeof challenge.codeHash !== "string"
    ) return false;

    const actual = createHmac("sha256", secret).update(`${summaryId}:${email}:${code}`).digest();
    const wanted = Buffer.from(challenge.codeHash, "base64url");
    return actual.length === wanted.length && timingSafeEqual(actual, wanted);
  } catch {
    return false;
  }
}
