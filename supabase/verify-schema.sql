-- Verification script to check if schema was applied correctly
-- Run this in Supabase SQL Editor after applying schema.sql

-- 1. Check that the current_user_id function exists
select 'Function check' as check_type,
       case
         when exists (select 1 from information_schema.routines where routine_schema = 'public' and routine_name = 'current_user_id')
         then 'PASS - current_user_id function exists'
         else 'FAIL - current_user_id function missing'
       end as result;

-- 2. Check that the old clerk function is gone
select 'Old function check' as check_type,
       case
         when exists (select 1 from information_schema.routines where routine_schema = 'public' and routine_name = 'current_clerk_user_id')
         then 'FAIL - current_clerk_user_id still exists'
         else 'PASS - current_clerk_user_id removed'
       end as result;

-- 3. Check that profiles table exists
select 'Profiles table' as check_type,
       case
         when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles')
         then 'PASS - profiles table exists'
         else 'FAIL - profiles table missing'
       end as result;

-- 4. Check that resources table exists
select 'Resources table' as check_type,
       case
         when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'resources')
         then 'PASS - resources table exists'
         else 'FAIL - resources table missing'
       end as result;

-- 5. Check RLS is enabled on profiles
select 'Profiles RLS' as check_type,
       case
         when (select relrowsecurity from pg_class where relname = 'profiles')
         then 'PASS - RLS enabled on profiles'
         else 'FAIL - RLS not enabled on profiles'
       end as result;

-- 6. Check RLS is enabled on resources
select 'Resources RLS' as check_type,
       case
         when (select relrowsecurity from pg_class where relname = 'resources')
         then 'PASS - RLS enabled on resources'
         else 'FAIL - RLS not enabled on resources'
       end as result;

-- 7. Check profiles table structure
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by ordinal_position;

-- 8. Check RLS policies on profiles
select policyname, permissive, roles, cmd
from pg_policies
where tablename = 'profiles';

-- 9. Check RLS policies on resources
select policyname, permissive, roles, cmd
from pg_policies
where tablename = 'resources';

-- 10. Count tables created
select 'Total tables' as check_type,
       count(*)::text as result
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE';
