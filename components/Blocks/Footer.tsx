'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export const Footer = () => {
  const t = useTranslations('footer')

  const footerLinks = {
    product: [
      { name: t('links.crews'), href: '#crew' },
      { name: t('links.commandCenter'), href: '#command-center' },
      { name: t('links.worktrees'), href: '#command-center' },
      { name: t('links.controlLayer'), href: '#controls' },
      { name: t('links.pricing'), href: '#pricing' },
    ],
    capabilities: [
      { name: t('links.devAgent'), href: '#crew' },
      { name: t('links.researchAgent'), href: '#crew' },
      { name: t('links.mktAgent'), href: '#crew' },
      { name: t('links.analystAgent'), href: '#crew' },
      { name: t('links.plugins'), href: '#controls' },
    ],
    company: [
      { name: t('links.manifesto'), href: '#product' },
      { name: t('links.comparison'), href: '#comparison' },
      { name: t('links.changelog'), href: '#waitlist' },
      { name: t('links.docs'), href: '#faq' },
      { name: t('links.support'), href: '#waitlist' },
    ],
    legal: [
      { name: t('links.privacy'), href: '#' },
      { name: t('links.terms'), href: '#' },
      { name: t('links.security'), href: '#controls' },
    ],
  }

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
              {t('tagline')}
            </p>

            {/* Operational Status */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--overlay-weak)] border border-[var(--border-subtle)] text-[11px] font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('operational')}</span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-strong)]">{t('product')}</h4>
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
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-strong)]">{t('capabilities')}</h4>
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
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-strong)]">{t('company')}</h4>
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
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-6">
            <a href="#controls" className="hover:text-[var(--text-strong)] transition-colors">
              {t('securitySandbox')}
            </a>
            <a href="#pricing" className="hover:text-[var(--text-strong)] transition-colors">
              {t('pricingGuardrails')}
            </a>
            <a href="#waitlist" className="hover:text-[var(--text-strong)] transition-colors">
              {t('priorityAccess')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
