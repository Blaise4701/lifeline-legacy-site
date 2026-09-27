import { licensedStates, states, workshops } from "@/lib/site-data";

const GHL_API_ORIGIN = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const MAX_BODY_BYTES = 20_480;

class LeadBodyTooLargeError extends Error {}

async function readLeadJson(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)) {
    throw new LeadBodyTooLargeError("Lead request body is too large");
  }

  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing JSON body");

  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new LeadBodyTooLargeError("Lead request body is too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

const pathways = ["Retirement", "Family", "Business"] as const;
const summaryLabels = [
  "A foundation is in place",
  "Some pieces may need coordination",
  "Worth exploring further",
] as const;
const learningInterests = [
  "How income continues if things change",
  "How my accounts, taxes, and income fit together",
  "How to pass on what I’ve built",
] as const;

const reviewStages = [
  "More than 10 years from retirement",
  "6–10 years from retirement",
  "Within 5 years of retirement",
  "Retiring now",
  "Already retired",
  "Growing or changing family responsibilities",
  "Reviewing existing protection",
  "Updating beneficiaries or documents",
  "A recent life or income change",
  "General planning and organization",
  "Actively growing the business",
  "Reviewing owner and key-person protection",
  "Preparing for succession or sale",
  "Preparing for owner retirement",
  "A recent ownership or leadership change",
] as const;

const reviewConcerns = [
  "Creating dependable retirement income",
  "Social Security or pension timing",
  "Coordinating several retirement accounts",
  "Taxes and withdrawal order",
  "Healthcare or long-term care",
  "Survivor income and legacy",
  "Keeping income flowing if life changes",
  "Protecting dependents and obligations",
  "Coordinating insurance and workplace benefits",
  "Beneficiaries and estate documents",
  "College or family goals",
  "Creating a clearer legacy plan",
  "Owner interruption",
  "Key-person risk",
  "Buy-sell or succession planning",
  "Business obligations and cash flow",
  "Owner retirement income",
  "Coordinating business and family legacy",
] as const;

const reviewPlanStatuses = [
  "Yes, and it is current",
  "Yes, but it needs updating",
  "Partly",
  "No",
  "I’m not sure",
  "Some pieces are written down",
  "Mostly informal",
] as const;

type Pathway = (typeof pathways)[number];
type SummaryLabel = (typeof summaryLabels)[number];
type LearningInterest = (typeof learningInterests)[number];

type Attribution = {
  source: string;
  campaign: string;
  eventId: string;
  landingPath: string;
  referrer: string;
};

type ReviewCommon = {
  firstName: string;
  email: string;
  phone: string;
  state: string;
  pathway: Pathway;
  emailConsent: boolean;
  smsConsent: boolean;
  marketingEmailConsent: boolean;
  website: string;
  attribution: Attribution;
};

type ReviewStartSubmission = ReviewCommon & {
  type: "continuity-review-start";
};

type ReviewCompleteSubmission = ReviewCommon & {
  type: "continuity-review-complete";
  stage: (typeof reviewStages)[number];
  primaryConcern: (typeof reviewConcerns)[number];
  planStatus: (typeof reviewPlanStatuses)[number];
  whatWouldHelp: string;
  shareCheckup: boolean;
  checkup: {
    pathway: Pathway;
    summaries: {
      continuity: SummaryLabel;
      certainty: SummaryLabel;
      legacy: SummaryLabel;
    };
    learningInterest: LearningInterest;
  } | null;
};

type EventSubmission = {
  type: "event-registration";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  guestCount: "0" | "1" | "2" | "3";
  guests: Array<{
    firstName: string;
    lastName: string;
    relationship: string;
  }>;
  age50Plus: "yes" | "no" | "prefer-not-to-say";
  industryProfessional: "yes" | "no";
  eventId: string;
  consent: boolean;
  smsConsent: boolean;
  website: string;
};

type LeadSubmission = ReviewStartSubmission | ReviewCompleteSubmission | EventSubmission;

type GhlUpsertResponse = {
  contact?: {
    id?: string;
  };
};

type GhlTagsResponse = { tags?: string[] };

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

function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^[+\d().\s-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
}

function includesValue<const T extends readonly string[]>(values: T, value: string): value is T[number] {
  return values.includes(value);
}

function parseAttribution(value: unknown): Attribution {
  if (!isRecord(value)) {
    return { source: "website", campaign: "", eventId: "", landingPath: "", referrer: "" };
  }

  return {
    source: cleanText(value.source, 60),
    campaign: cleanText(value.campaign, 100),
    eventId: cleanText(value.eventId, 80),
    landingPath: cleanText(value.landingPath, 160),
    referrer: cleanText(value.referrer, 240),
  };
}

function parseReviewCommon(value: Record<string, unknown>): ReviewCommon | null {
  const firstName = cleanText(value.firstName, 80);
  const email = cleanText(value.email, 254).toLowerCase();
  const phone = cleanText(value.phone, 40);
  const state = cleanText(value.state, 40);
  const pathway = cleanText(value.pathway, 24);
  const website = cleanText(value.website, 200);
  const emailConsent = value.emailConsent === true;
  const smsConsent = value.smsConsent === true;
  const marketingEmailConsent = value.marketingEmailConsent === true;

  if (
    !firstName ||
    !isEmail(email) ||
    !includesValue(states, state) ||
    !includesValue(pathways, pathway) ||
    !emailConsent
  ) {
    return null;
  }

  return {
    firstName,
    email,
    phone,
    state,
    pathway,
    emailConsent,
    smsConsent,
    marketingEmailConsent,
    website,
    attribution: parseAttribution(value.attribution),
  };
}

function parseCheckup(value: unknown): ReviewCompleteSubmission["checkup"] {
  if (!isRecord(value)) return null;

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
    pathway,
    summaries: { continuity, certainty, legacy },
    learningInterest,
  };
}

