'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter } from '@/src/i18n/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Copy, Github, KeyRound, Loader2, Lock, Mail, RefreshCw, Smartphone } from 'lucide-react'
import { ToastProvider, useToast } from '@/components/login/toast-provider'
import {
  resetPasswordForEmail,
  signInWithPassword,
  signUp,
  updateUser,
} from '@/lib/api/auth.api'
import { isSupabaseConfigured } from '@/lib/supabase-browser'
import { makeInviteCode, renderPairingSvg } from '@/components/login/pairing-code'

const TOKEN_KEY = 'fabrica_auth_tokens'
const APP_ID = 'ai.autoscalers.fabrica' as const

type Tokens = {
  access_token: string
  refresh_token: string
  expires_at?: string
  user_id?: string
  email?: string
}

type Mode =
  | { kind: 'idle' }
  | { kind: 'verifying' }
  | { kind: 'error'; message: string }
  | { kind: 'forgot' }
  | { kind: 'newPassword' }
  | { kind: 'pair' }

type EmailTab = 'signIn' | 'signUp'

function readTokensFromHash(): { tokens: Tokens | null; error: string | null } {
  if (typeof window === 'undefined') return { tokens: null, error: null }
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return { tokens: null, error: null }
  const params = new URLSearchParams(hash)
  const error = params.get('error')
  if (error) {
    return { tokens: null, error: params.get('error_description') || error }
  }
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (!access_token || !refresh_token) return { tokens: null, error: null }
  return {
    tokens: {
      access_token,
      refresh_token,
      expires_at: params.get('expires_at') ?? undefined,
      user_id: params.get('user_id') ?? undefined,
      email: params.get('email') ?? undefined,
    },
    error: null,
  }
}

function storeTokens(tokens: Tokens) {
  try {
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
  } catch {
    /* ignore */
  }
}

function clearFragment() {
  try {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  } catch {
    /* ignore */
  }
}

function clearHashError() {
  try {
    const url = new URL(window.location.href)
    url.searchParams.delete('error')
    url.searchParams.delete('error_description')
    window.history.replaceState(null, '', url.pathname + url.search)
  } catch {
    /* ignore */
  }
}

function readQuery(): {
  intent: 'web' | 'desktop' | 'pair' | null
  redirectTo: string | null
  state: string | null
  recovery: boolean
  error: string | null
  errorDescription: string | null
} {
  if (typeof window === 'undefined') {
    return {
      intent: null,
      redirectTo: null,
      state: null,
      recovery: false,
      error: null,
      errorDescription: null,
    }
  }
  const params = new URLSearchParams(window.location.search)
  const rawIntent = params.get('intent')
  const intent: 'web' | 'desktop' | 'pair' | null =
    rawIntent === 'desktop' || rawIntent === 'pair' ? rawIntent : rawIntent === 'web' ? 'web' : null
  return {
    intent,
    redirectTo: params.get('redirect_to'),
    state: params.get('state'),
    recovery: params.get('recovery') === 'true',
    error: params.get('error'),
    errorDescription: params.get('error_description'),
  }
}

function readFragmentType(): 'recovery' | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return null
  const params = new URLSearchParams(hash)
  return params.get('type') === 'recovery' ? 'recovery' : null
}

function tokensFromStorage(): Tokens | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY)
    return raw ? (JSON.parse(raw) as Tokens) : null
  } catch {
    return null
  }
}

function formatInviteToken(code: string): string {
  const groups = code.match(/.{1,4}/g) ?? [code]
  return groups.join('-')
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginPageInner />
    </ToastProvider>
  )
}

