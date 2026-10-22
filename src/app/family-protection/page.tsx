import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Protect Your Family, Income & Legacy",
  description: "Explore income protection, living benefits, mortgage protection, college funding, final expenses, and family preparedness with Lifeline Legacy Financial Group.",
  path: "/family-protection",
});

const reviewHref = "/continuity-review?path=family&source=social-tiktok&utm_source=tiktok&utm_medium=organic_social&utm_campaign=family-protection";
const topics = [
  ["01", "Income protection", "If your paycheck stopped, what would keep your household moving?", "Connect emergency reserves, workplace benefits, and appropriate protection around the bills that must continue."],
  ["02", "Living benefits", "What would a serious illness mean for your family’s finances?", "Understand qualifying benefits, eligibility, exclusions, and how accessing benefits can affect a policy’s remaining death benefit."],
  ["03", "Mortgage protection", "Could your family keep the home if life changed?", "Review life insurance options around your mortgage and household needs. Coverage depends on the policy and eligibility."],
  ["04", "College funding strategies", "How can you prepare for education without losing sight of today?", "Explore education savings options and their costs, flexibility, and tradeoffs. Insurance is one possible tool, with its own funding requirements and risks."],
  ["05", "Final expenses", "Who would handle the immediate costs and responsibilities?", "Discuss insurance options for funeral costs and other obligations, including eligibility, premiums, and any waiting periods."],
  ["06", "Preneed planning", "Does your family know your wishes?", "Learn how documenting wishes and arranging services in advance differ from buying final expense insurance. Coordinate arrangements with qualified providers."],
];

export default function FamilyProtectionPage() {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Lifeline Legacy Financial Group · Family protection</p>
          <h1>The people you love<br />deserve a plan.</h1>
          <p className={styles.lead}>If life changes tomorrow, what keeps your home, income, and family responsibilities moving?</p>
          <p>Start with your family’s needs. Understand your options. Connect the pieces before a crisis makes the decisions harder.</p>
          <Link className={styles.button} href={reviewHref}>Start My Family Continuity Review <span aria-hidden="true">→</span></Link>
          <p className={styles.note}>A private conversation. No obligation to move forward.</p>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="topics-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>What matters to your family?</p>
          <h2 id="topics-title">Different responsibilities.<br />One coordinated conversation.</h2>
          <p className={styles.intro}>You don’t have to know which policy or strategy you need. Bring the question that matters most.</p>
          <div className={styles.grid}>
            {topics.map(([number, title, question, description]) => (
              <article className={styles.card} key={number}>
                <span className={styles.number}>{number}</span>
                <h3>{title}</h3>
                <p className={styles.question}>{question}</p>
                <p>{description}</p>
                <Link href={reviewHref}>Discuss my family’s needs <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.statement}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Preparedness begins before the emergency</p>
          <h2>GoFundMe can bring support.<br />Your family still needs a plan.</h2>
          <p>Identify what must keep getting paid, what resources are already available, and who would know how to act.</p>
          <Link className={styles.button} href={reviewHref}>Let’s Connect the Pieces <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="process-title">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Your next step</p>
          <h2 id="process-title">A clearer starting point for your family.</h2>
          <ol className={styles.steps}>
            <li><strong>Tell us what matters.</strong><p>Share your contact information and choose the Family pathway in our secure review form.</p></li>
            <li><strong>Prepare for the conversation.</strong><p>Answer a few questions about your responsibilities, existing plan, and main concern.</p></li>
            <li><strong>Choose a time.</strong><p>Continue to scheduling after your request is saved. Together, we’ll review priorities and possible next steps.</p></li>
          </ol>
          <Link className={styles.button} href={reviewHref}>Request My Family Review <span aria-hidden="true">→</span></Link>
          <p className={styles.note}>Review availability depends on your state. No account numbers or sensitive credentials are needed.</p>
          <details className={styles.faq}><summary>Where does IUL fit?</summary><p>Indexed universal life is a type of permanent life insurance that may fit certain protection and long-term goals. It has policy charges and funding requirements; crediting terms can change, and illustrated results are not guarantees. Loans and withdrawals can reduce benefits and create lapse or tax risks. A review starts with suitability and alternatives.</p></details>
          <details className={styles.faq}><summary>What does coordinated family planning mean?</summary><p>It means giving protection, savings, beneficiaries, and responsibilities clear roles. Legal documents, taxes, and investments should be addressed with the appropriate professionals.</p></details>
          <p className={styles.disclosure}>Educational information only. Coverage, benefits, and availability vary by policy, carrier, and state. LLFG provides life insurance and annuity services; this page does not offer investment, legal, or tax advice.</p>
          <p className={styles.note}><Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms</Link></p>
        </div>
      </section>
    </main>
  );
}
