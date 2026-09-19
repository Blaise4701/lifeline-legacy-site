import Link from "next/link";

type HeroLink = {
  href: string;
  label: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  primary?: HeroLink;
  secondary?: HeroLink;
  aside?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  aside,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className={`container page-hero-grid ${aside ? "has-aside" : ""}`}>
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-lede">{description}</p>
          {(primary || secondary) && (
            <div className="button-row">
              {primary && (
                <Link className="button" href={primary.href}>
                  {primary.label}
                </Link>
              )}
              {secondary && (
                <Link className="button button-outline" href={secondary.href}>
                  {secondary.label}
                </Link>
              )}
            </div>
          )}
        </div>
        {aside && <div className="page-hero-aside">{aside}</div>}
      </div>
    </section>
  );
}
