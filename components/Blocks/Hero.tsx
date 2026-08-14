'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
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
  Terminal,
  Smartphone,
  Layers,
  LayoutGrid,
  Lock,
  Zap,
  CheckSquare,
  AlertTriangle,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ShimmerButton } from '@/components/ui/shimmer-button'

// Agent role mock definitions for the live interactive simulator
const crewMembers = [
  {
    id: 'dev',
    name: 'Developer Agent',
    icon: Code2,
    role: 'Fullstack & Worktree Isolation',
    status: 'Running in worktree/auth-guard',
    state: 'active',
    task: 'Building token refresh middleware & patch diffs',
    spend: '$18.40',
    worktree: 'worktree/auth-guard',
    logs: [
      '⚡ [worktree/auth-guard] Checked out isolated disk branch',
      '🔍 AST analysis: src/auth/session-provider.tsx',
      '✏️ Refactored JWT token expiration handler',
      '🧪 Running test suite: 14/14 unit tests passed',
      '📦 Generating diff preview for visual human sign-off...',
    ],
  },
  {
    id: 'research',
    name: 'Researcher Agent',
    icon: Search,
    role: 'Market & Source Intelligence',
    status: 'Running deep search matrix',
    state: 'active',
    task: 'Synthesizing competitor pricing models & API costs',
    spend: '$12.10',
    worktree: 'scratchpad/market-intel',
    logs: [
      '🌐 [isolated-scratchpad] Polling 42 public benchmark docs',
      '📊 Extracted token-cost structures across top 5 providers',
      '📈 Built cost-per-active-agent breakdown matrix',
      '📝 Formatted executive brief: /outcomes/research-brief.md',
    ],
  },
  {
    id: 'mkt',
    name: 'Marketer Agent',
    icon: Megaphone,
    role: 'Messaging & Growth Angles',
    status: 'Awaiting review',
    state: 'pending',
    task: 'Refining copy for 3 cold-outreach segments',
    spend: '$8.50',
    worktree: 'campaigns/launch-v3',
    logs: [
      '🎯 Target audience: Solo founders & boutique dev agencies',
      '💡 Hook iteration 1: "Stop re-explaining context every 15 min"',
      '💡 Hook iteration 2: "Your entire company in one command center"',
      '📑 Output draft ready for review: /campaigns/launch-v3.md',
    ],
  },
  {
    id: 'analyst',
    name: 'Business Analyst Agent',
    icon: TrendingUp,
    role: 'Unit Economics & Financial Guardrails',
    status: 'Verified',
    state: 'verified',
    task: 'Audited monthly token spend vs client retainer target',
    spend: '$9.20',
    worktree: 'ops/financial-model',
    logs: [
      '💰 Running financial simulation across 500 active tasks',
      '📊 Calculated margin: 78.4% gross margin at $149/mo tier',
      '🛡️ Hard budget threshold verified: spend is 51.8% under cap',
      '✅ Audit complete. Report saved to /ops/fin-model.json',
    ],
  },
]

// Kanban items for the interactive mission control board
const initialKanbanCols = {
  backlog: [
    { id: 'k1', title: 'Synthesize 50 Competitor Whitepapers', agent: 'Researcher', priority: 'High', spend: '$3.20' },
    { id: 'k2', title: 'SEO Programmatic Cluster Generation', agent: 'Marketer', priority: 'Medium', spend: '$1.80' },
  ],
  in_progress: [
    { id: 'k3', title: 'JWT Refresh Token Worktree Migration', agent: 'Developer', priority: 'Urgent', spend: '$14.20', branch: 'worktree/auth-guard' },
    { id: 'k4', title: 'SaaS Gross Margin Forecast Simulation', agent: 'Analyst', priority: 'High', spend: '$8.40', branch: 'ops/fin-model' },
  ],
  approval: [
    { id: 'k5', title: 'Stripe Webhook Event Signature Verifier', agent: 'Developer', priority: 'High', spend: '$18.40', risk: 'Payment Critical' },
  ],
  verified: [
    { id: 'k6', title: 'Landing Page Copy Matrix & Angles', agent: 'Marketer', priority: 'High', spend: '$6.50' },
    { id: 'k7', title: 'Database Index Optimization Diffs', agent: 'Developer', priority: 'Medium', spend: '$4.10' },
  ],
}

