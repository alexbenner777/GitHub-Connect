import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, Coins, Users2, ArrowRight } from "lucide-react";

const PKG_LIST = [
  { id: "founder1", name: "Осн. 1", amount: 100, monthly: 0 },
  { id: "founder2", name: "Осн. 2", amount: 250, monthly: 5 },
  { id: "founder3", name: "Осн. 3", amount: 1000, monthly: 20, recommended: true },
  { id: "founder4", name: "Осн. 4", amount: 5000, monthly: 100 },
  { id: "founder5", name: "Осн. 5", amount: 25000, monthly: 500 },
  { id: "founder6", name: "Осн. 6", amount: 100000, monthly: 2000 },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function AnimNum({ value, prefix = "" }: { value: number; prefix?: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="inline-block tabular-nums"
      >
        {prefix}{fmt(value)}
      </motion.span>
    </AnimatePresence>
  );
}

export function RoiCalculator({ onInvest }: { onInvest: (pkg: string) => void }) {
  const [selectedIndex, setSelectedIndex] = useState(2);

  const pkg = PKG_LIST[selectedIndex];
  const monthly = pkg.monthly;
  const annual = monthly * 12;
  const exitLow = pkg.amount * 20;
  const exitHigh = pkg.amount * 30;
  const roi = ((annual / pkg.amount) * 100).toFixed(0);

  const results = [
    { icon: Wallet, label: "RevShare / месяц", value: monthly, color: "text-primary", border: "border-primary/30", glow: "shadow-[0_0_20px_rgba(0,212,255,0.12)]" },
    { icon: TrendingUp, label: "RevShare / год", value: annual, color: "text-secondary", border: "border-secondary/30", glow: "" },
    { icon: Coins, label: "Exit × 20 (min)", value: exitLow, color: "text-yellow-400", border: "border-yellow-500/20", glow: "" },
    { icon: Users2, label: "Exit × 30 (max)", value: exitHigh, color: "text-green-400", border: "border-green-500/20", glow: "shadow-[0_0_20px_rgba(74,222,128,0.10)]" },
  ];

  return (
    <div className="glass-strong p-8 md:p-10 rounded-3xl border border-primary/30 shadow-[0_0_60px_rgba(0,212,255,0.08)]">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black mb-2">Рассчитайте свой доход</h3>
        <p className="text-muted-foreground">Выберите пакет и увидите реальные цифры</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {PKG_LIST.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelectedIndex(i)}
            className={`relative p-4 rounded-2xl border-2 transition-all text-center group ${
              selectedIndex === i
                ? "border-primary bg-primary/15 shadow-[0_0_24px_rgba(0,212,255,0.25)]"
                : "border-border/50 bg-card/40 hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {p.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                Топ
              </div>
            )}
            <div className={`text-xs font-semibold mb-1 ${selectedIndex === i ? "text-primary/80" : "text-muted-foreground"}`}>{p.name}</div>
            <div className={`text-xl font-black ${selectedIndex === i ? "text-primary" : "text-foreground"}`}>
              {p.amount >= 1000 ? `$${p.amount / 1000}K` : `$${p.amount}`}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {results.map((item, i) => (
          <div key={i} className={`glass-card p-5 rounded-2xl text-center border ${item.border} ${item.glow}`}>
            <item.icon className={`w-5 h-5 mx-auto mb-3 ${item.color}`} />
            <div className={`text-xl md:text-2xl font-black ${item.color}`}>
              <AnimNum value={item.value} />
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Годовой RevShare ROI</div>
            <div className="text-2xl font-black text-primary">{roi}%</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center sm:text-right max-w-xs leading-relaxed">
          Расчёт ориентировочный — RevShare зависит от общей выручки платформы и размера Investor Pool
        </div>
      </div>

      <Button
        onClick={() => onInvest(pkg.id)}
        className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow rounded-xl"
      >
        Инвестировать {pkg.amount >= 1000 ? `$${pkg.amount / 1000}K` : `$${pkg.amount}`} — пакет {pkg.name}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}
