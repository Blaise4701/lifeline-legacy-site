import Link from "next/link";
import { notFound } from "next/navigation";
import { mapScoreBands } from "@/lib/family-continuity-map";
import { pageMetadata } from "@/lib/seo";

type Band = keyof typeof mapScoreBands;
type Props = { params: Promise<{ band: string }> };

export function generateStaticParams() {
  return Object.keys(mapScoreBands).map((band) => ({ band }));
}

function isBand(value: string): value is Band {
  return Object.hasOwn(mapScoreBands, value);
}

export async function generateMetadata({ params }: Props) {
  const { band } = await params;
  if (!isBand(band)) return {};
  return pageMetadata({
    title: mapScoreBands[band].headline,
    description: mapScoreBands[band].summary,
    path: `/family-continuity-map/score/${band}`,
    noindex: true,
  });
}

export default async function MapScorePage({ params }: Props) {
  const { band } = await params;
  if (!isBand(band)) notFound();
  const result = mapScoreBands[band];

  return (
    <main id="main-content" className="map-response-page">
      <div className="container map-response-card">
        <p className="eyebrow">Your self-reported range · {result.label}</p>
        <h1>{result.headline}</h1>
        <p className="map-result-summary">{result.summary}</p>
        <p>{result.details}</p>
        <div className="button-row map-result-actions">
          <Link className={band === "0-3" ? "button button-outline" : "button"} href="/family-continuity-map/book">Book Your Family Continuity Review</Link>
          <Link className="map-text-link" href="/family-continuity-map">About the Map</Link>
        </div>
        <p className="map-privacy">Your completed Map stays with you. Lifeline Legacy does not collect the personal information you write inside the worksheet.</p>
      </div>
    </main>
  );
}
