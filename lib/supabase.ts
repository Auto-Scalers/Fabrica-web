import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      fabrica_artifacts: {
        Row: {
          slug: string
          user_id: string
          title: string | null
          original_file_name: string | null
          source_content_type: string
          rendered_content_type: string
          content: string
          edit_token: string
          share_url: string
          byte_size: number
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          slug: string
          user_id: string
          title?: string | null
          original_file_name?: string | null
          source_content_type?: string
          rendered_content_type?: string
          content: string
          edit_token: string
          share_url: string
          byte_size?: number
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          slug?: string
          user_id?: string
          title?: string | null
          original_file_name?: string | null
          source_content_type?: string
          rendered_content_type?: string
          content?: string
          edit_token?: string
          share_url?: string
          byte_size?: number
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      diagnostics: {
        Row: {
          id: string
          user_id: string
          type: string
          app_version: string
          os: string
          error: string | null
          stack: string | null
          message: string | null
          screenshot: string | null
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          app_version: string
          os: string
          error?: string | null
          stack?: string | null
          message?: string | null
          screenshot?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          app_version?: string
          os?: string
          error?: string | null
          stack?: string | null
          message?: string | null
          screenshot?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
      }
      fabrica_pair_invites: {
        Row: {
          id: string
          user_id: string
          relay_host_id: string
          relay_device_id: string
          invite_token: string
          max_attempts: number
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          relay_host_id: string
          relay_device_id?: string
          invite_token: string
          max_attempts?: number
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          relay_host_id?: string
          relay_device_id?: string
          invite_token?: string
          max_attempts?: number
          created_at?: string
          expires_at?: string
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
