'use client'

import React from 'react'
import {
  Search,
  Megaphone,
  TrendingUp,
  Workflow,
  Boxes,
} from 'lucide-react'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'

const pluginCapabilities = [
  {
    icon: Search,
    title: 'Market & Competitor Tracking',
    badge: 'Research Plugin',
    desc: 'Agents automatically monitor industry whitepapers, competitor pricing tables, changelogs, and patent filings to deliver synthesized executive memos.',
  },
  {
    icon: Megaphone,
    title: 'Outreach & Campaign Synthesis',
    badge: 'Growth Plugin',
    desc: 'Generate customized copy angles, cold-outreach templates, landing page positioning tests, and product launch sequences tailored to exact ICP segments.',
  },
  {
    icon: TrendingUp,
    title: 'Financial & Unit Economics Audits',
    badge: 'Operations Plugin',
    desc: 'Analyze token spend, track gross margin thresholds, model CAC/LTV payback curves, and flag cost anomalies before they hit your monthly billing statement.',
  },
  {
    icon: Workflow,
    title: 'Custom Workflow & Skill Extensions',
    badge: 'Extensible Engine',
    desc: 'Connect custom internal skills, proprietary databases, and specialized business logic. Build recurring agent routines that run 24/7 without intervention.',
  },
]

export const BeyondCodeSection = () => {
  return (
    <section className="relative py-20 lg:py-28 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[400px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="max-w-3xl space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <Boxes className="h-3.5 w-3.5" />
            <span>EXTENSIBLE BUSINESS RUNTIME</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
            Beyond Code: Agents for your entire business.
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Fabrica is not just an IDE for software developers. The same multi-agent crews, parallel isolation, and financial guardrails orchestrate market intelligence, campaign planning, and operations.
          </p>
        </Reveal>

        {/* 4 Capability Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {pluginCapabilities.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-orange-500/30 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider bg-[var(--overlay-5)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-strong)] group-hover:text-orange-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
