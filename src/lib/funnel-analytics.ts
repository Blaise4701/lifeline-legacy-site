"use client";

// Funnel events are sent only to analytics tools that the site has already loaded
// (Google Tag Manager dataLayer, Meta Pixel). Nothing is loaded here, and no
// contact details (name, email, phone) are ever included.
export type FunnelEvent =
  | "LandingPageView"
  | "RegistrationStarted"
  | "RegistrationCompleted"
  | "WorkshopRegistration"
  | "SeminarRegistration"
  | "BothSessionsRegistration";

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  fbq?: (...args: unknown[]) => void;
};

export function trackFunnelEvent(event: FunnelEvent, properties: Record<string, string | number> = {}) {
  try {
    const target = window as AnalyticsWindow;
    const payload = { event, funnel: "retirement-income-explained-2026-11-12", ...properties };
    target.dataLayer?.push(payload);
    target.fbq?.("trackCustom", event, payload);
  } catch {
    // Analytics must never interrupt registration.
  }
}
