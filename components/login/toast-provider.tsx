'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export type ToastTone = 'success' | 'info' | 'error'

type Toast = {
  id: number
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      showToast: (message: string, tone: ToastTone = 'info') => {
        if (typeof console !== 'undefined') console.warn('[toast]', tone, message)
      },
    }
  }
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const showToast = useCallback((message: string, tone: ToastTone = 'info') => {
    counter.current += 1
    const id = counter.current
    setToasts((cur) => [...cur, { id, message, tone }])
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setToasts((cur) => cur.filter((t) => t.id !== id))
      }, 4200)
    }
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-6 z-50 flex w-full max-w-sm flex-col items-end gap-2 px-4 ltr:right-0 rtl:left-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={
              'pointer-events-auto min-w-0 max-w-full translate-y-0 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg shadow-black/40 backdrop-blur transition-all duration-200 ease-out ' +
              (t.tone === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-100'
                : t.tone === 'error'
                  ? 'border-red-500/40 bg-red-950/70 text-red-100'
                  : 'border-[var(--border-subtle)] bg-zinc-900/80 text-[var(--text-strong)]')
            }
            style={{ animation: 'login-toast-in 200ms ease-out both' }}
          >
            <span className="block break-words">{t.message}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes login-toast-in {
          from {
            transform: translateY(8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}