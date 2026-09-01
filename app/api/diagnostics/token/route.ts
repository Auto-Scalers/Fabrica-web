import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BUNDLE_BYTES = 4 * 1024 * 1024
const TOKEN_TTL_MS = 15 * 60 * 1000
const RATE_LIMIT_PER_IP = 10
const RATE_WINDOW_MS = 60 * 60 * 1000

// Simple in-memory rate limiter (resets on cold start, acceptable for diagnostics).
const rateBuckets = new Map<string, { count: number; windowStart: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)
  if (!bucket || now - bucket.windowStart > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, windowStart: now })
    return true
  }
  if (bucket.count >= RATE_LIMIT_PER_IP) {
    return false
  }
  bucket.count++
  return true
}

// POST /api/diagnostics/token
// Step 1 of the desktop's two-step crash-bundle upload.
// Returns a short-lived token and upload URL for the NDJSON payload.
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const bundleSubmissionId =
    typeof body.bundle_submission_id === 'string' ? body.bundle_submission_id : ''
  const bytes = typeof body.bytes === 'number' ? body.bytes : 0

  if (!bundleSubmissionId || !bytes) {
    return NextResponse.json(
      { error: 'bundle_submission_id and bytes are required' },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString()
  const origin = req.nextUrl.origin

  const { error } = await supabase.from('diagnostic_uploads').insert({
    bundle_submission_id: bundleSubmissionId,
    upload_token: token,
    max_bytes: MAX_BUNDLE_BYTES,
    expires_at: expiresAt
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    token,
    expires_at: expiresAt,
    upload_url: `${origin}/api/diagnostics/upload`,
    max_bytes: MAX_BUNDLE_BYTES
  })
}
