import { createBrowserClient } from '@supabase/ssr'

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Create browser client for client-side usage (stores session in cookies)
export const createClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Default client instance for backwards compatibility
export const supabase = createClient()

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
