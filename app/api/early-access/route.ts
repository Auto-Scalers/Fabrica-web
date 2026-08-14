import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

interface SignupRecord {
  email: string
  platform: string
  referrer: string | null
  company?: string | null
  team_size?: string | null
  message?: string | null
  use_case?: string | null
  timeline?: string | null
  updated_at?: string
  created_at: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      platform,
      referrer = '',
      company = '',
      team_size = '',
      message = '',
      use_case = '',
      timeline = '',
    } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 })
    }

    if (!platform || typeof platform !== 'string') {
      return NextResponse.json({ error: 'Platform selection is required.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      )
    }

    const now = new Date().toISOString()
    const payload: SignupRecord = {
      email: email.trim().toLowerCase(),
      platform: platform.trim(),
      referrer: referrer || null,
      company: company ? company.trim() : null,
      team_size: team_size ? team_size.trim() : null,
      message: message ? message.trim() : null,
      use_case: use_case ? use_case.trim() : null,
      timeline: timeline ? timeline.trim() : null,
      updated_at: now,
      created_at: now,
    }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('early_access_signups')
      .upsert(payload, { onConflict: 'email' })
      .select()

    if (error) {
      console.error('Early access upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('API Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('early_access_signups')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (error) {
      console.warn('Lookup failed:', error.message)
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('Lookup API Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
