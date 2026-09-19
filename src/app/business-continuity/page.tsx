import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PillarQuestionSection } from "@/components/pillar-question-section";
import { ReviewInvite } from "@/components/review-invite";

export const metadata: Metadata = {
  title: "Business Continuity Planning",
  description:
    "Educational questions for coordinating owner interruption, key people, business obligations, ownership transition, and personal legacy.",
};

const continuity = [
  {
    question: "What happens if an owner cannot work in the business for six months?",
    explanation: "Separate the owner’s jobs: leadership, production, relationships, decisions, and household income. Identify what continues, who acts, and where cash comes from.",
    also: "Certainty",
  },
  {
    question: "Which people or relationships are essential to daily operations?",
    explanation: "Key employees, partners, customers, vendors, and lenders may each depend on knowledge held by one person. A continuity plan makes those dependencies visible.",
    also: "Legacy",
  },
  {
    question: "How would payroll, debt, taxes, and owner income be handled during disruption?",
    explanation: "Company obligations and household obligations can compete for the same resources. Map the order and decision-makers before the business is under pressure.",
    also: "Certainty",
  },
];

const certainty = [
  {
    question: "Are ownership agreements, valuation, and funding designed to work together?",
    explanation: "A signed agreement alone may not create liquidity or a practical transfer. Confirm how value is determined, who may buy, and how an obligation would be funded.",
    also: "Legacy",
  },
  {
    question: "Is the owner’s retirement dependent on a future business sale?",
    explanation: "If the company is the retirement plan, timing, buyer readiness, valuation, and income after the sale belong in the same written strategy.",
    also: "Continuity",
  },
];

const legacy = [
  {
    question: "Who should own, lead, or wind down the business next?",
    explanation: "Ownership and leadership are not always the same decision. Clarify the intended successor, the transition of authority, and the experience employees and family should have.",
  },
  {
    question: "How should business value reach family, partners, or future leaders?",
    explanation: "Coordinate ownership, beneficiaries, personal estate documents, and business agreements so the company and family are not left with conflicting instructions.",
  },
];

export default function BusinessContinuityPage() {
  return (
    <>
      <main id="main-content">
        <PageHero
          eyebrow="Business owners · The Continuity Bridge™"
          title={<>The business may be the asset. The owner may be the system.</>}
          description="Business continuity connects what happens to the company with what happens to the owner, the household, employees, partners, and the value intended for the next chapter."
          primary={{ href: "#business-questions", label: "Explore the owner questions" }}
          secondary={{ href: "/checkup", label: "Take the Continuity Checkup" }}
          aside={
            <div>
              <p className="eyebrow">Two plans that must agree</p>
              <div className="dual-plan">
                <div><span>Company</span><strong>Operations · People · Cash flow · Ownership</strong></div>
                <div><span>Owner</span><strong>Income · Family · Retirement · Legacy</strong></div>
              </div>
            </div>
          }
        />

        <section className="content-section" id="business-questions">
          <div className="container intro-statement">
            <p className="eyebrow">Seven connected questions</p>
            <h2>Plan for the company and the person behind it.</h2>
            <p>Continuity is not only a binder of operating procedures. It connects leadership, liquidity, agreements, personal income, ownership, and the people who live with the consequences of each decision.</p>
          </div>
        </section>

        <div className="container framework-stack">
          <PillarQuestionSection number="01" pillar="Continuity" description="Keeping company and household obligations moving when an owner or key person steps away." questions={continuity} />
          <PillarQuestionSection number="02" pillar="Certainty" description="Coordinating agreements, value, funding, and the owner’s personal financial plan." questions={certainty} />
          <PillarQuestionSection number="03" pillar="Legacy" description="Transferring ownership, responsibility, and value with less confusion." questions={legacy} />
        </div>

        <section className="section section-sage">
          <div className="container boundary-grid">
            <div>
              <p className="eyebrow">A useful distinction</p>
              <h2>A succession intention is not yet a continuity plan.</h2>
            </div>
            <div className="boundary-card">
              <h3>The transfer has to be workable.</h3>
              <p>A complete conversation may involve legal, tax, valuation, accounting, lending, and insurance professionals. LLFG’s role is life and annuity education and services within the overall coordinated plan.</p>
            </div>
          </div>
        </section>
      </main>
      <ReviewInvite />
    </>
  );
}
