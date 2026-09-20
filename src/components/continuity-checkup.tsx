"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Persona = 0 | 1 | 2;

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
const pathwaySlugs = ["retirement", "family", "business"] as const;
const CHECKUP_KEY = "llfg:checkup-context";

export function ContinuityCheckup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [error, setError] = useState("");
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
    setError("");
    try {
      window.sessionStorage.removeItem(CHECKUP_KEY);
    } catch {
      // Storage is optional.
    }
  };

  const requestReview = () => {
    const learning = answers[4] ?? 0;
    const context = {
      pathway: pathwayNames[persona],
      summaries: {
        continuity: statusLabels[answers[1] ?? 2],
        certainty: statusLabels[answers[2] ?? 2],
        legacy: statusLabels[answers[3] ?? 2],
      },
      learningInterest: learningQuestion.options[learning],
      capturedAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem(CHECKUP_KEY, JSON.stringify(context));
    } catch {
      // The Review still works without stored Checkup context.
    }

    router.push(`/continuity-review?path=${pathwaySlugs[persona]}&source=checkup`);
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

        <section className="review-panel" aria-labelledby="checkup-review-heading">
          <p className="eyebrow">Optional next step</p>
          <h2 id="checkup-review-heading">Would you like help reviewing these areas together?</h2>
          <p>
            Your Checkup stays in this browser. If you request a Continuity Review, you will choose on the next step whether to share this summary with LLFG.
          </p>
          <div className="button-row">
            <button className="button" type="button" onClick={requestReview}>
              Request a Continuity Review
            </button>
            <Link className="button button-outline" href="/learn">Keep learning</Link>
          </div>
        </section>

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
            onClick={() => router.push("/continuity-review?source=checkup-fast")}
          >
            Already know you’d like help? Request a Review instead.
          </button>
        )}
      </form>
    </div>
  );
}
