-- Learn Hub Supabase Schema
-- This schema supports the digital educational library platform for secondary schools in Malawi
-- Authentication: Clerk
-- Storage: Supabase Storage buckets
-- Database: PostgreSQL via Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'school', 'administrator');

-- Resource types
CREATE TYPE resource_type AS ENUM (
  'book',
  'past_paper',
  'notes',
  'pamphlet',
  'revision_guide',
  'video',
  'school_publication',
  'teacher_explanation'
);

-- Account status
CREATE TYPE account_status AS ENUM (
  'pending_verification',
  'email_verified',
  'phone_verified',
  'school_verified',
  'pending_approval',
  'active',
  'suspended',
  'inactive'
);

-- School types
CREATE TYPE school_type AS ENUM (
  'government',
  'private',
  'mission',
  'community'
);

-- Form/Class levels
CREATE TYPE form_level AS ENUM (
  'form_1',
  'form_2',
  'form_3',
  'form_4'
);

-- Post types for social feed
CREATE TYPE post_type AS ENUM ('question', 'book', 'paper', 'video', 'announcement');

-- Notification types
CREATE TYPE notification_type AS ENUM (
  'school_upload',
  'new_resource',
  'answer_received',
  'answer_marked_correct',
  'saved_search_match',
  'school_update',
  'like',
  'comment',
  'follow',
  'membership_approved',
  'membership_rejected'
);

-- Download quality options
CREATE TYPE download_quality AS ENUM ('standard', 'low_data');

-- ============================================
-- TABLES
-- ============================================

-- Schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_org_id TEXT UNIQUE, -- Link to Clerk organization

  -- Basic info
  name TEXT NOT NULL,
  school_type school_type NOT NULL,
  description TEXT,

  -- Location
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  region TEXT,

  -- Contact
  official_email TEXT NOT NULL UNIQUE,
  official_phone TEXT NOT NULL,
  website TEXT,

  -- Registration
  registration_number TEXT UNIQUE,

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Media (stored in Supabase Storage)
  logo_path TEXT, -- storage path: schools/{id}/logo
  cover_image_path TEXT, -- storage path: schools/{id}/cover

  -- Representative
  representative_name TEXT,
  representative_email TEXT,
  representative_phone TEXT,

  -- Profile edit restrictions
  profile_last_edited_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  head_of_department_id UUID, -- Reference to profiles

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(school_id, name)
);

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department-subject relationships
CREATE TABLE department_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(department_id, subject_id)
);

-- User profiles table (linked to Clerk auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- Link to Clerk user

  -- Role and status
  role user_role NOT NULL,
  status account_status DEFAULT 'pending_verification',

  -- Basic info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- School membership
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,

  -- Student-specific
  form_level form_level,
  registration_number TEXT,

  -- Teacher-specific
  staff_number TEXT,
  subjects_taught TEXT[], -- Array of subject IDs

  -- Media (stored in Supabase Storage)
  avatar_path TEXT, -- storage path: avatars/{id}

  -- Profile edit restrictions
  profile_last_edited_at TIMESTAMP WITH TIME ZONE,

  -- Settings
  notification_settings JSONB DEFAULT '{
    "school_uploads": true,
    "new_resources": true,
    "answers": true,
    "followed_schools": true,
    "saved_searches": true
  }'::jsonb,

  -- Accessibility settings
  accessibility_settings JSONB DEFAULT '{
    "text_size": "medium",
    "high_contrast": false,
    "dark_mode": false,
    "reduced_motion": false,
    "dyslexia_font": false
  }'::jsonb,

  -- Download settings
  download_settings JSONB DEFAULT '{
    "wifi_only": false,
    "default_quality": "standard"
  }'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_student_role CHECK (
    (role = 'student' AND form_level IS NOT NULL) OR role != 'student'
  ),
  CONSTRAINT valid_teacher_role CHECK (
    (role = 'teacher' AND staff_number IS NOT NULL) OR role != 'teacher'
  )
);

