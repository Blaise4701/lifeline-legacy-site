"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
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

type SummaryResponse = { summary?: string; summaryToken?: string | null; error?: string };
type Delivery = "none" | "client" | "llfg" | "both";

type TurnstileWidget = {
  render: (container: HTMLElement, options: {
    sitekey: string;
    action: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileWidget;
  }
}

export function LifelineGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [suggestedStep, setSuggestedStep] = useState<GuideSuggestedStep | null>(null);
  const [summary, setSummary] = useState("");
  const [summaryToken, setSummaryToken] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [delivery, setDelivery] = useState<Delivery>("none");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [shareConsent, setShareConsent] = useState(false);
  const [isEmailBusy, setIsEmailBusy] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestAssistantRef = useRef<HTMLDivElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetRef = useRef("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

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

  useEffect(() => {
    if (!summary || emailSuccess || delivery === "none" || !turnstileReady || !turnstileSiteKey || !turnstileContainerRef.current) return;
    const widget = window.turnstile;
    if (!widget) return;

    const widgetId = widget.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      action: "guide-email",
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
    turnstileWidgetRef.current = widgetId;
    return () => {
      widget.remove(widgetId);
      turnstileWidgetRef.current = "";
    };
  }, [summary, delivery, emailSuccess, turnstileReady, turnstileSiteKey]);

  function refreshEmailCheck() {
    setTurnstileToken("");
    if (turnstileWidgetRef.current) {
      window.turnstile?.reset(turnstileWidgetRef.current);
    }
  }

  function openGuide() {
    setIsOpen(true);
    window.setTimeout(() => textareaRef.current?.focus(), 80);
  }

  function closeGuide() {
    setIsOpen(false);
    launcherRef.current?.focus();
  }

  function resetGuide() {
    setMessages([greeting]);
    setDraft("");
    setError("");
    setSuggestedStep(null);
    setSummary("");
    setSummaryToken("");
    setDelivery("none");
    setEmail("");
    setConfirmationCode("");
    setChallengeToken("");
    setEmailSuccess("");
    setShareConsent(false);
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
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
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

  async function finishChat() {
    if (isSending || isSummarizing || !messages.some((message) => message.role === "user")) return;
    setError("");
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/guide/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: transcriptForApi }),
      });
      const payload = (await response.json()) as SummaryResponse;
      if (!response.ok || !payload.summary) throw new Error(payload.error || "The summary could not be created.");
      setSummary(payload.summary);
      setSummaryToken(payload.summaryToken || "");
      setDelivery("none");
      setEmailSuccess("");
    } catch (summaryError) {
      setError(summaryError instanceof Error ? summaryError.message : "The summary could not be created.");
    } finally {
      setIsSummarizing(false);
    }
  }

  async function sendCode() {
    if (!summaryToken || !/^\S+@\S+\.\S+$/.test(email.trim()) || !turnstileToken) {
      setError("Enter your email address and complete the security check.");
      return;
    }
    setIsEmailBusy(true);
    setError("");
    try {
      const response = await fetch("/api/guide/summary/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryToken, email, turnstileToken }),
      });
      const payload = (await response.json()) as { challengeToken?: string; error?: string };
      if (!response.ok || !payload.challengeToken) throw new Error(payload.error || "Could not send the code.");
      setChallengeToken(payload.challengeToken);
      setConfirmationCode("");
    } catch (emailError) {
      setError(emailError instanceof Error ? emailError.message : "Could not send the code.");
    } finally {
      setIsEmailBusy(false);
      refreshEmailCheck();
    }
  }

  async function emailSummary() {
    if (!summaryToken || !delivery || delivery === "none") return;
    if (delivery !== "client" && !shareConsent) {
      setError("Please approve sharing the summary with Lifeline Legacy.");
      return;
    }
    if (delivery === "llfg" && !turnstileToken) {
      setError("Complete the email security check.");
      return;
    }
    if (delivery !== "llfg" && (!challengeToken || !/^\d{8}$/.test(confirmationCode))) {
      setError("Enter the 8-digit code emailed to you.");
      return;
    }

    setIsEmailBusy(true);
    setError("");
    try {
      const response = await fetch("/api/guide/summary/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summaryToken, delivery, email, challengeToken,
          code: confirmationCode, turnstileToken, shareConsent,
        }),
      });
      const payload = (await response.json()) as { delivered?: string[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Could not send the summary.");
      setEmailSuccess(
        delivery === "both" ? "A summary was emailed to you and Lifeline Legacy."
          : delivery === "client" ? "A summary was emailed to you."
            : "A summary was emailed to Lifeline Legacy.",
      );
    } catch (emailError) {
      setError(emailError instanceof Error ? emailError.message : "Could not send the summary.");
    } finally {
      setIsEmailBusy(false);
      refreshEmailCheck();
    }
  }

  return (
    <div className="lifeline-guide-shell">
      {isOpen ? (
        <section
          className="lifeline-guide-panel"
          aria-label="Lifeline Guide"
          aria-live="polite"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeGuide();
            }
          }}
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
                disabled={isSending || isSummarizing || isEmailBusy}
              >
                Start over
              </button>
              {!summary && messages.some((message) => message.role === "user") ? (
                <button type="button" className="lifeline-guide-text-button" onClick={() => void finishChat()} disabled={isSending || isSummarizing}>
                  {isSummarizing ? "Summarizing…" : "Finish chat"}
                </button>
              ) : null}
              <button
                type="button"
                className="lifeline-guide-close"
                onClick={closeGuide}
                aria-label="Close Lifeline Guide"
              >
                ×
              </button>
            </div>
          </header>

          <div className="lifeline-guide-messages" ref={messagesRef}>
            {summary ? (
              <div className="lifeline-guide-summary" aria-live="polite">
                <h3>Your conversation summary</h3>
                <p>{summary}</p>
                <button type="button" onClick={() => {
                  setSummary("");
                  setSummaryToken("");
                  setEmailSuccess("");
                }}>Keep chatting</button>
              </div>
            ) : (
              <>
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
                >
                  Explore →
                </a>
              </div>
            ) : null}
              </>
            )}
          </div>

          {summary ? (
            <div className="lifeline-guide-summary-form">
              <p>Choose what happens to your summary. The full chat is not emailed or saved by Lifeline Legacy.</p>
              <label htmlFor="guide-summary-delivery">Summary delivery</label>
              <select id="guide-summary-delivery" value={delivery} disabled={!summaryToken || Boolean(emailSuccess)} onChange={(event) => {
                setDelivery(event.target.value as Delivery);
                setChallengeToken("");
                setConfirmationCode("");
                setTurnstileToken("");
                setEmailSuccess("");
                setError("");
              }}>
                <option value="none">Only show it here</option>
                <option value="client">Email me a copy</option>
                <option value="llfg">Share anonymously with Lifeline Legacy</option>
                <option value="both">Email me and share with Lifeline Legacy</option>
              </select>
              {!summaryToken ? <p>Email delivery is not configured for this preview.</p> : null}
              {(delivery === "client" || delivery === "both") && summaryToken ? (
                <>
                  <label htmlFor="guide-summary-email">Your email address</label>
                  <input id="guide-summary-email" type="email" autoComplete="email" value={email} disabled={Boolean(emailSuccess)} onChange={(event) => {
                    setEmail(event.target.value.slice(0, 254));
                    setChallengeToken("");
                    setConfirmationCode("");
                  }} />
                  {!challengeToken && !emailSuccess ? <button type="button" disabled={isEmailBusy || !turnstileToken} onClick={() => void sendCode()}>Send confirmation code</button> : null}
                  {challengeToken && !emailSuccess ? (
                    <>
                      <label htmlFor="guide-summary-code">8-digit code from your email</label>
                      <input id="guide-summary-code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={confirmationCode} onChange={(event) => setConfirmationCode(event.target.value.replace(/\D/g, "").slice(0, 8))} />
                    </>
                  ) : null}
                </>
              ) : null}
              {(delivery === "llfg" || delivery === "both") && summaryToken ? (
                <label className="lifeline-guide-consent">
                  <input type="checkbox" checked={shareConsent} disabled={Boolean(emailSuccess)} onChange={(event) => setShareConsent(event.target.checked)} />
                  {delivery === "both" ? "I agree to share this summary and my verified email address with Lifeline Legacy." : "I agree to share this summary anonymously with Lifeline Legacy."} No full transcript will be sent.
                </label>
              ) : null}
              {summaryToken && delivery !== "none" && !emailSuccess ? (
                <>
                  {turnstileSiteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setTurnstileReady(true)} /> : <p>Email security is not configured for this preview.</p>}
                  <div ref={turnstileContainerRef} aria-label="Email security check" />
                  {(delivery === "llfg" || Boolean(challengeToken)) ? (
                    <button type="button" disabled={isEmailBusy || (delivery !== "client" && !shareConsent) || (delivery === "llfg" ? !turnstileToken : confirmationCode.length !== 8)} onClick={() => void emailSummary()}>
                      {isEmailBusy ? "Sending…" : "Email summary"}
                    </button>
                  ) : null}
                </>
              ) : null}
              {emailSuccess ? <p role="status">{emailSuccess}</p> : null}
              {error ? <p className="lifeline-guide-summary-error" role="alert">{error}</p> : null}
              <p>Any emailed summary will be kept by the recipient and email provider. <a href="/privacy">Privacy</a></p>
            </div>
          ) : <form className="lifeline-guide-form" onSubmit={onSubmit}>
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
              The chat stays in this open page; Lifeline Legacy does not save transcripts. Please do not share
              account numbers, Social Security numbers, passwords, or medical details.{" "}
              <a href="/privacy">Privacy</a>
            </p>
          </form>}
        </section>
      ) : null}

      <button
        type="button"
        className="lifeline-guide-launcher"
        ref={launcherRef}
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
