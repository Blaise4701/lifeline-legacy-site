import type { GuideMessage } from "@/lib/lifeline-guide";

export const MAX_MESSAGES = 12;
export const MAX_MESSAGE_LENGTH = 2400;

export type OpenAIResponsePayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

export function cleanGuideMessages(value: unknown): GuideMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_MESSAGES)
    .filter(
      (item): item is GuideMessage =>
        Boolean(item) &&
        typeof item === "object" &&
        ["user", "assistant"].includes((item as GuideMessage).role) &&
        typeof (item as GuideMessage).content === "string",
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.length > 0);
}

export function extractGuideOutput(payload: OpenAIResponsePayload): string {
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
