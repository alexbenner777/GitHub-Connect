---
name: platform_updates table
description: New DB table for investor-facing platform news/updates
---

Table `platform_updates` in `lib/db/src/schema/platform_updates.ts`:
- `id` serial PK
- `date` date (the update date, not creation)
- `title` text NOT NULL
- `body` text NOT NULL
- `published` boolean default true
- `createdAt` timestamp default now()

API routes in `artifacts/api-server/src/routes/platform-updates.ts`:
- `GET /api/platform-updates` — public, returns `{ updates: PlatformUpdate[] }` (published only, newest first)
- `POST /api/admin/platform-updates` — admin only, create
- `PATCH /api/admin/platform-updates/:id` — admin only, update

Type `PlatformUpdate` is exported from `artifacts/trends-landing/src/lib/api.ts`.

**Why:** Investors need a live news feed in their Cabinet platform tab. Admin posts updates; investors see them in the Platform tab feed.
