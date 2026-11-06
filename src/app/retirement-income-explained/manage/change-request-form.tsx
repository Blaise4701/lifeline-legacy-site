"use client";

import { FormEvent, useRef, useState } from "react";
import styles from "../rie.module.css";

const options = [
  { value: "cancel", label: "Cancel my registration" },
  { value: "workshop", label: "Change to the Afternoon Workshop (2:00 PM to 5:00 PM)" },
  { value: "seminar", label: "Change to the Evening Seminar (5:00 PM to 7:00 PM)" },
  { value: "both", label: "Change to Both Sessions (2:00 PM to 7:00 PM)" },
  { value: "guest", label: "Add, change, or remove a guest" },
  { value: "other", label: "Something else" },
] as const;

export function ChangeRequestForm() {
  const [request, setRequest] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  const needsDetails = request === "guest" || request === "other";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const data = new FormData(event.currentTarget);
    if (!request) {
      setError("Choose what you would like to change.");
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event-change-request",
          firstName: String(data.get("firstName") ?? ""),
          email: String(data.get("email") ?? ""),
          request,
          details: String(data.get("details") ?? ""),
          website: String(data.get("website") ?? ""),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "Your request could not be sent. Please call 972-764-8516.");
      setMessage(result.message || "Thank you. We have received your request.");
      setStatus("done");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Your request could not be sent. Please call 972-764-8516.");
      setStatus("idle");
      inFlight.current = false;
    }
  };

  if (status === "done") {
    return (
      <div className={styles.sessionBadge} role="status">
        <strong>Request received</strong>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={status === "sending"}>
      <div className={styles.fieldGrid}>
        <label>
          <span>First name</span>
          <input name="firstName" autoComplete="given-name" maxLength={80} />
        </label>
        <label>
          <span>Email you registered with *</span>
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
      </div>

      <fieldset className={styles.sessionPicker}>
        <legend>What would you like to do? *</legend>
        {options.map((option) => (
          <label key={option.value} className={styles.sessionOption}>
            <input
              type="radio"
              name="request"
              value={option.value}
              checked={request === option.value}
              onChange={() => setRequest(option.value)}
              required
            />
            <span><strong>{option.label}</strong></span>
          </label>
        ))}
      </fieldset>

      <div className={styles.fieldGrid}>
        <label className={styles.full}>
          <span>{needsDetails ? "Details *" : "Details (optional)"}</span>
          <input name="details" maxLength={500} required={needsDetails} placeholder={request === "guest" ? "Guest's first and last name, or 'remove guest'" : ""} />
        </label>
      </div>

      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {error && <p className={styles.formError} role="alert">{error}</p>}

      <button className={`button ${styles.submit}`} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send my request"}
      </button>
      <p className={styles.legalNote}>
        We confirm every change personally by email or phone. Until we do, please treat your current registration as unchanged.
        Prefer to talk? Call 972-764-8516.
      </p>
    </form>
  );
}
