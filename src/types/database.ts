// TypeScript types for Supabase database schema
// These types match the schema.sql file

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          clerk_org_id: string | null
          name: string
          school_type: 'government' | 'private' | 'mission' | 'community'
          description: string | null
          location: string
          district: string
          region: string | null
          official_email: string
          official_phone: string
          website: string | null
          registration_number: string | null
          is_verified: boolean
          verified_at: string | null
          logo_path: string | null
          cover_image_path: string | null
          representative_name: string | null
          representative_email: string | null
          representative_phone: string | null
          profile_last_edited_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      departments: {
        Row: {
          id: string
          school_id: string
          name: string
          description: string | null
          head_of_department_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['departments']['Insert']>
      }
      subjects: {
        Row: {
          id: string
          name: string
          code: string | null
          description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subjects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['subjects']['Insert']>
      }
      department_subjects: {
        Row: {
          id: string
          department_id: string
          subject_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['department_subjects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['department_subjects']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          clerk_user_id: string
          role: 'student' | 'teacher' | 'school' | 'administrator'
          status: 'pending_verification' | 'email_verified' | 'phone_verified' | 'school_verified' | 'pending_approval' | 'active' | 'suspended' | 'inactive'
          full_name: string
          email: string
          phone: string | null
          school_id: string | null
          department_id: string | null
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
          registration_number: string | null
          staff_number: string | null
          subjects_taught: string[] | null
          avatar_path: string | null
          profile_last_edited_at: string | null
          notification_settings: Json
          accessibility_settings: Json
          download_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      school_membership_requests: {
        Row: {
          id: string
          profile_id: string
          school_id: string
          role: 'student' | 'teacher' | 'school' | 'administrator'
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
          department_id: string | null
          subjects_taught: string[] | null
          message: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['school_membership_requests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['school_membership_requests']['Insert']>
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          resource_type: 'book' | 'past_paper' | 'notes' | 'pamphlet' | 'revision_guide' | 'video' | 'school_publication' | 'teacher_explanation'
          author: string | null
          publisher_profile_id: string | null
          publisher_school_id: string | null
          subject_id: string | null
          department_id: string | null
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
          academic_year: number | null
          language: string
          edition: string | null
          isbn: string | null
          file_path: string
          file_name: string
          file_size: number
          file_mime_type: string
          file_hash: string | null
          thumbnail_path: string | null
          video_duration: number | null
          video_captions_path: string | null
          video_transcript_path: string | null
          approval_status: string
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          copyright_statement: string | null
          version: number
          parent_resource_id: string | null
          downloads_count: number
          views_count: number
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['resources']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['resources']['Insert']>
      }
      library_items: {
        Row: {
          id: string
          profile_id: string
          resource_id: string
          saved_at: string
          progress: number
          last_page: number | null
          last_chapter: string | null
          last_accessed_at: string | null
          is_completed: boolean
          completed_at: string | null
          is_downloaded: boolean
          downloaded_at: string | null
          download_quality: 'standard' | 'low_data'
          local_file_path: string | null
        }
        Insert: Omit<Database['public']['Tables']['library_items']['Row'], 'id' | 'saved_at'>
        Update: Partial<Database['public']['Tables']['library_items']['Insert']>
      }
      collections: {
        Row: {
          id: string
          profile_id: string
          name: string
          description: string | null
          cover_image_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['collections']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['collections']['Insert']>
      }
      collection_items: {
        Row: {
          id: string
          collection_id: string
          resource_id: string
          added_at: string
        }
        Insert: Omit<Database['public']['Tables']['collection_items']['Row'], 'id' | 'added_at'>
        Update: Partial<Database['public']['Tables']['collection_items']['Insert']>
      }
      questions: {
        Row: {
          id: string
          profile_id: string
          resource_id: string | null
          title: string | null
          content: string
          subject_id: string | null
          department_id: string | null
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
          chapter: string | null
          page_number: number | null
          selected_text: string | null
          likes_count: number
          answers_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['questions']['Insert']>
      }
      answers: {
        Row: {
          id: string
          question_id: string
          profile_id: string
          content: string
          is_correct: boolean
          marked_correct_by: string | null
          marked_correct_at: string | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['answers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['answers']['Insert']>
      }
      social_posts: {
        Row: {
          id: string
          profile_id: string
          post_type: 'question' | 'book' | 'paper' | 'video' | 'announcement'
          title: string | null
          content: string | null
          resource_id: string | null
          question_id: string | null
          is_hidden: boolean
          hidden_by: string | null
          hidden_at: string | null
          hidden_reason: string | null
          likes_count: number
          comments_count: number
          shares_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['social_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['social_posts']['Insert']>
      }
      social_comments: {
        Row: {
          id: string
          post_id: string
          profile_id: string
          parent_comment_id: string | null
          content: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['social_comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['social_comments']['Insert']>
      }
      likes: {
        Row: {
          id: string
          profile_id: string
          target_type: string
          target_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['likes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['likes']['Insert']>
      }
      follows: {
        Row: {
          id: string
          profile_id: string
          school_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['follows']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['follows']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          profile_id: string
          notification_type: 'school_upload' | 'new_resource' | 'answer_received' | 'answer_marked_correct' | 'saved_search_match' | 'school_update' | 'like' | 'comment' | 'follow' | 'membership_approved' | 'membership_rejected'
          title: string
          message: string | null
          target_type: string | null
          target_id: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      saved_searches: {
        Row: {
          id: string
          profile_id: string
          name: string
          search_params: Json
          notify_on_match: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['saved_searches']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['saved_searches']['Insert']>
      }
      user_activity: {
        Row: {
          id: string
          profile_id: string
          activity_type: string
          target_type: string
          target_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_activity']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_activity']['Insert']>
      }
      school_announcements: {
        Row: {
          id: string
          school_id: string
          profile_id: string
          title: string
          content: string
          attachment_path: string | null
          is_urgent: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['school_announcements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['school_announcements']['Insert']>
      }
      reports: {
        Row: {
          id: string
          profile_id: string
          target_type: string
          target_id: string
          reason: string
          description: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          resolution: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
    }
    Views: {
      school_profiles_view: {
        Row: {
          id: string
          clerk_org_id: string | null
          name: string
          school_type: 'government' | 'private' | 'mission' | 'community'
          description: string | null
          location: string
          district: string
          region: string | null
          official_email: string
          official_phone: string
          website: string | null
          registration_number: string | null
          is_verified: boolean
          verified_at: string | null
          logo_path: string | null
          cover_image_path: string | null
          representative_name: string | null
          representative_email: string | null
          representative_phone: string | null
          profile_last_edited_at: string | null
          created_at: string
          updated_at: string
          member_count: number
          teacher_count: number
          student_count: number
        }
        Insert: never
        Update: never
      }
      resources_with_publisher_view: {
        Row: {
          id: string
          title: string
          description: string | null
          resource_type: 'book' | 'past_paper' | 'notes' | 'pamphlet' | 'revision_guide' | 'video' | 'school_publication' | 'teacher_explanation'
          author: string | null
          publisher_profile_id: string | null
          publisher_school_id: string | null
          subject_id: string | null
          department_id: string | null
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
          academic_year: number | null
          language: string
          edition: string | null
          isbn: string | null
          file_path: string
          file_name: string
          file_size: number
          file_mime_type: string
          file_hash: string | null
          thumbnail_path: string | null
          video_duration: number | null
          video_captions_path: string | null
          video_transcript_path: string | null
          approval_status: string
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          copyright_statement: string | null
          version: number
          parent_resource_id: string | null
          downloads_count: number
          views_count: number
          likes_count: number
          created_at: string
          updated_at: string
          publisher_name: string | null
          publisher_type: string | null
          school_name: string | null
          subject_name: string | null
          department_name: string | null
        }
        Insert: never
        Update: never
      }
      questions_with_context_view: {
        Row: {
          id: string
          profile_id: string
          resource_id: string | null
          title: string | null
          content: string
          subject_id: string | null
          department_id: string | null
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
          chapter: string | null
          page_number: number | null
          selected_text: string | null
          likes_count: number
          answers_count: number
          created_at: string
          updated_at: string
          author_name: string
          school_id: string | null
          school_name: string | null
          subject_name: string | null
          resource_title: string | null
        }
        Insert: never
        Update: never
      }
      user_library_view: {
        Row: {
          id: string
          profile_id: string
          resource_id: string
          saved_at: string
          progress: number
          last_page: number | null
          last_chapter: string | null
          last_accessed_at: string | null
          is_completed: boolean
          completed_at: string | null
          is_downloaded: boolean
          downloaded_at: string | null
          download_quality: 'standard' | 'low_data'
          local_file_path: string | null
          title: string
          resource_type: 'book' | 'past_paper' | 'notes' | 'pamphlet' | 'revision_guide' | 'video' | 'school_publication' | 'teacher_explanation'
          file_size: number
          thumbnail_path: string | null
          subject_name: string | null
          form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4' | null
        }
        Insert: never
        Update: never
      }
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: undefined
      }
      increment_post_likes_count: {
        Args: Record<string, never>
        Returns: undefined
      }
      increment_post_comments_count: {
        Args: Record<string, never>
        Returns: undefined
      }
      increment_question_answers_count: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'school' | 'administrator'
      resource_type: 'book' | 'past_paper' | 'notes' | 'pamphlet' | 'revision_guide' | 'video' | 'school_publication' | 'teacher_explanation'
      account_status: 'pending_verification' | 'email_verified' | 'phone_verified' | 'school_verified' | 'pending_approval' | 'active' | 'suspended' | 'inactive'
      school_type: 'government' | 'private' | 'mission' | 'community'
      form_level: 'form_1' | 'form_2' | 'form_3' | 'form_4'
      post_type: 'question' | 'book' | 'paper' | 'video' | 'announcement'
      notification_type: 'school_upload' | 'new_resource' | 'answer_received' | 'answer_marked_correct' | 'saved_search_match' | 'school_update' | 'like' | 'comment' | 'follow' | 'membership_approved' | 'membership_rejected'
      download_quality: 'standard' | 'low_data'
    }
  }
}
