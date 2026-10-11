# Supabase Storage Configuration

This document describes the storage buckets and folder structure for Learn Hub.

## Storage Buckets

### 1. `schools` Bucket
Stores school-related media files.

**Folder Structure:**
```
schools/
  └── {school_id}/
      ├── logo/
      │   └── {file_name}
      └── cover/
          └── {file_name}
```

**Allowed MIME Types:**
- `image/jpeg`
- `image/png`
- `image/webp`

**File Size Limit:** 5MB per file

**Public Access:** Read-only public access for logos and cover images

### 2. `avatars` Bucket
Stores user profile avatars.

**Folder Structure:**
```
avatars/
  └── {profile_id}/
      └── {file_name}
```

**Allowed MIME Types:**
- `image/jpeg`
- `image/png`
- `image/webp`

**File Size Limit:** 2MB per file

**Public Access:** Read-only public access

### 3. `resources` Bucket
Stores educational resource files (PDFs, videos, documents).

**Folder Structure:**
```
resources/
  └── {resource_id}/
      ├── file/
      │   └── {file_name}
      ├── thumbnail/
      │   └── {file_name}
      ├── captions/
      │   └── {file_name}.vtt
      └── transcript/
          └── {file_name}.txt
```

**Allowed MIME Types:**
- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/vnd.ms-powerpoint`
- `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- `video/mp4`
- `video/webm`
- `image/jpeg`
- `image/png`
- `text/plain`

**File Size Limit:** 500MB per file (videos), 50MB per file (documents)

**Public Access:** Authenticated users only (controlled via RLS policies)

### 4. `collections` Bucket
Stores collection cover images.

**Folder Structure:**
```
collections/
  └── {collection_id}/
      └── cover/
          └── {file_name}
```

**Allowed MIME Types:**
- `image/jpeg`
- `image/png`
- `image/webp`

**File Size Limit:** 5MB per file

**Public Access:** Read-only public access

### 5. `announcements` Bucket
Stores announcement attachments.

**Folder Structure:**
```
announcements/
  └── {announcement_id}/
      └── attachment/
          └── {file_name}
```

**Allowed MIME Types:**
- `application/pdf`
- `image/jpeg`
- `image/png`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**File Size Limit:** 25MB per file

**Public Access:** Authenticated users only

## Storage Policies (RLS)

### Public Buckets (Read-Only)
- `schools` - Public read access
- `avatars` - Public read access
- `collections` - Public read access

### Protected Buckets (Authenticated)
- `resources` - Authenticated users can download approved resources
- `announcements` - School members can view announcements

### Example Storage Policies SQL

```sql
-- Enable RLS on storage
ALTER STORAGE "schools" ENABLE ROW LEVEL SECURITY;
ALTER STORAGE "avatars" ENABLE ROW LEVEL SECURITY;
ALTER STORAGE "resources" ENABLE ROW LEVEL SECURITY;
ALTER STORAGE "collections" ENABLE ROW LEVEL SECURITY;
ALTER STORAGE "announcements" ENABLE ROW LEVEL SECURITY;

-- Public read for schools bucket
CREATE POLICY "Public read access for schools" ON storage.objects
  FOR SELECT USING (bucket_id = 'schools');

-- Public read for avatars bucket
CREATE POLICY "Public read access for avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Public read for collections bucket
CREATE POLICY "Public read access for collections" ON storage.objects
  FOR SELECT USING (bucket_id = 'collections');

-- Authenticated read for resources (approved resources only)
CREATE POLICY "Authenticated read for resources" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resources'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM resources
      WHERE id = (storage.foldername(storage.objects.name))::uuid
      AND approval_status = 'approved'
    )
  );

-- Users can upload to their own avatar folder
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND storage.foldername(storage.objects.name) = auth.uid()::text
  );

-- Schools can upload to their own folder
CREATE POLICY "Schools can upload school media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'schools'
    AND auth.uid() IS NOT NULL
    AND storage.foldername(storage.objects.name) IN (
      SELECT school_id::text FROM profiles
      WHERE id = auth.uid() AND role = 'school'
    )
  );

-- Resource publishers can upload to their resource folder
CREATE POLICY "Publishers can upload resources" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resources'
    AND auth.uid() IS NOT NULL
    AND (
      -- Teacher uploading their own resource
      EXISTS (
        SELECT 1 FROM resources
        WHERE id = (storage.foldername(storage.objects.name))::uuid
        AND publisher_profile_id = auth.uid()
      )
      OR
      -- School uploading their own resource
      EXISTS (
        SELECT 1 FROM resources
        WHERE id = (storage.foldername(storage.objects.name))::uuid
        AND publisher_school_id IN (
          SELECT school_id FROM profiles WHERE id = auth.uid() AND role = 'school'
        )
      )
    )
  );
```

## Image Compression Recommendations

For optimal performance, consider implementing image compression:

- **Avatars:** Compress to max 200x200px, quality 80%
- **School Logos:** Compress to max 400x400px, quality 85%
- **School Covers:** Compress to max 1920x600px, quality 85%
- **Resource Thumbnails:** Compress to max 800x600px, quality 80%
- **Collection Covers:** Compress to max 1200x400px, quality 85%

## Video Upload Recommendations

- Use MP4 format with H.264 codec
- Target 720p or 1080p resolution
- Keep bitrate under 5 Mbps for streaming
- Generate captions in WebVTT format
- Extract transcripts for accessibility

## File Naming Convention

Use UUID-based naming to avoid conflicts:
```
{resource_id}/{type}/{uuid}.{extension}
```

Example:
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890/file/f8e9d0c1-b2a3-4567-8901-23456789abcd.pdf
```

## CDN Integration

Consider integrating with a CDN for:
- Faster content delivery
- Better performance for international users
- Reduced bandwidth costs on Supabase

Recommended CDN providers:
- Cloudflare
- Fastly
- CloudFront (AWS)
