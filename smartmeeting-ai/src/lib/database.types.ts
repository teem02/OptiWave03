export type Database = {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string
          file_name: string
          file_size: number
          file_type: string
          upload_url: string | null
          transcript: string | null
          summary: string | null
          action_items: string[] | null
          follow_up_email: string | null
          processing_status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_name: string
          file_size: number
          file_type: string
          upload_url?: string | null
          transcript?: string | null
          summary?: string | null
          action_items?: string[] | null
          follow_up_email?: string | null
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_name?: string
          file_size?: number
          file_type?: string
          upload_url?: string | null
          transcript?: string | null
          summary?: string | null
          action_items?: string[] | null
          follow_up_email?: string | null
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Meeting = Database['public']['Tables']['meetings']['Row']
export type NewMeeting = Database['public']['Tables']['meetings']['Insert']
export type UpdateMeeting = Database['public']['Tables']['meetings']['Update']