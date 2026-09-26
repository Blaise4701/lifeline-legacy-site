import { NextResponse } from "next/server";
import { recordGuideEvent } from "@/lib/lifeline-guide-repository";
import { claimGuideRequest } from "@/lib/lifeline-guide-rate-limit";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "guide_opened",
  "suggested_step_clicked",
  "checkup_started",
  "continuity_review_started",
]);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const value = body as {
    sessionId?: unknown;
    eventType?: unknown;
    eventValue?: unknown;
    pagePath?: unknown;
  };

  const sessionId =
    typeof value.sessionId === "string" ? value.sessionId.slice(0, 100) : "";
  const eventType =
    typeof value.eventType === "string" ? value.eventType : "";

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId) || !allowedEvents.has(eventType)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const limit = await claimGuideRequest(request, "event");
  if (limit !== "allowed") {
    return NextResponse.json(
      { ok: false },
      { status: limit === "limited" ? 429 : 503 },
    );
  }

  try {
    await recordGuideEvent({
      sessionId,
      eventType: eventType as
        | "guide_opened"
        | "suggested_step_clicked"
        | "checkup_started"
        | "continuity_review_started",
      eventValue:
        typeof value.eventValue === "string"
          ? value.eventValue.slice(0, 300)
          : undefined,
      pagePath:
        typeof value.pagePath === "string"
          ? value.pagePath.slice(0, 300)
          : undefined,
    });
  } catch (error) {
    console.error(
      "Lifeline Guide event logging failed",
      error instanceof Error ? error.name : "UnknownError",
    );
  }

  return NextResponse.json({ ok: true });
}
