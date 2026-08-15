'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export const ShowcaseCarousel = () => {
  const t = useTranslations('showcase')
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const slides = [
    {
      image: '/images/carousel/fabrica-247-ai-autonomy-vs-manual-work.jpg',
      label: t('slides.s1.label'),
      title: t('slides.s1.title'),
      caption: t('slides.s1.caption'),
    },
    {
      image: '/images/carousel/fabrica-futuristic-holographic-network-nodes-interface.jpg',
      label: t('slides.s2.label'),
      title: t('slides.s2.title'),
      caption: t('slides.s2.caption'),
    },
    {
      image: '/images/carousel/fabrica-messy-data-to-organized-dashboard-workspace.jpg',
      label: t('slides.s3.label'),
      title: t('slides.s3.title'),
      caption: t('slides.s3.caption'),
    },
    {
      image: '/images/carousel/fabrica-stressed-developer-coding-late-night.jpg',
      label: t('slides.s4.label'),
      title: t('slides.s4.title'),
      caption: t('slides.s4.caption'),
    },
    {
      image: '/images/carousel/fabrica-system-architecture-flowchart-tablet-desk.jpg',
      label: t('slides.s5.label'),
      title: t('slides.s5.title'),
      caption: t('slides.s5.caption'),
    },
  ]

  const go = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length)
  }, [slides.length])

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
  }, [slides.length])

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (playing) startAutoplay()
    return stopAutoplay
  }, [playing, startAutoplay, stopAutoplay])

  const slide = slides[current]

  return (
    <section className="relative py-16 sm:py-24 bg-[var(--surface-section)] border-b border-[var(--border-faint)] overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="copper-outline" className="h-auto gap-2 px-3.5 py-1 font-mono text-xs">
            <Play className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </Badge>
        </div>

        <div
          className="relative group"
          onMouseEnter={stopAutoplay}
          onMouseLeave={() => playing && startAutoplay()}
        >
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden shadow-2xl shadow-black/60">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B11]/95 via-[#0A0B11]/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 command-frame">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.image}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="max-w-2xl"
                >
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-orange-400">
                    {slide.label}
                  </span>
                  <h3 className="mt-2 text-xl sm:text-3xl font-extrabold text-[var(--text-strong)] tracking-tight">
                    {slide.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-[var(--text-subtle)] leading-relaxed">
                    {slide.caption}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              aria-label="Previous slide"
              onClick={() => go(current - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-black/40 text-[var(--text-strong)] opacity-0 group-hover:opacity-100 transition-opacity hover:border-orange-500/50 hover:text-orange-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(current + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-black/40 text-[var(--text-strong)] opacity-0 group-hover:opacity-100 transition-opacity hover:border-orange-500/50 hover:text-orange-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              aria-label={playing ? 'Pause autoplay' : 'Play autoplay'}
              onClick={() => setPlaying((p) => !p)}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--overlay-5)] text-[var(--text-strong)] hover:text-orange-400 hover:border-orange-500/50 transition-colors"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            {slides.map((s, index) => (
              <button
                key={s.image}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => go(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === current
                    ? 'w-8 bg-orange-500'
                    : 'w-4 bg-white/25 hover:bg-[var(--overlay-5)]0'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShowcaseCarousel
