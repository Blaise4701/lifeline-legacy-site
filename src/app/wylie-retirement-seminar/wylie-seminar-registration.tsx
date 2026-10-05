"use client";

import { FormEvent, useRef, useState } from "react";
import styles from "./wylie.module.css";

type Status = "idle" | "submitting" | "submitted";

export function WylieSeminarRegistration() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const submitting = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "");
    const digits = phone.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 15) {
      setError("Please enter a valid mobile number.");
      (form.elements.namedItem("phone") as HTMLInputElement | null)?.focus();
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setError("");

    try {
      const guests = Array.from({ length: guestCount }, (_, index) => ({
        firstName: String(data.get(`guestFirstName${index + 1}`) ?? ""),
        lastName: String(data.get(`guestLastName${index + 1}`) ?? ""),
        relationship: index === 0 ? "Spouse/Partner" : "Family member",
      }));

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event-registration",
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone,
          state: "Texas",
          guestCount: String(guestCount),
          guests,
          age50Plus: "yes",
          industryProfessional: data.get("industryProfessional") === "on" ? "yes" : "no",
          eventId: "wylie-october-12",
          consent: data.get("consent") === "on",
          smsConsent: data.get("smsConsent") === "on",
          website: String(data.get("website") ?? ""),
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        alreadyRegistered?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We could not reserve your seat. Please try again.");
      }

      setAlreadyRegistered(result.alreadyRegistered === true);
      setStatus("submitted");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not reserve your seat. Please try again.");
      setStatus("idle");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "submitted") {
    return (
      <div className={styles.successCard} role="status">
        <span className={styles.successIcon}>✓</span>
        <p className={styles.formEyebrow}>You&apos;re registered</p>
        <h3>{alreadyRegistered ? "Your seat was already reserved." : "Your seat is reserved."}</h3>
        <p>Monday, October 12 at 6:00 PM<br />Rita &amp; Truett Smith Public Library in Wylie.</p>
        <p className={styles.successSmall}>Watch your email for event details and reminders.</p>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={onSubmit} aria-busy={status === "submitting"}>
      <div className={styles.formHeading}>
        <p className={styles.formEyebrow}>Free educational seminar</p>
        <h2>Reserve Your Seat</h2>
        <p>Monday, October 12 · 6:00 PM · Wylie, TX</p>
      </div>

      <div className={styles.fieldGrid}>
        <label>
          <span>First name</span>
          <input name="firstName" autoComplete="given-name" maxLength={80} required />
        </label>
        <label>
          <span>Last name</span>
          <input name="lastName" autoComplete="family-name" maxLength={80} required />
        </label>
        <label className={styles.fieldFull}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
        <label className={styles.fieldFull}>
          <span>Mobile phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            placeholder="(555) 555-5555"
            required
          />
        </label>
      </div>

      <label className={styles.selectLabel}>
        <span>Will anyone attend with you?</span>
        <select
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          aria-label="Number of guests"
        >
          <option value={0}>No, just me</option>
          <option value={1}>Yes, 1 guest</option>
          <option value={2}>Yes, 2 guests</option>
        </select>
      </label>

      {guestCount > 0 && (
        <div className={styles.guestArea}>
          {Array.from({ length: guestCount }, (_, index) => (
            <div className={styles.guestRow} key={index}>
              <strong>Guest {index + 1}</strong>
              <input
                name={`guestFirstName${index + 1}`}
                placeholder="First name"
                aria-label={`Guest ${index + 1} first name`}
                maxLength={80}
                required
              />
              <input
                name={`guestLastName${index + 1}`}
                placeholder="Last name"
                aria-label={`Guest ${index + 1} last name`}
                maxLength={80}
                required
              />
            </div>
          ))}
        </div>
      )}

      <label className={styles.checkRow}>
        <input name="ageConfirmed" type="checkbox" required />
        <span>I confirm this registration is for someone age 50 or older.</span>
      </label>

      <label className={styles.checkRow}>
        <input name="industryProfessional" type="checkbox" />
        <span>I am a financial advisor, insurance agent, or broker.</span>
      </label>

      <div className={styles.consentBox}>
        <label className={styles.checkRow}>
          <input name="consent" type="checkbox" required />
          <span>I agree that LLFG may email me about this registration and event details.</span>
        </label>
        <label className={styles.checkRow}>
          <input name="smsConsent" type="checkbox" />
          <span>Text me event confirmations and reminders. Message and data rates may apply.</span>
        </label>
      </div>

      <label className={styles.honeypot} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <button className={styles.submitButton} type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Reserving Your Seat..." : "Reserve My Free Seat"}
      </button>

      <p className={styles.formFinePrint}>No charge to attend. Seating is limited. No products will be sold at this event.</p>
    </form>
  );
}
