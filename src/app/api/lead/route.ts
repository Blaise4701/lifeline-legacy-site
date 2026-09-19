import { licensedStates, states, workshops } from "@/lib/site-data";

const GHL_API_ORIGIN = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const MAX_BODY_BYTES = 16_384;

const pathways = ["Retirement", "Family", "Business"] as const;
const summaryLabels = [
  "A foundation is in place",
  "Some pieces may need coordination",
  "Worth exploring further",
  "Checkup not completed",
] as const;
const learningInterests = [
  "How income continues if things change",
  "How my accounts, taxes, and income fit together",
  "How to pass on what I’ve built",
] as const;

type Pathway = (typeof pathways)[number];
type SummaryLabel = (typeof summaryLabels)[number];
type LearningInterest = (typeof learningInterests)[number];

type ReviewSubmission = {
  type: "continuity-review";
  firstName?: string;
  email: string;
  state: string;
  pathway: Pathway;
  summaries: {
    continuity: SummaryLabel;
    certainty: SummaryLabel;
    legacy: SummaryLabel;
  };
  learningInterest: LearningInterest;
  consent: boolean;
  website?: string;
};

type EventSubmission = {
  type: "event-registration";
  firstName?: string;
  email: string;
  state: string;
  eventId: string;
  consent: boolean;
  website?: string;
};

type LeadSubmission = ReviewSubmission | EventSubmission;