function LoginPageInner() {
  const t = useTranslations('login')
  const router = useRouter()
  const locale = useLocale()
  const { showToast } = useToast()

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })
  const [intent, setIntent] = useState<'web' | 'desktop' | 'pair' | null>(null)
  const [emailTab, setEmailTab] = useState<EmailTab>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [oauthProvider, setOauthProvider] = useState<'github' | 'google' | null>(null)
  const [oauthPending, setOauthPending] = useState(false)
  const [signedInTokens, setSignedInTokens] = useState<Tokens | null>(null)
  const hydrated = useRef(false)

  // ────────────── Auth hydration ──────────────
  useEffect(() => {
    const handle = () => {
      const query = readQuery()
      const fragmentRecovery = readFragmentType() === 'recovery'
      const recovery = query.recovery || fragmentRecovery
      setIntent(query.intent)

      // Returning from OAuth.
      const { tokens, error } = readTokensFromHash()
      if (tokens) {
        storeTokens(tokens)
        clearFragment()
        if (query.intent === 'desktop' && query.redirectTo) {
          const dest = new URL(query.redirectTo)
          if (query.state) dest.searchParams.set('state', query.state)
          window.location.replace(dest.toString())
          return
        }
        setMode({ kind: 'verifying' })
        router.replace('/dashboard')
        return
      }

      if (error || query.error) {
        const msg = error || query.errorDescription || query.error || ''
        if (msg) showToast(t('toast.oauthError'), 'error')
        clearHashError()
        // do not put transient OAuth errors into the full-page state
      }

      // Already signed in.
      const existing = tokensFromStorage()
      if (existing) {
        if (query.intent === 'pair') {
          setSignedInTokens(existing)
          setMode({ kind: 'pair' })
          hydrated.current = true
          return
        }
        if (query.intent === 'desktop' && query.redirectTo) {
          const dest = new URL(query.redirectTo)
          if (query.state) dest.searchParams.set('state', query.state)
          window.location.replace(dest.toString())
          return
        }
        router.replace('/dashboard')
        return
      }

      // Recovery flow on page load (and not signed in — Supabase session
      // is required for updateUser; the page is still rendered so the user
      // sees what to do).
      if (recovery) {
        setMode({ kind: 'newPassword' })
      }

      // Intent=pair without session — degrade to idle so the user can sign
      // in first; after sign-in we'll come back via the fragment branch.
      hydrated.current = true
    }
    queueMicrotask(handle)
  }, [router, showToast, t])

  // ────────────── OAuth ──────────────
  const startOAuth = useCallback(
    async (provider: 'github' | 'google') => {
      if (oauthPending) return
      setOauthProvider(provider)
      setOauthPending(true)
      const baseParams = new URLSearchParams({ locale, provider })
      if (intent === 'desktop') {
        const query = readQuery()
        if (query.redirectTo) baseParams.set('redirect_to', query.redirectTo)
        if (query.state) baseParams.set('state', query.state)
      }
      // Server-side authorize endpoint redirects 302 to the provider.
      window.location.href = `/api/auth/authorize?${baseParams.toString()}`
    },
    [intent, locale, oauthPending],
  )

  // ────────────── Email sign in / sign up ──────────────
  const submitEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedEmail = email.trim()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        showToast(t('email.invalidEmail'), 'error')
        return
      }
      if (password.length < 8) {
        showToast(t('email.passwordTooShort'), 'error')
        return
      }
      setOauthPending(true)
      const result =
        emailTab === 'signIn'
          ? await signInWithPassword({ email: trimmedEmail, password })
          : await signUp({ email: trimmedEmail, password })
      setOauthPending(false)

      if ('error' in result) {
        showToast(
          emailTab === 'signIn' ? t('toast.signInFailed') : t('toast.signUpFailed'),
          'error',
        )
        return
      }
      if (emailTab === 'signIn') {
        showToast(t('toast.signInSuccess'), 'success')
        setMode({ kind: 'verifying' })
        router.replace('/dashboard')
      } else {
        if (result.session) {
          showToast(t('toast.signInSuccess'), 'success')
          setMode({ kind: 'verifying' })
          router.replace('/dashboard')
        } else {
          showToast(t('toast.signUpSuccess'), 'success')
          setEmailTab('signIn')
        }
      }
    },
    [email, emailTab, password, showToast, t],
  )

  // ────────────── Forgot password ──────────────
  const submitForgot = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedEmail = forgotEmail.trim()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        showToast(t('email.invalidEmail'), 'error')
        return
      }
      setOauthPending(true)
      const redirectTo = `${window.location.origin}/${locale}/login?recovery=true`
      const result = await resetPasswordForEmail({ email: trimmedEmail, redirectTo })
      setOauthPending(false)
      if ('error' in result) {
        showToast(result.error, 'error')
        return
      }
      showToast(t('toast.recoverySent'), 'success')
    },
    [forgotEmail, locale, showToast, t],
  )

  // ────────────── New password ──────────────
  const submitNewPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (newPassword.length < 8) {
        showToast(t('email.passwordTooShort'), 'error')
        return
      }
      setOauthPending(true)
      const result = await updateUser({ password: newPassword })
      setOauthPending(false)
      if ('error' in result) {
        showToast(t('toast.updateFailed'), 'error')
        return
      }
      showToast(t('toast.recoverySuccess'), 'success')
      setMode({ kind: 'verifying' })
      router.replace('/dashboard')
    },
    [newPassword, router, showToast, t],
  )

  // ────────────── View states ──────────────
  if (mode.kind === 'verifying') {
    return <LoadingShell label={t('loading.signingIn')} />
  }

  if (mode.kind === 'error') {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t('errorTitle')}</h1>
            <p className="text-sm text-[var(--text-muted)]">
              {mode.message || t('errorBody')}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => startOAuth('github')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-300/70 bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-6 py-3 text-base font-semibold text-white shadow-xl shadow-orange-950/50 sm:w-auto"
            >
              <Github className="h-4 w-4" />
              {t('providers.github')}
            </button>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-6 py-3 text-base font-medium transition-all hover:bg-[var(--overlay-10)] sm:w-auto"
            >
              {t('footer.backHome')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (mode.kind === 'pair') {
    return <PairPanel tokens={signedInTokens!} t={t} showToast={showToast} />
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-16">
        <Card>
          <CardHeader subtitle={t('subtitle')} />
          <CardBody>
            {mode.kind === 'forgot' ? (
              <ForgotForm
                value={forgotEmail}
                onChange={setForgotEmail}
                onSubmit={submitForgot}
                onBack={() => setMode({ kind: 'idle' })}
                pending={oauthPending}
                t={t}
              />
            ) : mode.kind === 'newPassword' ? (
              <NewPasswordForm
                value={newPassword}
                onChange={setNewPassword}
                onSubmit={submitNewPassword}
                pending={oauthPending}
                t={t}
              />
            ) : (
              <>
                <ProviderStack
                  onOAuth={startOAuth}
                  pending={oauthPending}
                  pendingProvider={oauthProvider}
                  t={t}
                />
                <Divider label={t('divider')} />
                <EmailForm
                  tab={emailTab}
                  setTab={setEmailTab}
                  email={email}
                  password={password}
                  onEmail={setEmail}
                  onPassword={setPassword}
                  onForgot={() => {
                    setForgotEmail(email)
                    setMode({ kind: 'forgot' })
                  }}
                  onSubmit={submitEmail}
                  pending={oauthPending}
                  t={t}
                />
              </>
            )}
          </CardBody>
          <CardFooter t={t} />
        </Card>

        {!isSupabaseConfigured() && (
          <p className="mt-4 text-center text-xs text-amber-400/80">
            Supabase env vars are not set; sign-in is currently disabled.
          </p>
        )}
      </div>
    </main>
  )
}

