'use client'

import { useTranslations } from 'next-intl'
import { Marquee } from '@/components/ui/marquee'

function LogLine({ line }: { line: string }) {
  const [source, ...rest] = line.split('] ')
  return (
    <span className="font-mono text-xs text-[var(--text-muted)] whitespace-nowrap">
      <span className="text-emerald-400">{source}]</span> <span className="text-[var(--text-subtle)]">{rest.join('] ')}</span>
      <span className="mx-6 text-[var(--border-subtle)]">│</span>
    </span>
  )
}

export const DaemonTicker = () => {
  const t = useTranslations('hero')

  const logLines = [
    t('daemon1'),
    t('daemon2'),
    t('daemon3'),
    t('daemon4'),
    t('daemon5'),
    t('daemon6'),
    t('daemon7'),
    t('daemon8'),
    t('daemon9'),
    t('daemon10'),
  ]

  return (
    <div className="relative border-y border-[var(--border-faint)] bg-[var(--surface-section)] py-3 overflow-hidden command-frame">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0C0D14] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0C0D14] to-transparent z-10" />

      <Marquee className="[--duration:50s] [--gap:0rem]">
        {logLines.map((line) => (
          <LogLine key={line} line={line} />
        ))}
      </Marquee>
    </div>
  )
}

export default DaemonTicker
