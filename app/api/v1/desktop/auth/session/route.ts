import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'
import { buildSessionExchange, exchangePkceCode } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/v1/desktop/auth/session
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
  if (!code || !codeVerifier) {
    return NextResponse.json(
      { error: 'code and codeVerifier are required' },
      { status: 400 }
    )
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
    const { session, user } = await exchangePkceCode({
      code,
      codeVerifier,
      redirectUri,
      supabaseUrl,
      anonKey
    })

    return NextResponse.json(buildSessionExchange(user, session))
  } catch (err: unknown) {
    console.error('Fabrica session exchange error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 401 }
    )
  }
}
