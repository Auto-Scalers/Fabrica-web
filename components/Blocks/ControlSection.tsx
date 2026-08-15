'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  DollarSign,
  Sliders,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

export const ControlSection = () => {
  const t = useTranslations('control')
  const [gateStatus, setGateStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [selectedGateType, setSelectedGateType] = useState<'payment' | 'deploy' | 'social'>('payment')
  const [autonomyValue, setAutonomyValue] = useState(65)
  const monthlyCap = 150
  const currentSpend = 64.8

  const gateDetails = {
    payment: {
      id: t('gates.payment.id'),
      title: t('gates.payment.title'),
      risk: t('gates.payment.risk'),
      desc: t('gates.payment.desc'),
      agent: t('gates.payment.agent'),
      worktree: t('gates.payment.worktree'),
    },
    deploy: {
      id: t('gates.deploy.id'),
      title: t('gates.deploy.title'),
      risk: t('gates.deploy.risk'),
      desc: t('gates.deploy.desc'),
      agent: t('gates.deploy.agent'),
      worktree: t('gates.deploy.worktree'),
    },
    social: {
      id: t('gates.social.id'),
      title: t('gates.social.title'),
      risk: t('gates.social.risk'),
      desc: t('gates.social.desc'),
      agent: t('gates.social.agent'),
      worktree: t('gates.social.worktree'),
    },
  }

  const currentGate = gateDetails[selectedGateType]

  return (
    <section id="controls" className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[400px] bg-blue-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-3xl space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {t('paragraph')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Interactive Field Ops & Approval Gates */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-strong)]">{t('card1.title')}</h3>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{t('card1.subtitle')}</span>
                  </div>
                </div>

                <span
                  className={cn(
                    'text-xs font-mono px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all',
                    gateStatus === 'approved' && 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40',
                    gateStatus === 'rejected' && 'bg-red-950/50 text-red-400 border-red-500/40',
                    gateStatus === 'pending' && 'bg-amber-950/50 text-amber-400 border-amber-500/40'
                  )}
                >
                  {gateStatus === 'approved' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  {gateStatus === 'rejected' && <XCircle className="h-3.5 w-3.5 text-red-400" />}
                  {gateStatus === 'pending' && <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />}
                  <span>{gateStatus.toUpperCase()}</span>
                </span>
              </div>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t('card1.desc')}
              </p>

              <div className="flex gap-2 pt-1 font-mono text-xs">
                {(['payment', 'deploy', 'social'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedGateType(type)
                      setGateStatus('pending')
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-lg border text-[11px] transition-all',
                      selectedGateType === type
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 font-bold'
                        : 'bg-[var(--overlay-5)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-strong)]'
                    )}
                  >
                    {type === 'payment' && t('card1.paymentGate')}
                    {type === 'deploy' && t('card1.deployGate')}
                    {type === 'social' && t('card1.socialGate')}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px] pb-2 border-b border-[var(--border-faint)]">
                <span>{currentGate.id}</span>
                <span className="text-amber-400 font-bold">{currentGate.risk}</span>
              </div>

              <div className="text-[var(--text-strong)] font-sans text-xs font-semibold">
                {currentGate.title}
              </div>

              <p className="text-[var(--text-muted)] text-[11px] leading-relaxed font-sans">
                {currentGate.desc}
              </p>

              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                <span>Agent: <strong className="text-orange-400">{currentGate.agent}</strong></span>
                <span className="text-blue-400">{currentGate.worktree}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setGateStatus('approved')}
                  className={cn(
                    'py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5',
                    gateStatus === 'approved'
                      ? 'bg-emerald-600 text-[var(--text-strong)] shadow-lg shadow-emerald-950/40'
                      : 'bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-500/30'
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t('card1.approve')}</span>
                </button>

                <button
                  onClick={() => setGateStatus('rejected')}
                  className={cn(
                    'py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5',
                    gateStatus === 'rejected'
                      ? 'bg-red-600 text-[var(--text-strong)] shadow-lg shadow-red-950/40'
                      : 'bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/30'
                  )}
                >
                  <XCircle className="h-4 w-4" />
                  <span>{t('card1.reject')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Client-Side Credential Vault */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-strong)]">{t('card2.title')}</h3>
                    <span className="text-[11px] font-mono text-emerald-400">{t('card2.subtitle')}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  AES-256 GCM
                </span>
              </div>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t('card2.desc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-faint)] text-[var(--text-muted)]">
                <span>{t('card2.keystore')}</span>
                <span className="text-emerald-400">{t('card2.encrypted')}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-strong)]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t('card2.openaiKeys')}
                </span>
                <span className="text-[var(--text-muted)]">{t('card2.storedLocally')}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-strong)]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t('card2.gitKeys')}
                </span>
                <span className="text-[var(--text-muted)]">{t('card2.isolatedPerRepo')}</span>
              </div>

              <div className="flex items-center justify-between text-[var(--text-strong)]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t('card2.stripeKeys')}
                </span>
                <span className="text-amber-400">{t('card2.gatedApproval')}</span>
              </div>

              <div className="pt-2 border-t border-[var(--border-faint)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>{t('card2.keyRotation')}</span>
                <span className="text-emerald-400">{t('card2.zeroEgress')}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Hard Budget Limits & Real-Time Auto-Stops */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-strong)]">{t('card3.title')}</h3>
                    <span className="text-[11px] font-mono text-orange-400">{t('card3.subtitle')}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  REAL-TIME GUARD
                </span>
              </div>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t('card3.desc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-muted)]">{t('card3.spendVsCap')}</span>
                <span className="text-[var(--text-strong)] font-bold">
                  ${currentSpend.toFixed(2)} / ${monthlyCap.toFixed(2)}
                </span>
              </div>

              <div className="h-2.5 w-full bg-[var(--overlay-10)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(currentSpend / monthlyCap) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
                <span>{(100 - (currentSpend / monthlyCap) * 100).toFixed(1)}% {t('card3.runway')}</span>
                <span className="text-emerald-400">{t('card3.autoKill')}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Dynamic Autonomy Spectrum & Priority Matrix */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <Sliders className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-strong)]">{t('card4.title')}</h3>
                    <span className="text-[11px] font-mono text-blue-400">{t('card4.subtitle')}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-orange-400 font-bold">
                  {autonomyValue < 35
                    ? t('card4.strict')
                    : autonomyValue < 70
                    ? t('card4.guided')
                    : t('card4.fullAutonomy')}
                </span>
              </div>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t('card4.desc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-panel)] border border-[var(--border-subtle)] space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={autonomyValue}
                onChange={(e) => setAutonomyValue(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-[var(--overlay-10)] rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span>{t('card4.stepByStep')}</span>
                <span>{t('card4.guidedAutonomy')}</span>
                <span>{t('card4.continuous')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
