import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, DollarSign, ChevronRight, CheckCircle2,
  Zap, Star, Shield, Crown, Network
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CPM_RUB = 225;
const SHOWS_PER_DAY = 2;
const REVSHARE_PCT = 0.20;
const RUB_TO_USD = 91;
const TOTAL_SHARES = 326.6;

const REVSHARE_PACKAGES = [
  { name: "Основателей 2", price: 250,   shares: 0.26,  color: "text-secondary",    bg: "bg-secondary/10 border-secondary/20" },
  { name: "Основателей 3", price: 1000,  shares: 1.3,   color: "text-primary",      bg: "bg-primary/10 border-primary/20",    recommended: true },
  { name: "Основателей 4", price: 5000,  shares: 10.04, color: "text-yellow-400",   bg: "bg-yellow-500/10 border-yellow-500/20" },
  { name: "Основателей 5", price: 25000, shares: 65,    color: "text-orange-400",   bg: "bg-orange-500/10 border-orange-500/20" },
];

export type FullPackage = {
  id: string;
  name: string;
  price: number;
  monthly: number;
  exit: string;
  tokens: string;
  shares: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
  glow: string;
  features: string[];
  recommended?: boolean;
};

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: decimals });
}
function fmtM(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " млрд";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + " млн";
  return fmt(n);
}

const DAU_MIN = 500_000;
const DAU_MAX = 25_000_000;
const STEPS = 100;

function dauFromSlider(v: number) {
  return Math.round(DAU_MIN + (v / STEPS) * (DAU_MAX - DAU_MIN));
}
function sliderFromDau(dau: number) {
  return Math.round(((dau - DAU_MIN) / (DAU_MAX - DAU_MIN)) * STEPS);
}

const PRESETS = [
  { label: "500K", dau: 500_000 },
  { label: "1M",   dau: 1_000_000 },
  { label: "5M",   dau: 5_000_000 },
  { label: "10M",  dau: 10_000_000 },
  { label: "25M",  dau: 25_000_000 },
];

