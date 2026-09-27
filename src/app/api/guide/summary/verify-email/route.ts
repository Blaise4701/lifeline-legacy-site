import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createEmailChallenge,
  guideEmailConfigured,
  sendGuideEmail,
  validGuideEmail,
  verifyGuideTurnstile,
} from "@/lib/lifeline-guide-email";
import { guideGatewayReady } from "@/lib/lifeline-guide-rate-limit";
import { GuideBodyTooLargeError, readGuideJson } from "@/lib/lifeline-guide-request";
import { verifyGuideSummary } from "@/lib/lifeline-guide-summary-token";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!guideGatewayReady() || !guideEmailConfigured()) {
    return NextResponse.json({ error: "Email delivery is not available yet." }, { status: 503 });
  }
  let body: unknown;
  try {
    body = await readGuideJson(request, 5_000);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: error instanceof GuideBodyTooLargeError ? 413 : 400 },
    );
  }

  const value = body && typeof body === "object"
    ? body as { summaryToken?: unknown; email?: unknown; turnstileToken?: unknown }
    : {};
  const email = validGuideEmail(value.email);
  const summary = typeof value.summaryToken === "string"
    ? verifyGuideSummary(value.summaryToken, process.env.GUIDE_SUMMARY_SIGNING_SECRET || "")
    : null;
  if (!summary || !email) {
    return NextResponse.json({ error: "The summary expired. Create a new summary and try again." }, { status: 400 });
  }

  if (!await verifyGuideTurnstile(value.turnstileToken)) {
    return NextResponse.json({ error: "Please complete the email security check again." }, { status: 403 });
  }

  const { code, challengeToken } = createEmailChallenge(
    email, summary.id, process.env.GUIDE_SUMMARY_SIGNING_SECRET || "",
  );
  const emailHash = createHash("sha256").update(email).digest("hex").slice(0, 16);

  try {
    const sent = await sendGuideEmail(
      email,
      "Confirm your Lifeline Guide email",
      `Your Lifeline Guide confirmation code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
      `guide-code-${summary.id}-${emailHash}-${createHash("sha256").update(challengeToken).digest("hex").slice(0, 12)}`,
    );
    if (!sent) throw new Error("Email provider returned an error");
    return NextResponse.json({ challengeToken }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Lifeline Guide verification delivery failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "The confirmation email could not be sent. Please try again." }, { status: 502 });
  }
}
