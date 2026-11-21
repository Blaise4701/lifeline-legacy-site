export type BookingPrefill = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

/**
 * Normalizes a US phone number to +1XXXXXXXXXX for the booking widget.
 * Returns the trimmed input unchanged when it does not look like a US number.
 */
export function normalizeUsPhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return trimmed;
}

/**
 * Adds the visitor's first name, last name, email and phone to a GHL booking widget URL so
 * the calendar form does not ask for them again. Only https URLs are changed;
 * anything else is returned as provided. Existing query parameters are kept.
 */
export function buildBookingUrl(bookingUrl: string, prefill: BookingPrefill) {
  try {
    const url = new URL(bookingUrl);
    if (url.protocol !== "https:") return bookingUrl;
    if (prefill.firstName) url.searchParams.set("first_name", prefill.firstName);
    if (prefill.lastName) url.searchParams.set("last_name", prefill.lastName);
    if (prefill.email) url.searchParams.set("email", prefill.email);
    if (prefill.phone) url.searchParams.set("phone", normalizeUsPhone(prefill.phone));
    return url.toString();
  } catch {
    return bookingUrl;
  }
}
