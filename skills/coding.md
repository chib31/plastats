# Plastats — Engineering Guide (`coding.md`)

> **Purpose:** the living technical reference for Plastats — architecture, stack, tooling, conventions, and a decision log.
> **Maintained by AI:** update this file whenever architecture, stack, conventions, or decisions change. Add to the decision log when a non-trivial choice is made.
> **Companions:** [`todo.md`](./todo.md) (work items/tickets) · [`lessons.md`](./lessons.md) (human corrections).

_Last updated: 2026-06-04_

## 1. What Plastats is
A public, **read-only** stats website for **Plastics Cricket Club** (est. 2016). v1 ships two tabs — **Batting** and **Bowling** — each an all-time table that **combines live Play-Cricket data (2019+) with legacy club records (2016–18)**. No authentication (all data is already public). Low traffic (~40 club members).

## 2. Architecture
```
GitHub (chib31/plastats, public): pnpm monorepo + Actions
   └─ Actions: hourly cron ──► POST /refresh (secret header)

Backend (NestJS + Prisma)  ◄── ALL non-UI logic lives here
   ├─ Play-Cricket ETL service (fetch 2019+ scorecards, incremental)
   ├─ Merge service (legacy + live, alias mapping, recompute rates)
   ├─ REST API:  /api/* reads (?page&pageSize&sort&order&filter)
   │             /refresh  (rate-limited; used by cron AND the UI button)
   └─ Prisma ──► Postgres (Docker local / Neon prod)
        granular:  matches, innings, batting_perf, bowling_perf, fall_of_wickets
        aggregate: career_batting, career_bowling  (incl. legacy)

Frontend (React + Vite + Tailwind + TanStack Table) ──► Cloudflare Pages
   └─ "Refresh" button ──► POST /refresh
```
Principles:
- **Thin frontend.** All ETL, merge, aggregation, and pagination/sort/filter logic is server-side. The web app only renders what the API returns.
- **Granular-first.** Store per-innings performances; derive aggregate tables via SQL. Future fine-grained features become new queries, not a new pipeline.
- **One trigger path for data.** Both the hourly cron and the manual UI button call `POST /refresh`.

## 3. Tech stack
| Layer | Choice | Notes |
|---|---|---|
| Package manager | **pnpm** workspaces | monorepo |
| Backend | **NestJS** (TypeScript) | modules / services / DI; owns all logic |
| ORM | **Prisma** | |
| Database | **PostgreSQL** | Docker (local) · Neon (prod) |
| Frontend | **React + Vite + TypeScript** | |
| Styling | **Tailwind CSS** | brand theme (see §8) |
| Tables | **TanStack Table** | server-driven (manual) pagination/sort/filter from day one |
| Web hosting | **Cloudflare Pages** | free; deploys from repo |
| API hosting | **TBD at deploy** | free scale-to-zero (e.g. Cloud Run/Fly) vs ~£5/mo always-on |
| Scheduler | **GitHub Actions** cron | hourly → `/refresh`; free/unlimited on public repos |
| Headings font | **Buenard** (Google Fonts) | matches the logo |

## 4. Repository layout (planned)
```
plastats/
├─ apps/
│  ├─ api/        # NestJS backend (ETL, merge, REST API)
│  └─ web/        # React + Vite frontend
├─ packages/
│  └─ shared/     # shared TypeScript types (API contracts, stat models)
├─ skills/        # AI-maintained docs (this folder)
├─ docker-compose.yml   # local Postgres
├─ pnpm-workspace.yaml
└─ CLAUDE.md      # entry instructions for AI sessions (to be added at scaffold)
```
`apps/bot/` (WhatsApp worker) will be added later — see decision log D11.

## 5. Data
### 5.1 Sources
- **Play-Cricket API v2** — `https://play-cricket.com/api/v2/`. Key endpoints: `matches.json?site_id&season&api_token` (fixtures/results list, incl. upcoming), `match_detail.json?match_id&api_token` (full scorecard: per-innings `bat[]`, `bowl[]`, `fow[]`, plus a `players[]` selection block). Requires `api_token` (Club Admin → API) + `site_id`. **Covers 2019+.**
- **Legacy PDF** — `~/Documents/Personal/Plastics CC Stats (2016-2018) Final.pdf`. **Pre-aggregated career totals** (no per-match detail), free-text/nickname player names. **Covers 2016–18.** No overlap with Play-Cricket.

### 5.2 Schema
Granular (from Play-Cricket): `matches`, `innings`, `batting_perf`, `bowling_perf`, `fall_of_wickets`.
Aggregate (derived + legacy): `career_batting`, `career_bowling`.
Legacy totals are stored as pre-aggregated rows and folded into the aggregate queries.

