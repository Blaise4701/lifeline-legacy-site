import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

type SummaryPayload = {
  version: 1;
  id: string;
  expiresAt: number;
  summary: string;
};

const TEN_MINUTES = 10 * 60 * 1000;

export function signGuideSummary(summary: string, secret: string, now = Date.now()): string {
  if (secret.length < 32 || !summary || summary.length > 1400) {
    throw new Error("Summary signing is not configured");
  }

  const payload: SummaryPayload = {
    version: 1,
    id: randomUUID(),
    expiresAt: now + TEN_MINUTES,
    summary,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyGuideSummary(
  token: string,
  secret: string,
  now = Date.now(),
): SummaryPayload | null {
  if (secret.length < 32 || token.length > 3000) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part))) {
    return null;
  }

  const [encoded, signature] = parts;
  const supplied = Buffer.from(signature, "base64url");
  const expected = createHmac("sha256", secret).update(encoded).digest();
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload || typeof payload !== "object") return null;
    const value = payload as Partial<SummaryPayload>;
    if (
      value.version !== 1 ||
      typeof value.id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(value.id) ||
      typeof value.summary !== "string" ||
      !value.summary ||
      value.summary.length > 1400 ||
      typeof value.expiresAt !== "number" ||
      value.expiresAt <= now ||
      value.expiresAt > now + TEN_MINUTES
    ) {
      return null;
    }

    return value as SummaryPayload;
  } catch {
    return null;
  }
}
