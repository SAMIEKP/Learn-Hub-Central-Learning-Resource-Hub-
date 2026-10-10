-- Learn Hub database model using Clerk identities with Supabase for data/storage.

create or replace function public.current_clerk_user_id()
returns text
language sql
stable
as $$
  select auth.jwt()->>'sub'
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
  owner_id text not null references public.profiles(id) on delete cascade,
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
  user_id text not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource_id, user_id)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  asker_id text not null references public.profiles(id) on delete cascade,
  question text not null,
  page_number integer check (page_number is null or page_number > 0),
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  responder_id text not null references public.profiles(id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references public.resources(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  reporter_id text not null references public.profiles(id) on delete cascade,
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
  user_id text not null references public.profiles(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  author_id text not null,
  author_name text not null,
  author_role text not null default 'Student',
  author_school text not null default '',
  author_avatar text not null default '',
  post_type text not null check (post_type in ('question', 'image')),
  content text not null default '',
  subject text not null default '',
  department text not null default '',
  class_form text not null default '',
  topic text not null default '',
  related_resource_id text,
  image_path text,
  image_alt text not null default '',
  image_caption text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(content) <= 2000),
  check (content <> '' or image_path is not null)
);

create table if not exists public.feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  parent_comment_id uuid,
  author_id text not null,
  author_name text not null,
  author_avatar text not null default '',
  content text not null check (length(content) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, post_id),
  foreign key (parent_comment_id, post_id) references public.feed_comments(id, post_id) on delete cascade
);

create table if not exists public.feed_reactions (
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  user_id text not null,
  reaction text not null check (reaction in ('like', 'repost')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, reaction)
);

create table if not exists public.feed_comment_reactions (
  comment_id uuid not null references public.feed_comments(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table if not exists public.feed_hidden_posts (
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.feed_follows (
  follower_id text not null,
  target_key text not null,
  target_type text not null check (target_type in ('person', 'school')),
  target_name text not null,
  target_school text not null default '',
  created_at timestamptz not null default now(),
  primary key (follower_id, target_key, target_type)
);

create table if not exists public.feed_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  reporter_id text not null,
  reason text not null check (reason in ('spam', 'harassment', 'inappropriate', 'copyright', 'other')),
  details text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create table if not exists public.school_membership_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  request_type text not null check (request_type in ('school_change', 'correction')),
  current_school text not null default '',
  requested_school text,
  details text not null check (length(details) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (request_type = 'school_change' and requested_school is not null and length(requested_school) > 0)
    or (request_type = 'correction' and requested_school is null)
  )
);

create index if not exists resources_subject_idx on public.resources(subject);
create index if not exists resources_form_idx on public.resources(form);
create index if not exists resources_type_idx on public.resources(resource_type);
create index if not exists resources_status_idx on public.resources(verification_status);
create index if not exists resources_contributor_idx on public.resources(contributor_id);
create index if not exists resource_keywords_keyword_idx on public.resource_keywords(keyword);
create index if not exists questions_resource_idx on public.questions(resource_id);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists feed_posts_created_at_idx on public.feed_posts(created_at desc);
create index if not exists feed_comments_post_id_idx on public.feed_comments(post_id, created_at);
create index if not exists feed_reactions_post_id_idx on public.feed_reactions(post_id);
create index if not exists feed_reports_status_idx on public.feed_reports(status);
create index if not exists school_membership_requests_user_idx on public.school_membership_requests(user_id, created_at desc);

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
alter table public.feed_posts enable row level security;
alter table public.feed_comments enable row level security;
alter table public.feed_reactions enable row level security;
alter table public.feed_comment_reactions enable row level security;
alter table public.feed_hidden_posts enable row level security;
alter table public.feed_follows enable row level security;
alter table public.feed_reports enable row level security;
alter table public.school_membership_requests enable row level security;

create policy "users can view their own profile"
  on public.profiles for select to authenticated
  using ((select public.current_clerk_user_id()) = id);

create policy "users can update their own profile"
  on public.profiles for update to authenticated
  using ((select public.current_clerk_user_id()) = id)
  with check ((select public.current_clerk_user_id()) = id);

create policy "users can create their own profile"
  on public.profiles for insert to authenticated
  with check (
    id = (select public.current_clerk_user_id())
    and role = 'student'
  );

create policy "authenticated users can view published resources"
  on public.resources for select to authenticated
  using (
    verification_status = 'verified'
    or contributor_id = (select public.current_clerk_user_id())
    or exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

create policy "teachers can submit resources"
  on public.resources for insert to authenticated
  with check (
    contributor_id = (select public.current_clerk_user_id())
    and exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role in ('teacher', 'admin')
    )
  );

create policy "contributors can update pending resources"
  on public.resources for update to authenticated
  using (
    contributor_id = (select public.current_clerk_user_id())
    and verification_status = 'pending'
  )
  with check (contributor_id = (select public.current_clerk_user_id()));

create policy "admins can manage resources"
  on public.resources for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

create policy "users manage their own collections"
  on public.collections for all to authenticated
  using (owner_id = (select public.current_clerk_user_id()))
  with check (owner_id = (select public.current_clerk_user_id()));

create policy "users manage items in their own collections"
  on public.collection_items for all to authenticated
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select public.current_clerk_user_id())
    )
  )
  with check (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = (select public.current_clerk_user_id())
    )
  );

