import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      early_access_signups: {
        Row: {
          id: string
          email: string
          platform: string | null
          referrer: string | null
          company: string | null
          team_size: string | null
          message: string | null
          use_case: string | null
          timeline: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          platform?: string | null
          referrer?: string | null
          company?: string | null
          team_size?: string | null
          message?: string | null
          use_case?: string | null
          timeline?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          platform?: string | null
          referrer?: string | null
          company?: string | null
          team_size?: string | null
          message?: string | null
          use_case?: string | null
          timeline?: string | null
          updated_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

let supabaseAdmin: SupabaseClient<Database> | null = null

export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseAdmin
}
