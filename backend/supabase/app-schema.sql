-- Learn Hub application schema for a fresh Supabase project.
-- Apply once in the Supabase SQL Editor before using the app.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'student'
    check (role in ('student', 'teacher', 'school_admin', 'admin')),
  -- `school` remains temporarily for the current client. `school_id` is the
  -- authoritative association and is maintained from an approved membership.
  school text,
  school_id uuid,
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

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles as p
  where p.id = auth.uid()
$$;

revoke all on function public.current_profile_role() from public, anon;
grant execute on function public.current_profile_role() to authenticated, service_role;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' then
    if tg_op = 'INSERT' then
      new.role := 'student';
    elsif new.role is distinct from old.role
      and coalesce(current_setting('app.learnhub_membership_sync', true), '') <> 'on' then
      raise exception 'Profile roles can only be changed by trusted administrators';
    elsif new.school_id is distinct from old.school_id
      and coalesce(current_setting('app.learnhub_membership_sync', true), '') <> 'on' then
      raise exception 'School membership can only be changed through an approved membership';
    end if;
  end if;
  return new;
end
$$;

revoke all on function public.protect_profile_role() from public, anon, authenticated;

create trigger protect_profile_role
  before insert or update on public.profiles
  for each row execute function public.protect_profile_role();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(concat_ws(
        ' ',
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name'
      )), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'LearnHub Student'
    )
  )
  on conflict (id) do nothing;
  return new;
end
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  district text,
  school_type text check (school_type in ('public', 'private', 'mission', 'international', 'other')),
  official_email text,
  official_phone text,
  description text,
  logo_path text,
  cover_image_path text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  verified_by uuid references public.profiles (id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index schools_name_unique_idx on public.schools (lower(name));

alter table public.profiles
  add constraint profiles_school_id_fkey
  foreign key (school_id) references public.schools (id) on delete set null;

create table public.school_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  membership_role text not null check (membership_role in ('student', 'teacher', 'school_admin')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'suspended')),
  requested_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, school_id)
);

-- A person can have membership history, but only one active school at a time.
create unique index school_memberships_one_approved_school_idx
  on public.school_memberships (user_id)
  where status = 'approved';
create index school_memberships_school_status_idx
  on public.school_memberships (school_id, status, membership_role);

create or replace function public.is_school_admin(target_school_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.school_memberships as membership
    where membership.user_id = auth.uid()
      and membership.school_id = target_school_id
      and membership.membership_role = 'school_admin'
      and membership.status = 'approved'
  )
$$;

revoke all on function public.is_school_admin(uuid) from public, anon;
grant execute on function public.is_school_admin(uuid) to authenticated, service_role;

create or replace function public.sync_profile_school_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'approved'
    and (
      tg_op = 'INSERT'
      or old.status is distinct from 'approved'
      or old.membership_role is distinct from new.membership_role
      or old.school_id is distinct from new.school_id
    ) then
    perform set_config('app.learnhub_membership_sync', 'on', true);
    update public.profiles
      set school_id = new.school_id,
          role = new.membership_role
      where id = new.user_id;
  elsif tg_op = 'UPDATE'
    and old.status = 'approved' and new.status is distinct from 'approved' then
    perform set_config('app.learnhub_membership_sync', 'on', true);
    update public.profiles
      set school_id = null,
          role = 'student'
      where id = new.user_id and school_id = old.school_id;
  end if;
  return new;
end
$$;

revoke all on function public.sync_profile_school_membership() from public, anon, authenticated;

create trigger sync_profile_school_membership
  after insert or update of status, membership_role, school_id on public.school_memberships
  for each row execute function public.sync_profile_school_membership();

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid not null references public.profiles (id) on delete restrict,
  school_id uuid not null references public.schools (id) on delete restrict,
  title text not null,
  description text,
  subject text,
  department text,
  form text,
  topic text,
  examination_year integer check (examination_year is null or examination_year between 1900 and 2200),
  resource_type text not null
    check (resource_type in (
      'book', 'paper', 'past_paper', 'marking_scheme', 'notes', 'class_note',
      'pamphlet', 'revision_guide', 'school_publication', 'teacher_explanation',
      'video', 'other'
    )),
  author text,
  source text,
  file_path text,
  file_name text,
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  mime_type text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'rejected')),
  version integer not null default 1 check (version > 0),
  extracted_text text,
  keywords text[] not null default '{}',
  language text not null default 'English',
  academic_year integer check (academic_year is null or academic_year between 1900 and 2200),
  edition text,
  isbn text,
  copyright_notice text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.can_publish_resource(
  target_school_id uuid,
  target_resource_type text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select public.current_profile_role()) = 'admin'
    or (
      (select public.current_profile_role()) = 'school_admin'
      and public.is_school_admin(target_school_id)
    )
    or (
      (select public.current_profile_role()) = 'teacher'
      and target_resource_type in (
        'paper', 'past_paper', 'marking_scheme', 'notes', 'class_note',
        'revision_guide', 'teacher_explanation', 'video'
      )
      and exists (
        select 1
        from public.school_memberships as membership
        where membership.user_id = auth.uid()
          and membership.school_id = target_school_id
          and membership.membership_role = 'teacher'
          and membership.status = 'approved'
      )
    )
