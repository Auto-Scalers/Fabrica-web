'use client'

import React, { useState, useEffect } from 'react'
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
import { Reveal } from './Reveal'

const workflowSteps = [
  {
    step: '01',
    name: 'Draft Spec & Scope',
    tagline: 'Define the objective in plain business terms.',
    desc: 'Assign the outcome to a crew role. No fragile prompt crafting — Fabrica generates structured execution plans with clear test suites and file change proposals.',
  },
  {
    step: '02',
    name: 'Plan & Worktree Scaffold',
    tagline: 'Isolate execution in dedicated git worktrees.',
    desc: 'Each agent spins up an isolated disk folder or git worktree. Tasks run in parallel without touching your master branch, stashing uncommitted code, or polluting workspace files.',
  },
  {
    step: '03',
    name: 'Parallel GPU Execution',
    tagline: 'Autonomous execution inside budget & permission bounds.',
    desc: 'Ghostty-speed multiplexed terminals run background daemons for Developer, Researcher, and Marketer simultaneously under hard monetary auto-stops.',
  },
  {
    step: '04',
    name: 'Inspect, QA & Sign-Off',
    tagline: 'AST diff review, headless browser QA, and mobile 1-tap sign-off.',
    desc: 'Review unified AST diffs, test results, Playwright UI assertions, and sourced reports in the visual command center or on your phone before merging.',
  },
]

