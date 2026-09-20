import { pageMetadata } from "@/lib/seo";
import { ContinuityCheckup } from "@/components/continuity-checkup";

export const metadata = pageMetadata({
  title: "Financial Continuity Checkup",
  description: "Answer five plain-language questions and receive an educational summary organized around Continuity, Certainty, and Legacy—without entering account balances or numbers.",
  path: "/checkup",
});

export default function CheckupPage() {
  return (
    <main id="main-content" className="checkup-page">
      <div className="container">
        <div className="checkup-intro">
          <p className="eyebrow">The Continuity Checkup</p>
          <h1>Start with what you know today.</h1>
          <p>
            Five questions. No balances or account numbers. Nothing is sent to Lifeline Legacy while you complete the Checkup, and your summary does not score or diagnose your plan.
          </p>
        </div>
        <ContinuityCheckup />
      </div>
    </main>
  );
}
