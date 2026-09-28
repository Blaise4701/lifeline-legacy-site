export const MAP_EMAIL_CONSENT_TEXT =
  "Email me the Family Continuity Map and related follow-up about using it. I can unsubscribe at any time.";

export const MAP_SMS_CONSENT_TEXT =
  "If I provide my mobile number, I agree to receive texts about the Map or a Continuity Review. Texts are optional; I can reply STOP to opt out.";

export const MAP_CONSENT_VERSION = "family-continuity-map-2026-09-28";

export const mapScoreBands = {
  "0-3": {
    label: "0–3 gaps",
    headline: "You’ve Built a Strong Foundation.",
    summary: "Your family has a map. Keep it current.",
    details: "Review it annually and after major life changes. Make sure two trusted people know where the Map is stored.",
  },
  "4-10": {
    label: "4–10 gaps",
    headline: "You Have a Foundation. Some Pieces May Need Coordination.",
    summary: "Your Map identified several areas where responsibilities, documents, people, or protection may not connect as clearly as they could.",
    details: "Choose one gap to address first, then make a practical plan for the others.",
  },
  "11-plus": {
    label: "11 or more gaps",
    headline: "Too Much of the Plan May Still Depend on One Person.",
    summary: "That is common, and it is fixable. The purpose of the Map is to identify those gaps before the family has to navigate them during a difficult moment.",
    details: "A conversation can help you sort the gaps and decide which next steps matter most.",
  },
} as const;
