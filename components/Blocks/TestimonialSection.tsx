'use client'

import React from 'react'
import { Quote, UserCheck, User, Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Marquee } from '@/components/ui/marquee'
import { Reveal } from './Reveal'
import { useTranslations } from 'next-intl'

export const TestimonialSection = () => {
  const t = useTranslations('testimonials')

  const testimonialKeys = ['t1', 't2', 't3'] as const

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <UserCheck className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)]">
            {t('paragraph')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialKeys.map((key, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] flex flex-col justify-between space-y-6 hover:border-orange-500/30 transition-all"
            >
              <div className="space-y-4">
                <Quote className="h-6 w-6 text-orange-400 opacity-60" />
                <p className="text-sm text-[var(--text-strong)] leading-relaxed italic">
                  &ldquo;{t(`${key}.quote`)}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar size="lg" className="border border-[var(--border-subtle)] bg-[var(--overlay-5)]">
                  <AvatarFallback className="bg-orange-950/40 text-orange-400">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[var(--text-strong)]">{t(`${key}.role`)}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{t(`${key}.focus`)}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-faint)]">
                <div className="text-xs font-mono text-orange-400 font-semibold">{t(`${key}.metric`)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden command-frame border-y border-[var(--border-faint)] bg-[var(--surface-section)] py-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--surface-section)] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--surface-section)] to-transparent z-10" />
          <Marquee className="[--duration:45s] [--gap:2.5rem]" pauseOnHover>
            {[...testimonialKeys, ...testimonialKeys].map((key, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-xs font-mono text-[var(--text-muted)] whitespace-nowrap"
              >
                <Star className="h-3.5 w-3.5 text-orange-400" />
                <span className="font-semibold text-[var(--text-strong)]">{t(`${key}.metric`)}</span>
                <span>&mdash; {t(`${key}.focus`)}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
