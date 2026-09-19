"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { licensedStateCodes, licensedStates, site, states } from "@/lib/site-data";

type Persona = 0 | 1 | 2;
type ReviewState = "idle" | "form" | "declined" | "submitted" | "unavailable";

type Question = {
  tag: string;
  question: string;
  options: string[];
  why: string;
};

const openingQuestion: Question = {
  tag: "Start where you are",
  question: "Which best describes where you are today?",
  options: [
    "I’m approaching or in retirement",
    "I’m protecting my family",
    "I own a business",
  ],
  why: "Your starting point shapes the questions that follow and the learning path suggested at the end.",
};

const learningQuestion: Question = {
  tag: "What to learn next",
  question: "What would you most like to understand better?",
  options: [
    "How income continues if things change",
    "How my accounts, taxes, and income fit together",
    "How to pass on what I’ve built",
  ],
  why: "This helps suggest a useful place to start learning. Nothing here is scored.",
};

const personaQuestions: Record<Persona, Question[]> = {
  0: [
    {
      tag: "Continuity",
      question:
        "If one retirement income source changed or stopped, would your household know what would cover the gap?",
      options: [
        "Yes, we have a written approach",
        "We have some pieces, not yet connected",
        "We haven’t planned for that yet",
      ],
      why: "Continuity is about keeping retirement income and household responsibilities moving when circumstances change.",
    },
    {
      tag: "Certainty",
      question:
        "Do your retirement accounts, Social Security or pension choices, and tax conversations work from one organized strategy?",
      options: [
        "Yes, they work from one strategy",
        "Some coordination, some separate pieces",
        "They were set up separately over time",
      ],
      why: "Certainty comes from a written sequence for how the pieces work together—not from any single account.",
    },
    {
      tag: "Legacy",
      question:
        "Do your beneficiaries, legal documents, and wishes agree, and could your family find them?",
      options: [
        "Yes, and they’re current",
        "Partly; some may be out of date",
        "I’m not sure",
      ],
      why: "Legacy begins by checking that ownership, documents, beneficiaries, and wishes still align.",
    },
  ],
  1: [
    {
      tag: "Continuity",
      question:
        "If your income paused for six months, would your household know how everything would be covered?",
      options: [
        "Yes, we have a plan for that",
        "We have some pieces, not yet connected",
        "We haven’t planned for that yet",
      ],
      why: "Continuity is about keeping income and responsibilities moving when disruption occurs.",
    },
    {
      tag: "Certainty",
      question:
        "Do your savings, protection, workplace benefits, and household responsibilities work from one organized plan?",
      options: [
        "Yes, they work from one plan",
        "Some coordination, some separate pieces",
        "They were set up separately over time",
      ],
      why: "Certainty comes from seeing how protection, resources, and responsibilities work together.",
    },
    {
      tag: "Legacy",
      question:
        "Do your beneficiaries, legal documents, and wishes agree, and could your family find them?",
      options: [
        "Yes, and they’re current",
        "Partly; some may be out of date",
        "I’m not sure",
      ],
      why: "Legacy is about what you built reaching the people you intend, in the way you intend.",
    },
  ],
  2: [
    {
      tag: "Continuity",
      question:
        "If you could not operate the business for six months, would your household and company know how obligations would be covered?",
      options: [
        "Yes, we have a written plan",
        "We have some pieces, not yet connected",
        "We haven’t planned for that yet",
      ],
      why: "Continuity considers both sides of an owner interruption: the company and the household.",
    },
    {
      tag: "Certainty",
      question:
        "Do your personal finances, business protections, and owner-retirement strategy work from one coordinated plan?",
      options: [
        "Yes, they work from one plan",
        "Some coordination, some separate pieces",
        "They were set up separately over time",
      ],
      why: "Certainty means company decisions and personal planning are coordinated rather than handled in isolation.",
    },
    {
      tag: "Legacy",
      question:
        "Are ownership, succession agreements, beneficiaries, and your family’s wishes aligned and findable?",
      options: [
        "Yes, and they’re current",
        "Partly; some may be out of date",
        "I’m not sure",
      ],
      why: "Legacy includes a clear transfer of ownership, responsibility, and benefit when an owner steps away.",
    },
  ],
};

