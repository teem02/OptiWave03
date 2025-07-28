import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          video_url: string
          caption: string | null
          category: 'Programming' | 'AI' | 'Education'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_url: string
          caption?: string | null
          category: 'Programming' | 'AI' | 'Education'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_url?: string
          caption?: string | null
          category?: 'Programming' | 'AI' | 'Education'
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}