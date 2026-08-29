import { createHmac } from 'crypto'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseAnon } from '@/lib/supabase-auth'
import { NextRequest } from 'next/server'

// Shared helpers for the Fabrica Cloud desktop backend (Option 1 real backend).
// These power the routes under /v1/desktop/auth/* and /v1/artifacts/*.

export type FabricaCloudSummary = {
  cloudProfileId: string
  userId: string
  email: string
  displayName?: string
  activeOrgId?: string
  activeOrgName?: string
  linkedAt: number
}

export type FabricaCloudOrgSummary = {
  orgId: string
  name: string
  role?: string
}

export type FabricaCloudCapabilities = {
  flags: Record<string, boolean>
  refreshedAt: number
}

export type FabricaCloudSessionExchangeResponse = {
  accessToken: string
  refreshToken: string
  expiresAt: number
  cloud: FabricaCloudSummary
  organizations?: FabricaCloudOrgSummary[]
  capabilities: FabricaCloudCapabilities
}

export type FabricaCloudSelectOrgResponse = {
  cloud: FabricaCloudSummary
  organizations?: FabricaCloudOrgSummary[]
  capabilities: FabricaCloudCapabilities
}

export function buildCloudSummary(user: User): FabricaCloudSummary {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const displayName =
    typeof meta.full_name === 'string' && meta.full_name.trim()
      ? meta.full_name
      : typeof meta.name === 'string' && meta.name.trim()
        ? meta.name
        : undefined
  const linkedAt = user.created_at ? Date.parse(user.created_at) : NaN
  return {
    cloudProfileId: user.id,
    userId: user.id,
    email: user.email ?? '',
    displayName,
    activeOrgId: undefined,
    activeOrgName: undefined,
    linkedAt: Number.isFinite(linkedAt) ? linkedAt : Date.now()
  }
}

export function buildCapabilities(): FabricaCloudCapabilities {
  // Beta: capability flags are resolved server-side. Empty for now; reserved
  // for future gating (e.g. artifact publishing, relay quotas).
  return { flags: {}, refreshedAt: Date.now() }
}

export function buildSessionExchange(
  user: User,
  session: Session
): FabricaCloudSessionExchangeResponse {
  const expiresAtSeconds =
    typeof session.expires_at === 'number' ? session.expires_at : Math.floor(Date.now() / 1000)
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    // Contract expects epoch milliseconds.
    expiresAt: expiresAtSeconds * 1000,
    cloud: buildCloudSummary(user),
    organizations: undefined,
    capabilities: buildCapabilities()
  }
}

export function buildSelectOrgResponse(
  user: User,
  activeOrgId?: string,
  activeOrgName?: string
): FabricaCloudSelectOrgResponse {
  const cloud = buildCloudSummary(user)
  return {
    cloud: { ...cloud, activeOrgId, activeOrgName },
    organizations: activeOrgId ? [{ orgId: activeOrgId, name: activeOrgName ?? activeOrgId }] : undefined,
    capabilities: buildCapabilities()
  }
}

// Resolves the full Supabase user from a Bearer access token. Returns null when
// missing or invalid. Used by the authenticated desktop endpoints.
export async function getSupabaseUser(
  req: NextRequest
): Promise<User | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const supabase = getSupabaseAnon()
  if (!supabase) return null
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url')
}

// Exchanges an OAuth authorization code for a session using Supabase's REST
// token endpoint directly. We cannot use supabase-js `exchangeCodeForSession`
// here because the PKCE code verifier is held by the desktop client (which
// started the flow), not by this server process, and this SDK version no longer
// accepts the verifier as an argument.
export async function exchangePkceCode(opts: {
  code: string
  codeVerifier: string
  redirectUri: string
  supabaseUrl: string
  anonKey: string
}): Promise<{ session: Session; user: User }> {
  const res = await fetch(`${opts.supabaseUrl}/auth/v1/token?grant_type=authorization_code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: opts.anonKey,
      Authorization: `Bearer ${opts.anonKey}`
    },
    body: JSON.stringify({
      code: opts.code,
      code_verifier: opts.codeVerifier,
      redirect_uri: opts.redirectUri,
      client_id: opts.anonKey
    })
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase token exchange failed (${res.status}): ${text}`)
  }

  const json = (await res.json()) as Record<string, unknown>
  const user = json.user as User
  const session = {
    access_token: String(json.access_token),
    refresh_token: String(json.refresh_token),
    expires_in: typeof json.expires_in === 'number' ? json.expires_in : undefined,
    expires_at: typeof json.expires_at === 'number' ? json.expires_at : undefined,
    token_type: 'bearer',
    user
  } as unknown as Session

  return { session, user }
}

export type MintRelayJwtOptions = {
  userId: string
  relayHostId: string
  hostPublicKeyB64: string
  secret: string
  ttlMs?: number
}

// Mints a short-lived JWT for Fabrica-relay. The relay validates it with
// HMAC-SHA256 over `${header}.${payload}` using FABRICA_RELAY_JWT_SECRET, so
// this must be signed with the SAME secret configured on the relay worker.
// The relay only verifies the signature; claims below are descriptive.
export function mintRelayJwt(opts: MintRelayJwtOptions): {
  relayToken: string
  expiresAt: number
} {
  const ttlMs = opts.ttlMs ?? 15 * 60 * 1000
  const nowSeconds = Math.floor(Date.now() / 1000)
  const expSeconds = Math.floor((Date.now() + ttlMs) / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: opts.userId,
    relayHostId: opts.relayHostId,
    hostPublicKeyB64: opts.hostPublicKeyB64,
    iat: nowSeconds,
    exp: expSeconds
  }
  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const data = `${headerB64}.${payloadB64}`
  const sig = createHmac('sha256', opts.secret).update(data).digest('base64url')
  return {
    relayToken: `${data}.${sig}`,
    expiresAt: expSeconds * 1000
  }
}
