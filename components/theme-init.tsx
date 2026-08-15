'use client'

import { useEffect } from 'react'

export function ThemeInit() {
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const shouldBeDark = stored !== 'light'
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  return null
}
