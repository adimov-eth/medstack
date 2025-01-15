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
      cases: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          specialty: string
          author_id: string
          status: 'open' | 'closed'
          accepted_answer_id?: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          specialty: string
          author_id: string
          status?: 'open' | 'closed'
          accepted_answer_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          specialty?: string
          author_id?: string
          status?: 'open' | 'closed'
          accepted_answer_id?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          created_at: string
          content: string
          case_id: string
          author_id: string
          is_accepted: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          case_id: string
          author_id: string
          is_accepted?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          case_id?: string
          author_id?: string
          is_accepted?: boolean
        }
      }
      attachments: {
        Row: {
          id: string
          created_at: string
          file_path: string
          file_type: string
          parent_case_id?: string
          parent_answer_id?: string
          author_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          file_path: string
          file_type: string
          parent_case_id?: string
          parent_answer_id?: string
          author_id: string
        }
        Update: {
          id?: string
          created_at?: string
          file_path?: string
          file_type?: string
          parent_case_id?: string
          parent_answer_id?: string
          author_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          specialty?: string
          institution?: string
          avatar_url?: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          specialty?: string
          institution?: string
          avatar_url?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          specialty?: string
          institution?: string
          avatar_url?: string
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