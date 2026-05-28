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
  dau50m: number;       // RevShare R1 при 50M DAU / CPM 120 ₽ ($)
  exit: string;
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
    shares: 0.755,
    sharesR2: 0.581,
    tokens: 151_057,
    dau50m: 120,
    exit: "1,200–2,800",
    badge: "Starter Trends",
    monetizationSources: 3,
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 0,755 доли = 0,01511% от рекламной выручки Trends — ежемесячно в USDT",
          "🪙 151 057 $TRND по цене $0,001655 (R1) / $0,002150 (R2)",
          "🤝 Партнёрка: 20% / 10% / 6% от покупок рефералов (3 уровня)",
          "🚀 Exit potential: $1 200 – $2 800 при оценке $50M–$120M",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎯 500 показов рекламы в ленте Trends",
          "🎁 Промокод на 10% скидку для друзей",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "📱 Стартовый бейдж Investor",
          "🔒 Доступ к закрытым обновлениям Trends",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Закрытый Telegram-чат инвесторов",
          "📊 Ежеквартальный отчёт по метрикам",
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
    dau50m: 478,
    exit: "4,500–11,000",
    badge: "Partner Trends",
    monetizationSources: 5,
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 3,021 доли = 0,06042% от рекламной выручки Trends — ежемесячно в USDT",
          "🪙 604 229 $TRND по цене $0,001655 (R1) / $0,002150 (R2)",
          "🤝 Партнёрка: 20% / 10% / 6% от покупок рефералов (3 уровня)",
          "🚀 Exit potential: $4 500 – $11 000 при оценке $50M–$120M",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎯 2 500 показов рекламы в ленте Trends",
          "🎁 Личный промокод на 15% скидку",
          "📣 1 нативное размещение в подборке",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "📱 Бейдж Partner",
          "⚡ Ранний доступ к новым фичам",
          "🛟 Приоритетная поддержка",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Закрытый Telegram-чат Partner+",
          "📊 Ежемесячный отчёт по метрикам",
          "🎙 Доступ к Q&A с командой раз в квартал",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Право голоса в опросах по продукту",
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
    dau50m: 2390,
    exit: "23,000–56,000",
    badge: "Insider Trends",
    recommended: true,
    monetizationSources: 7,
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 15,11 долей = 0,3022% от рекламной выручки Trends — ежемесячно в USDT",
          "🪙 3 021 148 $TRND по цене $0,001655 (R1) / $0,002150 (R2)",
          "🤝 Партнёрка: 20% / 10% / 6% от покупок рефералов (3 уровня)",
          "🚀 Exit potential: $23 000 – $56 000 при оценке $50M–$120M",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎯 15 000 показов рекламы в ленте Trends",
          "🎁 Личный промокод на 20% скидку",
          "📣 3 нативных размещения в подборках",
          "📢 1 пост в официальном канале Trends",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "📱 Бейдж Insider ★",
          "⚡ Ранний доступ ко всем фичам в beta",
          "🛟 Приоритетная поддержка 24/7",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Закрытый Telegram-чат Insider+",
          "📞 Ежемесячный отчёт + личный созвон раз в квартал",
          "🤝 Прямой контакт с фаундером",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Право голоса в продуктовых решениях",
          "🗺 Участие в выборе функций roadmap",
        ],
      },
      {
        id: "future",
        title: "БУДУЩЕЕ",
        items: [
          "🚀 Приоритет в follow-on раундах",
          "📋 Pre-list доступ к листингу $TRND",
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
    dau50m: 11951,
    exit: "115,000–280,000",
    badge: "Visionary Trends",
    monetizationSources: 7,
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 75,53 долей = 1,511% от рекламной выручки Trends — ежемесячно в USDT",
          "🪙 15 105 740 $TRND по цене $0,001655 (R1) / $0,002150 (R2)",
          "🤝 Партнёрка: 20% / 10% / 6% от покупок рефералов (3 уровня)",
          "🚀 Exit potential: $115 000 – $280 000 при оценке $50M–$120M",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎯 75 000 показов рекламы в ленте Trends",
          "🎁 Личный промокод на 25% скидку",
          "📣 10 нативных размещений в подборках",
          "📢 3 поста в официальном канале Trends",
          "📈 Участие в маркетинговой стратегии",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "📱 Бейдж Visionary",
          "🔒 Эксклюзивный доступ ко всем закрытым фичам",
          "🛟 Персональный менеджер 24/7",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Закрытый Telegram-чат Visionary+",
          "📞 Личный созвон с фаундером раз в месяц",
          "🥂 Закрытые ужины с командой раз в квартал",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🗳 Прямое влияние на product roadmap",
          "🛠 Co-creation новых функций",
          "🛑 Право вето на ключевые решения по продукту",
        ],
      },
      {
        id: "future",
        title: "БУДУЩЕЕ",
        items: [
          "🚀 Гарантированный аллокейшн в follow-on раундах",
          "📋 Pre-list доступ к листингу $TRND по цене раунда",
          "💼 Участие в advisory board",
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
    dau50m: 47807,
    exit: "460,000–1,100,000",
    badge: "Co-Investor Trends",
    monetizationSources: 7,
    categories: [
      {
        id: "income",
        title: "ДОХОД",
        items: [
          "💸 302,11 долей = 6,042% от рекламной выручки Trends — ежемесячно в USDT",
          "🪙 60 422 961 $TRND по цене $0,001655 (R1) / $0,002150 (R2)",
          "🤝 Партнёрка: 20% / 10% / 6% от покупок рефералов (3 уровня)",
          "🚀 Exit potential: $460 000 – $1 100 000 при оценке $50M–$120M",
        ],
      },
      {
        id: "traffic",
        title: "РЕКЛАМА И ТРАФИК",
        items: [
          "🎯 300 000 показов рекламы в ленте Trends",
          "🎁 Личный промокод на 30% скидку",
          "📣 Безлимит нативных размещений в подборках",
          "📢 10 постов в официальном канале Trends",
          "📈 Со-руководство маркетинговой стратегией",
        ],
      },
      {
        id: "miniapp",
        title: "В MINIAPP TRENDS",
        items: [
          "📱 Бейдж Co-Investor (топ-уровень)",
          "🔒 Полный доступ ко всем фичам, включая внутренние",
          "🛟 Персональная команда поддержки",
        ],
      },
      {
        id: "community",
        title: "СООБЩЕСТВО",
        items: [
          "💬 Прямой канал с фаундером 24/7",
          "🤝 Личные встречи с командой раз в месяц",
          "🌐 Закрытые мероприятия и поездки",
        ],
      },
      {
        id: "influence",
        title: "ВЛИЯНИЕ",
        items: [
          "🏛 Место в совете директоров",
          "🗳 Co-decision по стратегии компании",
          "🛑 Право вето на ключевые корпоративные решения",
        ],
      },
      {
        id: "future",
        title: "БУДУЩЕЕ",
        items: [
          "🚀 Приоритетный аллокейшн во всех раундах",
          "📋 Pre-list доступ к $TRND по цене раунда",
          "📈 Опцион на дополнительные доли в Series A",
          "💼 Co-investment opportunities в портфельные проекты",
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
