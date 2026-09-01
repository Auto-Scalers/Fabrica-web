import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BUNDLE_BYTES = 4 * 1024 * 1024

// POST /api/diagnostics/upload
// Step 2 of the desktop's two-step crash-bundle upload.
// Accepts the NDJSON payload with a Bearer token from step 1.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })
  }
  const token = authHeader.slice(7)

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  // Look up the pending upload by token.
  const { data: uploadRow, error: lookupError } = await supabase
    .from('diagnostic_uploads')
    .select('*')
    .eq('upload_token', token)
    .single()

  if (lookupError || !uploadRow) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  // Check expiry.
  if (new Date(uploadRow.expires_at).getTime() < Date.now()) {
    await supabase.from('diagnostic_uploads').delete().eq('id', uploadRow.id)
    return NextResponse.json({ error: 'Token expired' }, { status: 401 })
  }

  // Read the NDJSON body.
  const payload = await req.text()
  const payloadBytes = Buffer.byteLength(payload, 'utf8')

  if (payloadBytes > uploadRow.max_bytes || payloadBytes > MAX_BUNDLE_BYTES) {
    return NextResponse.json(
      { error: `Payload exceeds size limit (${payloadBytes} > ${uploadRow.max_bytes})` },
      { status: 413 }
    )
  }

  // Parse the first line (bundle-header) to extract metadata.
  let appVersion = 'unknown'
  let platform = 'unknown'
  let arch = 'unknown'
  try {
    const firstLine = payload.split('\n').find(Boolean)
    if (firstLine) {
      const header = JSON.parse(firstLine) as Record<string, unknown>
      if (typeof header.app_version === 'string') appVersion = header.app_version
      if (typeof header.platform === 'string') platform = header.platform
      if (typeof header.arch === 'string') arch = header.arch
    }
  } catch {
    // Header parse failure is non-fatal; store what we have.
  }

  // Insert into the diagnostics table.
  const { data: diagRow, error: insertError } = await supabase
    .from('diagnostics')
    .insert({
      user_id: uploadRow.bundle_submission_id,
      type: 'crash',
      app_version: appVersion,
      os: `${platform}/${arch}`,
      message: payload,
      metadata: {
        bundle_submission_id: uploadRow.bundle_submission_id,
        payload_bytes: payloadBytes
      }
    })
    .select('id')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Clean up the upload token.
  await supabase.from('diagnostic_uploads').delete().eq('id', uploadRow.id)

  return NextResponse.json({ ticket_id: diagRow.id })
}
