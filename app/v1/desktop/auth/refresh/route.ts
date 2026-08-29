import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'
import { buildSessionExchange } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/refresh
//
// Rotates the desktop's session using its refresh token. Returns the same
// FABRICACloudSessionExchangeResponse shape as /session.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : ''
  if (!refreshToken) {
    return NextResponse.json({ error: 'refreshToken is required' }, { status: 400 })
  }

  const supabase = getSupabaseAnon()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Fabrica Cloud is not configured (Supabase).' },
      { status: 500 }
    )
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? 'Failed to refresh session.' },
        { status: 401 }
      )
    }

    return NextResponse.json(buildSessionExchange(data.user, data.session))
  } catch (err: unknown) {
    console.error('Fabrica session refresh error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
