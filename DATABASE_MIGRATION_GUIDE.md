# Database Schema Migration Guide

## Overview

This guide explains how to update your Supabase database from Clerk Auth to Supabase Auth.

## Important Notes

⚠️ **BACKUP YOUR DATABASE FIRST** - Before running any migration scripts, create a backup of your Supabase database.

## Scenario 1: New Database (No Existing Data)

If you have a fresh Supabase project with no existing data:

1. Open your Supabase project
2. Go to the **SQL Editor**
3. Create a new query
4. Copy the contents of `backend/supabase/schema.sql`
5. Paste and run the script
6. Verify all tables and policies are created

## Scenario 2: Existing Database with Clerk Schema

If you have an existing database that was using the Clerk-based schema:

### Option A: Fresh Start (Recommended for Development)

If you don't need to preserve existing data:

1. Create a new Supabase project
2. Apply `backend/supabase/schema.sql` to the new project
3. Update your environment variables to point to the new project
4. Rebuild your application with the new project

### Option B: Migrate Existing Database

If you need to preserve existing data:

1. **Create a backup** of your current database
2. In Supabase SQL Editor, run `backend/supabase/migrate-to-supabase-auth.sql`
3. This script will:
   - Remove the `current_clerk_user_id()` function
   - Create the new `current_user_id()` function
   - Update all RLS policies to use the new function
   - Remove the `clerk_identity_map` table
4. **Important**: User IDs in your tables are still Clerk IDs. You'll need to create new Supabase Auth users and update the foreign keys.

### Manual Data Migration (If Needed)

If you have existing users and need to migrate them to Supabase Auth:

```sql
-- Step 1: List existing profiles with their current IDs
select id, full_name, email from public.profiles;

-- Step 2: For each user, create a Supabase Auth account
-- This must be done through the Supabase Dashboard or Auth API
-- because you can't create auth users directly via SQL

-- Step 3: Once users are created in Supabase Auth, update profile IDs
-- to match the new Supabase Auth user IDs (UUIDs)
-- You'll need to map old Clerk IDs to new Supabase Auth UUIDs

-- Example (you'll need the actual mapping):
update public.profiles
set id = 'new-supabase-uuid-here'
where id = 'old-clerk-id-here';

-- Repeat for all foreign key references in other tables
```

## Verifying the Migration

After applying the schema or migration, verify:

```sql
-- Check that the new function exists
select * from information_schema.routines
where routine_schema = 'public' and routine_name = 'current_user_id';

-- Check that the old function is gone
select * from information_schema.routines
where routine_schema = 'public' and routine_name = 'current_clerk_user_id';
-- Should return 0 rows

-- Check RLS policies on profiles
select schemaname, tablename, policyname, permissive, roles, cmd, qual
from pg_policies
where tablename = 'profiles';

-- Check that profiles table exists and has correct structure
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by ordinal_position;
```

## Environment Variables Update

After updating the database, ensure your environment variables are correct:

### Frontend (.env)
```bash
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=your-anon-key
REACT_APP_SEARCH_API_URL=http://localhost:5001
```

### Backend Node.js (backend/.env)
```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Backend Python (backend/.env)
```bash
SEARCH_PORT=5001
CLIENT_ORIGIN=http://localhost:3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
```

## Getting Supabase Credentials

1. **SUPABASE_URL**: Project Settings > API > Project URL
2. **SUPABASE_ANON_KEY**: Project Settings > API > anon/public key
3. **SUPABASE_SERVICE_ROLE_KEY**: Project Settings > API > service_role key (NEVER expose in frontend)
4. **SUPABASE_JWT_SECRET**: Project Settings > API > JWT Secret (NEVER expose in frontend)

## Testing After Migration

1. Start your frontend: `npm start`
2. Start Node.js backend: `cd backend && npm run dev`
3. Start Python backend: `cd backend/python && python3 app.py`
4. Open http://localhost:3000
5. Try to sign up a new user
6. Verify the user is created in Supabase Auth dashboard
7. Verify a profile row is created in the `profiles` table
8. Test sign in with the new user
9. Test resource search
10. Test assistant feature (if configured)

## Troubleshooting

### Issue: "function current_clerk_user_id() does not exist"
**Cause**: Old schema still in use
**Solution**: Run the migration script `migrate-to-supabase-auth.sql`

### Issue: RLS policies blocking access
**Cause**: Policies still reference old function
**Solution**: Verify migration completed successfully, check policy definitions

### Issue: User IDs don't match
**Cause**: Old Clerk IDs in database, new Supabase Auth UUIDs
**Solution**: You need to map and update user IDs (see Manual Data Migration above)

### Issue: "relation does not exist"
**Cause**: Tables not created
**Solution**: Run `schema.sql` to create all tables

## Rollback Plan

If you need to rollback:

1. Restore from your database backup
2. Revert environment variable changes
3. Revert code changes if necessary

**Always test migrations in a staging environment first!**

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Check browser console for frontend errors
3. Check backend terminal logs for server errors
4. Verify all environment variables are set correctly
5. Ensure Supabase Auth is enabled in your project settings
