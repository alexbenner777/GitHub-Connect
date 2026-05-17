import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, ArrowLeft, Wallet, ExternalLink, Smartphone, ChevronRight, TrendingUp, Users, Crown, Star, Shield, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";

export const MONTHLY_PROFIT: Record<string, number> = {
  founder1: 4,
  founder2: 15,
  founder3: 74,
  founder4: 371,
  founder5: 1484,
};

export const PACKAGES = [
  {
    id: "founder1",
    name: "Старт",
    price: 250,
    monthly: 4,
    shares: 0.63,
    exit: "1,300–3,000",
    dau50m: 158,
    badge: "Investor",
    color: "text-secondary",
    border: "border-secondary/40",
    icon: Star,
    categories: [
      {
        title: "Доход",
        items: [
          "RevShare доля 0.63 — ежемесячные выплаты в USDT",
          "Реферальная программа: 10% с 1 уровня, до 3 уровней",
          "Community Pool: при 2 рефералах и обороте $10K",
        ],
      },
      {
        title: "В приложении Trends",
        items: [
          "Badge «Investor» на аватаре — виден всем пользователям",
          "Ранний бета-доступ к новым фичам раньше 99%",
        ],
      },
      {
        title: "Информация",
        items: ["Ежеквартальный публичный отчёт инвесторам"],
      },
    ],
  },
  {
    id: "founder2",
    name: "Основатель",
    price: 1000,
    monthly: 15,
    shares: 2.5,
    exit: "5,000–12,000",
    dau50m: 626,
    badge: "Founder",
    color: "text-primary",
    border: "border-primary/40",
    icon: Shield,
    categories: [
      {
        title: "Доход",
        items: [
          "RevShare доля 2.5 — выплаты ежемесячно в USDT",
          "Community Pool: Mini Pool + Max Pool квалификация",
          "Реферальная программа 5 уровней",
          "Скидка 20% на рекламные показы внутри Trends",
        ],
      },
      {
        title: "В приложении Trends",
        items: [
          "Badge «Founder» — специальный дизайн",
          "500 бесплатных показов в ленте каждый месяц",
          "Доступ к новым функциям за 2 недели до выхода",
          "Расширенная аналитика канала (CTR, охваты, источники)",
        ],
      },
      {
        title: "Рост канала",
        items: [
          "Раздел «Рекомендуемые каналы» 1 раз в квартал",
          "Приоритет в маркетплейсе брендов",
        ],
      },
      {
        title: "Сообщество",
        items: ["Закрытый Telegram-канал инвесторов с апдейтами от команды"],
      },
    ],
  },
  {
    id: "founder3",
    name: "Партнёр",
    price: 5000,
    monthly: 74,
    shares: 12.5,
    exit: "25,000–60,000",
    dau50m: 3132,
    badge: "Founding Partner",
    recommended: true,
    color: "text-yellow-400",
    border: "border-yellow-400/30",
    icon: Crown,
    categories: [
      {
        title: "Доход",
        items: [
          "RevShare доля 12.5 — от всех 7 источников монетизации",
          "Community Pool: Mini + Max",
          "Скидка 30% на рекламные размещения навсегда",
          "Повышенный приоритет в реферальном ранжировании",
        ],
      },
      {
        title: "В приложении Trends",
        items: [
          "Badge «Founding Partner» с анимацией — уникальный дизайн",
          "3 000 бесплатных показов в ленте каждый месяц",
          "Кастомная рамка профиля — эксклюзив для Партнёров",
          "Буст в алгоритме рекомендаций",
          "Ранний доступ к e-commerce, paywall, гифтинг",
        ],
      },
      {
        title: "Сообщество и команда",
        items: [
          "Закрытый чат с командой — вопросы напрямую CEO/CTO",
          "Ежемесячный дашборд: выручка, DAU, топ-метрики",
          "Закрытые онлайн-встречи с командой (1 раз в квартал)",
          "Приоритетные вопросы на AMA-сессиях",
        ],
      },
      {
        title: "Эксклюзив",
        items: ["Именной PDF-сертификат «Founding Partner — Trends 2026»"],
      },
    ],
  },
  {
    id: "founder4",
    name: "Стратег",
    price: 25000,
    monthly: 371,
    shares: 62.5,
    exit: "125,000–300,000",
    dau50m: 15659,
    badge: "Strategic Partner",
    color: "text-orange-400",
    border: "border-orange-400/30",
    icon: TrendingUp,
    categories: [
      {
        title: "Доход",
        items: [
          "RevShare доля 62.5 — от всех 7 источников монетизации",
          "Whitelist на токен платформы — приоритетная аллокация при TGE",
          "Скидка 50% на все рекламные размещения навсегда",
          "Партнёрская комиссия с брендов из маркетплейса",
        ],
      },
      {
        title: "В приложении Trends",
        items: [
          "Badge «Strategic Partner» — золотой, анимированная рамка",
          "20 000 бесплатных показов в ленте каждый месяц",
          "Блок «Рекомендует Trends» — платформа продвигает канал",
          "Имя / ник на странице «Инвесторы» внутри приложения",
          "Агрегированные данные платформы по нише",
        ],
      },
      {
        title: "Сервис",
        items: [
          "Персональный менеджер, SLA ответа 24 часа",
          "Advisory Board: голосуешь за фичи и роадмап",
          "Квартальный личный звонок с CEO (45 минут)",
          "Приглашение на закрытый инвестор-день при запуске (+1 гость)",
        ],
      },
      {
        title: "Эксклюзив",
        items: [
          "Именной физический сертификат «Founding Investor» с подписью CEO",
          "VIP-место на офлайн-ивенте при публичном запуске",
        ],
      },
    ],
  },
  {
    id: "founder5",
    name: "Genesis Whale",
    price: 100000,
    monthly: 1484,
    shares: 250,
    exit: "500,000–1,200,000",
    dau50m: 62637,
    badge: "Genesis Whale",
    color: "text-amber-400",
    border: "border-amber-400/30",
    icon: Zap,
    categories: [
      {
        title: "Доход",
        items: [
          "RevShare доля 250 — максимально возможная на платформе",
          "Whitelist + приоритетная аллокация + lock-up на лучших условиях",
          "Первый приоритет на equity при Series A",
          "Co-revenue: доля от совместных брендовых кампаний Trends",
          "Скидка 70% на все платные сервисы навсегда",
        ],
      },
      {
        title: "В приложении Trends",
        items: [
          "Badge «Genesis Whale» — только 10 штук на всей платформе",
          "Неограниченные бесплатные показы в ленте",
          "Лого / имя на странице «Genesis Founders» — виден при онбординге",
          "Именной ролик «Meet our Genesis Investors» по всей платформе",
          "Синяя галочка немедленно + кастомизация интерфейса",
        ],
      },
      {
        title: "Сервис и влияние",
        items: [
          "Ежемесячный личный звонок с CEO (без ограничений)",
          "Участие в формировании токеномики",
          "Co-branding: совместные кампании Trends × твой бренд",
          "Доступ к сырым данным платформы (API + дашборд)",
        ],
      },
      {
        title: "Эксклюзив",
        items: [
          "NFT-сертификат «Genesis Investor» on-chain (TON-блокчейн)",
          "Физический trophy от команды — ручная работа, доставка по миру",
          "VIP-приглашение на запуск Trends (+2 гостя)",
          "Ежегодный «Whale Summit» — закрытая встреча топ-инвесторов",
        ],
      },
    ],
  },
];

