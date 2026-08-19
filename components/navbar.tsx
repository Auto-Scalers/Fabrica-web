'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname, Link as IntlLink } from '@/src/i18n/navigation'
import { useLocale } from 'next-intl'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const navLinks = [
    { name: t('product'), href: '#product' },
    { name: t('crew'), href: '#crew' },
    { name: t('howItWorks'), href: '#command-center' },
    { name: t('controls'), href: '#controls' },
    { name: t('comparison'), href: '#comparison' },
    { name: t('pricing'), href: '#pricing' },
    { name: t('faq'), href: '#faq' },
    { name: t('docs'), href: '/docs' },
  ]

  const renderNavItem = (link: { name: string; href: string }) =>
    link.href.startsWith('/') ? (
      <IntlLink
        key={link.name}
        href={link.href}
        className="transition-colors hover:text-[var(--text-strong)]"
      >
        {link.name}
      </IntlLink>
    ) : (
      <a
        key={link.name}
        href={link.href}
        className="transition-colors hover:text-[var(--text-strong)]"
      >
        {link.name}
      </a>
    )

  const locales = ['en', 'fr', 'ar'] as const

  const switchLocale = (l: string) => {
    const hash = window.location.hash
    router.replace(pathname + hash, { locale: l })
  }

  const localeSwitcher = (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
            locale === l
              ? 'text-orange-400 bg-orange-950/60 border border-orange-500/30'
              : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
          }`}
          aria-label={`Switch to ${l.toUpperCase()}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-[var(--border-subtle)] transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--overlay-5)] border border-[var(--border-subtle)] p-1 shadow-lg shadow-black/40 transition-transform group-hover:scale-105">
            <img
              src="/fabrica-logo_icon.svg"
              alt="Fabrica Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[var(--text-strong)] flex items-center gap-1.5">
              Fabrica
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-950/60 border border-orange-500/30 text-orange-400 font-normal">
                v3.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--text-muted)]">
          {navLinks.map(renderNavItem)}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {localeSwitcher}
          <AnimatedThemeToggler className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--overlay-5)] transition-colors" aria-label="Toggle theme" />
          <ShimmerButton
            shimmerColor="#FFD0A6"
            borderRadius="12px"
            background="linear-gradient(90deg, #E8590C, #FF8A3D)"
            className="px-4 py-2 text-xs font-semibold shadow-md shadow-orange-950/50"
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>{t('getEarlyAccess')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </ShimmerButton>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--overlay-5)] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-background/95 backdrop-blur-2xl px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[var(--text-muted)]">
            {navLinks.map((link) => {
              const el = renderNavItem(link);
              if (link.href.startsWith('/')) return el;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[var(--text-strong)] transition-colors"
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-center gap-1 mb-3">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                    locale === l
                      ? 'text-orange-400 bg-orange-950/60 border border-orange-500/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                  }`}
                  aria-label={`Switch to ${l.toUpperCase()}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <AnimatedThemeToggler className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors" aria-label="Toggle theme" />
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] py-2.5 text-xs font-semibold text-white shadow-md"
            >
              <span>{t('getEarlyAccess')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar
