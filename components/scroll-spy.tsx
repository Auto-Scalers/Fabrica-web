'use client'

import { useEffect } from 'react'

const SECTION_IDS = ['product', 'crew', 'how-it-works', 'controls', 'comparison', 'pricing', 'faq', 'waitlist']

export function ScrollSpy() {
  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (!id) continue
            const newHash = `#${id}`
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, '', newHash)
            }
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return null
}
