export const runtime = "nodejs";

const GHL_API_ORIGIN = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "v3";
const PIPELINE_NAME = "Retirement Acquisition Engine";
const BUILD_VERSION = "v2.11";
const FIT_MODEL_VERSION = "v1.6";
const ENGAGEMENT_MODEL_VERSION = "v1.3";
const CONSENT_LANGUAGE_VERSION = "stress-test-v2.11-preview-compliance-pending";
const MAX_BODY_BYTES = 24_000;

const HORIZONS = {
  already_retired: { label: "Already Retired", points: 30 },
  "0_to_2_years": { label: "Within 0–2 Years", points: 30 },
  "3_to_5_years": { label: "Within 3–5 Years", points: 25 },
  "6_to_10_years": { label: "Within 6–10 Years", points: 20 },
  gt_10_years: { label: "10+ Years Out", points: 5 },
  unsure_horizon: { label: "Timing Not Yet Set", points: 10 },
} as const;

const ASSETS = {
  under_100k: { label: "Under $100K", points: 0 },
  "100k_250k": { label: "$100K–$250K", points: 10 },
  "250k_500k": { label: "$250K–$500K", points: 20 },
  "500k_1m": { label: "$500K–$1M", points: 30 },
  "1m_plus": { label: "$1M+", points: 30 },
  undisclosed: { label: "Not Disclosed", points: 15 },
} as const;

const PLANS = {
  no_plan: { label: "No plan", points: 20 },
  accounts_no_plan: { label: "Accounts, but no coordinated plan", points: 18 },
  projections_only: { label: "Projections, but not a real income plan", points: 15 },
  outdated_plan: { label: "My plan is outdated or I don't fully trust it", points: 15 },
  has_current_plan: { label: "I have a current, trusted plan", points: 5 },
} as const;

const INTENTS = {
  build_plan: { label: "Build a written plan", points: 15 },
  verify_income: { label: "Verify my income is on track", points: 15 },
  second_opinion: { label: "Get a second opinion", points: 15 },
  near_term_decision: { label: "Make a near-term decision", points: 20 },
  understand_options: { label: "Understand my options", points: 10 },
  mainly_researching: { label: "Mainly researching", points: 0 },
} as const;

const CONCERNS = {
  income: "Creating Dependable Retirement Income",
  taxes: "Retirement Taxes",
  market_decline: "A Market Decline Near Retirement",
  longevity: "Outliving My Savings",
  survivor_income: "Survivor Income for My Spouse",
  healthcare_ltc: "Healthcare / Long-Term Care Costs",
  timing: "Timing My Retirement Decisions",
  coordination: "Coordinating Everything I Have",
  legacy: "Legacy for My Family",
} as const;

const ACCOUNTS = {
  "401k_403b": "401(k) / 403(b)",
  tsp: "TSP",
  ira_traditional: "Traditional IRA",
  ira_roth: "Roth IRA",
  pension: "Pension",
  brokerage: "Brokerage / Investment Account",
  annuity: "Annuity",
  social_security: "Social Security",
  business_ownership: "Business Ownership",
  real_estate: "Real Estate",
  none_yet: "None Yet",
} as const;

const ENGAGEMENT_POINTS = {
  test_completed: 3,
  viewed_full_results: 3,
  watched_intro: 5,
  opened_booking: 3,
  returns_to_results: 2,
  clicks_link: 2,
  replies: 4,
  attends_webinar: 5,
  completes_booking: 8,
} as const;

const OWNER_MATRIX = {
  "A-High": "blaise_support",
  "A-Medium": "ai_admin",
  "A-Low": "ai_admin",
  "B-High": "ai_admin",
  "B-Medium": "ai",
  "B-Low": "automation",
  "C-High": "automation",
  "C-Medium": "automation",
  "C-Low": "automation",
} as const;

const STAGE_BY_TIER = {
  A: "Verified — Tier A",
  B: "Verified — Tier B",
  C: "Tier C Education",
} as const;

