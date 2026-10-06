import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { RetirementIncomeCheckup } from "@/components/retirement-income-checkup";

export const metadata = pageMetadata({
  title: "Retirement Income Checkup",
  description: "Take a six-question retirement income checkup to see what appears organized and which areas may deserve a closer look, including income, Social Security, withdrawals, market risk, and legacy.",
  path: "/retirement-income-checkup",
});

export default function RetirementIncomeCheckupPage() {
  return (
    <main id="main-content" className="checkup-page">
      <div className="container">
        <div className="checkup-intro">
          <p className="eyebrow">Retirement Income Checkup</p>
          <h1>How ready is your retirement income plan?</h1>
          <p>
            Answer six plain-language questions to see what appears organized and where your retirement income plan may deserve a closer look. No account numbers, balances, or investment information are required.
          </p>
          <p>
            Your answers stay in your browser unless you choose to request a Continuity Review.
          </p>
          <div className="button-row">
            <Link className="text-link" href="/retirement-income">
              Prefer to learn first? Explore retirement income planning <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <RetirementIncomeCheckup />
      </div>
    </main>
  );
}
