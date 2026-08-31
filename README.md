# Fabrica — Landing Page & Dashboard

**"The Next AI Exit" — Business-First, Coding-First Agentic Development Environment (ADE).**

This is the marketing/landing site + authenticated dashboard for Fabrica, a local desktop app built on top of the open-source MIT-licensed **Orca** codebase. Built with Next.js + Tailwind + shadcn/ui.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) 16 | App Router, SSR, API routes |
| [React](https://react.dev/) 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) v4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) + Base UI | Accessible primitives |
| [Motion](https://motion.dev/) | Scroll reveals & micro-interactions |
| [Lucide React](https://lucide.dev/) | Icons |
| [Supabase](https://supabase.com/) | Auth (email/password, Google, GitHub) + artifact storage |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

- `npm run dev` — dev server on port 3000
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — 12-block narrative |
| `/login` | Auth: email/password + Google + GitHub OAuth |
| `/dashboard` | Authenticated: profile + artifacts management |
| `/download` | Platform download links (macOS, Windows, Linux) |
| `/docs` | Documentation hub (MDX) |
| `/docs/[slug]` | Individual doc pages |
| `/whats-new` | Changelog |

## API Routes

| Route | Purpose |
|---|---|
| `POST /api/auth/callback` | Supabase OAuth callback |
| `GET /api/auth/session` | Get current session |
| `POST /api/auth/logout` | Sign out |
| `POST /api/auth/refresh` | Refresh session |
| `POST /api/auth/authorize` | Authorize |
| `GET /v1/artifacts` | List user artifacts (RLS) |
| `GET /v1/artifacts/[id]` | Get single artifact |
| `PUT /v1/artifacts/[id]` | Update artifact |
| `DELETE /v1/artifacts/[id]` | Delete artifact |
| `POST /v1/feedback` | Submit crash report |
| `GET /v1/desktop/auth/session` | Desktop session check |
| `POST /v1/desktop/auth/authorize` | Desktop auth |
| `POST /v1/desktop/auth/refresh` | Desktop token refresh |
| `GET /v1/desktop/auth/logout` | Desktop logout |
| `GET /v1/desktop/auth/capabilities` | Desktop capabilities |
| `GET /v1/desktop/auth/profile` | Desktop profile |
| `GET /v1/desktop/auth/org` | Desktop org |
| `GET /v1/desktop/auth/relay-token` | Relay token minting |

## Project Structure

```
app/
  [locale]/
    page.tsx              # Landing page
    layout.tsx            # Root layout
    login/page.tsx        # Auth page
    dashboard/page.tsx    # Authenticated dashboard
    download/page.tsx     # Platform download links
    docs/                 # Documentation (MDX)
    whats-new/page.tsx    # Changelog
  api/auth/               # Supabase OAuth routes
  v1/artifacts/           # Artifact CRUD
  v1/feedback/            # Crash reports
  v1/desktop/auth/        # Desktop app auth
components/
  Blocks/                 # Landing sections (Hero, Crew, Feature, ...)
  navbar.tsx              # Fixed nav with mobile drawer
  download/               # Platform download grid
  docs/                   # Docs sidebar + prose renderer
  ui/                     # shadcn/Base UI primitives
  login/                  # Login toast provider
lib/
  supabase.ts             # Supabase admin client
  supabase-browser.ts     # Browser client
  supabase-auth.ts        # Auth helpers
  fabrica-artifacts.ts    # Artifact helpers
  docs-content.tsx        # Docs content
messages/                 # i18n (en, fr, ar)
public/
  images/                 # Photography + assets
  whats-new/              # Changelog JSON
  plugins/                # Plugin kill-list
supabase/
  migrations/             # Database migrations
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## Brand

- **Tagline:** "The Next AI Exit"
- **Theme:** Obsidian dark (`#0A0A0F`) + molten copper/amber (`#E8590C → #FF8A3D`), steel-blue accents, emerald for verified/healthy states.
- **Voice:** forge/foundry & command-center metaphor — *direct the crew, daemons, worktrees, approval gates, auto-stop killswitch.*

## Deploy

Works on any platform that supports Next.js standalone output (Vercel, Netlify, Railway, Render).
