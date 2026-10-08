import Link from "next/link";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { ContinuityReviewForm } from "@/components/continuity-review-form";
import styles from "./iul.module.css";

export const metadata = pageMetadata({
  title: "IUL Retirement Strategy | Lifeline Legacy Financial Group",
  description:
    "Learn how indexed universal life insurance may complement traditional retirement accounts by adding tax diversification, cash-value access, life insurance protection, and legacy planning.",
  path: "/iul-retirement-strategy",
});

const comparisons = [
  {
    title: "401(k)",
    kicker: "Tax-deferred workplace savings",
    items: [
      "Pre-tax contributions may reduce taxable income today",
      "Employer matching may be available",
      "Contribution limits and plan rules apply",
      "Withdrawals are generally taxable in retirement",
    ],
  },
  {
    title: "Roth IRA",
    kicker: "After-tax retirement savings",
    items: [
      "Funded with after-tax dollars",
      "Qualified withdrawals can be tax-free",
      "Income and annual contribution limits may apply",
      "Designed primarily for retirement accumulation",
    ],
  },
  {
    title: "IUL",
    kicker: "Life insurance with indexed cash value",
    items: [
      "Cash value can receive index-linked interest credits",
      "Negative index performance does not directly create a negative index credit",
      "Cash value may be accessed through withdrawals or policy loans",
      "Includes a life insurance death benefit",
    ],
  },
] as const;

const fitQuestions = [
  "Do you already contribute to a 401(k), IRA, or other retirement account?",
  "Would another tax-diversified source of future income be useful?",
  "Is protecting family members or leaving a legacy important to you?",
  "Can you fund a long-term life insurance strategy consistently?",
] as const;

export default function IulRetirementStrategyPage() {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>Retirement income + protection</p>
              <h1>Could an IUL add more flexibility to your retirement strategy?</h1>
              <p className={styles.lede}>
                Indexed Universal Life insurance is not a replacement for every retirement account.
                For the right person, it can be one additional tool for tax diversification,
                cash-value access, family protection, and legacy planning.
              </p>
              <div className={styles.actions}>
                <a className={styles.primaryButton} href="#review">Request a complimentary review</a>
                <a className={styles.secondaryButton} href="#compare">Compare the strategies</a>
              </div>
              <p className={styles.microcopy}>Educational information only. Product suitability and features vary by person, carrier, and state.</p>
            </div>

            <aside className={styles.heroCard} aria-label="IUL planning overview">
              <p className={styles.cardLabel}>Four questions worth asking</p>
              <div className={styles.metric}><span>01</span><strong>How will future income be taxed?</strong></div>
              <div className={styles.metric}><span>02</span><strong>How much market exposure do you want?</strong></div>
              <div className={styles.metric}><span>03</span><strong>How important is access and flexibility?</strong></div>
              <div className={styles.metric}><span>04</span><strong>What should happen for your family?</strong></div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.section} id="compare">
        <div className="container">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Different tools. Different jobs.</p>
            <h2>401(k), Roth IRA, and IUL do not solve the same problem.</h2>
            <p>
              A stronger plan can use more than one tax treatment and more than one source of future income.
              The goal is not to declare a universal winner. It is to understand the role each strategy may play.
            </p>
          </div>

          <div className={styles.comparisonGrid}>
            {comparisons.map((item, index) => (
              <article className={styles.compareCard} key={item.title}>
                <div className={styles.compareTop}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.kicker}</p>
                </div>
                <ul>
                  {item.items.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className="container">
          <div className={styles.darkGrid}>
            <div>
              <p className={styles.goldEyebrow}>How indexed universal life works</p>
              <h2>Growth potential without directly investing policy cash value in the market.</h2>
              <p>
                An IUL credits interest according to an index-crediting method defined by the policy.
                The policy is not an investment in the index itself. Caps, participation rates, spreads,
                policy charges, and other terms can affect results.
              </p>
            </div>
            <div className={styles.featureList}>
              <div><strong>Index-linked interest</strong><span>Interest credits may be based partly on the performance of a market index.</span></div>
              <div><strong>Downside floor</strong><span>Negative index performance generally does not create a negative index credit, although policy charges can still reduce cash value.</span></div>
              <div><strong>Cash-value access</strong><span>Available cash value may be accessed by withdrawals or policy loans, subject to policy terms.</span></div>
              <div><strong>Death benefit</strong><span>The policy provides life insurance protection for beneficiaries while it remains in force.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Who should explore it?</p>
              <h2>An IUL deserves a conversation when the objectives fit.</h2>
              <p>
                It is usually most useful as part of a broader plan, not as a shortcut or a one-product solution.
                These questions can help determine whether it is worth a closer look.
              </p>
            </div>
            <div className={styles.questionList}>
              {fitQuestions.map((question) => (
                <div key={question}><span>✓</span><p>{question}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.paperSection}>
        <div className="container">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Important tradeoffs</p>
            <h2>Know what you are buying before you decide.</h2>
          </div>
          <div className={styles.tradeoffGrid}>
            <article><h3>It is life insurance first.</h3><p>Premiums, underwriting, insurance costs, and policy charges matter. A policy should be designed around an insurable need and a realistic funding plan.</p></article>
            <article><h3>Access is not the same as a bank account.</h3><p>Loans and withdrawals reduce cash value and death benefit, may affect policy performance, and can create tax consequences if a policy lapses or is surrendered.</p></article>
            <article><h3>Illustrations are not guarantees.</h3><p>Illustrated values depend on assumptions. Actual credited interest, charges, and policy performance can differ over time.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.reviewSection} id="review">
        <div className="container">
          <div className={styles.reviewIntro}>
            <p className={styles.goldEyebrow}>Complimentary Continuity Review</p>
            <h2>See whether an IUL belongs in your retirement strategy.</h2>
            <p>
              We will start with your goals, current retirement structure, tax-diversification needs,
              protection priorities, and timeline. If an IUL does not fit, we will say so.
            </p>
            <ul>
              <li>Private planning conversation</li>
              <li>No account numbers or passwords required</li>
              <li>No obligation to purchase a product</li>
            </ul>
            <p className={styles.smallNote}>
              Prefer to keep learning first? <Link href="/retirement-income">Explore retirement income planning.</Link>
            </p>
          </div>

          <Suspense fallback={<div className={styles.formShell}><p>Loading review request…</p></div>}>
            <div className={styles.formShell}>
              <ContinuityReviewForm />
            </div>
          </Suspense>
        </div>
      </section>

      <section className={styles.disclosure}>
        <div className="container">
          <p>
            Indexed Universal Life insurance is a life insurance product, not a security or direct investment in a market index.
            Policy values depend on premium funding, credited interest, policy charges, loans, withdrawals, and other contract terms.
            Loans and withdrawals reduce available cash value and death benefit and may cause a policy to lapse; a lapse or surrender
            with outstanding loans may create taxable income. Tax treatment depends on individual circumstances and current law.
            Consult your tax or legal professional for advice specific to your situation. Guarantees are backed by the claims-paying
            ability of the issuing insurance company. Product availability and features vary by state and carrier.
          </p>
        </div>
      </section>
    </main>
  );
}