type FitTier = keyof typeof STAGE_BY_TIER;
type EngagementLevel = "Low" | "Medium" | "High";
type PlanningTrackCode = "build_first_plan" | "update_coordinate" | "second_opinion" | "education";
type OwnerCode = "automation" | "ai" | "admin" | "ai_admin" | "blaise" | "blaise_support";

type Submission = {
  firstName: string;
  lastName: string;
  emailRaw: string;
  email: string;
  mobileRaw: string;
  phone: string;
  consentCaptured: true;
  consentTimestamp: string;
  verificationStatus: "Verified";
  otpVerifiedTimestamp: string;
  answers: {
    retirementHorizon: keyof typeof HORIZONS;
    investableAssets: keyof typeof ASSETS;
    accountInventory: Array<keyof typeof ACCOUNTS>;
    primaryConcern: keyof typeof CONCERNS;
    writtenPlanStatus: keyof typeof PLANS;
    statedIntent: keyof typeof INTENTS;
  };
  engagementEvents: Array<keyof typeof ENGAGEMENT_POINTS>;
  attribution: {
    source: string;
    medium: string;
    campaign: string;
    adSet: string;
    ad: string;
    adAngle: string;
    creative: string;
    landingPage: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmContent: string;
    utmTerm: string;
  };
};

type GhlField = {
  id: string;
  name: string;
  fieldKey?: string;
  dataType?: string;
};

type GhlPipeline = {
  id: string;
  name: string;
  stages?: Array<{ id: string; name: string }>;
};

type Schema = {
  fields: GhlField[];
  pipeline: GhlPipeline;
};

type UpsertContactResponse = {
  contact?: { id?: string };
};

type OpportunitySearchResponse = {
  opportunities?: Array<{ id?: string }>;
};

let schemaCache: { locationId: string; value: Schema; loadedAt: number } | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
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

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isE164UsPhone(value: string) {
  return /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(value);
}

function isIsoDateTime(value: string) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
}

