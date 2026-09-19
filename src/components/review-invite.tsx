import Link from "next/link";

export function ReviewInvite() {
  return (
    <section className="review-invite" aria-labelledby="review-invite-title">
      <div className="container review-invite-inner">
        <div>
          <p className="eyebrow eyebrow-light">When you are ready</p>
          <h2 id="review-invite-title">Would you like help reviewing these areas together?</h2>
          <p>
            A Continuity Review is a private conversation about your questions and planning priorities. There is no obligation to move forward.
          </p>
        </div>
        <div className="review-invite-actions">
          <Link className="button button-gold" href="/checkup#review">
            Request a Continuity Review
          </Link>
          <Link className="text-link text-link-light" href="/checkup">
            Take the Checkup first <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
