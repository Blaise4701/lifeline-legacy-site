export type RedactionResult = {
  text: string;
  labels: string[];
};

const healthDetailPattern =
  /\b(diagnosed|diagnosis|medication|medications|prescription|prescriptions|a1c|insulin|chemotherapy|radiation|cancer|diabetes|epilepsy|autism|pregnan(?:t|cy)|surgery|surgeries)\b/i;

export function redactGuideText(input: string): RedactionResult {
  let text = input;
  const labels = new Set<string>();

  const replace = (pattern: RegExp, replacement: string, label: string) => {
    const next = text.replace(pattern, replacement);
    if (next !== text) {
      labels.add(label);
      text = next;
    }
  };

  replace(
    /\b\d{3}-\d{2}-\d{4}\b/g,
    "[SSN REDACTED]",
    "ssn",
  );

  replace(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "[EMAIL REDACTED]",
    "email",
  );

  replace(
    /(?<!\d)(?:\+?1[ .-]?)?(?:\(\d{3}\)|\d{3})[ .-]?\d{3}[ .-]?\d{4}(?!\d)/g,
    "[PHONE REDACTED]",
    "phone",
  );

  replace(
    /\b(?:\d[ -]*?){13,19}\b/g,
    "[PAYMENT CARD REDACTED]",
    "payment-card",
  );

  replace(
    /\b(account|acct|routing|policy|member|client)\s*(?:number|#|no\.?|id)?\s*[:=-]?\s*[A-Z0-9-]{6,}\b/gi,
    "[ACCOUNT IDENTIFIER REDACTED]",
    "account-identifier",
  );

  replace(
    /\b(password|passcode|pin|otp|verification code|security code)\s*[:=-]\s*\S+/gi,
    "[CREDENTIAL REDACTED]",
    "credential",
  );

  if (healthDetailPattern.test(text)) {
    labels.add("health-details");
    text =
      "[HEALTH DETAILS REDACTED] Visitor asked a health or underwriting-related question.";
  }

  return { text, labels: [...labels] };
}
