-- Learn Hub Phase 2 database model
-- Review this file before applying it to a Supabase project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  school text,
  form text,
  department text,
  subjects text[] not null default '{}',
  avatar_path text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  description text,
  subject text not null,
  department text,
  form text,
  topic text,
  examination_year integer check (examination_year is null or examination_year between 1900 and 2200),
  resource_type text not null check (resource_type in ('book', 'class_note', 'past_paper', 'marking_scheme', 'revision_guide', 'pamphlet', 'video')),
  author text,
  source text,
  file_path text not null,
  file_name text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  mime_type text not null,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected', 'archived')),
  version integer not null default 1 check (version > 0),
  extracted_text text,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resource_keywords (
  resource_id uuid not null references public.resources(id) on delete cascade,
  keyword text not null,
  score numeric(12, 8) not null check (score >= 0),
  primary key (resource_id, keyword)
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, resource_id)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource_id, user_id)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  asker_id uuid not null references public.profiles(id) on delete cascade,
  question text not null,
  page_number integer check (page_number is null or page_number > 0),
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  responder_id uuid not null references public.profiles(id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resources(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('incorrect', 'incomplete', 'duplicate', 'outdated', 'offensive', 'unavailable', 'other')),
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((resource_id is not null) or (question_id is not null))
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create index if not exists resources_subject_idx on public.resources(subject);
create index if not exists resources_form_idx on public.resources(form);
create index if not exists resources_type_idx on public.resources(resource_type);
create index if not exists resources_status_idx on public.resources(verification_status);
create index if not exists resources_contributor_idx on public.resources(contributor_id);
create index if not exists resource_keywords_keyword_idx on public.resource_keywords(keyword);
create index if not exists questions_resource_idx on public.questions(resource_id);
create index if not exists reports_status_idx on public.reports(status);

alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.resource_keywords enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.ratings enable row level security;
alter table public.questions enable row level security;
alter table public.question_answers enable row level security;
alter table public.reports enable row level security;
alter table public.downloads enable row level security;

create policy "users can view their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "authenticated users can view published resources"
  on public.resources for select to authenticated
  using (
    verification_status = 'verified'
    or contributor_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "teachers can submit resources"
  on public.resources for insert to authenticated
  with check (
    contributor_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role in ('teacher', 'admin')
    )
  );

create policy "contributors can update pending resources"
  on public.resources for update to authenticated
  using (
    contributor_id = (select auth.uid())
    and verification_status = 'pending'
  )
  with check (contributor_id = (select auth.uid()));

create policy "admins can manage resources"
  on public.resources for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "users manage their own collections"
  on public.collections for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "users manage items in their own collections"
  on public.collection_items for all to authenticated
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select auth.uid())
    )
  );

create policy "authenticated users can view ratings"
  on public.ratings for select to authenticated using (true);

create policy "users manage their own ratings"
  on public.ratings for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "authenticated users can view questions"
  on public.questions for select to authenticated using (true);

create policy "users can ask questions"
  on public.questions for insert to authenticated
  with check (asker_id = (select auth.uid()));

create policy "askers can update their questions"
  on public.questions for update to authenticated
  using (asker_id = (select auth.uid()))
  with check (asker_id = (select auth.uid()));

create policy "authenticated users can view answers"
  on public.question_answers for select to authenticated using (true);

create policy "teachers can answer questions"
  on public.question_answers for insert to authenticated
  with check (
    responder_id = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role in ('teacher', 'admin')
    )
  );

create policy "users can submit reports"
  on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));

create policy "users can view their own reports"
  on public.reports for select to authenticated
  using (
    reporter_id = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "admins can manage reports"
  on public.reports for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

create policy "users can record their downloads"
  on public.downloads for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "users can view their downloads"
  on public.downloads for select to authenticated
  using (user_id = (select auth.uid()));
