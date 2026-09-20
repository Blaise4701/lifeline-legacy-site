"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { licensedStateCodes, licensedStates, states } from "@/lib/site-data";

type Pathway = "Retirement" | "Family" | "Business";
type Step = "contact" | "prepare" | "unavailable" | "calendar";

type ContactData = {
  firstName: string;
  email: string;
  phone: string;
  state: string;
  pathway: Pathway;
  emailConsent: boolean;
  smsConsent: boolean;
  marketingEmailConsent: boolean;
  website: string;
};

type CheckupContext = {
  pathway: Pathway;
  summaries: {
    continuity: string;
    certainty: string;
    legacy: string;
  };
  learningInterest: string;
  capturedAt: string;
};

type Attribution = {
  source?: string;
  campaign?: string;
  eventId?: string;
  landingPath?: string;
  referrer?: string;
  capturedAt?: string;
};

const PATHWAYS: Pathway[] = ["Retirement", "Family", "Business"];
const ATTRIBUTION_KEY = "llfg:first-touch";
const CHECKUP_KEY = "llfg:checkup-context";

const prepOptions: Record<Pathway, {
  stageLabel: string;
  stageOptions: string[];
  concernOptions: string[];
  planLabel: string;
  planOptions: string[];
}> = {
  Retirement: {
    stageLabel: "Where are you in your retirement journey?",
    stageOptions: [
      "More than 10 years from retirement",
      "6–10 years from retirement",
      "Within 5 years of retirement",
      "Retiring now",
      "Already retired",
    ],
    concernOptions: [
      "Creating dependable retirement income",
      "Social Security or pension timing",
      "Coordinating several retirement accounts",
      "Taxes and withdrawal order",
      "Healthcare or long-term care",
      "Survivor income and legacy",
    ],
    planLabel: "Do you currently have a written retirement income plan?",
    planOptions: ["Yes, and it is current", "Yes, but it needs updating", "Partly", "No", "I’m not sure"],
  },
  Family: {
    stageLabel: "What best describes why you are reviewing your family plan now?",
    stageOptions: [
      "Growing or changing family responsibilities",
      "Reviewing existing protection",
      "Updating beneficiaries or documents",
      "A recent life or income change",
      "General planning and organization",
    ],
    concernOptions: [
      "Keeping income flowing if life changes",
      "Protecting dependents and obligations",
      "Coordinating insurance and workplace benefits",
      "Beneficiaries and estate documents",
      "College or family goals",
      "Creating a clearer legacy plan",
    ],
    planLabel: "Do you have a written family continuity plan your household could follow?",
    planOptions: ["Yes, and it is current", "Some pieces are written down", "Mostly informal", "No", "I’m not sure"],
  },
  Business: {
    stageLabel: "What best describes your business planning stage?",
    stageOptions: [
      "Actively growing the business",
      "Reviewing owner and key-person protection",
      "Preparing for succession or sale",
      "Preparing for owner retirement",
      "A recent ownership or leadership change",
    ],
    concernOptions: [
      "Owner interruption",
      "Key-person risk",
      "Buy-sell or succession planning",
      "Business obligations and cash flow",
      "Owner retirement income",
      "Coordinating business and family legacy",
    ],
    planLabel: "Do you have a current written business continuity or succession plan?",
    planOptions: ["Yes, and it is current", "Yes, but it needs updating", "Partly", "No", "I’m not sure"],
  },
};

function queryPathway(value: string | null): Pathway | null {
  const normalized = (value ?? "").toLowerCase();
  if (normalized === "retirement") return "Retirement";
  if (normalized === "family" || normalized === "estate") return "Family";
  if (normalized === "business") return "Business";
  return null;
}

function readSession<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

