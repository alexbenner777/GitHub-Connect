import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api, type Investment, type PlatformMetrics } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2, Clock, XCircle, RefreshCw, DollarSign,
  AlertTriangle, Search, ExternalLink, ChevronDown, ChevronUp,
  LogOut, Shield, BarChart3, Save, History
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return (
    <span className="inline-flex items-center gap-1 bg-green-500/15 text-green-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-500/20">
      <CheckCircle2 className="w-3 h-3" />Подтверждено
    </span>
  );
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-red-500/20">
      <XCircle className="w-3 h-3" />Отклонено
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-500/15 text-yellow-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-yellow-500/20">
      <Clock className="w-3 h-3" />Ожидает
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl p-5 border bg-white/3 ${color}`}>
      <div className="text-xs text-white/50 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  );
}

const EMPTY_METRICS = {
  dau: "", mau: "", wau: "", totalUsers: "", newUsersMonth: "",
  totalVideos: "", newVideosMonth: "", totalCreators: "",
  adsSold: "", adImpressions: "", adRevenueUsd: "", cpmUsd: "",
  platformRevenueUsd: "", creatorsPaidOutUsd: "",
  source: "manual" as "manual" | "api" | "mixed",
  notes: "",
};

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [txHashes, setTxHashes] = useState<Record<number, string>>({});
  const [confirming, setConfirming] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"pending" | "confirmed" | "rejected" | "all">("pending");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [adminTab, setAdminTab] = useState<"investments" | "metrics">("investments");
  const [metricsForm, setMetricsForm] = useState(EMPTY_METRICS);
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [metricsHistory, setMetricsHistory] = useState<PlatformMetrics[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) setLocation("/");
  }, [loading, user]);

  const load = useCallback(async () => {
    setFetching(true);
    try {
      const data = await api.adminGetInvestments();
      setInvestments(data.investments);
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    } finally {
      setFetching(false);
    }
  }, []);

  const loadMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const data = await api.adminGetPlatformMetricsHistory();
      setMetricsHistory(data.metrics);
      if (data.metrics[0]) {
        const m = data.metrics[0];
        setMetricsForm({
          dau: m.dau != null ? String(m.dau) : "",
          mau: m.mau != null ? String(m.mau) : "",
          wau: m.wau != null ? String(m.wau) : "",
          totalUsers: m.totalUsers != null ? String(m.totalUsers) : "",
          newUsersMonth: m.newUsersMonth != null ? String(m.newUsersMonth) : "",
          totalVideos: m.totalVideos != null ? String(m.totalVideos) : "",
          newVideosMonth: m.newVideosMonth != null ? String(m.newVideosMonth) : "",
          totalCreators: m.totalCreators != null ? String(m.totalCreators) : "",
          adsSold: m.adsSold != null ? String(m.adsSold) : "",
          adImpressions: m.adImpressions != null ? String(m.adImpressions) : "",
          adRevenueUsd: m.adRevenueUsd ?? "",
          cpmUsd: m.cpmUsd ?? "",
          platformRevenueUsd: m.platformRevenueUsd ?? "",
          creatorsPaidOutUsd: m.creatorsPaidOutUsd ?? "",
          source: (m.source as "manual" | "api" | "mixed") ?? "manual",
          notes: m.notes ?? "",
        });
      }
    } catch {
      toast({ title: "Ошибка загрузки метрик", variant: "destructive" });
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  const saveMetrics = async () => {
    setSavingMetrics(true);
    try {
      const toInt = (v: string) => v !== "" ? parseInt(v) : null;
      const toStr = (v: string) => v !== "" ? v : null;
      await api.adminSavePlatformMetrics({
        dau: toInt(metricsForm.dau),
        mau: toInt(metricsForm.mau),
        wau: toInt(metricsForm.wau),
        totalUsers: toInt(metricsForm.totalUsers),
        newUsersMonth: toInt(metricsForm.newUsersMonth),
        totalVideos: toInt(metricsForm.totalVideos),
        newVideosMonth: toInt(metricsForm.newVideosMonth),
        totalCreators: toInt(metricsForm.totalCreators),
        adsSold: toInt(metricsForm.adsSold),
        adImpressions: toInt(metricsForm.adImpressions),
        adRevenueUsd: toStr(metricsForm.adRevenueUsd),
        cpmUsd: toStr(metricsForm.cpmUsd),
        platformRevenueUsd: toStr(metricsForm.platformRevenueUsd),
        creatorsPaidOutUsd: toStr(metricsForm.creatorsPaidOutUsd),
        source: metricsForm.source,
        notes: toStr(metricsForm.notes),
      });
      toast({ title: "✅ Метрики сохранены", description: "Снапшот опубликован для инвесторов" });
      loadMetrics();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setSavingMetrics(false);
    }
  };

  useEffect(() => { if (user?.isAdmin) load(); }, [user]);
  useEffect(() => { if (user?.isAdmin && adminTab === "metrics") loadMetrics(); }, [user, adminTab]);

  const confirm = async (id: number) => {
    setConfirming(id);
    try {
      await api.adminConfirm(id, txHashes[id] || undefined);
      toast({ title: "✅ Подтверждено", description: "MLM-бонусы начислены по всей цепочке" });
      load();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setConfirming(null);
    }
  };

  const reject = async (id: number) => {
    setRejecting(id);
    try {
      await api.adminReject(id);
      toast({ title: "Инвестиция отклонена" });
      load();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setRejecting(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RefreshCw className="w-7 h-7 text-primary animate-spin" />
    </div>
  );

  const pending = investments.filter(i => i.status === "pending");
  const confirmed = investments.filter(i => i.status === "confirmed");
  const rejected = investments.filter(i => i.status === "rejected");

  const totalConfirmed = confirmed.reduce((s, i) => s + parseFloat(i.amount), 0);
  const totalPending = pending.reduce((s, i) => s + parseFloat(i.amount), 0);

  const filtered = investments
    .filter(i => tab === "all" ? true : i.status === tab)
    .filter(i => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        String(i.userId).includes(q) ||
        i.packageName.toLowerCase().includes(q) ||
        (i.txHash ?? "").toLowerCase().includes(q) ||
        (i.walletFrom ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/8 bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-black text-lg leading-tight">Admin Panel</div>
              <div className="text-xs text-white/40">Trends Investment</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={fetching}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <RefreshCw className={`w-4 h-4 text-white/50 ${fetching ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => logout().then(() => setLocation("/"))}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <LogOut className="w-4 h-4 text-white/50" />
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Admin tab switcher */}
        <div className="flex gap-1 p-1 bg-white/4 rounded-xl border border-white/8 w-fit">
          <button onClick={() => setAdminTab("investments")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${adminTab === "investments" ? "bg-primary/20 text-primary" : "text-white/40 hover:text-white/70"}`}>
            <DollarSign className="w-4 h-4" /> Инвестиции
          </button>
          <button onClick={() => setAdminTab("metrics")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${adminTab === "metrics" ? "bg-primary/20 text-primary" : "text-white/40 hover:text-white/70"}`}>
            <BarChart3 className="w-4 h-4" /> Метрики платформы
            {metricsHistory.length > 0 && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-md">обновлено</span>}
          </button>
        </div>

        {adminTab === "investments" && <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Ожидают" value={String(pending.length)}
            sub={`$${totalPending.toLocaleString()}`} color="border-yellow-500/20" />
          <StatCard label="Подтверждено" value={String(confirmed.length)}
            sub={`$${totalConfirmed.toLocaleString()}`} color="border-green-500/20" />
          <StatCard label="Отклонено" value={String(rejected.length)}
            sub="инвестиций" color="border-red-500/20" />
          <StatCard label="Всего" value={String(investments.length)}
            sub={`$${(totalConfirmed + totalPending).toLocaleString()} совокупно`} color="border-white/10" />
        </div>

        {/* Alert if pending */}
        {pending.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/8">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
            <span className="text-sm font-medium text-yellow-300">
              {pending.length} {pending.length === 1 ? "инвестиция ожидает" : "инвестиции ожидают"} подтверждения на сумму <strong>${totalPending.toLocaleString()}</strong>
            </span>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 p-1 bg-white/4 rounded-xl border border-white/8">
            {(["pending", "confirmed", "rejected", "all"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === t ? "bg-primary/20 text-primary" : "text-white/40 hover:text-white/70"}`}>
                {t === "pending" ? `Ожидает (${pending.length})` :
                  t === "confirmed" ? `Подтверждено (${confirmed.length})` :
                    t === "rejected" ? `Отклонено (${rejected.length})` : "Все"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по ID, пакету, txHash…"
              className="pl-9 bg-white/4 border-white/10 h-9 text-sm" />
          </div>
        </div>

        {/* Table */}
        <div className="space-y-2">
          {fetching && filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />Загрузка…
            </div>
          )}
          {!fetching && filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">Нет инвестиций</div>
          )}

          <AnimatePresence>
            {filtered.map(inv => {
              const isExpanded = expandedId === inv.id;
              const isPending = inv.status === "pending";
              return (
                <motion.div key={inv.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`rounded-2xl border transition-colors ${
                    isPending ? "border-yellow-500/20 bg-yellow-500/4" :
                    inv.status === "confirmed" ? "border-green-500/10 bg-white/2" :
                    "border-red-500/10 bg-white/2"
                  }`}>

                  {/* Row */}
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-5">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </button>
                      <div className="min-w-0">
                        <div className="font-bold flex items-center gap-2 flex-wrap">
                          <span>#{inv.id}</span>
                          <span className="text-primary">{inv.packageName}</span>
                          <span className="text-white/40">—</span>
                          <span className="text-white font-black">${parseFloat(inv.amount).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-white/40 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>User #{inv.userId}</span>
                          <span>·</span>
                          <span>{new Date(inv.createdAt).toLocaleString("ru")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-10 md:ml-0">
                      <StatusBadge status={inv.status} />

                      {isPending && (
                        <>
                          <Input
                            placeholder="TxHash"
                            value={txHashes[inv.id] ?? inv.txHash ?? ""}
                            onChange={e => setTxHashes(p => ({ ...p, [inv.id]: e.target.value }))}
                            className="w-44 bg-background/60 border-white/10 h-8 text-xs font-mono hidden sm:block"
                          />
                          <Button size="sm" onClick={() => confirm(inv.id)} disabled={confirming === inv.id || rejecting === inv.id}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl h-8 px-3 font-bold text-xs shrink-0">
                            {confirming === inv.id
                              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              : <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Подтвердить</>}
                          </Button>
                          <Button size="sm" onClick={() => reject(inv.id)} disabled={confirming === inv.id || rejecting === inv.id}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl h-8 px-3 font-bold text-xs shrink-0">
                            {rejecting === inv.id
                              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              : <><XCircle className="w-3.5 h-3.5 mr-1" />Отклонить</>}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/8">
                        <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
                          {isPending && (
                            <div className="sm:col-span-2">
                              <label className="text-xs text-white/40 mb-1.5 block">TxHash (ввести перед подтверждением)</label>
                              <Input
                                placeholder="0x… или хеш TON-транзакции"
                                value={txHashes[inv.id] ?? inv.txHash ?? ""}
                                onChange={e => setTxHashes(p => ({ ...p, [inv.id]: e.target.value }))}
                                className="bg-background/60 border-white/10 text-xs font-mono"
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-white/40 mb-1">Кошелёк отправителя</div>
                            <div className="font-mono text-xs text-white/70 break-all flex items-start gap-1">
                              <span>{inv.walletFrom ?? "—"}</span>
                              {inv.walletFrom && (
                                <a href={`https://tonviewer.com/${inv.walletFrom}`} target="_blank" rel="noreferrer"
                                  className="text-primary hover:text-primary/80 shrink-0 mt-0.5">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40 mb-1">TxHash</div>
                            <div className="font-mono text-xs text-white/70 flex items-center gap-1 break-all">
                              {inv.txHash ?? "—"}
                              {inv.txHash && (
                                <a href={`https://tonscan.org/tx/${inv.txHash}`} target="_blank" rel="noreferrer"
                                  className="text-primary hover:text-primary/80 shrink-0">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40 mb-1">Пакет ID</div>
                            <div className="text-xs font-mono text-white/70">{inv.packageId}</div>
                          </div>
                          <div>
                            <div className="text-xs text-white/40 mb-1">Доля (shares)</div>
                            <div className="text-xs font-mono text-white/70">{inv.shares}</div>
                          </div>
                          {inv.confirmedAt && (
                            <div>
                              <div className="text-xs text-white/40 mb-1">Подтверждено</div>
                              <div className="text-xs text-white/70">{new Date(inv.confirmedAt).toLocaleString("ru")}</div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        </>}

        {/* ─── METRICS TAB ─── */}
        {adminTab === "metrics" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black text-lg">Метрики платформы</div>
                <div className="text-xs text-white/40 mt-0.5">Каждое сохранение создаёт новый снапшот — инвесторы видят последний</div>
              </div>
              <button onClick={loadMetrics} disabled={loadingMetrics}
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                <RefreshCw className={`w-4 h-4 text-white/50 ${loadingMetrics ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Audience */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Аудитория</div>
                {[
                  { key: "dau", label: "DAU (ежедневная аудитория)" },
                  { key: "mau", label: "MAU (ежемесячная)" },
                  { key: "wau", label: "WAU (еженедельная)" },
                  { key: "totalUsers", label: "Всего пользователей" },
                  { key: "newUsersMonth", label: "Новых за месяц" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <Input
                      type="number" min="0" placeholder="—"
                      value={(metricsForm as any)[f.key]}
                      onChange={e => setMetricsForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-white/4 border-white/10 h-9 text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Контент</div>
                {[
                  { key: "totalVideos", label: "Всего видео" },
                  { key: "newVideosMonth", label: "Новых видео за месяц" },
                  { key: "totalCreators", label: "Создателей" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <Input
                      type="number" min="0" placeholder="—"
                      value={(metricsForm as any)[f.key]}
                      onChange={e => setMetricsForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-white/4 border-white/10 h-9 text-sm"
                    />
                  </div>
                ))}

                <div className="text-xs font-bold text-white/50 uppercase tracking-widest pt-3">Реклама</div>
                {[
                  { key: "adsSold", label: "Продано рекламных слотов" },
                  { key: "adImpressions", label: "Всего рекламных показов" },
                  { key: "adRevenueUsd", label: "Выручка от рекламы ($)" },
                  { key: "cpmUsd", label: "CPM ($)" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <Input
                      type="number" min="0" placeholder="—"
                      value={(metricsForm as any)[f.key]}
                      onChange={e => setMetricsForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-white/4 border-white/10 h-9 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Financials + meta */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-3">
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Финансы платформы</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: "platformRevenueUsd", label: "Общая выручка ($)" },
                  { key: "creatorsPaidOutUsd", label: "Выплачено создателям ($)" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <Input
                      type="number" min="0" placeholder="—"
                      value={(metricsForm as any)[f.key]}
                      onChange={e => setMetricsForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-white/4 border-white/10 h-9 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Источник данных</label>
                  <select value={metricsForm.source} onChange={e => setMetricsForm(p => ({ ...p, source: e.target.value as any }))}
                    className="w-full h-9 px-3 rounded-xl bg-white/4 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/40">
                    <option value="manual">вручную</option>
                    <option value="api">live API</option>
                    <option value="mixed">комбинация</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Комментарий для инвесторов</label>
                  <Input
                    placeholder="Опционально…"
                    value={metricsForm.notes}
                    onChange={e => setMetricsForm(p => ({ ...p, notes: e.target.value }))}
                    className="bg-white/4 border-white/10 h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <Button onClick={saveMetrics} disabled={savingMetrics} className="btn-grad font-bold rounded-xl h-11 px-8">
              {savingMetrics ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Сохраняю…</> : <><Save className="w-4 h-4 mr-2" />Опубликовать снапшот</>}
            </Button>

            {/* History */}
            {metricsHistory.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <History className="w-3.5 h-3.5" /> История снапшотов ({metricsHistory.length})
                </div>
                <div className="space-y-2">
                  {metricsHistory.map((m, i) => (
                    <div key={m.id} className={`flex items-center justify-between text-xs p-3 rounded-xl ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-white/3 border border-white/8"}`}>
                      <div className="flex items-center gap-3">
                        {i === 0 && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-md font-bold">текущий</span>}
                        <span className="text-white/50">{new Date(m.recordedAt).toLocaleString("ru")}</span>
                      </div>
                      <div className="flex gap-4 text-white/40">
                        {m.dau != null && <span>DAU {m.dau.toLocaleString("ru")}</span>}
                        {m.mau != null && <span>MAU {m.mau.toLocaleString("ru")}</span>}
                        <span className="text-white/20">{m.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