// ─────────────────────── Card chrome ───────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-zinc-900/80 shadow-2xl shadow-black/40 backdrop-blur">
      {children}
    </div>
  )
}

function CardHeader({ subtitle }: { subtitle: string }) {
  const t = useTranslations('login')
  return (
    <div className="flex flex-col items-center gap-3 border-b border-[var(--border-faint)] bg-[var(--overlay-5)] px-6 py-7 text-center sm:px-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-zinc-950/70 shadow-inner shadow-black/40">
        <img
          src="/fabrica-logo_icon_light.png"
          alt=""
          className="h-10 w-10 object-contain"
        />
      </div>
      <h1 className="text-3xl font-extrabold leading-none tracking-[-0.03em] sm:text-4xl">
        <span>Fab</span>
        <span className="text-orange-400">.</span>
        <span>rica</span>
      </h1>
      <p className="max-w-xs text-xs uppercase tracking-[0.18em] text-orange-400/80">
        {t('badge')}
      </p>
      <p className="max-w-xs text-sm text-[var(--text-muted)]">{subtitle}</p>
    </div>
  )
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 px-6 py-7 sm:px-8">{children}</div>
}

function CardFooter({ t }: { t: ReturnType<typeof useTranslations<'login'>> }) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[var(--border-faint)] bg-[var(--overlay-5)] px-6 py-4 text-sm sm:flex-row sm:items-center sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-strong)]"
      >
        <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        {t('footer.backHome')}
      </Link>
      <p className="text-[var(--text-muted)]">
        {t('footer.newHere')}{' '}
        <Link
          href="/download"
          className="inline-flex items-center gap-1 font-medium text-orange-400 transition-colors hover:text-orange-300"
        >
          {t('footer.downloadLink')}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </p>
    </div>
  )
}

