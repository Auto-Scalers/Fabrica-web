'use client'

import React from 'react'
import { Check, X, Sparkles, Flame } from 'lucide-react'
import { Reveal } from './Reveal'

// Typed comparison matrix data for easy customization
const comparisonRows = [
  {
    capability: 'Multi-Agent Crews (Roles)',
    fabrica: 'Built-in (Dev, Research, Mkt, Analyst)',
    doingAlone: 'Single person does everything',
    genericChat: 'Single bot prompted repeatedly',
  },
  {
    capability: 'Parallel Isolated Git Worktrees',
    fabrica: 'Native zero-collision worktrees',
    doingAlone: 'Manual branch juggling & stashing',
    genericChat: 'No file/repo awareness',
  },
  {
    capability: 'Real-time Budget Caps & Auto-Stops',
    fabrica: 'Strict per-task monetary limits',
    doingAlone: 'Manual spreadsheet tracking',
    genericChat: 'Unpredictable token burn',
  },
  {
    capability: 'Explicit Visual Approval Gates',
    fabrica: '1-click sign-off for critical steps',
    doingAlone: 'High manual review bottleneck',
    genericChat: 'Blind paste or no execution control',
  },
  {
    capability: 'Persistent Workspace Context',
    fabrica: 'Remembers full project architecture',
    doingAlone: 'Scattered notes & broken tabs',
    genericChat: 'Context wiped every few prompts',
  },
  {
    capability: 'Visual Command Center (No Prompt Craft)',
    fabrica: 'Outcome-driven UI controls',
    doingAlone: 'Brittle bash scripts & copy-paste',
    genericChat: 'Endless prompt re-engineering',
  },
  {
    capability: '24/7 Autonomous Execution (Local & Remote)',
    fabrica: 'Runs independently with guardrails',
    doingAlone: 'You must stay awake at 11 PM',
    genericChat: 'Requires active chat session',
  },
  {
    capability: 'Extends Beyond Code to Ops & Growth',
    fabrica: 'Native business skills & plugins',
    doingAlone: 'Context fragmented across 5 SaaS tools',
    genericChat: 'Shallow general-purpose text',
  },
]

export const ComparisonSection = () => {
  return (
    <section id="comparison" className="relative py-20 lg:py-32 border-t border-white/5 bg-[#090A0F] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs font-mono text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE ARCHITECTURAL DIFFERENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Fabrica Compares
          </h2>

          <p className="text-base sm:text-lg text-[#8A8A94]">
            Why solo builders, agency leads, and lean teams switch from fragile prompt windows to an Agentic Development Environment.
          </p>
        </Reveal>

        {/* Comparison Table */}
        <div className="mt-12 overflow-x-auto">
          <div className="min-w-[720px] rounded-2xl border border-white/10 bg-[#0E0F17] shadow-2xl overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-12 bg-[#08090D] border-b border-white/10 p-4 text-xs font-mono">
              <div className="col-span-4 text-[#8A8A94] uppercase font-bold tracking-wider">
                Capability / Workflow
              </div>
              <div className="col-span-3 text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-4 w-4" />
                Fabrica
              </div>
              <div className="col-span-3 text-[#8A8A94] uppercase font-bold tracking-wider">
                Doing It Alone
              </div>
              <div className="col-span-2 text-[#8A8A94] uppercase font-bold tracking-wider">
                Generic AI Chats
              </div>
            </div>

            {/* Matrix Body Rows */}
            <div className="divide-y divide-white/5">
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 items-center text-xs hover:bg-white/[0.02] transition-colors"
                >
                  {/* Capability Column */}
                  <div className="col-span-4 font-semibold text-white pr-3">
                    {row.capability}
                  </div>

                  {/* Fabrica Column (Highlighted) */}
                  <div className="col-span-3 font-mono font-medium text-orange-300 flex items-center gap-2 pr-3">
                    <div className="p-1 rounded-full bg-orange-500/20 text-orange-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{row.fabrica}</span>
                  </div>

                  {/* Doing it alone Column */}
                  <div className="col-span-3 text-[#8A8A94] flex items-center gap-2 pr-3">
                    <div className="p-1 rounded-full bg-red-950/40 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <span>{row.doingAlone}</span>
                  </div>

                  {/* Generic Chat Column */}
                  <div className="col-span-2 text-[#8A8A94] flex items-center gap-2">
                    <div className="p-1 rounded-full bg-red-950/40 text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <span>{row.genericChat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
