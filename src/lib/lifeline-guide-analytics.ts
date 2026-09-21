import type { GuideIntent } from "@/lib/lifeline-guide";

export type GuidePillar = "continuity" | "certainty" | "legacy" | "mixed";

export function classifyGuideTopics(message: string): string[] {
  const text = message.toLowerCase();
  const topics = new Set<string>();

  const add = (topic: string, pattern: RegExp) => {
    if (pattern.test(text)) topics.add(topic);
  };

  add("social-security", /social security|ssa|claiming age|full retirement age/);
  add("rollover", /roll over|rollover|401\s*\(?k\)?.*ira|ira.*401\s*\(?k\)?/);
  add("401k-403b", /401\s*\(?k\)?|403\s*\(?b\)?/);
  add("pension", /pension/);
  add("retirement-readiness", /enough.*retir|retir.*enough|can i retire|ready to retire/);
  add("retirement-income", /retirement income|income plan|withdrawal|spending in retirement/);
  add("sequence-risk", /sequence.*risk|market decline|market crash|downturn/);
  add("taxes", /tax|taxable|rmd|required minimum distribution|irmaa/);
  add("healthcare-ltc", /medicare|healthcare|health care|long[- ]term care|ltc|nursing home/);
  add("survivor-income", /survivor|spouse.*die|widow|widower/);
  add("life-insurance", /life insurance|death benefit|term life|permanent life/);
  add("living-benefits", /living benefit|critical illness|chronic illness|terminal illness/);
  add("iul", /\biul\b|indexed universal life/);
  add("annuity", /annuit/);
  add("fixed-indexed-annuity", /fixed indexed annuit|\bfia\b/);
  add("disability-income-protection", /disabil|income protection/);
  add("estate-legacy", /estate|legacy|beneficiar|will|trust|inherit|probate|power of attorney/);
  add("business-continuity", /business|owner|buy[- ]?sell|key person|succession|company/);
  add("workshop", /workshop|seminar|event|library|register/);
  add("continuity-bridge", /continuity bridge|continuity checkup|continuity review/);
  add("sales-objection", /sell me|sales pitch|trying to sell|commission|scam/);
  add("advisor-scope", /financial advisor|manage my investment|investment advisor|fiduciary/);
  add("legal-scope", /create.*trust|draft.*will|do my estate plan|legal advice/);
  add("pricing-compensation", /how are you paid|commission|cost|fee|how much.*review/);
  add(
    "underwriting-health",
    /underwrit|diagnos|medication|prescription|a1c|insulin|cancer|diabetes|epilepsy|autism|pregnan|surgery/,
  );

  return [...topics];
}

export function inferGuidePillar(
  intent: GuideIntent,
  topics: string[],
): GuidePillar {
  if (
    topics.some((topic) =>
      ["estate-legacy", "survivor-income", "legal-scope"].includes(topic),
    )
  ) {
    return intent === "retirement" || intent === "family" ? "mixed" : "legacy";
  }

  if (
    topics.some((topic) =>
      [
        "rollover",
        "social-security",
        "401k-403b",
        "pension",
        "taxes",
        "retirement-income",
        "annuity",
        "fixed-indexed-annuity",
        "iul",
      ].includes(topic),
    )
  ) {
    return intent === "retirement" ? "certainty" : "mixed";
  }

  if (
    topics.some((topic) =>
      [
        "life-insurance",
        "living-benefits",
        "disability-income-protection",
        "business-continuity",
        "healthcare-ltc",
      ].includes(topic),
    )
  ) {
    return "continuity";
  }

  if (intent === "legacy") return "legacy";
  if (intent === "continuity") return "mixed";
  return "mixed";
}
