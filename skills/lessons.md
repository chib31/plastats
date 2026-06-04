# Plastats — Lessons (`lessons.md`)

> A log of times the AI was corrected or redirected by a human, with the takeaway.
> **Maintained by AI:** add an entry whenever the human corrects course, so the same mistake isn't repeated.
> **Companions:** [`coding.md`](./coding.md) · [`todo.md`](./todo.md).

## 2026-06-04 — Don't under-scope the architecture
**Context:** While planning, the AI initially leaned toward a static-site-first approach, then an edge/serverless option (Cloudflare Pages + Workers + D1/SQLite), optimising for minimal footprint because v1 is just two aggregate tables.
**Correction:** The owner redirected to a **fully functional backend + Postgres**, to stay flexible for future features and keep non-UI logic out of the frontend.
**Takeaway:** Weight the owner's stated *roadmap* heavily, not just the immediate feature set. For Plastats, default to a proper backend (NestJS) and a real relational DB (Postgres); don't propose static/serverless-only solutions even when the first feature looks trivial.

## 2026-06-04 — Use the personal GitHub account, not work
**Context:** The machine's global git identity is the work email (`charlie.bradbury@credentially.io`) and `gh` had the work account (`cb-cred`) active.
**Correction:** The owner flagged up front that this is a personal project requiring personal-account authentication.
**Takeaway:** For personal projects, authenticate and commit as `chib31` with a repo-local noreply identity; verify `git config user.email` and `gh auth status` before any commit/push. (See memory: github-personal-account.)
