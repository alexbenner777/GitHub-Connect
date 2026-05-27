import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useSearch } from "wouter";
import { SceneBackground } from "@/components/SceneBackground";
import {
  Copy, Wallet, ArrowLeft, LogOut, CheckCircle2, Clock, XCircle,
  RefreshCw, Settings, TrendingUp, Users, DollarSign, BarChart3,
  Network, Star, ChevronRight, Shield, Globe, Megaphone,
  Banknote, Video, Share2, ExternalLink, Trash2, Download,
  KeyRound, Smartphone, AlertTriangle, Eye, EyeOff, ChevronUp, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { InvestmentModal, MONTHLY_PROFIT } from "@/components/InvestmentModal";
import { useAuth } from "@/hooks/useAuth";
import { api, type CabinetData, type PlatformMetrics, type SessionInfo } from "@/lib/api";

// ─── Helpers ───────────────────────────────────────────────────────────────

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

const WALLET_HINTS: Record<string, string> = {
  "TON": "Выплаты в TON на ваш кошелёк в сети TON",
  "USDT TRC-20": "Выплаты в USDT по сети TRC-20 (Tron)",
  "USDT ERC-20": "Выплаты в USDT по сети ERC-20 (Ethereum)",
  "BTC": "Выплаты в Bitcoin (BTC)",
  "ETH": "Выплаты в Ethereum (ETH)",
};

function validateWalletAddress(address: string, network: string): string | null {
  if (!address) return null;
  const trimmed = address.trim();
  switch (network) {
    case "TON":
      if (!/^[UE]Q[A-Za-z0-9_-]{46}$/.test(trimmed))
        return "Адрес TON должен начинаться с UQ или EQ и содержать 48 символов";
      break;
    case "USDT TRC-20":
      if (!/^T[A-Za-z1-9]{33}$/.test(trimmed))
        return "Адрес TRC-20 должен начинаться с T и содержать 34 символа";
      break;
    case "USDT ERC-20":
    case "ETH":
      if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed))
        return "Адрес ERC-20/ETH: 0x + 40 hex-символов";
      break;
    case "BTC":
      if (!/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(trimmed))
        return "Некорректный адрес Bitcoin";
      break;
  }
  return null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function parseUA(ua: string | null): string {
  if (!ua) return "Неизвестное устройство";
  if (/iPhone|iPad|iOS/.test(ua)) return "iOS · Safari";
  if (/Android/.test(ua)) return `Android · ${/Chrome/.test(ua) ? "Chrome" : "Browser"}`;
  if (/Windows/.test(ua)) return `Windows · ${/Chrome/.test(ua) ? "Chrome" : /Firefox/.test(ua) ? "Firefox" : "Browser"}`;
  if (/Mac/.test(ua)) return `macOS · ${/Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Browser"}`;
  return "Браузер";
}

