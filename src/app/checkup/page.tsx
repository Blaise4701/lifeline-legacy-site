import type { Metadata } from "next";
import { ContinuityCheckup } from "@/components/continuity-checkup";

export const metadata: Metadata = {
  title: "Continuity Checkup",
  description:
    "Answer five plain-language questions and receive an educational summary organized by Continuity, Certainty, and Legacy.",
};

export default function CheckupPage() {
  return (
    <main id="main-content" className="checkup-page">
      <div className="container">
        <div className="checkup-intro">
          <p className="eyebrow">The Continuity Checkup</p>
          <h1>Start with what you know today.</h1>
          <p>Five questions. No balances or account numbers. Your summary is educational and does not score or diagnose your plan.</p>
        </div>
        <ContinuityCheckup />
      </div>
    </main>
  );
}
