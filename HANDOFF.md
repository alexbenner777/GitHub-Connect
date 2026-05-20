# Trends Landing — Технический документ передачи проекта

## 1. Что это за проект

Инвестиционный лендинг для **Trends** — первой Reels-платформы внутри Telegram.  
Позволяет инвесторам изучить проект, зарегистрироваться, выбрать пакет инвестиций и управлять портфелем через личный кабинет.

**Продакшн (Render):** см. Render Dashboard  
**GitHub:** `https://github.com/darcynj757-svg/trends-landing.git` (ветка `main`)

---

## 2. Технический стек

| Уровень | Технологии |
|---|---|
| Frontend | React 19, Vite 7, TypeScript 5.9, Tailwind CSS 4, shadcn/ui, Framer Motion |
| Backend | Node.js 24, Express 5, TypeScript |
| База данных | PostgreSQL + Drizzle ORM |
| Web3 | TON blockchain, @tonconnect/ui-react |
| API | OpenAPI 3 (openapi.yaml) → генерация Zod + React Query через Orval |
| Монорепо | pnpm workspaces |

---

## 3. Структура монорепо

```
/
├── artifacts/
│   ├── trends-landing/        # Frontend (React + Vite), порт 5000
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── Landing.tsx        ← главный лендинг
│   │       │   ├── Cabinet.tsx        ← личный кабинет инвестора
│   │       │   ├── Login.tsx / Register.tsx
│   │       │   └── not-found.tsx
│   │       ├── components/
│   │       │   └── InvestmentModal.tsx ← модальное окно выбора пакета
│   │       ├── hooks/
│   │       │   └── useAuth.tsx        ← контекст авторизации
│   │       └── lib/
│   │           ├── translations.ts    ← тексты RU + EN
│   │           ├── packages.ts        ← пакеты инвестиций (FE)
│   │           └── api.ts             ← HTTP-клиент
│   │
│   └── api-server/            # Backend (Express), порт 8080
│       └── src/
│           ├── routes/
│           │   ├── auth.ts            ← POST /api/auth/register, /login
│           │   ├── investments.ts     ← POST/GET /api/investments
│           │   └── cabinet.ts         ← GET /api/cabinet/me, /referrals; PATCH /wallet
│           ├── middlewares/
│           │   └── auth.ts            ← requireAuth / requireAdmin
│           └── lib/
│               ├── jwt.ts             ← signToken / verifyToken
│               ├── referral.ts        ← MLM 5 уровней (10/5/3/1/1%)
│               └── logger.ts          ← pino logger
│
├── lib/
│   ├── db/                    # Общий пакет базы данных
│   │   ├── src/schema/
│   │   │   ├── users.ts       ← таблица users
│   │   │   ├── investments.ts ← таблица investments
│   │   │   ├── transactions.ts
│   │   │   └── referrals.ts
│   │   └── drizzle.config.ts
│   ├── api-spec/
│   │   └── openapi.yaml       ← контракт API (источник истины)
│   ├── api-zod/               ← сгенерированные Zod-схемы
│   └── api-client-react/      ← сгенерированные React Query хуки
│
├── attached_assets/           ← изображения (лого, скриншоты приложения)
├── pnpm-workspace.yaml
└── .replit                    ← конфиг workflows Replit
```

---

## 4. Схема базы данных

### `users`
| Поле | Тип | Описание |
|---|---|---|
| id | serial PK | |
| email | text UNIQUE NOT NULL | |
| password_hash | text NOT NULL | bcrypt cost 12 |
| name | text NOT NULL | |
| telegram_username | text | |
| referral_code | text UNIQUE NOT NULL | авто-генерация при регистрации |
| referred_by_id | integer FK→users.id | реферальная цепочка |
| is_admin | boolean DEFAULT false | |
| wallet_address | text | TON-кошелёк |
| wallet_network | text | |
| created_at / updated_at | timestamp tz | |

### `investments`
| Поле | Тип | Описание |
|---|---|---|
| id | serial PK | |
| user_id | integer FK→users.id | |
| package_id | text | starter / genesis / growth / whale |
| package_name | text | |
| amount | numeric(18,2) | сумма в USD |
| shares | numeric(18,4) | доля |
| status | text DEFAULT 'pending' | pending / confirmed / rejected |
| tx_hash | text | хеш транзакции TON |
| wallet_from | text | |
| confirmed_at | timestamp tz | |

### `transactions`
Лог всех операций: пополнения, MLM-бонусы, выплаты.

### `referral_bonuses`
Начисленные MLM-бонусы: уровень 1–5, процент, сумма, статус.

---

## 5. Инвестиционные пакеты

| ID | Название | Сумма |
|---|---|---|
| starter | Starter | $100 |
| genesis | Genesis | $1 000 |
| growth | Growth | $10 000 |
| whale | Whale | $50 000 |

MLM реферальная программа: **10% / 5% / 3% / 1% / 1%** (5 уровней вглубь).

---

## 6. API эндпоинты

```
POST /api/auth/register     { email, password, name, referralCode? }
POST /api/auth/login        { email, password }

GET  /api/cabinet/me        → профиль + инвестиции (requireAuth)
GET  /api/cabinet/referrals → список рефералов (requireAuth)
PATCH /api/cabinet/wallet   { walletAddress, walletNetwork } (requireAuth)

POST /api/investments       { packageId, txHash, walletFrom } (requireAuth)
GET  /api/investments       → инвестиции текущего юзера (requireAuth)
POST /api/investments/:id/confirm  (requireAdmin) — подтверждение оплаты
```

