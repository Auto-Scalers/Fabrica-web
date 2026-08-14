'use client'

import React from 'react'
import Image from 'next/image'
import { Sparkles, CheckCircle2, ShieldCheck, GitBranch } from 'lucide-react'
import { Reveal } from './Reveal'

export const TurnSection = () => {
  return (
    <section className="relative py-20 lg:py-28 border-t border-white/5 bg-[#090A0F] overflow-hidden">
      {/* Background molten forge glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: The Pivot Message */}
          <Reveal className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs font-mono text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE PIVOT POINT</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              This is Fabrica.
              <span className="block text-2xl sm:text-4xl font-normal text-[#8A8A94] mt-2">
                One command center. Your entire crew in parallel.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#8A8A94] leading-relaxed">
              Instead of manually shepherding one AI through twelve prompts, you assign goals to specialized agent roles. They execute in isolated git worktrees, respect real-time budget caps, and report back with verified diffs.
            </p>

            {/* Core mechanical shifts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-white">
                <CheckCircle2 className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Parallel execution:</strong> Developer, Researcher, and Marketer run simultaneously without branch collisions.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Hard budget caps:</strong> Execution halts automatically the instant token spend reaches your limit.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-white">
                <GitBranch className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Zero-friction review:</strong> Visual approval gates let you inspect clean diffs before merging.</span>
              </div>
            </div>
          </Reveal>

          {/* Right: Calm, high-fidelity command center workstation image */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0E0F17] group">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/desk_solution_forge.jpg"
                alt="Calm, organized Fabrica command center workspace"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0E] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090A0E]/90 border border-white/10 backdrop-blur-md">
              <p className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                STATUS: Calm Execution // All Worktrees Synced
              </p>
              <p className="text-xs text-[#8A8A94] mt-1">
                4 parallel crew threads active. Hard budget limit set. Zero branch collisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
