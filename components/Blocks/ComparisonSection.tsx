'use client'

import React from 'react'
import { Check, X, Sparkles, Flame } from 'lucide-react'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

export const ComparisonSection = () => {
  const t = useTranslations('comparison')

  const rowKeys = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'] as const

  return (
    <section id="comparison" className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)]">
            {t('paragraph')}
          </p>
        </Reveal>

        <div className="mt-12 overflow-x-auto">
          <div className="min-w-[720px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] shadow-2xl overflow-hidden">
            <div className="grid grid-cols-12 bg-[var(--surface-panel)] border-b border-[var(--border-subtle)] p-4 text-xs font-mono">
              <div className="col-span-4 text-[var(--text-muted)] uppercase font-bold tracking-wider">
                {t('headerCapability')}
              </div>
              <div className="col-span-3 text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-4 w-4" />
                {t('headerFabrica')}
              </div>
              <div className="col-span-3 text-[var(--text-muted)] uppercase font-bold tracking-wider">
                {t('headerAlone')}
              </div>
              <div className="col-span-2 text-[var(--text-muted)] uppercase font-bold tracking-wider">
                {t('headerGeneric')}
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {rowKeys.map((key, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 items-center text-xs hover:bg-[var(--overlay-weak)] transition-colors"
                >
                  <div className="col-span-4 font-semibold text-[var(--text-strong)] pr-3">
                    {t(`rows.${key}.capability`)}
                  </div>

                  <div className="col-span-3 font-mono font-medium text-orange-300 flex items-center gap-2 pr-3">
                    <div className="p-1 rounded-full bg-orange-500/20 text-orange-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{t(`rows.${key}.fabrica`)}</span>
                  </div>

                  <div className="col-span-3 text-[var(--text-muted)] flex items-center gap-2 pr-3">
                    <div className="p-1 rounded-full bg-red-950/40 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <span>{t(`rows.${key}.alone`)}</span>
                  </div>

                  <div className="col-span-2 text-[var(--text-muted)] flex items-center gap-2">
                    <div className="p-1 rounded-full bg-red-950/40 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <span>{t(`rows.${key}.generic`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
