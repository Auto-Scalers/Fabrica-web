import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'
import { getSupabaseUser } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/logout
//
// Clears the desktop's cloud session. The desktop sends the persisted refresh
// token; we best-effort revoke it via Supabase admin, then return success. The
// desktop also clears its local session regardless of server outcome.
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    // refreshToken is optional here; local clearing handles the rest.
  }
  const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : ''

  const supabase = getSupabaseAnon()
  if (supabase && refreshToken) {
    // Requires a service-role key for admin.signOut; ignore failure otherwise.
    await supabase.auth.admin.signOut(refreshToken).catch(() => undefined)
  }

  return NextResponse.json({ success: true, userId: user.id })
}
