# Supabase Setup Guide for Learn Hub

This guide walks you through setting up Supabase for the Learn Hub platform.

## Prerequisites

- A Supabase account (free tier works for development)
- Clerk account for authentication
- Node.js and npm installed

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/log in
3. Click "New Project"
4. Choose a name (e.g., `learn-hub`)
5. Choose a database password (save this securely)
6. Select a region closest to your users
7. Wait for the project to be created (2-3 minutes)

### 2. Configure Database Schema

**IMPORTANT**: Run the schema SQL file FIRST before running any other SQL files. The example queries and storage policies depend on the tables being created.

**Choose one of the two schema options:**

#### Option A: With RLS (schema.sql) - Recommended for Production
- Has Row Level Security policies enabled
- More secure but requires Clerk JWT configuration
- Use this if you want database-level security

#### Option B: Without RLS (schema-no-rls.sql) - Simpler for Development
- No RLS policies
- Easier to set up with Clerk
- Authorization handled in application code
- Use this for quick development or if you prefer app-level security

**To apply the schema:**

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of either `schema.sql` (with RLS) or `schema-no-rls.sql` (without RLS)
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema
5. Verify all tables are created in the Table Editor

**If you get "relation already exists" errors:**

This means you already have tables in your database. You have two options:

**Option 1: Reset the database (WARNING: Deletes all data)**
1. Run `reset-database.sql` to drop all existing tables
2. Then run your chosen schema file again

**Option 2: Delete specific tables manually**
```sql
-- Drop specific tables that conflict
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
-- etc.
```
Then re-run the schema.

### 3. Create Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `schools` (public)
   - `avatars` (public)
   - `resources` (private)
   - `collections` (public)
   - `announcements` (private)

3. For each bucket, configure the file size limits and allowed MIME types as specified in `storage.md`

4. Apply the storage policies from `storage.md` in the SQL Editor

### 4. Configure Clerk Integration

Since you're using Clerk for authentication instead of Supabase Auth, you have two options for handling RLS policies:

#### Option A: Using Clerk JWT with Supabase (Recommended)

This allows you to use Supabase's built-in RLS policies with Clerk authentication.

1. In your Clerk dashboard, go to "JWT Templates"
2. Create a new JWT template for Supabase
3. Add the following claims:
   ```json
   {
     "https://supabase.com/jwt/claims": {
       "sub": "{{ user.id }}",
       "email": "{{ user.primary_email_address }}",
       "user_metadata": {
         "full_name": "{{ user.first_name }} {{ user.last_name }}"
       }
     }
   }
   ```
4. Update your Supabase client to use the Clerk JWT:
   ```javascript
   import { createClient } from '@supabase/supabase-js';
   import { Clerk } from '@clerk/clerk-js';

   const clerk = new Clerk('your-clerk-publishable-key');
   await clerk.load();

   const getToken = async () => {
     const token = await clerk.session?.getToken({ template: 'supabase' });
     return token;
   };

   const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY,
     {
       global: {
         headers: {
           Authorization: `Bearer ${await getToken()}`
         }
       }
     }
   );
   ```

5. Update the RLS policies to use the Clerk user ID from the JWT:
   ```sql
   -- Example updated policy
   CREATE POLICY "Users can view their own profile" ON profiles
     FOR SELECT USING (clerk_user_id = auth.uid());
   ```

#### Option B: Application-Level Authorization (Simpler)

Handle authorization in your application code instead of using RLS. This is simpler but less secure.

1. Remove or disable the RLS policies that depend on `auth.uid()`
2. Check user permissions in your API calls before querying Supabase
3. Use the `clerk_user_id` field to filter data:

   ```javascript
   // Example: Get user's library
   const { data, error } = await supabase
     .from('library_items')
     .select('*')
     .eq('profile_id', user.profile_id); // Get profile_id from Clerk sync
   ```

#### User Sync

Regardless of which option you choose, you need to sync Clerk users to the `profiles` table:

```javascript
// Sync Clerk user to Supabase profile
async function syncUserToSupabase(clerkUser) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      full_name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      role: 'student', // Default role, will be updated during registration
      status: 'email_verified'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 5. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

For backend environment variables (if using a backend):

```env
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
```

### 6. Initialize Supabase Client

Create `src/lib/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 7. Test the Connection

Create a simple test to verify your setup:

```javascript
import { supabase } from './lib/supabaseClient';

async function testConnection() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Supabase connection failed:', error);
  } else {
    console.log('Supabase connection successful!', data);
  }
}

testConnection();
```

## Schema Overview

### Core Tables

- **profiles**: User profiles linked to Clerk auth
- **schools**: School profiles and information
- **departments**: Academic departments within schools
- **subjects**: Subject offerings
- **resources**: Educational materials (books, papers, videos)
- **library_items**: User's personal library
- **collections**: User-created resource collections
- **questions**: Student questions about resources
- **answers**: Teacher answers to questions
- **social_posts**: Feed posts for discovery
- **social_comments**: Comments on posts
- **notifications**: User notifications
- **user_activity**: Activity tracking for recommendations

### Key Features

- **Row Level Security (RLS)**: All tables have RLS policies to ensure data isolation
- **Automatic Timestamps**: Triggers update `created_at` and `updated_at` automatically
- **Count Triggers**: Automatic increment of likes, comments, and answers counts
- **Views**: Pre-built views for common queries
- **Indexes**: Optimized indexes for frequently queried fields

## Storage Overview

### Buckets

- **schools**: School logos and cover images (public)
- **avatars**: User profile pictures (public)
- **resources**: Educational files (authenticated)
- **collections**: Collection cover images (public)
- **announcements**: Announcement attachments (authenticated)

See `storage.md` for detailed configuration.

## Next Steps

1. Implement Clerk authentication in your React app
2. Create user registration flows that sync with Supabase
3. Implement file upload functions for each bucket
4. Set up real-time subscriptions for notifications
5. Configure CORS settings for your domain

## Troubleshooting

### RLS Policy Errors

If you get permission errors, check:
1. The user is authenticated with Clerk
2. The `clerk_user_id` exists in the `profiles` table
3. The RLS policies allow the operation

### Storage Upload Errors

If file uploads fail:
1. Check the bucket exists
2. Verify the storage policies allow uploads
3. Ensure the file size is within limits
4. Check the MIME type is allowed

### Performance Issues

If queries are slow:
1. Check the indexes are created
2. Use the pre-built views for complex queries
3. Consider adding more indexes based on your query patterns
4. Use Supabase's query performance tools

## Security Best Practices

1. **Never expose Service Role Key** in client-side code
2. **Use RLS policies** for all data access
3. **Validate file uploads** on both client and server
4. **Implement rate limiting** for API calls
5. **Regularly audit permissions** and policies
6. **Use environment variables** for all secrets
7. **Enable audit logging** in Supabase dashboard

## Support

- Supabase Documentation: https://supabase.com/docs
- Clerk Documentation: https://clerk.com/docs
- Learn Hub Issues: Open an issue in the project repository
