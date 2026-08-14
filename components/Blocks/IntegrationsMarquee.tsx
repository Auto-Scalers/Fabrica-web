import { Marquee } from '@/components/ui/marquee'
import {
  Github,
  Apple,
  Smartphone,
  Terminal,
  Bot,
  CreditCard,
  Globe,
  Cpu,
  Binary,
  Database,
  Sparkles,
  SquareTerminal,
} from 'lucide-react'

const integrations = [
  { name: 'OpenAI', icon: Bot },
  { name: 'Anthropic', icon: Cpu },
  { name: 'Gemini', icon: Sparkles },
  { name: 'DeepSeek', icon: Binary },
  { name: 'Ollama', icon: Terminal },
  { name: 'Ghostty', icon: SquareTerminal },
  { name: 'GitHub', icon: Github },
  { name: 'Playwright', icon: Globe },
  { name: 'Stripe', icon: CreditCard },
  { name: 'iOS', icon: Smartphone },
  { name: 'Android', icon: Smartphone },
  { name: 'macOS', icon: Apple },
  { name: 'Supabase', icon: Database },
] as const

function IntegrationChip({ name, Icon }: { name: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--overlay-5)] px-5 py-2.5 text-sm text-[var(--text-subtle)] hover:border-orange-500/40 hover:text-[var(--text-strong)] transition-colors whitespace-nowrap">
      <Icon className="h-4 w-4 text-orange-400" />
      <span>{name}</span>
    </div>
  )
}

export const IntegrationsMarquee = () => {
  return (
    <section className="relative py-14 sm:py-20 bg-[var(--surface-section)] border-b border-[var(--border-faint)] overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8 text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-400">
          Bring your own keys
        </span>
        <p className="text-sm sm:text-base text-[var(--text-muted)]">
          Runs on the stack you already trust Ã¢â‚¬â€ model-agnostic, wallet-first.
        </p>
      </div>

      <Marquee pauseOnHover className="[--duration:35s] [--gap:1rem]">
        {integrations.map((item) => (
          <IntegrationChip key={item.name} name={item.name} Icon={item.icon} />
        ))}
      </Marquee>
    </section>
  )
}

export default IntegrationsMarquee