$$;

revoke all on function public.can_publish_resource(uuid, text) from public, anon;
grant execute on function public.can_publish_resource(uuid, text) to authenticated, service_role;

create table public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null default '',
  author_role text not null default '',
  author_school text not null default '',
  author_avatar text not null default '',
  post_type text not null check (post_type in ('question', 'image', 'video', 'book', 'paper', 'announcement')),
  content text not null default '' check (char_length(content) <= 2000),
  subject text,
  department text,
  class_form text,
  topic text,
  related_resource_id text,
  image_path text,
  image_alt text not null default '' check (char_length(image_alt) <= 300),
  image_caption text not null default '' check (char_length(image_caption) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (content <> '' or image_path is not null)
);

create or replace function public.set_feed_post_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile public.profiles%rowtype;
begin
  select p.* into profile
  from public.profiles as p
  where p.id = new.author_id;

  if not found then
    raise exception 'A profile is required before publishing';
  end if;

  new.author_name := profile.full_name;
  new.author_role := initcap(profile.role) || coalesce(' · ' || nullif(profile.form, ''), '');
  new.author_school := coalesce(profile.school, '');
  new.author_avatar := upper(
    left(profile.full_name, 1)
    || left(split_part(profile.full_name, ' ', 2), 1)
  );
  return new;
end
$$;

revoke all on function public.set_feed_post_author() from public, anon, authenticated;

create trigger set_feed_post_author
  before insert on public.feed_posts
  for each row execute function public.set_feed_post_author();

create table public.feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts (id) on delete cascade,
  parent_comment_id uuid,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null default '',
  author_avatar text not null default '',
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, post_id),
  foreign key (parent_comment_id, post_id)
    references public.feed_comments (id, post_id) on delete cascade
);

create or replace function public.set_feed_comment_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile public.profiles%rowtype;
begin
  select p.* into profile
  from public.profiles as p
  where p.id = new.author_id;

  if not found then
    raise exception 'A profile is required before commenting';
  end if;

  new.author_name := profile.full_name;
  new.author_avatar := upper(
    left(profile.full_name, 1)
    || left(split_part(profile.full_name, ' ', 2), 1)
  );
  return new;
end
$$;

revoke all on function public.set_feed_comment_author() from public, anon, authenticated;

create trigger set_feed_comment_author
  before insert on public.feed_comments
  for each row execute function public.set_feed_comment_author();

create table public.feed_reactions (
  post_id uuid not null references public.feed_posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reaction text not null check (reaction in ('like', 'repost')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, reaction)
);

create table public.feed_comment_reactions (
  comment_id uuid not null references public.feed_comments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create table public.feed_hidden_posts (
  post_id uuid not null references public.feed_posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.feed_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'inappropriate', 'copyright', 'other')),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create table public.feed_follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  target_key text not null check (target_key <> ''),
  target_type text not null check (target_type in ('school', 'person')),
  target_name text not null,
  target_school text,
  created_at timestamptz not null default now(),
  primary key (follower_id, target_type, target_key)
);

create table public.school_membership_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  request_type text not null check (request_type in ('school_change', 'correction')),
  current_school text not null default '',
  requested_school text,
  details text not null check (char_length(details) between 1 and 1000),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((request_type = 'school_change' and requested_school is not null and requested_school <> '')
      or (request_type = 'correction' and requested_school is null))
);

create index resources_verified_created_idx
  on public.resources (created_at desc)
  where verification_status = 'verified';
