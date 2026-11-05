"use client";

import type { ReactNode } from "react";
import type { RieSessionKey } from "@/lib/retirement-income-explained";

export const SESSION_EVENT = "rie:select-session";

// Every CTA scrolls to the one registration form. When a CTA names a session, the
// form preselects it. Without JavaScript the link still jumps to #register.
export function SessionCta({
  session,
  className = "button",
  children,
}: {
  session?: RieSessionKey;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href="#register"
      onClick={(event) => {
        event.preventDefault();
        if (session) window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: session }));
        const form = document.getElementById("register");
        form?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", session ? `?session=${session}#register` : "#register");
        window.setTimeout(() => {
          (document.getElementById("rie-first-name") as HTMLInputElement | null)?.focus({ preventScroll: true });
        }, 450);
      }}
    >
      {children}
    </a>
  );
}
