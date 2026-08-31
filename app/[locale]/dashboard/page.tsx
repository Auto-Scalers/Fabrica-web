'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/src/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  KeyRound,
  LogOut,
  Trash2,
} from 'lucide-react'

const TOKEN_KEY = 'fabrica_auth_tokens'

type Tokens = {
  access_token: string
  refresh_token: string
  expires_at?: string
  user_id?: string
  email?: string
}

type UserProfile = {
  email?: string
  displayName?: string
  userId?: string
}

type Artifact = {
  slug: string
  title?: string
  originalFileName?: string
  sourceContentType?: string
  renderedContentType?: string
  shareUrl: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  byteSize: number
}

function readTokensFromHash(): Tokens | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return null
  const params = new URLSearchParams(hash)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (!access_token || !refresh_token) return null
  return {
    access_token,
    refresh_token,
    expires_at: params.get('expires_at') ?? undefined,
    user_id: params.get('user_id') ?? undefined,
    email: params.get('email') ?? undefined,
  }
}

function loadTokens(): Tokens | null {
  if (typeof window === 'undefined') return null
  const fromHash = readTokensFromHash()
  if (fromHash) {
    try {
      window.localStorage.setItem(TOKEN_KEY, JSON.stringify(fromHash))
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    } catch { /* ignore */ }
    return fromHash
  }
  try {
    const stored = window.localStorage.getItem(TOKEN_KEY)
    return stored ? (JSON.parse(stored) as Tokens) : null
  } catch {
    return null
  }
}

