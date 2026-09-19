"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pillars } from "@/lib/site-data";

type PillarKey = (typeof pillars)[number]["key"];

function PillarContent({ pillar }: { pillar: (typeof pillars)[number] }) {
  return (
    <div className="pillar-content-grid">
      <div>
        <p className="detail-label">Questions it asks</p>
        <ul className="line-list">
          {pillar.questions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <p className="detail-label">What it coordinates</p>
        <ul className="line-list">
          {pillar.coordinates.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="missing-card">
        <p className="detail-label">When it is missing</p>
        <p>{pillar.missing}</p>
      </div>
    </div>
  );
}

export function ContinuityBridge({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<PillarKey>("continuity");

  useEffect(() => {
    const selectFromHash = () => {
      const key = window.location.hash.replace("#bridge-", "") as PillarKey;
      if (pillars.some((pillar) => pillar.key === key)) setActive(key);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);

  const choose = (key: PillarKey) => {
    setActive(key);
    window.history.replaceState(null, "", `#bridge-${key}`);
  };

  const selected = pillars.find((pillar) => pillar.key === active) ?? pillars[0];

  return (
    <div className={`bridge-explorer ${compact ? "bridge-compact" : ""}`}>
      <div className="bridge-desktop">
        <div className="pillar-tabs" role="tablist" aria-label="Continuity Bridge sections">
          {pillars.map((pillar) => (
            <button
              key={pillar.key}
              type="button"
              role="tab"
              id={`tab-${pillar.key}`}
              aria-selected={active === pillar.key}
              aria-controls={`panel-${pillar.key}`}
              tabIndex={active === pillar.key ? 0 : -1}
              onClick={() => choose(pillar.key)}
              onKeyDown={(event) => {
                const current = pillars.findIndex((item) => item.key === pillar.key);
                let next = current;
                if (event.key === "ArrowRight") next = (current + 1) % pillars.length;
                if (event.key === "ArrowLeft") next = (current - 1 + pillars.length) % pillars.length;
                if (event.key === "Home") next = 0;
                if (event.key === "End") next = pillars.length - 1;
                if (next !== current) {
                  event.preventDefault();
                  choose(pillars[next].key);
                  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[role='tab']");
                  tabs?.[next]?.focus();
                }
              }}
            >
              <span>{pillar.number}</span>
              {pillar.name}
            </button>
          ))}
        </div>
        <div
          className="pillar-panel"
          role="tabpanel"
          id={`panel-${selected.key}`}
          aria-labelledby={`tab-${selected.key}`}
        >
          <div className="pillar-panel-heading">
            <div className="pillar-number" aria-hidden="true">{selected.number}</div>
            <div>
              <h3>{selected.name}</h3>
              <p>{selected.definition}</p>
            </div>
          </div>
          <PillarContent pillar={selected} />
        </div>
      </div>

      <div className="bridge-mobile" aria-label="Continuity Bridge sections">
        {pillars.map((pillar, index) => (
          <details key={pillar.key} id={`bridge-${pillar.key}`} open={index === 0}>
            <summary>
              <span>{pillar.number}</span>
              <strong>{pillar.name}</strong>
              <span className="summary-symbol" aria-hidden="true">+</span>
            </summary>
            <div className="mobile-pillar-content">
              <p className="pillar-definition">{pillar.definition}</p>
              <PillarContent pillar={pillar} />
            </div>
          </details>
        ))}
      </div>

      {!compact && (
        <div className="bridge-action">
          <Link className="button button-gold" href="/checkup">
            Take the Continuity Checkup
          </Link>
        </div>
      )}
    </div>
  );
}
