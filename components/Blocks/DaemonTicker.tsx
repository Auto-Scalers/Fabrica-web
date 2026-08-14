import { Marquee } from '@/components/ui/marquee'

const logLines = [
  '[daemon/crew-01] checkered â€” build passed (2.4s)',
  '[daemon/researcher] milestone gate â†’ awaiting approval',
  '[daemon/codex] task #0423 locked into worktree:feature/ticket-091',
  '[wallet/escrow] +0.0842 spent Â· cap 2.50 remaining',
  '[daemon/marketer] draft drafted Â· 3 variants queued',
  '[daemon/analyst] 14 tab-sessions merged â†’ 1 insight',
  '[vault/byok] key accessed locally Â· AES-256 Â· never egressed',
  '[approver/you] signed off payment bind @ 02:13:47',
  '[daemon/crew-01] idle â†’ pausing spend Â· releasing locks',
  '[mobile/companion] killswitch armed Â· state synced',
]

function LogLine({ line }: { line: string }) {
  const [source, ...rest] = line.split('] ')
  return (
    <span className="font-mono text-xs text-[var(--text-muted)] whitespace-nowrap">
      <span className="text-emerald-400">{source}]</span> <span className="text-[var(--text-subtle)]">{rest.join('] ')}</span>
      <span className="mx-6 text-[var(--border-subtle)]">â”‚</span>
    </span>
  )
}

export const DaemonTicker = () => {
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