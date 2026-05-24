import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useSearch } from "wouter";
import { SceneBackground } from "@/components/SceneBackground";
import {
  Copy, Wallet, ArrowLeft, LogOut, CheckCircle2, Clock, XCircle,
  RefreshCw, Settings, TrendingUp, Users, DollarSign, BarChart3,
  Network, Star, ChevronRight, Shield, Globe, PlayCircle, Megaphone,
  Banknote, Eye, Video, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { InvestmentModal, MONTHLY_PROFIT } from "@/components/InvestmentModal";
import { useAuth } from "@/hooks/useAuth";
import { api, type CabinetData, type PlatformMetrics } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return (
    <span className="inline-flex items-center gap-1 bg-green-500/15 text-green-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-500/20">
      <CheckCircle2 className="w-3 h-3" />Подтверждено
    </span>
  );
  if (status === "pending") return (
    <span className="inline-flex items-center gap-1 bg-yellow-500/15 text-yellow-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-yellow-500/20">
      <Clock className="w-3 h-3" />Ожидает
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-red-500/20">
      <XCircle className="w-3 h-3" />{status}
    </span>
  );
}

const LEVEL_COLORS = [
  { text: "text-primary", bar: "bg-primary", badge: "bg-primary/20 border-primary/30 text-primary" },
  { text: "text-secondary", bar: "bg-secondary", badge: "bg-secondary/20 border-secondary/30 text-secondary" },
  { text: "text-blue-400", bar: "bg-blue-400", badge: "bg-blue-400/20 border-blue-400/30 text-blue-400" },
  { text: "text-cyan-400", bar: "bg-cyan-400", badge: "bg-cyan-400/20 border-cyan-400/30 text-cyan-400" },
  { text: "text-teal-400", bar: "bg-teal-400", badge: "bg-teal-400/20 border-teal-400/30 text-teal-400" },
];
const LEVEL_PCTS = [10, 5, 3, 1, 1];

