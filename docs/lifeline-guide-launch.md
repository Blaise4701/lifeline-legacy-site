# Lifeline Guide: no-transcript production launch gate

This draft branch keeps chat messages only in browser memory. The server sends
redacted recent messages to the AI service with `store: false`, returns an
answer, and writes no Guide transcript or interaction records to LLFG's
database. When the visitor finishes, the server creates a short redacted recap
for on-screen review. Email is optional, uses a time-limited signed recap,
and requires an explicit visitor action. Email copies are stored in inboxes
and by the email provider. The AI provider may keep abuse-monitoring logs.

Do not check out or execute the historical compromised ESLint loader revision.
Do not merge or deploy this branch to the commercial production domain before
the business hosting plan, protection, provider, and editorial gates below.

## Provider setup

1. Use a scoped `OPENAI_API_KEY`; keep it server-only. Confirm the project can
   use `OPENAI_MODEL` and set its usage budget/alerts. `store: false` does not
   override the provider's default safety log retention. Review data controls
   separately if provider-side retention needs to be reduced.
2. In Resend, verify a sending domain and create a sending API key. Configure
   `RESEND_API_KEY`, `GUIDE_SUMMARY_FROM` (a verified sender), and, if the
   business inbox differs from the published site email, `GUIDE_SUMMARY_RECIPIENT`.
   A visitor's address must never determine the LLFG recipient. A visitor-copy
   requires confirmation with an 8-digit emailed code; the code verification
   token is signed and expires in 10 minutes. No full transcript is emailed.
3. Create a Cloudflare Turnstile widget limited to the production hostname
   and a separate preview widget if testing email on Preview. Set its public
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and server-only `TURNSTILE_SECRET_KEY` for
   each environment. Set `GUIDE_TURNSTILE_HOSTNAMES` to the exact permitted
   hostnames, comma separated (no protocol or port). Verify the `guide-email`
   action and allowed hostname from Turnstile's server response.
4. Generate a unique server-only `GUIDE_SUMMARY_SIGNING_SECRET` of at least 32
   random bytes (for example `openssl rand -hex 32`). Put it in Vercel's
   environment settings, never in the repository. Changing it invalidates
   outstanding 10-minute recap and email-code tokens.

## Hosting and rate limit

1. Vercel's Hobby plan is for non-commercial projects. Buy Pro, secure the
   existing-team trial if Support grants it, or use another suitable business
   host before putting this LLFG feature into production. No paid upgrade or
   production deployment has been started by this branch.
2. In Vercel Firewall, publish a rate-limit rule for the exact Guide API path
   and nested paths (`/api/guide` and `/api/guide/*`). For example, use IP,
   a 10-minute fixed window, and a limit that supports a normal 12-message
   conversation plus a recap, verification, and send. On a protected test
   deployment, verify that a burst of harmless invalid requests returns a
   real edge 429 before any AI or email call. The rule cannot enforce the
   previous database's daily quota; keep OpenAI project usage protections.
3. Set `GUIDE_WAF_RATE_LIMIT_VERIFIED=true` in **Production only after** the
   rule is published and 429 verified. Until then, the production Guide API
   returns 503 before spending model or email credits. Protect Preview URLs
   when they use live provider credentials; the flag is not a rate limiter.

## Verification and privacy

1. Confirm `git hash-object eslint.config.mjs` returns
   `05e726d1b4201bc8c7716d2b058279676582e8c0` before running tools.
   Then run TypeScript, build, and ESLint checks on this clean branch.
2. With invented data, exercise chat, finish and recap, LLFG-only email,
   client-only email, both recipients, invalid and expired summary/code tokens,
   duplicate sends, provider failures, 429, keyboard navigation, and mobile.
   Confirm that any partial two-recipient delivery is reported accurately and
   retries do not send duplicate copies.
3. Ensure `/api/guide/event` is absent, no Guide request contains a session
   identifier, and no Guide path writes to Supabase. Verify logs omit raw
   visitor text, codes, and credentials. Update the privacy page and user
   interface to distinguish no LLFG transcript from email and AI-provider
   retention. LLFG must review all financial/insurance copy and contact flows.
4. The earlier Supabase test project is not used for this release. Leave its
   existing daily deletion job active until any earlier test data
   has aged out under the approved 30-day rule. Review backups separately.

Only mark PR #9 ready and merge through the normal review after the above
items pass. Do not touch `main` or the live website while preparing the branch.
