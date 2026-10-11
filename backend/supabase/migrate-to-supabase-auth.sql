-- Migration script: Update from Clerk Auth to Supabase Auth
-- This script updates an existing database that was using Clerk
-- to use native Supabase Auth instead.
--
-- IMPORTANT: Take a database backup before running this script!

-- Step 1: Drop the old Clerk-specific function
drop function if exists public.current_clerk_user_id();

-- Step 2: Create the new Supabase Auth function
create or replace function public.current_user_id()
returns text
language sql
stable
as $$
  select auth.uid()::text
$$;

-- Step 3: Update all RLS policies to use the new function
-- Note: This recreates all policies with the new function name

-- Profiles policies
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Teachers and admins can view all profiles" on public.profiles;

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

-- Resources policies
drop policy if exists "Anyone can view verified resources" on public.resources;
drop policy if exists "Contributors can view their own resources" on public.resources;
drop policy if exists "Teachers and admins can view all resources" on public.resources;
drop policy if exists "Teachers and admins can update any resource" on public.resources;
drop policy if exists "Admins can delete any resource" on public.resources;

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

-- Collections policies (if they exist)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'collections') then
    drop policy if exists "Users can view their own collections" on public.collections;
    drop policy if exists "Users can create their own collections" on public.collections;
    drop policy if exists "Users can update their own collections" on public.collections;
    drop policy if exists "Users can delete their own collections" on public.collections;

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
  end if;
end $$;

-- Collection items policies (if they exist)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'collection_items') then
    drop policy if exists "Users can view items in their collections" on public.collection_items;
    drop policy if exists "Users can add items to their collections" on public.collection_items;
    drop policy if exists "Users can remove items from their collections" on public.collection_items;

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
  end if;
end $$;

-- Questions policies (if they exist)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'questions') then
    drop policy if exists "Users can view all questions" on public.questions;
    drop policy if exists "Users can create their own questions" on public.questions;
    drop policy if exists "Users can update their own questions" on public.questions;
    drop policy if exists "Users can delete their own questions" on public.questions;

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
  end if;
end $$;

-- Answers policies (if they exist)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'answers') then
    drop policy if exists "Users can view all answers" on public.answers;
    drop policy if exists "Users can create their own answers" on public.answers;
    drop policy if exists "Users can update their own answers" on public.answers;
    drop policy if exists "Users can delete their own answers" on public.answers;

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
  end if;
end $$;

-- Likes policies (if they exist)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'likes') then
    drop policy if exists "Users can view all likes" on public.likes;
    drop policy if exists "Users can create their own likes" on public.likes;
    drop policy if exists "Users can delete their own likes" on public.likes;

    create policy "Users can view all likes"
      on public.likes for select
      using (true);

    create policy "Users can create their own likes"
      on public.likes for insert
      with check (user_id = (select public.current_user_id()));

    create policy "Users can delete their own likes"
      on public.likes for delete
      using (user_id = (select public.current_user_id()));
  end if;
end $$;

-- Step 4: Drop the clerk_identity_map table if it exists
drop table if exists public.clerk_identity_map cascade;

-- Step 5: Verify the migration
-- Check that the old function is gone
do $$
begin
  if exists (select 1 from information_schema.routines where routine_schema = 'public' and routine_name = 'current_clerk_user_id') then
    raise exception 'Migration failed: current_clerk_user_id function still exists';
  end if;
  raise notice 'Migration successful: Clerk auth functions removed, Supabase Auth functions in place';
end $$;
