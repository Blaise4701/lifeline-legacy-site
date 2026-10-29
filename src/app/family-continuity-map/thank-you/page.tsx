import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Your Family Continuity Map Is on Its Way",
  description: "Check your inbox for your Family Continuity Map and begin with one section.",
  path: "/family-continuity-map/thank-you",
  noindex: true,
});

export default function MapThankYouPage() {
  return (
    <main id="main-content" className="map-response-page">
      <div className="container map-response-card">
        <p className="eyebrow">Next step</p>
        <h1>Check Your Inbox. Your Map Is on Its Way.</h1>
        <p>Start with Part 1: Who does what. You do not need to finish the entire Map today.</p>
        <p>Spend about 10 minutes identifying who handles important responsibilities today and who would step in if they could not. The full exercise takes about 45 minutes.</p>
        <p className="map-action-note">Check your inbox and open the Map. If you do not see the email, check your spam or promotions folder.</p>
        <Link className="button button-outline" href="/family-continuity-map/book">Book Your Family Continuity Review</Link>
      </div>
    </main>
  );
}
