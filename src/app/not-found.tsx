import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <div className="container narrow-container">
        <p className="eyebrow">404 · Page not found</p>
        <h1>This path does not connect to the bridge.</h1>
        <p>The page may have moved. Return home or begin with the Continuity Checkup.</p>
        <div className="button-row">
          <Link className="button" href="/">Return home</Link>
          <Link className="button button-outline" href="/checkup">Take the Checkup</Link>
        </div>
      </div>
    </main>
  );
}
