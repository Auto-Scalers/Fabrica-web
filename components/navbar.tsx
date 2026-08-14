'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'Crew', href: '#crew' },
    { name: 'How It Works', href: '#command-center' },
    { name: 'Controls', href: '#controls' },
    { name: 'Comparison', href: '#comparison' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 p-1 shadow-lg shadow-black/40 transition-transform group-hover:scale-105">
            <img
              src="/fabrica-logo_icon.svg"
              alt="Fabrica Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Fabrica
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-950/60 border border-orange-500/30 text-orange-400 font-normal">
                v3.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#8A8A94]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <ShimmerButton
            shimmerColor="#FFD0A6"
            borderRadius="12px"
            background="linear-gradient(90deg, #E8590C, #FF8A3D)"
            className="px-4 py-2 text-xs font-semibold shadow-md shadow-orange-950/50"
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Get Early Access</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </ShimmerButton>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#8A8A94] hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0A0A0F]/95 backdrop-blur-2xl px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#8A8A94]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10">
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#FF8A3D] py-2.5 text-xs font-semibold text-white shadow-md"
            >
              <span>Get Early Access</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar
