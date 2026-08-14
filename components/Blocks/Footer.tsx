'use client'

import React from 'react'
import Link from 'next/link'

const footerLinks = {
  product: [
    { name: 'Multi-Agent Crews', href: '#crew' },
    { name: 'Command Center', href: '#command-center' },
    { name: 'Isolated Git Worktrees', href: '#command-center' },
    { name: 'Business Control Layer', href: '#controls' },
    { name: 'Pricing & Plans', href: '#pricing' },
  ],
  capabilities: [
    { name: 'Developer Agent', href: '#crew' },
    { name: 'Researcher Agent', href: '#crew' },
    { name: 'Marketer Agent', href: '#crew' },
    { name: 'Business Analyst Agent', href: '#crew' },
    { name: 'Extensible Plugins', href: '#controls' },
  ],
  company: [
    { name: 'Founding Manifesto', href: '#product' },
    { name: 'Comparison Matrix', href: '#comparison' },
    { name: 'Changelog', href: '#waitlist' },
    { name: 'Documentation', href: '#faq' },
    { name: 'Contact & Support', href: '#waitlist' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Security & Isolation Specs', href: '#controls' },
  ],
}

export const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[#07080C] text-[var(--text-muted)] text-xs command-frame">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info (2 cols) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--overlay-5)] border border-[var(--border-subtle)] p-1 text-[var(--text-strong)]">
                <img
                  src="/fabrica-logo_icon.svg"
                  alt="Fabrica Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-base font-bold tracking-tight text-[var(--text-strong)]">Fabrica</span>
            </Link>

            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              Business-First, Coding-First Agentic Development Environment for solo founders, independent consultants, and lean teams.
            </p>

            {/* Operational Status */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--overlay-weak)] border border-[var(--border-subtle)] text-[11px] font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (v3.0.4)</span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-strong)]">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="hover:text-[var(--text-strong)] transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-strong)]">Capabilities</h4>
            <ul className="space-y-2">
              {footerLinks.capabilities.map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="hover:text-[var(--text-strong)] transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-strong)]">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="hover:text-[var(--text-strong)] transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-faint)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[var(--text-muted)]">
          <p>Ã‚Â© {new Date().getFullYear()} Fabrica Systems Inc. All rights reserved. &ldquo;The Next AI Exit.&rdquo;</p>
          <div className="flex items-center gap-6">
            <a href="#controls" className="hover:text-[var(--text-strong)] transition-colors">
              Security & Sandboxing
            </a>
            <a href="#pricing" className="hover:text-[var(--text-strong)] transition-colors">
              Pricing Guardrails
            </a>
            <a href="#waitlist" className="hover:text-[var(--text-strong)] transition-colors">
              Priority Access
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
