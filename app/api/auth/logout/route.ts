import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon, getUserFromRequest } from '@/lib/supabase-auth'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    const supabase = getSupabaseAnon()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    if (token) {
      const { error } = await supabase.auth.admin.signOut(token)
      if (error) {
        console.warn('Sign out warning:', error.message)
      }
    }

    const user = await getUserFromRequest(req)

    return NextResponse.json({
      success: true,
      userId: user?.userId,
    })
  } catch (err: unknown) {
    console.error('Logout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
