'use client'

import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

export const FaqSection = () => {
  const t = useTranslations('faq')
  const [openValue, setOpenValue] = useState<string[]>(['0'])

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'] as const

  return (
    <section id="faq" className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[350px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)]">
            {t('paragraph')}
          </p>
        </Reveal>

        <div className="mt-12 space-y-3">
          <Accordion value={openValue} onValueChange={setOpenValue}>
            {faqKeys.map((key, idx) => {
              const isOpen = openValue.includes(String(idx))
              return (
                <AccordionItem
                  key={idx}
                  value={String(idx)}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all not-last:border-b-0',
                    isOpen
                      ? 'bg-[var(--surface-card)] border-orange-500/40 shadow-lg'
                      : 'bg-[var(--surface-panel)] border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                  )}
                >
                  <AccordionTrigger className="px-5 sm:px-6 py-5 sm:py-6 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:text-orange-400">
                    <span className="text-base sm:text-lg font-semibold text-[var(--text-strong)] pr-4">
                      {t(`items.${key}`)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    {t(`items.a${key.slice(1)}`)}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