create index resources_contributor_idx on public.resources (contributor_id);
create index resources_school_verified_created_idx
  on public.resources (school_id, created_at desc)
  where verification_status = 'verified';
create index resources_filter_idx
  on public.resources (resource_type, subject, department, form, academic_year)
  where verification_status = 'verified';
create index feed_posts_created_idx on public.feed_posts (created_at desc);
create index feed_comments_post_created_idx on public.feed_comments (post_id, created_at);
create index feed_comments_parent_idx on public.feed_comments (parent_comment_id);
create index feed_reactions_user_idx on public.feed_reactions (user_id, post_id);
create index feed_comment_reactions_user_idx on public.feed_comment_reactions (user_id, comment_id);
create index feed_reports_created_idx on public.feed_reports (created_at desc);
create index school_membership_requests_user_idx
  on public.school_membership_requests (user_id, created_at desc);
create index school_membership_requests_pending_idx
  on public.school_membership_requests (created_at desc)
  where status = 'pending';

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_schools_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();
create trigger set_school_memberships_updated_at
  before update on public.school_memberships
  for each row execute function public.set_updated_at();
create trigger set_resources_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();
create trigger set_feed_posts_updated_at
  before update on public.feed_posts
  for each row execute function public.set_updated_at();
create trigger set_feed_comments_updated_at
  before update on public.feed_comments
  for each row execute function public.set_updated_at();
create trigger set_school_membership_requests_updated_at
  before update on public.school_membership_requests
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.schools enable row level security;
alter table public.school_memberships enable row level security;
alter table public.resources enable row level security;
alter table public.feed_posts enable row level security;
alter table public.feed_comments enable row level security;
alter table public.feed_reactions enable row level security;
alter table public.feed_comment_reactions enable row level security;
alter table public.feed_hidden_posts enable row level security;
alter table public.feed_reports enable row level security;
alter table public.feed_follows enable row level security;
alter table public.school_membership_requests enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "Users can create their own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "Authenticated users can read verified schools"
  on public.schools for select to authenticated
  using (
    verification_status = 'verified'
    or (select public.current_profile_role()) = 'admin'
  );
create policy "Admins can create schools"
  on public.schools for insert to authenticated
  with check ((select public.current_profile_role()) = 'admin');
create policy "Admins can update schools"
  on public.schools for update to authenticated
  using ((select public.current_profile_role()) = 'admin')
  with check ((select public.current_profile_role()) = 'admin');

create policy "Users can read their own school memberships"
  on public.school_memberships for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.current_profile_role()) = 'admin'
    or public.is_school_admin(school_id)
  );
create policy "Users can request student or teacher membership"
  on public.school_memberships for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and membership_role in ('student', 'teacher')
    and exists (
      select 1 from public.schools as school
      where school.id = school_memberships.school_id
        and school.verification_status = 'verified'
    )
  );
create policy "Admins can review school memberships"
  on public.school_memberships for update to authenticated
  using ((select public.current_profile_role()) = 'admin')
  with check ((select public.current_profile_role()) = 'admin');

create policy "Users can read verified resources and their own submissions"
  on public.resources for select to authenticated
  using (
    verification_status = 'verified'
    or contributor_id = (select auth.uid())
    or (select public.current_profile_role()) = 'admin'
  );
create policy "Eligible publishers can submit resources for review"
  on public.resources for insert to authenticated
  with check (
    contributor_id = (select auth.uid())
    and verification_status = 'pending'
    and (file_path is null or file_path like ((select auth.uid())::text || '/%'))
    and public.can_publish_resource(school_id, resource_type)
  );
create policy "Contributors can update pending resources"
  on public.resources for update to authenticated
  using (contributor_id = (select auth.uid()) and verification_status = 'pending')
  with check (
    contributor_id = (select auth.uid())
    and verification_status = 'pending'
    and (file_path is null or file_path like ((select auth.uid())::text || '/%'))
    and public.can_publish_resource(school_id, resource_type)
  );
create policy "Admins can review resources"
  on public.resources for update to authenticated
  using ((select public.current_profile_role()) = 'admin')
  with check ((select public.current_profile_role()) = 'admin');
create policy "Admins can delete resources"
  on public.resources for delete to authenticated
  using ((select public.current_profile_role()) = 'admin');

create policy "Authenticated users can read feed posts"
  on public.feed_posts for select to authenticated
  using (true);
create policy "Users can create their own feed posts"
  on public.feed_posts for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy "Users can update their own feed posts"
  on public.feed_posts for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
