import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUser, buildSelectOrgResponse } from '@/lib/fabrica-cloud'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /v1/desktop/auth/capabilities
//
// Returns the signed-in account's current capabilities, cloud summary, and orgs.
// Called by the desktop to refresh capability flags without rotating tokens.
export async function POST(req: NextRequest) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(buildSelectOrgResponse(user))
}
