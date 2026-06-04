# Plastats

Read-only cricket stats website for **Plastics Cricket Club**. Public, no auth. Combines live Play-Cricket data (2019+) with legacy club records (2016–18) into all-time Batting and Bowling tables.

## Start here every session
1. Read **`skills/coding.md`** — architecture, stack, conventions, and the decision log.
2. Read **`skills/todo.md`** — current tickets and their status.

## Keep the `skills/` docs current (important)
- **`skills/coding.md`** — update when architecture, stack, or conventions change; add a decision-log row for any non-trivial choice.
- **`skills/todo.md`** — update ticket status as work progresses; add new tickets when plans change (integer IDs, never renumber existing ones).
- **`skills/lessons.md`** — add an entry whenever the human corrects course.

## Git identity (personal project)
This repo belongs to the **personal** GitHub account `chib31`, but the machine's *global* git identity is a work account. Commits here must use the repo-local identity `Charlie Bradbury <19154063+chib31@users.noreply.github.com>`. Verify `git config user.email` before committing/pushing.

## Layout
- `apps/api` — NestJS + Prisma backend (ETL, merge, aggregation, REST API). All business logic lives here.
- `apps/web` — React + Vite + Tailwind frontend (thin client over the API).
- `packages/shared` — shared TypeScript types (API contracts, stat models).
- `skills/` — AI-maintained project docs (above).

## Common commands
```bash
pnpm install          # install all workspaces
docker compose up -d  # local Postgres (once apps/api exists)
pnpm dev              # run api + web in watch mode
pnpm build            # build all packages
```

## Conventions
- TypeScript across the stack; shared types in `packages/shared`.
- All stats/business logic in NestJS services (reused by the API and the future WhatsApp bot) — never in the frontend.
- Tables are server-driven (the API does paging/sort/filter).
- The Play-Cricket `api_token` is a secret — backend/CI only, never shipped to the browser.
- Footer must show "Powered by ECB Play-Cricket" (MOU requirement).
