import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUser, buildSelectOrgResponse } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/org
//
// Switches the active organization for the signed-in account. The desktop sends
// { orgId } and expects { cloud, organizations, capabilities } with the chosen
// org reflected in the cloud summary.
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    // orgId is optional on the contract; default to clearing selection.
  }

  const orgId = typeof body.orgId === 'string' && body.orgId.trim() ? body.orgId.trim() : undefined

  return NextResponse.json(buildSelectOrgResponse(user, orgId))
}
