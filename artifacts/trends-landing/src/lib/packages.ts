/**
 * ═══════════════════════════════════════════════════════
 *  ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ — ИНВЕСТИЦИОННЫЕ ПАКЕТЫ TRENDS
 *  Токеномика v3.3  (R1=$331, R2=$430, 200k $TRND/доля)
 * ═══════════════════════════════════════════════════════
 */

export type PackageCategory = {
  id: string;
  title: string;
  items: string[];
};

export type InvestPackage = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  shares: number;       // R1 долей (price / 331)
  sharesR2: number;     // R2 долей (price / 430)
  tokens: number;       // $TRND = shares × 200 000
  dau50m: number;       // RevShare R1 при 10M DAU / CPM 120 ₽ ($)
  exit: string;
  badge: string;
  recommended?: boolean;
  slotsBadge?: string;  // напр. "⚡ ТОЛЬКО 10 СЛОТОВ · НАВСЕГДА ⚡"
  monetizationSources: number;
  highlights: string[]; // 4–5 пунктов — всегда видны в свёрнутом виде
  categories: PackageCategory[];
};

export const PACKAGES: InvestPackage[] = [

  // ─── ТЕСТ $0.1 ───────────────────────────────────────
  {
    id: "founder0",
    name: "TEST $0.1",
    tagline: "Тестовый пакет для проверки уведомлений",
    price: 0.1,
    shares: 0.01,
    sharesR2: 0.01,
    tokens: 0,
    dau50m: 0,
    exit: "—",
    badge: "TEST",
    monetizationSources: 0,
    highlights: ["🧪 Тестовый пакет — только для проверки системы уведомлений"],
    categories: [
      {
        id: "info",
        title: "Информация",
        items: ["🧪 Тестовый пакет — только для проверки системы уведомлений"],
      },
    ],
  },

  // ─── STARTER $250 ────────────────────────────────────
  {
    id: "founder1",
    name: "Starter",
    tagline: "Войти первым — уже преимущество",
    price: 250,
    shares: 0.755,
    sharesR2: 0.581,
    tokens: 151_057,
    dau50m: 24,
    exit: "1,200–2,800",
    badge: "Starter Trends",
    monetizationSources: 7,
    highlights: [
      "💸 RevShare доля 0,755 — ежемесячные выплаты в USDT",
      "🪙 151 057 $TRND — ранняя аллокация по $0,001655",
      "🎯 $500 рекламного баланса — продвигай свой бизнес/канал",
      "📱 Badge «Starter Trends» — все видят тебя как со-инвестора",
    ],
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 0,755 доли RevShare — 0,01511% от выручки, пожизненно, ежемесячно в USDT",
          "🪙 151 057 $TRND токенов — Pre-Seed $0,001655 (≈4× дешевле листинга), vesting 6+18 мес",
          "🤝 Партнёрская программа — до 20% реф. (5 уровней) + 10% с партнёров (3 уровня) + Community Pool 6%",
          "📊 Дашборд инвестора — доля, выплаты и партнёрская сеть в реальном времени",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎁 $500 рекламного баланса для продвижения внутри Trends",
          "🔝 Boost x2 — твои Reels в приоритете 7 дней",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "✅ Verified-галочка на профиле",
          "🎨 Badge «Starter Trends» — видят все пользователи Trends",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Закрытый Telegram-чат инвесторов",
          "📩 Ежемесячный отчёт от команды",
        ],
      },
    ],
  },

  // ─── PARTNER $1 000 ──────────────────────────────────
  {
    id: "founder2",
    name: "Partner",
    tagline: "Реальный буст для канала, дохода и связей",
    price: 1000,
    shares: 3.021,
    sharesR2: 2.326,
    tokens: 604_229,
    dau50m: 96,
    exit: "4,500–11,000",
    badge: "Partner Trends",
    monetizationSources: 7,
    highlights: [
      "💸 RevShare доля 3,021 — ежемесячные выплаты в USDT",
      "🪙 604 229 $TRND — ранняя аллокация по $0,001655",
      "🎯 $2 500 рекламного баланса",
      "📱 Badge «Partner Trends» — все видят тебя как со-инвестора",
    ],
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 3,021 доли RevShare — 0,06042% от выручки, пожизненно, ежемесячно в USDT",
          "🪙 604 229 $TRND токенов — Pre-Seed $0,001655, vesting 6+18 мес",
          "🤝 Партнёрская программа — до 20% реф. (5 уровней) + 10% (3 уровня) + Community Pool 6%",
          "📊 Расширенный дашборд — квартальная P&L + аналитика партнёрской структуры",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎁 $2 500 рекламного баланса",
          "🔝 Boost x3 на 14 дней",
          "🎯 Таргет-аудитория — выбор гео и интересов",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "✅ Verified Pro галочка",
          "🎨 Badge «Partner Trends» — спец. дизайн тира",
          "🎬 +5 слотов Premium-публикаций в месяц",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Закрытый чат + Partner-канал",
          "📞 1 групповой Q&A с фаундерами в квартал",
          "📩 Ежемесячные отчёты + roadmap-апдейты",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Голос в опросах продукта — что добавить в Trends",
        ],
      },
    ],
  },

  // ─── INSIDER $5 000 ⭐ ───────────────────────────────
  {
    id: "founder3",
    name: "Insider",
    tagline: "Доход + мощное продвижение + прямой доступ к команде",
    price: 5000,
    shares: 15.11,
    sharesR2: 11.63,
    tokens: 3_021_148,
    dau50m: 478,
    exit: "23,000–56,000",
    badge: "Insider Trends",
    recommended: true,
    monetizationSources: 7,
    highlights: [
      "💸 RevShare доля 15,11 — выплаты в USDT (все 7 источников)",
      "🪙 3 021 148 $TRND — ранняя аллокация по $0,001655",
      "🎯 $10 000 рекламного баланса",
      "📱 Badge «Insider Trends» с анимацией",
      "📞 1-on-1 созвон с фаундером ежемесячно",
    ],
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 15,11 доли RevShare — 0,30211% от выручки, пожизненно, ежемесячно в USDT",
          "🪙 3 021 148 $TRND токенов — Pre-Seed $0,001655, vesting 6+18 мес",
          "🤝 Партнёрская программа — до 20% реф. (5 уровней) + 10% (3 уровня) + Pool 6% + лидерборд месяца",
          "📊 Pro-дашборд + доступ к финмодели — полная прозрачность по unit-экономике, метрикам и сети",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎁 $10 000 рекламного баланса",
          "🔝 Boost x5 на 30 дней",
          "🎯 Полный таргет + A/B тесты креативов",
          "📣 1 фичеринг в официальном канале Trends (300k+ аудитория)",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "✅ Verified Pro + золотая рамка профиля",
          "🎨 Badge «Insider Trends» с анимацией",
          "🎬 +15 слотов Premium-публикаций в месяц",
          "🎁 Бета-фичи за 2 недели до релиза",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Insider-чат + Partner-канал",
          "📞 Ежемесячный 1-on-1 с фаундером (30 мин)",
          "📩 Полная отчётность + KPI-дашборд команды",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Голос в опросах + право на питч-фичу",
          "🎤 Упоминание в credits приложения",
        ],
      },
      {
        id: "future",
        title: "БУДУЩЕЕ",
        items: [
          "🚀 Приоритет в следующих раундах (Seed Global → Series A) по pre-money цене",
        ],
      },
    ],
  },

  // ─── VISIONARY $25 000 ───────────────────────────────
  {
    id: "founder4",
    name: "Visionary",
    tagline: "Ты влияешь на платформу — платформа работает на тебя",
    price: 25000,
    shares: 75.53,
    sharesR2: 58.14,
    tokens: 15_105_740,
    dau50m: 2390,
    exit: "115,000–280,000",
    badge: "Visionary Trends",
    monetizationSources: 7,
    highlights: [
      "💸 RevShare доля 75,53 — выплаты в USDT (все 7 источников)",
      "🪙 15 105 740 $TRND — ранняя аллокация по $0,001655",
      "🎯 $50 000 рекламного баланса — неограниченное продвижение",
      "📱 Badge «Visionary Trends» золотой (1 of 50)",
      "📞 Еженедельный 1-on-1 с фаундером (60 мин)",
    ],
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 75,53 доли RevShare — 1,51057% от выручки, пожизненно, ежемесячно в USDT",
          "🪙 15 105 740 $TRND токенов — Pre-Seed $0,001655, vesting 6+18 мес",
          "🤝 Партнёрская программа — до 20% (5 уровней) + 10% (3 уровня) + Pool 6% + приоритет в Pool + B2B-сеть Trends",
          "🏛 Co-investment права — Trends Ventures на pre-money цене",
          "📊 Premium-дашборд + финмодель — квартальный board-update + персональный аналитик",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎁 $50 000 рекламного баланса",
          "🔝 Boost x10 + permanent priority в алгоритме",
          "🎯 Премиум-таргет + AI-оптимизация креативов",
          "📣 3 фичеринга + интеграция в push-уведомления",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "✅ Verified Elite + кастомная рамка профиля",
          "🎨 Badge «Visionary Trends» золотой, анимированный (1 of 50)",
          "🎬 Безлимитные Premium-публикации",
          "🎁 Закрытая alpha новых фич — за 1 мес до релиза",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Visionary-чат с CEO/CTO напрямую",
          "📞 Еженедельный 1-on-1 с фаундером (60 мин)",
          "📩 Доступ ко всем internal-документам (whitelisted Notion)",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Право голоса на product council — квартальные стратегические решения",
          "🎤 Co-branding — твой логотип в одном из разделов",
          "📺 Совместный PR — интервью / подкаст с фаундерами",
        ],
      },
      {
        id: "future",
        title: "БУДУЩЕЕ",
        items: [
          "🚀 ROFR в Seed Global и Series A",
          "💼 Advisory board observer seat",
        ],
      },
    ],
  },

  // ─── CO-INVESTOR $100 000 ────────────────────────────
  {
    id: "founder5",
    name: "Co-Investor",
    tagline: "Максимум. Только 10 слотов. Навсегда.",
    price: 100000,
    shares: 302.11,
    sharesR2: 232.56,
    tokens: 60_422_961,
    dau50m: 9561,
    exit: "460,000–1,100,000",
    badge: "Co-Investor Trends",
    slotsBadge: "⚡ ТОЛЬКО 10 СЛОТОВ · НАВСЕГДА ⚡",
    monetizationSources: 7,
    highlights: [
      "💸 RevShare доля 302,11 — максимально возможная (все 7 источников)",
      "🪙 60 422 961 $TRND — ранняя аллокация по $0,001655",
      "🎯 Безлимитное продвижение — без лимитов каждый месяц",
      "📱 Badge «Co-Investor Trends» (1 of 20)",
      "🤝 Прямая связь с CEO/CTO/CPO 24/7",
    ],
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 302,11 доли RevShare — 6,04230% от выручки, пожизненно, ежемесячно в USDT",
          "🪙 60 422 961 $TRND токенов — Pre-Seed $0,001655, vesting 6+18 мес",
          "🤝 Партнёрская программа — до 20% (5 уровней) + 10% (3 уровня) + Pool 6% + личный партнёрский менеджер + lifetime",
          "🏛 Co-investment во всех проектах Trends Ventures — pre-money цена",
          "📊 Board-level доступ ко всем метрикам — финансы, P&L, cap table",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎁 Безлимитный рекламный баланс — без лимитов каждый месяц",
          "🔝 Permanent algorithmic priority для всего контента",
          "📣 Безлимитные фичеринги + push + email-кампании",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "✅ Verified Founder Circle + уникальный визуал профиля",
          "🎨 Badge «Co-Investor Trends» (1 of 20, навсегда)",
          "🎬 Безлимит Premium + собственная категория/раздел в приложении",
          "🎁 Co-creation мод — участвуй в дизайне фич",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Прямая связь с CEO/CTO/CPO 24/7 (личный Telegram)",
          "📞 Доступ ко всем internal-митингам команды",
          "📩 Real-time дашборд + еженедельный отчёт лично от CEO",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Полный голос в стратегических решениях (board-level)",
          "🎤 Co-founder branding — упоминание как стратегического партнёра",
          "🗣 Участие в публичных активностях Trends по согласованию",
        ],
      },
      {
        id: "future",
        title: "БУДУЩЕЕ",
        items: [
          "🚀 Advisory board seat с правом голоса",
          "💼 Equity-share option в холдинговой компании Trends Inc.",
        ],
      },
    ],
  },
];

