import Link from "next/link";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Your Family Continuity Review",
  description: "Schedule a conversation about the gaps you identified in your Family Continuity Map.",
  path: "/family-continuity-map/book",
  noindex: true,
});

export default function MapBookingPage() {
  const configuredUrl = process.env.GHL_FAMILY_CONTINUITY_REVIEW_URL;
  let bookingUrl: URL | null = null;
  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl);
      if (url.protocol === "https:") bookingUrl = url;
    } catch {
      // Invalid configuration falls back to an honest scheduling message.
    }
  }
  if (bookingUrl) redirect(bookingUrl.href);

  return (
    <main id="main-content" className="map-response-page">
      <div className="container map-response-card">
        <p className="eyebrow">Your Family Continuity Review</p>
        <h1>Let’s talk through what your Map revealed.</h1>
        <p>Online scheduling is being prepared. Please email us to request Your Family Continuity Review. You can bring your Map, even if it is only partly complete.</p>
        <a className="button" href="mailto:info@lifelinelegacyfinancial.com?subject=Your%20Family%20Continuity%20Review">Request a conversation by email</a>
        <p className="map-privacy"><Link href="/family-continuity-map">Return to the Map</Link></p>
      </div>
    </main>
  );
}
