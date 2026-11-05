import Link from "next/link";
import { WorkshopRegistration } from "@/components/workshop-registration";
import type { workshops } from "@/lib/site-data";
import { isRegistrationClosed } from "@/lib/workshop-status";

type Props = { workshop: (typeof workshops)[number]; index: number; now: number };

export function WorkshopCard({ workshop, index, now }: Props) {
  return (
    <article className="workshop-card workshop-card-detailed" id={workshop.id}>
      <div className="workshop-meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <p className="workshop-format">{workshop.eventType}</p>
          <time dateTime={workshop.dateTime}>{workshop.date} · {workshop.time}</time>
        </div>
      </div>

      <h3>{workshop.title}</h3>
      <p className="workshop-subtitle">{workshop.subtitle}</p>
      <p className="workshop-description">{workshop.description}</p>

      <div className="workshop-detail-block">
        <p className="workshop-detail-label">What you’ll work through</p>
        <ul className="workshop-highlight-list">
          {workshop.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      {"parts" in workshop && (
        <div className="workshop-parts">
          {workshop.parts.map((part) => (
            <div className="workshop-part" key={part.title}>
              <span>{part.time}</span>
              <strong>{part.title}</strong>
              <p>{part.outcome}</p>
            </div>
          ))}
        </div>
      )}

      <div className="workshop-outcome">
        <p className="workshop-detail-label">What you’ll leave with</p>
        <p>{workshop.outcome}</p>
      </div>

      <div className="workshop-card-footer">
        <p className="workshop-location">{workshop.location}</p>
        <p className="workshop-address">{workshop.address}</p>
        {"registrationHref" in workshop ? (
          isRegistrationClosed(workshop, now)
            ? <span className="status-label">Registration closed</span>
            : <Link className="button button-small workshop-register-button" href={workshop.registrationHref}>{workshop.registrationLabel}</Link>
        ) : (
          <WorkshopRegistration workshop={{ ...workshop, registrationClosed: isRegistrationClosed(workshop, now) }} />
        )}
      </div>
    </article>
  );
}
