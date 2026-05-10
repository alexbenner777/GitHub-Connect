import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { api, type Investment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [txHashes, setTxHashes] = useState<Record<number, string>>({});
  const [confirming, setConfirming] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) setLocation("/");
  }, [loading, user]);

  const load = async () => {
    setFetching(true);
    try {
      const data = await api.adminGetInvestments();
      setInvestments(data.investments);
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { if (user?.isAdmin) load(); }, [user]);

  const confirm = async (id: number) => {
    setConfirming(id);
    try {
      await api.adminConfirm(id, txHashes[id]);
      toast({ title: "Инвестиция подтверждена! MLM бонусы начислены." });
      load();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setConfirming(null);
    }
  };

  if (loading || fetching) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RefreshCw className="w-7 h-7 text-primary animate-spin" />
    </div>
  );

  const pending = investments.filter(i => i.status === "pending");
  const confirmed = investments.filter(i => i.status === "confirmed");

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">Admin Panel</h1>
          <div className="flex gap-4 text-sm">
            <span className="text-yellow-400 font-bold">{pending.length} ожидают</span>
            <span className="text-green-400 font-bold">{confirmed.length} подтверждено</span>
            <button onClick={load} className="text-muted-foreground hover:text-primary">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {pending.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Ожидают подтверждения</h2>
            <div className="space-y-3">
              {pending.map(inv => (
                <motion.div key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-card p-5 rounded-2xl border border-yellow-500/20">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-lg">{inv.packageName} — <span className="text-primary">${parseFloat(inv.amount).toLocaleString()}</span></div>
                      <div className="text-sm text-muted-foreground">Пользователь ID: {inv.userId}</div>
                      <div className="text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleString("ru")}</div>
                      {inv.walletFrom && <div className="text-xs font-mono text-muted-foreground">Кошелёк отправителя: {inv.walletFrom}</div>}
                    </div>
                    <div className="flex gap-2 items-center w-full md:w-auto">
                      <Input placeholder="TxHash (необязательно)" value={txHashes[inv.id] ?? ""}
                        onChange={e => setTxHashes(p => ({ ...p, [inv.id]: e.target.value }))}
                        className="bg-background/50 border-white/10 h-10 text-sm font-mono" />
                      <Button onClick={() => confirm(inv.id)} disabled={confirming === inv.id}
                        className="btn-grad font-bold rounded-xl h-10 px-4 shrink-0">
                        {confirming === inv.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1" />Подтвердить</>}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4 text-green-400">Подтверждённые инвестиции</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-muted-foreground">
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Пакет</th>
                  <th className="text-left p-4 font-medium">Сумма</th>
                  <th className="text-left p-4 font-medium">Дата</th>
                  <th className="text-left p-4 font-medium">TxHash</th>
                </tr>
              </thead>
              <tbody>
                {confirmed.map(inv => (
                  <tr key={inv.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                    <td className="p-4 text-muted-foreground">#{inv.id}</td>
                    <td className="p-4 font-medium">{inv.packageName}</td>
                    <td className="p-4 text-primary font-bold">${parseFloat(inv.amount).toLocaleString()}</td>
                    <td className="p-4 text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString("ru")}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{inv.txHash ?? "—"}</td>
                  </tr>
                ))}
                {confirmed.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Нет подтверждённых инвестиций</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