create policy "authenticated users can view ratings"
  on public.ratings for select to authenticated using (true);

create policy "users manage their own ratings"
  on public.ratings for all to authenticated
  using (user_id = (select public.current_clerk_user_id()))
  with check (user_id = (select public.current_clerk_user_id()));

create policy "authenticated users can view questions"
  on public.questions for select to authenticated using (true);

create policy "users can ask questions"
  on public.questions for insert to authenticated
  with check (asker_id = (select public.current_clerk_user_id()));

create policy "askers can update their questions"
  on public.questions for update to authenticated
  using (asker_id = (select public.current_clerk_user_id()))
  with check (asker_id = (select public.current_clerk_user_id()));

create policy "authenticated users can view answers"
  on public.question_answers for select to authenticated using (true);

create policy "teachers can answer questions"
  on public.question_answers for insert to authenticated
  with check (
    responder_id = (select public.current_clerk_user_id())
    and exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role in ('teacher', 'admin')
    )
  );

create policy "users can submit reports"
  on public.reports for insert to authenticated
  with check (reporter_id = (select public.current_clerk_user_id()));

create policy "users can view their own reports"
  on public.reports for select to authenticated
  using (
    reporter_id = (select public.current_clerk_user_id())
    or exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

create policy "admins can manage reports"
  on public.reports for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

create policy "users can record their downloads"
  on public.downloads for insert to authenticated
  with check (user_id = (select public.current_clerk_user_id()));

create policy "users can view their downloads"
  on public.downloads for select to authenticated
  using (user_id = (select public.current_clerk_user_id()));

drop policy if exists "authenticated users can view feed posts" on public.feed_posts;
create policy "authenticated users can view feed posts"
  on public.feed_posts for select to authenticated using (true);

drop policy if exists "users can publish their own feed posts" on public.feed_posts;
create policy "users can publish their own feed posts"
  on public.feed_posts for insert to authenticated
  with check (author_id = (select public.current_clerk_user_id()));

drop policy if exists "authors can edit their own feed posts" on public.feed_posts;
create policy "authors can edit their own feed posts"
  on public.feed_posts for update to authenticated
  using (author_id = (select public.current_clerk_user_id()))
  with check (author_id = (select public.current_clerk_user_id()));

drop policy if exists "authors can delete their own feed posts" on public.feed_posts;
create policy "authors can delete their own feed posts"
  on public.feed_posts for delete to authenticated
  using (author_id = (select public.current_clerk_user_id()));

drop policy if exists "authenticated users can view feed comments" on public.feed_comments;
create policy "authenticated users can view feed comments"
  on public.feed_comments for select to authenticated using (true);

drop policy if exists "users can create feed comments" on public.feed_comments;
create policy "users can create feed comments"
  on public.feed_comments for insert to authenticated
  with check (author_id = (select public.current_clerk_user_id()));

drop policy if exists "authors can edit their own feed comments" on public.feed_comments;
create policy "authors can edit their own feed comments"
  on public.feed_comments for update to authenticated
  using (author_id = (select public.current_clerk_user_id()))
  with check (author_id = (select public.current_clerk_user_id()));

drop policy if exists "authors can delete their own feed comments" on public.feed_comments;
create policy "authors can delete their own feed comments"
  on public.feed_comments for delete to authenticated
  using (author_id = (select public.current_clerk_user_id()));

drop policy if exists "authenticated users can view feed reactions" on public.feed_reactions;
create policy "authenticated users can view feed reactions"
  on public.feed_reactions for select to authenticated using (true);

drop policy if exists "users can manage their own feed reactions" on public.feed_reactions;
create policy "users can manage their own feed reactions"
  on public.feed_reactions for all to authenticated
  using (user_id = (select public.current_clerk_user_id()))
  with check (user_id = (select public.current_clerk_user_id()));

drop policy if exists "authenticated users can view comment reactions" on public.feed_comment_reactions;
create policy "authenticated users can view comment reactions"
  on public.feed_comment_reactions for select to authenticated using (true);

drop policy if exists "users can manage their own comment reactions" on public.feed_comment_reactions;
create policy "users can manage their own comment reactions"
  on public.feed_comment_reactions for all to authenticated
  using (user_id = (select public.current_clerk_user_id()))
  with check (user_id = (select public.current_clerk_user_id()));

drop policy if exists "users can view their hidden posts" on public.feed_hidden_posts;
create policy "users can view their hidden posts"
  on public.feed_hidden_posts for select to authenticated
  using (user_id = (select public.current_clerk_user_id()));

drop policy if exists "users can hide posts for themselves" on public.feed_hidden_posts;
create policy "users can hide posts for themselves"
  on public.feed_hidden_posts for all to authenticated
  using (user_id = (select public.current_clerk_user_id()))
  with check (user_id = (select public.current_clerk_user_id()));

drop policy if exists "users can view their follows" on public.feed_follows;
create policy "users can view their follows"
  on public.feed_follows for select to authenticated
  using (follower_id = (select public.current_clerk_user_id()));

drop policy if exists "users can manage their follows" on public.feed_follows;
create policy "users can manage their follows"
  on public.feed_follows for all to authenticated
  using (follower_id = (select public.current_clerk_user_id()))
  with check (follower_id = (select public.current_clerk_user_id()));

drop policy if exists "users can create feed reports" on public.feed_reports;
create policy "users can create feed reports"
  on public.feed_reports for insert to authenticated
  with check (reporter_id = (select public.current_clerk_user_id()) and status = 'pending');

drop policy if exists "users can view their feed reports" on public.feed_reports;
create policy "users can view their feed reports"
  on public.feed_reports for select to authenticated
  using (reporter_id = (select public.current_clerk_user_id()));

drop policy if exists "admins can review feed reports" on public.feed_reports;
create policy "admins can review feed reports"
  on public.feed_reports for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

drop policy if exists "admins can update feed reports" on public.feed_reports;
create policy "admins can update feed reports"
  on public.feed_reports for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

drop policy if exists "users can submit their school membership requests" on public.school_membership_requests;
create policy "users can submit their school membership requests"
  on public.school_membership_requests for insert to authenticated
  with check (user_id = (select public.current_clerk_user_id()) and status = 'pending');

drop policy if exists "users can view their school membership requests" on public.school_membership_requests;
create policy "users can view their school membership requests"
  on public.school_membership_requests for select to authenticated
  using (user_id = (select public.current_clerk_user_id()));

drop policy if exists "admins can review school membership requests" on public.school_membership_requests;
create policy "admins can review school membership requests"
  on public.school_membership_requests for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

drop policy if exists "admins can update school membership requests" on public.school_membership_requests;
create policy "admins can update school membership requests"
  on public.school_membership_requests for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = (select public.current_clerk_user_id()) and p.role = 'admin'
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'learnhub-feed-images',
  'learnhub-feed-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "users can upload their own feed images" on storage.objects;
create policy "users can upload their own feed images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'learnhub-feed-images'
    and (storage.foldername(name))[1] = (select public.current_clerk_user_id())::text
  );

drop policy if exists "users can delete their own feed images" on storage.objects;
create policy "users can delete their own feed images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'learnhub-feed-images'
    and (storage.foldername(name))[1] = (select public.current_clerk_user_id())::text
  );