const PAYMENT_WALLET = "UQCG4jJ5BHZhV0qAOwYxMNemhgcdtMBJv5cDXs0O5K3LNAgt";
const USDT_MASTER = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

function buildTonkeeperLink(amountUsd: number, comment: string): string {
  const nanoUsdt = amountUsd * 1_000_000;
  const params = new URLSearchParams({
    jetton: USDT_MASTER,
    amount: String(nanoUsdt),
    text: comment,
  });
  return `https://app.tonkeeper.com/transfer/${PAYMENT_WALLET}?${params.toString()}`;
}

function buildTonspaceLink(amountUsd: number, comment: string): string {
  const nanoUsdt = amountUsd * 1_000_000;
  const params = new URLSearchParams({
    jetton: USDT_MASTER,
    amount: String(nanoUsdt),
    text: comment,
  });
  return `https://tonspace.co/transfer/${PAYMENT_WALLET}?${params.toString()}`;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

export function InvestmentModal({ isOpen, onClose, defaultPackage = "founder3" }: {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const connectedAddress = useTonAddress();
  const { open: openTonModal } = useTonConnectModal();

  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState(defaultPackage);
  const [walletFrom, setWalletFrom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPkg(defaultPackage);
      setWalletFrom("");
      setSubmitting(false);
    }
  }, [isOpen, defaultPackage]);

  useEffect(() => {
    if (connectedAddress) setWalletFrom(connectedAddress);
  }, [connectedAddress]);

  const pkg = PACKAGES.find(p => p.id === selectedPkg)!;

  const copyWallet = () => {
    navigator.clipboard.writeText(PAYMENT_WALLET);
    toast({ title: "Адрес скопирован!" });
  };

  const tonkeeperLink = buildTonkeeperLink(pkg.price, `Trends ${pkg.name}`);
  const tonspaceLink = buildTonspaceLink(pkg.price, `Trends ${pkg.name}`);

  const handleWalletAppPay = (url: string) => {
    window.open(url, "_blank");
    setTimeout(() => setStep(3), 1500);
  };

  const handleSubmit = async () => {
    if (!user) {
      onClose();
      setLocation("/login");
      return;
    }
    setSubmitting(true);
    try {
      await api.createInvestment({
        packageId: selectedPkg,
        walletFrom: walletFrom || connectedAddress || undefined,
      });
      setStep(4);
    } catch (err: any) {
      toast({ title: err.message ?? "Ошибка", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[680px] bg-card border-card-border text-card-foreground max-h-[92vh] overflow-hidden flex flex-col p-0">
        <DialogTitle className="sr-only">Инвестировать в Trends</DialogTitle>

        <AnimatePresence mode="wait">

          {/* Step 1 — выбор пакета */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="flex flex-col h-full overflow-hidden">

              <div className="px-6 pt-6 pb-4 border-b border-white/8">
                <h2 className="text-2xl font-bold text-center">Выберите пакет</h2>
                <p className="text-center text-xs text-muted-foreground mt-1">Нажмите на пакет — увидите все условия</p>
              </div>

              <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

                {/* Left — package selector */}
                <div className="md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r border-white/8 overflow-y-auto">
                  <div className="p-3 space-y-1.5">
                    {PACKAGES.map((p) => {
                      const PkgIcon = p.icon;
                      const isActive = selectedPkg === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPkg(p.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all border ${
                            isActive
                              ? `${p.border} bg-white/8`
                              : "border-transparent hover:border-white/10 hover:bg-white/4"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <PkgIcon className={`w-4 h-4 shrink-0 ${p.color}`} />
                              <div className="min-w-0">
                                <div className={`text-sm font-bold truncate ${isActive ? p.color : ""}`}>
                                  {p.name}
                                  {p.recommended && <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">ХИТ</span>}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">${p.price.toLocaleString()}</div>
                              </div>
                            </div>
                            {isActive && <ChevronRight className={`w-4 h-4 shrink-0 ${p.color}`} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right — details panel */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPkg}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="p-5 space-y-5"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <pkg.icon className={`w-5 h-5 ${pkg.color}`} />
                            <h3 className={`text-xl font-black ${pkg.color}`}>{pkg.name}</h3>
                            {pkg.recommended && (
                              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">★ РЕКОМЕНДУЕМ</span>
                            )}
                          </div>
                          <div className="text-2xl font-black">${pkg.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">единовременная инвестиция · USDT</div>
                        </div>
                        <div className={`text-right shrink-0 px-3 py-2 rounded-xl border ${pkg.border} bg-white/4`}>
                          <div className="text-[10px] text-muted-foreground mb-0.5">Badge в приложении</div>
                          <div className={`text-xs font-bold ${pkg.color}`}>«{pkg.badge}»</div>
                        </div>
                      </div>

                      {/* DAU 50M potential — hero highlight */}
                      <div className="rounded-xl border border-green-500/25 bg-green-500/8 p-3.5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-green-400/80 font-medium">Потенциал при 50 млн DAU</div>
                          <div className="text-xl font-black text-green-400 tabular-nums">${fmt(pkg.dau50m)}<span className="text-sm font-normal text-green-400/70">/мес</span></div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-muted-foreground">Exit потенциал</div>
                          <div className="text-xs font-bold text-foreground">${pkg.exit}</div>
                        </div>
                      </div>

                      {/* Categorized features */}
                      <div className="space-y-4">
                        {pkg.categories.map((cat) => (
                          <div key={cat.title}>
                            <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${pkg.color}`}>{cat.title}</div>
                            <ul className="space-y-1.5">
                              {cat.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${pkg.color}`} />
                                  <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* RevShare info */}
                      <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-xl bg-white/4 border border-white/8">
                        <div>
                          <div className={`text-base font-black tabular-nums ${pkg.color}`}>{pkg.shares}</div>
                          <div className="text-[10px] text-muted-foreground">доля RevShare</div>
                        </div>
                        <div className="border-l border-white/8">
                          <div className="text-base font-black text-green-400 tabular-nums">${pkg.monthly}</div>
                          <div className="text-[10px] text-muted-foreground">RevShare/мес сейчас</div>
                        </div>
                      </div>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA */}
              <div className="p-4 border-t border-white/8">
                <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12 text-base" onClick={() => setStep(2)}>
                  Инвестировать ${pkg.price.toLocaleString()} →
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — оплата */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="p-6 space-y-5 overflow-y-auto">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <h2 className="text-2xl font-bold text-center">Оплата</h2>

              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className={`text-4xl font-black ${pkg.color}`}>${pkg.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Пакет «{pkg.name}» · USDT (TON)</div>
                <div className="mt-2 text-xs text-green-400/80 font-medium">
                  Потенциал при 50 млн DAU: <span className="font-black text-green-400">${fmt(pkg.dau50m)}/мес</span>
                </div>
              </div>

              {connectedAddress ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-green-400 font-semibold">Кошелёк подключён — адрес сохранён</div>
                    <div className="text-xs font-mono text-muted-foreground truncate">{connectedAddress}</div>
                  </div>
                </div>
              ) : (
                <button onClick={openTonModal}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <Wallet className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Подключить кошелёк</div>
                    <div className="text-xs text-muted-foreground">Адрес заполнится автоматически</div>
                  </div>
                </button>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-center">Выберите кошелёк для оплаты:</p>

                <button onClick={() => handleWalletAppPay(tonkeeperLink)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0098EA] to-[#006BB5] flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">TonKeeper</div>
                    <div className="text-xs text-muted-foreground">Откроется с предзаполненным платежом</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>

                <button onClick={() => handleWalletAppPay(tonspaceLink)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B5EFF] to-[#5B3FDF] flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">TonSpace</div>
                    <div className="text-xs text-muted-foreground">Откроется с предзаполненным платежом</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — подтверждение */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="p-6 space-y-5 overflow-y-auto">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <h2 className="text-2xl font-bold text-center">Подтверждение</h2>

              <div className="bg-white/5 rounded-2xl p-5 space-y-3 border border-white/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Пакет:</span>
                  <span className="font-bold">«{pkg.name}»</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма:</span>
                  <span className="font-black text-primary">${pkg.price.toLocaleString()} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доля RevShare:</span>
                  <span className="font-semibold">{pkg.shares}</span>
                </div>
                <div className="flex justify-between border-t border-white/8 pt-3">
                  <span className="text-muted-foreground">При 50 млн DAU:</span>
                  <span className="font-black text-green-400">${fmt(pkg.dau50m)}/мес</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Ваш TON-адрес (необязательно)</label>
                <Input placeholder="UQ... или EQ..."
                  value={walletFrom} onChange={e => setWalletFrom(e.target.value)}
                  className="bg-background/50 border-white/10 h-11 font-mono text-xs" />
                <p className="text-xs text-muted-foreground mt-1">Поможет нам найти вашу транзакцию быстрее</p>
              </div>

              {!user && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-300">
                  Для отслеживания инвестиции войдите в аккаунт.
                </div>
              )}

              <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12"
                onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить заявку"}
              </Button>
            </motion.div>
          )}

          {/* Step 4 — успех */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-6 space-y-5 text-center py-8 overflow-y-auto">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-gradient">Заявка принята!</h2>
              <p className="text-muted-foreground">
                Пакет <strong>«{pkg.name}»</strong> активирован. Инвестиция подтверждена, MLM-бонусы уже начисляются.
              </p>
              <div className="rounded-xl border border-green-500/20 bg-green-500/8 p-4">
                <div className="text-xs text-green-400/70 mb-1">Ваш потенциал при 50 млн DAU</div>
                <div className="text-2xl font-black text-green-400">${fmt(pkg.dau50m)}<span className="text-base font-normal">/мес</span></div>
              </div>
              <a
                href={`https://tonviewer.com/${PAYMENT_WALLET}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Посмотреть в TON Explorer
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full btn-grad font-bold rounded-xl" onClick={() => {
                  onClose();
                  setLocation("/cabinet");
                }}>
                  Перейти в кабинет
                </Button>
                <Button variant="ghost" className="w-full" onClick={onClose}>Закрыть</Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