// ─── UI-метаданные ────────────────────────────────────────────────
export const PACKAGE_UI: Record<string, {
  color: string;
  border: string;
  glow: string;
  iconName: "Star" | "Shield" | "Crown" | "TrendingUp" | "Zap";
}> = {
  founder0: { color: "text-gray-400",    border: "border-gray-400/30",     glow: "",                                              iconName: "Star"       },
  founder1: { color: "text-secondary",   border: "border-secondary/30",    glow: "",                                              iconName: "Star"       },
  founder2: { color: "text-primary",     border: "border-primary/40",      glow: "shadow-[0_0_40px_rgba(0,212,255,0.18)]",        iconName: "Shield"     },
  founder3: { color: "text-yellow-400",  border: "border-yellow-400/30",   glow: "shadow-[0_0_30px_rgba(250,204,21,0.12)]",       iconName: "Crown"      },
  founder4: { color: "text-orange-400",  border: "border-orange-400/30",   glow: "shadow-[0_0_30px_rgba(251,146,60,0.10)]",       iconName: "TrendingUp" },
  founder5: { color: "text-amber-400",   border: "border-amber-400/30",    glow: "shadow-[0_0_40px_rgba(251,191,36,0.12)]",       iconName: "Zap"        },
};

export const CATEGORY_ICON: Record<string, string> = {
  income:    "💰",
  referral:  "🤝",
  miniapp:   "📱",
  traffic:   "🎯",
  community: "💬",
  influence: "🗳",
  future:    "🚀",
  service:   "🤝",
  exclusive: "🏆",
  info:      "📋",
};
