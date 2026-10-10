begin;

do $$
begin
  if to_regclass('public.clerk_identity_map') is null then
    raise exception 'Run 20260602_prepare_clerk_identity_map.sql and populate its mapping first';
  end if;

  if exists (
    select 1
    from auth.users u
    left join public.clerk_identity_map m on m.supabase_user_id = u.id
    where m.supabase_user_id is null
  ) then
    raise exception 'Every existing Supabase Auth user must have a Clerk ID mapping';
  end if;

  if exists (
    select 1
    from public.profiles p
    left join public.clerk_identity_map m on m.supabase_user_id = p.id
    where m.supabase_user_id is null
  ) then
    raise exception 'Every profile must have a Clerk ID mapping';
  end if;
end
$$;

drop policy if exists "users can view their own profile" on public.profiles;
drop policy if exists "users can update their own profile" on public.profiles;
drop policy if exists "authenticated users can view published resources" on public.resources;
drop policy if exists "teachers can submit resources" on public.resources;
drop policy if exists "contributors can update pending resources" on public.resources;
drop policy if exists "admins can manage resources" on public.resources;
drop policy if exists "users manage their own collections" on public.collections;
drop policy if exists "users manage items in their own collections" on public.collection_items;
drop policy if exists "authenticated users can view ratings" on public.ratings;
drop policy if exists "users manage their own ratings" on public.ratings;
drop policy if exists "authenticated users can view questions" on public.questions;
drop policy if exists "users can ask questions" on public.questions;
drop policy if exists "askers can update their questions" on public.questions;
drop policy if exists "authenticated users can view answers" on public.question_answers;
drop policy if exists "teachers can answer questions" on public.question_answers;
drop policy if exists "users can submit reports" on public.reports;
drop policy if exists "users can view their own reports" on public.reports;
drop policy if exists "admins can manage reports" on public.reports;
drop policy if exists "users can record their downloads" on public.downloads;
drop policy if exists "users can view their downloads" on public.downloads;

alter table public.resources drop constraint if exists resources_contributor_id_fkey;
alter table public.collections drop constraint if exists collections_owner_id_fkey;
alter table public.ratings drop constraint if exists ratings_user_id_fkey;
alter table public.questions drop constraint if exists questions_asker_id_fkey;
alter table public.question_answers drop constraint if exists question_answers_responder_id_fkey;
alter table public.reports drop constraint if exists reports_reporter_id_fkey;
alter table public.downloads drop constraint if exists downloads_user_id_fkey;
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles drop constraint if exists profiles_pkey;

create or replace function public.clerk_user_id_for_legacy_id(legacy_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  mapped_id text;
begin
  select clerk_user_id
    into mapped_id
    from public.clerk_identity_map
    where supabase_user_id = legacy_id;

  if mapped_id is null then
    raise exception 'No Clerk identity mapping exists for legacy user %', legacy_id;
  end if;

  return mapped_id;
end
$$;

revoke all on function public.clerk_user_id_for_legacy_id(uuid) from public, anon, authenticated;

alter table public.profiles
  alter column id type text using public.clerk_user_id_for_legacy_id(id);
alter table public.resources
  alter column contributor_id type text using public.clerk_user_id_for_legacy_id(contributor_id);
alter table public.collections
  alter column owner_id type text using public.clerk_user_id_for_legacy_id(owner_id);
alter table public.ratings
  alter column user_id type text using public.clerk_user_id_for_legacy_id(user_id);
alter table public.questions
  alter column asker_id type text using public.clerk_user_id_for_legacy_id(asker_id);
alter table public.question_answers
  alter column responder_id type text using public.clerk_user_id_for_legacy_id(responder_id);
alter table public.reports
  alter column reporter_id type text using public.clerk_user_id_for_legacy_id(reporter_id);
alter table public.downloads
  alter column user_id type text using public.clerk_user_id_for_legacy_id(user_id);

alter table public.profiles
  add constraint profiles_pkey primary key (id);
alter table public.resources
  add constraint resources_contributor_id_fkey
  foreign key (contributor_id) references public.profiles(id) on delete restrict;
alter table public.collections
  add constraint collections_owner_id_fkey
  foreign key (owner_id) references public.profiles(id) on delete cascade;
alter table public.ratings
  add constraint ratings_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;
alter table public.questions
  add constraint questions_asker_id_fkey
  foreign key (asker_id) references public.profiles(id) on delete cascade;
alter table public.question_answers
  add constraint question_answers_responder_id_fkey
  foreign key (responder_id) references public.profiles(id) on delete cascade;
alter table public.reports
  add constraint reports_reporter_id_fkey
  foreign key (reporter_id) references public.profiles(id) on delete cascade;
alter table public.downloads
  add constraint downloads_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.profiles
  add column if not exists registration_number text;

drop function public.clerk_user_id_for_legacy_id(uuid);

commit;
