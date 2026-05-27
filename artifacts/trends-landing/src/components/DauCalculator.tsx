import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, DollarSign, Zap,
  Star, Shield, Crown, ChevronDown, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvestPackage } from "@/lib/packages";
import { PACKAGE_UI, CATEGORY_ICON } from "@/lib/packages";
import {
  REVSHARE_CONFIG,
  calcPoolUsd,
  calcPayoutR1,
  calcPayoutR2,
  calcSharesR1,
  calcSharesR2,
} from "@/config/revshare";

export type FullPackage = InvestPackage & {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
  glow: string;
};

const CPM_RUB_DEFAULT = REVSHARE_CONFIG.SHOWS_PER_DAY === 2 ? 120 : 120;
const RUB_TO_USD      = REVSHARE_CONFIG.USD_RUB;

const DAU_MIN = 5_000_000;
const DAU_MAX = 50_000_000;
const STEPS   = 10000;

const PRESETS = [
  { label: "5 млн",  dau: 5_000_000  },
  { label: "10 млн", dau: 10_000_000 },
  { label: "15 млн", dau: 15_000_000 },
  { label: "25 млн", dau: 25_000_000 },
  { label: "50 млн", dau: 50_000_000 },
];

const CPM_MIN = 50;
const CPM_MAX = 300;

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: decimals });
}
function fmtM(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " млрд";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + " млн";
  return fmt(n);
}
function fmtDau(dau: number) {
  return dau >= 1_000_000
    ? (dau / 1_000_000).toFixed(dau % 1_000_000 === 0 ? 0 : 1) + " млн"
    : fmt(dau / 1000, 0) + "K";
}
function dauFromSlider(v: number) { return Math.round(DAU_MIN + (v / STEPS) * (DAU_MAX - DAU_MIN)); }
function sliderPosFromDau(dau: number) { return ((dau - DAU_MIN) / (DAU_MAX - DAU_MIN)) * STEPS; }

function getTopHighlights(pkg: InvestPackage): string[] {
  if (!pkg?.categories) return [];
  const out: string[] = [];
  for (const cat of pkg.categories) {
    if (out.length >= 3) break;
    if (cat.items[0]) out.push(cat.items[0]);
  }
  return out;
}

