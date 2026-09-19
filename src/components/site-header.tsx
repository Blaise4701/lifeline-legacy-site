"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav, site } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="utility-bar" aria-label="Site information">
        <div className="container utility-inner">
          <span>Education first · Planning structure · Products only when appropriate</span>
          <a href={site.phoneHref}>Call {site.phone}</a>
        </div>
      </aside>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand-link" href="/" aria-label="Lifeline Legacy Financial Group home" onClick={() => setOpen(false)}>
            <Image
              src="/brand/llfg-logo.png"
              alt="Lifeline Legacy Financial Group"
              width={410}
              height={137}
              priority
              className="brand-logo"
            />
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-toggle-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>{open ? "Close" : "Menu"}</span>
          </button>

          <nav
            id="primary-navigation"
            className={`primary-nav ${open ? "is-open" : ""}`}
            aria-label="Primary navigation"
          >
            <ul>
              {primaryNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link className="button button-small" href="/checkup" onClick={() => setOpen(false)}>
              Continuity Checkup
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
