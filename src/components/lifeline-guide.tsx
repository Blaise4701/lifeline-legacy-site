"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  guideStarterQuestions,
  type GuideMessage,
} from "@/lib/lifeline-guide";

const greeting: GuideMessage = {
  role: "assistant",
  content:
    "Hi, I’m the Lifeline Guide. I can help you understand retirement income, family protection, business continuity, legacy planning, and the Continuity Bridge™. What would you like to explore?",
};

type GuideSuggestedStep = {
  href: string;
  label: string;
  description: string;
};

type GuideApiResponse = {
  reply?: string;
  error?: string;
  intent?: string;
  suggestedStep?: GuideSuggestedStep | null;
};

export function LifelineGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [suggestedStep, setSuggestedStep] = useState<GuideSuggestedStep | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestAssistantRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef("");
  const landingPathRef = useRef("");
  const openedLoggedRef = useRef(false);

  const canSend = draft.trim().length > 0 && !isSending;
  const showStarters = messages.length === 1;

  const transcriptForApi = useMemo(
    () => messages.filter((message) => message.content.trim().length > 0),
    [messages],
  );

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    const container = messagesRef.current;
    const latestAssistant = latestAssistantRef.current;

    if (
      messages.length > 1 &&
      latestMessage?.role === "assistant" &&
      container &&
      latestAssistant
    ) {
      const top =
        latestAssistant.offsetTop - container.offsetTop - 12;

      container.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    }
  }, [messages]);

  function getSessionContext() {
    if (typeof window === "undefined") {
      return { sessionId: "", landingPath: "/", currentPath: "/" };
    }

    if (!sessionIdRef.current) {
      const storedSessionId = window.sessionStorage.getItem(
        "lifeline-guide-session-id",
      );
      const sessionId = storedSessionId || window.crypto.randomUUID();
      window.sessionStorage.setItem("lifeline-guide-session-id", sessionId);
      sessionIdRef.current = sessionId;
    }

    if (!landingPathRef.current) {
      const storedLandingPath = window.sessionStorage.getItem(
        "lifeline-guide-landing-path",
      );
      const landingPath =
        storedLandingPath || window.location.pathname || "/";
      window.sessionStorage.setItem(
        "lifeline-guide-landing-path",
        landingPath,
      );
      landingPathRef.current = landingPath;
    }

    return {
      sessionId: sessionIdRef.current,
      landingPath: landingPathRef.current,
      currentPath: window.location.pathname || "/",
    };
  }

  function recordEvent(
    eventType:
      | "guide_opened"
      | "suggested_step_clicked"
      | "checkup_started"
      | "continuity_review_started",
    eventValue?: string,
  ) {
    const context = getSessionContext();
    if (!context.sessionId) return;

    void fetch("/api/guide/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: context.sessionId,
        eventType,
        eventValue,
        pagePath: context.currentPath,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  function openGuide() {
    setIsOpen(true);

    if (!openedLoggedRef.current) {
      openedLoggedRef.current = true;
      recordEvent("guide_opened");
    }

    window.setTimeout(() => textareaRef.current?.focus(), 80);
  }

  function resetGuide() {
    setMessages([greeting]);
    setDraft("");
    setError("");
    setSuggestedStep(null);
    window.setTimeout(() => textareaRef.current?.focus(), 80);
  }

  async function sendMessage(rawMessage?: string) {
    const content = (rawMessage ?? draft).trim();
    if (!content || isSending) return;

    const userMessage: GuideMessage = { role: "user", content };
    const nextMessages = [...transcriptForApi, userMessage];

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    setSuggestedStep(null);
    setIsSending(true);

    try {
      const context = getSessionContext();
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          sessionId: context.sessionId,
          landingPath: context.landingPath,
          currentPath: context.currentPath,
        }),
      });

      const payload = (await response.json()) as GuideApiResponse;

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "The Lifeline Guide could not answer.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.reply as string },
      ]);
      setSuggestedStep(payload.suggestedStep ?? null);
    } catch (requestError) {
      setMessages((current) => current.slice(0, -1));
      setDraft(content);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The Lifeline Guide could not answer right now.",
      );
    } finally {
      setIsSending(false);
      window.setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) void sendMessage();
    }
  }

  return (
    <div className="lifeline-guide-shell">
      {isOpen ? (
        <section
          className="lifeline-guide-panel"
          aria-label="Lifeline Guide"
          aria-live="polite"
        >
          <header className="lifeline-guide-header">
            <div>
              <p className="lifeline-guide-kicker">Lifeline Legacy Financial Group</p>
              <h2>Lifeline Guide</h2>
              <p>Education-first answers. No product pitch.</p>
            </div>
            <div className="lifeline-guide-header-actions">
              <button
                type="button"
                className="lifeline-guide-text-button"
                onClick={resetGuide}
                disabled={isSending}
              >
                Start over
              </button>
              <button
                type="button"
                className="lifeline-guide-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Lifeline Guide"
              >
                ×
              </button>
            </div>
          </header>

          <div className="lifeline-guide-messages" ref={messagesRef}>
            {messages.map((message, index) => {
              const isLatestAssistant =
                message.role === "assistant" && index === messages.length - 1;

              return (
              <div
                ref={isLatestAssistant ? latestAssistantRef : undefined}
                className={`lifeline-guide-message lifeline-guide-message-${message.role}`}
                key={`${message.role}-${index}`}
              >
                <span>{message.role === "assistant" ? "Lifeline Guide" : "You"}</span>
                <p>{message.content}</p>
              </div>
              );
            })}

            {isSending ? (
              <div className="lifeline-guide-message lifeline-guide-message-assistant lifeline-guide-thinking">
                <span>Lifeline Guide</span>
                <p>Thinking through your question…</p>
              </div>
            ) : null}

            {showStarters ? (
              <div className="lifeline-guide-starters" aria-label="Suggested questions">
                {guideStarterQuestions.map((question) => (
                  <button
                    type="button"
                    onClick={() => void sendMessage(question)}
                    key={question}
                  >
                    {question}
                  </button>
                ))}
              </div>
            ) : null}

            {error ? (
              <div className="lifeline-guide-error" role="alert">
                <p>{error}</p>
                <a href="/continuity-review">Start a Continuity Review instead →</a>
              </div>
            ) : null}

            {suggestedStep && !isSending ? (
              <div className="lifeline-guide-next-step">
                <div>
                  <span>Suggested next step</span>
                  <strong>{suggestedStep.label}</strong>
                  <p>{suggestedStep.description}</p>
                </div>
                <a
                  href={suggestedStep.href}
                  onClick={() => {
                    const eventType =
                      suggestedStep.href === "/continuity-review"
                        ? "continuity_review_started"
                        : suggestedStep.href.startsWith("/checkup")
                          ? "checkup_started"
                          : "suggested_step_clicked";

                    recordEvent(
                      eventType,
                      `${suggestedStep.label} | ${suggestedStep.href}`,
                    );
                  }}
                >
                  Explore →
                </a>
              </div>
            ) : null}
          </div>

          <form className="lifeline-guide-form" onSubmit={onSubmit}>
            <label htmlFor="lifeline-guide-question">
              Ask a retirement, protection, business, or legacy question
            </label>
            <div className="lifeline-guide-input-row">
              <textarea
                id="lifeline-guide-question"
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, 2400))}
                onKeyDown={onKeyDown}
                placeholder="Example: I’m five years from retirement. What should I be organizing now?"
                rows={2}
              />
              <button type="submit" disabled={!canSend}>
                Send
              </button>
            </div>
            <p className="lifeline-guide-disclaimer">
              Educational information only—not legal, tax, investment, or individualized financial advice.
              Conversations may be stored in redacted form and reviewed to improve the Guide. Please do not share
              account numbers, Social Security numbers, passwords, or medical details.{" "}
              <a href="/privacy">Privacy</a>
            </p>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="lifeline-guide-launcher"
        onClick={openGuide}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Lifeline Guide is open" : "Ask the Lifeline Guide"}
      >
        <span className="lifeline-guide-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M5 5.75A2.75 2.75 0 0 1 7.75 3h8.5A2.75 2.75 0 0 1 19 5.75v6.5A2.75 2.75 0 0 1 16.25 15H11l-4.7 3.75c-.54.43-1.3.05-1.3-.64V15.5A2.75 2.75 0 0 1 3 12.85v-7.1h2Z" />
            <path d="M8 8h8M8 11h5" />
          </svg>
        </span>
        <span>Ask the Lifeline Guide</span>
      </button>
    </div>
  );
}
