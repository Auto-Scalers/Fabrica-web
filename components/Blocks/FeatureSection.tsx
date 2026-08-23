'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  GitBranch,
  DollarSign,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export const WhyFabrica = () => {
  const t = useTranslations('features')

  const pillarKeys = ['crews', 'worktrees', 'budget', 'gates', 'vault', 'autonomy', 'adaptive'] as const
  const pillarIcons: Record<string, React.ElementType> = {
    crews: Users,
    worktrees: GitBranch,
    budget: DollarSign,
    gates: ShieldCheck,
    vault: KeyRound,
    autonomy: Smartphone,
    adaptive: Sparkles,
  }

  return (
    <section id="product-pillars" className="relative py-20 lg:py-28 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {t('paragraph')}
          </p>
        </motion.div>

        {/* Standalone architecture image + under-the-hood text (two-column) */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Standalone architecture image */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--surface-panel)] group order-1">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/standalones/hands-on-architecture.jpg"
                alt={t('architecture.title')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right: Under-the-hood architecture text */}
          <motion.div
            className="space-y-5 order-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-strong)] tracking-tight leading-tight">
              {t('architecture.title')}
            </h3>

            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              {t('architecture.desc')}
            </p>

            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
                  <Terminal className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-strong)]">{t('architecture.point1Title')}</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('architecture.point1Desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-strong)]">{t('architecture.point2Title')}</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('architecture.point2Desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-strong)]">{t('architecture.point3Title')}</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('architecture.point3Desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillarKeys.map((key, index) => {
            const Icon = pillarIcons[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative group p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-950/20 transition-all space-y-3"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] bg-[var(--overlay-5)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {t(`pillars.${key}.badge`)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-strong)] group-hover:text-orange-300 transition-colors">
                  {t(`pillars.${key}.title`)}
                </h3>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t(`pillars.${key}.desc`)}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyFabrica
