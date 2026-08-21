'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Monitor,
  Smartphone,
  Terminal,
  Apple,
  Sparkles,
  X,
  Copy,
  Check,
  Building2,
  Users,
  Send,
  Calendar,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Badge } from '@/components/ui/badge'

type PlatformId = 'mac' | 'win' | 'linux' | 'mobile'

interface PlatformOption {
  id: PlatformId
  label: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
}

interface ExistingSignup {
  email: string
  platform: string | null
  company: string | null
  team_size: string | null
  message: string | null
  use_case: string | null
}

const emptySubscribe = () => () => {}

export const FinalCta = () => {
  const t = useTranslations('cta')

  const PLATFORMS: PlatformOption[] = [
    { id: 'mac', label: t('platforms.mac'), detail: t('platforms.macDetail'), icon: Apple },
    { id: 'win', label: t('platforms.win'), detail: t('platforms.winDetail'), icon: Monitor },
    { id: 'linux', label: t('platforms.linux'), detail: t('platforms.linuxDetail'), icon: Terminal },
    { id: 'mobile', label: t('platforms.mobile'), detail: t('platforms.mobileDetail'), icon: Smartphone },
  ]

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [platformError, setPlatformError] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [existingUser, setExistingUser] = useState<ExistingSignup | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Enterprise details in modal
  const [company, setCompany] = useState('')
  const [teamSize, setTeamSize] = useState('2-10')
  const [useCase, setUseCase] = useState('agent_crews')
  const [message, setMessage] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [noteSent, setNoteSent] = useState(false)

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Listen for global open modal events
  useEffect(() => {
    const handleGlobalOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ email?: string; platform?: PlatformId }>
      if (customEvent.detail?.email) setEmail(customEvent.detail.email)
      if (customEvent.detail?.platform) setSelectedPlatform(customEvent.detail.platform)
      setIsModalOpen(true)
    }

    window.addEventListener('open-early-access', handleGlobalOpen)
    return () => window.removeEventListener('open-early-access', handleGlobalOpen)
  }, [])

  // Prevent background scrolling when modal is open and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const handleOpenModal = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const trimmedEmail = email.trim()
    const platform = selectedPlatform

    let hasError = false
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError(t('invalidEmail'))
      hasError = true
    } else {
      setError('')
    }
    if (!platform) {
      setPlatformError(t('selectPlatform'))
      hasError = true
    } else {
      setPlatformError('')
    }
    if (hasError) return

    setIsChecking(true)
    setSubmitted(true)

    try {
      // Check if this email already exists in Supabase
      const lookupRes = await fetch(`/api/early-access?email=${encodeURIComponent(trimmedEmail)}`)
      const lookup = await lookupRes.json()
      const record: ExistingSignup | null = lookup?.data

      if (record) {
        setExistingUser(record)
        if (record.platform) setSelectedPlatform(record.platform as PlatformId)
        setCompany(record.company || '')
        setTeamSize(record.team_size || '2-10')
        setUseCase(record.use_case || 'agent_crews')
        setMessage(record.message || '')
      } else {
        setExistingUser(null)
        // Create a new record in the background
        await fetch('/api/early-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            platform,
            referrer: typeof window !== 'undefined' ? window.location.href : '',
          }),
        }).catch((err) => {
          console.warn('Background early access sync:', err)
        })
      }
    } catch (err) {
      console.warn('Early access lookup failed:', err)
      setExistingUser(null)
    } finally {
      setIsChecking(false)
      setIsModalOpen(true)
    }
  }

  const handleSendEnterpriseNote = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingNote(true)

    try {
      await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim() || 'unspecified@founder.modal',
          platform: selectedPlatform || 'mac',
          company,
          team_size: teamSize,
          use_case: useCase,
          message,
          referrer: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      setNoteSent(true)
    } catch (err) {
      console.error('Failed to update note:', err)
    } finally {
      setSavingNote(false)
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = `${window.location.origin}?ref=${encodeURIComponent(email || 'early-access')}`
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const platformDisplay = selectedPlatform ? selectedPlatform.toUpperCase() : 'YOUR PLATFORM'

  return (
    <section id="waitlist" className="fabrica-cta relative pt-4 sm:pt-6 pb-72 sm:pb-96 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 bg-white/20 dark:bg-[#0B0C12]/75 pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-64 sm:h-80 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/fabrica-buttom-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Background molten forge glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <Badge variant="copper-outline" className="h-auto gap-2 px-4 py-1.5 font-mono text-sm">
          <img
            src="/fabrica-logo_icon.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
          <span>{t('badge')}</span>
        </Badge>

        {/* Headline */}
        <h2 className="text-5xl sm:text-7xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
          {t('headline')}
        </h2>

        <p className="text-lg sm:text-2xl text-orange-700 dark:text-orange-200 max-w-2xl mx-auto leading-relaxed">
          {t('paragraph')}
        </p>

        {/* Enhanced Platform Selector */}
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
            {t('choosePlatform')} <span className="text-orange-400">{t('required')}</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PLATFORMS.map((p) => {
              const active = selectedPlatform === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlatform(p.id)
                    setPlatformError('')
                  }}
                  className={`relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                    active
                      ? 'border-orange-500/60 bg-orange-500/10 text-orange-300'
                      : 'border-[var(--border-subtle)] bg-[var(--overlay-weak)] text-[var(--text-muted)] hover:border-[var(--border-subtle)] hover:text-[var(--text-strong)]'
                  }`}
                >
                  <p.icon className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-mono font-semibold">{p.label}</p>
                    <p className="text-xs opacity-70">{p.detail}</p>
                  </div>
                  {active && (
                    <span className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className="h-4 w-4 text-orange-400" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {platformError && (
            <p className="text-xs text-red-400 font-mono">{platformError}</p>
          )}
        </div>

        {/* Interactive Waitlist Form */}
        <div className="max-w-md mx-auto pt-2">
          {submitted ? (
            <div className="p-6 rounded-2xl bg-[var(--surface-card)] border border-emerald-500/40 text-center space-y-4 shadow-2xl">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="h-5 w-5" />
                <span>
                  {existingUser
                    ? t('foundProfile')
                    : t('onList')}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {existingUser ? (
                  <>
                    Your profile for <span className="text-[var(--text-strong)] font-mono font-semibold">{email || 'your account'}</span> is saved. Review or update your details below.
                  </>
                ) : (
                  <>
                    We have registered <span className="text-[var(--text-strong)] font-mono font-semibold">{email || 'your account'}</span> for <strong className="text-orange-400 font-mono uppercase">{platformDisplay}</strong> priority access.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={handleOpenModal}
                className="w-full py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{existingUser ? t('viewProfile') : t('viewPass')}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleOpenModal} noValidate className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder={t('enterEmail')}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-strong)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <ShimmerButton
                  type="submit"
                  disabled={isChecking}
                  shimmerColor="#FFD0A6"
                  borderRadius="12px"
                  background="linear-gradient(90deg, #E8590C, #FF8A3D)"
                  className="px-6 py-3.5 text-sm font-semibold shadow-xl shadow-orange-950/50 disabled:opacity-60 shrink-0"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('checking')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('getEarlyAccess')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </ShimmerButton>
              </div>

              {error && <p className="text-xs text-red-400 text-left pl-2">{error}</p>}

              <p className="text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-center gap-2 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('trustText')}</span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Pop-Up Modal Window Attached Directly to Document Body */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] p-5 sm:p-7 shadow-2xl shadow-orange-950/80 z-10 overflow-hidden text-left"
                >
                  {/* Decorative glow lights */}
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--overlay-10)] transition-colors cursor-pointer z-20"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Modal Body */}
                  <div className="overflow-y-auto pr-1 space-y-6">
                    {/* Header Confirmation */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{existingUser ? t('modal.profileSaved') : t('modal.requestReceived')}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-strong)] tracking-tight">
                        {existingUser ? t('modal.welcomeBack') : t('modal.requestTitle')}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        {existingUser ? (
                          <>
                            We found your existing registration for{' '}
                            <span className="text-[var(--text-strong)] font-mono font-bold">{email || 'your email'}</span> on{' '}
                            <span className="text-orange-400 font-mono font-bold uppercase">{platformDisplay}</span>.
                            {t('modal.editProfile')}
                          </>
                        ) : (
                          <>
                            {t('modal.reviewApplication')}{' '}
                            <span className="text-[var(--text-strong)] font-mono font-bold">{email || 'your email'}</span> with your custom desktop installer invite and onboarding key for{' '}
                            <span className="text-orange-400 font-mono font-bold uppercase">{platformDisplay}</span>.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Priority Referral Link */}
                    <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--text-muted)]">{t('modal.inviteLink')}</span>
                        <span className="text-orange-400 font-bold">{t('modal.cohort')}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {t('modal.shareLink')}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-[var(--border-subtle)] text-xs font-mono text-zinc-300 truncate">
                          {typeof window !== 'undefined'
                            ? `${window.location.origin}?ref=${encodeURIComponent(email || 'early-access')}`
                            : `https://fabric.dev/?ref=${email}`}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3.5 py-2 rounded-lg bg-[var(--overlay-10)] hover:bg-white/15 border border-[var(--border-subtle)] text-[var(--text-strong)] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{t('modal.copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                              <span>{t('modal.copy')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Optional Enterprise Profile & Founder Note */}
                    <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] p-4 sm:p-5 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[var(--text-strong)] font-semibold text-xs sm:text-sm">
                          <Building2 className="h-4 w-4 text-orange-400" />
                          <span>{existingUser ? t('modal.yourProfile') : t('modal.fastTrack')}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {existingUser
                            ? t('modal.updateSetup')
                            : t('modal.tellUs')}
                        </p>
                      </div>

                      {noteSent ? (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{existingUser ? t('modal.profileUpdated') : t('modal.noteSent')}</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSendEnterpriseNote} className="space-y-3.5 text-xs">
                          {/* Work Email in Modal */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                              {t('modal.workEmail')}
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@company.com"
                              className="w-full px-3 py-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-strong)] placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Company Name */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                                {t('modal.company')}
                              </label>
                              <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g. Autonomous Labs, Acme"
                                className="w-full px-3 py-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-strong)] placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* Team Size */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                                {t('modal.teamSize')}
                              </label>
                              <select
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-strong)] focus:outline-none focus:border-orange-500"
                              >
                                <option value="solo">{t('modal.solo')}</option>
                                <option value="2-10">{t('modal.team210')}</option>
                                <option value="11-50">{t('modal.team1150')}</option>
                                <option value="50+">{t('modal.team50plus')}</option>
                              </select>
                            </div>
                          </div>

                          {/* Primary Use Case */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                              {t('modal.useCase')}
                            </label>
                            <select
                              value={useCase}
                              onChange={(e) => setUseCase(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-strong)] focus:outline-none focus:border-orange-500"
                            >
                              <option value="agent_crews">{t('modal.useCrews')}</option>
                              <option value="mobile_oversight">{t('modal.useMobile')}</option>
                              <option value="cost_guardrails">{t('modal.useCost')}</option>
                              <option value="custom_daemons">{t('modal.useDaemons')}</option>
                            </select>
                          </div>

                          {/* Message / Specific Requirements */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                              {t('modal.note')}
                            </label>
                            <textarea
                              rows={3}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder={t('modal.notePlaceholder')}
                              className="w-full px-3 py-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-strong)] placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={savingNote}
                            className="w-full py-2.5 rounded-lg bg-[var(--overlay-10)] hover:bg-white/15 border border-[var(--border-subtle)] text-[var(--text-strong)] font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                          >
                            {savingNote ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>{existingUser ? t('modal.saving') : t('modal.updating')}</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5 text-orange-400" />
                                <span>{existingUser ? t('modal.saveChanges') : t('modal.sendNote')}</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Direct Community & Founder Booking */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <a
                        href="https://discord.com"
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-[var(--overlay-5)] hover:bg-[var(--overlay-10)] border border-[var(--border-subtle)] flex items-center justify-between text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-400" />
                          <span>{t('modal.discord')}</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href="mailto:founders@fabric.dev?subject=Enterprise%20Early%20Access%20Inquiry"
                        className="p-3 rounded-xl bg-[var(--overlay-5)] hover:bg-[var(--overlay-10)] border border-[var(--border-subtle)] flex items-center justify-between text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-400" />
                          <span>{t('modal.emailTeam')}</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Close Button */}
                    <ShimmerButton
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      shimmerColor="#FFD0A6"
                      borderRadius="12px"
                      background="linear-gradient(90deg, #E8590C, #FF8A3D)"
                      className="w-full py-3 text-xs font-semibold shadow-lg shadow-orange-950/50"
                    >
                      {t('modal.doneClose')}
                    </ShimmerButton>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  )
}
export default FinalCta