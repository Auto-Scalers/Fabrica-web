import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getSupabaseUser } from '@/lib/fabrica-cloud'
import { ARTIFACTS_TABLE, artifactsClient, buildArtifactListItem } from '@/lib/fabrica-artifacts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /v1/artifacts/[id]
// Public retrieval of a published/shared artifact (no auth required). Returns the
// artifact metadata plus its rendered content.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const client = artifactsClient(supabase)
  const { data, error } = await client.from(ARTIFACTS_TABLE).select('*').eq('slug', id).single()
  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const row = data as Record<string, unknown>
  const expiresAt = row.expires_at ? new Date(String(row.expires_at)) : null
  if (expiresAt && expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Artifact expired' }, { status: 410 })
  }

  return NextResponse.json({
    artifact: buildArtifactListItem(row).artifact,
    content: row.content,
    shareUrl: row.share_url
  })
}

// PUT /v1/artifacts/[id]
// Edits an existing artifact. Requires the Bearer session plus the x-FABRICA-edit-token
// header captured at creation time.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const editToken = req.headers.get('x-FABRICA-edit-token')
  if (!editToken) {
    return NextResponse.json({ error: 'Missing x-FABRICA-edit-token header' }, { status: 400 })
  }

  const { id } = await params

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

  const now = new Date().toISOString()
  const client = artifactsClient(supabase)
  const { data, error } = await client
    .from(ARTIFACTS_TABLE)
    .update({
      content,
      source_content_type: contentType,
      original_file_name: fileName,
      title,
      updated_at: now,
      byte_size: Buffer.byteLength(content, 'utf8')
    })
    .eq('slug', id)
    .eq('edit_token', editToken)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found or edit token invalid' }, { status: 404 })
  }

  return NextResponse.json(buildArtifactListItem(data as Record<string, unknown>))
}

// DELETE /v1/artifacts/[id]
// Two modes:
//  - Unshare: with x-FABRICA-edit-token header (and Bearer) deletes by slug + token.
//  - Delete: with only Bearer, deletes the artifact owned by the signed-in user.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const client = artifactsClient(supabase)
  const editToken = req.headers.get('x-FABRICA-edit-token')

  if (editToken) {
    const user = await getSupabaseUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { error } = await client
      .from(ARTIFACTS_TABLE)
      .delete()
      .eq('slug', id)
      .eq('edit_token', editToken)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  const user = await getSupabaseUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { error } = await client
    .from(ARTIFACTS_TABLE)
    .delete()
    .eq('slug', id)
    .eq('user_id', user.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
