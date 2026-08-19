import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/supabase-auth'

interface DiagnosticPayload {
  type: 'crash' | 'feedback'
  app_version: string
  os: string
  error?: string
  stack?: string
  message?: string
  screenshot?: string
  metadata?: Record<string, unknown>
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: DiagnosticPayload = await req.json()
    const { type, app_version, os, error, stack, message, screenshot, metadata } = body

    if (!type || !['crash', 'feedback'].includes(type)) {
      return NextResponse.json({ error: 'type must be "crash" or "feedback"' }, { status: 400 })
    }

    if (!app_version || !os) {
      return NextResponse.json(
        { error: 'app_version and os are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: dbError } = await (supabase as any)
      .from('diagnostics')
      .insert({
        user_id: user.userId,
        type,
        app_version,
        os,
        error: error || null,
        stack: stack || null,
        message: message || null,
        screenshot: screenshot || null,
        metadata: metadata || null,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('Diagnostics error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    console.error('Diagnostics list error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
