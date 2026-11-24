import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { ContinuityReviewForm } from "@/components/continuity-review-form";

const baseMetadata = pageMetadata({
  title: "Your Complimentary Continuity Review",
  description: "Schedule a complimentary, no-obligation 30-minute telephone discovery call with Lifeline Legacy Financial Group. No prior assessment is required.",
  path: "/continuity-review",
  noindex: true,
});

const shareImage = {
  url: "https://lifelinelegacyfinancial.com/brand/og-continuity-review.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Your Complimentary Continuity Review with Blaise D. Tamo, Lifeline Legacy Financial Group. A 30-minute phone call with no obligation.",
};

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, images: [shareImage] },
  twitter: {
    ...baseMetadata.twitter,
    card: "summary_large_image",
    images: [{ url: shareImage.url, alt: shareImage.alt }],
  },
};

export default function ContinuityReviewPage() {
  return (
    <main id="main-content" className="review-page">
      <div className="container review-page-grid">
        <div className="review-page-intro">
          <p className="eyebrow">The Continuity Review</p>
          <h1>Your Complimentary Continuity Review</h1>
          <p>
            Your first step is a complimentary, no-obligation 30-minute telephone discovery call with Lifeline Legacy Financial Group.
          </p>
          <p>
            We will discuss your current protection, your financial priorities, and any concerns about your family&apos;s future. You do not need to complete a retirement Checkup or any other assessment before scheduling.
          </p>
          <p>
            There is no obligation to purchase insurance or any financial product.
          </p>
          <ul className="check-list">
            <li>Two short request and preparation steps before scheduling</li>
            <li>No account numbers or sensitive credentials</li>
          </ul>
        </div>
        <Suspense fallback={<div className="review-journey-card"><p>Loading Review request…</p></div>}>
          <ContinuityReviewForm />
        </Suspense>
      </div>
    </main>
  );
}
