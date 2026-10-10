-- Create this staging table, then populate one row for every existing
-- Supabase Auth user before running 20260602_migrate_clerk_identity_ids.sql.
create table if not exists public.clerk_identity_map (
  supabase_user_id uuid primary key references auth.users(id) on delete restrict,
  clerk_user_id text not null unique check (length(clerk_user_id) > 0),
  created_at timestamptz not null default now()
);

alter table public.clerk_identity_map enable row level security;
revoke all on public.clerk_identity_map from public, anon, authenticated;
