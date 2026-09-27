// Production must be protected by a published Vercel Firewall rate-limit rule
// covering /api/guide and all nested Guide endpoints before this flag is set.
// Preview remains available for QA without provisioning a database.
export function guideGatewayReady(): boolean {
  return (
    process.env.VERCEL_ENV !== "production" ||
    process.env.GUIDE_WAF_RATE_LIMIT_VERIFIED === "true"
  );
}