const summaries = [
  {
    name: "Continuity",
    copy: [
      "You describe a foundation for keeping income and responsibilities moving. Reviewing it as life changes keeps it useful.",
      "Some pieces exist but may not be connected. Continuity planning links income, obligations, and who does what.",
      "A useful place to begin is identifying what keeps life or the business moving if income or leadership pauses.",
    ],
  },
  {
    name: "Certainty",
    copy: [
      "Your pieces appear to work from one strategy. A periodic review can help keep decisions clear.",
      "Some coordination exists alongside separate pieces. A written sequence can clarify how they interact.",
      "Pieces set up over time often work separately. Organizing them can make future decisions easier to see.",
    ],
  },
  {
    name: "Legacy",
    copy: [
      "Your documents and wishes appear aligned. Keeping them current helps preserve that alignment.",
      "Some details may need coordination. A legacy review checks that what you built can move where you intend.",
      "Uncertainty is a fair starting point. Begin by comparing documents, beneficiaries, ownership, and wishes.",
    ],
  },
] as const;

const statusLabels = [
  "A foundation is in place",
  "Some pieces may need coordination",
  "Worth exploring further",
] as const;

const recommendations = [
  {
    title: "The Continuity Bridge™ for Retirement Income",
    description:
      "Eight questions for turning accumulated assets into a coordinated, written income approach.",
    href: "/retirement-income",
    label: "Explore retirement income",
  },
  {
    title: "Family Continuity",
    description:
      "A practical way to connect income, protection, documents, and the people who depend on you.",
    href: "/family-continuity",
    label: "Explore family continuity",
  },
  {
    title: "Business Continuity",
    description:
      "Questions that connect owner interruption, company obligations, transition, and personal retirement.",
    href: "/business-continuity",
    label: "Explore business continuity",
  },
] as const;

const bridgeLinks = [
  { label: "Start with Continuity", href: "/continuity-bridge#bridge-continuity" },
  { label: "Start with Certainty", href: "/continuity-bridge#bridge-certainty" },
  { label: "Start with Legacy", href: "/continuity-bridge#bridge-legacy" },
] as const;

const pathwayNames = ["Retirement", "Family", "Business"] as const;
const incompleteSummary = "Checkup not completed";

