import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/v1/desktop/auth/authorize
//
// The desktop opens this URL in the system browser as the first leg of an
// OAuth PKCE flow. The query parameters are produced by the desktop's PKCE
// generator (see Fabrica-app profile-cloud-pkce.ts):
//   client_id, response_type=code, redirect_uri (loopback), scope,
//   nonce, state, code_challenge, code_challenge_method, local_profile_id
//
// We forward them to Supabase's authorize endpoint so the browser lands on the
// provider login and is redirected back to the desktop's loopback with `code`
// and `state`. The desktop then POSTs those to /v1/desktop/auth/session.
export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        {
          error:
            'Fabrica Cloud is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        },
        { status: 500 }
      )
    }

    const sp = req.nextUrl.searchParams
    const redirectUri = sp.get('redirect_uri')
    const codeChallenge = sp.get('code_challenge')
    const state = sp.get('state')

    if (!redirectUri || !codeChallenge || !state) {
      return NextResponse.json(
        { error: 'Missing required PKCE parameters: redirect_uri, code_challenge, state.' },
        { status: 400 }
      )
    }

    const provider = sp.get('provider') || process.env.FABRICA_OAUTH_PROVIDER || 'github'
    const codeChallengeMethod = sp.get('code_challenge_method') || 'S256'
    const nonce = sp.get('nonce') ?? ''
    const scope = sp.get('scope') || 'openid profile email offline_access'

    const url = new URL(`${supabaseUrl}/auth/v1/authorize`)
    url.searchParams.set('provider', provider)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', anonKey)
    url.searchParams.set('redirect_to', redirectUri)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('code_challenge', codeChallenge)
    url.searchParams.set('code_challenge_method', codeChallengeMethod)
    url.searchParams.set('state', state)
    url.searchParams.set('scope', scope)
    if (nonce) url.searchParams.set('nonce', nonce)
    url.searchParams.set('prompt', 'consent')

    return NextResponse.redirect(url.toString())
  } catch (err: unknown) {
    console.error('Fabrica authorize error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