export const OrchestrationSection = () => {
  const [activeStep, setActiveStep] = useState(1)
  const [simProgress, setSimProgress] = useState(74)
  const [activeEngineView, setActiveEngineView] = useState<'worktrees' | 'spec_editor' | 'terminals' | 'browser_qa' | 'mobile_sync'>('worktrees')

  // Simulation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSimProgress((prev) => (prev >= 100 ? 20 : prev + 4))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="command-center"
      className="relative py-20 lg:py-32 border-t border-white/5 bg-[#0A0A0F] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/30 px-3.5 py-1 text-xs font-mono text-blue-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>HOW IT ACTUALLY WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Parallel Isolated Worktrees.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#E8590C]">
              Zero Collisions. 24/7 Autonomy.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#8A8A94] leading-relaxed">
            Instead of bottlenecking on a single prompt window, Fabrica pairs Ghostty-speed terminal orchestration with isolated Git worktrees, Markdown plan drafting, Playwright browser QA, and phone-synced approvals.
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
                  ? 'bg-[#141622] border-orange-500/60 shadow-lg shadow-orange-950/20'
                  : 'bg-[#0E0F17] border-white/10 hover:border-white/20'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400 font-bold">{s.step}</span>
                  {activeStep === idx && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                      ACTIVE PHASE
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mt-2">{s.name}</h3>
                <p className="text-xs font-medium text-orange-300/80 mt-0.5">{s.tagline}</p>
                <p className="text-xs text-[#8A8A94] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Orchestration Command Center Simulation */}
        <div className="mt-10 rounded-2xl border border-white/15 bg-[#0D0E15] shadow-2xl overflow-hidden">
          {/* Top Engine Navigation Bar */}
          <div className="px-5 py-3.5 bg-[#07080C] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveEngineView('worktrees')}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5',
                  activeEngineView === 'worktrees'
                    ? 'bg-orange-500 text-white font-bold shadow'
                    : 'text-[#8A8A94] hover:text-white'
                )}
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>Git Worktrees (3)</span>
              </button>

              <button
                onClick={() => setActiveEngineView('spec_editor')}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5',
                  activeEngineView === 'spec_editor'
                    ? 'bg-orange-500 text-white font-bold shadow'
                    : 'text-[#8A8A94] hover:text-white'
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Markdown Plan Spec</span>
              </button>

              <button
                onClick={() => setActiveEngineView('terminals')}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5',
                  activeEngineView === 'terminals'
                    ? 'bg-orange-500 text-white font-bold shadow'
                    : 'text-[#8A8A94] hover:text-white'
                )}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>GPU Terminals</span>
              </button>

              <button
                onClick={() => setActiveEngineView('browser_qa')}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5',
                  activeEngineView === 'browser_qa'
                    ? 'bg-orange-500 text-white font-bold shadow'
                    : 'text-[#8A8A94] hover:text-white'
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Headless QA Browser</span>
              </button>

              <button
                onClick={() => setActiveEngineView('mobile_sync')}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5',
                  activeEngineView === 'mobile_sync'
                    ? 'bg-orange-500 text-white font-bold shadow'
                    : 'text-[#8A8A94] hover:text-white'
                )}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Phone Companion</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSimProgress(15)}
                className="flex items-center gap-1.5 text-[#8A8A94] hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Local & Remote Daemons Synced
              </span>
            </div>
          </div>

          {/* VIEW 1: GIT WORKTREES CANVAS */}
          {activeEngineView === 'worktrees' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              {/* Thread 1: Developer Worktree */}
              <div className="p-4 rounded-xl bg-[#11121B] border border-orange-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-orange-400" />
                    <span className="text-white font-bold">worktree/feat-auth</span>
                  </div>
                  <span className="text-[10px] text-orange-400 bg-orange-950/40 px-1.5 py-0.5 rounded">
                    DEVELOPER
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#8A8A94]">
                  <div className="text-white">Task: Idempotent token refresh & middleware</div>
                  <div>Status: Writing test suites & AST transforms</div>
                  <div className="text-blue-400">$ vitest run src/auth --coverage</div>
                </div>
                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[#8A8A94]">
                    <span>Execution Progress</span>
                    <span className="text-orange-400">{simProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  0 collision with main branch
                </div>
              </div>

              {/* Thread 2: Researcher Worktree */}
              <div className="p-4 rounded-xl bg-[#11121B] border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-bold">worktree/research-api</span>
                  </div>
                  <span className="text-[10px] text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded">
                    RESEARCHER
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#8A8A94]">
                  <div className="text-white">Task: Token pricing & latency benchmarks</div>
                  <div>Status: Polling Stripe vs Paddle latency specs</div>
                  <div className="text-emerald-400">✓ Sourced 8 primary technical papers</div>
                </div>
                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[#8A8A94]">
                    <span>Synthesis Confidence</span>
                    <span className="text-blue-400">96.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '96.4%' }} />
                  </div>
                </div>
                <div className="text-[10px] text-blue-400 flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  Report logged: /outcomes/latency.md
                </div>
              </div>

              {/* Thread 3: Verification & Merge Gateway */}
              <div className="p-4 rounded-xl bg-[#11121B] border border-emerald-500/30 space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-4 w-4 text-emerald-400" />
                      <span className="text-white font-bold">Verification Gate</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      STAGE 4
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A8A94] leading-relaxed">
                    Changes tested in isolation. Ready to merge into primary release with zero manual stash juggling.
                  </p>
                  <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] text-emerald-300">
                    ✓ Diff checked • 0 Regression Risks • Budget Spent: $14.20
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                  <GitMerge className="h-3.5 w-3.5" />
                  <span>Approve & Merge Worktrees</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: MARKDOWN PLAN & SPEC EDITOR */}
          {activeEngineView === 'spec_editor' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
              <div className="lg:col-span-6 p-4 rounded-xl bg-[#090A0F] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[#8A8A94]">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-orange-400" />
                    specs/jwt-rotation-plan.md
                  </span>
                  <span className="text-emerald-400 text-[10px]">PARSED BY AGENT</span>
                </div>
                <div className="space-y-2 text-[#8A8A94] leading-relaxed">
                  <p className="text-white font-semibold"># Objective: Zero-downtime JWT Key Rotation</p>
                  <p>1. Introduce dual-key verification in <code className="text-orange-300">src/auth/jwt.ts</code>.</p>
                  <p>2. Verify incoming request headers against primary and grace keys.</p>
                  <p>3. Emit structured telemetry to Prometheus buffer.</p>
                  <div className="p-2.5 rounded bg-black/50 border border-white/5 text-[11px] text-amber-300">
                    ⚠️ Guardrail: Auto-kill if migration token spend exceeds $20.00.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 p-4 rounded-xl bg-[#090A0F] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[#8A8A94]">
                  <span className="text-white font-bold">PROPOSED FILE MODIFICATIONS (3)</span>
                  <span className="text-orange-400 font-bold">+42 / -8 lines</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between text-white">
                    <span>src/auth/jwt-provider.ts</span>
                    <span className="text-emerald-400 font-mono">+28 lines</span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between text-white">
                    <span>src/middleware/session-guard.ts</span>
                    <span className="text-emerald-400 font-mono">+14 lines</span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between text-white">
                    <span>tests/auth/rotation.test.ts</span>
                    <span className="text-emerald-400 font-mono">NEW FILE (8 tests)</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center text-[10px] text-[#8A8A94]">
                  <span>AST Parse: Clean</span>
                  <span className="text-emerald-400 font-bold">✓ Ready for isolated branch dispatch</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: GHOSTTY-SPEED GPU TERMINALS */}
          {activeEngineView === 'terminals' && (
            <div className="p-6 bg-[#07080C] min-h-[300px] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[#8A8A94]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-orange-400" />
                  <span className="text-white font-bold">Ghostty GPU-Accelerated Multiplexer (3 Active Terminals)</span>
                </div>
                <span className="text-emerald-400 text-[10px]">120 FPS Native Render</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black border border-orange-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-orange-400 pb-1 border-b border-white/10">
                    <span>TTY-1 // claude-code agent [worktree/feat-auth]</span>
                    <span className="text-emerald-400">ACTIVE</span>
                  </div>
                  <p className="text-[#8A8A94]">$ git worktree add ../auth-branch -b feat/jwt</p>
                  <p className="text-white">✓ Created worktree in 14ms</p>
                  <p className="text-[#8A8A94]">$ npx vitest run --silent</p>
                  <p className="text-emerald-400">✓ 8 tests passed (0 failures)</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-blue-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-blue-400 pb-1 border-b border-white/10">
                    <span>TTY-2 // researcher agent [worktree/intel]</span>
                    <span className="text-blue-400">STREAMING</span>
                  </div>
                  <p className="text-[#8A8A94]">$ fabrica research --deep --topic=&apos;stripe vs lemon&apos;</p>
                  <p className="text-blue-300">→ Polling 34 merchant of record pricing tiers</p>
                  <p className="text-white">✓ Generated structured comparative analysis</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: HEADLESS BROWSER QA */}
          {activeEngineView === 'browser_qa' && (
            <div className="p-6 bg-[#08090E] min-h-[300px] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span className="text-white font-bold">Playwright Headless Browser QA Engine</span>
                </div>
                <span className="text-emerald-400 text-[10px]">ALL ASSERTIONS GREEN</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[#8A8A94] text-[11px]">
                  <span>Scenario: Auth Flow E2E Login & Token Refresh</span>
                  <span className="text-emerald-400 font-bold">Status: 200 OK (210ms)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[#8A8A94] block">Step 1: POST /api/login</span>
                    <span className="text-emerald-400 font-bold">✓ Cookie Dispatched</span>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[#8A8A94] block">Step 2: Refresh Trigger</span>
                    <span className="text-emerald-400 font-bold">✓ Dual Key Validated</span>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[#8A8A94] block">Step 3: Visual Regression</span>
                    <span className="text-emerald-400 font-bold">✓ 0px Diff Detected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: PHONE COMPANION APP */}
          {activeEngineView === 'mobile_sync' && (
            <div className="p-6 bg-[#090A10] min-h-[300px] font-mono text-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/40 border border-blue-500/30 text-blue-400 text-[10px]">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>iOS & Android Native Mobile App</span>
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  Direct your crews while away from your keyboard.
                </h3>
                <p className="text-xs text-[#8A8A94] leading-relaxed font-sans">
                  Get instant push notifications when agents complete a worktree branch, trigger approval gates for payments/deployments, or hit 80% budget ceilings.
                </p>
                <div className="flex gap-3 text-[11px]">
                  <span className="text-emerald-400">✓ 1-Tap Approvals</span>
                  <span className="text-orange-400">✓ Live TTY Streaming</span>
                  <span className="text-blue-400">✓ Killswitch Toggle</span>
                </div>
              </div>

              {/* Mobile Simulation Frame */}
              <div className="w-full max-w-[260px] p-3 rounded-2xl bg-black border-2 border-white/20 shadow-2xl space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-[#8A8A94] pb-1 border-b border-white/10">
                  <span>9:41 AM</span>
                  <span className="text-emerald-400">Fabrica Mobile</span>
                </div>
                <div className="p-2 rounded-lg bg-[#141824] border border-blue-500/30 space-y-1">
                  <span className="text-[10px] text-orange-400 block font-bold">Approval Required</span>
                  <p className="text-[10px] text-white">Developer agent ready to deploy staging patch #882.</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="flex-1 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    Approve
                  </button>
                  <button className="flex-1 py-1 rounded bg-white/10 text-[#8A8A94] text-[10px]">
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

