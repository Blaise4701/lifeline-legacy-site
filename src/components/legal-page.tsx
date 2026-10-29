type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  draft?: boolean;
  children: React.ReactNode;
};

export function LegalPage({ eyebrow, title, intro, draft = true, children }: LegalPageProps) {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero">
        <div className="container narrow-container">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
          {draft && <span className="draft-badge">Pre-launch draft · compliance review required</span>}
        </div>
      </header>
      <div className="container narrow-container legal-content">{children}</div>
    </main>
  );
}
