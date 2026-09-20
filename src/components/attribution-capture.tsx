"use client";

import { useEffect } from "react";

const ATTRIBUTION_KEY = "llfg:first-touch";

function clean(value: string | null, max = 120) {
  return (value ?? "").trim().slice(0, max);
}

function inferSource(params: URLSearchParams) {
  const explicit = clean(params.get("source") || params.get("utm_source"), 60);
  if (explicit) return explicit.toLowerCase();

  if (!document.referrer) return "direct";

  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host.includes("google.")) return "organic";
    if (host.includes("facebook.") || host.includes("instagram.")) return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

export function AttributionCapture() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATTRIBUTION_KEY)) return;

      const params = new URLSearchParams(window.location.search);
      const payload = {
        source: inferSource(params),
        campaign: clean(params.get("utm_campaign"), 100),
        eventId: clean(params.get("event"), 80),
        landingPath: window.location.pathname,
        referrer: clean(document.referrer, 240),
        capturedAt: new Date().toISOString(),
      };

      window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(payload));
    } catch {
      // Attribution is helpful, never required for the visitor journey.
    }
  }, []);

  return null;
}
