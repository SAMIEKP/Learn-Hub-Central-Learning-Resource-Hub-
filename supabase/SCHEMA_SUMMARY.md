# Supabase Schema Summary for Learn Hub

## Overview

This document provides a summary of the Supabase database schema created for the Learn Hub platform. The schema is designed to support all features outlined in the README, including user profiles, school management, resource publishing, personal libraries, questions/answers, social features, and recommendations.

## Architecture

### Authentication
- **Clerk**: Handles user authentication (sign up, sign in, password reset)
- **Supabase**: Stores user profile data linked via `clerk_user_id`
- **Integration**: Clerk webhooks or backend API sync users to Supabase `profiles` table

### Storage
- **Supabase Storage**: All media files (images, videos, documents)
- **Buckets**: Organized by content type (schools, avatars, resources, collections, announcements)
- **Access Control**: Row Level Security (RLS) policies protect file access

## Database Tables

### Core Tables

#### 1. `profiles`
Stores user profile information linked to Clerk authentication.
- Links to Clerk via `clerk_user_id`
- Supports 4 roles: student, teacher, school, administrator
- Includes school membership, department, and form level
- Stores notification, accessibility, and download settings
- Enforces profile edit restrictions (6-month rule for students/teachers)

#### 2. `schools`
Stores school profile information.
- School type (government, private, mission, community)
- Location and district information
- Verification status
- Logo and cover image paths
- Representative contact information
- Profile edit restrictions (2-year rule)

#### 3. `departments`
Stores academic departments within schools.
- Linked to schools
- Has optional head of department

#### 4. `subjects`
Stores subject offerings.
- Name, code, and description
- Linked to departments via `department_subjects` junction table

#### 5. `resources`
Stores educational resources (books, papers, videos, etc.).
- 8 resource types: book, past_paper, notes, pamphlet, revision_guide, video, school_publication, teacher_explanation
- Publisher can be a school or teacher
- Subject, department, and form level classification
- File information (path, size, MIME type, hash)
- Video-specific fields (duration, captions, transcript)
- Approval workflow (pending → approved/rejected)
- Version tracking (parent_resource_id)
- Engagement metrics (downloads, views, likes)

#### 6. `library_items`
Stores user's personal library.
- Links profiles to resources
- Reading progress tracking
- Download status and quality
- Completion tracking

#### 7. `collections`
Stores user-created resource collections.
- Name, description, cover image
- Linked to profile

#### 8. `collection_items`
Junction table linking collections to resources.

### Social Features

#### 9. `questions`
Stores student questions about resources.
- Can be linked to a specific resource
- Context: subject, department, form level, chapter, page number
- Engagement metrics (likes, answers count)

#### 10. `answers`
Stores teacher answers to questions.
- Linked to question and profile
- Can be marked as correct by authorized users
- Engagement metrics (likes)

#### 11. `social_posts`
Stores feed posts for the Discover section.
- 5 post types: question, book, paper, video, announcement
- Can be linked to resources or questions
- Hidden post support for moderation
- Engagement metrics (likes, comments, shares)

#### 12. `social_comments`
Stores comments on social posts.
- Supports nested replies via `parent_comment_id`
- Engagement metrics (likes)

#### 13. `likes`
Stores likes for various entities.
- Target types: post, comment, answer, question, resource
- One like per user per target

#### 14. `follows`
Stores school follows.
- Users can follow schools to see their updates

### Notifications and Activity

#### 15. `notifications`
Stores user notifications.
- 11 notification types
- Read/unread status
- Links to related entities

#### 16. `saved_searches`
Stores user's saved search queries.
- Search parameters stored as JSON
- Optional notification on new matches

#### 17. `user_activity`
Tracks user activity for recommendations.
- Activity types: view, download, like, save, search, watch
- Target types: resource, subject, school, etc.
- Additional metadata in JSON

### School Features

#### 18. `school_membership_requests`
Stores school membership requests.
- Pending/approved/rejected status
- Role, form level, department information
- Review tracking

#### 19. `school_announcements`
Stores school announcements.
- Title, content, optional attachment
- Urgent flag
- Linked to school and author

### Moderation

#### 20. `reports`
Stores content reports for moderation.
- Target type and ID
- Reason and description
- Status tracking (pending, reviewed, resolved, dismissed)

## Database Views

### 1. `school_profiles_view`
Aggregates school information with member counts.
- Total members
- Teacher count
- Student count

### 2. `resources_with_publisher_view`
Joins resources with publisher, school, subject, and department information.
- Publisher name and type
- School name
- Subject name
- Department name

