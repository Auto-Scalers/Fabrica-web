# Fabrica-web — Worker Instructions (AGENTS.md)

## What This Folder Is

This is the **Fabrica landing page** — a Next.js web app hosted at `fabrica-ai.vercel.app`. You are a worker dispatched by the top-level orchestrator to complete a task in this repo.

## Tech Stack

- Next.js 16 (App Router, SSR)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Base UI
- Motion (scroll reveals, micro-interactions)
- Supabase (early-access signup)
- Vercel Analytics

## Commands

Run these before claiming DONE (from `Fabrica-web/`):

```bash
npm run lint       # ESLint
npm run build      # production build (must compile clean)
```

## What You Should Know

- This is a rebrand from Orca to Fabrica
- Domain: `fabrica-ai.vercel.app` (was `onorca.dev`)
- Package name: `fabrica-web` (was `saas-landing-page`)
- Brand: dark theme, copper/amber palette, forge metaphor

## Conventions

- **Server Components by default** — only add 'use client' when truly needed
- **TypeScript strict** — no `any` types
- **Tailwind only** — no inline styles or CSS modules
- **Named exports** for components, default exports for pages/layouts

## Definition of Done

A task is DONE only when ALL of these hold:

1. **Commands pass:** `npm run lint` and `npm run build` compile clean — paste real output as evidence.
2. **Copy grounding:** every landing-page string traces to one of the 3 internal marketing files (brand-guidelines, positioning-statement, competitor-landscape).
3. **i18n parity:** any key changed in `en.json` is mirrored in `fr.json` and `ar.json` with identical structure.
4. **No Orca/Stably branding** in page copy or meta tags.
5. **Tracking files updated in the same edit:** task status + Rollup recount in `.Fabrica-web-board/Fabrica-web-tasks.md`, Checkpoint table, Session Ledger row.

## What You Do NOT Do

- **Do NOT edit** `.backup/` or `_sources/` — frozen reference copies
- **Do NOT commit or push** — make changes only, orchestrator handles git
- **Do NOT add new dependencies** without explicit instruction

## Key Directories

```
app/                — Next.js App Router pages and layouts
app/api/            — API routes (auth, share, diagnostics, telemetry)
components/         — React components (navbar, footer, sections)
lib/                — Utility functions, auth, docs content
messages/           — i18n translation files (en, ar, fr, etc.)
public/             — Static assets (kill-list.json, changelog.json, nudge.json)
```

## Parallelism & Anti-Overlap Policy

> This project runs REAL 24/7 multi-terminal orchestration. Parallelism is the
> default: unlimited tokens, multi-terminal app, massive project, close deadline.

- **Minimum fleet:** the orchestrator keeps AT LEAST 3 active worker terminals at
  all times. Fewer than 3 on resume or cycle end => launching more comes FIRST,
  chosen from the highest-priority TODO/VERIFY tasks in this file, focused on
  high-level goals and principles, not micro-edits.
- **One task = one worker:** claim a task by setting its status IN_PROGRESS and
  recording your terminal handle in the Session Ledger BEFORE starting. Claimed
  tasks are forbidden to everyone else.
- **One folder = one orchestrator:** never work another slot's folder.
- **One file = one writer:** two live workers never edit the same file; such tasks
  run sequentially.
- **Claim-before-work:** confirm your Task ID is still unclaimed before executing;
  if done or claimed, stop and report instead of duplicating.
- **Cross-project dependencies:** record them as notes in the OTHER project's task
  file; never edit another project directly.
- **Quality bar unchanged under deadline pressure:** no DONE without verified
  evidence; status change and Rollup update happen in the same edit.

## Task File

Your task file is `.Fabrica-web-board/Fabrica-web-tasks.md` — the single source of truth for all web work. Schema for all tracking edits: `.Fabrica-board/Fabrica-Schema.md` (Tracking Schema v1 — status enum, Rollup, Checkpoint, Session Ledger).

## Resume Protocol

On heartbeat kick or session resume:

1. Read `.Fabrica-board/Heartbeat.md` (if you are the orchestrator slot) and your task file's **Checkpoint (Current State)** table FIRST.
2. Continue from the **Next Action** cell — never restart completed work; check Status + Notes before dispatching.
3. Any status change updates the Rollup in the same edit.

## How to Send Results

When your task is complete, send `worker_done`:

```bash
orca orchestration send --type worker_done --subject "Task complete" --body "Summary of what was done" --task-id <task_id> --dispatch-id <dispatch_id> --outcome succeeded --files-modified "path/a,path/b" --json
```

If blocked:
```bash
orca orchestration send --type escalation --subject "Blocked" --body "What happened and what's needed" --task-id <task_id> --dispatch-id <dispatch_id> --json
```

## Orchestration IDs

Your task file's Session Ledger tracks these IDs for every worker session:

| ID | Format | When You Get It | How to Use It |
|----|--------|-----------------|---------------|
| `task_xxx` | `task_` + hex | `task-create --json` → `result.task.id` | Resume a stuck worker: `worker-start --task <task_id> --retry-of <dispatch_id>` |
| `ctx_xxx` | `ctx_` + hex | `worker-start --json` → `result.dispatchId` | Read worker output: `worker-read --dispatch <ctx_xxx>`. Resume: `--retry-of <ctx_xxx>` |
| `term_xxx` | `term_` + uuid | `worker-start --json` → `effects[terminal].id` | Send message to worker: `terminal send --terminal <term_xxx>`. Read output: `terminal read --terminal <term_xxx>` |
