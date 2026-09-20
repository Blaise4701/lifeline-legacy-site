import type { Metadata } from "next";
import { Suspense } from "react";
import { ContinuityReviewForm } from "@/components/continuity-review-form";

export const metadata: Metadata = {
  title: "Request a Continuity Review",
  description:
    "Request a private Continuity Review with Lifeline Legacy Financial Group after exploring your retirement, family, or business continuity questions.",
};

export default function ContinuityReviewPage() {
  return (
    <main id="main-content" className="review-page">
      <div className="container review-page-grid">
        <div className="review-page-intro">
          <p className="eyebrow">The Continuity Review</p>
          <h1>When you want help connecting the pieces.</h1>
          <p>
            The Checkup is self-guided education. The Review is the point where you choose to bring a Lifeline Legacy professional into the conversation.
          </p>
          <ul className="check-list">
            <li>Two short steps before scheduling</li>
            <li>No account numbers or sensitive credentials</li>
            <li>Your Checkup stays private unless you choose to share its summary</li>
          </ul>
        </div>
        <Suspense fallback={<div className="review-journey-card"><p>Loading Review request…</p></div>}>
          <ContinuityReviewForm />
        </Suspense>
      </div>
    </main>
  );
}
