'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  GitBranch,
  DollarSign,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Sparkles,
} from 'lucide-react'

const pillars = [
  {
    icon: Users,
    title: 'Multi-Agent Crews',
    badge: 'PARALLEL ROLES',
    description:
      'Developer, Researcher, Marketer, and Analyst agents run toward one goal in parallel Ã¢â‚¬â€ instead of forcing a single prompt window to do four incompatible jobs.',
  },
  {
    icon: GitBranch,
    title: 'Parallel Isolated Worktrees',
    badge: 'ZERO COLLISIONS',
    description:
      'Every task executes on its own isolated git worktree or disk sandbox. Your main branch stays pristine Ã¢â‚¬â€ no stashing, no merge conflicts, no cross-task pollution.',
  },
  {
    icon: DollarSign,
    title: 'Hard Budget Auto-Stops',
    badge: 'FINANCIAL GUARDRAILS',
    description:
      'Set per-task, per-agent, or per-project monetary caps. The instant a thread hits its ceiling, Fabrica halts execution and releases worktree locks.',
  },
  {
    icon: ShieldCheck,
    title: 'Visual Approval Gates',
    badge: '1-TAP SIGN-OFF',
    description:
      'High-stakes milestones Ã¢â‚¬â€ payment bindings, production deploys, public campaigns Ã¢â‚¬â€ pause for a clean AST diff review and one-tap authorization.',
  },
  {
    icon: KeyRound,
    title: 'BYOK Client-Side Vault',
    badge: 'AES-256 GCM',
    description:
      'Your API keys, SSH credentials, and OAuth tokens are encrypted locally in your OS keychain. Zero cloud key storage, zero third-party egress.',
  },
  {
    icon: Smartphone,
    title: '24/7 Autonomy & Mobile Oversight',
    badge: 'DAEMONS + COMPANION',
    description:
      'Background daemons keep shipping while you sleep. Approve gates, inspect diffs, or hit the killswitch from your iOS / Android companion.',
  },
]

export const WhyFabrica = () => {
  return (
    <section id="product-pillars" className="relative py-20 lg:py-28 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE CORE PILLARS</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight">
            Why founders direct the crew.
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Six mechanical promises that turn chaotic prompt-juggling into a supervised, budget-capped autonomous factory.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative group p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-950/20 transition-all space-y-3"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] bg-[var(--overlay-5)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-strong)] group-hover:text-orange-300 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{pillar.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyFabrica