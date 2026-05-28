/**
 * ═══════════════════════════════════════════════════════
 *  ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ — ИНВЕСТИЦИОННЫЕ ПАКЕТЫ TRENDS
 *  Токеномика v3.2  (обновлено)
 * ═══════════════════════════════════════════════════════
 *  Редактируй только этот файл — все компоненты подхватят автоматически.
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
  shares: number;       // R1 доли (price / 330.77)
  sharesR2: number;     // R2 доли (price / 430)
  tokens: number;       // $TRND аллокация
  dau50m: number;       // RevShare R1 при 50M DAU / CPM 120 ₽ ($)
  exit: string;         // диапазон выхода
  badge: string;
  recommended?: boolean;
  monetizationSources: number;
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
    shares: 0.756,
    sharesR2: 0.581,
    tokens: 151_200,
    dau50m: 120,
    exit: "1,200–2,800",
    badge: "Starter Trends",
    monetizationSources: 3,
    categories: [
      {
        id: "income",
        title: "Доход",
        items: [
          "🎯 0,756 доли RevShare — 0,00302% от выручки платформы, пожизненно, выплаты ежемесячно в USDT",
          "🪙 151 200 $TRND токенов — цена Pre-Seed $0,001653 за токен (~4× дешевле цены листинга). Vesting 6+18 мес",
          "📊 Дашборд инвестора — отслеживай свою долю и выплаты в реальном времени",
        ],
      },
      {
        id: "referral",
        title: "Партнёрская программа",
        items: [
          "🎁 Реферальные до 20% на 5 уровней (10/5/3/1/1)",
          "💰 Доход с дохода 10% на 3 уровня (5/3/2)",
          "🏆 Community Pool 6% — для топ-5 партнёров месяца",
          "📊 Партнёрский кабинет с базовой аналитикой",
        ],
      },
      {
        id: "traffic",
        title: "Реклама и трафик",
        items: [
          "🎯 $500 рекламного баланса для продвижения внутри Trends",
          "🔝 Boost ×2 — твои Reels получают приоритет в ленте на 7 дней",
        ],
      },
      {
        id: "miniapp",
        title: "В MiniApp Trends",
        items: [
          "✅ Verified-галочка на профиле",
          "🎨 Badge «Starter Trends» — все пользователи Trends видят тебя как со-инвестора платформы",
        ],
      },
      {
        id: "community",
        title: "Сообщество",
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
    shares: 3.024,
    sharesR2: 2.326,
    tokens: 604_800,
    dau50m: 479,
    exit: "4,500–11,000",
    badge: "Partner Trends",
    monetizationSources: 5,
    categories: [
      {
        id: "income",
        title: "Доход",
        items: [
          "🎯 3,024 доли RevShare — 0,0121% от выручки платформы, пожизненно, выплаты ежемесячно в USDT",
          "🪙 604 800 $TRND токенов — цена Pre-Seed $0,001653 за токен (~4× дешевле цены листинга). Vesting 6+18 мес",
          "📊 Расширенный дашборд — квартальная P&L отчётность по платформе",
        ],
      },
      {
        id: "referral",
        title: "Партнёрская программа",
        items: [
          "🎁 Реферальные до 20% на 5 уровней (10/5/3/1/1)",
          "💰 Доход с дохода 10% на 3 уровня (5/3/2)",
          "🏆 Community Pool 6% — для топ-5 партнёров месяца",
          "📊 Расширенный кабинет + аналитика структуры",
        ],
      },
      {
        id: "traffic",
        title: "Реклама и трафик",
        items: [
          "🎯 $2 500 рекламного баланса для продвижения внутри Trends",
          "🔝 Boost ×3 на 14 дней",
          "🎯 Таргет-аудитория — выбор гео и интересов для рекламы",
        ],
      },
      {
        id: "miniapp",
        title: "В MiniApp Trends",
        items: [
          "✅ Verified Pro галочка",
          "🎨 Badge «Partner Trends» — специальный дизайн тира, все пользователи видят тебя как со-инвестора Trends",
          "🎬 +5 слотов Premium-публикаций в месяц",
        ],
      },
      {
        id: "community",
        title: "Сообщество",
        items: [
          "💬 Закрытый чат + Partner-канал",
          "📞 1 групповой Q&A созвон с фаундерами в квартал",
          "📩 Ежемесячные отчёты + roadmap-апдейты",
        ],
      },
      {
        id: "influence",
        title: "Влияние",
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
    shares: 15.12,
    sharesR2: 11.63,
    tokens: 3_024_000,
    dau50m: 2393,
    exit: "23,000–56,000",
    badge: "Insider Trends",
    recommended: true,
    monetizationSources: 7,
    categories: [
      {
        id: "income",
        title: "Доход",
        items: [
          "🎯 15,12 доли RevShare — 0,0605% от выручки платформы, пожизненно, выплаты ежемесячно в USDT (все 7 источников)",
          "🪙 3 024 000 $TRND токенов — цена Pre-Seed $0,001653 за токен (~4× дешевле цены листинга). Vesting 6+18 мес",
          "📊 Pro-дашборд + доступ к финмодели — полная прозрачность по unit-экономике и метрикам",
        ],
      },
      {
        id: "referral",
        title: "Партнёрская программа",
        items: [
          "🎁 Реферальные до 20% на 5 уровней (10/5/3/1/1)",
          "💰 Доход с дохода 10% на 3 уровня (5/3/2)",
          "🏆 Community Pool 6% — для топ-5 партнёров месяца",
          "📊 Pro-кабинет с глубокой аналитикой",
          "🎯 Лидерборд месяца — приоритет на попадание в Pool",
        ],
      },
      {
        id: "traffic",
        title: "Реклама и трафик",
        items: [
          "🎯 $10 000 рекламного баланса для продвижения внутри Trends",
          "🔝 Boost ×5 на 30 дней",
          "🎯 Полный таргет + A/B тесты креативов",
          "📣 1 фичеринг в официальном канале Trends (300k+ аудитория)",
        ],
      },
      {
        id: "miniapp",
        title: "В MiniApp Trends",
        items: [
          "✅ Verified Pro + золотая рамка профиля",
          "🎨 Badge «Insider Trends» с анимацией — все пользователи Trends видят тебя как со-инвестора платформы",
          "🎬 +15 слотов Premium-публикаций в месяц",
          "🎁 Доступ к бета-фичам за 2 недели до релиза",
        ],
      },
      {
        id: "community",
        title: "Сообщество",
        items: [
          "💬 Insider-чат + Partner-канал",
          "📞 Ежемесячный 1-on-1 созвон с фаундером (30 мин)",
          "📩 Полная отчётность + доступ к KPI-дашборду команды",
        ],
      },
      {
        id: "influence",
        title: "Влияние",
        items: [
          "🗳 Голос в опросах + право на питч-фичу",
          "🎤 Упоминание в credits приложения",
        ],
      },
      {
        id: "future",
        title: "Будущее",
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
    shares: 75.59,
    sharesR2: 58.14,
    tokens: 15_118_000,
    dau50m: 11965,
    exit: "115,000–280,000",
    badge: "Visionary Trends",
    monetizationSources: 7,
    categories: [
      {
        id: "income",
        title: "Доход",
        items: [
          "🎯 75,59 доли RevShare — 0,302% от выручки платформы, пожизненно, выплаты ежемесячно в USDT (все 7 источников)",
          "🪙 15 118 000 $TRND токенов — цена Pre-Seed $0,001653 за токен (~4× дешевле цены листинга). Vesting 6+18 мес",
          "📊 Полный доступ к финмодели + board-update — квартальный отчёт уровня совета директоров",
          "💸 Co-investment права — участие в портфельных проектах Trends Ventures на pre-money цене",
        ],
      },
      {
        id: "referral",
        title: "Партнёрская программа",
        items: [
          "🎁 Реферальные до 20% на 5 уровней (10/5/3/1/1)",
          "💰 Доход с дохода 10% на 3 уровня (5/3/2)",
          "🏆 Community Pool 6% — для топ-5 партнёров месяца",
          "📊 Premium-кабинет + персональный аналитик",
          "🌐 B2B-сеть Trends для масштабирования рефералов",
          "🎯 Приоритет в Community Pool",
        ],
      },
      {
        id: "traffic",
        title: "Реклама и трафик",
        items: [
          "🎯 $50 000 рекламного баланса для продвижения внутри Trends",
          "🔝 Boost ×10 + permanent priority в алгоритме",
          "🎯 Премиум-таргет + AI-оптимизация креативов",
          "📣 3 фичеринга + интеграция в push-уведомления",
          "🌐 Cross-promo с топ-блогерами платформы",
        ],
      },
      {
        id: "miniapp",
        title: "В MiniApp Trends",
        items: [
          "✅ Verified Elite + кастомная рамка профиля",
          "🎨 Badge «Visionary Trends» золотой, анимированный (1 of 50) — все пользователи Trends видят тебя как со-инвестора платформы",
          "🎬 Безлимитные Premium-публикации",
          "🎁 Закрытая alpha новых фич — за 1 мес до релиза",
          "🏷 Кастомный URL профиля (trends.app/yourname)",
        ],
      },
      {
        id: "community",
        title: "Сообщество",
        items: [
          "💬 Visionary-чат с CEO/CTO напрямую",
          "📞 Еженедельный 1-on-1 с фаундером (60 мин)",
          "📩 Доступ ко всем internal-документам (whitelisted Notion)",
        ],
      },
      {
        id: "influence",
        title: "Влияние",
        items: [
          "🗳 Право голоса на product council — квартальные стратегические решения",
          "🎤 Co-branding возможность — твой логотип в одном из разделов",
          "📺 Совместный PR — интервью / подкаст с фаундерами",
        ],
      },
      {
        id: "future",
        title: "Будущее",
        items: [
          "🚀 ROFR в Seed Global и Series A",
          "💼 Advisory board observer seat",
          "🎯 Token boost +10% при следующем раунде",
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
    shares: 302.4,
    sharesR2: 232.56,
    tokens: 60_480_000,
    dau50m: 47845,
    exit: "460,000–1,100,000",
    badge: "Co-Investor Trends",
    monetizationSources: 7,
    categories: [
      {
        id: "income",
        title: "Доход",
        items: [
          "🎯 302,4 доли RevShare — 1,21% от выручки платформы, пожизненно, выплаты ежемесячно в USDT (все 7 источников)",
          "🪙 60 480 000 $TRND токенов — цена Pre-Seed $0,001653 за токен (~4× дешевле цены листинга). Vesting 6+18 мес",
          "📊 Board-level доступ ко всем метрикам — полная прозрачность финансов, P&L, cap table",
          "💸 Co-investment права во всех проектах Trends Ventures — доступ к будущим стартапам на pre-money цене",
          "🏦 Pro-rata права — сохранение % доли в следующих раундах",
        ],
      },
      {
        id: "referral",
        title: "Партнёрская программа",
        items: [
          "🎁 Реферальные до 20% на 5 уровней (10/5/3/1/1)",
          "💰 Доход с дохода 10% на 3 уровня (5/3/2)",
          "🏆 Community Pool 6% — для топ-5 партнёров месяца",
          "📊 Enterprise-кабинет + личный партнёрский менеджер",
          "🌐 Полный B2B-доступ к сети Trends",
          "💎 Lifetime условия — статус и % сохраняются навсегда",
        ],
      },
      {
        id: "traffic",
        title: "Реклама и трафик",
        items: [
          "🎯 Безлимитный рекламный баланс — без лимитов каждый месяц",
          "🔝 Permanent algorithmic priority для всего твоего контента",
          "🎯 Dedicated growth-менеджер от команды Trends",
          "📣 Безлимитные фичеринги + push + email-кампании",
          "🌐 Полная cross-promo программа с топ-100 блогеров",
          "🎬 Совместное продакшн-видео от команды Trends",
        ],
      },
      {
        id: "miniapp",
        title: "В MiniApp Trends",
        items: [
          "✅ Verified Founder Circle + уникальный визуал профиля",
          "🎨 Badge «Co-Investor Trends» (1 of 20, навсегда) — все пользователи Trends видят тебя как со-инвестора и сооснователя платформы",
          "🎬 Безлимит Premium + собственная категория/раздел в приложении",
          "🎁 Co-creation мод — участвуй в дизайне фич",
          "🏷 Premium-домен профиля + кастомизация",
        ],
      },
      {
        id: "community",
        title: "Сообщество",
        items: [
          "💬 Прямая связь с CEO/CTO/CPO 24/7 (личный Telegram)",
          "📞 Доступ ко всем internal-митингам команды",
          "📩 Real-time дашборд + еженедельный отчёт лично от CEO",
        ],
      },
      {
        id: "influence",
        title: "Влияние",
        items: [
          "🗳 Полный голос в стратегических решениях (board-level)",
          "🎤 Co-founder branding — упоминание как стратегического партнёра",
          "📺 PR-кампания совместно (Forbes, TechCrunch, профильные медиа)",
          "🏛 Влияние на M&A решения и стратегию выхода",
        ],
      },
      {
        id: "future",
        title: "Будущее",
        items: [
          "🚀 Advisory board seat с правом голоса",
          "💼 Equity-share option в холдинговой компании Trends Inc.",
          "🎯 Token boost +25% при следующем раунде",
          "🤝 Lifetime partnership — статус сохраняется при любых корп. изменениях",
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