export function ContinuityCheckup() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [error, setError] = useState("");
  const [review, setReview] = useState<ReviewState>("idle");
  const [formError, setFormError] = useState("");
  const [reviewStateName, setReviewStateName] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const persona = (answers[0] ?? 1) as Persona;
  const questions = useMemo(
    () => [openingQuestion, ...personaQuestions[persona], learningQuestion],
    [persona],
  );

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const choose = (option: number) => {
    setAnswers((current) => current.map((answer, index) => (index === step ? option : answer)));
    setError("");
  };

  const next = () => {
    if (answers[step] === null) {
      setError("Choose the answer that fits best to continue.");
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, 5));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setAnswers([null, null, null, null, null]);
    setStep(0);
    setReview("idle");
    setError("");
    setReviewStateName("");
    setBookingUrl("");
    setFormError("");
  };

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = String(data.get("firstName") ?? "");
    const email = String(data.get("email") ?? "");
    const state = String(data.get("state") ?? "");
    const pathway = String(data.get("pathway") ?? "");
    const learningInterest = String(data.get("learningInterest") ?? "");
    const consent = data.get("consent") === "on";
    const website = String(data.get("website") ?? "");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Enter a valid email so we can reach you.");
      return;
    }
    if (!state) {
      setFormError("Choose your state so availability can be confirmed.");
      return;
    }

    if (!pathway || !learningInterest) {
      setFormError("Choose a planning starting point and learning interest.");
      return;
    }

    setFormError("");
    setReviewStateName(state);

    if (!(licensedStates as readonly string[]).includes(state)) {
      setReview("unavailable");
      return;
    }

    if (!consent) {
      setFormError("Confirm that LLFG may email you about this request.");
      return;
    }

    setIsSubmitting(true);
    try {
      const hasCheckupSummary = answers.slice(1, 4).every((answer) => answer !== null);
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "continuity-review",
          firstName,
          email,
          state,
          pathway,
          summaries: {
            continuity: hasCheckupSummary ? statusLabels[answers[1] ?? 2] : incompleteSummary,
            certainty: hasCheckupSummary ? statusLabels[answers[2] ?? 2] : incompleteSummary,
            legacy: hasCheckupSummary ? statusLabels[answers[3] ?? 2] : incompleteSummary,
          },
          learningInterest,
          consent,
          website,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; bookingUrl?: string | null };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your request could not be saved.");
      }

      setBookingUrl(result.bookingUrl ?? "");
      setReview("submitted");
    } catch (submissionError) {
      setFormError(
        submissionError instanceof Error
          ? submissionError.message
          : "Your request could not be saved. Please try again.",
      );
      setReview("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 5) {
    const recommendation = recommendations[persona];
    const learning = answers[4] ?? 0;
    return (
      <div className="checkup-shell checkup-results">
        <div className="checkup-results-heading">
          <p className="eyebrow">Your Continuity summary</p>
          <h2 ref={headingRef} tabIndex={-1}>See where your pieces connect.</h2>
          <p>
            This is a conversation starter, not a score or financial diagnosis. Use it to decide what deserves a closer look.
          </p>
        </div>

        <div className="result-grid">
          {summaries.map((summary, index) => {
            const answer = answers[index + 1] ?? 2;
            return (
              <article className={`result-card result-level-${answer}`} key={summary.name}>
                <div className="result-status-icon" aria-hidden="true">
                  {answer === 0 ? "✓" : answer === 1 ? "◐" : "○"}
                </div>
                <p className="result-pillar">{summary.name}</p>
                <h3>{statusLabels[answer]}</h3>
                <p>{summary.copy[answer]}</p>
              </article>
            );
          })}
        </div>

        <section className="recommended-path">
          <p className="eyebrow">A useful next learning path</p>
          <div>
            <h3>{recommendation.title}</h3>
            <p>{recommendation.description}</p>
          </div>
          <div className="recommended-actions">
            <Link className="button" href={recommendation.href}>{recommendation.label}</Link>
            <Link className="text-link" href={bridgeLinks[learning].href}>
              {bridgeLinks[learning].label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <ReviewPanel
          review={review}
          setReview={setReview}
          formError={formError}
          reviewStateName={reviewStateName}
          bookingUrl={bookingUrl}
          isSubmitting={isSubmitting}
          defaultPathway={pathwayNames[persona]}
          defaultLearningInterest={learningQuestion.options[learning]}
          onSubmit={submitReview}
        />

        <button className="text-button restart-button" type="button" onClick={restart}>
          Start the Checkup again
        </button>
      </div>
    );
  }

  const question = questions[step];
  return (
    <div className="checkup-shell">
      <div className="checkup-topline">
        <span>Question {step + 1} of 5</span>
        <div className="progress-bars" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((index) => (
            <span className={index <= step ? "is-active" : ""} key={index} />
          ))}
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); next(); }}>
        <fieldset className="question-fieldset">
          <legend className="sr-only">{question.question}</legend>
          <p className="question-tag">{question.tag}</p>
          <h2 ref={headingRef} tabIndex={-1}>{question.question}</h2>
          <div className="answer-list">
            {question.options.map((option, optionIndex) => (
              <label className={`answer-option ${answers[step] === optionIndex ? "is-selected" : ""}`} key={option}>
                <input
                  type="radio"
                  name={`question-${step}`}
                  value={optionIndex}
                  checked={answers[step] === optionIndex}
                  onChange={() => choose(optionIndex)}
                />
                <span className="custom-radio" aria-hidden="true" />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="why-line">
          <strong>Why we ask</strong>
          <span>{question.why}</span>
        </div>
        {error && <p className="form-alert" role="alert">{error}</p>}
        <div className="checkup-nav">
          {step > 0 ? (
            <button className="button button-outline" type="button" onClick={back}>Back</button>
          ) : <span />}
          <button className="button" type="submit">{step === 4 ? "See my summary" : "Next"}</button>
        </div>
        {step === 0 && (
          <button
            className="text-button fast-path"
            type="button"
            onClick={() => {
              setReview("form");
              requestAnimationFrame(() => document.getElementById("review")?.scrollIntoView({ behavior: "smooth" }));
            }}
          >
            Already know you’d like help? Request a review.
          </button>
        )}
      </form>

      {step === 0 && (
        <ReviewPanel
          review={review}
          setReview={setReview}
          formError={formError}
          reviewStateName={reviewStateName}
          bookingUrl={bookingUrl}
          isSubmitting={isSubmitting}
          defaultPathway={answers[0] === null ? "" : pathwayNames[persona]}
          defaultLearningInterest={answers[4] === null ? "" : learningQuestion.options[answers[4]]}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
}

type ReviewPanelProps = {
  review: ReviewState;
  setReview: (value: ReviewState) => void;
  formError: string;
  reviewStateName: string;
  bookingUrl: string;
  isSubmitting: boolean;
  defaultPathway: string;
  defaultLearningInterest: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ReviewPanel({
  review,
  setReview,
  formError,
  reviewStateName,
  bookingUrl,
  isSubmitting,
  defaultPathway,
  defaultLearningInterest,
  onSubmit,
}: ReviewPanelProps) {
  return (
    <section className="review-panel" id="review" aria-labelledby="review-heading">
      <p className="eyebrow">Optional next step</p>
      <h2 id="review-heading">Would you like help reviewing these areas together?</h2>
      <p>
        A Continuity Review is a private, no-pressure conversation. The conversation begins with your questions and planning priorities. There is no obligation to move forward.
      </p>

      {review === "idle" && (
        <div className="button-row">
          <button className="button" type="button" onClick={() => setReview("form")}>Yes, I’d like to talk it through</button>
          <button className="button button-outline" type="button" onClick={() => setReview("declined")}>Not right now</button>
        </div>
      )}

      {review === "declined" && (
        <div className="gentle-message" role="status">
          <p>That’s completely fine. Your summary and the learning resources remain available whenever you want them.</p>
          <Link className="text-link" href="/learn">Visit the learning center <span aria-hidden="true">→</span></Link>
        </div>
      )}

      {review === "form" && (
        <form className="review-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label>
              <span>First name <small>(optional)</small></span>
              <input name="firstName" autoComplete="given-name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="form-full">
              <span>Your state</span>
              <select name="state" defaultValue="" required>
                <option value="" disabled>Select a state</option>
                {states.map((state) => <option key={state}>{state}</option>)}
              </select>
            </label>
            <label>
              <span>Planning starting point</span>
              <select name="pathway" defaultValue={defaultPathway} required>
                <option value="" disabled>Select a pathway</option>
                {pathwayNames.map((pathway) => <option key={pathway}>{pathway}</option>)}
              </select>
            </label>
            <label>
              <span>What would you like to understand?</span>
              <select name="learningInterest" defaultValue={defaultLearningInterest} required>
                <option value="" disabled>Select a learning interest</option>
                {learningQuestion.options.map((interest) => <option key={interest}>{interest}</option>)}
              </select>
            </label>
          </div>
          <p className="form-helper">
            Licensed states: {licensedStateCodes.join(", ")}. LLFG sends only the contact details and summary labels shown here—never your raw Checkup answers.
          </p>
          <label className="form-consent">
            <input name="consent" type="checkbox" />
            <span>I agree that LLFG may email me about this Continuity Review request. See the <Link href="/privacy">Privacy Policy</Link>.</span>
          </label>
          <label className="form-honeypot" aria-hidden="true">
            <span>Website</span>
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          {formError && <p className="form-alert" role="alert">{formError}</p>}
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Request my Continuity Review"}
          </button>
        </form>
      )}

      {review === "submitted" && (
        <div className="calendar-placeholder" role="status">
          <span className="calendar-icon" aria-hidden="true">□</span>
          {bookingUrl ? (
            <div>
              <h3>Your request is in.</h3>
              <p>
                Choose a time for your private, no-pressure Continuity Review. The calendar opens in a new tab.
              </p>
              <a className="button button-small" href={bookingUrl} target="_blank" rel="noreferrer">Choose a review time</a>
            </div>
          ) : (
            <div>
              <h3>Your request is in.</h3>
              <p>
                LLFG received your request and will follow up by email. You can also call <a href={site.phoneHref}>{site.phone}</a> or email <a href={site.emailHref}>{site.email}</a>.
              </p>
            </div>
          )}
        </div>
      )}

      {review === "unavailable" && (
        <div className="calendar-placeholder" role="status">
          <span className="calendar-icon" aria-hidden="true">□</span>
          <div>
            <h3>Keep learning with LLFG</h3>
            <p>
              LLFG is not currently licensed to offer insurance services in {reviewStateName}. Nothing was sent, and you have not been added to a waitlist. The Checkup and educational resources remain available to you.
            </p>
            <Link className="text-link" href="/learn">Visit the learning center <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      )}
    </section>
  );
}