### 3. `questions_with_context_view`
Joins questions with author, school, subject, and resource information.
- Author name
- School name
- Subject name
- Resource title

### 4. `user_library_view`
Joins library items with resource details.
- Resource title, type, file size
- Subject name
- Form level

## Row Level Security (RLS)

All tables have RLS enabled with policies that:

1. **Allow public read** for approved resources, schools, profiles
2. **Restrict writes** to authenticated users
3. **Enforce ownership** - users can only update their own data
4. **Role-based access** - teachers can publish resources, schools can publish books
5. **School membership** - school members can view school-specific content

## Triggers

### Automatic Timestamps
- `update_updated_at_column()` - Updates `updated_at` on all relevant tables

### Counters
- `increment_post_likes_count()` - Auto-increments post likes
- `increment_post_comments_count()` - Auto-increments post comments
- `increment_question_answers_count()` - Auto-increments question answers

## Indexes

Strategic indexes on:
- Foreign keys (school_id, profile_id, resource_id, etc.)
- Frequently filtered fields (resource_type, form_level, approval_status)
- Temporal fields (created_at DESC for time-based queries)
- Status fields (is_read, is_hidden, is_downloaded)

## Storage Buckets

### Public Buckets (Read-Only)
- `schools` - School logos and cover images
- `avatars` - User profile pictures
- `collections` - Collection cover images

### Protected Buckets (Authenticated)
- `resources` - Educational files (PDFs, videos, documents)
- `announcements` - Announcement attachments

Each bucket has:
- File size limits
- Allowed MIME types
- RLS policies for access control
- Organized folder structure by UUID

## Key Features Implemented

### ✅ User Roles
- Student, teacher, school, administrator
- Role-specific fields and validation

### ✅ School Management
- School profiles with verification
- Departments and subjects
- Membership requests and approval

### ✅ Resource Publishing
- 8 resource types
- School and teacher publishers
- Approval workflow
- Version tracking
- File metadata

### ✅ Personal Library
- Save resources
- Reading progress
- Download management
- Personal collections

### ✅ Questions & Answers
- Student questions
- Teacher answers
- Correct answer marking
- Context linking (chapter, page, etc.)

### ✅ Social Features
- Feed posts
- Comments and replies
- Likes
- School follows

### ✅ Notifications
- 11 notification types
- Read/unread tracking
- Target linking

### ✅ Recommendations
- Activity tracking
- Saved searches
- Search parameters storage

### ✅ Moderation
- Content reporting
- Post hiding
- Approval workflows

### ✅ Accessibility
- Accessibility settings
- Video captions and transcripts
- Download quality options

## Clerk Integration Points

1. **User Creation**: Sync Clerk user to `profiles` table on signup
2. **User Updates**: Update profile when Clerk user info changes
3. **User Deletion**: Delete or deactivate profile when Clerk user is deleted
4. **Authentication**: Use Clerk JWT to identify user in Supabase RLS policies

## Next Steps

1. **Set up Supabase project**: Create project and apply either schema.sql (with RLS) or schema-no-rls.sql (without RLS)
2. **Configure storage**: Create buckets and apply storage policies
3. **Set up Clerk**: Configure Clerk for authentication
   - If using schema.sql: Set up Clerk JWT integration with Supabase
   - If using schema-no-rls: Simple Clerk integration with app-level authorization
4. **Implement auth flow**: Integrate Clerk in React app
5. **Create API layer**: Build Supabase client and API functions
6. **Test permissions**: Verify authorization works correctly
7. **Implement file uploads**: Build upload functions for each bucket

## Files Created

1. `supabase/schema.sql` - Complete database schema with RLS (1,041 lines)
2. `supabase/schema-no-rls.sql` - Schema without RLS for easier Clerk integration (817 lines)
3. `supabase/storage.md` - Storage bucket configuration (252 lines)
4. `supabase/README.md` - Setup guide with Clerk integration options (250 lines)
5. `supabase/example-queries.sql` - Common SQL queries (518 lines)
6. `src/types/database.ts` - TypeScript types (537 lines)

## Total Lines of Code

~3,415 lines of configuration, schema, and documentation

## Recent Fixes

- Fixed trigger bug: Moved target_type checks inside trigger functions instead of using WHEN clause (PostgreSQL doesn't allow NEW/OLD references in DELETE trigger WHEN conditions)
- Added schema-no-rls.sql version for easier Clerk integration without JWT setup
- Updated README with detailed Clerk integration options (JWT vs application-level auth)
