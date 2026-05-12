import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, ChevronRight } from "lucide-react";

const CPM_RUB = 225;
const SHOWS_PER_DAY = 2;
const REVSHARE_PCT = 0.20;
const RUB_TO_USD = 91;
const TOTAL_SHARES = 326.6;

const PACKAGES = [
  { name: "Основателей 2", price: 250,   shares: 0.26,  color: "text-secondary",    bg: "bg-secondary/10 border-secondary/20" },
  { name: "Основателей 3", price: 1000,  shares: 1.3,   color: "text-primary",      bg: "bg-primary/10 border-primary/20",    recommended: true },
  { name: "Основателей 4", price: 5000,  shares: 10.04, color: "text-yellow-400",   bg: "bg-yellow-500/10 border-yellow-500/20" },
  { name: "Основателей 5", price: 25000, shares: 65,    color: "text-orange-400",   bg: "bg-orange-500/10 border-orange-500/20" },
];

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: decimals });
}
function fmtM(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + " млрд";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + " млн";
  return fmt(n);
}

const DAU_MIN = 1_000_000;
const DAU_MAX = 50_000_000;
const STEPS = 100;

function dauFromSlider(v: number) {
  return Math.round(DAU_MIN + (v / STEPS) * (DAU_MAX - DAU_MIN));
}
function sliderFromDau(dau: number) {
  return Math.round(((dau - DAU_MIN) / (DAU_MAX - DAU_MIN)) * STEPS);
}

const PRESETS = [
  { label: "1M", dau: 1_000_000 },
  { label: "2.5M", dau: 2_500_000 },
  { label: "10M", dau: 10_000_000 },
  { label: "25M", dau: 25_000_000 },
  { label: "50M", dau: 50_000_000 },
];

export function DauCalculator({ onInvest }: { onInvest: () => void }) {
  const [sliderVal, setSliderVal] = useState(sliderFromDau(2_500_000));

  const dau = dauFromSlider(sliderVal);
  const dailyRub = dau * SHOWS_PER_DAY * CPM_RUB / 1000;
  const monthlyRub = dailyRub * 30;
  const annualRub = dailyRub * 365;
  const revsharePoolMonthlyUsd = (monthlyRub / RUB_TO_USD) * REVSHARE_PCT;

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderVal(Number(e.target.value));
  }, []);

  return (
    <section className="py-14 md:py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-5">
              <TrendingUp className="w-4 h-4" />
              Экономика рекламы
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
              Рост DAU = прямой рост <span className="text-gradient">выручки</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              2 рекламных показа в день на пользователя при CPM $2.5 (≈ 225 ₽). Двигайте ползунок и смотрите, как растёт ваш RevShare.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 md:p-8 mb-6">
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
                {dau >= 1_000_000 ? (dau / 1_000_000).toFixed(dau % 1_000_000 === 0 ? 0 : 1) + "M" : fmt(dau)} DAU
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
                { label: "В день", value: fmtM(dailyRub) + " ₽", sub: "$" + fmt(dailyRub / RUB_TO_USD, 0), color: "text-foreground" },
                { label: "В месяц", value: fmtM(monthlyRub) + " ₽", sub: "$" + fmtM(monthlyRub / RUB_TO_USD), color: "text-primary" },
                { label: "В год", value: fmtM(annualRub) + " ₽", sub: "$" + fmtM(annualRub / RUB_TO_USD), color: "text-secondary" },
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
              {PACKAGES.map((pkg) => {
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
      </div>
    </section>
  );
}
