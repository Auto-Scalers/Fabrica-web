'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
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

type PlatformId = 'mac' | 'win' | 'linux' | 'mobile'

interface PlatformOption {
  id: PlatformId
  label: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
}

const PLATFORMS: PlatformOption[] = [
  { id: 'mac', label: 'macOS', detail: 'Apple Silicon & Intel', icon: Apple },
  { id: 'win', label: 'Windows', detail: 'x64 / ARM64', icon: Monitor },
  { id: 'linux', label: 'Linux', detail: '.AppImage / .deb', icon: Terminal },
  { id: 'mobile', label: 'Mobile', detail: 'iOS / Android Companion', icon: Smartphone },
]

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
      setError('Please enter a valid work email.')
      hasError = true
    } else {
      setError('')
    }
    if (!platform) {
      setPlatformError('Please select your platform to continue.')
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
    <section id="waitlist" className="relative py-24 lg:py-32 border-t border-white/5 bg-[#090A0F] overflow-hidden scroll-mt-16">
      {/* Background molten forge glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs font-mono text-orange-400">
          <img
            src="/fabrica-logo_icon.svg"
            alt=""
            className="h-4 w-4 object-contain"
          />
          <span>JOIN THE FOUNDING COHORT</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          The Next AI Exit.
          <span className="block text-2xl sm:text-4xl font-normal text-orange-400 mt-3">
            Close the tabs. Direct the crew.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-[#8A8A94] max-w-2xl mx-auto leading-relaxed">
          Stop being the founder, developer, copywriter, and analyst all at once. Experience parallel isolated execution on your desktop with mobile oversight and hard financial guardrails.
        </p>

        {/* Enhanced Platform Selector */}
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-[#8A8A94]">
            Choose your platform <span className="text-orange-400">*</span>
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
                      : 'border-white/10 bg-white/[0.03] text-[#8A8A94] hover:border-white/25 hover:text-white'
                  }`}
                >
                  <p.icon className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-mono font-semibold">{p.label}</p>
                    <p className="text-[10px] opacity-70">{p.detail}</p>
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
            <div className="p-6 rounded-2xl bg-[#141624] border border-emerald-500/40 text-center space-y-4 shadow-2xl">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="h-5 w-5" />
                <span>
                  {existingUser
                    ? 'We found your existing profile!'
                    : 'You are on the priority access list!'}
                </span>
              </div>
              <p className="text-xs text-[#8A8A94]">
                {existingUser ? (
                  <>
                    Your profile for <span className="text-white font-mono font-semibold">{email || 'your account'}</span> is saved. Review or update your details below.
                  </>
                ) : (
                  <>
                    We have registered <span className="text-white font-mono font-semibold">{email || 'your account'}</span> for <strong className="text-orange-400 font-mono uppercase">{platformDisplay}</strong> priority access.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={handleOpenModal}
                className="w-full py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{existingUser ? 'View & Update Your Profile' : 'View Founding Pass & Custom Setup Options'}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleOpenModal} noValidate className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A94]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Enter your work email..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#11121B] border border-white/15 text-sm text-white placeholder:text-[#8A8A94] focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChecking}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] text-white font-semibold text-sm shadow-xl shadow-orange-950/50 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Early Access</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {error && <p className="text-xs text-red-400 text-left pl-2">{error}</p>}

              <p className="text-[11px] font-mono text-[#8A8A94] flex items-center justify-center gap-2 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero Cloud Key Storage • Free tier available • BYOK supported</span>
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
                  className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0D0E17] border border-white/20 p-5 sm:p-7 shadow-2xl shadow-orange-950/80 z-10 overflow-hidden text-left"
                >
                  {/* Decorative glow lights */}
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-[#8A8A94] hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-20"
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
                        <span>{existingUser ? 'YOUR PROFILE IS SAVED' : 'EARLY ACCESS REQUEST RECEIVED'}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {existingUser ? 'Welcome back. Update your details.' : "We've received your request!"}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8A8A94] leading-relaxed">
                        {existingUser ? (
                          <>
                            We found your existing registration for{' '}
                            <span className="text-white font-mono font-bold">{email || 'your email'}</span> on{' '}
                            <span className="text-orange-400 font-mono font-bold uppercase">{platformDisplay}</span>.
                            Edit anything below and your changes will be saved automatically.
                          </>
                        ) : (
                          <>
                            Our founding engineering team will review your application and reach out directly to{' '}
                            <span className="text-white font-mono font-bold">{email || 'your email'}</span> with your custom desktop installer invite and onboarding key for{' '}
                            <span className="text-orange-400 font-mono font-bold uppercase">{platformDisplay}</span>.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Priority Referral Link */}
                    <div className="rounded-xl bg-[#141624] border border-white/10 p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#8A8A94]">FAST-TRACK INVITE LINK</span>
                        <span className="text-orange-400 font-bold">#FAB-COHORT-2026</span>
                      </div>
                      <p className="text-[11px] text-[#8A8A94]">
                        Share your link with colleagues or other developers to move up the rollout schedule:
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-zinc-300 truncate">
                          {typeof window !== 'undefined'
                            ? `${window.location.origin}?ref=${encodeURIComponent(email || 'early-access')}`
                            : `https://fabric.dev/?ref=${email}`}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-[#8A8A94]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Optional Enterprise Profile & Founder Note */}
                    <div className="rounded-xl bg-[#141624] border border-white/10 p-4 sm:p-5 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                          <Building2 className="h-4 w-4 text-orange-400" />
                          <span>{existingUser ? 'Your Profile (Editable)' : 'Fast-Track Your Access (Optional)'}</span>
                        </div>
                        <p className="text-[11px] text-[#8A8A94]">
                          {existingUser
                            ? 'Update your setup and team requirements below.'
                            : 'Tell us a bit about your setup and team requirements to help us tailor your environment:'}
                        </p>
                      </div>

                      {noteSent ? (
                        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{existingUser ? 'Your profile has been updated!' : 'Note sent to the founding engineers! We have flagged your priority onboarding.'}</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSendEnterpriseNote} className="space-y-3.5 text-xs">
                          {/* Work Email in Modal */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[#8A8A94] uppercase tracking-wider block">
                              Work Email
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@company.com"
                              className="w-full px-3 py-2 rounded-lg bg-[#0F101A] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Company Name */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[#8A8A94] uppercase tracking-wider block">
                                Company / Organization
                              </label>
                              <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g. Autonomous Labs, Acme"
                                className="w-full px-3 py-2 rounded-lg bg-[#0F101A] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* Team Size */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[#8A8A94] uppercase tracking-wider block">
                                Team Size
                              </label>
                              <select
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-[#0F101A] border border-white/10 text-white focus:outline-none focus:border-orange-500"
                              >
                                <option value="solo">Solo Hacker / Independent Builder</option>
                                <option value="2-10">2 – 10 Engineers</option>
                                <option value="11-50">11 – 50 Engineers</option>
                                <option value="50+">50+ Enterprise Team</option>
                              </select>
                            </div>
                          </div>

                          {/* Primary Use Case */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[#8A8A94] uppercase tracking-wider block">
                              Primary Use Case
                            </label>
                            <select
                              value={useCase}
                              onChange={(e) => setUseCase(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[#0F101A] border border-white/10 text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="agent_crews">Parallel Multi-Agent Crews & Worktrees</option>
                              <option value="mobile_oversight">Mobile Remote Oversight & Slack Approvals</option>
                              <option value="cost_guardrails">Hard Financial Guardrails & Local Execution</option>
                              <option value="custom_daemons">Enterprise Daemon & CI/CD Tooling</option>
                            </select>
                          </div>

                          {/* Message / Specific Requirements */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono text-[#8A8A94] uppercase tracking-wider block">
                              Send a Note / Specific Requirements
                            </label>
                            <textarea
                              rows={3}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Tell us what you're building, model preferences (Claude 3.7/Gemini 2.5/Ollama), or any specific security/compliance needs..."
                              className="w-full px-3 py-2 rounded-lg bg-[#0F101A] border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={savingNote}
                            className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                          >
                            {savingNote ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>{existingUser ? 'Saving Changes...' : 'Updating Priority...'}</span>
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5 text-orange-400" />
                                <span>{existingUser ? 'Save Changes to My Profile' : 'Send Note to Founding Team'}</span>
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
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-[#8A8A94] hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-indigo-400" />
                          <span>Join Discord Community</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href="mailto:founders@fabric.dev?subject=Enterprise%20Early%20Access%20Inquiry"
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-[#8A8A94] hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-400" />
                          <span>Email Founder Team</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] text-white font-semibold text-xs shadow-lg shadow-orange-950/50 hover:brightness-110 active:scale-98 transition-all cursor-pointer text-center"
                    >
                      Done & Close
                    </button>
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