import type { GuideIntent } from "@/lib/lifeline-guide";
import type { GuidePillar } from "@/lib/lifeline-guide-analytics";
import { redactGuideText } from "@/lib/lifeline-guide-redaction";

type SuggestedStep = {
  href: string;
  label: string;
  description: string;
} | null;

type RecordGuideExchangeInput = {
  sessionId: string;
  landingPath: string;
  currentPath: string;
  messagesInConversation: number;
  userMessage: string;
  assistantMessage: string;
  intent: GuideIntent;
  pillar: GuidePillar;
  topics: string[];
  suggestedStep: SuggestedStep;
  model: string;
  responseMs: number;
};

type RecordGuideEventInput = {
  sessionId: string;
  eventType:
    | "guide_opened"
    | "suggested_step_clicked"
    | "checkup_started"
    | "continuity_review_started";
  eventValue?: string;
  pagePath?: string;
};

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return { url, key };
}

async function supabaseRequest(
  path: string,
  init: RequestInit,
): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const authHeaders: Record<string, string> = {
    apikey: config.key,
  };

  if (!config.key.startsWith("sb_secret_")) {
    authHeaders.Authorization = `Bearer ${config.key}`;
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(2500),
  });

  if (!response.ok) {
    console.error("Lifeline Guide repository request failed", response.status);
    throw new Error("Lifeline Guide repository write failed");
  }
}

function safePath(path: string): string {
  return path.startsWith("/") && !path.startsWith("//")
    ? redactGuideText(path.split(/[?#]/, 1)[0].slice(0, 300)).text
    : "/";
}

export function isGuideRepositoryConfigured() {
  return Boolean(getConfig());
}

export async function recordGuideExchange({
  sessionId,
  landingPath,
  currentPath,
  messagesInConversation,
  userMessage,
  assistantMessage,
  intent,
  pillar,
  topics,
  suggestedStep,
  model,
  responseMs,
}: RecordGuideExchangeInput): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const now = new Date().toISOString();
  const exchangeId = crypto.randomUUID();
  const redactedUser = redactGuideText(userMessage);
  const redactedAssistant = redactGuideText(assistantMessage);
  const redactionLabels = [
    ...new Set([...redactedUser.labels, ...redactedAssistant.labels]),
  ];

  await supabaseRequest("guide_sessions?on_conflict=session_key", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      session_key: sessionId,
      last_seen_at: now,
      landing_path: safePath(landingPath),
      current_path: safePath(currentPath),
      primary_intent: intent,
      last_intent: intent,
      last_pillar: pillar,
      last_topics: topics,
      message_count: messagesInConversation,
      last_suggested_step_label: suggestedStep?.label ?? null,
      last_suggested_step_href: suggestedStep?.href ?? null,
      redaction_count: redactionLabels.length,
    }),
  });

  await supabaseRequest("guide_messages", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify([
      {
        session_key: sessionId,
        exchange_id: exchangeId,
        role: "user",
        content_redacted: redactedUser.text,
        intent,
        pillar,
        topics,
        redaction_labels: redactedUser.labels,
        model: null,
        response_ms: null,
      },
      {
        session_key: sessionId,
        exchange_id: exchangeId,
        role: "assistant",
        content_redacted: redactedAssistant.text,
        intent,
        pillar,
        topics,
        redaction_labels: redactedAssistant.labels,
        model,
        response_ms: responseMs,
      },
    ]),
  });
}

export async function recordGuideEvent({
  sessionId,
  eventType,
  eventValue,
  pagePath,
}: RecordGuideEventInput): Promise<void> {
  if (!getConfig()) return;

  await supabaseRequest("guide_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      session_key: sessionId,
      event_type: eventType,
      event_value: eventValue ? redactGuideText(eventValue).text : null,
      page_path: safePath(pagePath ?? "/"),
    }),
  });
}