function dateOnly(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function hasOwn<T extends object>(object: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function parseSubmission(value: unknown): Submission | null {
  if (!isRecord(value) || !isRecord(value.answers) || !isRecord(value.attribution)) return null;

  const firstName = cleanText(value.firstName, 80);
  const lastName = cleanText(value.lastName, 80);
  const emailRaw = cleanText(value.emailRaw, 254);
  const email = cleanText(value.email, 254).toLowerCase();
  const mobileRaw = cleanText(value.mobileRaw, 40);
  const phone = cleanText(value.phone, 24);
  const consentTimestamp = cleanText(value.consentTimestamp, 40);
  const otpVerifiedTimestamp = cleanText(value.otpVerifiedTimestamp, 40);

  const retirementHorizon = cleanText(value.answers.retirementHorizon, 40);
  const investableAssets = cleanText(value.answers.investableAssets, 40);
  const primaryConcern = cleanText(value.answers.primaryConcern, 40);
  const writtenPlanStatus = cleanText(value.answers.writtenPlanStatus, 40);
  const statedIntent = cleanText(value.answers.statedIntent, 40);

  if (
    !firstName ||
    !lastName ||
    !isEmail(email) ||
    !isE164UsPhone(phone) ||
    value.consentCaptured !== true ||
    value.verificationStatus !== "Verified" ||
    !isIsoDateTime(consentTimestamp) ||
    !isIsoDateTime(otpVerifiedTimestamp) ||
    !hasOwn(HORIZONS, retirementHorizon) ||
    !hasOwn(ASSETS, investableAssets) ||
    !hasOwn(CONCERNS, primaryConcern) ||
    !hasOwn(PLANS, writtenPlanStatus) ||
    !hasOwn(INTENTS, statedIntent)
  ) {
    return null;
  }

  const accountInventoryRaw = Array.isArray(value.answers.accountInventory)
    ? value.answers.accountInventory
    : [];
  const accountInventory = accountInventoryRaw
    .map((item) => cleanText(item, 40))
    .filter((item): item is keyof typeof ACCOUNTS => hasOwn(ACCOUNTS, item));

  const engagementEventsRaw = Array.isArray(value.engagementEvents) ? value.engagementEvents : [];
  const engagementEvents = Array.from(
    new Set(
      engagementEventsRaw
        .map((item) => cleanText(item, 40))
        .filter((item): item is keyof typeof ENGAGEMENT_POINTS => hasOwn(ENGAGEMENT_POINTS, item)),
    ),
  );

  const attribution = {
    source: cleanText(value.attribution.source, 100),
    medium: cleanText(value.attribution.medium, 100),
    campaign: cleanText(value.attribution.campaign, 160),
    adSet: cleanText(value.attribution.adSet, 160),
    ad: cleanText(value.attribution.ad, 160),
    adAngle: cleanText(value.attribution.adAngle, 160),
    creative: cleanText(value.attribution.creative, 160),
    landingPage: cleanText(value.attribution.landingPage, 300),
    utmSource: cleanText(value.attribution.utmSource, 100),
    utmMedium: cleanText(value.attribution.utmMedium, 100),
    utmCampaign: cleanText(value.attribution.utmCampaign, 160),
    utmContent: cleanText(value.attribution.utmContent, 160),
    utmTerm: cleanText(value.attribution.utmTerm, 160),
  };

  return {
    firstName,
    lastName,
    emailRaw,
    email,
    mobileRaw,
    phone,
    consentCaptured: true,
    consentTimestamp,
    verificationStatus: "Verified",
    otpVerifiedTimestamp,
    answers: {
      retirementHorizon,
      investableAssets,
      accountInventory,
      primaryConcern,
      writtenPlanStatus,
      statedIntent,
    },
    engagementEvents,
    attribution,
  };
}

function planningTrackFor(plan: keyof typeof PLANS, intent: keyof typeof INTENTS): {
  code: PlanningTrackCode;
  label: string;
} {
  if (intent === "mainly_researching") return { code: "education", label: "Education" };
  if (plan === "has_current_plan" && intent === "second_opinion") {
    return { code: "second_opinion", label: "Second Opinion" };
  }
  if (plan === "has_current_plan") return { code: "education", label: "Education" };
  if (plan === "no_plan" || plan === "accounts_no_plan") {
    return { code: "build_first_plan", label: "Build My First Written Plan" };
  }
  return { code: "update_coordinate", label: "Update & Coordinate My Plan" };
}

function engagementFrom(events: Submission["engagementEvents"]) {
  const score = events.reduce((sum, event) => sum + ENGAGEMENT_POINTS[event], 0);
  const level: EngagementLevel = score >= 18 ? "High" : score >= 8 ? "Medium" : "Low";
  return { score, level };
}

function ownerFor(tier: FitTier, level: EngagementLevel, highIntent: boolean): OwnerCode {
  const key = `${tier}-${level}` as keyof typeof OWNER_MATRIX;
  const base = OWNER_MATRIX[key] as OwnerCode;

  if (
    highIntent &&
    ((tier === "A" && level === "Medium") || (tier === "B" && level === "High"))
  ) {
    return "blaise_support";
  }

  return base;
}

function nextActionFor(tier: FitTier, planningTrack: PlanningTrackCode) {
  if (planningTrack === "second_opinion") {
    return "Route to Second-Opinion Track";
  }
  if (tier === "A") {
    return "Tier A — Not Booked: strong Review CTA, speed-to-relevant-response";
  }
  if (tier === "B") {
    return "Tier B — Not Booked: Review invitation + concern-matched nurture";
  }
  return "Tier C — Nurture: education track, no booking push";
}

function normalizeIdentifier(value: string) {
  return value
    .replace(/^contact\./i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function resolveField(fields: GhlField[], aliases: string[]) {
  const targets = aliases.map(normalizeIdentifier);
  return fields.find((field) => {
    const names = [
      normalizeIdentifier(field.name),
      normalizeIdentifier(field.fieldKey ?? ""),
    ];
    return targets.some((target) => names.includes(target));
  });
}

async function ghlFetch(
  path: string,
  token: string,
  init: RequestInit = {},
  version = GHL_API_VERSION,
) {
  return fetch(`${GHL_API_ORIGIN}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      Version: version,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
}

async function loadSchema(token: string, locationId: string): Promise<Schema> {
  const now = Date.now();
  if (
    schemaCache &&
    schemaCache.locationId === locationId &&
    now - schemaCache.loadedAt < 10 * 60 * 1000
  ) {
    return schemaCache.value;
  }

  const [fieldResponse, pipelineResponse] = await Promise.all([
    ghlFetch(`/locations/${locationId}/customFields?model=contact`, token),
    ghlFetch(`/opportunities/pipelines?locationId=${encodeURIComponent(locationId)}`, token),
  ]);

  if (!fieldResponse.ok) {
    throw new Error(`custom-fields:${fieldResponse.status}`);
  }
  if (!pipelineResponse.ok) {
    throw new Error(`pipelines:${pipelineResponse.status}`);
  }

  const fieldPayload = (await fieldResponse.json()) as { customFields?: GhlField[] };
  const pipelinePayload = (await pipelineResponse.json()) as { pipelines?: GhlPipeline[] };
  const fields = fieldPayload.customFields ?? [];
  const pipelineSummary = (pipelinePayload.pipelines ?? []).find(
    (pipeline) => pipeline.name.trim().toLowerCase() === PIPELINE_NAME.toLowerCase(),
  );

  if (!pipelineSummary) throw new Error("pipeline:not-found");

  let pipeline = pipelineSummary;
  if (!pipeline.stages?.length) {
    const response = await ghlFetch(`/opportunities/pipelines/${pipeline.id}`, token);
    if (!response.ok) throw new Error(`pipeline-detail:${response.status}`);
    const payload = (await response.json()) as { pipeline?: GhlPipeline } | GhlPipeline;
    pipeline = "pipeline" in payload && payload.pipeline ? payload.pipeline : (payload as GhlPipeline);
  }

  const value = { fields, pipeline };
  schemaCache = { locationId, value, loadedAt: now };
  return value;
}

type CustomValue = string | number | boolean | string[];

type CustomFieldSpec = {
  aliases: string[];
  value: CustomValue;
};

function buildCustomFieldSpecs(submission: Submission) {
  const horizon = HORIZONS[submission.answers.retirementHorizon];
  const assets = ASSETS[submission.answers.investableAssets];
  const plan = PLANS[submission.answers.writtenPlanStatus];
  const intent = INTENTS[submission.answers.statedIntent];
  const concernLabel = CONCERNS[submission.answers.primaryConcern];
  const accountLabels = submission.answers.accountInventory.map((code) => ACCOUNTS[code]);
  const track = planningTrackFor(
    submission.answers.writtenPlanStatus,
    submission.answers.statedIntent,
  );
  const fitScore = horizon.points + assets.points + plan.points + intent.points;
  const fitTier: FitTier = fitScore >= 70 ? "A" : fitScore >= 40 ? "B" : "C";
  const engagement = engagementFrom(submission.engagementEvents);
  const highIntent = submission.answers.statedIntent === "near_term_decision";
  const owner = ownerFor(fitTier, engagement.level, highIntent);
  const stage = STAGE_BY_TIER[fitTier];
  const nextAction = nextActionFor(fitTier, track.code);
  const now = new Date();
  const acquisitionCohort = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "America/Chicago",
  });

  const fields: Record<string, CustomFieldSpec> = {
    email_raw: { aliases: ["email_raw"], value: submission.emailRaw },
    mobile_raw: { aliases: ["mobile_raw"], value: submission.mobileRaw },
    consent_captured: {
      aliases: ["Consent Captured", "consent_captured"],
      value: true,
    },
    consent_timestamp: {
      aliases: ["Consent Timestamp", "consent_timestamp"],
      value: dateOnly(submission.consentTimestamp),
    },
    consent_language_version: {
      aliases: ["Consent Language Version", "consent_language_version"],
      value: CONSENT_LANGUAGE_VERSION,
    },
    verification_status: {
      aliases: ["Verification Status", "verification_status"],
      value: "Verified",
    },
    otp_verified_timestamp: {
      aliases: ["OTP Verified Timestamp", "otp_verified_timestamp"],
      value: dateOnly(submission.otpVerifiedTimestamp),
    },

    retirement_horizon_code: {
      aliases: ["retirement_horizon_code"],
      value: submission.answers.retirementHorizon,
    },
    retirement_horizon_label: {
      aliases: ["retirement_horizon_label"],
      value: horizon.label,
    },
    retirement_horizon_points: {
      aliases: ["retirement_horizon_points"],
      value: horizon.points,
    },

    investable_assets_code: {
      aliases: ["investable_assets_code"],
      value: submission.answers.investableAssets,
    },
    investable_assets_label: {
      aliases: ["investable_assets_label"],
      value: assets.label,
    },
    investable_assets_points: {
      aliases: ["investable_assets_points"],
      value: assets.points,
    },

    written_plan_status_code: {
      aliases: ["written_plan_status_code"],
      value: submission.answers.writtenPlanStatus,
    },
    written_plan_status_label: {
      aliases: ["written_plan_status_label"],
      value: plan.label,
    },
    written_plan_status_points: {
      aliases: ["written_plan_status_points"],
      value: plan.points,
    },

    stated_intent_code: {
      aliases: ["stated_intent_code"],
      value: submission.answers.statedIntent,
    },
    stated_intent_label: {
      aliases: ["stated_intent_label"],
      value: intent.label,
    },
    stated_intent_points: {
      aliases: ["stated_intent_points"],
      value: intent.points,
    },

    primary_concern_code: {
      aliases: ["primary_concern_code"],
      value: submission.answers.primaryConcern,
    },
    primary_concern_label: {
      aliases: ["primary_concern_label"],
      value: concernLabel,
    },

    account_inventory_codes: {
      aliases: ["account_inventory_codes"],
      value: submission.answers.accountInventory,
    },
    account_inventory_labels: {
      aliases: ["account_inventory_labels"],
      value: accountLabels.join(", "),
    },

    fit_score_total: {
      aliases: ["Fit Score Total", "fit_score_total"],
      value: fitScore,
    },
    fit_tier: {
      aliases: ["Fit Tier", "fit_tier"],
      value: fitTier,
    },
    engagement_score: {
      aliases: ["Engagement Score", "engagement_score"],
      value: engagement.score,
    },
    engagement_level: {
      aliases: ["Engagement Level", "engagement_level"],
      value: engagement.level,
    },
    planning_track_code: {
      aliases: ["planning_track_code"],
      value: track.code,
    },
    planning_track_label: {
      aliases: ["planning_track_label"],
      value: track.label,
    },

    stress_test_status: {
      aliases: ["Stress-Test Status", "stresstest_status", "stress_test_status"],
      value: "completed",
    },
    current_journey_stage: {
      aliases: ["Current Journey Stage", "current_journey_stage"],
      value: stage,
    },
    results_viewed: {
      aliases: ["Results Viewed", "results_viewed"],
      value: true,
    },
    appointment_status: {
      aliases: ["Appointment Status", "appointment_status"],
      value: "None",
    },
    recommended_next_action: {
      aliases: ["Recommended Next Action", "recommended_next_action"],
      value: nextAction,
    },

    recommended_follow_up_owner: {
      aliases: ["Recommended Follow-Up Owner", "recommended_follow_up_owner"],
      value: owner,
    },

    acquisition_cohort: {
      aliases: ["Acquisition Cohort", "acquisition_cohort"],
      value: acquisitionCohort,
    },
    medium: {
      aliases: ["Medium", "medium"],
      value: submission.attribution.medium || submission.attribution.utmMedium,
    },
    ad_set: {
      aliases: ["Ad Set", "ad_set"],
      value: submission.attribution.adSet,
    },
    ad: {
      aliases: ["Ad", "ad"],
      value: submission.attribution.ad,
    },
    ad_angle: {
      aliases: ["Ad Angle", "ad_angle"],
      value: submission.attribution.adAngle,
    },
    creative: {
      aliases: ["Creative", "creative"],
      value: submission.attribution.creative,
    },
    landing_page: {
      aliases: ["Landing Page", "landing_page"],
      value: submission.attribution.landingPage,
    },
    utm_source: {
      aliases: ["UTM Source", "utm_source"],
      value: submission.attribution.utmSource,
    },
    utm_medium: {
      aliases: ["UTM Medium", "utm_medium"],
      value: submission.attribution.utmMedium,
    },
    utm_campaign: {
      aliases: ["UTM Campaign", "utm_campaign"],
      value: submission.attribution.utmCampaign,
    },
    utm_content: {
      aliases: ["UTM Content", "utm_content"],
      value: submission.attribution.utmContent,
    },
    utm_term: {
      aliases: ["UTM Term", "utm_term"],
      value: submission.attribution.utmTerm,
    },

    stress_test_build_version: {
      aliases: ["Stress-Test Build Version", "stresstest_build_version", "stress_test_build_version"],
      value: BUILD_VERSION,
    },
    fit_model_version: {
      aliases: ["Fit Model Version", "fit_model_version"],
      value: FIT_MODEL_VERSION,
    },
    engagement_model_version: {
      aliases: ["Engagement Model Version", "engagement_model_version"],
      value: ENGAGEMENT_MODEL_VERSION,
    },
  };

  return { fields, fitScore, fitTier, engagement, track, owner, stage, nextAction };
}

function customFieldsForGhl(
  schemaFields: GhlField[],
  specs: Record<string, CustomFieldSpec>,
) {
  const missing: string[] = [];
  const customFields: Array<{ id: string; fieldValue: CustomValue }> = [];

  for (const [logicalName, spec] of Object.entries(specs)) {
    if (
      (typeof spec.value === "string" && spec.value === "") ||
      (Array.isArray(spec.value) && spec.value.length === 0)
    ) {
      continue;
    }

    const field = resolveField(schemaFields, spec.aliases);
    if (!field) {
      missing.push(logicalName);
      continue;
    }

    customFields.push({ id: field.id, fieldValue: spec.value });
  }

  return { customFields, missing };
}

async function upsertOpportunity(
  token: string,
  locationId: string,
  pipeline: GhlPipeline,
  stageName: string,
  contactId: string,
  opportunityName: string,
) {
  const stage = pipeline.stages?.find(
    (item) => item.name.trim().toLowerCase() === stageName.toLowerCase(),
  );
  if (!stage) throw new Error(`stage:not-found:${stageName}`);

  const params = new URLSearchParams({
    locationId,
    pipelineId: pipeline.id,
    contactId,
    status: "open",
    limit: "20",
  });
  const searchResponse = await ghlFetch(`/opportunities/search?${params.toString()}`, token);
  if (!searchResponse.ok) throw new Error(`opportunity-search:${searchResponse.status}`);

  const searchResult = (await searchResponse.json()) as OpportunitySearchResponse;
  const existingId = searchResult.opportunities?.[0]?.id;

  if (existingId) {
    const updateResponse = await ghlFetch(
      `/opportunities/${existingId}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({
          pipelineId: pipeline.id,
          pipelineStageId: stage.id,
          name: opportunityName,
          status: "open",
        }),
      },
    );
    if (!updateResponse.ok) throw new Error(`opportunity-update:${updateResponse.status}`);
    return existingId;
  }

  const createResponse = await ghlFetch(
    "/opportunities/",
    token,
    {
      method: "POST",
      body: JSON.stringify({
        pipelineId: pipeline.id,
        locationId,
        name: opportunityName,
        pipelineStageId: stage.id,
        status: "open",
        contactId,
        monetaryValue: 0,
      }),
    },
  );
  if (!createResponse.ok) throw new Error(`opportunity-create:${createResponse.status}`);

  const createResult = (await createResponse.json()) as {
    opportunity?: { id?: string };
  };
  return createResult.opportunity?.id ?? null;
}

function previewOnly() {
  return process.env.VERCEL_ENV !== "production";
}

export async function GET() {
  if (!previewOnly()) {
    return Response.json({ ok: false, message: "Preview diagnostics are disabled." }, { status: 404 });
  }

  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    return Response.json(
      { ok: false, configured: false, message: "GHL server configuration is missing." },
      { status: 503 },
    );
  }

  try {
    const schema = await loadSchema(token, locationId);
    return Response.json({
      ok: true,
      configured: true,
      customFieldCount: schema.fields.length,
      pipeline: schema.pipeline.name,
      stages: schema.pipeline.stages?.map((stage) => stage.name) ?? [],
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown";
    console.error("Retirement Stress-Test schema check failed.", { reason });
    return Response.json(
      { ok: false, configured: true, message: "GHL schema could not be verified.", reason },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  if (!previewOnly()) {
    return Response.json(
      { ok: false, message: "This integration is preview-only until live OTP and compliance approval." },
      { status: 503 },
    );
  }

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
    return Response.json({ ok: false, message: "Stress-Test data was incomplete or invalid." }, { status: 400 });
  }

  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error("Retirement Stress-Test GHL integration is missing server configuration.");
    return Response.json(
      { ok: false, message: "GHL integration is not configured for this preview." },
      { status: 503 },
    );
  }

  try {
    const schema = await loadSchema(token, locationId);
    const derived = buildCustomFieldSpecs(submission);
    const { customFields, missing } = customFieldsForGhl(schema.fields, derived.fields);

    if (missing.length) {
      console.error("Retirement Stress-Test GHL schema mismatch.", { missing });
      return Response.json(
        {
          ok: false,
          message: "GHL fields do not match the locked Stress-Test schema.",
          missingFields: missing,
        },
        { status: 500 },
      );
    }

    const source =
      submission.attribution.utmSource || submission.attribution.source
        ? `LLFG Retirement Income Stress-Test · ${submission.attribution.utmSource || submission.attribution.source}`
        : "LLFG Retirement Income Stress-Test · Preview";

    const contactResponse = await ghlFetch(
      "/contacts/upsert",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          firstName: submission.firstName,
          lastName: submission.lastName,
          email: submission.email,
          phone: submission.phone,
          locationId,
          country: "US",
          source,
          customFields,
        }),
      },
    );

    if (!contactResponse.ok) {
      console.error("Retirement Stress-Test contact upsert failed.", {
        status: contactResponse.status,
      });
      return Response.json(
        { ok: false, message: "The test contact could not be written to GHL." },
        { status: 502 },
      );
    }

    const contactResult = (await contactResponse.json()) as UpsertContactResponse;
    const contactId = contactResult.contact?.id;
    if (!contactId) throw new Error("contact:no-id");

    const opportunityId = await upsertOpportunity(
      token,
      locationId,
      schema.pipeline,
      derived.stage,
      contactId,
      `${submission.firstName} ${submission.lastName} — Retirement Income Stress-Test`,
    );

    return Response.json(
      {
        ok: true,
        contactId,
        opportunityId,
        fitScore: derived.fitScore,
        fitTier: derived.fitTier,
        planningTrack: derived.track.code,
        engagementScore: derived.engagement.score,
        engagementLevel: derived.engagement.level,
        recommendedOwner: derived.owner,
        pipelineStage: derived.stage,
        buildVersion: BUILD_VERSION,
      },
      { status: 201 },
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown";
    console.error("Retirement Stress-Test GHL submission failed.", { reason });
    return Response.json(
      { ok: false, message: "The test submission could not be completed.", reason },
      { status: 502 },
    );
  }
}
