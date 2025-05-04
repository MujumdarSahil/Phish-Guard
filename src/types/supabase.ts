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
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
      }
      scan_history: {
        Row: {
          id: string
          created_at: string
          user_id: string
          url: string
          is_phishing: boolean
          confidence_score: number
          model_used: string
          features: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          url: string
          is_phishing: boolean
          confidence_score: number
          model_used: string
          features?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          url?: string
          is_phishing?: boolean
          confidence_score?: number
          model_used?: string
          features?: Json | null
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