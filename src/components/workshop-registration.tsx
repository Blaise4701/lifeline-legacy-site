"use client";

import { FormEvent, useRef, useState } from "react";
import { states } from "@/lib/site-data";

type WorkshopRegistrationProps = {
  workshop: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
  };
};

type RegistrationState = "idle" | "form" | "submitting" | "submitted";

export function WorkshopRegistration({ workshop }: WorkshopRegistrationProps) {
  const [status, setStatus] = useState<RegistrationState>("idle");
  const [error, setError] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const submitting = useRef(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "");
    const digitCount = phone.replace(/\D/g, "").length;
    if (digitCount < 10 || digitCount > 15) {
      setError("Enter a mobile number with 10 to 15 digits.");
      (form.elements.namedItem("phone") as HTMLInputElement | null)?.focus();
      return;
    }
    submitting.current = true;
    setError("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event-registration",
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone,
          state: String(data.get("state") ?? ""),
          guestCount: String(data.get("guestCount") ?? "0"),
          guests: Array.from({ length: Number(data.get("guestCount") ?? 0) }, (_, index) => ({
            firstName: String(data.get(`guestFirstName${index + 1}`) ?? ""),
            lastName: String(data.get(`guestLastName${index + 1}`) ?? ""),
            relationship: String(data.get(`guestRelationship${index + 1}`) ?? ""),
          })),
          age50Plus: String(data.get("age50Plus") ?? ""),
          industryProfessional: String(data.get("industryProfessional") ?? ""),
          eventId: workshop.id,
          consent: data.get("consent") === "on",
          smsConsent: data.get("smsConsent") === "on",
          website: String(data.get("website") ?? ""),
        }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; alreadyRegistered?: boolean };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Registration could not be saved.");
      }

      form.reset();
      setGuestCount(0);
      setAlreadyRegistered(result.alreadyRegistered === true);
      setStatus("submitted");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Registration could not be saved. Please try again.",
      );
      setStatus("form");
    } finally {
      submitting.current = false;
    }
  };

  if (status === "submitted") {
    return (
      <div className="registration-confirmation" role="status">
        <strong>{alreadyRegistered ? "Your seat is already reserved." : "Your seat is reserved."}</strong>
        <span>{workshop.title} · {workshop.date} · {workshop.time} · {workshop.location}. {alreadyRegistered ? "To change your guest details, contact LLFG directly." : "Save these details for your visit."}</span>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <button className="button button-small workshop-register-button" type="button" onClick={() => setStatus("form")}>
        Reserve My Seat
      </button>
    );
  }

  return (
    <form className="workshop-registration-form premium-registration-form" onSubmit={submit} aria-busy={status === "submitting"}>
      <header className="premium-registration-header">
        <p className="registration-kicker">Reserve your seat</p>
        <h4>{workshop.title}</h4>
        <p>{workshop.date} · {workshop.time}</p>
        <p>{workshop.location} · {workshop.address}</p>
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
            <input name="phone" type="tel" autoComplete="tel" inputMode="tel" minLength={10} maxLength={40} pattern="[+0-9(). -]{10,40}" title="Enter a valid phone number with at least 10 digits." required />
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
          <select
            name="guestCount"
            value={String(guestCount)}
            onChange={(event) => setGuestCount(Number(event.target.value))}
            required
          >
            <option value="0">No guest</option>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
          </select>
        </label>

        {guestCount > 0 && (
          <div className="guest-details-list">
            {Array.from({ length: guestCount }, (_, index) => (
              <fieldset className="guest-details-card" key={index}>
                <legend>Guest {index + 1}</legend>
                <div className="registration-field-grid premium-registration-grid">
                  <label>
                    <span>First name</span>
                    <input
                      name={`guestFirstName${index + 1}`}
                      autoComplete="off"
                      maxLength={80}
                      required
                    />
                  </label>
                  <label>
                    <span>Last name</span>
                    <input
                      name={`guestLastName${index + 1}`}
                      autoComplete="off"
                      maxLength={80}
                      required
                    />
                  </label>
                  <label className="registration-field-full">
                    <span>Relationship <small>(optional)</small></span>
                    <select name={`guestRelationship${index + 1}`} defaultValue="">
                      <option value="">Select if you’d like</option>
                      <option value="Spouse/Partner">Spouse/Partner</option>
                      <option value="Family member">Family member</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>
              </fieldset>
            ))}
          </div>
        )}
      </section>

      <section className="registration-step" aria-labelledby={`registration-step-3-${workshop.id}`}>
        <div className="registration-step-heading">
          <span aria-hidden="true">3</span>
          <h5 id={`registration-step-3-${workshop.id}`}>Tell us a little more.</h5>
        </div>
        <div className="registration-question-stack">
          <fieldset className="registration-radio-group">
            <legend>Is this seminar for someone age 50 or older?</legend>
            <div className="registration-radio-options">
              <label><input type="radio" name="age50Plus" value="yes" required /> <span>Yes</span></label>
              <label><input type="radio" name="age50Plus" value="no" /> <span>No</span></label>
              <label><input type="radio" name="age50Plus" value="prefer-not-to-say" /> <span>Prefer not to say</span></label>
            </div>
          </fieldset>
          <fieldset className="registration-radio-group">
            <legend>Are you a financial advisor, insurance agent, or broker?</legend>
            <div className="registration-radio-options">
              <label><input type="radio" name="industryProfessional" value="no" required /> <span>No</span></label>
              <label><input type="radio" name="industryProfessional" value="yes" /> <span>Yes</span></label>
            </div>
          </fieldset>
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
          {status === "submitting" ? "Reserving…" : "Reserve My Seat"}
        </button>
        <button className="text-button" type="button" disabled={status === "submitting"} onClick={() => { setError(""); setStatus("idle"); }}>
          Cancel
        </button>
      </div>

      <p className="registration-privacy-note">Your information is used for this event registration and the communication permissions you select.</p>
    </form>
  );
}