// Eisenhower Quadrants
const eisenhowerQuadrants = [
  {
    id: 'q1',
    title: 'Q1: Urgent & Important (Do First)',
    subtitle: 'High-risk operations & core infrastructure',
    badge: 'Immediate Action',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    tasks: [
      { name: 'Stripe Webhook Signature Verification Gate', agent: 'Developer', status: 'Pending Human Sign-off', icon: AlertTriangle },
      { name: 'Production Staging Deploy with 0 Regression Diff', agent: 'Developer', status: 'Worktree Ready', icon: ShieldCheck },
    ],
  },
  {
    id: 'q2',
    title: 'Q2: Important & Non-Urgent (Schedule)',
    subtitle: 'Strategic architecture, moat & unit economics',
    badge: 'High Value',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    tasks: [
      { name: 'Autonomous Competitor Pricing Model Synthesis', agent: 'Researcher', status: 'Background Daemon Running', icon: Search },
      { name: 'LTV/CAC Unit Economics Simulation Model', agent: 'Analyst', status: '78.4% Margin Forecasted', icon: TrendingUp },
    ],
  },
  {
    id: 'q3',
    title: 'Q3: Urgent & Low Importance (Delegate)',
    subtitle: 'Autonomous crew routines & continuous tasks',
    badge: 'Delegated to Crew',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tasks: [
      { name: 'Draft 3 Cold Outreach Positioning Variations', agent: 'Marketer', status: 'Drafted in /campaigns', icon: Megaphone },
      { name: 'Generate TypeScript AST Diffs for Form Validation', agent: 'Developer', status: 'AST Clean', icon: Code2 },
    ],
  },
  {
    id: 'q4',
    title: 'Q4: Neither (Auto-Filtered)',
    subtitle: 'Token burn prevention & auto-kill thresholds',
    badge: 'Auto-Guarded',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    tasks: [
      { name: 'Repetitive Chat Re-Prompting Loops', agent: 'Fabrica Engine', status: 'Eliminated via Task Queues', icon: Zap },
      { name: 'Manual Tracking Spreadsheet Syncing', agent: 'Fabrica Engine', status: 'Automated via Daemon Telemetry', icon: CheckSquare },
    ],
  },
]