function parseSubmission(value: unknown): LeadSubmission | null {
  if (!isRecord(value)) return null;

  const type = cleanText(value.type, 40);

  if (type === "continuity-review-start") {
    const common = parseReviewCommon(value);
    return common ? { type, ...common } : null;
  }

  if (type === "continuity-review-complete") {
    const common = parseReviewCommon(value);
    if (!common) return null;

    const stage = cleanText(value.stage, 100);
    const primaryConcern = cleanText(value.primaryConcern, 120);
    const planStatus = cleanText(value.planStatus, 80);
    const whatWouldHelp = cleanText(value.whatWouldHelp, 500);
    const shareCheckup = value.shareCheckup === true;
    const checkup = shareCheckup ? parseCheckup(value.checkup) : null;

    if (
      !includesValue(reviewStages, stage) ||
      !includesValue(reviewConcerns, primaryConcern) ||
      !includesValue(reviewPlanStatuses, planStatus) ||
      (shareCheckup && !checkup)
    ) {
      return null;
    }

    return {
      type,
      ...common,
      stage,
      primaryConcern,
      planStatus,
      whatWouldHelp,
      shareCheckup,
      checkup,
    };
  }

  if (type === "event-registration") {
    const firstName = cleanText(value.firstName, 80);
    const lastName = cleanText(value.lastName, 80);
    const email = cleanText(value.email, 254).toLowerCase();
    const phone = cleanText(value.phone, 40);
    const state = cleanText(value.state, 40);
    const guestCount = cleanText(value.guestCount, 1);
    const rawGuests = Array.isArray(value.guests) ? value.guests : [];
    const guests = rawGuests.map((guest) => {
      if (!isRecord(guest)) return { firstName: "", lastName: "", relationship: "" };
      return {
        firstName: cleanText(guest.firstName, 80),
        lastName: cleanText(guest.lastName, 80),
        relationship: cleanText(guest.relationship, 40),
      };
    });
    const age50Plus = cleanText(value.age50Plus, 24);
    const industryProfessional = cleanText(value.industryProfessional, 3);
    const eventId = cleanText(value.eventId, 80);
    const website = cleanText(value.website, 200);
    const consent = value.consent === true;
    const smsConsent = value.smsConsent === true;

    if (
      !firstName ||
      !lastName ||
      !isEmail(email) ||
      !isPhone(phone) ||
      !includesValue(states, state) ||
      !includesValue(["0", "1", "2", "3"] as const, guestCount) ||
      guests.length !== Number(guestCount) ||
      guests.some((guest) =>
        !guest.firstName || !guest.lastName ||
        !includesValue(["", "Spouse/Partner", "Family member", "Friend", "Other"] as const, guest.relationship)
      ) ||
      !includesValue(["yes", "no", "prefer-not-to-say"] as const, age50Plus) ||
      !includesValue(["yes", "no"] as const, industryProfessional) ||
      !workshops.some((workshop) => workshop.id === eventId) ||
      !consent
    ) {
      return null;
    }

    return {
      type,
      firstName,
      lastName,
      email,
      phone,
      state,
      guestCount,
      guests,
      age50Plus,
      industryProfessional,
      eventId,
      consent,
      smsConsent,
      website,
    };
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

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function normalizedSource(value: string) {
  const source = value.toLowerCase();

  if (source.includes("checkup")) return "checkup";
  if (source.includes("retirement")) return "retirement";
  if (source.includes("family") || source.includes("estate")) return "family";
  if (source.includes("business")) return "business";
  if (source.includes("seminar") || source.includes("workshop") || source.includes("event")) return "seminar";
  if (source.includes("email")) return "email";
  if (source.includes("social") || source.includes("facebook") || source.includes("instagram")) return "social";
  if (source.includes("organic") || source.includes("google")) return "organic";
  if (source.includes("referral")) return "referral";
  if (source.includes("direct")) return "direct";
  if (source.includes("home")) return "homepage";
  return "website";
}

function reviewTags(submission: ReviewCommon) {
  const source = normalizedSource(submission.attribution.source || "website");
  const tags = [
    "llf - website",
    `llfg-path-${submission.pathway.toLowerCase()}`,
    `llfg-source-${source}`,
    "llfg-email-service-consent",
  ];

  if (submission.phone && submission.smsConsent) tags.push("llfg-sms-service-consent");
  if (submission.marketingEmailConsent) tags.push("llfg-email-education-consent");

  const eventId = submission.attribution.eventId;
  if (eventId && workshops.some((workshop) => workshop.id === eventId)) {
    tags.push(`llfg-event-${slug(eventId)}`);
  }

  return tags;
}

async function resetAndAddTags(
  contactId: string,
  token: string,
  tags: string[],
  resetTags: string[] = [],
) {
  if (resetTags.length) {
    const resetResponse = await ghlRequest(
      `/contacts/${contactId}/tags`,
      token,
      { tags: resetTags },
      "DELETE",
    );

    if (!resetResponse.ok && resetResponse.status !== 404) {
      console.error("GHL tag reset failed.", { status: resetResponse.status });
    }
  }

  const tagResponse = await ghlRequest(`/contacts/${contactId}/tags`, token, { tags });
  return tagResponse.ok;
}

async function addEventTags(contactId: string, token: string, tags: string[]) {
  const response = await ghlRequest(`/contacts/${contactId}/tags`, token, { tags });
  if (!response.ok) {
    console.error("GHL event tagging failed.", { status: response.status });
    return null;
  }
  const result = (await response.json()) as GhlTagsResponse;
  return Array.isArray(result.tags) ? result.tags : null;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ ok: false, message: "Request origin was not accepted." }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await readLeadJson(request);
  } catch (error) {
    return error instanceof LeadBodyTooLargeError
      ? Response.json({ ok: false, message: "Request was too large." }, { status: 413 })
      : Response.json({ ok: false, message: "Request could not be read." }, { status: 400 });
  }

  const submission = parseSubmission(rawBody);
  if (!submission) {
    return Response.json({ ok: false, message: "Check the form and try again." }, { status: 400 });
  }

  if (submission.website) {
    return Response.json({ ok: true });
  }

  if (submission.type === "event-registration") {
    const workshop = workshops.find((item) => item.id === submission.eventId)!;
    if (Date.now() >= Date.parse(workshop.dateTime)) {
      return Response.json(
        { ok: false, message: "Registration for this event has closed. Please choose another session." },
        { status: 422 },
      );
    }
  }

  if (
    submission.type !== "event-registration" &&
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

  let customFields: Array<{ key: string; fieldValue: string }> = [];
  let source = "LLFG Website";

  if (submission.type === "event-registration") {
    customFields = [
      { key: "llfg_selected_pathway", fieldValue: "Retirement" },
    ];
    source = "LLFG Website · Event Registration";
  } else {
    customFields = [
      { key: "llfg_selected_pathway", fieldValue: submission.pathway },
    ];
    source = `LLFG Website · ${normalizedSource(submission.attribution.source || "website")}`;

    if (submission.type === "continuity-review-complete") {
      customFields.push({
        key: "llfg_learning_interest",
        fieldValue: submission.primaryConcern,
      });

      if (submission.shareCheckup && submission.checkup) {
        customFields.push(
          { key: "llfg_continuity_summary", fieldValue: submission.checkup.summaries.continuity },
          { key: "llfg_certainty_summary", fieldValue: submission.checkup.summaries.certainty },
          { key: "llfg_legacy_summary", fieldValue: submission.checkup.summaries.legacy },
        );
      }
    }
  }

  const contactBody = {
    ...(submission.firstName ? { firstName: submission.firstName } : {}),
    ...(submission.type === "event-registration" && submission.lastName ? { lastName: submission.lastName } : {}),
    ...(submission.phone ? { phone: submission.phone } : {}),
    email: submission.email,
    locationId,
    state: submission.state,
    country: "US",
    source,
    customFields,
    createNewIfDuplicateAllowed: false,
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

    if (submission.type === "event-registration") {
      const workshop = workshops.find((item) => item.id === submission.eventId)!;
      const eventTag = `llfg-event-${workshop.id}`;
      const eventPrefix = `${eventTag}-`;
      const commonTags = [
        "llf - website",
        "llfg-event-registration",
        `llfg-event-guests-${submission.guestCount}`,
        `llfg-event-age-50-plus-${slug(submission.age50Plus)}`,
        `llfg-event-industry-professional-${submission.industryProfessional}`,
        "llfg-email-service-consent",
      ];

      if (submission.age50Plus === "no") commonTags.push("llfg-under-50");
      if (submission.industryProfessional === "yes") commonTags.push("llfg-industry-professional");

      // The tag API returns the entire tag set. Check it before recording a second
      // registration or firing another confirmation for this contact and event.
      const currentTags = await addEventTags(contactId, token, commonTags);
      if (!currentTags) {
        return Response.json(
          { ok: false, message: "Your registration could not be completed. Please try again." },
          { status: 502 },
        );
      }

      if (currentTags.some((tag) => tag.toLowerCase() === eventTag)) {
        const smsTag = `${eventPrefix}sms-consent`;
        const previouslyConsented = currentTags.some((tag) => tag.toLowerCase() === smsTag);
        if (previouslyConsented && !submission.smsConsent) {
          const removal = await ghlRequest(`/contacts/${contactId}/tags`, token, { tags: [smsTag] }, "DELETE");
          if (!removal.ok) {
            console.error("GHL event SMS opt-out failed.", { status: removal.status });
            return Response.json(
              { ok: false, message: "Your SMS preference could not be updated. Please contact LLFG directly." },
              { status: 502 },
            );
          }
        }
        if (!previouslyConsented && submission.smsConsent) {
          const consentNote = await ghlRequest(`/contacts/${contactId}/notes`, token, {
            title: `LLFG event SMS consent: ${workshop.id}`,
            body: `Website registrant explicitly opted in to SMS reminders for event ${workshop.id} on a repeat registration.`,
          });
          if (!consentNote.ok || !await addEventTags(contactId, token, [smsTag])) {
            return Response.json(
              { ok: false, message: "Your SMS preference could not be updated. Please contact LLFG directly." },
              { status: 502 },
            );
          }
        }
        return Response.json({ ok: true, alreadyRegistered: true }, { status: 200 });
      }

      // A contact may register for several events. Store each immutable event and
      // guest snapshot as a separate contact note, never as a mutable contact field.
      const note = await ghlRequest(`/contacts/${contactId}/notes`, token, {
        title: `LLFG event registration: ${workshop.id}`,
        body: JSON.stringify({
          source: "LLFG Website · Event Registration",
          eventId: workshop.id,
          title: workshop.title,
          subtitle: workshop.subtitle,
          date: workshop.date,
          startTime: workshop.dateTime,
          endTime: workshop.endDateTime,
          displayTime: workshop.time,
          location: workshop.location,
          address: workshop.address,
          eventType: workshop.eventType,
          guestCount: Number(submission.guestCount),
          guests: submission.guests,
          age50Plus: submission.age50Plus,
          industryProfessional: submission.industryProfessional,
          emailRegistrationConsent: submission.consent,
          smsEventConsent: submission.smsConsent,
          status: "Registered",
        }, null, 2),
      });

      if (!note.ok) {
        console.error("GHL event registration note failed.", { status: note.status });
        return Response.json(
          { ok: false, message: "Your registration could not be completed. Please try again." },
          { status: 502 },
        );
      }

      const statusTags = [
        `${eventPrefix}status-registered`,
        `${eventPrefix}age-50-plus-${slug(submission.age50Plus)}`,
        `${eventPrefix}industry-professional-${submission.industryProfessional}`,
      ];
      if (submission.smsConsent) statusTags.push(`${eventPrefix}sms-consent`);
      if (!await addEventTags(contactId, token, statusTags) ||
          !await addEventTags(contactId, token, [eventTag])) {
        return Response.json(
          { ok: false, message: "Your registration could not be completed. Please try again." },
          { status: 502 },
        );
      }

      return Response.json({ ok: true, alreadyRegistered: false }, { status: 201 });
    }

    if (submission.type === "continuity-review-start") {
      const ok = await resetAndAddTags(
        contactId,
        token,
        [...reviewTags(submission), "llfg-review-started"],
        ["llfg-review-started"],
      );

      if (!ok) {
        return Response.json(
          { ok: false, message: "Your Review request could not be completed. Please try again." },
          { status: 502 },
        );
      }

      return Response.json({ ok: true }, { status: 201 });
    }

    const prepTags = [
      ...reviewTags(submission),
      "llfg-review-prepared",
      "llfg-continuity-review-request",
      `llfg-stage-${slug(submission.stage)}`,
      `llfg-concern-${slug(submission.primaryConcern)}`,
      `llfg-plan-${slug(submission.planStatus)}`,
    ];

    if (submission.shareCheckup) prepTags.push("llfg-checkup-shared");

    const ok = await resetAndAddTags(
      contactId,
      token,
      prepTags,
      ["llfg-review-prepared", "llfg-continuity-review-request"],
    );

    if (!ok) {
      return Response.json(
        { ok: false, message: "Your Review preparation could not be completed. Please try again." },
        { status: 502 },
      );
    }

    return Response.json(
      {
        ok: true,
        bookingUrl: process.env.GHL_CONTINUITY_CALENDAR_URL ?? null,
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