export function ContinuityReviewForm() {
  const params = useSearchParams();
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState<ContactData | null>(null);
  const [checkup, setCheckup] = useState<CheckupContext | null>(null);
  const [attribution, setAttribution] = useState<Attribution>({});
  const [defaultPathway, setDefaultPathway] = useState<Pathway>("Retirement");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingUrl, setBookingUrl] = useState("");

  useEffect(() => {
    const storedCheckup = readSession<CheckupContext>(CHECKUP_KEY);
    const storedAttribution = readSession<Attribution>(ATTRIBUTION_KEY);
    const fromQuery = queryPathway(params.get("path"));

    if (storedCheckup) setCheckup(storedCheckup);
    if (storedAttribution) setAttribution(storedAttribution);
    setDefaultPathway(fromQuery ?? storedCheckup?.pathway ?? "Retirement");
  }, [params]);

  const prep = useMemo(
    () => prepOptions[contact?.pathway ?? defaultPathway],
    [contact?.pathway, defaultPathway],
  );

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pathway = String(data.get("pathway") ?? "") as Pathway;
    const nextContact: ContactData = {
      firstName: String(data.get("firstName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      state: String(data.get("state") ?? ""),
      pathway,
      emailConsent: data.get("emailConsent") === "on",
      smsConsent: data.get("smsConsent") === "on",
      marketingEmailConsent: data.get("marketingEmailConsent") === "on",
      website: String(data.get("website") ?? ""),
    };

    if (!nextContact.firstName) {
      setFormError("Enter your first name to continue.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(nextContact.email)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (!states.includes(nextContact.state as (typeof states)[number])) {
      setFormError("Choose your state.");
      return;
    }
    if (!PATHWAYS.includes(pathway)) {
      setFormError("Choose the planning area you want to review.");
      return;
    }
    if (!nextContact.emailConsent) {
      setFormError("Confirm that LLFG may email you about this Review request.");
      return;
    }

    setFormError("");

    if (!(licensedStates as readonly string[]).includes(nextContact.state)) {
      setContact(nextContact);
      setStep("unavailable");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "continuity-review-start",
          ...nextContact,
          attribution: {
            ...attribution,
            source: params.get("source") || attribution.source || "website",
            eventId: params.get("event") || attribution.eventId || "",
          },
        }),
      });
      const result = await response.json() as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your Review request could not be saved.");
      }

      setContact(nextContact);
      setStep("prepare");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Your Review request could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitPreparation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact) return;

    const data = new FormData(event.currentTarget);
    const shareCheckup = data.get("shareCheckup") === "on";
    const stage = String(data.get("stage") ?? "");
    const primaryConcern = String(data.get("primaryConcern") ?? "");
    const planStatus = String(data.get("planStatus") ?? "");
    const whatWouldHelp = String(data.get("whatWouldHelp") ?? "").trim();

    if (!stage || !primaryConcern || !planStatus) {
      setFormError("Answer the three preparation questions to continue.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "continuity-review-complete",
          ...contact,
          stage,
          primaryConcern,
          planStatus,
          whatWouldHelp,
          shareCheckup,
          checkup: shareCheckup ? checkup : null,
          attribution: {
            ...attribution,
            source: params.get("source") || attribution.source || "website",
            eventId: params.get("event") || attribution.eventId || "",
          },
        }),
      });
      const result = await response.json() as {
        ok?: boolean;
        message?: string;
        bookingUrl?: string | null;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your Review preparation could not be saved.");
      }

      setBookingUrl(result.bookingUrl ?? "");
      setStep("calendar");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Your Review preparation could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "unavailable") {
    return (
      <section className="review-journey-card" aria-live="polite">
        <p className="eyebrow">Availability</p>
        <h2>Keep learning with Lifeline Legacy.</h2>
        <p>
          A Continuity Review is not currently available in {contact?.state}. Nothing was sent to LLFG and you have not been added to a list.
          The Checkup and educational resources remain available.
        </p>
        <div className="button-row">
          <Link className="button" href="/learn">Visit the learning center</Link>
          <Link className="button button-outline" href="/checkup">Take the Continuity Checkup</Link>
        </div>
      </section>
    );
  }

  if (step === "calendar") {
    return (
      <section className="review-journey-card review-calendar" aria-live="polite">
        <p className="eyebrow">Review request complete</p>
        <h2>Choose a time for your Continuity Review.</h2>
        <p>
          Your request and preparation answers are saved. Select a time that works for you. The Review is a private, no-pressure planning conversation.
        </p>
        {bookingUrl ? (
          <>
            <iframe
              className="review-calendar-frame"
              src={bookingUrl}
              title="Continuity Review scheduling calendar"
            />
            <p className="form-helper">
              If the calendar does not load here, <a href={bookingUrl} target="_blank" rel="noreferrer">open it in a new tab</a>.
            </p>
          </>
        ) : (
          <p>
            Online scheduling is temporarily unavailable. LLFG received your request and will follow up by email.
          </p>
        )}
      </section>
    );
  }

  if (step === "prepare" && contact) {
    return (
      <section className="review-journey-card">
        <div className="review-progress">
          <span>Step 2 of 2</span>
          <strong>Help us prepare</strong>
        </div>
        <p className="eyebrow">{contact.pathway} Continuity Review</p>
        <h2>A few questions so the conversation starts in the right place.</h2>
        <p>
          This is not a full financial fact finder. Please do not enter Social Security numbers, account numbers, passwords, or other sensitive credentials.
        </p>

        <form className="review-form" onSubmit={submitPreparation}>
          <div className="form-grid">
            <label className="form-full">
              <span>{prep.stageLabel}</span>
              <select name="stage" defaultValue="" required>
                <option value="" disabled>Select one</option>
                {prep.stageOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="form-full">
              <span>What would you most like help coordinating?</span>
              <select name="primaryConcern" defaultValue="" required>
                <option value="" disabled>Select one</option>
                {prep.concernOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="form-full">
              <span>{prep.planLabel}</span>
              <select name="planStatus" defaultValue="" required>
                <option value="" disabled>Select one</option>
                {prep.planOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="form-full">
              <span>What would make this conversation useful to you? <small>(optional)</small></span>
              <textarea name="whatWouldHelp" maxLength={500} rows={4} />
            </label>
          </div>

          {checkup && (
            <label className="form-consent review-share-consent">
              <input name="shareCheckup" type="checkbox" />
              <span>
                Include my Continuity Checkup summary with my Review request so LLFG can use it to prepare.
                Your raw clicks stay in this browser; only the three summary labels and learning interest are shared.
              </span>
            </label>
          )}

          {formError && <p className="form-alert" role="alert">{formError}</p>}
          <div className="button-row">
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Continue to scheduling"}
            </button>
            <Link className="button button-outline" href="/learn">Keep learning instead</Link>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="review-journey-card">
      <div className="review-progress">
        <span>Step 1 of 2</span>
        <strong>Request your Review</strong>
      </div>
      <p className="eyebrow">A personal next step</p>
      <h2>Tell us where to reach you.</h2>
      <p>
        A Continuity Review is a private conversation about your questions and planning priorities. Your Checkup is not sent unless you choose to share it on the next step.
      </p>

      <form className="review-form" onSubmit={submitContact}>
        <div className="form-grid">
          <label>
            <span>First name</span>
            <input name="firstName" autoComplete="given-name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Mobile phone <small>(optional)</small></span>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            <span>Your state</span>
            <select name="state" defaultValue="" required>
              <option value="" disabled>Select a state</option>
              {states.map((state) => <option key={state}>{state}</option>)}
            </select>
          </label>
          <label className="form-full">
            <span>What would you like to review?</span>
            <select name="pathway" key={defaultPathway} defaultValue={defaultPathway} required>
              {PATHWAYS.map((pathway) => <option key={pathway}>{pathway}</option>)}
            </select>
          </label>
        </div>

        <p className="form-helper">Currently available in: {licensedStateCodes.join(", ")}.</p>

        <label className="form-consent">
          <input name="emailConsent" type="checkbox" />
          <span>
            I agree that LLFG may email me about this Continuity Review request and appointment.
            See the <Link href="/privacy">Privacy Policy</Link>.
          </span>
        </label>
        <label className="form-consent">
          <input name="smsConsent" type="checkbox" />
          <span>
            If I provide a mobile number, I agree to receive non-marketing texts about this request, scheduling, and appointment reminders. Message and data rates may apply. Reply STOP to opt out.
          </span>
        </label>
        <label className="form-consent">
          <input name="marketingEmailConsent" type="checkbox" />
          <span>
            I would also like occasional educational emails from Lifeline Legacy. This is optional and is not required to request a Review.
          </span>
        </label>
        <label className="form-honeypot" aria-hidden="true">
          <span>Website</span>
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        {formError && <p className="form-alert" role="alert">{formError}</p>}
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Continue"}
        </button>
      </form>
    </section>
  );
}