export function DauCalculator({
  onInvest,
  onSelectPackage,
  fullPackages,
}: {
  onInvest: () => void;
  onSelectPackage?: (id: string) => void;
  fullPackages?: FullPackage[];
}) {
  const [sliderVal, setSliderVal] = useState(sliderFromDau(1_000_000));

  const dau = dauFromSlider(sliderVal);
  const dailyRub = dau * SHOWS_PER_DAY * CPM_RUB / 1000;
  const monthlyRub = dailyRub * 30;
  const annualRub = dailyRub * 365;
  const revsharePoolMonthlyUsd = (monthlyRub / RUB_TO_USD) * REVSHARE_PCT;

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderVal(Number(e.target.value));
  }, []);

  return (
    <section className="py-14 md:py-24 relative z-10" id="packages">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              Инвестиционные пакеты
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Выберите свой уровень участия. Двигайте ползунок — смотрите, как растёт ваш RevShare при масштабировании платформы.
            </p>
          </div>

          {/* ── Calculator ── */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                Рост DAU = прямой рост выручки
              </div>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-3">
                2 рекламных показа в день на пользователя при CPM $2.5 (≈ 225 ₽). Двигайте ползунок и смотрите, как растёт ваш RevShare.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8 mb-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">Ежедневная аудитория (DAU)</span>
                </div>
                <motion.div
                  key={dau}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl md:text-3xl font-black text-primary tabular-nums"
                >
                  {dau >= 1_000_000
                    ? (dau / 1_000_000).toFixed(dau % 1_000_000 === 0 ? 0 : 1) + "M"
                    : fmt(dau / 1000, 0) + "K"} DAU
                </motion.div>
              </div>

              <div className="relative mb-4">
                <input
                  type="range"
                  min={0}
                  max={STEPS}
                  value={sliderVal}
                  onChange={handleSlider}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00D4FF ${(sliderVal / STEPS) * 100}%, rgba(255,255,255,0.1) ${(sliderVal / STEPS) * 100}%)`,
                  }}
                />
              </div>

              <div className="flex justify-between gap-1 mb-6">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSliderVal(sliderFromDau(p.dau))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      Math.abs(dau - p.dau) < (DAU_MAX - DAU_MIN) / STEPS / 2
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
                  { label: "В день",   value: fmtM(dailyRub) + " ₽",   sub: "$" + fmt(dailyRub / RUB_TO_USD, 0),   color: "text-foreground" },
                  { label: "В месяц",  value: fmtM(monthlyRub) + " ₽",  sub: "$" + fmtM(monthlyRub / RUB_TO_USD),  color: "text-primary" },
                  { label: "В год",    value: fmtM(annualRub) + " ₽",   sub: "$" + fmtM(annualRub / RUB_TO_USD),   color: "text-secondary" },
                ].map(({ label, value, sub, color }) => (
                  <motion.div
                    key={label}
                    className="rounded-xl bg-white/5 border border-white/8 p-3 md:p-4 text-center"
                    initial={false}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1 font-medium">{label}</div>
                    <motion.div
                      key={value}
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`text-base md:text-xl lg:text-2xl font-black tabular-nums ${color}`}
                    >
                      {value}
                    </motion.div>
                    <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">{sub}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/8">
                  (DAU × 2 показа × CPM 225 ₽) ÷ 1000 = выручка в день
                </span>
                <span className="text-green-400 font-semibold">+токен $TRND снижает CAC</span>
              </div>
            </div>

            {/* RevShare per package */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400">RevShare пул инвесторов (20% выручки)</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-black tabular-nums">
                    ${fmt(revsharePoolMonthlyUsd, 0)}
                    <span className="text-muted-foreground text-base font-normal ml-1">/ мес</span>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground max-w-[200px]">
                  Ваша доля зависит от выбранного пакета. Выплаты — ежемесячно в USDT.
                </div>
              </div>

              <div className="space-y-3">
                {REVSHARE_PACKAGES.map((pkg) => {
                  const monthlyUsd = (pkg.shares / TOTAL_SHARES) * revsharePoolMonthlyUsd;
                  const annualUsd = monthlyUsd * 12;
                  const roiPct = (annualUsd / pkg.price) * 100;
                  return (
                    <motion.div
                      key={pkg.name}
                      className={`rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3 ${pkg.bg} ${pkg.recommended ? "ring-1 ring-primary/40" : ""}`}
                      initial={false}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div>
                          <div className={`text-sm font-bold ${pkg.color} flex items-center gap-1.5`}>
                            {pkg.name}
                            {pkg.recommended && (
                              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">${fmt(pkg.price)} вход · {pkg.shares} долей</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-right">
                          <motion.div
                            key={Math.round(monthlyUsd)}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`text-lg md:text-xl font-black tabular-nums ${pkg.color}`}
                          >
                            ~${fmt(monthlyUsd, 0)}<span className="text-xs font-normal text-muted-foreground">/мес</span>
                          </motion.div>
                          <div className="text-xs text-muted-foreground tabular-nums">~${fmt(annualUsd, 0)}/год · ROI {roiPct.toFixed(0)}%</div>
                        </div>
                        <button
                          onClick={onInvest}
                          className={`hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${pkg.recommended ? "bg-primary/20 border-primary/30 text-primary hover:bg-primary/30" : "bg-white/5 border-white/15 text-muted-foreground hover:text-foreground hover:border-white/25"}`}
                        >
                          Выбрать <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                * Расчёт ориентировочный при текущих CPM. Доля в пуле зависит от суммарного количества проданных долей. Для сравнения: Hamster Combat набрал 200M пользователей внутри Telegram Mini App — Trends строит монетизированную платформу на той же инфраструктуре.
              </p>
            </div>
          </div>

          {/* ── Full Investment Package Cards ── */}
          {fullPackages && fullPackages.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <p className="text-muted-foreground text-base">Все пакеты включают RevShare, токены $TRND и партнёрскую программу.</p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {fullPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: pkg.recommended ? -6 : -4, transition: { duration: 0.25 } }}
                    className={`relative flex flex-col rounded-3xl border transition-colors ${
                      pkg.recommended
                        ? `glass-pkg-active xl:-translate-y-4 ${pkg.border} ${pkg.glow}`
                        : `glass-card ${pkg.border}`
                    }`}
                  >
                    <div className="p-7 flex flex-col flex-1">
                      {pkg.recommended && (
                        <div className="flex justify-center mb-5 -mt-1">
                          <motion.div
                            animate={{ boxShadow: ["0 4px 20px rgba(0,212,255,0.35)", "0 4px 30px rgba(123,94,255,0.55)", "0 4px 20px rgba(0,212,255,0.35)"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="bg-gradient-to-r from-primary to-secondary text-background text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap"
                          >
                            ★ РЕКОМЕНДУЕМ ★
                          </motion.div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pkg.recommended ? 'bg-primary/20' : 'bg-white/5'}`}>
                          <pkg.icon className={`w-5 h-5 ${pkg.color}`} />
                        </div>
                        <h3 className="text-xl font-bold">{pkg.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-5">{pkg.tagline}</p>

                      <div className="mb-6">
                        <div className={`text-4xl font-black ${pkg.recommended ? 'text-primary' : 'text-foreground'}`}>
                          ${pkg.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">единовременная инвестиция</div>
                      </div>

                      <ul className="space-y-3 flex-1 mb-7">
                        {pkg.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2.5">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.color}`} />
                            <span className="text-sm text-muted-foreground leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-white/3 border border-white/8">
                        <div className="text-center">
                          <div className={`text-sm font-black ${pkg.color}`}>~${pkg.monthly.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">RevShare/мес</div>
                        </div>
                        <div className="text-center border-l border-white/8">
                          <div className="text-sm font-black text-green-400">{pkg.exit}</div>
                          <div className="text-[10px] text-muted-foreground">Exit потенциал</div>
                        </div>
                      </div>

                      <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
                        <Button
                          onClick={() => (onSelectPackage ? onSelectPackage(pkg.id) : onInvest())}
                          className={`w-full h-12 text-base font-bold rounded-xl btn-3d ${
                            pkg.recommended
                              ? 'btn-grad'
                              : `bg-transparent border-2 ${pkg.border} ${pkg.color} hover:bg-white/5`
                          }`}
                        >
                          Инвестировать
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
