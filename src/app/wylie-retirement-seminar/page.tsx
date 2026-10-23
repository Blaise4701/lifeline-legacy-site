import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wylie Retirement Seminar | This Event Has Ended",
  description: "This Wylie retirement seminar has ended. Contact Lifeline Legacy Financial Group for future educational events.",
};

export default function WylieRetirementSeminarPage() {
  return (
    <main id="main-content" className="container" style={{ paddingBlock: "5rem", maxWidth: "48rem" }}>
      <h1>This event has ended.</h1>
      <p>Registration for the October 12, 2026 Wylie retirement seminar is closed. A new date has not been confirmed for this page.</p>
      <p>For future educational events, call <a href="tel:+19727648516">972-764-8516</a> or <a href="mailto:info@lifelinelegacyfinancial.com">email LLFG</a>.</p>
      <p><Link href="/retirement-income-checkup">Explore the Retirement Income Checkup</Link></p>
    </main>
  );
}
