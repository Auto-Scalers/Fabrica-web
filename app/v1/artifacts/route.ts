import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getSupabaseUser } from '@/lib/fabrica-cloud'
import {
  ARTIFACTS_TABLE,
  ARTIFACT_DEFAULT_TTL_MS,
  artifactsClient,
  buildArtifactListItem
} from '@/lib/fabrica-artifacts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LIST_PAGE_SIZE = 50

// GET /v1/artifacts?cursor=<updatedAt>
// Lists the signed-in user's artifacts (most recently updated first).
export async function GET(req: NextRequest) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const cursor = req.nextUrl.searchParams.get('cursor')
  const client = artifactsClient(supabase)
  let query = client
    .from(ARTIFACTS_TABLE)
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(LIST_PAGE_SIZE + 1)

  if (cursor) {
    query = query.lt('updated_at', cursor)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>
  const hasMore = rows.length > LIST_PAGE_SIZE
  const page = rows.slice(0, LIST_PAGE_SIZE)
  const nextCursor = hasMore ? String(page[page.length - 1]?.updated_at ?? '') : undefined

  return NextResponse.json({
    artifacts: page.map((row) => buildArtifactListItem(row)),
    ...(nextCursor ? { nextCursor } : {})
  })
}

// POST /v1/artifacts
// Shares/creates an artifact. Body mirrors artifactWriteBody:
//   { content, contentType, fileName, title? }, plus idempotency-key header.
// Returns ArtifactListItem & { editToken } (the desktop persists the edit token).
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

  const content = typeof body.content === 'string' ? body.content : ''
  const contentType =
    typeof body.contentType === 'string' ? body.contentType : 'text/html'
  const fileName = typeof body.fileName === 'string' ? body.fileName : 'artifact'
  const title = typeof body.title === 'string' ? body.title : null

  if (!content) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const slug = randomBytes(9).toString('hex')
  const editToken = randomBytes(32).toString('hex')
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + ARTIFACT_DEFAULT_TTL_MS).toISOString()
  const baseUrl = `${req.nextUrl.origin}/v1/artifacts`
  const shareUrl = `${baseUrl}/${slug}`
  const byteSize = Buffer.byteLength(content, 'utf8')

  const row = {
    slug,
    user_id: user.id,
    title,
    original_file_name: fileName,
    source_content_type: contentType,
    rendered_content_type: 'text/html',
    content,
    edit_token: editToken,
    share_url: shareUrl,
    byte_size: byteSize,
    created_at: now,
    updated_at: now,
    expires_at: expiresAt
  }

  const client = artifactsClient(supabase)
  const { data, error } = await client.from(ARTIFACTS_TABLE).insert(row).select().single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const item = buildArtifactListItem(data as Record<string, unknown>)
  return NextResponse.json({ ...item, editToken }, { status: 201 })
}