// ─── Main Component ─────────────────────────────────────────────────────────

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
  const [activeTab, setActiveTab] = useState<"overview" | "investments" | "mlm" | "settings" | "platform">("overview");
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [totalRaised, setTotalRaised] = useState(0);

  // Wallet
  const [walletAddr, setWalletAddr] = useState("");
  const [walletNet, setWalletNet] = useState("USDT TRC-20");
  const [walletValidationErr, setWalletValidationErr] = useState<string | null>(null);
  const [savingWallet, setSavingWallet] = useState(false);
  const [walletOtpMode, setWalletOtpMode] = useState<"idle" | "sent" | "confirming">("idle");
  const [walletOtpCode, setWalletOtpCode] = useState("");
  const [walletOtpEmail, setWalletOtpEmail] = useState("");

  // Password change
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  // 2FA
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [twoFaMode, setTwoFaMode] = useState<"idle" | "sent" | "verifying">("idle");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaLoading, setTwoFaLoading] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // TX filter
  const [txTypeFilter, setTxTypeFilter] = useState<"all" | "investment" | "revshare" | "mlm" | "withdrawal">("all");

  useEffect(() => { if (!authLoading && !user) setLocation("/login"); }, [authLoading, user]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [d, r, stats] = await Promise.all([api.me(), api.referrals(), api.stats()]);
      setData(d);
      setReferrals(r.levels);
      setWalletAddr(d.user.walletAddress ?? "");
      setWalletNet(d.user.walletNetwork ?? "USDT TRC-20");
      setTwoFaEnabled(d.user.twoFactorEnabled ?? false);
      setTotalRaised(stats.raised ?? 0);
    } catch {
      toast({ title: "Ошибка загрузки данных", variant: "destructive" });
    } finally {
      setLoadingData(false);
    }
    api.platformMetrics().then(pm => setPlatformMetrics(pm.metrics)).catch(() => {});
  };

  useEffect(() => { loadData(); }, [user]);

  const refLink = data ? `${window.location.origin}/register?ref=${data.user.referralCode}` : "";

  const copyRef = () => {
    if (!data) return;
    navigator.clipboard.writeText(refLink);
    toast({ title: "Реферальная ссылка скопирована!" });
  };

  const shareToTelegram = () => {
    if (!data) return;
    const text = `Я инвестирую в Trends — первую Reels-ленту внутри Telegram. Pre-Seed раунд открыт, бонус +30% к доле. Жми: ${refLink}`;
    navigator.clipboard.writeText(text).catch(() => {});
    window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent("Я инвестирую в Trends — первую Reels-ленту внутри Telegram. Pre-Seed раунд открыт, бонус +30% к доле.")}`, "_blank");
  };

  // Wallet OTP flow
  const requestWalletChange = async () => {
    const err = validateWalletAddress(walletAddr, walletNet);
    if (err) { setWalletValidationErr(err); return; }
    setWalletValidationErr(null);
    setSavingWallet(true);
    try {
      const r = await api.requestWalletChange({ walletAddress: walletAddr, walletNetwork: walletNet });
      setWalletOtpEmail(r.email);
      setWalletOtpMode("sent");
      toast({ title: "Код подтверждения отправлен на email" });
    } catch (e: any) {
      toast({ title: e.message ?? "Ошибка", variant: "destructive" });
    } finally { setSavingWallet(false); }
  };

  const confirmWalletChange = async () => {
    if (walletOtpCode.length !== 6) return;
    setWalletOtpMode("confirming");
    try {
      const r = await api.confirmWalletChange({ code: walletOtpCode });
      setData(d => d ? { ...d, user: { ...d.user, walletAddress: r.walletAddress, walletNetwork: r.walletNetwork } } : d);
      setWalletOtpMode("idle");
      setWalletOtpCode("");
      toast({ title: "Кошелёк успешно изменён!" });
    } catch (e: any) {
      setWalletOtpMode("sent");
      toast({ title: e.message ?? "Неверный код", variant: "destructive" });
    }
  };

  // Password change
  const changePassword = async () => {
    if (pwForm.newPw !== pwForm.confirm) {
      toast({ title: "Пароли не совпадают", variant: "destructive" }); return;
    }
    if (pwForm.newPw.length < 8) {
      toast({ title: "Минимум 8 символов", variant: "destructive" }); return;
    }
    setPwLoading(true);
    try {
      await api.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw });
      toast({ title: "Пароль успешно изменён!" });
      setPwForm({ current: "", newPw: "", confirm: "" });
      setShowPwForm(false);
    } catch (e: any) {
      toast({ title: e.message ?? "Ошибка", variant: "destructive" });
    } finally { setPwLoading(false); }
  };

  // Sessions
  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const r = await api.getSessions();
      setSessions(r.sessions);
    } catch { /* ignore */ }
    finally { setSessionsLoading(false); }
  };

  const revokeSession = async (id: number) => {
    try {
      await api.revokeSession(id);
      setSessions(s => s.filter(x => x.id !== id));
      toast({ title: "Сессия завершена" });
    } catch { toast({ title: "Ошибка", variant: "destructive" }); }
  };

  // Export data
  const exportData = async () => {
    const res = await api.exportData();
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "trends-my-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setDeleteLoading(true);
    try {
      await api.deleteAccount({ password: deletePassword });
      await logout();
      setLocation("/");
      toast({ title: "Аккаунт удалён" });
    } catch (e: any) {
      toast({ title: e.message ?? "Ошибка", variant: "destructive" });
    } finally { setDeleteLoading(false); }
  };

  // 2FA
  const enable2FA = async () => {
    setTwoFaLoading(true);
    try {
      await api.enable2FA();
      setTwoFaMode("sent");
      toast({ title: "Код отправлен на email" });
    } catch (e: any) {
      toast({ title: e.message ?? "Ошибка", variant: "destructive" });
    } finally { setTwoFaLoading(false); }
  };

  const verify2FA = async () => {
    setTwoFaLoading(true);
    try {
      const r = await api.verify2FA({ code: twoFaCode });
      setTwoFaEnabled(r.enabled);
      setTwoFaMode("idle");
      setTwoFaCode("");
      toast({ title: "2FA успешно включена!" });
    } catch (e: any) {
      toast({ title: e.message ?? "Неверный код", variant: "destructive" });
    } finally { setTwoFaLoading(false); }
  };

  const disable2FA = async () => {
    setTwoFaLoading(true);
    try {
      await api.disable2FA();
      setTwoFaEnabled(false);
      toast({ title: "2FA отключена" });
    } catch (e: any) {
      toast({ title: e.message ?? "Ошибка", variant: "destructive" });
    } finally { setTwoFaLoading(false); }
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

  const CPM_RUB = 190, SHOWS = 2, REVSHARE_PCT = 0.20, RUB_USD = 91, TOTAL_SHARES = 5000;
  const REVSHARE_DAU = 5_000_000;
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

  const ROUND1_TARGET = 500_000;
  const raisedPct = Math.min(100, Math.round((totalRaised / ROUND1_TARGET) * 100));

  // Filtered transactions
  const filteredTx = txTypeFilter === "all"
    ? data.transactions
    : data.transactions.filter(tx => {
        if (txTypeFilter === "investment") return tx.type === "investment";
        if (txTypeFilter === "revshare") return tx.type === "revshare";
        if (txTypeFilter === "mlm") return tx.type === "referral_bonus" || tx.type === "mlm";
        if (txTypeFilter === "withdrawal") return tx.type === "withdrawal";
        return true;
      });

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
              <span
                className="w-2 h-2 rounded-full bg-green-400 animate-pulse cursor-default"
                title="Аккаунт верифицирован"
              />
              <span className="text-sm font-semibold">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MOBILE PROFILE STRIP ══ */}
      <div className="lg:hidden border-b border-white/8 px-4 py-3" style={{ background: "rgba(8, 11, 22, 0.6)", marginTop: "64px" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-black text-white">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">{user.name}</div>
              <div className="text-[11px] text-muted-foreground">{data.user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsInvestOpen(true)} className="h-8 px-3 rounded-lg btn-grad text-xs font-bold whitespace-nowrap">
              + Вложить
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Mini round progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span className="font-semibold text-primary">Round 1 · Pre-Seed</span>
            <span>${totalRaised.toLocaleString()} / $500 000 · {raisedPct}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${raisedPct}%` }} transition={{ duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pt-4 lg:pt-24 pb-24 lg:pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══ SIDEBAR — desktop only ══ */}
          <aside className="hidden lg:flex lg:flex-col lg:w-72 shrink-0 space-y-4">

            {/* Profile card */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-white mb-4 shadow-lg">
                  {user.name[0].toUpperCase()}
                </div>
                <div className="font-black text-lg leading-tight">{user.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{user.email}</div>
                <div className="flex items-center gap-1.5 mt-3" title="Аккаунт верифицирован">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">Верифицирован</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/8 text-xs text-muted-foreground">
                  С нами с {formatDate(data.user.createdAt)}
                </div>
              </div>
            </div>

            {/* Round progress bar */}
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Round 1 · Pre-Seed</span>
                <span className="text-xs font-black text-green-400">+30% бонус</span>
              </div>
              <div className="h-2.5 bg-white/8 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${raisedPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${totalRaised.toLocaleString()} собрано</span>
                <span>{raisedPct}% из ${ROUND1_TARGET.toLocaleString()}</span>
              </div>
            </div>

            {/* Ref link */}
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Реферальная ссылка</div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/8 mb-2">
                <div className="text-xs font-mono text-muted-foreground truncate">
                  {window.location.origin}/register?ref=<span className="text-primary font-bold">{data.user.referralCode}</span>
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
            <button onClick={() => setIsInvestOpen(true)} className="w-full btn-grad btn-3d h-12 rounded-xl font-bold text-sm">
              + Новая инвестиция
            </button>

            {/* Admin link */}
            {user.isAdmin && (
              <Link href="/admin" className="w-full flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            )}
          </aside>

          {/* ══ MAIN CONTENT ══ */}
          <main className="flex-1 min-w-0 space-y-5">

            {/* Stat cards (shown once, above all tabs) */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {statCards.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`glass-card rounded-2xl p-5 border ${s.border} bg-gradient-to-br ${s.bg} relative overflow-hidden`}>
                  <div className="absolute top-3 right-3 opacity-20"><s.icon className="w-8 h-8" /></div>
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

                {/* Portfolio */}
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

                {/* DAU Profitability */}
                {data.stats.totalShares > 0 && (() => {
                  const milestones = [
                    { label: "500K", dau: 500_000 },
                    { label: "1M", dau: 1_000_000 },
                    { label: "5M", dau: 5_000_000 },
                    { label: "10M", dau: 10_000_000 },
                    { label: "25M", dau: 25_000_000 },
                    { label: "50M", dau: 50_000_000 },
                  ];
                  const earnings = milestones.map(m => {
                    const pool = (m.dau * SHOWS * CPM_RUB / 1000 * 30 / RUB_USD) * REVSHARE_PCT;
                    return Math.round((data.stats.totalShares / TOTAL_SHARES) * pool);
                  });
                  const maxEarning = Math.max(...earnings);
                  const barColors = ["bg-primary/40", "bg-primary/55", "bg-secondary/60", "bg-secondary/75", "bg-green-400/70", "bg-green-400"];
                  const textColors = ["text-primary/70", "text-primary/85", "text-secondary/80", "text-secondary", "text-green-400/85", "text-green-400"];
                  return (
                    <div className="glass-card rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-green-500/5 to-transparent">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                        <div className="text-sm font-bold flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" /> Ваш RevShare при разных DAU
                        </div>
                        <Link href="/#packages"
                          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                          Увеличить долю <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="text-xs text-muted-foreground mb-5">
                        {data.stats.totalShares.toFixed(2)} долей · формула идентична калькулятору
                      </div>
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
                                  initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                                  transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                                  className={`w-full rounded-t-lg ${barColors[i]}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        {milestones.map((m, i) => (
                          <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground font-medium">{m.label}</div>
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground text-center mt-1">DAU (ежедневная аудитория)</div>
                      <div className="mt-4 pt-4 border-t border-white/8 flex flex-wrap gap-3 justify-between items-center">
                        <span className="text-xs text-muted-foreground">При 50M DAU (пик) / в месяц</span>
                        <span className="text-green-400 font-black text-lg">${earnings[5].toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Transactions with filter */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-sm font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> История операций</span>
                    <button onClick={loadData} className="text-muted-foreground hover:text-primary transition-colors p-1">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Type filter */}
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {(["all", "investment", "revshare", "mlm", "withdrawal"] as const).map(f => (
                      <button key={f} onClick={() => setTxTypeFilter(f)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          txTypeFilter === f
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-white/5 text-muted-foreground border border-white/8 hover:border-white/15"
                        }`}>
                        {{ all: "Все", investment: "Инвестиции", revshare: "RevShare", mlm: "MLM", withdrawal: "Выплаты" }[f]}
                      </button>
                    ))}
                  </div>
                  {filteredTx.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 text-sm">Операций пока нет</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredTx.slice(0, 15).map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6 hover:bg-white/5 transition-colors">
                          <div>
                            <div className="font-medium text-sm">{tx.description}</div>
                            <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("ru-RU")}</div>
                          </div>
                          <div className="text-green-400 font-black text-sm">+${parseFloat(tx.amount).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── INVESTMENTS ─── */}
            {activeTab === "investments" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Ваши вклады</span>
                  <button onClick={() => setIsInvestOpen(true)} className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
                    + Добавить вклад
                  </button>
                </div>
                {data.investments.length === 0 ? (
                  <div className="glass-card rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
                    <div className="p-8 sm:p-12 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                        <DollarSign className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-black mb-2">Начните зарабатывать с Trends</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
                        Выберите пакет Pre-Seed, получите долю RevShare от рекламной выручки и MLM-бонусы от вашей структуры
                      </p>
                      <Button onClick={() => setIsInvestOpen(true)} className="btn-grad btn-3d font-bold rounded-xl h-12 px-8">
                        Выбрать пакет
                      </Button>
                    </div>
                    <div className="border-t border-white/8 px-8 py-5 grid grid-cols-3 gap-4 text-center">
                      {[
                        { label: "Starter", value: "$100", color: "text-primary" },
                        { label: "Genesis", value: "$1 000", color: "text-secondary" },
                        { label: "Growth", value: "$10 000", color: "text-yellow-400" },
                      ].map((pkg, i) => (
                        <div key={i}>
                          <div className={`text-base font-black ${pkg.color}`}>{pkg.value}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{pkg.label}</div>
                        </div>
                      ))}
                    </div>
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
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Star className={`w-4 h-4 ${textColors[i % textColors.length]}`} />
                                  </div>
                                  <span className="font-black text-base">{inv.packageName}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Дата: {formatDate(inv.createdAt)}
                                </div>
                                {inv.txHash && (
                                  <a
                                    href={`https://tonscan.org/tx/${inv.txHash}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-primary/70 font-mono mt-0.5 hover:text-primary transition-colors flex items-center gap-1 truncate"
                                  >
                                    TX: {inv.txHash.slice(0, 12)}…{inv.txHash.slice(-8)}
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                )}
                              </div>
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

                {/* Ref link card — always shown, styled as hero card */}
                <div className="glass-card rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-transparent to-secondary/5 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                        <Network className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-black">Ваша реферальная ссылка</div>
                        <div className="text-xs text-muted-foreground">Делитесь и получайте до 10% от инвестиций</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 mb-4">
                      <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                        {window.location.origin}/register?ref=<span className="text-primary font-bold">{data.user.referralCode}</span>
                      </span>
                      <button onClick={copyRef} className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={copyRef}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors border border-primary/20">
                        <Copy className="w-3.5 h-3.5" /> Скопировать
                      </button>
                      <button onClick={shareToTelegram}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-semibold transition-colors border border-blue-500/20">
                        <Share2 className="w-3.5 h-3.5" /> В Telegram
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1">Всего партнёров</div>
                    <div className="text-3xl font-black text-primary">{totalMLMRefs}</div>
                    {totalMLMRefs === 0 && <div className="text-[11px] text-muted-foreground mt-1">Пригласите первого →</div>}
                  </div>
                  <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent">
                    <div className="text-xs text-muted-foreground mb-1">MLM заработок</div>
                    <div className="text-3xl font-black text-green-400">${totalMLM.toFixed(0)}</div>
                    {totalMLM === 0 && <div className="text-[11px] text-muted-foreground mt-1">Растёт с сетью</div>}
                  </div>
                </div>

                {/* Onboarding steps — shown when no partners yet */}
                {totalMLMRefs === 0 && (
                  <div className="glass-card rounded-2xl border border-white/10 p-6">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-5">Как начать зарабатывать</div>
                    <div className="space-y-4">
                      {[
                        { step: "01", title: "Скопируйте ссылку", desc: "Ваша персональная реферальная ссылка уже готова выше", done: true, color: "text-primary", bg: "bg-primary/15 border-primary/30" },
                        { step: "02", title: "Поделитесь в Telegram", desc: "Отправьте в чаты, каналы или лично — каждый переход отслеживается", done: false, color: "text-secondary", bg: "bg-secondary/15 border-secondary/30" },
                        { step: "03", title: "Партнёр инвестирует", desc: "Как только ваш реферал делает вклад, вы получаете 10% мгновенно", done: false, color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
                        { step: "04", title: "Стройте 5 уровней", desc: "Их партнёры — ваш L2 (5%), их партнёры — L3 (3%) и т.д. до 5 уровней", done: false, color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/30" },
                      ].map((s, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-black ${s.bg} ${s.color}`}>
                            {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <div className={`text-sm font-bold ${s.done ? "text-foreground" : "text-foreground"}`}>{s.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level structure — always shown */}
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
                              animate={{ width: lvl ? `${barW}%` : "0%" }}
                              transition={{ duration: 0.7, delay: (level - 1) * 0.08 }}
                              className={`absolute left-0 top-0 h-full rounded-full ${c.bar} ${!lvl ? "opacity-20" : ""}`}
                              style={!lvl ? { width: `${barW}%`, opacity: 0.15 } : undefined}
                            />
                          </div>
                          <div className="shrink-0 w-36 text-right">
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
                  <p className="text-xs text-muted-foreground mb-5">Смена адреса требует подтверждения по email</p>

                  {walletOtpMode === "idle" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Сеть</label>
                        <select value={walletNet} onChange={e => { setWalletNet(e.target.value); setWalletValidationErr(null); }}
                          className="w-full h-11 px-3 rounded-xl bg-background/50 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/40">
                          <option>TON</option>
                          <option>USDT TRC-20</option>
                          <option>USDT ERC-20</option>
                          <option>BTC</option>
                          <option>ETH</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1.5">{WALLET_HINTS[walletNet]}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Адрес кошелька</label>
                        <Input
                          placeholder={walletNet === "TON" ? "UQ... или EQ..." : walletNet.includes("TRC") ? "T..." : "0x..."}
                          value={walletAddr}
                          onChange={e => {
                            setWalletAddr(e.target.value);
                            setWalletValidationErr(validateWalletAddress(e.target.value, walletNet));
                          }}
                          className={`bg-background/50 h-11 font-mono text-sm ${walletValidationErr ? "border-red-500/50" : "border-white/10"}`}
                        />
                        {walletValidationErr && (
                          <p className="text-xs text-red-400 mt-1.5">{walletValidationErr}</p>
                        )}
                      </div>
                      <Button onClick={requestWalletChange} disabled={savingWallet || !walletAddr || !!walletValidationErr}
                        className="btn-grad font-bold rounded-xl h-11 px-6">
                        {savingWallet ? "Отправляю код..." : "Сохранить кошелёк"}
                      </Button>
                    </div>
                  )}

                  {(walletOtpMode === "sent" || walletOtpMode === "confirming") && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-primary/8 border border-primary/20">
                        <p className="text-sm text-primary font-semibold mb-1">Код отправлен на {walletOtpEmail}</p>
                        <p className="text-xs text-muted-foreground">Введите 6-значный код из письма. Действует 15 минут.</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Код подтверждения</label>
                        <Input
                          type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                          placeholder="000000" value={walletOtpCode}
                          onChange={e => setWalletOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="bg-background/50 border-white/10 h-11 text-center text-xl tracking-widest font-mono"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={confirmWalletChange}
                          disabled={walletOtpCode.length !== 6 || walletOtpMode === "confirming"}
                          className="btn-grad font-bold rounded-xl h-11 flex-1">
                          {walletOtpMode === "confirming" ? "Проверяю..." : "Подтвердить"}
                        </Button>
                        <Button variant="outline" onClick={() => { setWalletOtpMode("idle"); setWalletOtpCode(""); }}
                          className="border-white/10 rounded-xl h-11">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}

                  {data.user.walletAddress && (
                    <div className="mt-4 p-4 rounded-xl bg-green-500/8 border border-green-500/20">
                      <div className="text-xs text-green-400 font-bold mb-1">Текущий кошелёк</div>
                      <div className="text-sm font-mono break-all">{data.user.walletAddress}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{data.user.walletNetwork}</div>
                    </div>
                  )}
                </div>

                {/* Change password */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <button
                    onClick={() => setShowPwForm(v => !v)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="text-sm font-bold flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-muted-foreground" /> Сменить пароль
                    </div>
                    {showPwForm ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {showPwForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="space-y-4 mt-5">
                          <div>
                            <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Текущий пароль</label>
                            <div className="relative">
                              <Input
                                type={showCurPw ? "text" : "password"}
                                value={pwForm.current}
                                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                                className="bg-background/50 border-white/10 h-11 pr-10"
                              />
                              <button type="button" onClick={() => setShowCurPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showCurPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Новый пароль</label>
                            <div className="relative">
                              <Input
                                type={showNewPw ? "text" : "password"}
                                value={pwForm.newPw}
                                onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                                className="bg-background/50 border-white/10 h-11 pr-10"
                              />
                              <button type="button" onClick={() => setShowNewPw(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold mb-1.5 block text-muted-foreground uppercase tracking-wide">Подтвердите новый пароль</label>
                            <Input
                              type="password"
                              value={pwForm.confirm}
                              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                              className={`bg-background/50 h-11 ${pwForm.confirm && pwForm.newPw !== pwForm.confirm ? "border-red-500/50" : "border-white/10"}`}
                            />
                            {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                              <p className="text-xs text-red-400 mt-1">Пароли не совпадают</p>
                            )}
                          </div>
                          <Button onClick={changePassword} disabled={pwLoading || !pwForm.current || !pwForm.newPw || !pwForm.confirm}
                            className="btn-grad font-bold rounded-xl h-11">
                            {pwLoading ? "Сохраняю..." : "Изменить пароль"}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2FA */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="text-sm font-bold mb-1 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-secondary" /> Двухфакторная аутентификация
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">
                    Защита входа кодом из email. Сейчас: <span className={twoFaEnabled ? "text-green-400 font-bold" : "text-muted-foreground"}>
                      {twoFaEnabled ? "Включена" : "Отключена"}
                    </span>
                  </p>
                  {!twoFaEnabled && twoFaMode === "idle" && (
                    <Button onClick={enable2FA} disabled={twoFaLoading} variant="outline"
                      className="border-secondary/30 text-secondary hover:bg-secondary/10 font-bold rounded-xl h-11">
                      {twoFaLoading ? "..." : "Включить 2FA"}
                    </Button>
                  )}
                  {!twoFaEnabled && twoFaMode === "sent" && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-secondary/8 border border-secondary/20">
                        <p className="text-xs text-secondary">Код отправлен на ваш email. Действует 10 минут.</p>
                      </div>
                      <Input
                        type="text" inputMode="numeric" maxLength={6}
                        placeholder="000000" value={twoFaCode}
                        onChange={e => setTwoFaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="bg-background/50 border-white/10 h-11 text-center text-xl tracking-widest font-mono"
                      />
                      <div className="flex gap-3">
                        <Button onClick={verify2FA} disabled={twoFaCode.length !== 6 || twoFaLoading}
                          className="btn-grad font-bold rounded-xl h-11 flex-1">
                          {twoFaLoading ? "Проверяю..." : "Подтвердить"}
                        </Button>
                        <Button variant="outline" onClick={() => { setTwoFaMode("idle"); setTwoFaCode(""); }}
                          className="border-white/10 rounded-xl h-11">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}
                  {twoFaEnabled && (
                    <Button onClick={disable2FA} disabled={twoFaLoading} variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold rounded-xl h-11">
                      {twoFaLoading ? "..." : "Отключить 2FA"}
                    </Button>
                  )}
                </div>

                {/* Active sessions */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <button
                    onClick={() => { setShowSessions(v => !v); if (!showSessions) loadSessions(); }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="text-sm font-bold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" /> Активные сессии
                    </div>
                    {showSessions ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {showSessions && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-5 space-y-2">
                          {sessionsLoading ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Загрузка...</p>
                          ) : sessions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Нет активных сессий</p>
                          ) : sessions.map((s, i) => (
                            <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? "bg-primary/8 border-primary/20" : "bg-white/3 border-white/8"}`}>
                              <div>
                                <div className="text-sm font-semibold flex items-center gap-2">
                                  {parseUA(s.userAgent)}
                                  {i === 0 && <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">Текущая</span>}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {s.ip} · {new Date(s.createdAt).toLocaleDateString("ru-RU")}
                                </div>
                              </div>
                              {i !== 0 && (
                                <button onClick={() => revokeSession(s.id)} className="p-2 rounded-lg hover:bg-red-500/15 text-muted-foreground hover:text-red-400 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                      { label: "Дата регистрации", value: formatDate(data.user.createdAt) },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-3">
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                        <span className={`text-sm font-semibold ${(row as any).mono ? "font-mono" : ""} ${(row as any).primary ? "text-primary" : ""}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button variant="outline" onClick={handleLogout}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30">
                      <LogOut className="w-4 h-4 mr-2" /> Выйти
                    </Button>
                    <Button variant="outline" onClick={exportData}
                      className="border-white/10 text-muted-foreground hover:bg-white/5">
                      <Download className="w-4 h-4 mr-2" /> Скачать мои данные
                    </Button>
                  </div>
                </div>

                {/* Delete account */}
                <div className="glass-card rounded-2xl p-6 border border-red-500/15 bg-red-500/4">
                  <div className="text-sm font-bold mb-1 flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" /> Удаление аккаунта
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Все данные будут удалены без возможности восстановления.</p>
                  {!showDeleteConfirm ? (
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(true)}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" /> Удалить аккаунт
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-400 font-semibold">Введите пароль для подтверждения:</p>
                      <Input
                        type="password" placeholder="Ваш пароль"
                        value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                        className="bg-background/50 border-red-500/20 h-11"
                      />
                      <div className="flex gap-3">
                        <Button onClick={handleDeleteAccount} disabled={deleteLoading || !deletePassword}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-11 flex-1">
                          {deleteLoading ? "Удаляю..." : "Подтвердить удаление"}
                        </Button>
                        <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                          className="border-white/10 rounded-xl h-11">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}
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
                          Обновлено: {formatDate(platformMetrics.recordedAt)}
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

      {/* ══ MOBILE BOTTOM TABBAR ══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10" style={{ background: "rgba(8, 11, 22, 0.92)", backdropFilter: "blur(28px) saturate(200%)" }}>
        <div className="flex items-stretch justify-around h-16">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 transition-all ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground/70 hover:text-muted-foreground"
              }`}
            >
              {activeTab === tab.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <tab.icon className={`w-5 h-5 transition-all ${activeTab === tab.id ? "scale-110" : ""}`} />
              <span className="text-[10px] font-semibold leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <InvestmentModal isOpen={isInvestOpen} onClose={() => { setIsInvestOpen(false); loadData(); }} />
    </div>
  );
}
