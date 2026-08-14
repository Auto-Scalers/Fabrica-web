# Fabrica — Landing Page

**"The Next AI Exit" — Business-First, Coding-First Agentic Development Environment (ADE).**

This is the marketing/landing site for Fabrica, a local desktop app built on top of the open-source MIT-licensed **Orca** codebase. It was built from the ChatDeck SaaS landing page template (Next.js + Tailwind + shadcn/ui) and rebranded for Fabrica.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) 16 | App Router, SSR, API routes |
| [React](https://react.dev/) 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) v4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) + Base UI | Accessible primitives (button, badge, accordion, toggle-group, avatar, marquee, shimmer-button, card) |
| [Motion](https://motion.dev/) | Scroll reveals & micro-interactions |
| [Lucide React](https://lucide.dev/) | Icons |
| [Supabase](https://supabase.com/) | Early-access signup persistence |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

- `npm run dev` — dev server on port 3000 (`-H 0.0.0.0`)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Project Structure

```
app/
  globals.css         # Obsidian dark + molten-copper theme (OKLCH tokens)
  layout.tsx          # Root layout (Navbar, Footer, metadata)
  page.tsx            # 12-block landing narrative
  api/early-access/   # POST /api/early-access → Supabase upsert
components/
  Blocks/             # Landing sections (Hero, Crew, Pricing, FAQ, ...)
  navbar.tsx          # Fixed nav with mobile drawer
  ui/                 # shadcn/Base UI primitives
lib/
  supabase.ts         # Supabase admin client (env-driven)
  utils.ts            # cn() class merge helper
public/
  images/             # Photography + carousel/showcase assets
  fabrica-logo_icon.svg
```

## Environment Variables

The early-access API gracefully falls back to mock mode if not configured.

```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY    # preferred for server inserts
# fallbacks: NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY
```

## Brand

- **Tagline:** "The Next AI Exit"
- **Theme:** Obsidian dark (`#0A0A0F`) + molten copper/amber (`#E8590C → #FF8A3D`), steel-blue accents, emerald for verified/healthy states.
- **Voice:** forge/foundry & command-center metaphor — *direct the crew, daemons, worktrees, approval gates, auto-stop killswitch.*

## Editing Sections

Each block under `components/Blocks/` is self-contained. Add/remove them from `app/page.tsx`.

## Deploy

Works on any platform that supports Next.js standalone output (Vercel, Netlify, Railway, Render).

---

Built on the [ChatDeck](https://www.shadcndeck.com/templates/chatdeck-saas-landing-page) MIT template by shadcndeck.