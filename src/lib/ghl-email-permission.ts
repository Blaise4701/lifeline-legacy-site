export type EmailPermission = "allowed" | "blocked" | "unknown";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function emailPermission(contact: unknown): EmailPermission {
  if (!isRecord(contact)) return "unknown";
  if (contact.dnd === true) return "blocked";

  const settings = contact.dndSettings;
  if (isRecord(settings)) {
    for (const [channel, value] of Object.entries(settings)) {
      if (
        (channel.toLowerCase() === "email" || channel.toLowerCase() === "all") &&
        isRecord(value) &&
        value.status === "active"
      ) {
        return "blocked";
      }
    }
  }

  return "allowed";
}
