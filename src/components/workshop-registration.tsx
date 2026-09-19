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
          email: String(data.get("email") ?? ""),
          state: String(data.get("state") ?? ""),
          eventId: workshop.id,
          consent: data.get("consent") === "on",
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
        <strong>Registration received.</strong>
        <span>LLFG will send the event details to your email.</span>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <button className="button button-small workshop-register-button" type="button" onClick={() => setStatus("form")}>
        Reserve a seat
      </button>
    );
  }

  return (
    <form className="workshop-registration-form" onSubmit={submit}>
      <p className="registration-form-title">Reserve a seat for {workshop.date} at {workshop.time}</p>
      <div className="registration-field-grid">
        <label>
          <span>First name <small>(optional)</small></span>
          <input name="firstName" autoComplete="given-name" maxLength={80} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
        <label className="registration-field-full">
          <span>Your state</span>
          <select name="state" defaultValue="" required>
            <option value="" disabled>Select a state</option>
            {states.map((state) => <option key={state}>{state}</option>)}
          </select>
        </label>
      </div>
      <label className="form-consent">
        <input name="consent" type="checkbox" required />
        <span>I agree that LLFG may email me about this event registration.</span>
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error && <p className="form-alert" role="alert">{error}</p>}
      <div className="registration-actions">
        <button className="button button-small" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Saving…" : "Complete registration"}
        </button>
        <button className="text-button" type="button" onClick={() => { setError(""); setStatus("idle"); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
