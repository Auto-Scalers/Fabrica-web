import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'
import { buildSessionExchange, exchangePkceCode } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/session
//
// Second leg of the desktop PKCE flow. The desktop sends the code + verifier it
// obtained from its loopback redirect, and we exchange them with Supabase for a
// real session. Returns the FABRICACloudSessionExchangeResponse contract shape
// the desktop persists (profile-cloud-client normalizeSessionResponse).
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const code = typeof body.code === 'string' ? body.code : ''
  const codeVerifier = typeof body.codeVerifier === 'string' ? body.codeVerifier : ''
  const redirectUri = typeof body.redirectUri === 'string' ? body.redirectUri : ''
  const accessToken = typeof body.accessToken === 'string' ? body.accessToken : ''
  const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : ''

  if (!code || !codeVerifier) {
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'code and codeVerifier are required, or accessToken and refreshToken.' },
        { status: 400 }
      )
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { error: 'Fabrica Cloud is not configured (Supabase).' },
      { status: 500 }
    )
  }

  // Touch getSupabaseAnon so a misconfigured client surfaces consistently.
  if (!getSupabaseAnon()) {
    return NextResponse.json(
      { error: 'Fabrica Cloud is not configured (Supabase client).' },
      { status: 500 }
    )
  }

  try {
    let session: Awaited<ReturnType<typeof exchangePkceCode>>['session']
    let user: Awaited<ReturnType<typeof exchangePkceCode>>['user']

    if (code && codeVerifier) {
      // PKCE code exchange (OAuth flow).
      const result = await exchangePkceCode({
        code,
        codeVerifier,
        redirectUri,
        supabaseUrl,
        anonKey
      })
      session = result.session
      user = result.user
    } else {
      // Direct token exchange (email/password flow).
      const supabase = getSupabaseAnon()
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase not configured.' }, { status: 500 })
      }
      const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
      if (userError || !userData.user) {
        return NextResponse.json({ error: userError?.message ?? 'Invalid access token.' }, { status: 401 })
      }
      user = userData.user
      // Construct a minimal Session object from the tokens.
      session = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user
      } as unknown as Awaited<ReturnType<typeof exchangePkceCode>>['session']
    }

    return NextResponse.json(buildSessionExchange(user, session))
  } catch (err: unknown) {
    console.error('Fabrica session exchange error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 401 }
    )
  }
}
