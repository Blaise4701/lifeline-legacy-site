"use client";

import { FormEvent, useState } from "react";
import { states } from "@/lib/site-data";

type WorkshopRegistrationProps = {
  workshop: {
    id: string;
    title: string;
    date: string;
    time: string;
  };
};

type RegistrationState = "idle" | "form" | "submitting" | "submitted";

export function WorkshopRegistration({ workshop }: WorkshopRegistrationProps) {
  const [status, setStatus] = useState<RegistrationState>("idle");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event-registration",
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          state: String(data.get("state") ?? ""),
          guestCount: String(data.get("guestCount") ?? "0"),
          age50Plus: String(data.get("age50Plus") ?? ""),
          industryProfessional: String(data.get("industryProfessional") ?? ""),
          eventId: workshop.id,
          consent: data.get("consent") === "on",
          smsConsent: data.get("smsConsent") === "on",
          website: String(data.get("website") ?? ""),
        }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Registration could not be saved.");
      }

      form.reset();
      setStatus("submitted");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Registration could not be saved. Please try again.",
      );
      setStatus("form");
    }
  };

  if (status === "submitted") {
    return (
      <div className="registration-confirmation" role="status">
        <strong>Your seat is reserved.</strong>
        <span>We’ll send the event details and confirmation to your email.</span>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <button className="button button-small workshop-register-button" type="button" onClick={() => setStatus("form")}>
        Reserve my seat
      </button>
    );
  }

  return (
    <form className="workshop-registration-form premium-registration-form" onSubmit={submit}>
      <header className="premium-registration-header">
        <p className="registration-kicker">Reserve your seat</p>
        <h4>{workshop.title}</h4>
        <p>{workshop.date} · {workshop.time}</p>
        <span>Registration takes about a minute.</span>
      </header>

      <section className="registration-step" aria-labelledby={`registration-step-1-${workshop.id}`}>
        <div className="registration-step-heading">
          <span aria-hidden="true">1</span>
          <h5 id={`registration-step-1-${workshop.id}`}>Tell us about yourself.</h5>
        </div>
        <div className="registration-field-grid premium-registration-grid">
          <label>
            <span>First name</span>
            <input name="firstName" autoComplete="given-name" maxLength={80} required />
          </label>
          <label>
            <span>Last name</span>
            <input name="lastName" autoComplete="family-name" maxLength={80} required />
          </label>
          <label>
            <span>Preferred email</span>
            <input name="email" type="email" autoComplete="email" maxLength={254} required />
          </label>
          <label>
            <span>Mobile phone</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={40} required />
          </label>
          <label className="registration-field-full">
            <span>Your state</span>
            <select name="state" defaultValue="" required>
              <option value="" disabled>Select a state</option>
              {states.map((state) => <option key={state}>{state}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="registration-step" aria-labelledby={`registration-step-2-${workshop.id}`}>
        <div className="registration-step-heading">
          <span aria-hidden="true">2</span>
          <h5 id={`registration-step-2-${workshop.id}`}>Will you be bringing a guest?</h5>
        </div>
        <label className="premium-select-label">
          <span>Number of guests</span>
          <select name="guestCount" defaultValue="0" required>
            <option value="0">No guest</option>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
          </select>
        </label>
      </section>

      <section className="registration-step" aria-labelledby={`registration-step-3-${workshop.id}`}>
        <div className="registration-step-heading">
          <span aria-hidden="true">3</span>
          <h5 id={`registration-step-3-${workshop.id}`}>Tell us a little more.</h5>
        </div>
        <div className="registration-question-stack">
          <label>
            <span>Is the primary attendee age 50 or older?</span>
            <select name="age50Plus" defaultValue="" required>
              <option value="" disabled>Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </label>
          <label>
            <span>Are you a financial advisor, insurance agent, or broker?</span>
            <select name="industryProfessional" defaultValue="" required>
              <option value="" disabled>Select an answer</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>
      </section>

      <div className="registration-consents">
        <label className="form-consent premium-consent">
          <input name="consent" type="checkbox" required />
          <span>I agree that LLFG may email me about this event registration and related event details.</span>
        </label>
        <label className="form-consent premium-consent">
          <input name="smsConsent" type="checkbox" />
          <span>I agree that LLFG may text me event confirmations and reminders. Message and data rates may apply.</span>
        </label>
      </div>

      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {error && <p className="form-alert" role="alert">{error}</p>}

      <div className="registration-actions premium-registration-actions">
        <button className="button registration-submit-button" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Reserving…" : "Reserve my seat"}
        </button>
        <button className="text-button" type="button" onClick={() => { setError(""); setStatus("idle"); }}>
          Cancel
        </button>
      </div>

      <p className="registration-privacy-note">Your information is used for this event registration and the communication permissions you select.</p>
    </form>
  );
}
