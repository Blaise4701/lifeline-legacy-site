import { createHmac } from "node:crypto";
import { isIP } from "node:net";

type RateLimitResult = "allowed" | "limited" | "unavailable";

// Production requests must claim a database bucket before spending OpenAI tokens.
// Preview can run without the database while the integration is being configured.
export async function claimGuideRequest(
  request: Request,
  kind: "chat" | "event" = "chat",
): Promise<RateLimitResult> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const secret = process.env.GUIDE_RATE_LIMIT_SECRET;

  if (!url || !key || !secret || secret.length < 32) {
    return process.env.VERCEL_ENV === "production" ? "unavailable" : "allowed";
  }

  // Vercel overwrites this header with the caller's IP on direct deployments.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (!ip || !isIP(ip)) return "unavailable";

  const identity = createHmac("sha256", secret).update(ip).digest("hex");
  const now = Date.now();
  const minuteKey = `${identity}:${kind}:m:${Math.floor(now / 60_000)}`;
  const dayKey = `${identity}:${kind}:d:${Math.floor(now / 86_400_000)}`;

  try {
    const response = await fetch(`${url}/rest/v1/rpc/claim_guide_request`, {
      method: "POST",
      headers: {
        apikey: key,
        ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_minute_key: minuteKey, p_day_key: dayKey, p_event: kind === "event" }),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Lifeline Guide limiter unavailable", response.status);
      return "unavailable";
    }

    const claimed: unknown = await response.json();
    if (claimed === true) return "allowed";
    if (claimed === false) return "limited";
    return "unavailable";
  } catch (error) {
    console.error(
      "Lifeline Guide limiter error",
      error instanceof Error ? error.name : "UnknownError",
    );
    return "unavailable";
  }
}
