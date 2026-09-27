import { NextResponse } from "next/server";
import {
  guideEmailConfigured,
  guideOwnerEmail,
  sendGuideEmail,
  validGuideEmail,
  verifyEmailChallenge,
  verifyGuideTurnstile,
} from "@/lib/lifeline-guide-email";
import { guideGatewayReady } from "@/lib/lifeline-guide-rate-limit";
import { GuideBodyTooLargeError, readGuideJson } from "@/lib/lifeline-guide-request";
import { verifyGuideSummary } from "@/lib/lifeline-guide-summary-token";

export const runtime = "nodejs";

type Delivery = "client" | "llfg" | "both";

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
    ? body as {
      summaryToken?: unknown;
      delivery?: unknown;
      email?: unknown;
      challengeToken?: unknown;
      code?: unknown;
      turnstileToken?: unknown;
      shareConsent?: unknown;
    }
    : {};
  const summary = typeof value.summaryToken === "string"
    ? verifyGuideSummary(value.summaryToken, process.env.GUIDE_SUMMARY_SIGNING_SECRET || "")
    : null;
  const delivery: Delivery | null = ["client", "llfg", "both"].includes(String(value.delivery))
    ? value.delivery as Delivery
    : null;
  if (!summary || !delivery) {
    return NextResponse.json({ error: "The summary expired. Create a new summary and try again." }, { status: 400 });
  }
  if ((delivery === "llfg" || delivery === "both") && value.shareConsent !== true) {
    return NextResponse.json({ error: "Please approve sharing the summary with Lifeline Legacy." }, { status: 400 });
  }

  const email = delivery === "llfg" ? null : validGuideEmail(value.email);
  if (delivery !== "llfg") {
    if (
      !email ||
      typeof value.challengeToken !== "string" ||
      typeof value.code !== "string" ||
      !verifyEmailChallenge(
        value.challengeToken, value.code, email, summary.id,
        process.env.GUIDE_SUMMARY_SIGNING_SECRET || "",
      )
    ) {
      return NextResponse.json({ error: "Enter the current email code to confirm your address." }, { status: 403 });
    }
  } else if (!await verifyGuideTurnstile(value.turnstileToken)) {
    return NextResponse.json({ error: "Please complete the email security check again." }, { status: 403 });
  }

  const delivered: Delivery[] = [];
  const note = "Educational summary only. This is not individualized financial, legal, tax, or investment advice.";

  try {
    if (email) {
      const sent = await sendGuideEmail(
        email,
        "Your Lifeline Guide summary",
        `Your Lifeline Guide summary\n\n${summary.summary}\n\n${note}\n\nYou requested this copy. No chat transcript was attached.`,
        `guide-summary-client-${summary.id}`,
      );
      if (!sent) throw new Error("Client email delivery failed");
      delivered.push("client");
    }

    if (delivery !== "client") {
      const contactLine = delivery === "both" && email
        ? `\nVerified visitor email, shared with consent: ${email}\n`
        : "\nNo visitor contact information was shared.\n";
      const sent = await sendGuideEmail(
        guideOwnerEmail(),
        "Lifeline Guide visitor summary",
        `A visitor chose to share this Lifeline Guide summary.\n\n${summary.summary}\n\n${note}${contactLine}\nNo chat transcript was included.`,
        `guide-summary-owner-${delivery}-${summary.id}`,
      );
      if (!sent) throw new Error("Owner email delivery failed");
      delivered.push("llfg");
    }

    return NextResponse.json({ delivered }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Lifeline Guide summary delivery failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json(
      { delivered, error: delivered.length ? "One copy was sent. The other could not be delivered; please try again." : "The summary email could not be sent. Please try again." },
      { status: 502 },
    );
  }
}
