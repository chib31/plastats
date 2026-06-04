# Plastats — Work Items (`todo.md`)

> Replaces a ticket tracker for this personal project. Each item has a stable integer ID.
> **Maintained by AI:** update statuses as work progresses; add new tickets when plans change; never renumber existing tickets.
> **Companions:** [`coding.md`](./coding.md) · [`lessons.md`](./lessons.md).

_Last updated: 2026-06-04_

**Status key:** ✅ Done · 🟡 In progress · ⬜ To do · ⛔ Blocked · 🔵 Backlog (not yet scheduled)

## Milestone 1 — local full-stack on legacy data
| # | Status | Item | Notes |
|---|--------|------|-------|
| 1 | ✅ | Authenticate personal GitHub account & create repo `plastats` | Public, owner `chib31`; repo-local noreply identity |
| 2 | ✅ | Create `skills/` docs (coding.md, todo.md, lessons.md) | |
| 3 | ✅ | Scaffold pnpm monorepo skeleton (root + `packages/shared` + tooling + `CLAUDE.md`) | apps scaffolded in #4 (api) / #7 (web) |
| 4 | ⬜ | Backend: NestJS + Prisma + Postgres schema + `docker-compose` (local DB) | granular + aggregate tables |
| 5 | ⬜ | Transcribe legacy 2016–18 PDF → structured seed + loader | source: `~/Documents/Personal/...Final.pdf` |
| 6 | ⬜ | Stats service + REST API `/api/batting` `/api/bowling` (page/sort/filter) | server-driven; legacy-only aggregates for now |
| 7 | ⬜ | Frontend: React+Vite+Tailwind, brand theme, two tabs + sortable tables | pink `#fd6c9e`, Buenard, logo |
| 8 | ⬜ | Run full stack locally & verify legacy data renders | **Milestone 1 complete** |

## Milestone 2+ — live data, refresh, deploy
| # | Status | Item | Notes |
|---|--------|------|-------|
| 9 | ⛔ | Play-Cricket API client + ETL into granular tables | **Blocked:** needs `api_token` + `site_id` from owner |
| 10 | ⬜ | Player alias mapping + review workflow; merge legacy + live | depends on #9 |
| 11 | ⬜ | Hourly refresh (GitHub Actions cron) + manual `/refresh` button | rate-limited |
| 12 | ⬜ | Deploy: Neon + backend host + Cloudflare Pages + secrets + attribution | needs free Neon account; pick free vs ~£5/mo |
| 13 | ⬜ | Polish: sort defaults, min-innings qualifier, mobile, empty/loading states | |

## Backlog — future features
| # | Status | Item | Notes |
|---|--------|------|-------|
| 14 | 🔵 | Upcoming fixtures view (from `matches.json`) | date/opponent/venue/competition |
| 15 | 🔵 | "Who's playing" / team selection | only if the club publishes selections on Play-Cricket |
| 16 | 🔵 | WhatsApp stats bot (@mention Q&A) | unofficial Baileys, always-on worker + LLM tool-calling; ToS/ban risk (see coding.md D11) |
