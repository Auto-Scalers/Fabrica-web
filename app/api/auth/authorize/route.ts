import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAnon()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' },
        { status: 500 }
      )
    }

    const provider = req.nextUrl.searchParams.get('provider') || 'github'
    const redirectTo = req.nextUrl.searchParams.get('redirect_to') || `${req.nextUrl.origin}/api/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'github' | 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ url: data.url })
  } catch (err: unknown) {
    console.error('Auth authorize error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, code_verifier } = body

    if (!code || !code_verifier) {
      return NextResponse.json({ error: 'code and code_verifier are required' }, { status: 400 })
    }

    const supabase = getSupabaseAnon()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code, code_verifier)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      session: data.session,
      user: data.user,
    })
  } catch (err: unknown) {
    console.error('Auth code exchange error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
