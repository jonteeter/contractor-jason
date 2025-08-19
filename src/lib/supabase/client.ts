import { createClient } from '@supabase/supabase-js'

// Supabase configuration from memory bank
const supabaseUrl = 'https://eonnbueqowenorscxugz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbm5idWVxb3dlbm9yc2N4dWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTU3MzUsImV4cCI6MjA3MTEzMTczNX0.Vqwr9rr3D6a0h1RX5XE_2eeJaoW19HN7sVtyaYSEgWE'

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types will be generated here
export type Database = {
  public: {
    Tables: {
      contractors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          company_name: string
          contact_name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          subscription_plan: 'basic' | 'professional' | 'enterprise'
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          company_name: string
          contact_name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          subscription_plan?: 'basic' | 'professional' | 'enterprise'
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          company_name?: string
          contact_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          subscription_plan?: 'basic' | 'professional' | 'enterprise'
          is_active?: boolean
        }
      }
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          contractor_id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          customer_type: 'new' | 'existing'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          contractor_id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          customer_type: 'new' | 'existing'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          contractor_id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          customer_type?: 'new' | 'existing'
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          contractor_id: string
          customer_id: string
          project_name: string
          floor_type: 'red_oak' | 'white_oak' | 'linoleum'
          floor_size: '2_inch' | '2_5_inch' | '3_inch'
          finish_type: 'stain' | 'gloss' | 'semi_gloss' | 'option'
          stain_type: 'natural' | 'golden_oak' | 'spice_brown' | null
          stair_treads: number
          stair_risers: number
          room_1_length: number | null
          room_1_width: number | null
          room_2_length: number | null
          room_2_width: number | null
          room_3_length: number | null
          room_3_width: number | null
          total_square_feet: number
          estimated_cost: number
          status: 'draft' | 'quoted' | 'approved' | 'in_progress' | 'completed'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          contractor_id: string
          customer_id: string
          project_name: string
          floor_type: 'red_oak' | 'white_oak' | 'linoleum'
          floor_size: '2_inch' | '2_5_inch' | '3_inch'
          finish_type: 'stain' | 'gloss' | 'semi_gloss' | 'option'
          stain_type?: 'natural' | 'golden_oak' | 'spice_brown' | null
          stair_treads: number
          stair_risers: number
          room_1_length?: number | null
          room_1_width?: number | null
          room_2_length?: number | null
          room_2_width?: number | null
          room_3_length?: number | null
          room_3_width?: number | null
          total_square_feet: number
          estimated_cost: number
          status?: 'draft' | 'quoted' | 'approved' | 'in_progress' | 'completed'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          contractor_id?: string
          customer_id?: string
          project_name?: string
          floor_type?: 'red_oak' | 'white_oak' | 'linoleum'
          floor_size?: '2_inch' | '2_5_inch' | '3_inch'
          finish_type?: 'stain' | 'gloss' | 'semi_gloss' | 'option'
          stain_type?: 'natural' | 'golden_oak' | 'spice_brown' | null
          stair_treads?: number
          stair_risers?: number
          room_1_length?: number | null
          room_1_width?: number | null
          room_2_length?: number | null
          room_2_width?: number | null
          room_3_length?: number | null
          room_3_width?: number | null
          total_square_feet?: number
          estimated_cost?: number
          status?: 'draft' | 'quoted' | 'approved' | 'in_progress' | 'completed'
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
