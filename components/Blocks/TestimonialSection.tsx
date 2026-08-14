'use client'

import React from 'react'
import { Quote, UserCheck, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Reveal } from './Reveal'

// TODO: replace with real customer testimonials before launch
const testimonials = [
  {
    role: 'Beta User — Solo Founder & SaaS Builder',
    focus: 'Full-stack Product Execution',
    quote:
      'I was spending half my evening copying code between chat tabs and praying nothing broke. Having dedicated agents working in isolated git worktrees with strict budget caps gave me my entire week back.',
    metric: '14+ hrs saved per sprint',
  },
  {
    role: 'Beta User — Independent Technical Consultant',
    focus: 'Client Architecture & Research',
    quote:
      'The Researcher and Developer crew pattern is a game changer for client deliveries. The researcher pulls verified benchmarks while the developer builds the patch in a sandbox. Zero context collisions.',
    metric: '3x faster client turnaround',
  },
  {
    role: 'Beta User — Growth Lead at Early-Stage Startup',
    focus: 'Multi-Campaign Synthesis & Ops',
    quote:
      'The ability to set hard monetary caps on autonomous runs removed the fear of runaway API bills. We run market sweeps and positioning tests 24/7 without worrying about budget blowouts.',
    metric: '100% budget adherence',
  },
]

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="relative py-20 lg:py-28 border-t border-white/5 bg-[#0C0D14] overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs font-mono text-orange-400">
            <UserCheck className="h-3.5 w-3.5" />
            <span>EARLY ADOPTER FEEDBACK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for those who carry the whole company.
          </h2>

          <p className="text-base sm:text-lg text-[#8A8A94]">
            How solo founders, independent consultants, and lean operators direct multi-agent crews.
          </p>
        </Reveal>

        {/* 3-Card Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#11121B] flex flex-col justify-between space-y-6 hover:border-orange-500/30 transition-all"
            >
              <div className="space-y-4">
                <Quote className="h-6 w-6 text-orange-400 opacity-60" />
                <p className="text-sm text-[#F5F5F7] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar size="lg" className="border border-white/10 bg-white/[0.04]">
                  <AvatarFallback className="bg-orange-950/40 text-orange-400">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">{t.role}</div>
                  <div className="text-[11px] text-[#8A8A94] font-mono">{t.focus}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-xs font-mono text-orange-400 font-semibold">{t.metric}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
