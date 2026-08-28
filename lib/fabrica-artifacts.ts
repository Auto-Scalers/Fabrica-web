import type { SupabaseClient } from '@supabase/supabase-js'

export const ARTIFACTS_TABLE = 'fabrica_artifacts'
export const ARTIFACT_DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000

export type ArtifactMetadata = {
  version: 1
  slug: string
  title: string | null
  originalFileName: string | null
  sourceContentType: string
  renderedContentType: 'text/html'
  createdAt: string
  updatedAt: string
  expiresAt: string
  byteSize: number
  deletedAt: string | null
}

export type ArtifactListItem = {
  artifact: ArtifactMetadata
  shareUrl: string
}

export type ArtifactRow = Record<string, unknown>

export function buildArtifactMetadata(row: ArtifactRow): ArtifactMetadata {
  return {
    version: 1,
    slug: String(row.slug ?? ''),
    title: row.title == null ? null : String(row.title),
    originalFileName: row.original_file_name == null ? null : String(row.original_file_name),
    sourceContentType: String(row.source_content_type ?? 'text/html'),
    renderedContentType: 'text/html',
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    expiresAt: String(row.expires_at ?? new Date().toISOString()),
    byteSize: typeof row.byte_size === 'number' ? row.byte_size : 0,
    deletedAt: null
  }
}

export function buildArtifactListItem(row: ArtifactRow): ArtifactListItem {
  return {
    artifact: buildArtifactMetadata(row),
    shareUrl: String(row.share_url ?? '')
  }
}

// Supabase's typed client is scoped to the landing-page schema; the artifacts
// table is managed separately, so we return the untyped client (default `any`
// schema) which lets `.from('fabrica_artifacts')` resolve without widening the
// landing-page schema type (consistent with the existing share route).
export function artifactsClient(supabase: SupabaseClient): SupabaseClient {
  return supabase
}
