import { NextRequest, NextResponse } from 'next/server'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseUser, buildSessionExchange } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/profile
//
// Creates/links a cloud profile for the signed-in account. The desktop sends an
// existing Bearer session (from /session) plus optional { orgId?, name? } and
// expects the full FABRICACloudSessionExchangeResponse it then persists.
//
// Beta note: account creation is a no-op here because the Supabase user already
// exists after the OAuth exchange. We echo the caller's access token back so the
// desktop keeps a usable session; a production build should re-issue a fresh
// session via Supabase rather than reusing the bearer token as a refresh token.
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = req.headers.get('authorization')
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 })
  }

  // orgId/name are accepted for forward compatibility with the contract but are
  // not persisted server-side in the Beta build.
  try {
    await req.json().catch(() => ({}))
  } catch {
    // ignore malformed optional body
  }

  // Minimal-but-valid Beta Session: reuse the access token for both fields.
  // See the Beta note above for the production follow-up.
  const session = {
    access_token: accessToken,
    refresh_token: accessToken,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    token_type: 'bearer',
    user
  } as unknown as Session

  return NextResponse.json(buildSessionExchange(user, session))
}
