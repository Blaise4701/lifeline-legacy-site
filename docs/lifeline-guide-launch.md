# Lifeline Guide production launch gate

The branch is a draft until the items below are checked on the current clean
revision. Do not check out or execute the historical ESLint loader revision.
Merge only the reviewed feature PR after these checks pass.

## Infrastructure

1. In the intended Supabase project, run `docs/lifeline-guide-supabase.sql` in
   the SQL editor. Verify RLS is enabled on the four `guide_*` tables, that
   `anon` and `authenticated` cannot read the tables or analytics views, and
   that `service_role` can call `claim_guide_request`.
2. Approve a 30-day conversation retention period before scheduling deletion.
   The cleanup function deletes messages and events by their own creation time,
   removes sessions inactive for 30 days, and clears expired limiter buckets.
   After approval, enable Supabase Cron under Integrations and create a daily
   03:00 UTC SQL job named `lifeline-guide-retention` with this command:

   ```sql
   select public.purge_expired_guide_data();
   ```

   Verify its run in Cron history. Review retention in backups and staff access
   with privacy counsel.
3. Scope `OPENAI_API_KEY` to this OpenAI project and set `OPENAI_MODEL` to a
   model that the project can use. Set API spend alerts and a usage ceiling.
   Keep the key server-only.
4. In Vercel **Production** settings, set `SUPABASE_URL`,
   `SUPABASE_SECRET_KEY` (or the legacy `SUPABASE_SERVICE_ROLE_KEY`), and a
   random `GUIDE_RATE_LIMIT_SECRET` of at least 32 characters. Set them for
   Preview too if you want to verify the database limiter there. Redeploy after
   adding variables. Never use `NEXT_PUBLIC_` for these values.
5. The production API fails closed when its limiter is not configured or the
   Supabase RPC fails. It allows at most 12 requests per IP per UTC minute and
   100 per UTC day for chat, and 60 per minute/500 per day for events. It stores
   only keyed HMAC hashes for these counters; old counters are removed by the
   cleanup job. Enable a Vercel Firewall rate limit on both Guide API routes as
   an additional edge control, and protect public
   Preview URLs while they use a paid API key without the database limiter.
6. Review two Vercel Firewall fixed-window rate-limit rules before publishing:
   - `POST` with path exactly `/api/guide`, keyed by source IP:
     12 requests per 60 seconds, then return 429.
   - `POST` with path exactly `/api/guide/event`, keyed by source IP:
     60 requests per 60 seconds, then return 429.
   The edge counters are regional; the SQL limiter remains the cross-region
   control. Inspect legitimate traffic before applying these rules.
7. Confirm a commercial Vercel plan for public launch. Hobby is restricted to
   noncommercial use. If using the one-time 14-day Pro trial, check eligibility
   for the existing team and plan for paid Pro before the trial ends.

## Release verification

1. Check the current branch's `eslint.config.mjs` blob is
   `05e726d1b4201bc8c7716d2b058279676582e8c0` before any install, lint,
   build, or live test. Do not run the old infected revision.
2. Run the build, TypeScript, and lint checks against this clean branch. On a
   fresh Preview deployment, work through `lifeline-guide-test-matrix.md` with
   synthetic examples. Check mobile layout, keyboard focus, and retry after a
   model failure. No real SSNs, credentials, or medical records are needed.
3. Check a production-equivalent deployment: no Supabase config must return
   503 without calling OpenAI; exceeding a limiter bucket must return 429;
   a repository logging failure must still show the successful Guide answer.
   Confirm redacted records, event logging, cleanup, and no anonymous database
   read with the actual Supabase project.
4. Have LLFG review financial and insurance scope, licensing states, the
   founder story, workshop dates, disclosures, privacy text, AI-provider
   processing, retention, and support contact. OpenAI `store: false` does not
   disable its default abuse monitoring logs; account-level data controls
   require separate approval.
5. Review preview outputs, telemetry, model/API costs, and escalation path for
   failures. Only then mark PR #9 ready and merge through the normal review.

The conversational analytics repository is optional in Preview. Production
request limits require the Supabase project and SQL function even if LLFG
chooses not to review or retain message content long term; revisit storage
scope before the public launch if that policy changes.