-- School membership requests
CREATE TABLE school_membership_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,

  -- Request details
  role user_role NOT NULL,
  form_level form_level,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  subjects_taught TEXT[],

  -- Additional info
  message TEXT,

  -- Status
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  resource_type resource_type NOT NULL,

  -- Authorship
  author TEXT,
  publisher_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  publisher_school_id UUID REFERENCES schools(id) ON DELETE SET NULL,

  -- Academic info
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  form_level form_level,
  academic_year INTEGER,
  language TEXT DEFAULT 'English',
  edition TEXT,
  isbn TEXT,

  -- File info (stored in Supabase Storage)
  file_path TEXT NOT NULL, -- storage path: resources/{id}/file
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- in bytes
  file_mime_type TEXT NOT NULL,
  file_hash TEXT, -- For integrity checking

  -- Thumbnail
  thumbnail_path TEXT, -- storage path: resources/{id}/thumbnail

  -- Video-specific
  video_duration INTEGER, -- in seconds
  video_captions_path TEXT, -- storage path: resources/{id}/captions
  video_transcript_path TEXT, -- storage path: resources/{id}/transcript

  -- Approval
  approval_status TEXT DEFAULT 'pending', -- pending, approved, rejected
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,

  -- Copyright
  copyright_statement TEXT,

  -- Versioning
  version INTEGER DEFAULT 1,
  parent_resource_id UUID REFERENCES resources(id) ON DELETE SET NULL, -- For version history

  -- Metadata
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT has_publisher CHECK (
    publisher_profile_id IS NOT NULL OR publisher_school_id IS NOT NULL
  )
);

-- Personal library (saved resources)
CREATE TABLE library_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,

  -- Save details
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Reading progress
  progress INTEGER DEFAULT 0, -- 0-100 percentage
  last_page INTEGER,
  last_chapter TEXT,
  last_accessed_at TIMESTAMP WITH TIME ZONE,

  -- Completion
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Download
  is_downloaded BOOLEAN DEFAULT FALSE,
  downloaded_at TIMESTAMP WITH TIME ZONE,
  download_quality download_quality DEFAULT 'standard',
  local_file_path TEXT, -- For offline tracking

  UNIQUE(profile_id, resource_id)
);

-- Personal collections
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  cover_image_path TEXT, -- storage path: collections/{id}/cover

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection items
CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,

  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(collection_id, resource_id)
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,

  -- Question content
  title TEXT,
  content TEXT NOT NULL,

  -- Context
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  form_level form_level,
  chapter TEXT,
  page_number INTEGER,
  selected_text TEXT,

  -- Engagement
  likes_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  content TEXT NOT NULL,

  -- Marked as correct
  is_correct BOOLEAN DEFAULT FALSE,
  marked_correct_by UUID REFERENCES profiles(id),
  marked_correct_at TIMESTAMP WITH TIME ZONE,

  -- Engagement
  likes_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social posts (for Discover feed)
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type post_type NOT NULL,

  -- Content
  title TEXT,
  content TEXT,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,

  -- Visibility
  is_hidden BOOLEAN DEFAULT FALSE,
  hidden_by UUID REFERENCES profiles(id),
  hidden_at TIMESTAMP WITH TIME ZONE,
  hidden_reason TEXT,

  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social comments
CREATE TABLE social_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES social_comments(id) ON DELETE CASCADE, -- For replies

  content TEXT NOT NULL,

  -- Engagement
  likes_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table (for posts, comments, answers, resources)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Target
  target_type TEXT NOT NULL, -- 'post', 'comment', 'answer', 'question', 'resource'
  target_id UUID NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(profile_id, target_type, target_id)
);

-- Follows table (school following)
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(profile_id, school_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,

  -- Link to related entity
  target_type TEXT, -- 'resource', 'question', 'answer', 'school', 'post'
  target_id UUID,

  -- Read status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  search_params JSONB NOT NULL, -- Store filters: subject, department, form, resource_type, etc.

  -- Notification on new matches
  notify_on_match BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity tracking (for recommendations)
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  activity_type TEXT NOT NULL, -- 'view', 'download', 'like', 'save', 'search', 'watch'
  target_type TEXT NOT NULL, -- 'resource', 'subject', 'school', etc.
  target_id UUID,

  -- Additional context
  metadata JSONB, -- Duration, page number, etc.

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School announcements
CREATE TABLE school_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Media
  attachment_path TEXT, -- storage path: announcements/{id}/attachment

  -- Priority
  is_urgent BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports (for content moderation)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Target
  target_type TEXT NOT NULL, -- 'post', 'comment', 'resource', 'question', 'answer'
  target_id UUID NOT NULL,

  -- Report details
  reason TEXT NOT NULL,
  description TEXT,

  -- Status
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Schools
CREATE INDEX idx_schools_name ON schools(name);
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_is_verified ON schools(is_verified);

-- Profiles
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Resources
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_subject_id ON resources(subject_id);
CREATE INDEX idx_resources_department_id ON resources(department_id);
CREATE INDEX idx_resources_form_level ON resources(form_level);
CREATE INDEX idx_resources_publisher_school ON resources(publisher_school_id);
CREATE INDEX idx_resources_publisher_profile ON resources(publisher_profile_id);
CREATE INDEX idx_resources_approval_status ON resources(approval_status);
CREATE INDEX idx_resources_academic_year ON resources(academic_year);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);

