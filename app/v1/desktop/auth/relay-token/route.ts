import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUser, mintRelayJwt } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/relay-token
//
// Mints a short-lived relay session token the desktop presents to Fabrica-relay
// (relay-session-broker.exchangeRelayAuthorization). The desktop sends the
// E2EE keypair's public key so the relay can associate the session, and we sign
// a JWT with FABRICA_RELAY_JWT_SECRET that the relay worker validates via
// HMAC-SHA256. The relay only checks the signature, so the shared secret MUST
// match the relay worker's FABRICA_RELAY_JWT_SECRET.
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const relayHostId = typeof body.relayHostId === 'string' ? body.relayHostId : ''
  const hostPublicKeyB64 = typeof body.hostPublicKeyB64 === 'string' ? body.hostPublicKeyB64 : ''
  if (!relayHostId || !hostPublicKeyB64) {
    return NextResponse.json(
      { error: 'relayHostId and hostPublicKeyB64 are required' },
      { status: 400 }
    )
  }

  const secret = process.env.FABRICA_RELAY_JWT_SECRET
  if (!secret) {
    return NextResponse.json(
      {
        error:
          'FABRICA_RELAY_JWT_SECRET is not configured. Set it on Vercel to match the Fabrica-relay worker.'
      },
      { status: 500 }
    )
  }

  try {
    const { relayToken, expiresAt } = mintRelayJwt({
      userId: user.id,
      relayHostId,
      hostPublicKeyB64,
      secret
    })
    return NextResponse.json({ relayToken, expiresAt })
  } catch (err: unknown) {
    console.error('Fabrica relay-token error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