// ─────────────────────── Providers ───────────────────────

function ProviderStack({
  onOAuth,
  pending,
  pendingProvider,
  t,
}: {
  onOAuth: (p: 'github' | 'google') => void
  pending: boolean
  pendingProvider: 'github' | 'google' | null
  t: ReturnType<typeof useTranslations<'login'>>
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <ProviderButton
        provider="google"
        onClick={() => onOAuth('google')}
        pending={pending && pendingProvider === 'google'}
        t={t}
      />
      <ProviderButton
        provider="github"
        onClick={() => onOAuth('github')}
        pending={pending && pendingProvider === 'github'}
        t={t}
      />
    </div>
  )
}

function ProviderButton({
  provider,
  onClick,
  pending,
  t,
}: {
  provider: 'google' | 'github'
  onClick: () => void
  pending: boolean
  t: ReturnType<typeof useTranslations<'login'>>
}) {
  const p = provider
  const label = t(`providers.${p}`)
  const icon = p === 'google' ? <GoogleIcon /> : <Github className="h-4 w-4" />
  const bg = p === 'google' ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-900'
  const border = p === 'google' ? 'border-zinc-200' : 'border-zinc-800'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border ${border} ${bg} px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.84h5.52c-.24 1.32-1.68 3.84-5.52 3.84-3.3 0-6-2.76-6-6.18s2.7-6.18 6-6.18c1.92 0 3.18.84 3.9 1.5l2.64-2.52C17.04 3 14.7 2 12 2 6.84 2 2.64 6.18 2.64 11.52 2.64 16.86 6.84 21 12 21c5.16 0 9.36-3.6 9.36-9 0-.66-.06-1.2-.18-1.8H12z"
      />
    </svg>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-[var(--border-faint)]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--border-faint)]" />
    </div>
  )
}

// ─────────────────────── Email form ───────────────────────