create policy "Users can delete their own feed posts"
  on public.feed_posts for delete to authenticated
  using (author_id = (select auth.uid()));

create policy "Authenticated users can read feed comments"
  on public.feed_comments for select to authenticated
  using (true);
create policy "Users can create their own feed comments"
  on public.feed_comments for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.feed_posts as p where p.id = public.feed_comments.post_id
    )
  );
create policy "Users can update their own feed comments"
  on public.feed_comments for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
create policy "Users can delete their own feed comments"
  on public.feed_comments for delete to authenticated
  using (author_id = (select auth.uid()));

create policy "Authenticated users can read feed reactions"
  on public.feed_reactions for select to authenticated
  using (true);
create policy "Users can add their own feed reactions"
  on public.feed_reactions for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users can remove their own feed reactions"
  on public.feed_reactions for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "Authenticated users can read comment reactions"
  on public.feed_comment_reactions for select to authenticated
  using (true);
create policy "Users can add their own comment reactions"
  on public.feed_comment_reactions for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users can remove their own comment reactions"
  on public.feed_comment_reactions for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can read their hidden posts"
  on public.feed_hidden_posts for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users can hide posts for themselves"
  on public.feed_hidden_posts for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users can unhide their posts"
  on public.feed_hidden_posts for delete to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can report posts"
  on public.feed_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));
create policy "Users can read their own reports"
  on public.feed_reports for select to authenticated
  using (
    reporter_id = (select auth.uid())
    or (select public.current_profile_role()) = 'admin'
  );

create policy "Users can read their own follows"
  on public.feed_follows for select to authenticated
  using (follower_id = (select auth.uid()));
create policy "Users can follow accounts"
  on public.feed_follows for insert to authenticated
  with check (follower_id = (select auth.uid()));
create policy "Users can unfollow accounts"
  on public.feed_follows for delete to authenticated
  using (follower_id = (select auth.uid()));

create policy "Users can submit school membership requests"
  on public.school_membership_requests for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');
create policy "Users and admins can read school membership requests"
  on public.school_membership_requests for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.current_profile_role()) = 'admin'
  );
create policy "Admins can review school membership requests"
  on public.school_membership_requests for update to authenticated
  using ((select public.current_profile_role()) = 'admin')
  with check ((select public.current_profile_role()) = 'admin');

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.schools to authenticated;
grant select, insert, update on public.school_memberships to authenticated;
grant select, insert, update, delete on public.resources to authenticated;
grant select, insert, update, delete on public.feed_posts to authenticated;
grant select, insert, update, delete on public.feed_comments to authenticated;
grant select, insert, delete on public.feed_reactions to authenticated;
grant select, insert, delete on public.feed_comment_reactions to authenticated;
grant select, insert, delete on public.feed_hidden_posts to authenticated;
grant select, insert on public.feed_reports to authenticated;
grant select, insert, delete on public.feed_follows to authenticated;
grant select, insert, update on public.school_membership_requests to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'learnhub-feed-images',
  'learnhub-feed-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit)
values (
  'learnhub-resources',
  'learnhub-resources',
  false,
  104857600
)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "Public feed images are readable" on storage.objects;
create policy "Public feed images are readable"
  on storage.objects for select
  using (bucket_id = 'learnhub-feed-images');
drop policy if exists "Users can upload images to their own feed folder" on storage.objects;
create policy "Users can upload images to their own feed folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'learnhub-feed-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
drop policy if exists "Users can delete images from their own feed folder" on storage.objects;
create policy "Users can delete images from their own feed folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'learnhub-feed-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Approved resource files are readable to permitted users" on storage.objects;
create policy "Approved resource files are readable to permitted users"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'learnhub-resources'
    and exists (
      select 1
      from public.resources as resource
      where resource.file_path = name
    )
  );
drop policy if exists "Eligible users can upload resource files to their own folder" on storage.objects;
create policy "Eligible users can upload resource files to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'learnhub-resources'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
drop policy if exists "Contributors can remove their pending resource files" on storage.objects;
create policy "Contributors can remove their pending resource files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'learnhub-resources'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (
      not exists (
        select 1 from public.resources as resource
        where resource.file_path = name
      )
      or exists (
        select 1
        from public.resources as resource
        where resource.file_path = name
          and resource.contributor_id = (select auth.uid())
          and resource.verification_status = 'pending'
      )
    )
  );