export default function Cabinet() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [isInvestOpen, setIsInvestOpen] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(search).get("invest") === "true") {
      setIsInvestOpen(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [search]);
  const [data, setData] = useState<CabinetData | null>(null);
  const [referrals, setReferrals] = useState<Record<number, { count: number; earned: number }>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [walletAddr, setWalletAddr] = useState("");
  const [walletNet, setWalletNet] = useState("TON");
  const [savingWallet, setSavingWallet] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "investments" | "mlm" | "settings" | "platform">("overview");
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [authLoading, user]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [d, r] = await Promise.all([api.me(), api.referrals()]);
      setData(d);
      setReferrals(r.levels);
      setWalletAddr(d.user.walletAddress ?? "");
      setWalletNet(d.user.walletNetwork ?? "USDT TRC-20");
    } catch {
      toast({ title: "Ошибка загрузки данных", variant: "destructive" });
    } finally {
      setLoadingData(false);
    }
    // Метрики платформы — некритичный запрос, не блокирует загрузку кабинета
    api.platformMetrics().then(pm => setPlatformMetrics(pm.metrics)).catch(() => {});
  };

  useEffect(() => { loadData(); }, [user]);

  const copyRef = () => {
    if (!data) return;
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${data.user.referralCode}`);
    toast({ title: "Реферальная ссылка скопирована!" });
  };

  const saveWallet = async () => {
    if (!walletAddr) return;
    setSavingWallet(true);
    try {
      await api.updateWallet({ walletAddress: walletAddr, walletNetwork: walletNet });
      toast({ title: "Кошелёк сохранён!" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setSavingWallet(false);
    }
  };

  const handleLogout = () => { logout().then(() => setLocation("/")); };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Загрузка кабинета...</p>
        </div>
      </div>
    );
  }

  if (!user || !data) return null;

  const totalMLM = Object.values(referrals).reduce((s, l) => s + l.earned, 0);
  const totalMLMRefs = Object.values(referrals).reduce((s, l) => s + l.count, 0);
  const confirmedInvs = data.investments.filter(i => i.status === "confirmed");
  const pendingInvs = data.investments.filter(i => i.status === "pending");

  const REVSHARE_DAU = 5_000_000;
  const CPM_RUB = 190, SHOWS = 2, REVSHARE_PCT = 0.20, RUB_USD = 91, TOTAL_SHARES = 5000;
  const revshareAt5M = data.stats.totalShares > 0
    ? Math.round((data.stats.totalShares / TOTAL_SHARES) * (REVSHARE_DAU * SHOWS * CPM_RUB / 1000 * 30 / RUB_USD) * REVSHARE_PCT)
    : 0;

  const tabs = [
    { id: "overview", label: "Обзор", icon: BarChart3 },
    { id: "investments", label: "Инвестиции", icon: TrendingUp },
    { id: "mlm", label: "Партнёры", icon: Network },
    { id: "platform", label: "Платформа", icon: Globe },
    { id: "settings", label: "Настройки", icon: Settings },
  ] as const;

  const statCards = [
    { label: "Инвестировано", value: `$${data.stats.totalInvested.toLocaleString()}`, sub: null, icon: DollarSign, color: "text-primary", bg: "from-primary/20 to-primary/5", border: "border-primary/20" },
    { label: "RevShare / мес", value: `$${revshareAt5M.toLocaleString()}`, sub: "при 5M DAU", icon: TrendingUp, color: "text-green-400", bg: "from-green-500/20 to-green-500/5", border: "border-green-500/20" },
    { label: "MLM бонусы", value: `$${totalMLM.toFixed(0)}`, sub: null, icon: Star, color: "text-secondary", bg: "from-secondary/20 to-secondary/5", border: "border-secondary/20" },
    { label: "Партнёров", value: String(totalMLMRefs), sub: null, icon: Users, color: "text-yellow-400", bg: "from-yellow-500/20 to-yellow-500/5", border: "border-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SceneBackground />
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            <span className="font-black text-xl text-gradient">Trends</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ═══════════════ LEFT SIDEBAR ═══════════════ */}
          <aside className="lg:w-72 shrink-0 space-y-4">

            {/* Profile card */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-white mb-4 shadow-lg">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="font-black text-lg leading-tight">{user.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{user.email}</div>
                <div className="flex items-center gap-1.5 mt-3">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">Верифицирован</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/8 text-xs text-muted-foreground">
                  С нами с {new Date(data.user.createdAt).toLocaleDateString("ru", { month: "long", year: "numeric" })}
                </div>
              </div>
            </div>

            {/* Ref link */}
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Реферальная ссылка</div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/8 mb-2">
                <div className="text-xs font-mono text-muted-foreground truncate">
                  {window.location.origin}/reg?ref=<span className="text-primary font-bold">{data.user.referralCode}</span>
                </div>
              </div>
              <button onClick={copyRef}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors border border-primary/20">
                <Copy className="w-3.5 h-3.5" /> Скопировать ссылку
              </button>
            </div>

            {/* Nav tabs */}
            <div className="glass-card rounded-2xl p-2 border border-white/10">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                    activeTab === t.id
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}>
                  <t.icon className="w-4 h-4 shrink-0" />
                  {t.label}
                  {activeTab === t.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>

            {/* Invest button */}
            <button onClick={() => setIsInvestOpen(true)}
              className="w-full btn-grad btn-3d h-12 rounded-xl font-bold text-sm">
              + Новая инвестиция
            </button>

            {/* Admin link */}
            {user.isAdmin && (
              <Link href="/admin"
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
          </aside>

          {/* ═══════════════ RIGHT MAIN CONTENT ═══════════════ */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* Stat cards row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {statCards.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`glass-card rounded-2xl p-5 border ${s.border} bg-gradient-to-br ${s.bg} relative overflow-hidden`}>
                  <div className="absolute top-3 right-3 opacity-20">
                    <s.icon className="w-8 h-8" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  {s.sub && <div className="text-[10px] text-muted-foreground/70 mt-1 font-medium">{s.sub}</div>}
                </motion.div>
              ))}
            </div>

            {/* Pending notice */}
            {pendingInvs.length > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-yellow-500/8 border border-yellow-500/25">
                <Clock className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-yellow-400 text-sm">Ожидается подтверждение ({pendingInvs.length})</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Заявка получена. Администратор подтвердит после проверки оплаты.</p>
                </div>
              </div>
            )}

            {/* ─── OVERVIEW ─── */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Portfolio infographic */}
                {confirmedInvs.length > 0 && (
                  <div className="glass-card rounded-2xl p-6 border border-white/10">
                    <div className="text-sm font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Портфель инвестиций
                    </div>
                    <div className="space-y-3">
                      {confirmedInvs.map((inv, i) => {
                        const amt = parseFloat(inv.amount);
                        const pct = data.stats.totalInvested > 0 ? (amt / data.stats.totalInvested) * 100 : 100;
                        const colors = ["bg-primary", "bg-secondary", "bg-blue-400", "bg-teal-400"];
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{inv.packageName}</span>
                              <span className="font-bold">${amt.toLocaleString()} · {pct.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`h-full rounded-full ${colors[i % colors.length]}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/8 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Итого подтверждено</span>
                      <span className="text-primary font-black">${confirmedInvs.reduce((s, i) => s + parseFloat(i.amount), 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* DAU Profitability Infographic */}
                {data.stats.totalShares > 0 && (() => {
                  const CPM_RUB = 190, SHOWS = 2, REVSHARE = 0.20, RUB_USD = 91, TOTAL_SHARES = 5000;
                  const milestones = [
                    { label: "500K", dau: 500_000 },
                    { label: "1M",   dau: 1_000_000 },
                    { label: "5M",   dau: 5_000_000 },
                    { label: "10M",  dau: 10_000_000 },
                    { label: "25M",  dau: 25_000_000 },
                    { label: "50M",  dau: 50_000_000 },
                  ];
                  const earnings = milestones.map(m => {
                    const pool = (m.dau * SHOWS * CPM_RUB / 1000 * 30 / RUB_USD) * REVSHARE;
                    return Math.round((data.stats.totalShares / TOTAL_SHARES) * pool);
                  });
                  const maxEarning = Math.max(...earnings);
                  const barColors = ["bg-primary/40", "bg-primary/55", "bg-secondary/60", "bg-secondary/75", "bg-green-400/70", "bg-green-400"];
                  const textColors = ["text-primary/70", "text-primary/85", "text-secondary/80", "text-secondary", "text-green-400/85", "text-green-400"];
                  return (
                    <div className="glass-card rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-green-500/5 to-transparent">
                      <div className="text-sm font-bold mb-1 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" /> Ваш RevShare при разных DAU
                      </div>
                      <div className="text-xs text-muted-foreground mb-5">
                        {data.stats.totalShares.toFixed(2)} долей · формула идентична калькулятору
                      </div>
                      {/* Bar chart */}
                      <div className="flex items-end gap-2 h-32 mb-3">
                        {earnings.map((earn, i) => {
                          const pct = maxEarning > 0 ? (earn / maxEarning) * 100 : 0;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div className={`text-[10px] font-bold ${textColors[i]}`}>
                                ${earn >= 1000 ? (earn / 1000).toFixed(1) + "K" : earn}
                              </div>
                              <div className="w-full flex items-end" style={{ height: "96px" }}>
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: `${pct}%` }}
                                  transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                                  className={`w-full rounded-t-lg ${barColors[i]}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* X-axis labels */}
                      <div className="flex gap-2">
                        {milestones.map((m, i) => (
                          <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground font-medium">
                            {m.label}
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground text-center mt-1">DAU (ежедневная аудитория)</div>
                      {/* Highlight max */}
                      <div className="mt-4 pt-4 border-t border-white/8 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">При 50M DAU (пик) / в месяц</span>
                        <span className="text-green-400 font-black text-lg">${earnings[5].toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Transactions */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> История операций</span>
                    <button onClick={loadData} className="text-muted-foreground hover:text-primary transition-colors p-1">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {data.transactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 text-sm">Операций пока нет</p>
                  ) : (
                    <div className="space-y-2">
                      {data.transactions.slice(0, 10).map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6 hover:bg-white/5 transition-colors">
                          <div>
                            <div className="font-medium text-sm">{tx.description}</div>
                            <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("ru")}</div>
                          </div>
                          <div className="text-green-400 font-black text-sm">+${parseFloat(tx.amount).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── INVESTMENTS (RIGHT SIDE) ─── */}
            {activeTab === "investments" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Ваши вклады</span>
                  <button onClick={() => setIsInvestOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
                    + Добавить вклад
                  </button>
                </div>

                {data.investments.length === 0 ? (
                  <div className="glass-card p-12 rounded-2xl text-center border border-white/10">
                    <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">У вас пока нет инвестиций</p>
                    <Button onClick={() => setIsInvestOpen(true)} className="btn-grad font-bold rounded-xl">Инвестировать сейчас</Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {data.investments.map((inv, i) => {
                      const gradients = [
                        "from-primary/20 via-primary/5 to-transparent border-primary/25",
                        "from-secondary/20 via-secondary/5 to-transparent border-secondary/25",
                        "from-blue-400/20 via-blue-400/5 to-transparent border-blue-400/25",
                        "from-teal-400/20 via-teal-400/5 to-transparent border-teal-400/25",
                      ];
                      const textColors = ["text-primary", "text-secondary", "text-blue-400", "text-teal-400"];
                      return (
                        <motion.div key={inv.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`glass-card rounded-2xl border bg-gradient-to-r ${gradients[i % gradients.length]} overflow-hidden`}>
                          <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              {/* Left: package info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center`}>
                                    <Star className={`w-4 h-4 ${textColors[i % textColors.length]}`} />
                                  </div>
                                  <span className="font-black text-base">{inv.packageName}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Дата: {new Date(inv.createdAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                                </div>
                                {inv.txHash && (
                                  <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">TX: {inv.txHash}</div>
                                )}
                              </div>

                              {/* Right: amount + status + shares */}
                              <div className="flex flex-col items-start sm:items-end gap-2">
                                <div className={`text-2xl font-black ${textColors[i % textColors.length]}`}>
                                  ${parseFloat(inv.amount).toLocaleString()}
                                </div>
                                <StatusBadge status={inv.status} />
                                {inv.status === "confirmed" && (
                                  <div className="text-xs text-muted-foreground space-y-0.5">
                                    <div>Доля в пуле: <span className="text-secondary font-bold">{parseFloat(inv.shares).toFixed(2)}</span></div>
                                    <div>Прибыль / мес: <span className="text-green-400 font-bold">${(MONTHLY_PROFIT[inv.packageId] ?? 0).toLocaleString()}</span></div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Progress bar accent */}
                            {inv.status === "confirmed" && (
                              <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                  className={`h-full rounded-full ${["bg-primary", "bg-secondary", "bg-blue-400", "bg-teal-400"][i % 4]}`} />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Summary block */}
                {data.investments.length > 0 && (
                  <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-r from-green-500/10 to-transparent">
                    <div className="flex flex-wrap gap-6 justify-between items-center">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Всего вложено</div>
                        <div className="text-3xl font-black text-primary">${data.stats.totalInvested.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Доля в RevShare пуле</div>
                        <div className="text-3xl font-black text-secondary">{data.stats.totalShares.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Подтверждено</div>
                        <div className="text-3xl font-black text-green-400">{confirmedInvs.length}</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── PARTNERS / MLM ─── */}
            {activeTab === "mlm" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Ref link */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Network className="w-4 h-4 text-primary" /> Реферальная ссылка
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 mb-3">
                    <span className="text-sm font-mono text-muted-foreground flex-1 truncate">
                      {window.location.origin}/register?ref=<span className="text-primary font-bold">{data.user.referralCode}</span>
                    </span>
                    <button onClick={copyRef} className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ваш код: <span className="text-primary font-mono font-bold">{data.user.referralCode}</span>
                  </div>
                </div>

                {/* Level infographic */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="text-sm font-bold mb-5 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-secondary" /> Структура доходов по уровням
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(level => {
                      const lvl = referrals[level];
                      const c = LEVEL_COLORS[level - 1];
                      const pct = LEVEL_PCTS[level - 1];
                      const barW = [100, 70, 48, 28, 18][level - 1];
                      return (
                        <div key={level} className="flex items-center gap-4">
                          <div className={`shrink-0 text-xs font-black px-2.5 py-1 rounded-lg border ${c.badge}`}>L{level}</div>
                          <div className="shrink-0 w-10 text-right">
                            <span className={`text-sm font-black ${c.text}`}>{pct}%</span>
                          </div>
                          <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barW}%` }}
                              transition={{ duration: 0.7, delay: (level - 1) * 0.08 }}
                              className={`absolute left-0 top-0 h-full rounded-full ${c.bar}`}
                            />
                          </div>
                          <div className="shrink-0 w-32 text-right">
                            {lvl ? (
                              <span className="text-xs">
                                <span className="text-foreground font-semibold">{lvl.count} чел.</span>
                                <span className="text-green-400 font-bold ml-2">+${lvl.earned.toFixed(0)}</span>
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/40">нет партнёров</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/8 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Всего MLM бонусов</span>
                    <span className="text-green-400 font-black text-2xl">${totalMLM.toFixed(0)}</span>
                  </div>
                </div>

                {/* Partner count summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1">Всего партнёров</div>
                    <div className="text-3xl font-black text-primary">{totalMLMRefs}</div>
                  </div>
                  <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1">Ваш заработок</div>
                    <div className="text-3xl font-black text-green-400">${totalMLM.toFixed(0)}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── SETTINGS ─── */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Wallet */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="text-sm font-bold mb-1 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" /> Кошелёк для выплат
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">Адрес для получения RevShare и MLM-выплат</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Сеть</label>
                      <select value={walletNet} onChange={e => setWalletNet(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-background/50 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/40">
                        <option>TON</option>
                        <option>USDT TRC-20</option>
                        <option>USDT ERC-20</option>
                        <option>BTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Адрес кошелька</label>
                      <Input placeholder="0x... или TU... или UQ..." value={walletAddr}
                        onChange={e => setWalletAddr(e.target.value)}
                        className="bg-background/50 border-white/10 h-11 font-mono text-sm" />
                    </div>
                    <Button onClick={saveWallet} disabled={savingWallet || !walletAddr}
                      className="btn-grad font-bold rounded-xl h-11 px-6">
                      {savingWallet ? "Сохраняю..." : "Сохранить кошелёк"}
                    </Button>
                  </div>
                  {data.user.walletAddress && (
                    <div className="mt-4 p-4 rounded-xl bg-green-500/8 border border-green-500/20">
                      <div className="text-xs text-green-400 font-bold mb-1">Текущий кошелёк</div>
                      <div className="text-sm font-mono">{data.user.walletAddress}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{data.user.walletNetwork}</div>
                    </div>
                  )}
                </div>

                {/* Account info */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="text-sm font-bold mb-5 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" /> Данные аккаунта
                  </div>
                  <div className="space-y-0 divide-y divide-white/8">
                    {[
                      { label: "Имя", value: data.user.name },
                      { label: "Email", value: data.user.email },
                      ...(data.user.telegramUsername ? [{ label: "Telegram", value: data.user.telegramUsername }] : []),
                      { label: "Реферальный код", value: data.user.referralCode, mono: true, primary: true },
                      { label: "Дата регистрации", value: new Date(data.user.createdAt).toLocaleDateString("ru") },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-3">
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                        <span className={`text-sm font-semibold ${row.mono ? "font-mono" : ""} ${row.primary ? "text-primary" : ""}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={handleLogout}
                    className="mt-5 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 w-full sm:w-auto">
                    <LogOut className="w-4 h-4 mr-2" /> Выйти из аккаунта
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ─── PLATFORM ─── */}
            {activeTab === "platform" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {!platformMetrics ? (
                  <div className="glass-card rounded-2xl p-12 border border-white/10 flex flex-col items-center justify-center text-center gap-4">
                    <Globe className="w-10 h-10 text-muted-foreground/30" />
                    <div>
                      <div className="font-bold text-sm mb-1">Данные платформы скоро появятся</div>
                      <div className="text-xs text-muted-foreground">Команда публикует метрики по мере роста платформы</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" /> Метрики платформы Trends
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Обновлено: {new Date(platformMetrics.recordedAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                          {" · "}
                          <span className={`font-semibold ${platformMetrics.source === "api" ? "text-green-400" : platformMetrics.source === "mixed" ? "text-yellow-400" : "text-blue-400"}`}>
                            {platformMetrics.source === "api" ? "✦ live API" : platformMetrics.source === "mixed" ? "✦ частично API" : "вручную"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> Аудитория
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { label: "DAU", value: platformMetrics.dau, color: "text-primary" },
                          { label: "MAU", value: platformMetrics.mau, color: "text-secondary" },
                          { label: "WAU", value: platformMetrics.wau, color: "text-blue-400" },
                          { label: "Всего пользователей", value: platformMetrics.totalUsers, color: "text-cyan-400" },
                          { label: "Новых за месяц", value: platformMetrics.newUsersMonth, color: "text-green-400" },
                        ].map((m, i) => (
                          <div key={i} className="rounded-xl bg-white/4 border border-white/8 p-4">
                            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                            <div className={`text-xl font-black ${m.color}`}>
                              {m.value != null ? m.value.toLocaleString("ru") : <span className="text-white/20 text-base font-normal">—</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Video className="w-3.5 h-3.5" /> Контент
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { label: "Всего видео", value: platformMetrics.totalVideos, color: "text-primary" },
                          { label: "Новых за месяц", value: platformMetrics.newVideosMonth, color: "text-green-400" },
                          { label: "Создателей", value: platformMetrics.totalCreators, color: "text-secondary" },
                        ].map((m, i) => (
                          <div key={i} className="rounded-xl bg-white/4 border border-white/8 p-4">
                            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                            <div className={`text-xl font-black ${m.color}`}>
                              {m.value != null ? m.value.toLocaleString("ru") : <span className="text-white/20 text-base font-normal">—</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Megaphone className="w-3.5 h-3.5" /> Реклама
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Продано слотов", value: platformMetrics.adsSold, prefix: "" },
                          { label: "Показов рекламы", value: platformMetrics.adImpressions, prefix: "" },
                          { label: "Выручка от рекламы", value: platformMetrics.adRevenueUsd, prefix: "$" },
                          { label: "CPM", value: platformMetrics.cpmUsd, prefix: "$" },
                        ].map((m, i) => (
                          <div key={i} className="rounded-xl bg-white/4 border border-white/8 p-4">
                            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                            <div className="text-xl font-black text-yellow-400">
                              {m.value != null
                                ? `${m.prefix}${Number(m.value).toLocaleString("ru")}`
                                : <span className="text-white/20 text-base font-normal">—</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Banknote className="w-3.5 h-3.5" /> Финансы платформы
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Общая выручка платформы", value: platformMetrics.platformRevenueUsd, color: "text-green-400" },
                          { label: "Выплачено создателям", value: platformMetrics.creatorsPaidOutUsd, color: "text-secondary" },
                        ].map((m, i) => (
                          <div key={i} className="rounded-xl bg-white/4 border border-white/8 p-4">
                            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                            <div className={`text-2xl font-black ${m.color}`}>
                              {m.value != null ? `$${Number(m.value).toLocaleString("ru")}` : <span className="text-white/20 text-base font-normal">—</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {platformMetrics.notes && (
                      <div className="glass-card rounded-2xl p-5 border border-white/10">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Комментарий от команды</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{platformMetrics.notes}</div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <InvestmentModal isOpen={isInvestOpen} onClose={() => { setIsInvestOpen(false); loadData(); }} />
    </div>
  );
}
