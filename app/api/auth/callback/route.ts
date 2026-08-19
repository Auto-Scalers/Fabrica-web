import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    const state = req.nextUrl.searchParams.get('state')
    const error = req.nextUrl.searchParams.get('error')

    if (error) {
      const errorDesc = req.nextUrl.searchParams.get('error_description') || error
      console.error('OAuth error:', errorDesc)
      return NextResponse.json({ error: errorDesc }, { status: 400 })
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 })
    }

    const supabase = getSupabaseAnon()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange failed:', exchangeError.message)
      return NextResponse.json({ error: exchangeError.message }, { status: 401 })
    }

    const { session, user } = data

    // Redirect URL — desktop app registers a custom scheme or a web fallback
    const redirectBase = process.env.AUTH_REDIRECT_URL || req.nextUrl.origin
    const redirectUrl = new URL(redirectBase)

    // Pass tokens in fragment (not logged to server logs) for client pickup
    redirectUrl.hash = new URLSearchParams({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: String(session.expires_at),
      ...(user ? { user_id: user.id, email: user.email || '' } : {}),
    }).toString()

    // Preserve state if provided (desktop app correlation ID)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }

    return NextResponse.redirect(redirectUrl)
  } catch (err: unknown) {
    console.error('Auth callback error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