function initialsFrom(name?: string, email?: string): string {
  const source = (name || email || '?').trim()
  if (!source || source === '?') return 'F'
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  const [tokens, setTokens] = useState<Tokens | null>(() => loadTokens())
  const [loading, setLoading] = useState(() => loadTokens() !== null)
  const [error, setError] = useState(false)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const displayName = profile?.displayName
  const email = tokens?.email || profile?.email
  const greetingName = displayName || email?.split('@')[0]

  const signOut = useCallback(() => {
    try { window.localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
    setTokens(null)
    setProfile(null)
    setArtifacts([])
  }, [])

  const copyShareLink = useCallback(async (slug: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedSlug(slug)
      window.setTimeout(() => setCopiedSlug(null), 2000)
    } catch { /* ignore */ }
  }, [])

  const deleteArtifact = useCallback(async (slug: string) => {
    if (!tokens) return
    setDeletingSlug(slug)
    try {
      const res = await fetch(`/v1/artifacts/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      if (res.ok) {
        setArtifacts((prev) => prev.filter((a) => a.slug !== slug))
      }
    } catch { /* ignore */ } finally {
      setDeletingSlug(null)
      setConfirmDelete(null)
    }
  }, [tokens])

  // ── Load workspace on mount ──
  useEffect(() => {
    if (!tokens) return
    let cancelled = false

    async function load() {
      if (!tokens) return
      setError(false)
      try {
        const headers = { Authorization: `Bearer ${tokens!.access_token}` }
        const [capRes, artRes] = await Promise.all([
          fetch('/v1/desktop/auth/capabilities', { method: 'POST', headers }),
          fetch('/v1/artifacts', { headers }),
        ])
        if (cancelled) return

        if (capRes.ok) {
          const data = await capRes.json() as { cloud?: UserProfile }
          setProfile(data.cloud ?? null)
        } else if (capRes.status === 401) {
          signOut()
          return
        }

        if (artRes.ok) {
          const data = await artRes.json() as { artifacts?: Array<{ artifact: { slug: string; title?: string; originalFileName?: string; sourceContentType?: string; renderedContentType?: string; createdAt: string; updatedAt: string; expiresAt?: string; byteSize: number }; shareUrl: string }> }
          setArtifacts(
            (data.artifacts ?? []).map((a) => ({
              slug: a.artifact.slug,
              title: a.artifact.title ?? undefined,
              originalFileName: a.artifact.originalFileName ?? undefined,
              sourceContentType: a.artifact.sourceContentType ?? undefined,
              renderedContentType: a.artifact.renderedContentType ?? undefined,
              shareUrl: a.shareUrl,
              createdAt: a.artifact.createdAt,
              updatedAt: a.artifact.updatedAt,
              expiresAt: a.artifact.expiresAt ?? undefined,
              byteSize: a.artifact.byteSize,
            }))
          )
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [tokens, signOut])

  // ── Not signed in ──
  if (!tokens) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-32 text-center">
          <Badge variant="copper-outline" className="h-auto gap-2 px-4 py-1.5 font-mono text-sm">
            <img src="/fabrica-logo_icon.png" alt="" className="h-5 w-5 object-contain block dark:hidden" />
            <img src="/fabrica-logo_icon_light.png" alt="" className="h-5 w-5 object-contain hidden dark:block" />
            <span>{t('badge')}</span>
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t('title')}</h1>
          <p className="max-w-xl text-lg text-[var(--text-muted)]">{t('signInPrompt')}</p>
          <button
            type="button"
            onClick={() => { window.location.href = '/login' }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-orange-950/50"
          >
            <KeyRound className="h-4 w-4" />
            {t('signIn')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    )
  }

  // ── Signed in ──
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 py-20 sm:px-6 sm:py-24">

        {/* ── Header ── */}
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8590C] to-[#FF8A3D] text-lg font-bold text-white shadow-lg shadow-orange-950/40">
              {initialsFrom(displayName, email)}
            </span>
            <div className="space-y-1.5">
              <Badge variant="copper-outline" className="h-auto gap-2 px-3 py-1 font-mono text-xs">
                <img src="/fabrica-logo_icon.png" alt="" className="h-4 w-4 object-contain block dark:hidden" />
                <img src="/fabrica-logo_icon_light.png" alt="" className="h-4 w-4 object-contain hidden dark:block" />
                <span>{t('badge')}</span>
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {greetingName ? t('greeting', { name: greetingName }) : t('welcome')}
              </h1>
              <p className="text-sm text-[var(--text-muted)]">{t('subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-5 py-2.5 text-sm font-medium transition-all hover:bg-[var(--overlay-10)]"
          >
            <LogOut className="h-4 w-4 text-orange-400" />
            {t('signOut')}
          </button>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/download"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 transition-all hover:border-orange-500/50 hover:bg-[var(--overlay-10)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Download className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t('downloadApp')}</span>
              <span className="block text-xs text-[var(--text-muted)]">{t('downloadAppDesc')}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs"
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 transition-all hover:border-orange-500/50 hover:bg-[var(--overlay-10)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{t('openDocs')}</span>
              <span className="block text-xs text-[var(--text-muted)]">{t('openDocsDesc')}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Loading / error ── */}
        {loading && (
          <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse rounded bg-[var(--overlay-10)] font-mono text-sm text-[var(--text-muted)]">
              {t('loading')}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]" />
              ))}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-500/40 bg-red-950/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-400">{t('authError')}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
            >
              {t('retry')}
            </button>
          </div>
        )}

        {/* ── Main content ── */}
        {!loading && !error && (
          <>
            {/* ── Profile ── */}
            <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-orange-400">
                <FileText className="h-5 w-5" />
                <h2 className="text-sm font-mono uppercase tracking-wider">{t('profile')}</h2>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-[var(--text-muted)]">{t('email')}</dt>
                  <dd className="truncate font-medium">{email || '—'}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[var(--text-muted)]">{t('name')}</dt>
                  <dd className="truncate font-medium">{displayName || '—'}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[var(--text-muted)]">{t('userId')}</dt>
                  <dd className="truncate font-mono text-xs">{profile?.userId || tokens.user_id || '—'}</dd>
                </div>
              </dl>
            </section>

            {/* ── Artifacts ── */}
            <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-400">
                  <FileText className="h-5 w-5" />
                  <h2 className="text-sm font-mono uppercase tracking-wider">{t('artifacts')}</h2>
                  {artifacts.length > 0 && (
                    <span className="ml-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
                      {artifacts.length}
                    </span>
                  )}
                </div>
              </div>

              {artifacts.length > 0 ? (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {artifacts.map((a) => (
                    <li
                      key={a.slug}
                      className="group flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] p-4 transition-colors hover:bg-[var(--overlay-10)]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.title || a.originalFileName || t('artifactUntitled')}</p>
                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            {formatBytes(a.byteSize)} · {a.sourceContentType} → {a.renderedContentType} · {t('created')} {formatDate(a.createdAt)}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            {t('updated')} {formatDate(a.updatedAt)}
                            {a.expiresAt && ` · ${t('expires')} ${formatDate(a.expiresAt)}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={a.shareUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--overlay-10)]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {t('open')}
                        </a>

                        <button
                          type="button"
                          onClick={() => copyShareLink(a.slug, a.shareUrl)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--overlay-10)]"
                        >
                          {copiedSlug === a.slug ? (
                            <><Check className="h-3 w-3 text-emerald-400" /> {t('copied')}</>
                          ) : (
                            <><Copy className="h-3 w-3" /> {t('copyLink')}</>
                          )}
                        </button>

                        {confirmDelete === a.slug ? (
                          <div className="flex items-center gap-1.5 ml-auto">
                            <button
                              type="button"
                              onClick={() => deleteArtifact(a.slug)}
                              disabled={deletingSlug === a.slug}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-60"
                            >
                              {deletingSlug === a.slug ? t('deleting') : t('confirmDelete')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(null)}
                              className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--overlay-10)]"
                            >
                              {t('cancel')}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(a.slug)}
                            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-red-500/40 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--overlay-5)] p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t('emptyArtifactsTitle')}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t('emptyArtifactsDesc')}</p>
                    </div>
                  </div>
                  <Link
                    href="/download"
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-500/40 px-4 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/10"
                  >
                    <Download className="h-4 w-4" />
                    {t('shareFirst')}
                  </Link>
                </div>
              )}
            </section>
          </>
        )}

        {/* ── Footer ── */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
          >
            {t('backHome')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
