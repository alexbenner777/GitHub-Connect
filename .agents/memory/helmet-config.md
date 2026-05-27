---
name: Helmet config for Express + SPA
description: Правильная конфигурация helmet для Express API, который раздаёт SPA-статику.
---

При использовании helmet в Express API, который раздаёт React SPA, нужно отключить CSP и COEP:

```ts
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
```

**Why:** CSP по умолчанию блокирует inline-скрипты Vite и динамические импорты. COEP мешает загрузке ресурсов с других origin (шрифты Google, CDN). Без этих флагов фронтенд не загружается.

**How to apply:** Всегда применять при добавлении helmet в Express-сервер, который обслуживает Vite/React SPA.