export function DauCalculator({
  onInvest,
  onSelectPackage,
  fullPackages,
}: {
  onInvest: () => void;
  onSelectPackage?: (id: string) => void;
  fullPackages?: FullPackage[];
}) {
  const [dau, setDau]             = useState(10_000_000);
  const [cpmRub, setCpmRub]       = useState(CPM_RUB_DEFAULT);
  const [expandedId, setExpanded] = useState<string | null>(null);
  const [round, setRound]         = useState<"r1" | "r2">("r1");

  const dailyRub               = dau * REVSHARE_CONFIG.SHOWS_PER_DAY * cpmRub / 1000;
  const monthlyRub             = dailyRub * REVSHARE_CONFIG.DAYS_IN_MONTH;
  const annualRub              = dailyRub * 365;
  const revsharePoolMonthlyUsd = calcPoolUsd(dau, cpmRub);
  const shareValueMonthlyUsd   = revsharePoolMonthlyUsd / REVSHARE_CONFIG.TOTAL_SHARES;
  const sliderVal              = Math.round(sliderPosFromDau(dau));

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDau(dauFromSlider(Number(e.target.value)));
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 relative z-10" id="packages">
      <div className="container mx-auto px-4">
        <div className="section-inner">

          {/* Заголовок */}
          <div className="section-header mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Инвестиционные пакеты</h2>
            <p className="text-lg text-muted-foreground">
              Беспрецедентные условия для тех, кто заходит на стадии Pre-Seed. Инвестор зарабатывает вместе с платформой каждый месяц.
            </p>
          </div>

          {/* Калькулятор DAU */}
          <div className="mb-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                Рост DAU = прямой рост выручки
              </div>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-3">
                {REVSHARE_CONFIG.SHOWS_PER_DAY} рекламных показа в день. Двигайте ползунки DAU и CPM — суммы в карточках обновляются.
              </p>
            </div>

            {/* Source disclaimer — visible callout */}
            <div className="flex items-start gap-3 mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-yellow-400 font-semibold">Калькулятор считает только 1 источник дохода</span>
                {" "}— рекламу в ленте (CPM × показы). Доходы от{" "}
                <span className="text-foreground/80">{REVSHARE_CONFIG.REVENUE_SOURCES_TOTAL - 1} других каналов</span>
                {" "}(Boost-подписки, спонсорства, донаты, аналитика, баннер, e-commerce) добавляются сверху и в расчёте{" "}
                <span className="text-foreground/80 font-semibold">не учтены</span>.
                Реальный RevShare будет выше.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8 mb-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">DAU</span>
                </div>
                <motion.div key={dau} initial={{ opacity: 0.5, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}
                  className="text-2xl md:text-3xl font-black text-primary tabular-nums">
                  {fmtDau(dau)} DAU
                </motion.div>
              </div>

              <div className="relative mb-4">
                <input type="range" min={0} max={STEPS} value={sliderVal} onChange={handleSlider}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #00D4FF ${(sliderVal / STEPS) * 100}%, rgba(255,255,255,0.1) ${(sliderVal / STEPS) * 100}%)` }}
                />
              </div>

              {/* CPM slider */}
              <div className="mb-5 pt-2 border-t border-white/8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-muted-foreground font-medium">CPM</span>
                  </div>
                  <motion.div key={cpmRub} initial={{ opacity: 0.5, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}
                    className="text-lg font-black text-secondary tabular-nums">
                    {cpmRub} ₽
                  </motion.div>
                </div>
                <input
                  type="range"
                  min={CPM_MIN}
                  max={CPM_MAX}
                  step={10}
                  value={cpmRub}
                  onChange={e => setCpmRub(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer mb-1"
                  style={{ background: `linear-gradient(to right, #7B5EFF ${((cpmRub - CPM_MIN) / (CPM_MAX - CPM_MIN)) * 100}%, rgba(255,255,255,0.1) ${((cpmRub - CPM_MIN) / (CPM_MAX - CPM_MIN)) * 100}%)` }}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                  <span>{CPM_MIN} ₽</span>
                  <span className="text-muted-foreground/40">Реальный рынок: 90–250 ₽</span>
                  <span>{CPM_MAX} ₽</span>
                </div>
              </div>

              <div className="flex justify-between gap-1 mb-6">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => setDau(p.dau)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      dau === p.dau
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {[
                  { label: "В день",  value: fmtM(dailyRub) + " ₽",  sub: "$" + fmt(dailyRub / RUB_TO_USD, 0),  color: "text-foreground" },
                  { label: "В месяц", value: fmtM(monthlyRub) + " ₽", sub: "$" + fmtM(monthlyRub / RUB_TO_USD), color: "text-primary"    },
                  { label: "В год",   value: fmtM(annualRub) + " ₽",  sub: "$" + fmtM(annualRub / RUB_TO_USD),  color: "text-secondary"  },
                ].map(({ label, value, sub, color }) => (
                  <motion.div key={label} className="rounded-xl bg-white/5 border border-white/8 p-3 md:p-4 text-center">
                    <div className="text-xs text-muted-foreground mb-1 font-medium">{label}</div>
                    <motion.div key={value} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                      className={`text-base md:text-xl lg:text-2xl font-black tabular-nums ${color}`}>
                      {value}
                    </motion.div>
                    <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">{sub}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/8">
                  (DAU × {REVSHARE_CONFIG.SHOWS_PER_DAY} показа × CPM {cpmRub} ₽) ÷ 1000 = выручка в день
                </span>
                <span className="text-green-400 font-semibold">RevShare инвесторов — {REVSHARE_CONFIG.REVENUE_SHARE * 100}% рекламной выручки</span>
              </div>
            </div>

            {/* RevShare пул — БЛОК 4 */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/3 backdrop-blur-sm p-5 md:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400">
                      Пул RevShare инвесторов — {REVSHARE_CONFIG.REVENUE_SHARE * 100}% рекламной выручки
                    </span>
                  </div>
                  <motion.div key={Math.round(revsharePoolMonthlyUsd)}
                    initial={{ opacity: 0.5, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                    className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-black tabular-nums">{fmtM(monthlyRub * REVSHARE_CONFIG.REVENUE_SHARE)} ₽</span>
                    <span className="text-xl md:text-2xl font-bold tabular-nums text-muted-foreground">/ ${fmt(revsharePoolMonthlyUsd, 0)}</span>
                    <span className="text-muted-foreground text-base font-normal">/ мес</span>
                  </motion.div>
                  <div className="mt-1.5 text-xs text-muted-foreground/70">
                    Распределяется между{" "}
                    <span className="text-foreground font-semibold">{REVSHARE_CONFIG.TOTAL_SHARES.toLocaleString()} долей</span>.
                    {" "}Стоимость одной доли в месяц:{" "}
                    <motion.span key={Math.round(shareValueMonthlyUsd * 100)} className="text-green-400 font-semibold tabular-nums">
                      ${fmt(shareValueMonthlyUsd, 2)}
                    </motion.span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground max-w-[260px]">
                  Ваша доля из этого пула зависит от пакета. Выплаты ежемесячно в USDT.
                </p>
              </div>



              <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/15 flex items-center justify-center shrink-0 mt-0.5 text-sm">🐹</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-yellow-400 font-bold">Пример роста:</span> Hamster Combat собрал{" "}
                  <span className="text-foreground font-semibold">200 млн пользователей</span> за несколько месяцев внутри Telegram.
                  Trends строит постоянную монетизируемую аудиторию —{" "}
                  <span className="text-foreground font-semibold">каждый DAU прямо увеличивает ваш RevShare.</span>
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground/50 text-center pt-1">
                ⚠️ Расчёты являются прогнозными и не гарантируются. RevShare зависит от фактической выручки платформы.
              </p>
            </div>
          </div>

          {/* ─── R1 / R2 переключатель — БЛОК 9 ─── */}
          {fullPackages && fullPackages.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                <p className="text-sm text-muted-foreground">
                  Выберите раунд — цифры RevShare в карточках пересчитаются:
                </p>
                <div className="flex rounded-xl border border-white/12 bg-white/4 p-1 gap-1 shrink-0">
                  <button
                    onClick={() => setRound("r1")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      round === "r1"
                        ? "bg-green-500/20 border border-green-500/40 text-green-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Round 1 (активен) +30% 🔥
                  </button>
                  <button
                    onClick={() => setRound("r2")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      round === "r2"
                        ? "bg-white/10 border border-white/20 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Round 2
                  </button>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mb-3">
                Нажмите на карточку — увидите всё, что входит в пакет
              </p>
            </div>
          )}

          {/* ─── Карточки пакетов ─── */}
          {fullPackages && fullPackages.length > 0 && (
            <div>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {fullPackages.map((pkg, idx) => {
                  const isLast    = idx === fullPackages.length - 1;
                  const isExpanded = expandedId === pkg.id;
                  const payR2     = calcPayoutR2(pkg.price, dau, cpmRub);
                  const payR1     = calcPayoutR1(pkg.price, dau, cpmRub);
                  const sharesR2  = calcSharesR2(pkg.price);
                  const sharesR1  = calcSharesR1(pkg.price);
                  const activeShares = round === "r1" ? sharesR1 : sharesR2;
                  const annualActive = (round === "r1" ? payR1 : payR2) * 12;
                  const roiPct    = pkg.price > 0 && annualActive > 0 ? (annualActive / pkg.price) * 100 : null;
                  const topItems  = getTopHighlights(pkg);
                  const totalItems = pkg.categories?.reduce((s, c) => s + c.items.length, 0) ?? 0;
                  void activeShares; void roiPct;

                  return (
                    <motion.div key={pkg.id}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5 }}
                      className={`relative flex flex-col rounded-3xl border transition-colors ${isLast ? "sm:col-span-2" : ""} ${
                        pkg.recommended ? `glass-pkg-active ${pkg.border} ${pkg.glow}` : `glass-card ${pkg.border}`
                      }`}
                    >
                      <div className="p-6 md:p-7 flex flex-col">

                        {pkg.recommended && (
                          <div className="flex justify-center mb-4 -mt-1">
                            <motion.div
                              animate={{ boxShadow: ["0 4px 20px rgba(0,212,255,0.35)", "0 4px 30px rgba(123,94,255,0.55)", "0 4px 20px rgba(0,212,255,0.35)"] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                              className="bg-gradient-to-r from-primary to-secondary text-background text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest"
                            >
                              ★ РЕКОМЕНДУЕМ ★
                            </motion.div>
                          </div>
                        )}

                        {/* Шапка */}
                        <div className="flex items-start gap-3 mb-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pkg.recommended ? "bg-primary/20" : "bg-white/5"}`}>
                            <pkg.icon className={`w-5 h-5 ${pkg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold leading-tight">{pkg.name}</h3>
                            <div className={`text-[11px] font-semibold ${pkg.color}`}>Badge «{pkg.badge}»</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={`text-2xl font-black ${pkg.recommended ? "text-primary" : ""}`}>
                              ${pkg.price.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground">единовременно</div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{pkg.tagline}</p>

                        {/* RevShare — новый блок БЛОК 3 */}
                        <div className="rounded-xl border border-white/10 bg-white/3 p-3.5 mb-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[10px] text-muted-foreground font-medium leading-tight">
                              RevShare /мес — реклама в ленте
                            </div>
                            <span className="text-[9px] text-muted-foreground/60 font-semibold shrink-0">
                              1 из {REVSHARE_CONFIG.REVENUE_SOURCES_TOTAL} источников
                            </span>
                          </div>

                          {/* Round 1 строка */}
                          <div className={`flex items-center justify-between transition-opacity ${round === "r1" ? "opacity-100" : "opacity-40"}`}>
                            <span className={`text-[11px] font-bold ${round === "r1" ? "text-green-400" : "text-muted-foreground"}`}>
                              Round 1 (сейчас, +30%) {round === "r1" && "🔥"}
                            </span>
                            <motion.span
                              key={"r1-" + Math.round(payR1)}
                              initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                              className={`text-lg font-black tabular-nums ${round === "r1" ? "text-green-400" : "text-muted-foreground"}`}
                            >
                              ${fmt(payR1, 2)}
                            </motion.span>
                          </div>

                          {/* Round 2 строка */}
                          <div className={`flex items-center justify-between transition-opacity ${round === "r2" ? "opacity-100" : "opacity-40"}`}>
                            <span className={`text-[11px] font-semibold ${round === "r2" ? "text-foreground" : "text-muted-foreground"}`}>
                              Round 2
                            </span>
                            <motion.span
                              key={"r2-" + Math.round(payR2)}
                              initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                              className={`text-base font-bold tabular-nums ${round === "r2" ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              ${fmt(payR2, 2)}
                            </motion.span>
                          </div>

                          {/* Shares info */}
                          <div className="text-[9px] text-muted-foreground/50 border-t border-white/6 pt-1.5 flex justify-between">
                            <span>{round === "r1" ? `${fmt(sharesR1, 3)} долей (R1)` : `${fmt(sharesR2, 3)} долей (R2)`}</span>
                            <span>{fmtDau(dau)} DAU</span>
                          </div>

                          {/* Подсказка */}
                          <div className="flex items-start gap-1.5 pt-1 border-t border-white/6">
                            <Info className="w-3 h-3 text-yellow-400/70 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                              <span className="text-yellow-400/80 font-semibold">Только реклама в ленте.</span>
                              {" "}+{REVSHARE_CONFIG.REVENUE_SOURCES_TOTAL - 1} источника не учтены.
                            </p>
                          </div>
                        </div>

                        {/* Exit */}
                        <div className="flex items-center justify-between text-xs px-1 mb-4">
                          <span className="text-muted-foreground">Exit потенциал: <span className="text-green-400 font-bold">${pkg.exit}</span> <span className="text-muted-foreground/60">(прибыль с продажи платформы Trends фонду или стратегическому инвестору)</span></span>
                        </div>

                        {/* Свёрнутые хайлайты */}
                        <AnimatePresence initial={false}>
                          {!isExpanded && (
                            <motion.ul
                              key="collapsed"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="space-y-1.5 mb-4"
                            >
                              {topItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-sm leading-none mt-0.5 shrink-0">
                                    {item.match(/^[\u{1F000}-\u{1FFFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}]/u)?.[0] ?? "•"}
                                  </span>
                                  <span className="text-xs text-muted-foreground leading-snug">
                                    {item.replace(/^[\u{1F000}-\u{1FFFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\s]+/u, "").trim()}
                                  </span>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>

                        {/* Развёрнутые категории */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="expanded"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-4 mb-4">
                                {pkg.categories?.map(cat => (
                                  <div key={cat.id}>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                        {cat.title}
                                      </span>
                                    </div>
                                    <ul className="space-y-2 pl-1">
                                      {cat.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <span className="text-sm leading-none mt-0.5 shrink-0">
                                            {item.match(/^[\u{1F000}-\u{1FFFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}]/u)?.[0] ?? "•"}
                                          </span>
                                          <span className="text-xs text-muted-foreground leading-relaxed">
                                            {item.replace(/^[\u{1F000}-\u{1FFFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\s]+/u, "").trim()}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Кнопка разворачивания */}
                        <button
                          onClick={() => setExpanded(isExpanded ? null : pkg.id)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all mb-3 border ${
                            isExpanded
                              ? `${pkg.border} ${pkg.color} bg-white/4`
                              : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground bg-white/3"
                          }`}
                        >
                          {isExpanded ? "Скрыть" : `Показать всё (${totalItems} пункт${totalItems >= 5 ? "ов" : totalItems >= 2 ? "а" : ""})`}
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.div>
                        </button>

                        {/* CTA */}
                        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}>
                          <Button
                            onClick={() => onSelectPackage ? onSelectPackage(pkg.id) : onInvest()}
                            className={`w-full h-11 text-sm font-bold rounded-xl btn-3d ${
                              pkg.recommended
                                ? "btn-grad"
                                : `bg-transparent border-2 ${pkg.border} ${pkg.color} hover:bg-white/5`
                            }`}
                          >
                            Инвестировать ${pkg.price.toLocaleString()}
                          </Button>
                        </motion.div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
