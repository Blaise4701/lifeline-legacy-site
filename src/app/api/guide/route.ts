import { NextResponse } from "next/server";
import {
  LIFELINE_GUIDE_INSTRUCTIONS,
  classifyGuideIntent,
  type GuideIntent,
  type GuideMessage,
} from "@/lib/lifeline-guide";
import { LIFELINE_GUIDE_KNOWLEDGE } from "@/lib/lifeline-guide-knowledge";
import {
  classifyGuideTopics,
  inferGuidePillar,
} from "@/lib/lifeline-guide-analytics";
import { recordGuideExchange } from "@/lib/lifeline-guide-repository";
import { claimGuideRequest } from "@/lib/lifeline-guide-rate-limit";
import { redactGuideText } from "@/lib/lifeline-guide-redaction";
import {
  disclosure,
  licensedStates,
  site,
  workshops,
} from "@/lib/site-data";

export const runtime = "nodejs";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2400;

type OpenAIResponsePayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

function cleanMessages(value: unknown): GuideMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_MESSAGES)
    .filter(
      (item): item is GuideMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        (item as GuideMessage).role !== undefined &&
        ["user", "assistant"].includes((item as GuideMessage).role) &&
        typeof (item as GuideMessage).content === "string",
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.length > 0);
}

function extractOutputText(payload: OpenAIResponsePayload): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts: string[] = [];

  for (const item of payload.output ?? []) {
    if (item.type !== "message") continue;

    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}

function getSuggestedStep(intent: GuideIntent, message: string) {
  if (
    /(?:talk|speak|meet) (?:to|with) someone|look at my situation|schedule|appointment|book (?:a|my)|continuity review|personal help|review my/i.test(
      message,
    )
  ) {
    return {
      href: "/continuity-review",
      label: "Request a Continuity Review",
      description: "Bring a Lifeline Legacy professional into the conversation.",
    };
  }

  const steps: Partial<
    Record<GuideIntent, { href: string; label: string; description: string }>
  > = {
    retirement: {
      href: "/retirement-income",
      label: "Explore Retirement Income",
      description: "See the eight questions a written retirement-income plan should answer.",
    },
    family: {
      href: "/family-continuity",
      label: "Explore Family Continuity",
      description: "See the seven questions that connect income, protection, people, and documents.",
    },
    business: {
      href: "/business-continuity",
      label: "Explore Business Continuity",
      description: "Connect owner interruption, operations, ownership, retirement, and legacy.",
    },
    legacy: {
      href: "/continuity-bridge",
      label: "Explore the Continuity Bridge",
      description: "See how beneficiaries, ownership, documents, and intentions connect.",
    },
    workshop: {
      href: "/learn#workshops",
      label: "View Workshops",
      description: "See the current Lifeline Legacy educational event schedule.",
    },
    continuity: {
      href: "/continuity-bridge",
      label: "Explore the Continuity Bridge",
      description: "Go deeper into Continuity, Certainty, and Legacy.",
    },
  };

  return steps[intent] ?? null;
}