---

## 7. Переменные окружения

### Уже настроены в Replit (автоматически)
```
DATABASE_URL     — строка подключения PostgreSQL
PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE
REPLIT_DOMAINS / REPLIT_DEV_DOMAIN / REPL_ID
```

### Нужно задать вручную в Secrets
```
SESSION_SECRET   — секрет для подписи JWT-токенов (минимум 32 символа)
```

### Env vars (уже заданы в shared)
```
PORT=5000        — порт фронтенда
BASE_PATH=/      — базовый путь Vite
API_PORT=8080    — порт бэкенда
```

---

## 8. Как запустить на новом Replit-аккаунте

### Шаг 1 — Импортировать репозиторий
1. Создать новый Repl → **Import from GitHub**
2. URL: `https://github.com/darcynj757-svg/trends-landing.git`
3. Выбрать **Node.js** как шаблон

### Шаг 2 — Установить зависимости
Открыть Shell и выполнить:
```bash
pnpm install
```

### Шаг 3 — Настроить базу данных
В Replit: **Tools → Database** → создать PostgreSQL базу.  
`DATABASE_URL` подставится автоматически.

Затем применить схему:
```bash
pnpm --filter @workspace/db run push
```

### Шаг 4 — Задать секреты
В **Secrets** (замок на боковой панели) добавить:
```
SESSION_SECRET = <любая длинная случайная строка, 32+ символа>
```

### Шаг 5 — Запустить workflows
В `.replit` уже настроены два workflow:
- **Start application** — `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/trends-landing run dev`
- **API Server** — `PORT=8080 pnpm --filter @workspace/api-server run dev`

Нажать **Run** или запустить каждый workflow вручную.

---

## 9. Что нужно доделать до полного запуска

### 🔴 Критично (блокирует запуск)

#### 9.1 Инвестиции — статус `pending` вместо `confirmed`
**Файл:** `artifacts/api-server/src/routes/investments.ts`  
**Проблема:** сейчас статус сразу `confirmed`, MLM-бонусы начисляются без проверки оплаты  
**Нужно:** инвестиция создаётся со статусом `pending`, реферальные бонусы вызываются только в `POST /investments/:id/confirm`

#### 9.2 Rate limiting на критических эндпоинтах
**Нужно установить:** `pnpm add express-rate-limit`  
**Применить к:** `/api/auth/login`, `/api/auth/register`, `/api/investments`  
```typescript
import rateLimit from "express-rate-limit";
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20 });
app.use("/api/auth", authLimiter);
```

#### 9.3 Ограничить CORS
**Файл:** `artifacts/api-server/src/app.ts`  
**Сейчас:** `app.use(cors())` — открыт для всех  
**Нужно:**
```typescript
app.use(cors({
  origin: [process.env.RENDER_EXTERNAL_URL ?? "", process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : ""],
  credentials: true
}));
```

#### 9.4 Убрать fallback у SESSION_SECRET
**Файл:** `artifacts/api-server/src/lib/jwt.ts`  
**Сейчас:** `process.env.SESSION_SECRET ?? "dev-secret-change-in-prod"`  
**Нужно:**
```typescript
const SECRET = process.env.SESSION_SECRET;
if (!SECRET) throw new Error("SESSION_SECRET is required");
```

### 🟡 Важно (до масштабирования)

#### 9.5 Атомарность денежных операций
**Файл:** `artifacts/api-server/src/routes/investments.ts`  
Обернуть создание investment + transaction + referral bonuses в `db.transaction()`

#### 9.6 Синхронизировать пакеты FE и BE
**Сейчас:** пакеты определены отдельно в `artifacts/trends-landing/src/lib/packages.ts` и `artifacts/api-server/src/routes/investments.ts`  
**Нужно:** вынести в общий файл `lib/db/src/packages.ts` и импортировать в оба места

#### 9.7 Zod-валидация всех входящих запросов
**Файлы:** все `routes/*.ts`  
Добавить валидацию email-формата, паролей (минимум 8 символов), packageId (enum), txHash-формата

#### 9.8 Централизованный error handler
**Файл:** `artifacts/api-server/src/app.ts`
```typescript
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});
```

### 🟢 Желательно

#### 9.9 Перенести JWT из localStorage в HttpOnly cookies
Текущее место хранения токена: `localStorage` (`hooks/useAuth.tsx`)  
Более безопасно: установить токен через `Set-Cookie: httpOnly; Secure; SameSite=Strict`

#### 9.10 Уникальный constraint на инвестицию
Добавить уникальный индекс по `(user_id, package_id)` или `tx_hash` чтобы исключить дубли

---

## 10. Деплой на Render

Настроен в `render.yaml`. Каждый `git push` в ветку `main` автоматически пересобирает и деплоит проект.

Скрипт сборки: `build-render.sh` → устанавливает зависимости, собирает фронт (`build:prod`) и бэк.

Для ручного деплоя:
```bash
git add .
git commit -m "описание изменений"
git push origin main
```

---

## 11. Полезные команды

```bash
pnpm install                              # установить зависимости
pnpm --filter @workspace/db run push      # применить схему БД
pnpm run typecheck                        # проверить типы по всему проекту
pnpm --filter @workspace/trends-landing run dev   # запустить фронт (порт 5000)
pnpm --filter @workspace/api-server run dev       # запустить бэк (порт 8080)
```

---

## 12. Контакты и репозиторий

- **GitHub:** https://github.com/darcynj757-svg/trends-landing.git
- **Render prod:** см. Render Dashboard
- **Ветка разработки:** `main`
