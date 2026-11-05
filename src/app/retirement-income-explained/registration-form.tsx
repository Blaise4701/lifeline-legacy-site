"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { trackFunnelEvent } from "@/lib/funnel-analytics";
import {
  RIE_EMAIL_NOTICE,
  RIE_EVENT_ID,
  RIE_MARKETING_CONSENT_TEXT,
  RIE_SMS_CONSENT_TEXT,
  RIE_THANK_YOU_PATH,
  isRieSession,
  isSessionClosed,
  rieSessionKeys,
  rieSessions,
  type RieSessionKey,
} from "@/lib/retirement-income-explained";
import { SESSION_EVENT } from "./session-cta";
import styles from "./rie.module.css";

const completionEvent = {
  workshop: "WorkshopRegistration",
  seminar: "SeminarRegistration",
  both: "BothSessionsRegistration",
} as const;

function firstTouch() {
  try {
    return JSON.parse(window.sessionStorage.getItem("llfg:first-touch") || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export function RegistrationForm() {
  const router = useRouter();
  const [session, setSession] = useState<RieSessionKey | "">("");
  const [withGuest, setWithGuest] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closed, setClosed] = useState<Record<RieSessionKey, boolean>>({ workshop: false, seminar: false, both: false });
  const inFlight = useRef(false);
  const started = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const update = () => setClosed({
      workshop: isSessionClosed("workshop"),
      seminar: isSessionClosed("seminar"),
      both: isSessionClosed("both"),
    });
    const timer = window.setInterval(update, 30_000);
    // Read the clock and any ?session= preselection once, right after hydration.
    const initial = window.setTimeout(() => {
      update();
      const fromUrl = new URLSearchParams(window.location.search).get("session") ?? "";
      if (isRieSession(fromUrl)) setSession(fromUrl);
    }, 0);

    const onSelect = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (isRieSession(value)) setSession(value);
    };
    window.addEventListener(SESSION_EVENT, onSelect);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(initial);
      window.removeEventListener(SESSION_EVENT, onSelect);
    };
  }, []);

  const allClosed = rieSessionKeys.every((key) => closed[key]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackFunnelEvent("RegistrationStarted");
  };

  const fail = (message: string, field?: string, form?: HTMLFormElement) => {
    setError(message);
    if (field && form) (form.elements.namedItem(field) as HTMLElement | null)?.focus();
    else window.setTimeout(() => errorRef.current?.focus(), 0);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    const digits = phone.replace(/\D/g, "").length;

    if (!session) return fail("Choose the session you would like to attend.", "session", form);
    if (closed[session]) return fail(`The ${rieSessions[session].label} has already started. Please choose the Evening Seminar.`, "session", form);
    if (digits < 10 || digits > 15) return fail("Enter a mobile phone number with 10 to 15 digits.", "phone", form);

    inFlight.current = true;
    setSubmitting(true);
    setError("");

    const touch = firstTouch();
    const params = new URLSearchParams(window.location.search);
    const guests = withGuest
      ? [{
          firstName: String(data.get("guestFirstName") ?? ""),
          lastName: String(data.get("guestLastName") ?? ""),
          relationship: String(data.get("guestRelationship") ?? ""),
        }]
      : [];

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event-registration",
          eventId: RIE_EVENT_ID,
          session,
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone,
          state: "",
          guestCount: String(guests.length),
          guests,
          age50Plus: "",
          industryProfessional: "",
          consent: true,
          smsConsent: data.get("smsConsent") === "on",
          marketingConsent: data.get("marketingConsent") === "on",
          website: String(data.get("website") ?? ""),
          attribution: {
            source: params.get("utm_source") || params.get("source") || touch.source || "website",
            medium: params.get("utm_medium") || touch.medium || "",
            campaign: params.get("utm_campaign") || touch.campaign || "",
            eventId: RIE_EVENT_ID,
            landingPath: touch.landingPath || window.location.pathname,
            referrer: touch.referrer || document.referrer,
          },
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        alreadyRegistered?: boolean;
        session?: RieSessionKey | null;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your registration could not be saved. Please try again.");
      }

      const confirmed = result.session && isRieSession(result.session) ? result.session : session;
      if (!result.alreadyRegistered) {
        trackFunnelEvent("RegistrationCompleted", { session: confirmed, seats: 1 + guests.length });
        trackFunnelEvent(completionEvent[confirmed], { seats: 1 + guests.length });
      }
      const query = new URLSearchParams({ session: confirmed });
      if (result.alreadyRegistered) query.set("status", "existing");
      if (guests.length) query.set("guest", "1");
      router.push(`${RIE_THANK_YOU_PATH}?${query.toString()}`);
    } catch (submissionError) {
      fail(submissionError instanceof Error ? submissionError.message : "Your registration could not be saved. Please try again.");
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  if (allClosed) {
    return (
      <div className={styles.formCard} id="register">
        <h2 className={styles.formTitle}>Registration is closed</h2>
        <p>Thank you for your interest. Online registration for this event has closed. For questions, call <a href="tel:+19727648516">972-764-8516</a>.</p>
      </div>
    );
  }

  return (
    <form
      className={styles.formCard}
      id="register"
      onSubmit={submit}
      onFocus={markStarted}
      aria-labelledby="rie-form-title"
      aria-busy={submitting}
      noValidate={false}
    >
      <p className={styles.formKicker}>Free admission · Registration required</p>
      <h2 className={styles.formTitle} id="rie-form-title">Reserve Your Free Seat</h2>
      <p className={styles.formIntro}>Choose your session and receive your registration confirmation.</p>

      <fieldset className={styles.sessionPicker}>
        <legend>Choose your session <span aria-hidden="true">*</span></legend>
        {rieSessionKeys.map((key) => {
          const item = rieSessions[key];
          return (
            <label key={key} className={styles.sessionOption} data-disabled={closed[key] || undefined}>
              <input
                type="radio"
                name="session"
                value={key}
                checked={session === key}
                disabled={closed[key] || submitting}
                onChange={() => setSession(key)}
                required
              />
              <span>
                <strong>{item.label}</strong>
                <small>{closed[key] ? "Session has started" : item.time}</small>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className={styles.fieldGrid}>
        <label>
          <span>First name *</span>
          <input id="rie-first-name" name="firstName" autoComplete="given-name" maxLength={80} required />
        </label>
        <label>
          <span>Last name *</span>
          <input name="lastName" autoComplete="family-name" maxLength={80} required />
        </label>
        <label className={styles.full}>
          <span>Email address *</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} required />
        </label>
        <label className={styles.full}>
          <span>Mobile phone number *</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            pattern="[+0-9(). \-]{10,40}"
            title="Enter a phone number with at least 10 digits."
            required
          />
        </label>
      </div>

      <label className={styles.checkRow}>
        <input type="checkbox" name="bringGuest" checked={withGuest} onChange={(event) => setWithGuest(event.target.checked)} disabled={submitting} />
        <span>I’d like to bring one guest (spouse, partner, family member, or friend)</span>
      </label>

      {withGuest && (
        <fieldset className={styles.guestBox}>
          <legend>Guest details</legend>
          <div className={styles.fieldGrid}>
            <label>
              <span>Guest first name *</span>
              <input name="guestFirstName" autoComplete="off" maxLength={80} required />
            </label>
            <label>
              <span>Guest last name *</span>
              <input name="guestLastName" autoComplete="off" maxLength={80} required />
            </label>
            <label className={styles.full}>
              <span>Relationship (optional)</span>
              <select name="guestRelationship" defaultValue="">
                <option value="">Select if you’d like</option>
                <option value="Spouse/Partner">Spouse/Partner</option>
                <option value="Family member">Family member</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          <p className={styles.fieldHint}>Your guest attends the same session as you and is included in your seat count. We only contact you, not your guest.</p>
        </fieldset>
      )}

      <div className={styles.consents}>
        <label className={styles.checkRow}>
          <input type="checkbox" name="smsConsent" disabled={submitting} />
          <span><strong>Text reminders (optional).</strong> {RIE_SMS_CONSENT_TEXT}</span>
        </label>
        <label className={styles.checkRow}>
          <input type="checkbox" name="marketingConsent" disabled={submitting} />
          <span><strong>Future education (optional).</strong> {RIE_MARKETING_CONSENT_TEXT}</span>
        </label>
      </div>

      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {error && (
        <p className={styles.formError} role="alert" tabIndex={-1} ref={errorRef}>{error}</p>
      )}

      <button className={`button ${styles.submit}`} type="submit" disabled={submitting}>
        {submitting ? "Confirming your registration…" : "Confirm My Free Registration"}
      </button>

      <p className={styles.legalNote}>
        {RIE_EMAIL_NOTICE} See our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms</Link>.
        We never ask for account numbers or Social Security numbers.
      </p>
    </form>
  );
}
