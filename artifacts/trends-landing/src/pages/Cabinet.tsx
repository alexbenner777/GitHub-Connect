import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Copy, Wallet, ArrowLeft, LogOut, CheckCircle2, Clock, XCircle, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { InvestmentModal } from "@/components/InvestmentModal";
import { useAuth } from "@/hooks/useAuth";
import { api, type CabinetData } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" />Подтверждено</span>;
  if (status === "pending") return <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />Ожидает</span>;
  return <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" />{status}</span>;
}

export default function Cabinet() {
  const { user, loading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [data, setData] = useState<CabinetData | null>(null);
  const [referrals, setReferrals] = useState<Record<number, { count: number; earned: number }>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [walletAddr, setWalletAddr] = useState("");
  const [walletNet, setWalletNet] = useState("USDT TRC-20");
  const [savingWallet, setSavingWallet] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "investments" | "mlm" | "settings">("overview");

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
  };

  useEffect(() => { loadData(); }, [user]);

  const copyRef = () => {
    if (!data) return;
    const url = `${window.location.origin}/register?ref=${data.user.referralCode}`;
    navigator.clipboard.writeText(url);
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

  const handleLogout = () => { logout(); setLocation("/"); };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user || !data) return null;

  const confirmedInvestments = data.investments.filter(i => i.status === "confirmed");
  const totalMLM = Object.values(referrals).reduce((s, l) => s + l.earned, 0);
  const totalMLMRefs = Object.values(referrals).reduce((s, l) => s + l.count, 0);

  const tabs = [
    { id: "overview", label: "Обзор" },
    { id: "investments", label: "Инвестиции" },
    { id: "mlm", label: "Партнёры" },
    { id: "settings", label: "Настройки" },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <span className="font-black text-xl text-gradient">Trends</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-white/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black mb-1">Добро пожаловать, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Панель управления инвестора</p>
          </div>
          <Button onClick={() => setIsInvestOpen(true)} className="btn-grad btn-3d font-bold rounded-xl h-11 px-6">
            + Инвестировать
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl">
            <div className="text-xs text-muted-foreground mb-1">Инвестировано</div>
            <div className="text-2xl font-black text-primary">${data.stats.totalInvested.toLocaleString()}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <div className="text-xs text-muted-foreground mb-1">Доля в пуле</div>
            <div className="text-2xl font-black text-secondary">{data.stats.totalShares.toFixed(2)}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <div className="text-xs text-muted-foreground mb-1">MLM бонусы</div>
            <div className="text-2xl font-black text-green-400">${totalMLM.toFixed(2)}</div>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <div className="text-xs text-muted-foreground mb-1">Партнёров</div>
            <div className="text-2xl font-black text-yellow-400">{totalMLMRefs}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-card rounded-xl w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Pending investments notice */}
            {data.investments.filter(i => i.status === "pending").length > 0 && (
              <div className="glass-card p-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-yellow-400 mb-1">Ожидается подтверждение инвестиции</div>
                    <p className="text-sm text-muted-foreground">Ваша заявка получена. После подтверждения оплаты администратором ваши инвестиции будут активированы.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5 flex items-center justify-between">
                История операций
                <button onClick={loadData} className="text-muted-foreground hover:text-primary transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </h2>
              {data.transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Операций пока нет</p>
              ) : (
                <div className="space-y-3">
                  {data.transactions.slice(0, 10).map((tx, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6">
                      <div>
                        <div className="font-medium text-sm">{tx.description}</div>
                        <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("ru")}</div>
                      </div>
                      <div className="text-green-400 font-black">+${parseFloat(tx.amount).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Investments Tab */}
        {activeTab === "investments" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {data.investments.length === 0 ? (
              <div className="glass-card p-10 rounded-2xl text-center">
                <p className="text-muted-foreground mb-4">У вас пока нет инвестиций</p>
                <Button onClick={() => setIsInvestOpen(true)} className="btn-grad font-bold rounded-xl">Инвестировать сейчас</Button>
              </div>
            ) : (
              data.investments.map(inv => (
                <div key={inv.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-lg">{inv.packageName}</div>
                    <div className="text-primary font-black text-xl">${parseFloat(inv.amount).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString("ru")}</div>
                    {inv.txHash && <div className="text-xs text-muted-foreground font-mono">TX: {inv.txHash}</div>}
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <StatusBadge status={inv.status} />
                    {inv.status === "confirmed" && (
                      <div className="text-xs text-secondary">Доля: {parseFloat(inv.shares).toFixed(2)} в пуле</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* MLM Tab */}
        {activeTab === "mlm" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Ваша реферальная ссылка</h2>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-sm font-mono text-muted-foreground flex-1 truncate">
                  {window.location.origin}/register?ref={data.user.referralCode}
                </span>
                <Button variant="ghost" size="icon" onClick={copyRef} className="shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Ваш код: <span className="text-primary font-mono font-bold">{data.user.referralCode}</span></p>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-5">Структура партнёров</h2>
              {Object.keys(referrals).length === 0 ? (
                <p className="text-muted-foreground text-center py-6">Пока нет привлечённых партнёров</p>
              ) : (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(level => {
                    const lvl = referrals[level];
                    const pcts = [10, 5, 3, 1, 1];
                    if (!lvl) return (
                      <div key={level} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 opacity-40">
                        <div className="text-muted-foreground font-bold w-24">Уровень {level} ({pcts[level-1]}%)</div>
                        <div className="text-sm text-muted-foreground">нет партнёров</div>
                      </div>
                    );
                    return (
                      <div key={level} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-primary font-black w-24">Ур. {level} ({pcts[level-1]}%)</div>
                        <div className="flex-1">
                          <div className="font-semibold">{lvl.count} партнёров</div>
                        </div>
                        <div className="text-green-400 font-black">+${lvl.earned.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-muted-foreground">Итого MLM бонусы</span>
                <span className="text-green-400 font-black text-xl">${totalMLM.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" /> Кошелёк для выплат
              </h2>
              <p className="text-sm text-muted-foreground mb-5">Укажите адрес кошелька, на который будут приходить RevShare и MLM-выплаты.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Сеть</label>
                  <select value={walletNet} onChange={e => setWalletNet(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-background/50 border border-white/10 text-foreground text-sm">
                    <option>USDT TRC-20</option>
                    <option>USDT ERC-20</option>
                    <option>TON</option>
                    <option>BTC</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Адрес кошелька</label>
                  <Input placeholder="0x... или TU... или UQ..." value={walletAddr}
                    onChange={e => setWalletAddr(e.target.value)}
                    className="bg-background/50 border-white/10 h-11 font-mono" />
                </div>
                <Button onClick={saveWallet} disabled={savingWallet || !walletAddr}
                  className="btn-grad font-bold rounded-xl h-11 px-6">
                  {savingWallet ? "Сохраняю..." : "Сохранить кошелёк"}
                </Button>
              </div>
              {data.user.walletAddress && (
                <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-xs text-green-400 font-semibold mb-1">Текущий кошелёк:</div>
                  <div className="text-sm font-mono text-foreground">{data.user.walletAddress}</div>
                  <div className="text-xs text-muted-foreground">{data.user.walletNetwork}</div>
                </div>
              )}
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" /> Аккаунт
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-muted-foreground">Имя</span>
                  <span className="font-semibold">{data.user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-semibold">{data.user.email}</span>
                </div>
                {data.user.telegramUsername && (
                  <div className="flex justify-between py-2 border-b border-white/8">
                    <span className="text-muted-foreground">Telegram</span>
                    <span className="font-semibold">{data.user.telegramUsername}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/8">
                  <span className="text-muted-foreground">Реферальный код</span>
                  <span className="font-mono text-primary font-bold">{data.user.referralCode}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Дата регистрации</span>
                  <span>{new Date(data.user.createdAt).toLocaleDateString("ru")}</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout} className="mt-5 border-destructive/30 text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" /> Выйти из аккаунта
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <InvestmentModal isOpen={isInvestOpen} onClose={() => { setIsInvestOpen(false); loadData(); }} />
    </div>
  );
}
