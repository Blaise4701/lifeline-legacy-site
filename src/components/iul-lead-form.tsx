"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { licensedStateCodes, states } from "@/lib/site-data";

type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  eventId?: string;
  landingPath?: string;
  referrer?: string;
};

const ATTRIBUTION_KEY = "llfg:first-touch";

function readAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? JSON.parse(raw) as Attribution : {};
  } catch {
    return {};
  }
}

export function IulLeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [attribution, setAttribution] = useState<Attribution>({});

  useEffect(() => {
    setAttribution(readAttribution());
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    const data = new FormData(event.currentTarget);
    const payload = {
      type: "iul-strategy-lead",
      firstName: String(data.get("firstName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      state: String(data.get("state") ?? ""),
      emailConsent: data.get("emailConsent") === "on",
      smsConsent: data.get("smsConsent") === "on",
      website: String(data.get("website") ?? ""),
      attribution,
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; message?: string; bookingUrl?: string | null };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your request could not be saved.");
      }

      setBookingUrl(result.bookingUrl || "");
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Your request could not be saved.");
    }
  }

  if (status === "success") {
    return (
      <div className="iul-lead-success" aria-live="polite">
        <p className="eyebrow">Request received</p>
        <h2>Your next step is simple.</h2>
        <p>
          We have your information. Choose a time for a complimentary Continuity Review and we can
          look at where an IUL may or may not fit alongside the retirement pieces you already have.
        </p>
        {bookingUrl ? (
          <a className="button" href={bookingUrl} target="_blank" rel="noreferrer">
            Choose a review time
          </a>
        ) : (
          <Link className="button" href="/continuity-review?path=retirement&source=iul">
            Continue to scheduling
          </Link>
        )}
      </div>
    );
  }

  return (
    <form className="iul-lead-form" onSubmit={submit} id="hero-form">
      <div className="iul-form-heading">
        <p className="eyebrow">Complimentary strategy review</p>
        <h2>
          See if an IUL deserves a place<span className="iul-desktop-break"><br /></span>
          in your retirement plan.
        </h2>
        <p>Start with a few basics. No account numbers or financial statements required.</p>
      </div>

      <div className="iul-form-grid">
        <label>
          <span>First name</span>
          <input name="firstName" autoComplete="given-name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Mobile phone</span>
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
        <label>
          <span>State</span>
          <select name="state" defaultValue="" required>
            <option value="" disabled>Select state</option>
            {states.map((state) => <option key={state}>{state}</option>)}
          </select>
        </label>
      </div>

      <p className="iul-state-note">Currently available in: {licensedStateCodes.join(", ")}.</p>

      <label className="iul-consent">
        <input name="emailConsent" type="checkbox" required />
        <span>
          I agree that LLFG may email me about this request and appointment. See the{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>
      <label className="iul-consent">
        <input name="smsConsent" type="checkbox" />
        <span>
          I agree to receive non-marketing texts about this request, scheduling, and reminders.
          Message and data rates may apply. Reply STOP to opt out.
        </span>
      </label>

      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {error && <p className="form-alert" role="alert">{error}</p>}

      <button className="button iul-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "See if an IUL may fit"}
      </button>
      <p className="iul-form-trust">No obligation. Educational conversation. Product suitability varies by individual.</p>
    </form>
  );
}
