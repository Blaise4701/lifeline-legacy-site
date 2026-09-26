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

-- Only the server-side secret/service role may access these records. Views
-- below also need explicit grants because views may bypass table RLS.
alter table public.guide_sessions enable row level security;
alter table public.guide_messages enable row level security;
alter table public.guide_events enable row level security;

revoke all on table public.guide_sessions, public.guide_messages, public.guide_events
  from public, anon, authenticated;
grant select, insert, update, delete on table
  public.guide_sessions, public.guide_messages, public.guide_events to service_role;
grant usage, select on sequence public.guide_messages_id_seq,
  public.guide_events_id_seq to service_role;

-- Fixed one-minute and one-day buckets. Both increments are atomic under
-- concurrent requests across Vercel instances. Keys are HMACs, never IPs.
create table if not exists public.guide_request_limits (
  bucket_key text primary key,
  request_count integer not null default 0,
  expires_at timestamptz not null
);

alter table public.guide_request_limits enable row level security;
revoke all on table public.guide_request_limits from public, anon, authenticated;
grant select, insert, update, delete on table public.guide_request_limits to service_role;

create or replace function public.claim_guide_request(
  p_minute_key text,
  p_day_key text,
  p_event boolean
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  minute_count integer;
  day_count integer;
begin
  if length(p_minute_key) > 100 or length(p_day_key) > 100 then
    return false;
  end if;

  insert into public.guide_request_limits as limits (bucket_key, request_count, expires_at)
  values (p_minute_key, 1, now() + interval '2 days')
  on conflict (bucket_key) do update
    set request_count = limits.request_count + 1
  returning request_count into minute_count;

  if minute_count > case when p_event then 60 else 12 end then
    return false;
  end if;

  insert into public.guide_request_limits as limits (bucket_key, request_count, expires_at)
  values (p_day_key, 1, now() + interval '2 days')
  on conflict (bucket_key) do update
    set request_count = limits.request_count + 1
  returning request_count into day_count;

  return day_count <= case when p_event then 500 else 100 end;
end;
$$;

revoke execute on function public.claim_guide_request(text, text, boolean)
  from public, anon, authenticated;
grant execute on function public.claim_guide_request(text, text, boolean) to service_role;

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

revoke all on table public.guide_intent_trends_daily,
  public.guide_topic_trends_30d, public.guide_top_questions_30d,
  public.guide_next_step_events_30d from public, anon, authenticated;
grant select on table public.guide_intent_trends_daily,
  public.guide_topic_trends_30d, public.guide_top_questions_30d,
  public.guide_next_step_events_30d to service_role;

-- Schedule this function once daily with Supabase Cron after approving the
-- 30-day retention period; verify the job is active before launch.
create or replace function public.purge_expired_guide_data() returns void
language sql
security invoker
set search_path = ''
as $$
  delete from public.guide_events where created_at < now() - interval '30 days';
  delete from public.guide_sessions where last_seen_at < now() - interval '30 days';
  delete from public.guide_request_limits where expires_at < now();
$$;

revoke execute on function public.purge_expired_guide_data()
  from public, anon, authenticated;
grant execute on function public.purge_expired_guide_data() to service_role;

-- The website should write through the server-only secret/service-role key.
-- Do not use a browser/publishable key for this repository.
