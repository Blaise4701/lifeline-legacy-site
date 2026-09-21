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
      {
        error:
          "The Lifeline Guide is not configured yet. Please use the Continuity Review for now.",
      },
      { status: 503 },
    );
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

  if (!latestUserMessage) {
    return NextResponse.json(
      { error: "Please enter a question for the Lifeline Guide." },
      { status: 400 },
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

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
        input: messages,
        max_output_tokens: 700,
        reasoning: { effort: "none" },
      }),
      cache: "no-store",
    });

    const payload = (await openAIResponse.json()) as OpenAIResponsePayload;

    if (!openAIResponse.ok) {
      const providerMessage =
        typeof payload.error?.message === "string" ? payload.error.message : "";

      console.error(
        "Lifeline Guide model request failed",
        openAIResponse.status,
        providerMessage.slice(0, 300),
      );

      let error =
        "The Lifeline Guide could not answer right now. Please try again.";

      if (openAIResponse.status === 401 || openAIResponse.status === 403) {
        error =
          "The Lifeline Guide API key is not being accepted. Please verify the Preview API key and its project permissions.";
      } else if (openAIResponse.status === 429) {
        error =
          "The Lifeline Guide has reached an API billing, credit, or usage limit. Please check the OpenAI API project's billing and limits.";
      } else if (
        /model|permission|access/i.test(providerMessage) &&
        openAIResponse.status >= 400 &&
        openAIResponse.status < 500
      ) {
        error =
          "The Lifeline Guide model is not available to this API project. Please check the OpenAI project's model permissions.";
      } else if (openAIResponse.status === 400) {
        error =
          "The Lifeline Guide request configuration needs an adjustment. The Preview build is working, but the OpenAI request was rejected.";
      }

      return NextResponse.json({ error }, { status: 502 });
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