export default function Hero() {
  const [selectedAgent, setSelectedAgent] = useState('dev')
  const [isRunning, setIsRunning] = useState(true)
  const [activeLogIndex, setActiveLogIndex] = useState(2)
  const [approvalGranted, setApprovalGranted] = useState(false)
  const [activeTab, setActiveTab] = useState<'daemons' | 'kanban' | 'eisenhower' | 'field_ops'>('daemons')
  const [executionTarget, setExecutionTarget] = useState<'local' | 'remote'>('local')

  // Simulation timer for dynamic log streaming
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => (prev >= 4 ? 0 : prev + 1))
    }, 2800)
    return () => clearInterval(interval)
  }, [isRunning])

  const currentAgent = crewMembers.find((a) => a.id === selectedAgent) || crewMembers[0]

  return (
    <section id="product" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Subtle forge amber ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-orange-600/15 via-orange-950/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Molten forge texture */}
      <img
        src="/images/forge_molten_texture.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.05] mix-blend-screen pointer-events-none -z-10"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main Headline & Pain Anchor */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs sm:text-sm font-medium text-orange-400 backdrop-blur-md">
            <img
              src="/fabrica-logo_icon.svg"
              alt=""
              className="h-4 w-4 object-contain"
            />
            <span className="font-mono uppercase tracking-wider text-[11px] sm:text-xs">The Next AI Exit</span>
            <span className="text-white/30">|</span>
            <span className="text-white/90">Business-First & Coding-First ADE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Fourteen tabs. Three broken contexts.{' '}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] via-[#E8590C] to-orange-400">
              It&apos;s 11 PM. Direct the crew instead.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8A8A94] max-w-3xl mx-auto leading-relaxed">
            Stop prompting. Define your multi-agent crews (Researchers, Developers, Marketers, Business Analysts), control budget, approvals, security and let parallel AI coding agents work across isolated worktrees or plain disk folders on 24/7 Autonomy and Scale.
          </p>

          {/* Platform Support Badges & Runtime Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-[#8A8A94] pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white">
              <Monitor className="h-3.5 w-3.5 text-orange-400" />
              <span>macOS • Windows • Linux Desktop</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white">
              <Smartphone className="h-3.5 w-3.5 text-blue-400" />
              <span>iOS & Android Phone Companion</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Zero Technical Setup</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <ShimmerButton
              shimmerColor="#FFD0A6"
              borderRadius="12px"
              background="linear-gradient(90deg, #E8590C, #FF8A3D)"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold shadow-xl shadow-orange-950/50"
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Get Early Access</span>
              <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
            <a
              href="#command-center"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-medium text-white hover:bg-white/10 hover:border-white/25 transition-all"
            >
              <span>Explore Command Center</span>
              <Terminal className="h-4 w-4 text-orange-400" />
            </a>
          </div>

          {/* 4 Core Value Pillars Bar */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#8A8A94] font-mono text-left">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-400 shrink-0" />
              <div>
                <span className="text-white block font-semibold">Zero-Prompt Auto</span>
                <span className="text-[10px] text-[#8A8A94]">24/7 background daemons</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-white block font-semibold">Eisenhower & Kanban</span>
                <span className="text-[10px] text-[#8A8A94]">Operational oversight</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white block font-semibold">Field Ops & Safety</span>
                <span className="text-[10px] text-[#8A8A94]">1-tap approval gates</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-white block font-semibold">Client-Side Vault</span>
                <span className="text-[10px] text-[#8A8A94]">Zero cloud key leaks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Mission Control Command Center Visual */}
        <div id="command-center" className="mt-12 sm:mt-16 relative scroll-mt-24">
          {/* Subtle Outer Frame glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/20 via-blue-500/10 to-orange-500/20 blur-xl opacity-60 pointer-events-none" />

          <div className="relative rounded-2xl border border-white/15 bg-[#0D0E15] shadow-2xl overflow-hidden">
            {/* Command Center Window Chrome */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-white/10 bg-[#090A0E] gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-[#8A8A94] flex items-center gap-1.5">
                  <img
                    src="/fabrica-logo_icon.svg"
                    alt=""
                    className="h-4 w-4 object-contain"
                  />
                  fabrica-desktop v3.0 // project: saas-nexus (main)
                </span>
              </div>

              {/* View Switcher: Daemons vs Kanban vs Eisenhower vs Field Ops */}
              <ToggleGroup
                value={[activeTab]}
                onValueChange={(value) => {
                  if (value[0]) setActiveTab(value[0] as typeof activeTab)
                }}
                spacing={1}
                className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs font-mono"
              >
                <ToggleGroupItem
                  value="daemons"
                  className="px-2.5 py-1 rounded flex items-center gap-1.5 text-[#8A8A94] hover:text-white data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Daemons &amp; Stream</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="kanban"
                  className="px-2.5 py-1 rounded flex items-center gap-1.5 text-[#8A8A94] hover:text-white data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Kanban Queue</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="eisenhower"
                  className="px-2.5 py-1 rounded flex items-center gap-1.5 text-[#8A8A94] hover:text-white data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Eisenhower Matrix</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="field_ops"
                  className="px-2.5 py-1 rounded flex items-center gap-1.5 text-[#8A8A94] hover:text-white data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:font-bold data-[state=on]:shadow"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Field Ops &amp; Vault</span>
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Local vs Remote Daemon Target Toggle */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <ToggleGroup
                  value={[executionTarget]}
                  onValueChange={(value) => {
                    if (value[0]) setExecutionTarget(value[0] as 'local' | 'remote')
                  }}
                  spacing={0}
                  className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10"
                >
                  <ToggleGroupItem
                    value="local"
                    className="px-2 py-0.5 rounded text-[11px] text-[#8A8A94] data-[state=on]:bg-orange-500/20 data-[state=on]:text-orange-400 data-[state=on]:font-bold"
                  >
                    Local Daemon
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="remote"
                    className="px-2 py-0.5 rounded text-[11px] text-[#8A8A94] data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400 data-[state=on]:font-bold"
                  >
                    Remote Worker
                  </ToggleGroupItem>
                </ToggleGroup>

                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-3 w-3 text-amber-400" />
                      <span className="text-[11px]">RUNNING</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 text-emerald-400" />
                      <span className="text-[11px]">PAUSED</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: DAEMONS & STREAM */}
            {activeTab === 'daemons' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                {/* Left Rail: Multi-Agent Crew List (4 Cols) */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#11121A] p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8A8A94]">
                        Autonomous Crew (4)
                      </span>
                      <span className="text-[11px] font-mono text-orange-400">Zero-Prompt Queue</span>
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
                                ? 'bg-[#181A24] border-orange-500/50 shadow-md shadow-orange-950/20'
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                            )}
                          >
                            <div
                              className={cn(
                                'p-2 rounded-lg',
                                isSelected ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-[#8A8A94]'
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-white truncate">{agent.name}</span>
                                <span className="text-[10px] font-mono text-[#8A8A94]">{agent.spend}</span>
                              </div>
                              <p className="text-[11px] text-[#8A8A94] truncate mt-0.5">{agent.task}</p>
                              <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
                                <span className="text-[#8A8A94] truncate max-w-[120px]">{agent.worktree}</span>
                                {agent.state === 'active' && (
                                  <span className="flex items-center gap-1 text-orange-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                                    Active Daemon
                                  </span>
                                )}
                                {agent.state === 'pending' && (
                                  <span className="flex items-center gap-1 text-amber-400">
                                    <Clock className="h-2.5 w-2.5" />
                                    Approval Gate
                                  </span>
                                )}
                                {agent.state === 'verified' && (
                                  <span className="flex items-center gap-1 text-emerald-400">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Workflow state pill */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8A8A94]">
                    <span>Engine: Draft → Plan → Run → Verify</span>
                    <GitBranch className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                </div>

                {/* Center Panel: Parallel Execution & Stream Logs (5 Cols) */}
                <div className="lg:col-span-5 p-4 bg-[#0A0A0F] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between font-mono text-xs">
                  <div className="space-y-3">
                    {/* Top Bar for active agent */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <currentAgent.icon className="h-4 w-4 text-orange-400" />
                        <span className="text-white font-semibold">{currentAgent.name}</span>
                      </div>
                      <span className="text-[11px] text-[#8A8A94] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {currentAgent.worktree}
                      </span>
                    </div>

                    {/* Streaming Monospace Log Viewer */}
                    <div className="bg-[#050508] rounded-xl p-3.5 border border-white/10 space-y-2 min-h-[260px]">
                      <div className="text-[11px] text-blue-400 flex items-center justify-between pb-1 border-b border-white/5">
                        <span>$ fabrica daemon --target={executionTarget} --role={selectedAgent}</span>
                        <span className="text-emerald-400 font-mono">PID 7104 [24/7 Autonomy]</span>
                      </div>

                      {currentAgent.logs.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className={cn(
                            'leading-relaxed break-all',
                            index === activeLogIndex ? 'text-orange-300 font-bold' : 'text-[#8A8A94]'
                          )}
                        >
                          {log}
                        </motion.div>
                      ))}

                      {isRunning && (
                        <div className="flex items-center gap-1.5 text-orange-400 pt-2 animate-pulse">
                          <span className="inline-block w-2 h-3.5 bg-orange-500" />
                          <span className="text-[11px]">Executing subtask in isolated git worktree / disk sandbox...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Diff / Verification Preview Status */}
                  <div className="mt-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-[#8A8A94] flex items-center gap-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Zero branch collisions detected
                    </span>
                    <span className="text-orange-400 font-semibold">100% Isolated Disk</span>
                  </div>
                </div>

                {/* Right Rail: Business Control Layer (3 Cols) */}
                <div className="lg:col-span-3 p-4 bg-[#0E0F17] flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8A8A94]">
                        Field Controls
                      </span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>

                    {/* Budget Cap Card */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8A8A94] font-medium">Monthly Task Budget</span>
                        <span className="text-white font-mono font-bold">$48.20 / $100.00</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                          style={{ width: '48.2%' }}
                        />
                      </div>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        ✓ Hard auto-stop guardrail active
                      </p>
                    </div>

                    {/* Approval Gate Widget */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8A8A94] font-medium">Pending Approval Gate</span>
                        <span
                          className={cn(
                            'text-[10px] font-mono px-1.5 py-0.5 rounded',
                            approvalGranted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          )}
                        >
                          {approvalGranted ? 'APPROVED' : 'AWAITING SIGN-OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/90 leading-tight">
                        Developer requests merge into staging with 0 regression risks.
                      </p>
                      <button
                        onClick={() => setApprovalGranted(!approvalGranted)}
                        className={cn(
                          'w-full py-2 rounded-lg text-xs font-semibold transition-all shadow',
                          approvalGranted
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] hover:brightness-110 text-white'
                        )}
                      >
                        {approvalGranted ? '✓ Action Verified & Merged' : 'Sign-Off & Approve Step'}
                      </button>
                    </div>

                    {/* Phone Companion Sync Status */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[#8A8A94]">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-blue-400" />
                          Phone App Sync
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px]">CONNECTED</span>
                      </div>
                      <p className="text-[10px] text-[#8A8A94]">
                        1-tap field approval ready on iOS / Android.
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-center font-mono text-[#8A8A94] pt-2 border-t border-white/5">
                    Fabrica Desktop Engine • Client-Side Keystore Active
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: KANBAN QUEUE */}
            {activeTab === 'kanban' && (
              <div className="p-6 bg-[#0B0C12] min-h-[460px]">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-orange-400" />
                      Continuous Task Queue & Kanban Workflow
                    </h3>
                    <p className="text-xs text-[#8A8A94]">
                      Background daemons automatically pull prioritized tickets into isolated git worktrees.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30">
                    7 Active Tasks • 0 Blockers
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Column 1: Backlog */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#8A8A94] pb-1 border-b border-white/10">
                      <span>BACKLOG ({initialKanbanCols.backlog.length})</span>
                      <span className="text-[10px]">Auto-Scheduled</span>
                    </div>
                    {initialKanbanCols.backlog.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#13141F] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-xs font-semibold text-white">{item.title}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A94]">
                          <span className="text-orange-400">@{item.agent}</span>
                          <span>Budget: {item.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2: In Isolated Worktree */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-blue-400 pb-1 border-b border-blue-500/30">
                      <span>IN WORKTREE ({initialKanbanCols.in_progress.length})</span>
                      <span className="text-[10px] animate-pulse">Running</span>
                    </div>
                    {initialKanbanCols.in_progress.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#141828] border border-blue-500/30 space-y-2 shadow-lg">
                        <div className="text-xs font-semibold text-white">{item.title}</div>
                        <div className="text-[10px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded inline-block">
                          {item.branch}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A94] pt-1">
                          <span className="text-orange-400">@{item.agent}</span>
                          <span className="text-emerald-400 font-bold">Spend: {item.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 3: Approval Gates */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-amber-400 pb-1 border-b border-amber-500/30">
                      <span>APPROVAL GATE ({initialKanbanCols.approval.length})</span>
                      <span className="text-[10px]">Field Review</span>
                    </div>
                    {initialKanbanCols.approval.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#1C1714] border border-amber-500/40 space-y-2.5">
                        <div className="text-xs font-semibold text-white">{item.title}</div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {item.risk}
                          </span>
                        </div>
                        <button
                          onClick={() => setApprovalGranted(true)}
                          className="w-full py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-[11px] shadow hover:brightness-110"
                        >
                          1-Click Sign-Off
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Column 4: Verified & Merged */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-emerald-400 pb-1 border-b border-emerald-500/30">
                      <span>VERIFIED & SHIPPED ({initialKanbanCols.verified.length})</span>
                      <span className="text-[10px]">Done</span>
                    </div>
                    {initialKanbanCols.verified.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-[#101915] border border-emerald-500/30 space-y-1.5 opacity-90">
                        <div className="text-xs font-semibold text-white flex items-center justify-between">
                          <span>{item.title}</span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A94]">
                          <span className="text-emerald-400">@{item.agent}</span>
                          <span>{item.spend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: EISENHOWER PRIORITIZATION MATRIX */}
            {activeTab === 'eisenhower' && (
              <div className="p-6 bg-[#0B0C12] min-h-[460px] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-orange-400" />
                      Eisenhower Strategic Prioritization Matrix
                    </h3>
                    <p className="text-xs text-[#8A8A94]">
                      Autonomous crew filters noise and isolates high-leverage outcomes from low-impact chores.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-orange-400 bg-orange-950/40 px-3 py-1 rounded-lg border border-orange-500/30">
                    Goal Tracking: 94% on target
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eisenhowerQuadrants.map((quad) => (
                    <div key={quad.id} className="p-4 rounded-xl bg-[#12131D] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{quad.title}</h4>
                          <p className="text-[11px] text-[#8A8A94]">{quad.subtitle}</p>
                        </div>
                        <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded border', quad.badgeColor)}>
                          {quad.badge}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {quad.tasks.map((task, tIdx) => {
                          const TIcon = task.icon
                          return (
                            <div key={tIdx} className="p-2.5 rounded-lg bg-[#090A0E] border border-white/5 flex items-start gap-2.5 text-xs">
                              <div className="p-1 rounded bg-white/5 text-orange-400 shrink-0 mt-0.5">
                                <TIcon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-medium truncate">{task.name}</div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A94] mt-1">
                                  <span>Assigned: {task.agent}</span>
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

            {/* TAB CONTENT 4: FIELD OPS & LOCAL SECURITY VAULT */}
            {activeTab === 'field_ops' && (
              <div className="p-6 bg-[#0B0C12] min-h-[460px] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      Field Ops, Human Approvals & Client-Side Vault
                    </h3>
                    <p className="text-xs text-[#8A8A94]">
                      Credentials remain 100% encrypted on your machine. Critical operations trigger multi-device approval alerts.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    <span>AES-256 Client Keystore Sealed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* High Risk Approval Trigger 1 */}
                  <div className="p-4 rounded-xl bg-[#141624] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Payment & Billing Gate</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">High Risk</span>
                    </div>
                    <p className="text-xs text-[#8A8A94]">
                      Agents cannot trigger Stripe payouts, invoice creation, or subscription mutations without explicit approval.
                    </p>
                    <div className="p-2.5 rounded bg-[#090A0E] text-[11px] font-mono text-white flex items-center justify-between">
                      <span>Threshold: &gt; $0.00</span>
                      <span className="text-emerald-400">Enforced</span>
                    </div>
                  </div>

                  {/* High Risk Approval Trigger 2 */}
                  <div className="p-4 rounded-xl bg-[#141624] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Production Deployments</span>
                      <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded">Critical</span>
                    </div>
                    <p className="text-xs text-[#8A8A94]">
                      Worktrees build & test in isolation. Merges into production require visual AST diff review and manual confirmation.
                    </p>
                    <div className="p-2.5 rounded bg-[#090A0E] text-[11px] font-mono text-white flex items-center justify-between">
                      <span>Zero-Regression Check</span>
                      <span className="text-emerald-400">14/14 Tests Passed</span>
                    </div>
                  </div>

                  {/* Phone Companion Quick Alert */}
                  <div className="p-4 rounded-xl bg-[#141624] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Mobile Companion App</span>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded">iOS / Android</span>
                    </div>
                    <p className="text-xs text-[#8A8A94]">
                      Away from your desk? Receive push notifications for pending approval gates and sign off with a single tap.
                    </p>
                    <div className="p-2.5 rounded bg-[#090A0E] text-[11px] font-mono text-white flex items-center justify-between">
                      <span>Sync Latency</span>
                      <span className="text-emerald-400">&lt; 40ms WebSockets</span>
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

