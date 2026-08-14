'use client'

import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'
import { Badge } from '@/components/ui/badge'

const faqItems = [
  {
    question: 'What is an Agentic Development Environment (ADE)?',
    answer:
      'An Agentic Development Environment (ADE) is a dedicated desktop control plane that orchestrates multi-agent crews (Developer, Researcher, Marketer, Business Analyst) working in parallel. Unlike generic single-prompt chat windows that forget context and require constant manual steering, an ADE gives agents isolated git worktrees, Ghostty-speed GPU terminals, persistent project awareness, and real business guardrails.',
  },
  {
    question: 'How does Bring Your Own Key (BYOK) and client-side encryption work?',
    answer:
      'Fabrica is 100% BYOK. Your OpenAI, Anthropic, Gemini, DeepSeek, Stripe, and GitHub credentials are encrypted locally on your machine using AES-256 GCM in your operating system keychain. They never touch external cloud servers and are only decrypted in memory during isolated task execution.',
  },
  {
    question: 'How do Git worktrees prevent collisions when running 5+ agents?',
    answer:
      'Git worktrees allow multiple working directories to be linked to a single repository simultaneously. When Fabrica dispatches 3 developer tasks and 2 research sweeps, each task runs on its own isolated branch and disk tree. Your main working branch remains pristine with zero unstaged clutter, zero merge conflicts, and zero manual stash juggling.',
  },
  {
    question: 'How does the Mobile Companion app work?',
    answer:
      'The Fabrica iOS and Android companion app connects to your local desktop daemon or remote cloud workspace via end-to-end encrypted tunnels. You can inspect live terminal feeds, review unified diff summaries, toggle killswitches, and approve 1-click payment/deployment gates directly from your phone while away from your desk.',
  },
  {
    question: 'Do I need to know how to code to direct Fabrica?',
    answer:
      'No. While Fabrica is coding-first under the hood, the day-to-day command center is visual and outcome-driven. You assign objectives in plain language, set budget limits, and review unified diffs or reports before approving. Technical leads love the terminal multiplexing and AST diffs, while non-technical founders use it to direct full-stack execution without writing bash scripts.',
  },
  {
    question: 'How much control do I have over what agents do autonomously?',
    answer:
      'Complete control via a dynamic autonomy dial. You can configure Fabrica on strict step-by-step confirmation (every diff, external web request, or file write requires your 1-click approval) or allow continuous autonomous execution within hard financial caps and scoped directory permissions.',
  },
  {
    question: 'Can agents help with business work other than writing software?',
    answer:
      'Yes. Fabrica is built business-first. Your crew includes specialized Researcher, Marketer, and Business Analyst roles with extensible skills for competitor benchmarking, cold-outreach positioning, customer interview synthesis, unit economics modeling, and automated KPI auditing.',
  },
  {
    question: 'Local vs. Remote Ã¢â‚¬â€ what changes between running locally or in the cloud?',
    answer:
      'Fabrica operates natively on your local workstation (macOS, Windows, Linux) using local git worktrees and Ghostty-speed terminal emulation. For 24/7 background routines or heavy parallel sweeps, tasks can seamlessly dispatch to a headless remote VM or cloud worker over an encrypted SSH daemon tunnel.',
  },
]

export const FaqSection = () => {
  const [openValue, setOpenValue] = useState<string[]>(['0'])

  return (
    <section id="faq" className="relative py-20 lg:py-32 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[350px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="text-center space-y-4">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>COMMON QUESTIONS</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-strong)] tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-muted)]">
            Everything you need to know about the Fabrica Agentic Development Environment.
          </p>
        </Reveal>

        {/* Accordion List */}
        <div className="mt-12 space-y-3">
          <Accordion value={openValue} onValueChange={setOpenValue}>
            {faqItems.map((item, idx) => {
              const isOpen = openValue.includes(String(idx))
              return (
                <AccordionItem
                  key={idx}
                  value={String(idx)}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all not-last:border-b-0',
                    isOpen
                      ? 'bg-[var(--surface-card)] border-orange-500/40 shadow-lg'
                      : 'bg-[var(--surface-panel)] border-[var(--border-subtle)] hover:border-[var(--border-subtle)]'
                  )}
                >
                  <AccordionTrigger className="px-5 sm:px-6 py-5 sm:py-6 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:text-orange-400">
                    <span className="text-base sm:text-lg font-semibold text-[var(--text-strong)] pr-4">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
