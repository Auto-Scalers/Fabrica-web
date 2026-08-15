'use client'

import React from 'react'
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
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export const WhyFabrica = () => {
  const t = useTranslations('features')

  const pillarKeys = ['crews', 'worktrees', 'budget', 'gates', 'vault', 'autonomy'] as const
  const pillarIcons: Record<string, React.ElementType> = {
    crews: Users,
    worktrees: GitBranch,
    budget: DollarSign,
    gates: ShieldCheck,
    vault: KeyRound,
    autonomy: Smartphone,
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
