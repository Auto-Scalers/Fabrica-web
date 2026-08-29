'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import {
  Cpu,
  ShieldCheck,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  ArrowRight,
  GitBranch,
  Search,
  Code2,
  Megaphone,
  TrendingUp,
  FileCheck,
  Smartphone,
  Layers,
  LayoutGrid,
  Lock,
  Zap,
  CheckSquare,
  AlertTriangle,
  Monitor,
  Download,
  LogIn,
  LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useRouter } from '@/src/i18n/navigation'

const AUTH_TOKEN_KEY = 'fabrica_auth_tokens'

export default function Hero() {
  const t = useTranslations('hero')
  const tn = useTranslations('nav')
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let active = true
    const read = () => {
      try {
        const raw = window.localStorage.getItem(AUTH_TOKEN_KEY)
        const parsed = raw ? (JSON.parse(raw) as { access_token?: string }) : null
        if (active) setIsAuthed(!!parsed?.access_token)
      } catch {
        if (active) setIsAuthed(false)
      }
    }
    const raf = requestAnimationFrame(read)
    return () => {
      active = false
      cancelAnimationFrame(raf)
    }
  }, [])

  const goToAccount = () => {
    if (isAuthed) {
      router.push('/dashboard')
    } else {
      window.location.href = '/api/auth/authorize'
    }
  }

  const [selectedAgent, setSelectedAgent] = useState('dev')
  const [isRunning, setIsRunning] = useState(true)
  const [activeLogIndex, setActiveLogIndex] = useState(2)
  const [approvalGranted, setApprovalGranted] = useState(false)
  const [activeTab, setActiveTab] = useState<'daemons' | 'kanban' | 'eisenhower' | 'field_ops'>('daemons')
  const [executionTarget, setExecutionTarget] = useState<'local' | 'remote'>('local')

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => (prev >= 4 ? 0 : prev + 1))
    }, 2800)
    return () => clearInterval(interval)
  }, [isRunning])

