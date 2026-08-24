'use client'

import React from 'react'
import Image from 'next/image'
import {
  Layers,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  MessageSquare,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Reveal } from './Reveal'

export const PainSection = () => {
  const t = useTranslations('pain')

  const painPoints = [
    {
      icon: Layers,
      title: t('p1Title'),
      description: t('p1Desc'),
      metric: t('p1Metric'),
    },
    {
      icon: AlertTriangle,
      title: t('p2Title'),
      description: t('p2Desc'),
      metric: t('p2Metric'),
    },
    {
      icon: FileSpreadsheet,
      title: t('p3Title'),
      description: t('p3Desc'),
      metric: t('p3Metric'),
    },
    {
      icon: MessageSquare,
      title: t('p4Title'),
      description: t('p4Desc'),
      metric: t('p4Metric'),
    },
  ]

  return (
    <section id="pain" className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1 text-xs font-mono text-red-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
            {t('headline')}
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {t('paragraph')}
          </p>
        </Reveal>

        {/* Visual Scene & Pain Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Grounded Scene Image */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--surface-panel)] group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/standalones/pain-exhausted-developer-11pm.jpg"
                alt={t('altPain')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[var(--surface-panel)]/90 border border-[var(--border-subtle)] backdrop-blur-md">
              <p className="text-xs font-mono text-orange-400 font-semibold">
                {t('sceneLabel')}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {t('sceneDesc')}
              </p>
            </div>
          </div>

          {/* Pain Breakdown Cards */}
          <div className="lg:col-span-6 space-y-4">
            {painPoints.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-orange-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-strong)]">{item.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed pl-10">
                    {item.description}
                  </p>

                  <div className="pl-10 pt-2">
                    <span className="text-[11px] font-mono text-orange-400/90 bg-orange-950/30 border border-orange-500/20 px-2 py-0.5 rounded">
                      {item.metric}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
