'use client'

import React, { useState } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Reveal } from './Reveal'

// TODO: confirm pricing before launch
const pricingTiers = [
  {
    id: 'starter',
    name: 'Solo Builder',
    tagline: 'For solo founders and consultants replacing disjointed chat tabs.',
    priceMonthly: '$29',
    priceAnnual: '$24',
    period: '/month',
    badge: null,
    highlight: false,
    ctaText: 'Get Started Free',
    features: [
      '1 Concurrent Agent Crew (4 Roles)',
      'Parallel Isolated Git Worktrees',
      'Unified Desktop Command Center',
      'Hard Monthly Budget Auto-Stops',
      'Visual Approval Checkpoints',
      'Community Support & Templates',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    tagline: 'For growth leads, active agencies, and multi-project operators.',
    priceMonthly: '$79',
    priceAnnual: '$64',
    period: '/month',
    badge: 'MOST POPULAR',
    highlight: true,
    ctaText: 'Start Pro Trial',
    features: [
      'Unlimited Parallel Agent Crews',
      'Isolated Multi-Repo & Disk Sandboxing',
      'Extensible Business Skills & Plugins',
      'Custom Autonomy Spectrum Dials',
      'Per-Project Budget Allocation Rules',
      'Priority Model Router & Local LLM Support',
      '24/7 Autonomous Background Execution',
    ],
  },
  {
    id: 'team',
    name: 'Agency & Team',
    tagline: 'For boutique agencies and engineering squads managing multiple client scopes.',
    priceMonthly: '$199',
    priceAnnual: '$159',
    period: '/month',
    badge: 'SCALE',
    highlight: false,
    ctaText: 'Get Team Access',
    features: [
      'Multi-User Collaboration & Role Permissions',
      'Shared Crew Knowledge Base & Memories',
      'Centralized Team Budget & Audit Vault',
      'Dedicated Client Workspaces',
      'Custom Plugin & Skill Development SDK',
      'Dedicated Onboarding & Slack Channel',
    ],
  },
]

export const PricingSection = () => {
  const [annualBilling, setAnnualBilling] = useState(true)

  return (
    <section id="pricing" className="relative py-20 lg:py-32 border-t border-white/5 bg-[#090A0F] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-orange-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-950/30 px-3.5 py-1 text-xs font-mono text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable investment.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A3D] to-[#E8590C]">
              Zero runaway bills.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#8A8A94]">
            Every tier includes hard budget ceilings so autonomous execution never surprises you.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <ToggleGroup
              value={[annualBilling ? 'annual' : 'monthly']}
              onValueChange={(value) => {
                if (value[0] === 'annual' || value[0] === 'monthly') setAnnualBilling(value[0] === 'annual')
              }}
              spacing={2}
              className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10"
            >
              <ToggleGroupItem
                value="monthly"
                className="px-4 py-1.5 text-xs font-mono text-[#8A8A94] data-[state=on]:bg-white/10 data-[state=on]:text-white data-[state=on]:font-bold rounded-lg"
              >
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem
                value="annual"
                className="px-4 py-1.5 text-xs font-mono text-[#8A8A94] data-[state=on]:bg-white/10 data-[state=on]:text-white data-[state=on]:font-bold rounded-lg flex items-center gap-1.5"
              >
                Annual
                <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded font-bold">
                  SAVE 20%
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Reveal>

        {/* 3 Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative',
                tier.highlight
                  ? 'bg-[#141624] border-2 border-orange-500 shadow-2xl shadow-orange-950/40 lg:-translate-y-2'
                  : 'bg-[#0E0F17] border border-white/10 hover:border-white/20'
              )}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-[#8A8A94] mt-1 leading-relaxed">{tier.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {annualBilling ? tier.priceAnnual : tier.priceMonthly}
                  </span>
                  <span className="text-sm font-mono text-[#8A8A94]">{tier.period}</span>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-[#8A8A94] uppercase tracking-wider font-semibold">
                    Included capabilities:
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/90">
                        <Check className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card CTA */}
              <div className="pt-8">
                <a
                  href="#waitlist"
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2',
                    tier.highlight
                      ? 'bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] hover:brightness-110 text-white shadow-lg shadow-orange-950/40'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                  )}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