function buildBusinessContext(): string {
  const now = Date.now();
  const upcoming = workshops
    .filter((workshop) => new Date(workshop.dateTime).getTime() >= now)
    .slice(0, 8)
    .map(
      (workshop) =>
        `- ${workshop.eventType}: ${workshop.title} — ${workshop.date} at ${workshop.time}, ${workshop.location}, ${workshop.address}`,
    )
    .join("\n");

  return `
Organization: ${site.name}
Service area: ${site.location}
Email: ${site.email}
Licensed insurance states listed by the firm: ${licensedStates.join(", ")}

Positioning:
- Education-first planning built around Continuity, Certainty, and Legacy.
- Retirement income education and coordination.
- Family protection and income continuity education.
- Business continuity and owner-transition education.
- Legacy and beneficiary coordination education.
- The Continuity Bridge™ is the firm's organizing framework.
- The Continuity Review is the next-step conversation for people who want help coordinating their own situation.

Current upcoming workshops and seminars:
${upcoming || "- No upcoming events are currently listed in the website data."}

Required firm disclosure:
${disclosure}
`.trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The Lifeline Guide is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  if (Number(request.headers.get("content-length")) > 40_000) {
    return NextResponse.json({ error: "The question is too long." }, { status: 413 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const requestBody =
    typeof body === "object" && body !== null
      ? (body as {
          messages?: unknown;
          sessionId?: unknown;
          landingPath?: unknown;
          currentPath?: unknown;
        })
      : {};

  const messages = cleanMessages(requestBody.messages);

  const sessionId =
    typeof requestBody.sessionId === "string"
      ? requestBody.sessionId.slice(0, 100)
      : "";
  if (sessionId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }
  const landingPath =
    typeof requestBody.landingPath === "string"
      ? requestBody.landingPath.slice(0, 300)
      : "/";
  const currentPath =
    typeof requestBody.currentPath === "string"
      ? requestBody.currentPath.slice(0, 300)
      : "/";

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage || messages.at(-1)?.role !== "user") {
    return NextResponse.json(
      { error: "Please enter a question for the Lifeline Guide." },
      { status: 400 },
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const limit = await claimGuideRequest(request);
  if (limit === "limited") {
    return NextResponse.json(
      { error: "The Lifeline Guide has reached its request limit. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }
  if (limit === "unavailable") {
    return NextResponse.json(
      { error: "The Lifeline Guide is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  // Minimize identifiers sent to the model as well as those stored in Supabase.
  const providerMessages = messages.map((message) => ({
    role: message.role,
    content: redactGuideText(message.content).text,
  }));

  try {
    const startedAt = Date.now();
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        instructions: `${LIFELINE_GUIDE_INSTRUCTIONS}\n\nLIFELINE LEGACY APPROVED KNOWLEDGE\n${LIFELINE_GUIDE_KNOWLEDGE}\n\nCURRENT APPROVED BUSINESS CONTEXT\n${buildBusinessContext()}`,
        input: providerMessages,
        max_output_tokens: 700,
        reasoning: { effort: "none" },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });

    const payload = (await openAIResponse.json()) as OpenAIResponsePayload;

    if (!openAIResponse.ok) {
      console.error(
        "Lifeline Guide model request failed",
        openAIResponse.status,
      );

      return NextResponse.json(
        { error: "The Lifeline Guide could not answer right now. Please try again later." },
        { status: 502 },
      );
    }

    const reply = extractOutputText(payload);

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "The Lifeline Guide did not return an answer. Please try again.",
        },
        { status: 502 },
      );
    }

    const intent = classifyGuideIntent(latestUserMessage.content);
    const topics = classifyGuideTopics(latestUserMessage.content);
    const pillar = inferGuidePillar(intent, topics);
    const suggestedStep = getSuggestedStep(
      intent,
      latestUserMessage.content,
    );

    if (sessionId) {
      try {
        await recordGuideExchange({
          sessionId,
          landingPath,
          currentPath,
          messagesInConversation: messages.length,
          userMessage: latestUserMessage.content,
          assistantMessage: reply,
          intent,
          pillar,
          topics,
          suggestedStep,
          model,
          responseMs: Date.now() - startedAt,
        });
      } catch (error) {
        console.error(
          "Lifeline Guide conversation logging failed",
          error instanceof Error ? error.name : "UnknownError",
        );
      }
    }

    return NextResponse.json({
      reply,
      intent,
      suggestedStep,
    });
  } catch (error) {
    console.error(
      "Lifeline Guide request error",
      error instanceof Error ? error.name : "UnknownError",
    );

    return NextResponse.json(
      {
        error:
          "The Lifeline Guide could not answer right now. Please try again or start a Continuity Review.",
      },
      { status: 502 },
    );
  }
}
