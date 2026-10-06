"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Question = {
  tag: string;
  question: string;
  options: string[];
  why: string;
};

const questions: Question[] = [
  {
    tag: "Income target",
    question: "Have you estimated how much monthly income you will need in retirement?",
    options: [
      "Yes, and it is written down",
      "I have a rough estimate",
      "Not yet",
    ],
    why: "A retirement income plan starts with the life you need the plan to fund, not just the accounts you own.",
  },
  {
    tag: "Dependable income",
    question: "Do you know which income sources will cover your essential monthly expenses?",
    options: [
      "Yes, they are mapped out",
      "I know some of the pieces",
      "I am not sure yet",
    ],
    why: "Knowing which expenses are covered by dependable income can make the rest of the withdrawal plan easier to organize.",
  },
  {
    tag: "Social Security and pensions",
    question: "Have you coordinated when Social Security or pension income should begin with the rest of your plan?",
    options: [
      "Yes, the timing is part of a written strategy",
      "I have considered it, but it is not fully coordinated",
      "Not yet",
    ],
    why: "Benefit timing can affect household income, taxes, and survivor income, so it should be considered with the whole plan.",
  },
  {
    tag: "Withdrawal sequence",
    question: "Do you have a written order for which accounts you expect to use first, next, and later?",
    options: [
      "Yes, we have a written sequence",
      "I have an idea, but it is not written",
      "No",
    ],
    why: "A written sequence can help connect account type, taxes, timing, and the purpose of each resource.",
  },
  {
    tag: "Market disruption",
    question: "If markets fell early in retirement, do you know where your income would come from without selling investments at the wrong time?",
    options: [
      "Yes, we have a specific approach",
      "We have some reserves or backup options",
      "I am not sure",
    ],
    why: "Early-retirement market declines can affect a withdrawal plan differently than declines later in retirement.",
  },
  {
    tag: "Survivor and legacy",
    question: "Have you reviewed survivor income, beneficiaries, healthcare, and legacy decisions together?",
    options: [
      "Yes, and they are current",
      "Some pieces have been reviewed",
      "Not yet",
    ],
    why: "Retirement income, protection, healthcare, and legacy decisions can affect one another when life changes.",
  },
];

const statusLabels = [
  "A foundation is in place",
  "Some pieces may need coordination",
  "Worth reviewing",
] as const;

const pillarCopy = {
  continuity: [
    "You have identified how income can continue through disruption. Periodic reviews can help keep that approach current.",
    "Some continuity pieces are present, but they may not yet work from one written approach.",
    "A useful next step is identifying what keeps income flowing if markets, health, or household circumstances change.",
  ],
  certainty: [
    "Your income target, benefit timing, and withdrawal sequence appear to be organized around a clearer plan.",
    "Several important decisions have been considered, but the sequence may not yet be fully connected or written.",
    "A useful next step is organizing income needs, benefit timing, account order, and tax conversations into one written sequence.",
  ],
  legacy: [
    "Your survivor, healthcare, beneficiary, and legacy considerations appear to be part of the retirement conversation.",
    "Some legacy and protection pieces have been reviewed, but they may benefit from better coordination.",
    "A useful next step is reviewing survivor income, healthcare exposure, beneficiaries, and legacy intentions together.",
  ],
} as const;

const CHECKUP_KEY = "llfg:checkup-context";

function band(values: number[]) {
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (average < 0.67) return 0;
  if (average < 1.67) return 1;
  return 2;
}

export function RetirementIncomeCheckup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const completed = step === questions.length;

  const results = useMemo(() => {
    if (!completed) return null;

    const safe = answers.map((answer) => answer ?? 2);
    const continuity = band([safe[1], safe[4]]);
    const certainty = band([safe[0], safe[2], safe[3]]);
    const legacy = band([safe[5]]);

    const scores = [
      { key: "continuity" as const, value: continuity },
      { key: "certainty" as const, value: certainty },
      { key: "legacy" as const, value: legacy },
    ];
    const focus = [...scores].sort((a, b) => b.value - a.value)[0]?.key ?? "certainty";

    const learningInterest =
      focus === "continuity"
        ? "How income continues if things change"
        : focus === "legacy"
          ? "How to pass on what I’ve built"
          : "How my accounts, taxes, and income fit together";

    return { continuity, certainty, legacy, focus, learningInterest };
  }, [answers, completed]);

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
    setStep((current) => Math.min(current + 1, questions.length));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setAnswers(Array(questions.length).fill(null));
    setStep(0);
    setError("");
    try {
      window.sessionStorage.removeItem(CHECKUP_KEY);
    } catch {
      // Storage is optional.
    }
  };

  const requestReview = () => {
    if (!results) return;

    const context = {
      pathway: "Retirement",
      summaries: {
        continuity: statusLabels[results.continuity],
        certainty: statusLabels[results.certainty],
        legacy: statusLabels[results.legacy],
      },
      learningInterest: results.learningInterest,
      capturedAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem(CHECKUP_KEY, JSON.stringify(context));
    } catch {
      // The Review still works without stored Checkup context.
    }

    router.push("/continuity-review?path=retirement&source=retirement-income-checkup");
  };

  if (completed && results) {
    const cards = [
      {
        name: "Continuity",
        value: results.continuity,
        copy: pillarCopy.continuity[results.continuity],
      },
      {
        name: "Certainty",
        value: results.certainty,
        copy: pillarCopy.certainty[results.certainty],
      },
      {
        name: "Legacy",
        value: results.legacy,
        copy: pillarCopy.legacy[results.legacy],
      },
    ];

    return (
      <div className="checkup-shell checkup-results">
        <div className="checkup-results-heading">
          <p className="eyebrow">Your Retirement Income Checkup</p>
          <h2 ref={headingRef} tabIndex={-1}>See what appears organized and what deserves a closer look.</h2>
          <p>
            This is an educational summary, not a score, recommendation, or financial diagnosis.
          </p>
        </div>

        <div className="result-grid">
          {cards.map((card) => (
            <article className={`result-card result-level-${card.value}`} key={card.name}>
              <div className="result-status-icon" aria-hidden="true">
                {card.value === 0 ? "✓" : card.value === 1 ? "◐" : "○"}
              </div>
              <p className="result-pillar">{card.name}</p>
              <h3>{statusLabels[card.value]}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>

        <section className="review-panel" aria-labelledby="retirement-checkup-review-heading">
          <p className="eyebrow">Optional next step</p>
          <h2 id="retirement-checkup-review-heading">Would you like help turning these pieces into a written retirement income plan?</h2>
          <p>
            A complimentary Continuity Review can help organize your income target, dependable income, benefit timing, withdrawal sequence, risks, and legacy considerations.
          </p>
          <div className="button-row">
            <button className="button" type="button" onClick={requestReview}>
              Request a Continuity Review
            </button>
            <button className="button button-outline" type="button" onClick={restart}>
              Retake the Checkup
            </button>
          </div>
        </section>
      </div>
    );
  }

  const question = questions[step];

  return (
    <div className="checkup-shell">
      <div className="checkup-topline">
        <span>Question {step + 1} of {questions.length}</span>
        <div className="progress-bars" aria-hidden="true">
          {questions.map((_, index) => (
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
                  name={`retirement-checkup-${step}`}
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
          <button className="button" type="submit">
            {step === questions.length - 1 ? "See my summary" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
