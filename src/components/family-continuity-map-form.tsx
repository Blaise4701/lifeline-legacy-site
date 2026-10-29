"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { MAP_EMAIL_CONSENT_TEXT, MAP_SMS_CONSENT_TEXT } from "@/lib/family-continuity-map";

type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  landingPath?: string;
  referrer?: string;
};

function firstTouch(): Attribution {
  try {
    return JSON.parse(window.sessionStorage.getItem("llfg:first-touch") || "{}") as Attribution;
  } catch {
    return {};
  }
}

export function FamilyContinuityMapForm({
  buttonLabel = "Send Me the Family Continuity Map",
  ready,
}: {
  buttonLabel?: string;
  ready: boolean;
}) {
  const router = useRouter();
  const submitting = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !ready) return;
    submitting.current = true;
    setIsSubmitting(true);
    setError("");

    const fields = new FormData(event.currentTarget);
    const query = new URLSearchParams(window.location.search);
    const stored = firstTouch();
    const data = {
      type: "family-continuity-map-optin",
      firstName: String(fields.get("firstName") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      phone: String(fields.get("phone") || "").trim(),
      emailConsent: fields.get("emailConsent") === "on",
      smsConsent: fields.get("smsConsent") === "on",
      website: String(fields.get("website") || ""),
      attribution: {
        source: query.get("utm_source") || query.get("source") || stored.source || "website",
        medium: query.get("utm_medium") || stored.medium || "",
        campaign: query.get("utm_campaign") || stored.campaign || "",
        landingPath: window.location.pathname,
        referrer: stored.referrer || document.referrer,
      },
    };

    if (data.smsConsent && !data.phone) {
      setError("Enter your mobile number before choosing text messages.");
      setIsSubmitting(false);
      submitting.current = false;
      return;
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We could not send your Map request. Please try again.");
      }
      router.push("/family-continuity-map/thank-you");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your Map request. Please try again.");
      setIsSubmitting(false);
      submitting.current = false;
    }
  }

  return (
    <form className="map-form" onSubmit={onSubmit} aria-label="Request the Family Continuity Map">
      <p className="eyebrow">Your free worksheet</p>
      <h3>Get the Map in your inbox.</h3>
      <div className="map-form-fields">
        <label htmlFor="map-first-name">First name <span aria-hidden="true">*</span>
          <input id="map-first-name" name="firstName" autoComplete="given-name" maxLength={80} required />
        </label>
        <label htmlFor="map-email">Email address <span aria-hidden="true">*</span>
          <input id="map-email" name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
        <label htmlFor="map-phone">Mobile number <span className="map-optional">optional</span>
          <input id="map-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
      </div>
      <label className="map-consent">
        <input type="checkbox" name="emailConsent" required />
        <span>{MAP_EMAIL_CONSENT_TEXT}</span>
      </label>
      <label className="map-consent">
        <input type="checkbox" name="smsConsent" disabled={!phone.trim()} />
        <span>{MAP_SMS_CONSENT_TEXT}</span>
      </label>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="map-website">Leave this empty</label>
        <input id="map-website" name="website" autoComplete="off" tabIndex={-1} />
      </div>
      {error && <p className="form-alert" role="alert">{error}</p>}
      {!ready && <p className="map-unavailable" role="status">Email delivery is being prepared. Please check back shortly.</p>}
      <button className="button button-gold map-submit" type="submit" disabled={!ready || isSubmitting}>
        {isSubmitting ? "Sending your request..." : buttonLabel}
      </button>
      <p className="map-form-note">Free. Educational. No pitch. Unsubscribe anytime.</p>
      <p className="map-privacy">Your completed Map stays with you. Lifeline Legacy does not collect the personal information you write inside it. <Link href="/privacy">Privacy policy</Link></p>
    </form>
  );
}
