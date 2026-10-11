# Supabase database and storage

Supabase provides identity, authentication, database, and storage for Learn Hub.
The application uses Supabase Auth for user authentication and Supabase's
PostgreSQL database for data storage with Row Level Security (RLS).

## New Supabase projects

Apply `schema.sql` to a new project. It creates the Learn Hub tables with
UUID-based profile IDs, RLS policies based on `auth.uid()`, and proper
role-based access control. User-submitted profile inserts are assigned the
`student` role, and only trusted service-role operations may change profile roles.

## Applying the schema

1. Take a database backup before applying any schema changes
2. In the Supabase SQL Editor, run the contents of `schema.sql`
3. Verify the tables and RLS policies are created correctly
4. Test authentication flow with a test user

## Environment configuration

The frontend needs:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_PUBLISHABLE_KEY` or `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon key

The backend services need:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)
- `SUPABASE_JWT_SECRET` - Your Supabase JWT secret (server-side only, from API settings)

**Important**: Never expose service role keys or JWT secrets in the frontend or commit them to version control.

## Tables

### Core Tables
- `profiles` - User profiles with role, school, form, department, etc.
- `resources` - Educational resources (books, past papers, notes, videos)
- `collections` - User-created resource collections
- `collection_items` - Items within collections

### Social Features
- `questions` - User questions about resources
- `answers` - Answers to questions
- `likes` - User likes on resources

### Additional Features
- Social feed, comments, follows, and reports (see schema.sql for full details)

## Row Level Security (RLS)

All tables have RLS policies that:
- Allow authenticated users to access their own data
- Allow teachers and admins broader access
- Allow anyone to view verified resources
- Prevent unauthorized modifications

## Authentication Flow

1. User signs up/signs in via Supabase Auth
2. Frontend receives Supabase JWT token
3. Frontend includes token in API requests to backend
4. Backend validates token using `SUPABASE_JWT_SECRET`
5. Backend uses token to query Supabase with user's RLS scope

School-change and correction requests are stored for review; an administrator
with a trusted `profiles.role` of `admin` can read and update their status.
A dedicated moderation/admin UI is not included.
