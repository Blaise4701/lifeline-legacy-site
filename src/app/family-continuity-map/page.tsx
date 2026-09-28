import { FamilyContinuityMapForm } from "@/components/family-continuity-map-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Family Continuity Map",
  description: "A private, practical worksheet to organize family responsibilities, key contacts, document locations, and first steps if life changes.",
  path: "/family-continuity-map",
});

const mapAreas = [
  ["01", "Who handles what", "Name the people who carry important responsibilities and who could step in."],
  ["02", "Who to call", "Give your family a clear starting point for trusted people and professionals."],
  ["03", "Where things are", "Record where important documents can be found without sharing sensitive details online."],
  ["04", "What happens first", "Write down the early actions that keep the household moving."],
] as const;

export default function FamilyContinuityMapLandingPage() {
  return (
    <main id="main-content" className="map-page">
      <section className="map-hero section">
        <div className="container map-hero-grid">
          <div className="map-hero-copy">
            <p className="eyebrow">The Family Continuity Map™</p>
            <h1>If the Person Who Handles Everything Couldn’t, Would Your Family Know What to Do First?</h1>
            <p className="map-lede">The Family Continuity Map™ is a simple worksheet designed to help families organize the people, responsibilities, documents, and first actions that may matter when life changes unexpectedly.</p>
            <p className="map-hero-footnote">A clearer plan begins with one written page at a time.</p>
          </div>
          <FamilyContinuityMapForm ready={process.env.GHL_CMAP_DELIVERY_READY === "true"} />
        </div>
      </section>

      <section className="section map-areas-section">
        <div className="container">
          <div className="map-section-heading">
            <p className="eyebrow">What you will organize</p>
            <h2>Put the important pieces where your family can find them.</h2>
            <p>The Map helps you see who handles what, who the backup is, who to call, where things are, what happens first, and which gaps remain.</p>
          </div>
          <div className="map-areas-grid">
            {mapAreas.map(([number, title, description]) => (
              <article className="map-area" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section map-score-section">
        <div className="container map-score-grid">
          <div>
            <p className="eyebrow">Your continuity check</p>
            <h2>Find Your Family’s Continuity Gap Score</h2>
            <p>Complete the Map privately. Count the blanks and “N” answers across Parts 1 through 4. Then, if you choose, tell us only your score range: 0–3, 4–10, or 11 or more.</p>
          </div>
          <div className="map-score-note">
            <strong>Only your range, if you choose to share it.</strong>
            <p>Your completed Map stays on your device. We never ask you to upload your worksheet or send us the household details inside it.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
