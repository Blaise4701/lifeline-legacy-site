import Link from "next/link";
import { connection } from "next/server";
import { PageHero } from "@/components/page-hero";
import { WorkshopCard } from "@/components/workshop-card";
import { workshops } from "@/lib/site-data";
import { hasWorkshopEnded } from "@/lib/workshop-status";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Past Retirement Seminars & Workshop Archive",
  description: "Browse past LLFG retirement education sessions in Dallas-Fort Worth and find upcoming seminars and workshops.",
  path: "/learn/seminar-archive",
});

export default async function SeminarArchivePage() {
  await connection();
  const now = Date.now();
  const archived = workshops.filter((workshop) => hasWorkshopEnded(workshop, now) || ("cancelled" in workshop && workshop.cancelled))
    .sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime));

  return (
    <main id="main-content">
      <PageHero eyebrow="Seminar archive" title="Past seminars and workshops"
        description="Explore previous retirement education topics. Registration for past sessions is closed. Cancelled sessions are identified separately."
        primary={{ href: "/learn#workshops", label: "View upcoming sessions" }}
        secondary={{ href: "/family-continuity-map", label: "Explore the Family Continuity Map" }} />
      <section className="section section-dark learn-workshops-section" aria-label="Archived sessions">
        <div className="container">
          <h2>Previous and cancelled sessions</h2>
          <div className="workshop-card-grid">
            {archived.map((workshop, index) => <WorkshopCard key={workshop.id} workshop={workshop} index={index} now={now} />)}
          </div>
          {archived.length === 0 && <p>Past sessions will appear here after they conclude.</p>}
          <p><Link className="button" href="/learn#workshops">Find your next session</Link></p>
        </div>
      </section>
    </main>
  );
}
