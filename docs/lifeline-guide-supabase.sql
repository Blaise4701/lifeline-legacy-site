-- Lifeline Guide Conversation Intelligence Repository
-- Run in the Supabase SQL editor for the project connected to Lifeline Legacy.
-- The website uses the server-only service-role key. Do not expose that key in browser code.

create table if not exists public.guide_sessions (
  session_key text primary key,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  landing_path text,
  current_path text,
  primary_intent text,
  last_intent text,
  last_pillar text,
  last_topics text[] not null default '{}',
  message_count integer not null default 0,
  last_suggested_step_label text,
  last_suggested_step_href text,
  redaction_count integer not null default 0
);

create table if not exists public.guide_messages (
  id bigint generated always as identity primary key,
  session_key text not null references public.guide_sessions(session_key) on delete cascade,
  exchange_id uuid not null,
  role text not null check (role in ('user', 'assistant')),
  content_redacted text not null,
  intent text,
  pillar text,
  topics text[] not null default '{}',
  redaction_labels text[] not null default '{}',
  model text,
  response_ms integer,
  created_at timestamptz not null default now()
);

create table if not exists public.guide_events (
  id bigint generated always as identity primary key,
  session_key text not null,
  event_type text not null,
  event_value text,
  page_path text,
  created_at timestamptz not null default now()
);

create index if not exists guide_messages_session_created_idx
  on public.guide_messages (session_key, created_at);

create index if not exists guide_messages_created_idx
  on public.guide_messages (created_at desc);

create index if not exists guide_messages_intent_idx
  on public.guide_messages (intent);

create index if not exists guide_events_created_idx
  on public.guide_events (created_at desc);

create index if not exists guide_events_type_idx
  on public.guide_events (event_type);

create or replace view public.guide_intent_trends_daily as
select
  date_trunc('day', created_at)::date as day,
  intent,
  count(*) filter (where role = 'user') as questions,
  count(distinct session_key) as sessions
from public.guide_messages
group by 1, 2
order by 1 desc, 3 desc;

create or replace view public.guide_topic_trends_30d as
select
  topic,
  count(*) as mentions,
  count(distinct gm.session_key) as sessions
from public.guide_messages gm
cross join lateral unnest(gm.topics) as topic
where gm.role = 'user'
  and gm.created_at >= now() - interval '30 days'
group by topic
order by mentions desc;

create or replace view public.guide_top_questions_30d as
select
  content_redacted as question,
  count(*) as times_asked,
  max(created_at) as last_asked
from public.guide_messages
where role = 'user'
  and created_at >= now() - interval '30 days'
group by content_redacted
order by times_asked desc, last_asked desc
limit 100;

create or replace view public.guide_next_step_events_30d as
select
  event_type,
  event_value,
  count(*) as events,
  count(distinct session_key) as sessions
from public.guide_events
where created_at >= now() - interval '30 days'
group by event_type, event_value
order by events desc;

-- Recommended repository permissions:
-- Keep these tables private. Do not enable public browser access.
-- The website should write through the server-only SUPABASE_SERVICE_ROLE_KEY.
-- Review retention with your privacy/compliance counsel before enabling automated deletion.