-- Library items
CREATE INDEX idx_library_profile_id ON library_items(profile_id);
CREATE INDEX idx_library_resource_id ON library_items(resource_id);
CREATE INDEX idx_library_is_downloaded ON library_items(is_downloaded);

-- Questions
CREATE INDEX idx_questions_profile_id ON questions(profile_id);
CREATE INDEX idx_questions_resource_id ON questions(resource_id);
CREATE INDEX idx_questions_subject_id ON questions(subject_id);
CREATE INDEX idx_questions_form_level ON questions(form_level);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);

-- Answers
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_profile_id ON answers(profile_id);
CREATE INDEX idx_answers_is_correct ON answers(is_correct);

-- Social posts
CREATE INDEX idx_social_posts_profile_id ON social_posts(profile_id);
CREATE INDEX idx_social_posts_post_type ON social_posts(post_type);
CREATE INDEX idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX idx_social_posts_is_hidden ON social_posts(is_hidden);

-- Social comments
CREATE INDEX idx_social_comments_post_id ON social_comments(post_id);
CREATE INDEX idx_social_comments_parent_comment_id ON social_comments(parent_comment_id);

-- Notifications
CREATE INDEX idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- User activity
CREATE INDEX idx_user_activity_profile_id ON user_activity(profile_id);
CREATE INDEX idx_user_activity_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at DESC);

-- Follows
CREATE INDEX idx_follows_profile_id ON follows(profile_id);
CREATE INDEX idx_follows_school_id ON follows(school_id);

-- Saved searches
CREATE INDEX idx_saved_searches_profile_id ON saved_searches(profile_id);

-- Reports
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
--
-- NOTE: Since this project uses Clerk for authentication (not Supabase Auth),
-- you have two options for RLS:
--
-- Option 1: Use Clerk JWT with Supabase (Recommended for production)
-- - Configure Clerk to issue JWTs compatible with Supabase
-- - The RLS policies below use auth.uid() which will be the Clerk user ID
-- - Follow the setup guide in README.md for JWT configuration
--
-- Option 2: Disable RLS and use application-level authorization (Simpler)
-- - Comment out the RLS policies below
-- - Handle authorization in your application code
-- - Filter queries by clerk_user_id instead of using auth.uid()
--
-- To disable RLS, run:
-- ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
-- for each table
-- ============================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Schools policies
CREATE POLICY "Schools are viewable by everyone" ON schools
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert schools" ON schools
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Schools can only be updated by verified school admins" ON schools
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'school'
      AND profiles.school_id = schools.id
    )
  );

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can only update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Resources policies
CREATE POLICY "Approved resources are viewable by everyone" ON resources
  FOR SELECT USING (approval_status = 'approved');

