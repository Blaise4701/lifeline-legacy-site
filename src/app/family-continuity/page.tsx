import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PillarQuestionSection } from "@/components/pillar-question-section";
import { ReviewInvite } from "@/components/review-invite";

export const metadata: Metadata = {
  title: "Family Continuity Planning",
  description:
    "Educational questions for coordinating household income, protection, responsibilities, documents, and beneficiaries through the Continuity Bridge™.",
};

const continuity = [
  {
    question: "If income paused for six months, what would keep the household moving?",
    explanation: "Map essential obligations, available reserves, workplace benefits, and protection so the family understands what would happen first—not merely what exists.",
    also: "Certainty",
  },
  {
    question: "Who would take over each financial and family responsibility?",
    explanation: "A plan works better when people know who pays bills, finds documents, contacts professionals, manages the household, and cares for children or relatives.",
    also: "Legacy",
  },
  {
    question: "How would a health event or caregiving need change the plan?",
    explanation: "A disruption can affect both income and time. Clarify how care, work, household needs, and financial responsibilities would be handled together.",
    also: "Legacy",
  },
];

const certainty = [
  {
    question: "Do savings, workplace benefits, and protection each have a clear job?",
    explanation: "Pieces accumulated over time may overlap or leave gaps. Coordination starts by naming which obligation each resource is intended to support.",
    also: "Continuity",
  },
  {
    question: "Is there one written family action map?",
    explanation: "A simple, findable map can identify key contacts, document locations, responsibilities, and the sequence the family would follow during change.",
    also: "Legacy",
  },
];

const legacy = [
  {
    question: "Do beneficiaries, ownership, and legal documents match current wishes?",
    explanation: "Life changes faster than paperwork. Compare the people named across policies, accounts, documents, and property with the intentions the family has today.",
  },
  {
    question: "Are children, dependents, and future milestones addressed clearly?",
    explanation: "Guardianship conversations, education goals, special needs, and family values deserve both proper legal guidance and a practical communication plan.",
  },
];

export default function FamilyContinuityPage() {
  return (
    <div className="family-page-shell">
      <main id="main-content">
        <PageHero
          className="family-hero"
          eyebrow="Family planning · The Continuity Bridge™"
          title={
            <>
              <span>Protecting a family is more</span>
              <span>than owning a policy.</span>
            </>
          }
          description="Protection becomes useful when income, responsibilities, documents, and the people who may need to act are coordinated around the same plan."
          primary={{ href: "#family-questions", label: "Explore the family questions" }}
          secondary={{ href: "/checkup", label: "Take the Continuity Checkup" }}
          aside={
            <div>
              <p className="eyebrow">A family plan should clarify</p>
              <ul className="aside-check-list">
                <li>What keeps income and obligations moving</li>
                <li>Who takes over practical responsibilities</li>
                <li>Where documents and contacts can be found</li>
                <li>How today’s choices reach tomorrow’s family</li>
              </ul>
            </div>
          }
        />

        <section className="content-section family-intro" id="family-questions">
          <div className="container intro-statement">
            <p className="eyebrow">Seven connected questions</p>
            <h2>Start with how the family would keep functioning.</h2>
            <p>The goal is not to predict every event. It is to reduce avoidable confusion by connecting protection, resources, documents, people, and responsibilities before the family has to act.</p>
          </div>
        </section>

        <div className="container framework-stack">
          <PillarQuestionSection number="01" pillar="Continuity" description="Keeping household income, care, and responsibilities moving through disruption." questions={continuity} />
          <PillarQuestionSection number="02" pillar="Certainty" description="Giving each resource a clear role and the family a visible sequence to follow." questions={certainty} />
          <PillarQuestionSection number="03" pillar="Legacy" description="Aligning the people, documents, and intentions that carry the family forward." questions={legacy} />
        </div>

        <section className="section section-sage family-boundary-section">
          <div className="container boundary-grid">
            <div>
              <p className="eyebrow">What coordination can do</p>
              <h2>Make the plan easier to understand and easier to use.</h2>
            </div>
            <div className="boundary-card">
              <h3>Professional boundaries matter.</h3>
              <p>Insurance planning should be coordinated with—not substituted for—legal documents, tax guidance, healthcare directives, or investment advice from the appropriate professionals.</p>
            </div>
          </div>
        </section>
      </main>
      <ReviewInvite path="family" />
    </div>
  );
}