function EmailForm({
  tab,
  setTab,
  email,
  password,
  onEmail,
  onPassword,
  onForgot,
  onSubmit,
  pending,
  t,
}: {
  tab: EmailTab
  setTab: (v: EmailTab) => void
  email: string
  password: string
  onEmail: (v: string) => void
  onPassword: (v: string) => void
  onForgot: () => void
  onSubmit: (e: React.FormEvent) => void
  pending: boolean
  t: ReturnType<typeof useTranslations<'login'>>
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--overlay-5)] p-0.5">
        <TabButton active={tab === 'signIn'} onClick={() => setTab('signIn')} t={t}>
          {t('email.tabSignIn')}
        </TabButton>
        <TabButton active={tab === 'signUp'} onClick={() => setTab('signUp')} t={t}>
          {t('email.tabSignUp')}
        </TabButton>
      </div>
      <Field
        label={t('email.emailLabel')}
        type="email"
        autoComplete="email"
        value={email}
        onChange={onEmail}
        icon={<Mail className="h-4 w-4 text-[var(--text-muted)]" />}
      />
      <div className="space-y-1">
        <Field
          label={t('email.passwordLabel')}
          type="password"
          autoComplete={tab === 'signIn' ? 'current-password' : 'new-password'}
          value={password}
          onChange={onPassword}
          icon={<Lock className="h-4 w-4 text-[var(--text-muted)]" />}
        />
        {tab === 'signIn' && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgot}
              className="text-xs font-medium text-orange-400 underline-offset-4 hover:underline"
            >
              {t('email.forgotLink')}
            </button>
          </div>
        )}
      </div>
      <SubmitButton pending={pending} label={tab === 'signIn' ? t('email.signInSubmit') : t('email.signUpSubmit')} />
    </form>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  t: ReturnType<typeof useTranslations<'login'>>
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ' +
        (active
          ? 'bg-zinc-950 text-orange-400 shadow-inner shadow-black/40'
          : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]')
      }
    >
      {children}
    </button>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  icon,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  icon?: React.ReactNode
}) {
  const id = useMemo(
    () => `login-field-${label.replace(/\s+/g, '-').toLowerCase()}`,
    [label],
  )
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 flex items-center px-3 text-[var(--text-muted)] ltr:left-0 rtl:right-0">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className={
            'block w-full rounded-lg border border-[var(--border-subtle)] bg-zinc-950/60 px-3 py-2 text-sm text-[var(--text-strong)] placeholder-[var(--text-subtle)] outline-none transition-colors focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/30 ' +
            (icon ? 'ltr:pl-9 rtl:pr-9' : '')
          }
        />
      </div>
    </div>
  )
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-orange-300/40 bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-950/40 transition-all hover:from-[#D04A09] hover:to-[#F07A2D] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{label}</span>
    </button>
  )
}

// ─────────────────────── Forgot password ───────────────────────

function ForgotForm({
  value,
  onChange,
  onSubmit,
  onBack,
  pending,
  t,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
  pending: boolean
  t: ReturnType<typeof useTranslations<'login'>>
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-950/20 p-3.5 text-sm text-orange-100">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
        <div className="space-y-0.5">
          <p className="font-semibold">{t('recovery.requestTitle')}</p>
          <p className="text-xs text-orange-200/80">{t('recovery.requestBody')}</p>
        </div>
      </div>
      <Field
        label={t('recovery.emailLabel')}
        type="email"
        autoComplete="email"
        value={value}
        onChange={onChange}
        icon={<Mail className="h-4 w-4 text-[var(--text-muted)]" />}
      />
      <SubmitButton pending={pending} label={t('recovery.submit')} />
      <button
        type="button"
        onClick={onBack}
        className="text-center text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-strong)]"
      >
        ← {t('footer.backHome')}
      </button>
    </form>
  )
}

// ─────────────────────── New password ───────────────────────

function NewPasswordForm({
  value,
  onChange,
  onSubmit,
  pending,
  t,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  pending: boolean
  t: ReturnType<typeof useTranslations<'login'>>
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-950/20 p-3.5 text-sm text-orange-100">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
        <div className="space-y-0.5">
          <p className="font-semibold">{t('recovery.newTitle')}</p>
          <p className="text-xs text-orange-200/80">{t('recovery.newBody')}</p>
        </div>
      </div>
      <Field
        label={t('recovery.passwordLabel')}
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={onChange}
        icon={<Lock className="h-4 w-4 text-[var(--text-muted)]" />}
      />
      <SubmitButton pending={pending} label={t('recovery.newSubmit')} />
    </form>
  )
}

// ─────────────────────── Pair panel ───────────────────────

