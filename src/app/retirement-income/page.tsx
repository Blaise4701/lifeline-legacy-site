import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PillarQuestionSection } from "@/components/pillar-question-section";
import { ReviewInvite } from "@/components/review-invite";

export const metadata = pageMetadata({
  title: "Retirement Income Planning in Dallas–Fort Worth",
  description: "Learn the eight questions a written retirement income plan should answer, including Social Security, withdrawal order, taxes, healthcare, market risk, and survivor income.",
  path: "/retirement-income",
});

const continuity = [
  {
    question: "How much monthly income will retirement require—and how might it change over time?",
    explanation: "Start with the life you intend to fund, not merely the accounts you hold. Include changing needs, inflation, and the possibility of a longer retirement.",
    also: "Certainty",
  },
  {
    question: "What happens during a market decline early in retirement?",
    explanation: "A downturn in the first years can affect a withdrawal plan differently than one later. Decide in advance which resources would carry income during stress.",
    also: "Certainty",
  },
  {
    question: "What income remains for a surviving spouse?",
    explanation: "Pensions, Social Security, and household expenses may change after one spouse dies. A coordinated plan makes that transition visible before it happens.",
    also: "Legacy",
  },
  {
    question: "How will healthcare and long-term-care needs be addressed?",
    explanation: "Care costs can interrupt cash flow, caregiving plans, and the assets intended for family. Identify who pays, who helps, and where those choices are documented.",
    also: "Legacy",
  },
];

const certainty = [
  {
    question: "When should Social Security or pension income begin?",
    explanation: "Start dates affect household income and may affect survivor benefits. These decisions are strongest when considered alongside the full plan.",
    also: "Continuity",
  },
  {
    question: "Which accounts should be used first?",
    explanation: "Different accounts carry different tax treatment and purposes. A written withdrawal order explains what funds which years and why.",
  },
  {
    question: "How could taxes affect withdrawals and the income you can keep?",
    explanation: "Withdrawals can change taxable income and related costs. Coordinate decisions with a qualified tax professional and reflect them in the income sequence.",
    also: "Continuity",
  },
];

const legacy = [
  {
    question: "Do estate documents, beneficiaries, ownership, and the income plan agree?",
    explanation: "A retirement plan and a legacy plan should not tell different stories. Review how accounts transfer, who can act, and whether current documents match current wishes.",
  },
];

export default function RetirementIncomePage() {
  return (
    <div className="retirement-page-shell">
      <main id="main-content">
        <PageHero
          className="retirement-hero"
          eyebrow="Retirement income · The Continuity Bridge™"
          title={
            <>
              <span>From accumulating assets</span>
              <span>to coordinating dependable</span>
              <span>income.</span>
            </>
          }
          description="For decades, the goal was to build. Retirement asks a different question: how do the pieces turn into income you can rely on, for as long as you need it?"
          primary={{ href: "#questions", label: "Explore the eight questions" }}
          secondary={{ href: "/checkup", label: "Take the Continuity Checkup" }}
          aside={
            <div>
              <p className="eyebrow">The shift</p>
              <div className="before-after">
                <div><span>Before retirement</span><h2>Accumulate.</h2><p>Save, invest, and grow. Individual accounts can each have a separate job.</p></div>
                <div><span>In retirement</span><h2>Coordinate.</h2><p>Decide what funds which years, when benefits begin, and how the sequence adapts.</p></div>
              </div>
            </div>
          }
        />

        <section className="content-section retirement-intro" id="questions">
          <div className="container intro-statement">
            <p className="eyebrow">The Continuity Bridge™ for Retirement Income</p>
            <h2>Eight questions your written retirement income plan should answer.</h2>
            <p>Each question sits under the part of the bridge it affects most. Some reach more than one section because retirement decisions rarely stay in one lane.</p>
          </div>
        </section>

        <div className="container framework-stack">
          <PillarQuestionSection
            number="01"
            pillar="Continuity"
            description="Keeping dependable income and household life moving when circumstances change."
            questions={continuity}
          />
          <PillarQuestionSection
            number="02"
            pillar="Certainty"
            description="Turning accounts, benefits, timing, and tax conversations into one organized sequence."
            questions={certainty}
          />
          <PillarQuestionSection
            number="03"
            pillar="Legacy"
            description="Making sure the retirement strategy and what transfers to others tell the same story."
            questions={legacy}
            note="Several questions above also reach Legacy—especially survivor income and care planning. This section closes the loop rather than repeating them."
          />
        </div>

        <section className="section section-paper retirement-sequence-section">
          <div className="container sequence-callout">
            <div>
              <p className="eyebrow">Educational resource in development</p>
              <h2>The Written Retirement Income Sequence™</h2>
              <p>A future guide to documenting which resources fund which years, how the order changes, and what decisions trigger a review.</p>
            </div>
            <Link className="button button-outline" href="/learn">Explore learning resources</Link>
          </div>
        </section>
      </main>
      <ReviewInvite path="retirement" />
    </div>
  );
}