const crewMembers = [
    {
      id: 'dev',
      name: t('crewMembers.dev.name'),
      icon: Code2,
      role: t('crewMembers.dev.role'),
      status: t('crewMembers.dev.status'),
      state: 'active',
      task: t('crewMembers.dev.task'),
      spend: t('crewMembers.dev.spend'),
      worktree: t('crewMembers.dev.worktree'),
      logs: [
        '✅ [worktree/auth-guard] Checked out isolated disk branch',
        '🔍 AST analysis: src/auth/session-provider.tsx',
        '🛠️ Refactored JWT token expiration handler',
        '📊 Running test suite: 14/14 unit tests passed',
        '🔗 Generating diff preview for visual human sign-off...',
      ],
    },
    {
      id: 'research',
      name: t('crewMembers.research.name'),
      icon: Search,
      role: t('crewMembers.research.role'),
      status: t('crewMembers.research.status'),
      state: 'active',
      task: t('crewMembers.research.task'),
      spend: t('crewMembers.research.spend'),
      worktree: t('crewMembers.research.worktree'),
      logs: [
        '📋 [isolated-scratchpad] Polling 42 public benchmark docs',
        '📝 Extracted token-cost structures across top 5 providers',
        '📈 Built cost-per-active-agent breakdown matrix',
        '📄 Formatted executive brief: /outcomes/research-brief.md',
      ],
    },
    {
      id: 'mkt',
      name: t('crewMembers.mkt.name'),
      icon: Megaphone,
      role: t('crewMembers.mkt.role'),
      status: t('crewMembers.mkt.status'),
      state: 'pending',
      task: t('crewMembers.mkt.task'),
      spend: t('crewMembers.mkt.spend'),
      worktree: t('crewMembers.mkt.worktree'),
      logs: [
        '🎯 Target audience: Solo founders & boutique dev agencies',
        '💡 Hook iteration 1: "Stop re-explaining context every 15 min"',
        '💡 Hook iteration 2: "Your entire company in one command center"',
        '✨ Output draft ready for review: /campaigns/launch-v3.md',
      ],
    },
    {
      id: 'analyst',
      name: t('crewMembers.analyst.name'),
      icon: TrendingUp,
      role: t('crewMembers.analyst.role'),
      status: t('crewMembers.analyst.status'),
      state: 'verified',
      task: t('crewMembers.analyst.task'),
      spend: t('crewMembers.analyst.spend'),
      worktree: t('crewMembers.analyst.worktree'),
      logs: [
        '📊 Running financial simulation across 500 active tasks',
        '📈 Calculated margin: 78.4% gross margin at current tier',
        '⚠️ Hard budget threshold verified: spend is 51.8% under cap',
        '📋 Audit complete. Report saved to /ops/fin-model.json',
      ],
    },
  ]

  const initialKanbanCols = {
    backlog: [
      { id: 'k1', title: t('kanban.k1'), agent: t('kanbanCols.backlog.0.agent'), priority: t('kanbanCols.backlog.0.priority'), spend: '$3.20' },
      { id: 'k2', title: t('kanban.k2'), agent: t('kanbanCols.backlog.1.agent'), priority: t('kanbanCols.backlog.1.priority'), spend: '$1.80' },
    ],
    in_progress: [
      { id: 'k3', title: t('kanban.k3'), agent: t('kanbanCols.inProgress.0.agent'), priority: t('kanbanCols.inProgress.0.priority'), spend: '$14.20', branch: 'worktree/auth-guard' },
      { id: 'k4', title: t('kanban.k4'), agent: t('kanbanCols.inProgress.1.agent'), priority: t('kanbanCols.inProgress.1.priority'), spend: '$8.40', branch: 'ops/fin-model' },
    ],
    approval: [
      { id: 'k5', title: t('kanban.k5'), agent: t('kanbanCols.approval.0.agent'), priority: t('kanbanCols.approval.0.priority'), spend: '$18.40', risk: t('kanbanCols.approval.0.risk') },
    ],
    verified: [
      { id: 'k6', title: t('kanban.k6'), agent: t('kanbanCols.verified.0.agent'), priority: t('kanbanCols.verified.0.priority'), spend: '$6.50' },
      { id: 'k7', title: t('kanban.k7'), agent: t('kanbanCols.verified.1.agent'), priority: t('kanbanCols.verified.1.priority'), spend: '$4.10' },
    ],
  }

  const eisenhowerQuadrants = [
    {
      id: 'q1',
      title: t('eisenhower.q1.title'),
      subtitle: t('eisenhower.q1.subtitle'),
      badge: t('eisenhower.q1.badge'),
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      tasks: [
        { name: t('eisenhower.t1'), agent: t('eisenhowerTasks.t1.agent'), status: t('eisenhower.statusPending'), icon: AlertTriangle },
        { name: t('eisenhower.t2'), agent: t('eisenhowerTasks.t2.agent'), status: t('eisenhower.statusWorktreeReady'), icon: ShieldCheck },
      ],
    },
    {
      id: 'q2',
      title: t('eisenhower.q2.title'),
      subtitle: t('eisenhower.q2.subtitle'),
      badge: t('eisenhower.q2.badge'),
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      tasks: [
        { name: t('eisenhower.t3'), agent: t('eisenhowerTasks.t3.agent'), status: t('eisenhower.statusDaemon'), icon: Search },
        { name: t('eisenhower.t4'), agent: t('eisenhowerTasks.t4.agent'), status: t('eisenhower.statusMargin'), icon: TrendingUp },
      ],
    },
    {
      id: 'q3',
      title: t('eisenhower.q3.title'),
      subtitle: t('eisenhower.q3.subtitle'),
      badge: t('eisenhower.q3.badge'),
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      tasks: [
        { name: t('eisenhower.t5'), agent: t('eisenhowerTasks.t5.agent'), status: t('eisenhower.statusDrafted'), icon: Megaphone },
        { name: t('eisenhower.t6'), agent: t('eisenhowerTasks.t6.agent'), status: t('eisenhower.statusAst'), icon: Code2 },
      ],
    },
    {
      id: 'q4',
      title: t('eisenhower.q4.title'),
      subtitle: t('eisenhower.q4.subtitle'),
      badge: t('eisenhower.q4.badge'),
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      tasks: [
        { name: t('eisenhower.t7'), agent: t('eisenhowerTasks.t7.agent'), status: t('eisenhower.statusEliminated'), icon: Zap },
        { name: t('eisenhower.t8'), agent: t('eisenhowerTasks.t8.agent'), status: t('eisenhower.statusAutomated'), icon: CheckSquare },
      ],
    },
  ]

  const currentAgent = crewMembers.find((a) => a.id === selectedAgent) || crewMembers[0]

  return (
    <section
      id="product"
      className="fabrica-hero relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden scroll-mt-20"
    >
      <div
        className="fabrica-hero-bg absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/fabrica-hero-bg.jpg)',
          backgroundSize: '100% auto',
          backgroundPosition: 'center 32px',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-white/20 dark:bg-[#0B0C12]/60 pointer-events-none" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-orange-600/15 via-orange-950/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs sm:text-sm font-medium text-orange-400 backdrop-blur-md">
            <img
              src="/fabrica-logo_icon.svg"
              alt=""
              className="h-4 w-4 object-contain"
            />
            <span className="font-mono uppercase tracking-wider text-[11px] sm:text-xs">{t('badgeLabel')}</span>
            <span className="text-[var(--text-subtle)]">|</span>
            <span className="text-[var(--text-strong)]">{t('badgeSub')}</span>
          </div>
          <p className="relative z-10 -mt-3 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
            {t('taglineClarifier')}
          </p>

          <h1 className="hero-halo relative z-10 text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-[var(--text-strong)] leading-[1.08]">
            <span className="block">{t('headline1a')}</span>
            <span className="block text-2xl sm:text-3xl lg:text-5xl leading-tight">
              {t('headline1b')}{' '}
              <span className="[text-shadow:none] text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] via-[#E8590C] to-orange-400">
                {t('headline2a')}
              </span>
            </span>
            <span className="block mt-2 text-3xl sm:text-4xl lg:text-[4.25rem] leading-tight">
              <span className="[text-shadow:none] text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] via-[#E8590C] to-orange-400">
                {t('headline2b')}
              </span>
            </span>
          </h1>

          <p className="hero-halo relative z-10 text-xl sm:text-2xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            {t('subheadline')}
          </p>

          <p className="relative z-10 text-lg sm:text-xl font-semibold text-[var(--text-strong)] tracking-tight">
            {t('triad')}
          </p>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-[var(--text-muted)] pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--overlay-5)] border border-[var(--border-subtle)] text-[var(--text-strong)]">
              <Monitor className="h-3.5 w-3.5 text-orange-400" />
              <span>{t('platformDesktop')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--overlay-5)] border border-[var(--border-subtle)] text-[var(--text-strong)]">
              <Smartphone className="h-3.5 w-3.5 text-blue-400" />
              <span>{t('platformMobile')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              <span>{t('platformSetup')}</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <ShimmerButton
              shimmerColor="#FFD0A6"
              borderRadius="12px"
              background="linear-gradient(90deg, #E8590C, #FF8A3D)"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold shadow-xl shadow-orange-950/50"
              onClick={() => router.push('/download')}
            >
              <Download className="h-4 w-4" />
              <span>{tn('download')}</span>
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
            <button
              type="button"
              onClick={goToAccount}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-6 py-3.5 text-base font-medium text-[var(--text-strong)] hover:bg-[var(--overlay-10)] hover:border-[var(--border-subtle)] transition-all"
            >
              {isAuthed ? (
                <LayoutDashboard className="h-4 w-4 text-orange-400" />
              ) : (
                <LogIn className="h-4 w-4 text-orange-400" />
              )}
              <span>{isAuthed ? tn('dashboard') : tn('signIn')}</span>
            </button>
          </div>

          <div className="relative z-10 pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[var(--text-muted)] font-mono text-start">
            <div className="p-2.5 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-400 shrink-0" />
              <div>
                <span className="text-[var(--text-strong)] block font-semibold">{t('pillarZeroPrompt')}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{t('pillarZeroPromptSub')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[var(--text-strong)] block font-semibold">{t('pillarEisenhower')}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{t('pillarEisenhowerSub')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[var(--text-strong)] block font-semibold">{t('pillarFieldOps')}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{t('pillarFieldOpsSub')}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[var(--text-strong)] block font-semibold">{t('pillarVault')}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{t('pillarVaultSub')}</span>
              </div>
            </div>
          </div>
        </div>

        <div id="command-center" className="mt-12 sm:mt-16 relative scroll-mt-24">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/20 via-blue-500/10 to-orange-500/20 blur-xl opacity-60 pointer-events-none" />

          <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[#0D0E15] shadow-2xl overflow-hidden command-frame">
            <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-panel)] gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                  <img
                    src="/fabrica-logo_icon.svg"
                    alt=""
                    className="h-4 w-4 object-contain"
                  />
                  {t('windowTitle')}
                </span>
              </div>

              <ToggleGroup
                value={[activeTab]}
                onValueChange={(value) => {
                  if (value[0]) setActiveTab(value[0] as typeof activeTab)
                }}
                spacing={1}
                className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-[var(--border-subtle)] text-xs font-mono"
              >
                <ToggleGroupItem
                  value="daemons"
                  className="px-2.5 py-1 min-h-[36px] rounded flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-strong)] data-[state=on]:bg-orange-500 data-[state=on]:text-[var(--text-strong)] data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>{t('tabDaemons')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="kanban"
                  className="px-2.5 py-1 min-h-[36px] rounded flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-strong)] data-[state=on]:bg-orange-500 data-[state=on]:text-[var(--text-strong)] data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{t('tabKanban')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="eisenhower"
                  className="px-2.5 py-1 min-h-[36px] rounded flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-strong)] data-[state=on]:bg-orange-500 data-[state=on]:text-[var(--text-strong)] data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>{t('tabEisenhower')}</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="field_ops"
                  className="px-2.5 py-1 min-h-[36px] rounded flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-strong)] data-[state=on]:bg-orange-500 data-[state=on]:text-[var(--text-strong)] data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{t('tabFieldOps')}</span>
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="flex items-center gap-2 text-xs font-mono">
                <ToggleGroup
                  value={[executionTarget]}
                  onValueChange={(value) => {
                    if (value[0]) setExecutionTarget(value[0] as 'local' | 'remote')
                  }}
                  spacing={0}
                  className="flex items-center bg-[var(--overlay-5)] rounded-lg p-0.5 border border-[var(--border-subtle)]"
                >
                  <ToggleGroupItem
                    value="local"
                    className="px-2 py-1 min-h-[32px] rounded text-[11px] text-[var(--text-muted)] data-[state=on]:bg-orange-500/20 data-[state=on]:text-orange-400 data-[state=on]:font-bold"
                  >
                    {t('localDaemon')}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="remote"
                    className="px-2 py-1 min-h-[32px] rounded text-[11px] text-[var(--text-muted)] data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400 data-[state=on]:font-bold"
                  >
                    {t('remoteWorker')}
                  </ToggleGroupItem>
                </ToggleGroup>

                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] rounded bg-[var(--overlay-5)] hover:bg-[var(--overlay-10)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-strong)] transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-3 w-3 text-amber-400" />
                      <span className="text-[11px]">{t('running')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 text-emerald-400" />
                      <span className="text-[11px]">{t('paused')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {activeTab === 'daemons' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-faint)]">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t('autonomousCrew')}
                      </span>
                      <span className="text-[11px] font-mono text-orange-400">{t('zeroPromptQueue')}</span>
                    </div>

                    <div className="space-y-2">
                      {crewMembers.map((agent) => {
                        const Icon = agent.icon
                        const isSelected = selectedAgent === agent.id
                        return (
                          <button
                            key={agent.id}
                            onClick={() => setSelectedAgent(agent.id)}
                            className={cn(
                              'w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3',
                              isSelected
                                ? 'bg-[var(--surface-card)] border-orange-500/50 shadow-md shadow-orange-950/20'
                                : 'bg-[var(--overlay-weak)] border-[var(--border-faint)] hover:bg-[var(--overlay-5)] hover:border-[var(--border-subtle)]'
                            )}
                          >
                            <div
                              className={cn(
                                'p-2 rounded-lg',
                                isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-[var(--overlay-5)] text-[var(--text-muted)]'
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[var(--text-strong)] truncate">{agent.name}</span>
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">{agent.spend}</span>
                              </div>
                              <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">{agent.task}</p>
                              <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
                                <span className="text-[var(--text-muted)] truncate max-w-[120px]">{agent.worktree}</span>
                                {agent.state === 'active' && (
                                  <span className="flex items-center gap-1 text-orange-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                                    {t('activeDaemon')}
                                  </span>
                                )}
                                {agent.state === 'pending' && (
                                  <span className="flex items-center gap-1 text-amber-400">
                                    <Clock className="h-2.5 w-2.5" />
                                    {t('approvalGate')}
                                  </span>
                                )}
                                {agent.state === 'verified' && (
                                  <span className="flex items-center gap-1 text-emerald-400">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    {t('verified')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-faint)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span>{t('engineWorkflow')}</span>
                    <GitBranch className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                </div>

                <div className="lg:col-span-5 p-4 bg-[var(--surface-page)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] flex flex-col justify-between font-mono text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        <currentAgent.icon className="h-4 w-4 text-orange-400" />
                        <span className="text-[var(--text-strong)] font-semibold">{currentAgent.name}</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] bg-[var(--overlay-5)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                        {currentAgent.worktree}
                      </span>
                    </div>

                    <div className="bg-[#050508] rounded-xl p-3.5 border border-[var(--border-subtle)] space-y-2 min-h-[260px]">
                      <div className="text-[11px] text-blue-400 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pb-1 border-b border-[var(--border-faint)]">
                        <span>$ fabrica daemon --target={executionTarget} --role={selectedAgent}</span>
                        <span className="text-emerald-400 font-mono">PID 7104 [24/7 Autonomy]</span>
                      </div>

                      {currentAgent.logs.map((log: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className={cn(
                            'leading-relaxed break-all',
                            index === activeLogIndex ? 'text-orange-300 font-bold' : 'text-[var(--text-muted)]'
                          )}
                        >
                          {log}
                        </motion.div>
                      ))}

                      {isRunning && (
                        <div className="flex items-center gap-1.5 text-orange-400 pt-2 animate-pulse">
                          <span className="inline-block w-2 h-3.5 bg-orange-500" />
                          <span className="text-[11px]">{t('executingSubtask')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-[var(--overlay-weak)] border border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                      {t('zeroCollisions')}
                    </span>
                    <span className="text-orange-400 font-semibold">{t('isolatedDisk')}</span>
                  </div>
                </div>

                <div className="lg:col-span-3 p-4 bg-[var(--surface-panel)] flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {t('fieldControls')}
                      </span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)] font-medium">{t('monthlyTaskBudget')}</span>
                        <span className="text-[var(--text-strong)] font-mono font-bold">$48.20 / $100.00</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[var(--overlay-10)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                          style={{ width: '48.2%' }}
                        />
                      </div>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        Ã¢Å"â€œ {t('hardAutoStop')}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-subtle)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)] font-medium">{t('pendingApproval')}</span>
                        <span
                          className={cn(
                            'text-[10px] font-mono px-1.5 py-0.5 rounded',
                            approvalGranted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          )}
                        >
                          {approvalGranted ? t('approved') : t('awaitingSignOff')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-strong)] leading-tight">
                        {t('approvalRequest')}
                      </p>
                      <button
                        onClick={() => setApprovalGranted(!approvalGranted)}
                        className={cn(
                          'w-full py-2 rounded-lg text-xs font-semibold transition-all shadow',
                          approvalGranted
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-[var(--text-strong)]'
                            : 'bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] hover:brightness-110 text-white'
                        )}
                      >
                        {approvalGranted ? t('actionVerified') : t('signOffApprove')}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--overlay-weak)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-blue-400" />
                          {t('phoneAppSync')}
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px]">{t('connected')}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {t('phoneSyncDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-center font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-faint)]">
                    {t('engineStatus')}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kanban' && (
              <div className="p-6 bg-[#0B0C12] min-h-[460px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-strong)] flex items-center gap-2">
                      <Layers className="h-4 w-4 text-orange-400" />
                      {t('kanban.title')}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t('kanban.desc')}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                    {t('kanban.activeTasks')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)]">
                      <span>{t('kanban.backlog')} ({initialKanbanCols.backlog.length})</span>
                      <span className="text-[10px]">{t('kanban.autoScheduled')}</span>
                    </div>
                    {initialKanbanCols.backlog.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-xs font-semibold text-[var(--text-strong)]">{item.title}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                          <span className="text-orange-400">@{item.agent}</span>
                          <span>{t('kanban.budget')}: {item.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-blue-400 pb-1 border-b border-blue-500/30">
                      <span>{t('kanban.inWorktree')} ({initialKanbanCols.in_progress.length})</span>
                      <span className="text-[10px] animate-pulse">{t('kanban.running')}</span>
                    </div>
                    {initialKanbanCols.in_progress.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-card)] border border-blue-500/30 space-y-2 shadow-lg">
                        <div className="text-xs font-semibold text-[var(--text-strong)]">{item.title}</div>
                        <div className="text-[10px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded inline-block">
                          {item.branch}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1">
                          <span className="text-orange-400">@{item.agent}</span>
                          <span className="text-emerald-400 font-bold">{t('kanban.spend')}: {item.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-amber-400 pb-1 border-b border-amber-500/30">
                      <span>{t('kanban.approvalGate')} ({initialKanbanCols.approval.length})</span>
                      <span className="text-[10px]">{t('kanban.fieldReview')}</span>
                    </div>
                    {initialKanbanCols.approval.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-section)] border border-amber-500/40 space-y-2.5">
                        <div className="text-xs font-semibold text-[var(--text-strong)]">{item.title}</div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {item.risk}
                          </span>
                        </div>
                        <button
                          onClick={() => setApprovalGranted(true)}
                          className="w-full py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-[var(--text-strong)] font-semibold text-[11px] shadow hover:brightness-110"
                        >
                          {t('kanban.signOff')}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-emerald-400 pb-1 border-b border-emerald-500/30">
                      <span>{t('kanban.verifiedShipped')} ({initialKanbanCols.verified.length})</span>
                      <span className="text-[10px]">{t('kanban.done')}</span>
                    </div>
                    {initialKanbanCols.verified.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-section)] border border-emerald-500/30 space-y-1.5 opacity-90">
                        <div className="text-xs font-semibold text-[var(--text-strong)] flex items-center justify-between">
                          <span>{item.title}</span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                          <span className="text-emerald-400">@{item.agent}</span>
                          <span>{item.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'eisenhower' && (
              <div className="p-6 bg-[#0B0C12] min-h-[460px] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-strong)] flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-orange-400" />
                      {t('eisenhower.title')}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t('eisenhower.desc')}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-orange-400 bg-orange-950/40 px-3 py-1 rounded-lg border border-orange-500/30">
                    {t('eisenhower.goalTracking')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eisenhowerQuadrants.map((quad) => (
                    <div key={quad.id} className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[var(--text-strong)]">{quad.title}</h4>
                          <p className="text-[11px] text-[var(--text-muted)]">{quad.subtitle}</p>
                        </div>
                        <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded border', quad.badgeColor)}>
                          {quad.badge}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {quad.tasks.map((task, tIdx) => {
                          const TIcon = task.icon
                          return (
                            <div key={tIdx} className="p-2.5 rounded-lg bg-[var(--surface-panel)] border border-[var(--border-faint)] flex items-start gap-2.5 text-xs">
                              <div className="p-1 rounded bg-[var(--overlay-5)] text-orange-400 shrink-0 mt-0.5">
                                <TIcon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[var(--text-strong)] font-medium truncate">{task.name}</div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] mt-1">
                                  <span>{t('eisenhower.assigned')}: {task.agent}</span>
                                  <span className="text-emerald-400">{task.status}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'field_ops' && (
              <div className="p-6 bg-[#0B0C12] min-h-[460px] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-strong)] flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      {t('fieldOps.title')}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t('fieldOps.desc')}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    <span>{t('fieldOps.aesSealed')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-strong)]">{t('fieldOps.paymentGate')}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">{t('fieldOps.highRisk')}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t('fieldOps.paymentGateDesc')}
                    </p>
                    <div className="p-2.5 rounded bg-[var(--surface-panel)] text-[11px] font-mono text-[var(--text-strong)] flex items-center justify-between">
                      <span>{t('fieldOps.threshold')}</span>
                      <span className="text-emerald-400">{t('fieldOps.enforced')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-strong)]">{t('fieldOps.productionDeploy')}</span>
                      <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded">{t('fieldOps.critical')}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t('fieldOps.productionDeployDesc')}
                    </p>
                    <div className="p-2.5 rounded bg-[var(--surface-panel)] text-[11px] font-mono text-[var(--text-strong)] flex items-center justify-between">
                      <span>{t('fieldOps.zeroRegression')}</span>
                      <span className="text-emerald-400">{t('fieldOps.testsPassed')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-strong)]">{t('fieldOps.mobileCompanion')}</span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded">{t('fieldOps.iosAndroid')}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t('fieldOps.mobileCompanionDesc')}
                    </p>
                    <div className="p-2.5 rounded bg-[var(--surface-panel)] text-[11px] font-mono text-[var(--text-strong)] flex items-center justify-between">
                      <span>{t('fieldOps.syncLatency')}</span>
                      <span className="text-emerald-400">{t('fieldOps.lowLatency')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
