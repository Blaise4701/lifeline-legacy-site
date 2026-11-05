import { icsFor, isRieSession } from "@/lib/retirement-income-explained";

// Add-to-calendar file for one session. Linked from the thank-you page and the
// GHL confirmation email: /retirement-income-explained/calendar/{workshop|seminar|both}
export async function GET(_request: Request, { params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  if (!isRieSession(session)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(icsFor(session), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="retirement-income-explained-${session}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export function generateStaticParams() {
  return [{ session: "workshop" }, { session: "seminar" }, { session: "both" }];
}
