import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const { refresh_token } = (body ?? {}) as Record<string, unknown>

    if (!refresh_token || typeof refresh_token !== 'string') {
      return NextResponse.json({ error: 'refresh_token is required' }, { status: 400 })
    }

    const supabase = getSupabaseAnon()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      session: data.session,
      user: data.user,
    })
  } catch (err: unknown) {
    console.error('Token refresh error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
