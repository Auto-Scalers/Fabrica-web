'use client'

import React, { useState } from 'react'
import {
  Code2,
  Search,
  Megaphone,
  TrendingUp,
  FileCode2,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarBadge } from '@/components/ui/avatar'

export const CrewSection = () => {
  const t = useTranslations('crew')

  const crewRoles = [
    {
      id: 'dev',
      title: t('roles.dev.title'),
      badge: t('roles.dev.badge'),
      icon: Code2,
      tagline: t('roles.dev.tagline'),
      description: t('roles.dev.desc'),
      exampleTask: t('roles.dev.task'),
      outputType: 'diff',
      outputTitle: t('roles.dev.output'),
      outputData: [
        { type: 'header', text: 'diff --git a/src/auth/session.ts b/src/auth/session.ts' },
        { type: 'info', text: '@@ -42,8 +42,16 @@ export async function refreshToken(token: string) {' },
        { type: 'remove', text: '-  const decoded = jwt.decode(token);' },
        { type: 'remove', text: '-  return issueNewToken(decoded.sub);' },
        { type: 'add', text: '+  const cacheKey = `idemp:${sha256(token)}`;' },
        { type: 'add', text: '+  const existing = await redis.get(cacheKey);' },
        { type: 'add', text: '+  if (existing) return JSON.parse(existing);' },
        { type: 'add', text: '+  const fresh = await issueSignedToken(token);' },
        { type: 'add', text: '+  await redis.setex(cacheKey, 60, JSON.stringify(fresh));' },
        { type: 'add', text: '+  return fresh;' },
        { type: 'success', text: 'Ã¢Å"â€œ 16/16 Unit Tests Passed (0.42s) | Clean Diff Ready for Approval' },
      ],
    },
    {
      id: 'researcher',
      title: t('roles.researcher.title'),
      badge: t('roles.researcher.badge'),
      icon: Search,
      tagline: t('roles.researcher.tagline'),
      description: t('roles.researcher.desc'),
      exampleTask: t('roles.researcher.task'),
      outputType: 'report',
      outputTitle: t('roles.researcher.output'),
      outputData: [
        {
          source: 'Competitor A (Docs & API Pricing v2)',
          insight: 'Flat $0.03/min execution fee + 20% token markup. No isolated worktree support.',
          confidence: '98% Verified',
        },
        {
          source: 'Competitor B (Public Whitepaper & Pricing)',
          insight: 'Seats priced at $79/mo but throttles concurrent agent threads to 2.',
          confidence: '94% Verified',
        },
        {
          source: 'Industry Benchmark (Gartner & SaaS Metrics)',
          insight: 'Solo founders prioritize visual budget control over raw agent speed by 4.2x.',
          confidence: '99% Verified',
        },
        {
          source: 'Synthesis Recommendation',
          insight: 'Position Fabrica on parallel isolated worktrees with hard budget auto-kill switches.',
          confidence: 'Actionable',
        },
      ],
    },
    {
      id: 'marketer',
      title: t('roles.marketer.title'),
      badge: t('roles.marketer.badge'),
      icon: Megaphone,
      tagline: t('roles.marketer.tagline'),
      description: t('roles.marketer.desc'),
      exampleTask: t('roles.marketer.task'),
      outputType: 'brief',
      outputTitle: t('roles.marketer.output'),
      outputData: {
        coreAngle: t('roles.marketer.coreAngle'),
        targetPersona: t('roles.marketer.targetPersona'),
        hooks: [
          t('roles.marketer.hook1'),
          t('roles.marketer.hook2'),
          t('roles.marketer.hook3'),
        ],
        distributionPlan: t('roles.marketer.distributionPlan'),
      },
    },
    {
      id: 'analyst',
      title: t('roles.analyst.title'),
      badge: t('roles.analyst.badge'),
      icon: TrendingUp,
      tagline: t('roles.analyst.tagline'),
      description: t('roles.analyst.desc'),
      exampleTask: t('roles.analyst.task'),
      outputType: 'kpi',
      outputTitle: t('roles.analyst.output'),
      outputData: [
        { metric: 'Avg Token Cost / Task', value: '$0.14', benchmark: 'Target < $0.35', status: 'Healthy' },
        { metric: 'Simulated Gross Margin', value: '82.4%', benchmark: 'Target > 75.0%', status: 'Optimal' },
        { metric: 'Payback Period', value: '1.4 Mo', benchmark: 'Industry Avg 4.2 Mo', status: 'Optimal' },
        { metric: 'Budget Cap Adherence', value: '100.0%', benchmark: '0 Runaway Overages', status: 'Protected' },
      ],
    },
  ]

  const [activeRole, setActiveRole] = useState(crewRoles[0].id)

  const current = crewRoles.find((r) => r.id === activeRole) || crewRoles[0]

  return (
    <section id="crew" className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden scroll-mt-20">
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
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

        {/* Role Selector Tabs */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {crewRoles.map((role) => {
            const Icon = role.icon
            const isActive = activeRole === role.id
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[110px]',
                  isActive
                    ? 'bg-[var(--surface-card)] border-orange-500/60 shadow-lg shadow-orange-950/30'
                    : 'bg-[var(--overlay-weak)] border-[var(--border-subtle)] hover:bg-[var(--overlay-5)] hover:border-[var(--border-subtle)]'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <Avatar size="sm" className="border border-[var(--border-subtle)] bg-[var(--overlay-5)]">
                    <AvatarFallback className="bg-orange-950/40 text-orange-400">
                      <Icon className="h-3.5 w-3.5" />
                    </AvatarFallback>
                    {isActive && <AvatarBadge className="bg-emerald-500 ring-[var(--surface-card)]" />}
                  </Avatar>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {role.badge}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-[var(--text-strong)]">{role.title}</h3>
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Role Deep-Dive Card */}
        <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Role Description & Example Task (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <current.icon className="h-6 w-6 text-orange-400" />
                  <h3 className="text-2xl font-bold text-[var(--text-strong)]">{current.title}</h3>
                </div>
                <p className="text-sm font-medium text-orange-300">{current.tagline}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed pt-1">{current.description}</p>
              </div>

              {/* Example Task Box */}
              <div className="p-4 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-subtle)] space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  {t('exampleMission')}
                </span>
                <p className="text-xs text-[var(--text-strong)] font-mono leading-relaxed bg-[var(--surface-page)] p-3 rounded-lg border border-[var(--border-faint)]">
                  &ldquo;{current.exampleTask}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t('isolatedExecution')}</span>
              </div>
            </div>

            {/* Right: Live Simulated Output View (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-page)] overflow-hidden command-frame">
              {/* Output Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#050508] border-b border-[var(--border-subtle)] text-xs font-mono">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <FileCode2 className="h-4 w-4 text-orange-400" />
                  <span className="text-[var(--text-strong)] font-semibold">{current.outputTitle}</span>
                </div>
                <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                  {t('verifiedOutput')}
                </span>
              </div>

              {/* Output Content By Type */}
              <div className="p-4 sm:p-5 font-mono text-xs overflow-x-auto min-h-[260px]">
                {/* Developer Diff */}
                {current.outputType === 'diff' && (
                  <div className="space-y-1">
                    {(current.outputData as Array<{ type: string; text: string }>).map((line, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'px-2 py-0.5 rounded text-xs leading-relaxed',
                          line.type === 'header' && 'text-[var(--text-muted)] font-bold border-b border-[var(--border-faint)] pb-1',
                          line.type === 'info' && 'text-blue-400',
                          line.type === 'remove' && 'bg-red-950/40 text-red-300 border-l-2 border-red-500',
                          line.type === 'add' && 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500',
                          line.type === 'success' && 'mt-3 text-emerald-400 font-bold bg-emerald-950/20 p-2 rounded'
                        )}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Researcher Sourced Report */}
                {current.outputType === 'report' && (
                  <div className="space-y-3 font-sans">
                    {(
                      current.outputData as Array<{ source: string; insight: string; confidence: string }>
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[var(--overlay-weak)] border border-[var(--border-faint)] space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-orange-400 font-semibold">{item.source}</span>
                          <span className="text-emerald-400 text-[10px] bg-emerald-950/30 px-1.5 py-0.5 rounded">
                            {item.confidence}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">{item.insight}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Marketer Campaign Brief */}
                {current.outputType === 'brief' && (
                  <div className="space-y-3 font-sans text-xs">
                    {(() => {
                      const data = current.outputData as {
                        coreAngle: string
                        targetPersona: string
                        hooks: string[]
                        distributionPlan: string
                      }
                      return (
                        <>
                          <div className="p-3 rounded-lg bg-orange-950/20 border border-orange-500/20">
                            <span className="text-[11px] font-mono text-orange-400 uppercase font-semibold">
                              {t('primaryAngle')}
                            </span>
                            <p className="text-sm font-bold text-[var(--text-strong)] mt-1">{data.coreAngle}</p>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase font-semibold">
                              {t('highResonanceHooks')}
                            </span>
                            {data.hooks.map((h, i) => (
                              <div key={i} className="p-2 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)] text-[var(--text-strong)]">
                                {h}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs font-mono text-blue-400 pt-1">
                            {t('distribution')}: {data.distributionPlan}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

                {/* Business Analyst KPI Table */}
                {current.outputType === 'kpi' && (
                  <div className="space-y-2">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                          <th className="pb-2">{t('metric')}</th>
                          <th className="pb-2">{t('currentValue')}</th>
                          <th className="pb-2">{t('benchmarkTarget')}</th>
                          <th className="pb-2">{t('auditStatus')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs font-mono">
                        {(
                          current.outputData as Array<{
                            metric: string
                            value: string
                            benchmark: string
                            status: string
                          }>
                        ).map((row, idx) => (
                          <tr key={idx} className="hover:bg-[var(--overlay-weak)]">
                            <td className="py-2.5 font-semibold text-[var(--text-strong)]">{row.metric}</td>
                            <td className="py-2.5 text-orange-400 font-bold">{row.value}</td>
                            <td className="py-2.5 text-[var(--text-muted)]">{row.benchmark}</td>
                            <td className="py-2.5">
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
