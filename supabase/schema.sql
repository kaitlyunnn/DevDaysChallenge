-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
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
-- The service role key used by /api functions bypasses these policies.
alter table public.messages enable row level security;

create policy "read own messages"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "insert own messages"
  on public.messages for insert
  with check (auth.uid() = user_id);

create policy "delete own messages"
  on public.messages for delete
  using (auth.uid() = user_id);
