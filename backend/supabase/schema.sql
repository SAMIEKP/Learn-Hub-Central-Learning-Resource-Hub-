-- Learn Hub database model using Supabase Auth for identity with Supabase for data/storage.

create or replace function public.current_user_id()
returns text
language sql
stable
as $$
  select auth.uid()::text
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if current_setting('role', true) <> 'service_role' then
    if tg_op = 'INSERT' then
      new.role := 'student';
    elsif new.role is distinct from old.role then
      raise exception 'Profile roles can only be changed by trusted administrators';
    end if;
  end if;
  return new;
end
$$;

create table if not exists public.profiles (
  id text primary key,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  school text,
  form text,
  department text,
  subjects text[] not null default '{}',
  avatar_path text,
  bio text,
  phone text,
  registration_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before insert or update on public.profiles
  for each row execute function public.protect_profile_role();

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  contributor_id text not null references public.profiles(id) on delete restrict,
  title text not null,
  description text,
  subject text,
  department text,
  form text,
  topic text,
  examination_year integer,
  resource_type text not null check (resource_type in ('book', 'past_paper', 'notes', 'video', 'other')),
  author text,
  source text,
  file_path text,
  file_name text,
  file_size_bytes bigint,
  mime_type text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  version integer not null default 1,
  extracted_text text,
  keywords text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.resources enable row level security;

-- Profiles RLS
create policy "Users can view their own profile"
  on public.profiles for select
  using ((select public.current_user_id()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select public.current_user_id()) = id)
  with check ((select public.current_user_id()) = id);

create policy "Teachers and admins can view all profiles"
  on public.profiles for select
  using (
    id = (select public.current_user_id())
    or exists (
      select 1 from public.profiles p
      where p.id = (select public.current_user_id()) and p.role = 'admin'
    )
  );

-- Resources RLS
create policy "Anyone can view verified resources"
  on public.resources for select
  using (verification_status = 'verified');

create policy "Contributors can view their own resources"
  on public.resources for select
  using (contributor_id = (select public.current_user_id()));

create policy "Teachers and admins can view all resources"
  on public.resources for select
  using (
    contributor_id = (select public.current_user_id())
    or exists (
      select 1 from public.profiles p
      where p.id = (select public.current_user_id()) and p.role in ('teacher', 'admin')
    )
  );

create policy "Teachers and admins can update any resource"
  on public.resources for update
  using (
    contributor_id = (select public.current_user_id())
    or exists (
      select 1 from public.profiles p
      where p.id = (select public.current_user_id()) and p.role in ('teacher', 'admin')
    )
  )
  with check (contributor_id = (select public.current_user_id()));

create policy "Admins can delete any resource"
  on public.resources for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_user_id()) and p.role = 'admin'
    )
  );

-- Additional tables (simplified RLS for demo - expand as needed)
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.collections enable row level security;

create policy "Users can view their own collections"
  on public.collections for select
  using (owner_id = (select public.current_user_id()));

create policy "Users can create their own collections"
  on public.collections for insert
  with check (owner_id = (select public.current_user_id()));

create policy "Users can update their own collections"
  on public.collections for update
  using (owner_id = (select public.current_user_id()))
  with check (owner_id = (select public.current_user_id()));

create policy "Users can delete their own collections"
  on public.collections for delete
  using (owner_id = (select public.current_user_id()));

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  added_at timestamptz not null default now(),
  unique(collection_id, resource_id)
);

alter table public.collection_items enable row level security;

create policy "Users can view items in their collections"
  on public.collection_items for select
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select public.current_user_id())
    )
  );

create policy "Users can add items to their collections"
  on public.collection_items for insert
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select public.current_user_id())
    )
  );

create policy "Users can remove items from their collections"
  on public.collection_items for delete
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select public.current_user_id())
    )
  );

-- Social features (questions, answers, likes, etc.)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete set null,
  title text not null,
  content text not null,
  subject text,
  form text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create policy "Users can view all questions"
  on public.questions for select
  using (true);

create policy "Users can create their own questions"
  on public.questions for insert
  with check (user_id = (select public.current_user_id()));

create policy "Users can update their own questions"
  on public.questions for update
  using (user_id = (select public.current_user_id()))
  with check (user_id = (select public.current_user_id()));

create policy "Users can delete their own questions"
  on public.questions for delete
  using (user_id = (select public.current_user_id()));

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  responder_id text not null references public.profiles(id) on delete cascade,
  content text not null,
  is_accepted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.answers enable row level security;

create policy "Users can view all answers"
  on public.answers for select
  using (true);

create policy "Users can create their own answers"
  on public.answers for insert
  with check (responder_id = (select public.current_user_id()));

create policy "Users can update their own answers"
  on public.answers for update
  using (responder_id = (select public.current_user_id()))
  with check (responder_id = (select public.current_user_id()));

create policy "Users can delete their own answers"
  on public.answers for delete
  using (responder_id = (select public.current_user_id()));

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, resource_id)
);

alter table public.likes enable row level security;

create policy "Users can view all likes"
  on public.likes for select
  using (true);

create policy "Users can create their own likes"
  on public.likes for insert
  with check (user_id = (select public.current_user_id()));

create policy "Users can delete their own likes"
  on public.likes for delete
  using (user_id = (select public.current_user_id()));

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
