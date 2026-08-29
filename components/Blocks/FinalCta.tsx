'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight, Download, LogIn } from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/src/i18n/navigation'

export const FinalCta = () => {
  const t = useTranslations('cta')
  const router = useRouter()

  return (
    <section id="waitlist" className="fabrica-cta relative pt-4 sm:pt-6 pb-72 sm:pb-96 border-t border-[var(--border-faint)] bg-[var(--surface-section)] overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 bg-white/20 dark:bg-[#0B0C12]/75 pointer-events-none" />
      <div
        className="absolute inset-x-0 bottom-0 h-64 sm:h-80 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/fabrica-buttom-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Background molten forge glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/15 via-orange-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <Badge variant="copper-outline" className="h-auto gap-2 px-4 py-1.5 font-mono text-sm">
          <img
            src="/fabrica-logo_icon.svg"
            alt=""
            className="h-5 w-5 object-contain"
          />
          <span>{t('badge')}</span>
        </Badge>

        {/* Headline */}
        <h2 className="text-5xl sm:text-7xl font-extrabold text-[var(--text-strong)] tracking-tight leading-tight">
          {t('headline')}
        </h2>

        <p className="text-lg sm:text-2xl text-orange-700 dark:text-orange-200 max-w-2xl mx-auto leading-relaxed">
          {t('paragraph')}
        </p>

        {/* Two primary actions: Download + Sign in */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <ShimmerButton
            type="button"
            onClick={() => router.push('/download')}
            shimmerColor="#FFD0A6"
            borderRadius="12px"
            background="linear-gradient(90deg, #E8590C, #FF8A3D)"
            className="w-full px-7 py-3.5 text-base font-semibold shadow-xl shadow-orange-950/50 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span>{t('download')}</span>
            <ArrowRight className="h-4 w-4" />
          </ShimmerButton>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/api/auth/authorize'
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-7 py-3.5 text-base font-medium text-[var(--text-strong)] transition-all hover:border-[var(--border-subtle)] hover:bg-[var(--overlay-10)] sm:w-auto"
          >
            <LogIn className="h-4 w-4 text-orange-400" />
            <span>{t('signIn')}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
export default FinalCta
