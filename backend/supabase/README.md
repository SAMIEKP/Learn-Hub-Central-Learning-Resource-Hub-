# Supabase database and storage

Clerk provides identity and sessions. Supabase remains the Learn Hub database
and file storage. Clerk signs a Supabase-compatible JWT using the Supabase
legacy JWT secret. The browser passes that token through Supabase's `accessToken`
client option; it does not create or persist Supabase Auth sessions.

## New Supabase projects

Apply `schema.sql` to a new project. It creates text-based Clerk profile IDs,
RLS policies based on `auth.jwt()->>'sub'`, the Discover feed, and storage
policies. User-submitted profile inserts are assigned the `student` role, and
only trusted service-role operations may change profile roles.

In Clerk, create the JWT template named `supabase` using the Supabase legacy
JWT secret and configure its claims for Supabase RLS. The frontend uses that
template for Supabase database requests and the LearnHub Assistant. Configure
the same legacy JWT secret as `SUPABASE_JWT_SECRET` on the Python service only;
never expose or commit it. The service validates template tokens and passes
the authenticated caller token to Supabase, where RLS still applies.

## Existing Supabase Auth projects

Do not apply `schema.sql` directly over an existing Auth-backed database. First
take a database backup and test this staged migration against a copy:

1. Run `migrations/20260602_prepare_clerk_identity_map.sql`.
2. Populate `public.clerk_identity_map` with one row for every row in
   `auth.users`: the old Supabase UUID and its corresponding Clerk user ID.
   Map accounts using a verified identity match; do not assume email strings
   alone prove account ownership. Keep the map private.
3. Confirm the map is complete before proceeding:

   ```sql
   select count(*) as unmapped_users
   from auth.users u
   left join public.clerk_identity_map m on m.supabase_user_id = u.id
   where m.supabase_user_id is null;
   ```

   The result must be `0`.
4. Run `migrations/20260602_migrate_clerk_identity_ids.sql`. It preserves
   existing profile roles and rows, converts identity foreign keys to the
   mapped Clerk IDs, and removes the old `auth.users` dependency.
5. Run `schema.sql` to create the current Learn Hub additions and Clerk-based
   RLS policies. Verify representative student, teacher, and administrator
   access in staging before production cutover.

The migration fails before changing identity columns if any Supabase Auth
account is unmapped. Apply it during a maintenance window because the identity
policies are replaced as part of the migration and canonical schema update.
Do not remove `clerk_identity_map` until the migration has been checked and the
mapping has been retained in an approved secure backup. The SQL files are not
applied to any hosted database from this repository.

## Environment configuration

The frontend needs `REACT_APP_CLERK_PUBLISHABLE_KEY`,
`REACT_APP_SUPABASE_URL`, and `REACT_APP_SUPABASE_PUBLISHABLE_KEY` (the existing
`REACT_APP_SUPABASE_ANON_KEY` alias also works). Do not put a Supabase
service-role key or Clerk secret key in the frontend.

School-change and correction requests are stored for review; an administrator
with a trusted `profiles.role` of `admin` can read and update their status.
A dedicated moderation/admin UI is not included.
