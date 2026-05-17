import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, DollarSign, Zap,
  Star, Shield, Crown, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvestPackage } from "@/lib/packages";
import { PACKAGE_UI, CATEGORY_ICON } from "@/lib/packages";

export type FullPackage = InvestPackage & {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
  glow: string;
};

const CPM_RUB       = 190;
const SHOWS_PER_DAY = 2;
const REVSHARE_PCT  = 0.20;
const RUB_TO_USD    = 91;
const TOTAL_SHARES  = 5000;

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

// ─── Первые 3 хайлайта для свёрнутого вида ──────────────────────
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
  const [expandedId, setExpanded] = useState<string | null>(null);

  const dailyRub               = dau * SHOWS_PER_DAY * CPM_RUB / 1000;
  const monthlyRub             = dailyRub * 30;
  const annualRub              = dailyRub * 365;
  const revsharePoolMonthlyUsd = (monthlyRub / RUB_TO_USD) * REVSHARE_PCT;
  const sliderVal              = Math.round(sliderPosFromDau(dau));

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDau(dauFromSlider(Number(e.target.value)));
  }, []);

  function calcRevShare(shares: number) {
    if (!shares) return null;
    const monthlyUsd = (shares / TOTAL_SHARES) * revsharePoolMonthlyUsd;
    return { monthlyUsd, annualUsd: monthlyUsd * 12 };
  }

  return (
    <section className="py-14 md:py-24 relative z-10" id="packages">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">

          {/* Заголовок */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">Инвестиционные пакеты</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Беспрецедентные условия для тех, кто заходит на стадии Pre-Seed. Инвестор зарабатывает вместе с платформой каждый месяц.
            </p>
          </div>

          {/* Калькулятор DAU */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                Рост DAU = прямой рост выручки
              </div>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-3">
                2 рекламных показа в день на пользователя при CPM ≈ 190 ₽. Двигайте ползунок — суммы в карточках обновляются.
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
                  (DAU × 2 показа × CPM 190 ₽) ÷ 1000 = выручка в день
                </span>
                <span className="text-green-400 font-semibold">RevShare инвесторов — 20% выручки</span>
              </div>
            </div>

            {/* RevShare пул */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/3 backdrop-blur-sm p-5 md:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400">Пул RevShare инвесторов — 20% выручки</span>
                  </div>
                  <motion.div key={Math.round(revsharePoolMonthlyUsd)}
                    initial={{ opacity: 0.5, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                    className="flex flex-wrap items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-black tabular-nums">{fmtM(monthlyRub * REVSHARE_PCT)} ₽</span>
                    <span className="text-xl md:text-2xl font-bold tabular-nums text-muted-foreground">/ ${fmt(revsharePoolMonthlyUsd, 0)}</span>
                    <span className="text-muted-foreground text-base font-normal">/ мес</span>
                  </motion.div>
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
            </div>
          </div>

          {/* ─── Карточки пакетов ─── */}
          {fullPackages && fullPackages.length > 0 && (
            <div>
              <p className="text-center text-xs text-muted-foreground mb-8">
                Нажмите на карточку — увидите всё, что входит в пакет
              </p>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {fullPackages.map((pkg, idx) => {
                  const isLast    = idx === fullPackages.length - 1;
                  const isExpanded = expandedId === pkg.id;
                  const rev       = calcRevShare(pkg.shares);
                  const monthly   = rev?.monthlyUsd ?? 0;
                  const annual    = rev?.annualUsd  ?? 0;
                  const roiPct    = pkg.price > 0 && annual > 0 ? (annual / pkg.price) * 100 : null;
                  const topItems  = getTopHighlights(pkg);
                  const totalItems = pkg.categories?.reduce((s, c) => s + c.items.length, 0) ?? 0;

                  return (
                    <motion.div key={pkg.id}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5 }}
                      className={`relative flex flex-col rounded-3xl border transition-colors ${isLast ? "sm:col-span-2" : ""} ${
                        pkg.recommended ? `glass-pkg-active ${pkg.border} ${pkg.glow}` : `glass-card ${pkg.border}`
                      }`}
                    >
                      <div className="p-6 md:p-7 flex flex-col">

                        {/* Метка рекомендовано */}
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

                        {/* RevShare динамика + DAU 50M */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                            <div className="text-[10px] text-muted-foreground mb-0.5 leading-tight">
                              RevShare сейчас (калькулятор)
                            </div>
                            <div className={`text-[9px] font-semibold mb-0.5 tabular-nums ${pkg.color}`}>
                              {fmtDau(dau)} DAU
                            </div>
                            {rev ? (
                              <motion.div key={Math.round(monthly)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                                className={`text-lg font-black tabular-nums ${pkg.color}`}>
                                ~${fmt(monthly, 0)}
                                <span className="text-xs font-normal text-muted-foreground">/мес</span>
                              </motion.div>
                            ) : (
                              <div className="text-lg font-black text-muted-foreground">–</div>
                            )}
                          </div>
                          <div className="rounded-xl border border-green-500/20 bg-green-500/6 p-3">
                            <div className="text-[10px] text-green-400/75 font-medium mb-0.5 leading-tight">RevShare при</div>
                            <div className="text-lg font-black tabular-nums text-green-400">
                              ${pkg.dau50m.toLocaleString("ru-RU")}
                              <span className="text-xs font-normal text-green-400/70">/мес</span>
                            </div>
                          </div>
                        </div>

                        {/* Exit */}
                        <div className="flex items-center justify-between text-xs px-1 mb-4">
                          <span className="text-muted-foreground">Exit потенциал: <span className="text-green-400 font-bold">${pkg.exit}</span> <span className="text-muted-foreground/60">(прибыль с продажи платформы Trends)</span></span>
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
                                    {item.match(/^[\u{1F300}-\u{1FFFF}]/u)?.[0] ?? "•"}
                                  </span>
                                  <span className="text-xs text-muted-foreground leading-snug">
                                    {item.replace(/^[\u{1F300}-\u{1FFFF}\s]+/u, "").trim()}
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
                                      <span className="text-base">{CATEGORY_ICON[cat.id] ?? "•"}</span>
                                      <span className={`text-[10px] font-black uppercase tracking-widest ${pkg.color}`}>
                                        {cat.title}
                                      </span>
                                    </div>
                                    <ul className="space-y-2 pl-1">
                                      {cat.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <span className="text-sm leading-none mt-0.5 shrink-0">
                                            {item.match(/^[\u{1F300}-\u{1FFFF}]/u)?.[0] ?? "✓"}
                                          </span>
                                          <span className="text-xs text-muted-foreground leading-relaxed">
                                            {item.replace(/^[\u{1F300}-\u{1FFFF}\s]+/u, "").trim()}
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
