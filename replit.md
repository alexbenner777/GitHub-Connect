# Trends Landing

Investment landing page for the Trends Telegram Mini App (Reels inside Telegram). Allows investors to learn about the project and select investment packages.

## Run & Operate

- `pnpm --filter @workspace/trends-landing run dev` — run the landing page (port 5000)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build lib/db declarations (run before api-server typecheck)
- `pnpm --filter @workspace/db run push` — push DB schema changes to PostgreSQL

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Build: esbuild (CJS bundle)

## Where things live

### Frontend (`artifacts/trends-landing/src/`)
- `pages/Landing.tsx` — main landing page (hero, sections, FAQ, roadmap)
- `pages/Cabinet.tsx` — investor personal cabinet (5 tabs: портфель, транзакции, рефералы, настройки, платформа)
- `pages/Admin.tsx` — admin panel (2 tabs: инвестиции, метрики платформы)
- `pages/not-found.tsx` — 404 page
- `components/InvestmentModal.tsx` — investment package selection modal
- `lib/api.ts` — typed API client (auth, cabinet, investments, platform metrics)
- `index.css` — CSS variables, themes, styles

### Backend (`artifacts/api-server/src/`)
- `routes/auth.ts` — POST /api/auth/register, POST /api/auth/login
- `routes/cabinet.ts` — GET /api/cabinet/me, GET /api/cabinet/referrals, PATCH /api/cabinet/wallet
- `routes/investments.ts` — POST /api/investments, GET /api/investments, admin confirm/reject endpoints
- `routes/platform-metrics.ts` — GET /api/platform-metrics, GET /api/admin/platform-metrics/history, POST /api/admin/platform-metrics
- `routes/index.ts` — mounts all routes
- `middlewares/auth.ts` — requireAuth / requireAdmin JWT middleware
- `lib/jwt.ts` — signToken / verifyToken (uses SESSION_SECRET env var)
- `lib/referral.ts` — MLM bonus calculation (5 levels: 10%, 5%, 3%, 1%, 1%)

### Database (`lib/db/src/schema/`)
- `users.ts` — users table
- `investments.ts` — investment records (status: pending / confirmed / rejected)
- `transactions.ts` — transaction log
- `referrals.ts` — referral tree
- `platform_metrics.ts` — platform metrics snapshots (see below)

### Other
- `attached_assets/` — images (logo, app screenshots, etc.)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)

## Product

Investment landing page for Trends — the first Reels platform inside Telegram. Features hero section, monetization pitch, investor packages (Starter $100, Genesis $1000, Growth $10000, Whale $50000), roadmap, FAQ, personal investor cabinet, and admin panel.

---

## Changelog

### Session 2 — Platform Metrics

**Goal:** Add platform performance metrics visible to investors in their cabinet and editable by admins.

**DB — новая таблица `platform_metrics`:**
- Аудитория: `dau`, `mau`, `wau`, `totalUsers`, `newUsersMonth`
- Контент: `totalVideos`, `newVideosMonth`, `totalCreators`
- Реклама: `adsSold`, `adImpressions`, `adRevenueUsd`, `cpmUsd`
- Финансы: `platformRevenueUsd`, `creatorsPaidOutUsd`
- Мета: `source` (manual / api / mixed), `notes`, `recordedAt`
- Каждое сохранение создаёт новый снапшот — инвесторы видят последний

**API — 3 новых эндпоинта:**
- `GET /api/platform-metrics` — публично, возвращает последний снапшот
- `GET /api/admin/platform-metrics/history` — история всех снапшотов (только admin)
- `POST /api/admin/platform-metrics` — создать новый снапшот (только admin)

**Admin Panel — новая вкладка "Метрики платформы":**
- Форма ввода по 4 секциям: Аудитория, Контент, Реклама, Финансы
- Выбор источника данных (вручную / live API / комбо)
- Поле комментария для инвесторов
- Таблица истории снапшотов с датами и текущим маркером

**Кабинет инвестора — новая вкладка "Платформа" (Globe icon):**
- Отображает последний снапшот метрик по 4 секциям
- Показывает дату обновления и источник данных
- Заглушка "данные скоро появятся" пока admin не внёс первые цифры

### Session 1 — Security & Code Review Fixes

1. **CORS** — исправлено `startsWith` → `includes` для корректной проверки origin
2. **Atomic confirm** — защита от двойного подтверждения через `AND status='pending'` в SQL
3. **Wallet network enum** — расширен: TON, USDT TRC-20, USDT ERC-20, BTC, ETH
4. **OpenAPI spec** — написана полная спецификация `lib/api-spec/openapi.yaml`
5. **Health endpoint** — исправлен путь `/healthz` → `/health`
6. **Reject → confirm protection** — нельзя подтвердить уже отклонённую инвестицию

---

## User preferences

- Edit only `artifacts/trends-landing/src/` and `attached_assets/`
- Do not touch `.replit-artifact/artifact.toml`
- After each change, push to GitHub main → Render auto-deploys
- Colors: primary cyan `#00D4FF`, secondary purple `#7B5EFF`

## Gotchas

- Images must be imported via `@assets` alias (resolves to `attached_assets/`)
- GitHub remote: `https://github.com/darcynj757-svg/trends-landing.git`
- Render prod: see Render dashboard for the live URL
- Git push: `git push origin main` (requires GitHub PAT as password)
- Production build uses `vite.config.prod.ts` (no PORT/BASE_PATH env vars required)
- Render build script: `build-render.sh` → calls `build:prod` then API server build
- After DB schema changes: run `pnpm --filter @workspace/db run push` on prod DB

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
