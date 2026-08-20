-- Already applied to project risiwzlmheuikwwtjqjd as migration
-- "create_messages_table_with_rls". Kept here as the source of truth; re-run it
-- in the SQL editor when setting up a fresh project.
-- auth.users is managed by Supabase Auth; this is the app's own table.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  prompt text not null,
  response text,
  created_at timestamptz not null default now()
);

create index if not exists messages_user_id_created_at_idx
  on public.messages (user_id, created_at desc);

-- Row Level Security: each user only ever sees their own rows.
-- The secret key used by /api functions bypasses these policies.
alter table public.messages enable row level security;

-- auth.uid() is wrapped in a subselect so Postgres evaluates it once per query
-- rather than once per row.
create policy "read own messages"
  on public.messages for select
  using ((select auth.uid()) = user_id);

create policy "insert own messages"
  on public.messages for insert
  with check ((select auth.uid()) = user_id);

create policy "delete own messages"
  on public.messages for delete
  using ((select auth.uid()) = user_id);
