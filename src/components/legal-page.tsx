type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero">
        <div className="container narrow-container">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          <span className="draft-badge">Pre-launch draft · compliance review required</span>
        </div>
      </header>
      <div className="container narrow-container legal-content">{children}</div>
    </main>
  );
}