function PairPanel({
  tokens,
  t,
  showToast,
}: {
  tokens: Tokens
  t: ReturnType<typeof useTranslations<'login'>>
  showToast: (message: string, tone?: 'success' | 'info' | 'error') => void
}) {
  const initialCode = useMemo(() => makeInviteCode(), [])
  const [code, setCode] = useState<string>(initialCode)
  const [svg, setSvg] = useState<string>(() => renderPairingSvg(initialCode))
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formatted = useMemo(() => formatInviteToken(code), [code])
  const deepLink = useMemo(
    () => `fabrica://pair?token=${encodeURIComponent(code)}&app=${encodeURIComponent(APP_ID)}`,
    [code],
  )

  const refresh = useCallback(async () => {
    let next: string | null = null
    let fetchError: string | null = null
    try {
      const res = await fetch('/v1/desktop/auth/invites?relayHostId=self', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      if (res.ok) {
        const data = (await res.json()) as { inviteToken?: string }
        if (data.inviteToken) next = data.inviteToken
      } else if (res.status !== 404) {
        fetchError = t('pair.error')
      }
    } catch {
      fetchError = t('pair.error')
    }
    if (next === null) next = makeInviteCode()
    setCode(next)
    setSvg(renderPairingSvg(next))
    setError(fetchError)
    setLoading(false)
  }, [t, tokens.access_token])

  // Pull the latest invite on mount; the desktop is the source of truth.
  // We use a ref-gated microtask deferral so no setState runs inside the
  // effect body itself (the eslint react-hooks rule dislikes that).
  const ranOnce = useRef(false)
  useEffect(() => {
    if (ranOnce.current) return
    ranOnce.current = true
    queueMicrotask(() => {
      setLoading(true)
      setError(null)
      void refresh()
    })
  }, [refresh])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      showToast(t('toast.copiedCode'), 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast(t('pair.error'), 'error')
    }
  }, [code, showToast, t])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-16">
        <Card>
          <CardHeader subtitle={t('pair.subtitle')} />
          <CardBody>
            <div className="flex flex-col items-center gap-4">
              <div
                className="rounded-2xl border border-[var(--border-subtle)] bg-zinc-950/70 p-4 shadow-inner shadow-black/40"
                dangerouslySetInnerHTML={{ __html: svg }}
                aria-label={t('pair.scanLabel')}
              />
              <p className="text-center text-xs text-[var(--text-muted)]">
                {t('pair.scanLabel')}
              </p>
              <div className="w-full space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  {t('pair.codeLabel')}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg border border-[var(--border-subtle)] bg-zinc-950/60 px-3 py-2 font-mono text-base font-bold tracking-[0.2em] text-orange-300">
                    {formatted}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-3 text-xs font-medium hover:bg-[var(--overlay-10)]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? t('pair.copied') : t('pair.copyCode')}
                  </button>
                </div>
              </div>
              <a
                href={deepLink}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-orange-300/40 bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-950/40 transition-all hover:from-[#D04A09] hover:to-[#F07A2D]"
              >
                <Smartphone className="h-4 w-4" />
                {t('pair.openApp')}
              </a>
              <p className="text-center text-xs text-[var(--text-muted)]">
                {t('pair.waitingHint')}
              </p>
              {error && (
                <p className="text-center text-xs text-amber-400/80">{error}</p>
              )}
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-strong)]"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                {loading ? t('pair.polling') : t('pair.waiting')}
              </button>
            </div>
          </CardBody>
          <CardFooter t={t} />
        </Card>
      </div>
    </main>
  )
}

// ─────────────────────── Loading shell ───────────────────────

function LoadingShell({ label }: { label: string }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--surface-page)] text-[var(--text-strong)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <span
          className="inline-block h-10 w-10 rounded-full border-2 border-[var(--border-subtle)] border-t-orange-400 animate-spin"
          aria-hidden
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange-400/90">
          {label}
        </p>
      </div>
    </main>
  )
}