CREATE POLICY "Users can view their own pending resources" ON resources
  FOR SELECT USING (
    publisher_profile_id = auth.uid()
    OR publisher_school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Teachers can insert resources" ON resources
  FOR INSERT WITH CHECK (
    publisher_profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Schools can insert resources" ON resources
  FOR INSERT WITH CHECK (
    publisher_school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school'
    )
  );

CREATE POLICY "Resource publishers can update their resources" ON resources
  FOR UPDATE USING (
    publisher_profile_id = auth.uid()
    OR publisher_school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Library items policies
CREATE POLICY "Users can view their own library" ON library_items
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own library items" ON library_items
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own library items" ON library_items
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own library items" ON library_items
  FOR DELETE USING (profile_id = auth.uid());

-- Collections policies
CREATE POLICY "Users can view their own collections" ON collections
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own collections" ON collections
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own collections" ON collections
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own collections" ON collections
  FOR DELETE USING (profile_id = auth.uid());

-- Questions policies
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Students can ask questions" ON questions
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Users can update their own questions" ON questions
  FOR UPDATE USING (profile_id = auth.uid());

-- Answers policies
CREATE POLICY "Answers are viewable by everyone" ON answers
  FOR SELECT USING (true);

CREATE POLICY "Teachers can answer questions" ON answers
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Users can update their own answers" ON answers
  FOR UPDATE USING (profile_id = auth.uid());

-- Social posts policies
CREATE POLICY "Non-hidden posts are viewable by everyone" ON social_posts
  FOR SELECT USING (is_hidden = false);

CREATE POLICY "Users can view their own hidden posts" ON social_posts
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can insert posts" ON social_posts
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON social_posts
  FOR UPDATE USING (profile_id = auth.uid());

-- Social comments policies
CREATE POLICY "Comments are viewable by everyone" ON social_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON social_comments
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON social_comments
  FOR UPDATE USING (profile_id = auth.uid());

-- Likes policies
CREATE POLICY "Users can view likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (profile_id = auth.uid());

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own follows" ON follows
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete their own follows" ON follows
  FOR DELETE USING (profile_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (profile_id = auth.uid());

-- Saved searches policies
CREATE POLICY "Users can view their own saved searches" ON saved_searches
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own saved searches" ON saved_searches
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own saved searches" ON saved_searches
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own saved searches" ON saved_searches
  FOR DELETE USING (profile_id = auth.uid());

-- User activity policies
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own activity" ON user_activity
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Reports policies
CREATE POLICY "Users can insert reports" ON reports
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (profile_id = auth.uid());

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_comments_updated_at BEFORE UPDATE ON social_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_announcements_updated_at BEFORE UPDATE ON school_announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Increment likes_count on posts
CREATE OR REPLACE FUNCTION increment_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'post' THEN
    UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'post' THEN
    UPDATE social_posts SET likes_count = likes_count - 1 WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_post_likes
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_likes_count();

-- Increment comments_count on posts
CREATE OR REPLACE FUNCTION increment_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_post_comments
  AFTER INSERT OR DELETE ON social_comments
  FOR EACH ROW EXECUTE FUNCTION increment_post_comments_count();

-- Increment answers_count on questions
CREATE OR REPLACE FUNCTION increment_question_answers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE questions SET answers_count = answers_count + 1 WHERE id = NEW.question_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE questions SET answers_count = answers_count - 1 WHERE id = OLD.question_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_question_answers
  AFTER INSERT OR DELETE ON answers
  FOR EACH ROW EXECUTE FUNCTION increment_question_answers_count();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for school profiles with member counts
CREATE VIEW school_profiles_view AS
SELECT
  s.*,
  COUNT(DISTINCT p.id) AS member_count,
  COUNT(DISTINCT CASE WHEN p.role = 'teacher' THEN p.id END) AS teacher_count,
  COUNT(DISTINCT CASE WHEN p.role = 'student' THEN p.id END) AS student_count
FROM schools s
LEFT JOIN profiles p ON s.id = p.school_id AND p.status = 'active'
GROUP BY s.id;

-- View for resources with publisher info
CREATE VIEW resources_with_publisher_view AS
SELECT
  r.*,
  COALESCE(p.full_name, s.name) AS publisher_name,
  COALESCE(p.role, 'school') AS publisher_type,
  s.name AS school_name,
  sub.name AS subject_name,
  d.name AS department_name
FROM resources r
LEFT JOIN profiles p ON r.publisher_profile_id = p.id
LEFT JOIN schools s ON r.publisher_school_id = s.id
LEFT JOIN subjects sub ON r.subject_id = sub.id
LEFT JOIN departments d ON r.department_id = d.id;

-- View for questions with context
CREATE VIEW questions_with_context_view AS
SELECT
  q.*,
  p.full_name AS author_name,
  p.school_id,
  s.name AS school_name,
  sub.name AS subject_name,
  res.title AS resource_title
FROM questions q
JOIN profiles p ON q.profile_id = p.id
LEFT JOIN schools s ON p.school_id = s.id
LEFT JOIN subjects sub ON q.subject_id = sub.id
LEFT JOIN resources res ON q.resource_id = res.id;

-- View for user library with resource details
CREATE VIEW user_library_view AS
SELECT
  li.*,
  r.title,
  r.resource_type,
  r.file_size,
  r.thumbnail_path,
  sub.name AS subject_name,
  r.form_level
FROM library_items li
JOIN resources r ON li.resource_id = r.id
LEFT JOIN subjects sub ON r.subject_id = sub.id;
