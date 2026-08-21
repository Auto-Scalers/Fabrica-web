'use client'

import React from 'react'
import Image from 'next/image'
import { Sparkles, CheckCircle2, ShieldCheck, GitBranch } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'

export const TurnSection = () => {
  const t = useTranslations('turn')

  return (
    <section className="relative py-20 lg:py-28 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      {/* Background molten forge glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: The Pivot Message */}
          <Reveal className="lg:col-span-6 space-y-6">
            <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('badge')}</span>
            </Badge>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
              {t('headline')}
              <span className="block text-2xl sm:text-4xl font-normal text-[var(--text-muted)] mt-2">
                {t('subheadline')}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
              {t('paragraph')}
            </p>

            {/* Core mechanical shifts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-[var(--text-strong)]">
                <CheckCircle2 className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-strong)]">{t('parallelLabel')}</strong> {t('parallelDesc')}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[var(--text-strong)]">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-strong)]">{t('budgetLabel')}</strong> {t('budgetDesc')}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[var(--text-strong)]">
                <GitBranch className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-strong)]">{t('reviewLabel')}</strong> {t('reviewDesc')}</span>
              </div>
            </div>
          </Reveal>

          {/* Right: Calm, high-fidelity command center workstation image */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--surface-panel)] group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/standalones/social-parallel-agents.png"
                alt={t('altCalm')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[var(--surface-panel)]/90 border border-[var(--border-subtle)] backdrop-blur-md">
              <p className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('statusLabel')}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {t('statusDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
