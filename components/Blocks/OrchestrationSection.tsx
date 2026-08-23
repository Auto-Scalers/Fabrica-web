'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  GitBranch,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  GitMerge,
  Cpu,
  FileText,
  Terminal,
  Globe,
  Smartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Reveal } from './Reveal'

export const OrchestrationSection = () => {
  const t = useTranslations('orchestration')
  const [activeStep, setActiveStep] = useState(1)
  const [simProgress, setSimProgress] = useState(74)
  const [activeEngineView, setActiveEngineView] = useState<'worktrees' | 'spec_editor' | 'terminals' | 'browser_qa' | 'mobile_sync'>('worktrees')

  const workflowSteps = [
    {
      step: '01',
      name: t('step1.name'),
      tagline: t('step1.tagline'),
      desc: t('step1.desc'),
    },
    {
      step: '02',
      name: t('step2.name'),
      tagline: t('step2.tagline'),
      desc: t('step2.desc'),
    },
    {
      step: '03',
      name: t('step3.name'),
      tagline: t('step3.tagline'),
      desc: t('step3.desc'),
    },
    {
      step: '04',
      name: t('step4.name'),
      tagline: t('step4.tagline'),
      desc: t('step4.desc'),
    },
  ]

  // Simulation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSimProgress((prev) => (prev >= 100 ? 20 : prev + 4))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="how-it-works"
      className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-page)] overflow-hidden scroll-mt-20"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/30 px-3.5 py-1 text-xs font-mono text-blue-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
            {t('headline')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#E8590C]">
              {t('headlineGradient')}
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            {t('paragraph')}
          </p>
        </Reveal>

        {/* 4-Step Mental Model Ribbon */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={cn(
                'p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between',
                activeStep === idx
                  ? 'bg-[var(--surface-card)] border-orange-500/60 shadow-lg shadow-orange-950/20'
                  : 'bg-[var(--surface-panel)] border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400 font-bold">{s.step}</span>
                  {activeStep === idx && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                      {t('activePhase')}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[var(--text-strong)] mt-2">{s.name}</h3>
                <p className="text-xs font-medium text-orange-300/80 mt-0.5">{s.tagline}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Orchestration Command Center Simulation */}
        <div className="mt-10 rounded-2xl border border-[var(--border-subtle)] bg-[#0D0E15] shadow-2xl overflow-hidden command-frame max-w-full">
          {/* Top Engine Navigation Bar */}
          <div className="px-4 sm:px-5 py-3.5 bg-[#07080C] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-1 bg-black/50 p-1 rounded-lg border border-[var(--border-subtle)]">
              <button
                onClick={() => setActiveEngineView('worktrees')}
                className={cn(
                  'px-3 py-2 sm:py-1.5 rounded-md transition-all flex items-center gap-1.5 min-h-[36px]',
                  activeEngineView === 'worktrees'
                    ? 'bg-orange-500 text-[var(--text-strong)] font-bold shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                )}
              >
                <GitBranch className="h-3.5 w-3.5 shrink-0" />
                <span>{t('gitWorktrees')}</span>
              </button>

              <button
                onClick={() => setActiveEngineView('spec_editor')}
                className={cn(
                  'px-3 py-2 sm:py-1.5 rounded-md transition-all flex items-center gap-1.5 min-h-[36px]',
                  activeEngineView === 'spec_editor'
                    ? 'bg-orange-500 text-[var(--text-strong)] font-bold shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                )}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>{t('markdownPlan')}</span>
              </button>

              <button
                onClick={() => setActiveEngineView('terminals')}
                className={cn(
                  'px-3 py-2 sm:py-1.5 rounded-md transition-all flex items-center gap-1.5 min-h-[36px]',
                  activeEngineView === 'terminals'
                    ? 'bg-orange-500 text-[var(--text-strong)] font-bold shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                )}
              >
                <Terminal className="h-3.5 w-3.5 shrink-0" />
                <span>{t('gpuTerminals')}</span>
              </button>

              <button
                onClick={() => setActiveEngineView('browser_qa')}
                className={cn(
                  'px-3 py-2 sm:py-1.5 rounded-md transition-all flex items-center gap-1.5 min-h-[36px]',
                  activeEngineView === 'browser_qa'
                    ? 'bg-orange-500 text-[var(--text-strong)] font-bold shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                )}
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>{t('headlessQA')}</span>
              </button>

              <button
                onClick={() => setActiveEngineView('mobile_sync')}
                className={cn(
                  'px-3 py-2 sm:py-1.5 rounded-md transition-all flex items-center gap-1.5 min-h-[36px]',
                  activeEngineView === 'mobile_sync'
                    ? 'bg-orange-500 text-[var(--text-strong)] font-bold shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                )}
              >
                <Smartphone className="h-3.5 w-3.5 shrink-0" />
                <span>{t('phoneCompanion')}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSimProgress(15)}
                className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t('reset')}</span>
              </button>
              <div className="h-4 w-px bg-[var(--overlay-10)]" />
              <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('localRemoteSynced')}
              </span>
            </div>
          </div>

          {/* VIEW 1: GIT WORKTREES CANVAS */}
          {activeEngineView === 'worktrees' && (
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 font-mono text-xs overflow-hidden">
              {/* Thread 1: Developer Worktree */}
              <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-orange-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-orange-400" />
                    <span className="text-[var(--text-strong)] font-bold">worktree/feat-auth</span>
                  </div>
                  <span className="text-[10px] text-orange-400 bg-orange-950/40 px-1.5 py-0.5 rounded">
                    {t('developer')}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[var(--text-muted)]">
                  <div className="text-[var(--text-strong)]">Task: Idempotent token refresh & middleware</div>
                  <div>Status: Writing test suites & AST transforms</div>
                  <div className="text-blue-400">$ vitest run src/auth --coverage</div>
                </div>
                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                    <span>{t('executionProgress')}</span>
                    <span className="text-orange-400">{simProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--overlay-10)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {t('collisionFree')}
                </div>
              </div>

              {/* Thread 2: Researcher Worktree */}
              <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-400" />
                    <span className="text-[var(--text-strong)] font-bold">worktree/research-api</span>
                  </div>
                  <span className="text-[10px] text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded">
                    {t('researcher')}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[var(--text-muted)]">
                  <div className="text-[var(--text-strong)]">Task: Token pricing & latency benchmarks</div>
                  <div>Status: Polling Stripe vs Paddle latency specs</div>
                  <div className="text-emerald-400">Ã¢Å"â€œ {t('sourcedPapers')}</div>
                </div>
                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                    <span>{t('synthesisConfidence')}</span>
                    <span className="text-blue-400">96.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--overlay-10)] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '96.4%' }} />
                  </div>
                </div>
                <div className="text-[10px] text-blue-400 flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  {t('reportLogged')}: /outcomes/latency.md
                </div>
              </div>

              {/* Thread 3: Verification & Merge Gateway */}
              <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-emerald-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-4 w-4 text-emerald-400" />
                      <span className="text-[var(--text-strong)] font-bold">{t('verificationGate')}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      {t('stage4')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {t('mergeReady')}
                  </p>
                  <div className="p-2 rounded bg-black/40 border border-[var(--border-faint)] text-[10px] text-emerald-300">
                    Ã¢Å"â€œ {t('diffChecked')}
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[var(--text-strong)] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                  <GitMerge className="h-3.5 w-3.5" />
                  <span>{t('approveMerge')}</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: MARKDOWN PLAN & SPEC EDITOR */}
          {activeEngineView === 'spec_editor' && (
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 font-mono text-xs overflow-hidden">
              <div className="lg:col-span-6 p-4 rounded-xl bg-[var(--surface-section)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <span className="text-[var(--text-strong)] font-bold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-orange-400" />
                    specs/jwt-rotation-plan.md
                  </span>
                  <span className="text-emerald-400 text-[10px]">PARSED BY AGENT</span>
                </div>
                <div className="space-y-2 text-[var(--text-muted)] leading-relaxed">
                  <p className="text-[var(--text-strong)] font-semibold">{t('specObjective')}</p>
                  <p>{t('specStep1')}</p>
                  <p>{t('specStep2')}</p>
                  <p>{t('specStep3')}</p>
                  <div className="p-2.5 rounded bg-black/50 border border-[var(--border-faint)] text-[11px] text-amber-300">
                    Ã¢Å¡Â Ã¯Â¸Â {t('specGuardrail')}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 p-4 rounded-xl bg-[var(--surface-section)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <span className="text-[var(--text-strong)] font-bold">{t('fileMods')}</span>
                  <span className="text-orange-400 font-bold">{t('linesChanged')}</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center justify-between text-[var(--text-strong)]">
                    <span>src/auth/jwt-provider.ts</span>
                    <span className="text-emerald-400 font-mono">+28 lines</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center justify-between text-[var(--text-strong)]">
                    <span>src/middleware/session-guard.ts</span>
                    <span className="text-emerald-400 font-mono">+14 lines</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)] flex items-center justify-between text-[var(--text-strong)]">
                    <span>tests/auth/rotation.test.ts</span>
                    <span className="text-emerald-400 font-mono">{t('newFile')}</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center text-[10px] text-[var(--text-muted)]">
                  <span>{t('astClean')}</span>
                  <span className="text-emerald-400 font-bold">Ã¢Å"â€œ {t('readyDispatch')}</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: GHOSTTY-SPEED GPU TERMINALS */}
          {activeEngineView === 'terminals' && (
            <div className="p-6 bg-[#07080C] min-h-[300px] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-orange-400" />
                  <span className="text-[var(--text-strong)] font-bold">{t('ghosttyTitle')}</span>
                </div>
                <span className="text-emerald-400 text-[10px]">{t('fpsRender')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black border border-orange-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-orange-400 pb-1 border-b border-[var(--border-subtle)]">
                    <span>TTY-1 // claude-code agent [worktree/feat-auth]</span>
                    <span className="text-emerald-400">{t('active')}</span>
                  </div>
                  <p className="text-[var(--text-muted)]">$ git worktree add ../auth-branch -b feat/jwt</p>
                  <p className="text-[var(--text-strong)]">Ã¢Å"â€œ Created worktree in 14ms</p>
                  <p className="text-[var(--text-muted)]">$ npx vitest run --silent</p>
                  <p className="text-emerald-400">Ã¢Å"â€œ 8 tests passed (0 failures)</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-blue-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 pb-1 border-b border-[var(--border-subtle)]">
                    <span>TTY-2 // researcher agent [worktree/intel]</span>
                    <span className="text-blue-400">{t('streaming')}</span>
                  </div>
                  <p className="text-[var(--text-muted)]">$ fabrica research --deep --topic=&apos;stripe vs lemon&apos;</p>
                  <p className="text-blue-300">Ã¢â€ â€™ Polling 34 merchant of record pricing tiers</p>
                  <p className="text-[var(--text-strong)]">Ã¢Å"â€œ Generated structured comparative analysis</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: HEADLESS BROWSER QA */}
          {activeEngineView === 'browser_qa' && (
            <div className="p-6 bg-[var(--surface-panel)] min-h-[300px] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span className="text-[var(--text-strong)] font-bold">{t('playwrightTitle')}</span>
                </div>
                <span className="text-emerald-400 text-[10px]">{t('allGreen')}</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
                  <span>{t('scenario')}</span>
                  <span className="text-emerald-400 font-bold">{t('status200')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-2.5 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)]">
                    <span className="text-[var(--text-muted)] block">{t('step1Label')}</span>
                    <span className="text-emerald-400 font-bold">Ã¢Å"â€œ {t('step1Status')}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)]">
                    <span className="text-[var(--text-muted)] block">{t('step2Label')}</span>
                    <span className="text-emerald-400 font-bold">Ã¢Å"â€œ {t('step2Status')}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--overlay-weak)] border border-[var(--border-faint)]">
                    <span className="text-[var(--text-muted)] block">{t('step3Label')}</span>
                    <span className="text-emerald-400 font-bold">Ã¢Å"â€œ {t('step3Status')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: PHONE COMPANION APP */}
          {activeEngineView === 'mobile_sync' && (
            <div className="p-6 bg-[var(--surface-panel)] min-h-[300px] font-mono text-xs flex items-center justify-center">
              {/* Mobile Simulation Frame */}
              <div className="w-full max-w-[260px] p-3 rounded-2xl bg-black border-2 border-[var(--border-subtle)] shadow-2xl space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)]">
                  <span>9:41 AM</span>
                  <span className="text-emerald-400">{t('fabricaMobile')}</span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--surface-card)] border border-blue-500/30 space-y-1">
                  <span className="text-[10px] text-orange-400 block font-bold">{t('approvalRequired')}</span>
                  <p className="text-[10px] text-[var(--text-strong)]">{t('approvalDesc')}</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="flex-1 py-1 rounded bg-emerald-600 text-[var(--text-strong)] font-bold text-[10px]">
                    {t('approve')}
                  </button>
                  <button className="flex-1 py-1 rounded bg-[var(--overlay-10)] text-[var(--text-muted)] text-[10px]">
                    {t('inspect')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Standalone mobile companion image + remote oversight text (always visible, two-column) */}
        <Reveal className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Remote oversight text */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/40 border border-blue-500/30 text-blue-400 text-[11px] font-mono">
              <Smartphone className="h-3.5 w-3.5" />
              <span>{t('mobileApp')}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-strong)] tracking-tight leading-tight">
              {t('mobileTitle')}
            </h3>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              {t('mobileDesc')}
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-sm">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {t('tapApprovals')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-orange-400">
                <Terminal className="h-4 w-4" />
                {t('liveTty')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-blue-400">
                <Globe className="h-4 w-4" />
                {t('killswitch')}
              </span>
            </div>
          </div>

          {/* Right: Standalone mobile companion image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-2xl bg-[var(--surface-panel)] w-full max-w-[320px] group">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/images/standalones/mobile-companion-remote.jpg"
                  alt={t('mobileTitle')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