type GhlUpsertResponse = {
  contact?: {
    id?: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function includesValue<const T extends readonly string[]>(values: T, value: string): value is T[number] {
  return values.includes(value);
}

function parseSubmission(value: unknown): LeadSubmission | null {
  if (!isRecord(value)) return null;

  const type = cleanText(value.type, 32);
  const firstName = cleanText(value.firstName, 80);
  const email = cleanText(value.email, 254).toLowerCase();
  const state = cleanText(value.state, 40);
  const website = cleanText(value.website, 200);
  const consent = value.consent === true;

  if (!isEmail(email) || !includesValue(states, state) || !consent) return null;

  if (type === "continuity-review") {
    const pathway = cleanText(value.pathway, 24);
    const learningInterest = cleanText(value.learningInterest, 100);
    const summaries = value.summaries;

    if (
      !includesValue(pathways, pathway) ||
      !includesValue(learningInterests, learningInterest) ||
      !isRecord(summaries)
    ) {
      return null;
    }

    const continuity = cleanText(summaries.continuity, 60);
    const certainty = cleanText(summaries.certainty, 60);
    const legacy = cleanText(summaries.legacy, 60);

    if (
      !includesValue(summaryLabels, continuity) ||
      !includesValue(summaryLabels, certainty) ||
      !includesValue(summaryLabels, legacy)
    ) {
      return null;
    }

    return {
      type,
      firstName,
      email,
      state,
      pathway,
      summaries: { continuity, certainty, legacy },
      learningInterest,
      consent,
      website,
    };
  }

  if (type === "event-registration") {
    const eventId = cleanText(value.eventId, 80);
    if (!workshops.some((workshop) => workshop.id === eventId)) return null;

    return { type, firstName, email, state, eventId, consent, website };
  }

  return null;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestHost = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

    if (!requestHost) return originUrl.origin === new URL(request.url).origin;
    if (originUrl.host !== requestHost) return false;

    return !forwardedProtocol || originUrl.protocol === `${forwardedProtocol}:`;
  } catch {
    return false;
  }
}

async function ghlRequest(
  path: string,
  token: string,
  body: unknown,
  method: "POST" | "DELETE" = "POST",
) {
  return fetch(`${GHL_API_ORIGIN}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Version: GHL_API_VERSION,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ ok: false, message: "Request origin was not accepted." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, message: "Request was too large." }, { status: 413 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Request could not be read." }, { status: 400 });
  }

  const submission = parseSubmission(rawBody);
  if (!submission) {
    return Response.json({ ok: false, message: "Check the form and try again." }, { status: 400 });
  }

  // Quietly accept likely bot submissions without sending them to the CRM.
  if (submission.website) {
    return Response.json({ ok: true });
  }

  if (
    submission.type === "continuity-review" &&
    !(licensedStates as readonly string[]).includes(submission.state)
  ) {
    return Response.json(
      { ok: false, message: "A Continuity Review is not available in that state." },
      { status: 422 },
    );
  }

  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    console.error("GHL lead capture is missing required server configuration.");
    return Response.json(
      { ok: false, message: "Online requests are temporarily unavailable. Please call or email LLFG." },
      { status: 503 },
    );
  }

  const customFields =
    submission.type === "continuity-review"
      ? [
          { key: "llfg_selected_pathway", fieldValue: submission.pathway },
          { key: "llfg_continuity_summary", fieldValue: submission.summaries.continuity },
          { key: "llfg_certainty_summary", fieldValue: submission.summaries.certainty },
          { key: "llfg_legacy_summary", fieldValue: submission.summaries.legacy },
          { key: "llfg_learning_interest", fieldValue: submission.learningInterest },
        ]
      : (() => {
          const workshop = workshops.find((item) => item.id === submission.eventId)!;
          const eventInterest = `${workshop.title} — ${workshop.date} at ${workshop.time} — ${workshop.location}`;

          return [
            { key: "llfg_selected_pathway", fieldValue: "Retirement" },
            { key: "llfg_learning_interest", fieldValue: eventInterest },
          ];
        })();

  const contactBody = {
    ...(submission.firstName ? { firstName: submission.firstName } : {}),
    email: submission.email,
    locationId,
    state: submission.state,
    country: "US",
    source: "LLFG Website",
    customFields,
  };

  try {
    const upsertResponse = await ghlRequest("/contacts/upsert", token, contactBody);
    if (!upsertResponse.ok) {
      console.error("GHL contact upsert failed.", { status: upsertResponse.status });
      return Response.json(
        { ok: false, message: "Your request could not be saved. Please try again or contact LLFG directly." },
        { status: 502 },
      );
    }

    const upsertResult = (await upsertResponse.json()) as GhlUpsertResponse;
    const contactId = upsertResult.contact?.id;
    if (!contactId) {
      console.error("GHL contact upsert returned no contact identifier.");
      return Response.json(
        { ok: false, message: "Your request could not be saved. Please try again or contact LLFG directly." },
        { status: 502 },
      );
    }

    const submissionTag =
      submission.type === "continuity-review"
        ? "llfg-continuity-review-request"
        : "llfg-event-registration";

    // Reset the submission tag so a later request from the same contact can
    // trigger a re-entry-enabled GHL workflow again. The source tag stays put.
    const tagResetResponse = await ghlRequest(
      `/contacts/${contactId}/tags`,
      token,
      { tags: [submissionTag] },
      "DELETE",
    );
    if (!tagResetResponse.ok && tagResetResponse.status !== 404) {
      console.error("GHL submission-tag reset failed.", { status: tagResetResponse.status });
    }

    const tagResponse = await ghlRequest(`/contacts/${contactId}/tags`, token, {
      tags: ["llf - website", submissionTag],
    });

    if (!tagResponse.ok) {
      console.error("GHL contact tagging failed.", { status: tagResponse.status });
      return Response.json(
        { ok: false, message: "Your request could not be completed. Please try again or contact LLFG directly." },
        { status: 502 },
      );
    }

    return Response.json(
      {
        ok: true,
        bookingUrl:
          submission.type === "continuity-review"
            ? process.env.GHL_CONTINUITY_CALENDAR_URL ?? null
            : null,
      },
      { status: 201 },
    );
  } catch (error) {
    const reason = error instanceof Error && error.name === "TimeoutError" ? "timeout" : "network";
    console.error("GHL lead capture request failed.", { reason });
    return Response.json(
      { ok: false, message: "Your request could not be saved. Please try again or contact LLFG directly." },
      { status: 502 },
    );
  }
}
