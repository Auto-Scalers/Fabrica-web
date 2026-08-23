'use client'

import React from 'react'
import {
  Search,
  Megaphone,
  TrendingUp,
  Workflow,
  Webhook,
  Boxes,
} from 'lucide-react'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

export const BeyondCodeSection = () => {
  const t = useTranslations('beyond')

  const pluginKeys = ['market', 'outreach', 'financial', 'custom', 'n8n'] as const
  const pluginIcons: Record<string, React.ElementType> = {
    market: Search,
    outreach: Megaphone,
    financial: TrendingUp,
    custom: Workflow,
    n8n: Webhook,
  }

  return (
    <section className="relative py-20 lg:py-28 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[400px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-3xl space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <Boxes className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {t('paragraph')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {pluginKeys.map((key) => {
            const Icon = pluginIcons[key]
            return (
              <div
                key={key}
                className="p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-orange-500/30 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider bg-[var(--overlay-5)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {t(`plugins.${key}.badge`)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-strong)] group-hover:text-orange-300 transition-colors">
                  {t(`plugins.${key}.title`)}
                </h3>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t(`plugins.${key}.desc`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
