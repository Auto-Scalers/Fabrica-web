import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

let supabaseAnon: SupabaseClient | null = null

export function getSupabaseAnon(): SupabaseClient | null {
  if (supabaseAnon) return supabaseAnon

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) return null

  supabaseAnon = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return supabaseAnon
}

export async function getUserFromRequest(
  req: NextRequest
): Promise<{ userId: string; email?: string } | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice(7)
  const supabase = getSupabaseAnon()
  if (!supabase) return null

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null

  return { userId: data.user.id, email: data.user.email }
}
