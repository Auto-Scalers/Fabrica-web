import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAnon } from '@/lib/supabase-auth'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /v1/desktop/auth/invites?relayHostId=…
//
// Proxies the latest desktop pairing invite for the signed-in user so the
// /login?intent=pair panel can render a fresh QR + 32-character code. The
// desktop is the source of truth — it pushes the invite into the
// `fabrica_pair_invites` table (or the relay mirrors it there) when the
// host opens a pairing window. When the desktop has not yet pushed an
// invite, we still return a synthesized response so the panel has
// something to display; the real invite is delivered over the relay
// WebSocket directly to the phone.
//
// Auth: Bearer <supabase_access_token>, validated via the existing
// lib/supabase-auth helper so we don't mix browser + server client
// lifecycles.

type InviteRow = {
  invite_token: string | null
  expires_at: string | null
  max_attempts: number | null
  relay_host_id: string | null
  relay_device_id: string | null
}

type InviteResponse = {
  inviteToken: string
  expiresAt: number
  maxAttempts: number
  relayHostId: string
  relayDeviceId: string
}

function serviceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function GET(req: NextRequest) {
  if (!getSupabaseAnon()) {
    return NextResponse.json(
      { error: 'Fabrica Cloud is not configured.' },
      { status: 500 },
    )
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.slice(7)

  const supabase = getSupabaseAnon()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Fabrica Cloud is not configured.' },
      { status: 500 },
    )
  }
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const relayHostId = req.nextUrl.searchParams.get('relayHostId') || 'self'
  const admin = serviceClient()
  if (admin) {
    try {
      const { data, error } = await admin
        .from('fabrica_pair_invites')
        .select('invite_token, expires_at, max_attempts, relay_host_id, relay_device_id')
        .eq('user_id', userData.user.id)
        .eq('relay_host_id', relayHostId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (!error && data && data.length > 0) {
        const row = data[0] as InviteRow
        if (row.invite_token) {
          const expiresAt = row.expires_at
            ? Date.parse(row.expires_at)
            : Date.now() + 24 * 60 * 60 * 1000
          const body: InviteResponse = {
            inviteToken: row.invite_token,
            expiresAt: Number.isFinite(expiresAt) ? expiresAt : Date.now() + 24 * 60 * 60 * 1000,
            maxAttempts: row.max_attempts ?? 16,
            relayHostId: row.relay_host_id ?? relayHostId,
            relayDeviceId: row.relay_device_id ?? '',
          }
          return NextResponse.json(body)
        }
      }
    } catch (err: unknown) {
      console.warn('invites lookup failed:', err)
    }
  }

  // Synthesize a placeholder when the desktop hasn't pushed an invite yet.
  // The desktop is the source of truth; the phone still uses this code as
  // its credential. We deliberately do NOT return an error so the panel can
  // render without coupling to desktop availability.
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000
  const body: InviteResponse = {
    inviteToken: '',
    expiresAt,
    maxAttempts: 16,
    relayHostId,
    relayDeviceId: '',
  }
  return NextResponse.json(body)
}