### 5.3 Merge rules (legacy + live)
**Sum the raw counting stats, then recompute everything derived. Take max for High Score.**
- Batting — sum: Inns, NO, Runs, 4s, 6s, Balls, 50s, 100s · max: HS · recompute: Avg = Runs/(Inns−NO), SR = 100·Runs/Balls, Balls-per-boundary = Balls/(4s+6s).
- Bowling — sum: Balls, Maidens, Runs, Wickets, 5wi · recompute: Overs (from balls), Avg = Runs/Wkts, Econ = 6·Runs/Balls, SR = Balls/Wkts.
- Undefined rates (÷0) render as "—". Aggregate across all club teams (1st XI, 2nd, midweek) by club, not by single team_id.

### 5.4 Player identity
Key live stats on Play-Cricket **`player_id`** (stable). Fold legacy names in via an **alias map** (`legacy name → player_id`): auto-match exact/high-confidence fuzzy, owner reviews the ambiguous handful once; legacy-only players keep their own row. Design the resolver to also handle first-name/nickname lookups (future WhatsApp bot needs "Charlie" → Charlie Bradbury).

## 6. Conventions
- TypeScript across the whole stack; shared API/stat types live in `packages/shared`.
- **All stats/business logic in NestJS services** (not controllers, not the frontend) so the API and the future bot reuse the same code.
- Tables are server-driven (the API does paging/sort/filter) even where v1 datasets are small.
- Commit identity is **repo-local** `chib31` noreply (the global git identity is a work account — never commit Plastats as that).
- Keep `skills/coding.md`, `skills/todo.md`, `skills/lessons.md` current.

## 7. Environments & secrets
- **Local:** Postgres via `docker-compose`; `pnpm dev` runs api + web.
- **Prod:** Postgres on Neon; web on Cloudflare Pages; API host TBD.
- **Secrets:** the Play-Cricket `api_token` lives only in the backend/CI secret store — **never** shipped to the browser.

## 8. Branding
Primary pink **`#fd6c9e`**, black & white, **Buenard** serif headings, the club logo (`~/Documents/Personal/plastics_logo.svg|png`), "Est. 2016", cricket-ball-and-seam motif. Footer must display **"Powered by ECB Play-Cricket"** (required by the club's signed ECB API MOU) plus a note that stats combine Play-Cricket (2019–) and club records (2016–18).

## 9. Decision log
| ID | Date | Decision | Rationale |
|---|---|---|---|
| D1 | 2026-06-04 | Legacy 2016–18 (PDF) + Play-Cricket 2019+, no overlap → sources stack | Owner confirmed Play-Cricket starts 2019 |
| D2 | 2026-06-04 | Include **all** match types in all-time stats | Matches spirit of club stats + the legacy data (mixed formats) |
| D3 | 2026-06-04 | Merge players via alias map: auto-match + owner review | Legacy names are free-text nicknames without IDs |
| D4 | 2026-06-04 | **Full backend + Postgres** (not static/edge-only) | Owner wants flexibility for future features, server-side paging/sort/filter on large future datasets, and logic out of the FE. See lessons.md |
| D5 | 2026-06-04 | NestJS + Prisma for the backend | Structured (modules/DI); single language with the FE |
| D6 | 2026-06-04 | React+Vite+Tailwind+TanStack Table, server-driven from day one | No re-architecture when datasets grow |
| D7 | 2026-06-04 | ETL is a backend service; hourly GitHub Actions cron + manual `/refresh` button | Keeps logic server-side; Actions free on public repos |
| D8 | 2026-06-04 | Store granular per-innings data now; derive aggregates via SQL | Future fine-grained features need it; cheap to capture now |
| D9 | 2026-06-04 | Public repo on personal account `chib31`; app named **Plastats** | Free Actions/Pages; data is public anyway |
| D10 | 2026-06-04 | Free hosting; API host (free scale-to-zero vs ~£5/mo always-on) decided at deploy | Cold starts acceptable for a club site; bot will need always-on |
| D11 | 2026-06-04 | Future WhatsApp bot only via unofficial Baileys (always-on worker) | Official WhatsApp API can't do group bots and bans open-ended AI chat (2026); ToS/ban risk accepted as a later decision |
| D12 | 2026-06-04 | Brand theme + "Powered by ECB Play-Cricket" footer | Logo-derived; MOU compliance |
| D13 | 2026-06-04 | AI-maintained `skills/` docs (coding/todo/lessons) | Owner's lightweight project memory + ticketing |

## 10. Owner to-dos (external, blocking later milestones)
- Provide Play-Cricket **`api_token`** (Club Admin → API) + the club's **play-cricket web address** (to derive `site_id`) — needed for ETL (ticket #9).
- Create a free **Neon** account — needed at deploy (ticket #12).
- Decide API hosting cost posture (free scale-to-zero vs ~£5/mo always-on) at deploy.
