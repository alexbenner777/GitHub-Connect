import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2, Loader2, ArrowLeft, Wallet, ExternalLink,
  Smartphone, ChevronRight, Users, Star, Shield, Crown, TrendingUp, Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import { PACKAGES, PACKAGE_UI, CATEGORY_ICON } from "@/lib/packages";

// ─── иконки по имени ────────────────────────────────────────────
const ICONS = { Star, Shield, Crown, TrendingUp, Zap } as const;

// ─── для обратной совместимости с Cabinet / другими местами ─────
export { PACKAGES };
export const MONTHLY_PROFIT: Record<string, number> = {
  founder1: 4, founder2: 15, founder3: 74, founder4: 371, founder5: 1484,
};

// ─── helpers ─────────────────────────────────────────────────────
const PAYMENT_WALLET = "UQCG4jJ5BHZhV0qAOwYxMNemhgcdtMBJv5cDXs0O5K3LNAgt";
const USDT_MASTER   = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

function buildLink(base: string, amount: number, comment: string) {
  const params = new URLSearchParams({
    jetton: USDT_MASTER,
    amount: String(amount * 1_000_000),
    text: comment,
  });
  return `${base}/${PAYMENT_WALLET}?${params}`;
}

function fmtUsd(n: number) { return n.toLocaleString("ru-RU"); }

// ════════════════════════════════════════════════════════════════
export function InvestmentModal({
  isOpen, onClose, defaultPackage = "founder3",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}) {
  const { user }            = useAuth();
  const [, setLocation]     = useLocation();
  const { toast }           = useToast();
  const connectedAddress    = useTonAddress();
  const { open: openTon }   = useTonConnectModal();

  const [step, setStep]         = useState(1);
  const [selectedId, setId]     = useState(defaultPackage);
  const [walletFrom, setWallet] = useState("");
  const [submitting, setSub]    = useState(false);

  useEffect(() => {
    if (isOpen) { setStep(1); setId(defaultPackage); setWallet(""); setSub(false); }
  }, [isOpen, defaultPackage]);

  useEffect(() => { if (connectedAddress) setWallet(connectedAddress); }, [connectedAddress]);

  const pkg    = PACKAGES.find(p => p.id === selectedId)!;
  const ui     = PACKAGE_UI[selectedId];
  const PkgIcon = ICONS[ui.iconName];

  const tonkeeperLink = buildLink("https://app.tonkeeper.com/transfer", pkg.price, `Trends ${pkg.name}`);
  const tonspaceLink  = buildLink("https://tonspace.co/transfer",       pkg.price, `Trends ${pkg.name}`);

  const handleWalletPay = (url: string) => { window.open(url, "_blank"); setTimeout(() => setStep(3), 1500); };

  const handleSubmit = async () => {
    if (!user) { onClose(); setLocation("/login"); return; }
    setSub(true);
    try {
      await api.createInvestment({ packageId: selectedId, walletFrom: walletFrom || connectedAddress || undefined });
      setStep(4);
    } catch (err: any) {
      toast({ title: err.message ?? "Ошибка", variant: "destructive" });
    } finally { setSub(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[700px] bg-card border-card-border text-card-foreground max-h-[92vh] overflow-hidden flex flex-col p-0">
        <DialogTitle className="sr-only">Инвестировать в Trends</DialogTitle>

        <AnimatePresence mode="wait">

          {/* ── Шаг 1: выбор пакета ── */}
          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Заголовок */}
              <div className="px-6 pt-5 pb-3 border-b border-white/8 shrink-0">
                <h2 className="text-xl font-black text-center">Выберите пакет инвестора</h2>
                <p className="text-center text-xs text-muted-foreground mt-0.5">
                  Нажмите на пакет — раскроются все условия
                </p>
              </div>

              {/* Двухколоночный layout */}
              <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

                {/* Левая панель — список пакетов */}
                <div className="md:w-[210px] shrink-0 border-b md:border-b-0 md:border-r border-white/8 overflow-y-auto py-2 px-2">
                  {PACKAGES.map(p => {
                    const pui = PACKAGE_UI[p.id];
                    const PIco = ICONS[pui.iconName];
                    const active = selectedId === p.id;
                    return (
                      <button key={p.id} onClick={() => setId(p.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all border mb-1 ${
                          active ? `${pui.border} bg-white/8` : "border-transparent hover:border-white/10 hover:bg-white/4"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <PIco className={`w-4 h-4 shrink-0 ${pui.color}`} />
                            <div className="min-w-0">
                              <div className={`text-sm font-bold truncate ${active ? pui.color : ""}`}>
                                {p.name}
                                {p.recommended && (
                                  <span className="ml-1 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">ХИТ</span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">${p.price.toLocaleString()}</div>
                            </div>
                          </div>
                          {active && <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${pui.color}`} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Правая панель — детали пакета */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div key={selectedId}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="p-5 space-y-4"
                    >
                      {/* Шапка пакета */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <PkgIcon className={`w-5 h-5 ${ui.color}`} />
                            <h3 className={`text-xl font-black ${ui.color}`}>{pkg.name}</h3>
                            {pkg.recommended && (
                              <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">★ РЕКОМЕНДУЕМ</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{pkg.tagline}</p>
                          <div className="text-2xl font-black">${pkg.price.toLocaleString()}</div>
                          <div className="text-[11px] text-muted-foreground">единовременная инвестиция · USDT</div>
                        </div>
                        <div className={`text-right shrink-0 px-3 py-2 rounded-xl border ${ui.border} bg-white/4`}>
                          <div className="text-[10px] text-muted-foreground">Badge</div>
                          <div className={`text-xs font-bold ${ui.color}`}>«{pkg.badge}»</div>
                        </div>
                      </div>

                      {/* DAU 50M потенциал */}
                      <div className="rounded-xl border border-green-500/25 bg-green-500/8 p-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] text-green-400/70">RevShare при</div>
                          <div className="text-lg font-black text-green-400">
                            ${fmtUsd(pkg.dau50m)}<span className="text-xs font-normal text-green-400/70">/мес</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-muted-foreground">RevShare доля</div>
                          <div className={`text-sm font-black ${ui.color}`}>{pkg.shares}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Exit: ${pkg.exit}</div>
                        </div>
                      </div>

                      {/* Категории преимуществ */}
                      <div className="space-y-3">
                        {pkg.categories.map(cat => (
                          <div key={cat.id}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                {cat.title}
                              </span>
                            </div>
                            <ul className="space-y-1 pl-1">
                              {cat.items.map((item, i) => {
                                const emoji = item.match(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{1F900}-\u{1FAFF}]/u)?.[0];
                                const text = emoji ? item.slice(emoji.length).replace(/^[\uFE0F\u20E3]?\s*/, "") : item;
                                return (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-sm leading-none mt-0.5 shrink-0">{emoji ?? "•"}</span>
                                    <span className="text-xs text-muted-foreground leading-relaxed">{text}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA */}
              <div className="p-4 border-t border-white/8 shrink-0">
                <Button
                  className="w-full btn-grad btn-3d font-bold rounded-xl h-12 text-base"
                  onClick={() => setStep(2)}
                >
                  Инвестировать ${pkg.price.toLocaleString()} →
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Шаг 2: оплата ── */}
          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <h2 className="text-2xl font-bold text-center">Оплата</h2>

              <div className={`text-center rounded-2xl p-4 border ${ui.border} bg-white/4`}>
                <div className={`text-4xl font-black ${ui.color}`}>${pkg.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Пакет «{pkg.name}» · USDT (TON)</div>
                <div className="mt-2 text-xs text-green-400/80">
                  RevShare при: <span className="font-black text-green-400">${fmtUsd(pkg.dau50m)}/мес</span>
                </div>
              </div>

              {connectedAddress ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-green-400 font-semibold">Кошелёк подключён</div>
                    <div className="text-xs font-mono text-muted-foreground truncate">{connectedAddress}</div>
                  </div>
                </div>
              ) : (
                <button onClick={() => openTon()}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <Wallet className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Подключить кошелёк</div>
                    <div className="text-xs text-muted-foreground">Адрес заполнится автоматически</div>
                  </div>
                </button>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-center">Выберите кошелёк для оплаты:</p>
                <button onClick={() => handleWalletPay(tonkeeperLink)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0098EA] to-[#006BB5] flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">TonKeeper</div>
                    <div className="text-xs text-muted-foreground">Откроется с предзаполненным платежом</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>

                <button onClick={() => handleWalletPay(tonspaceLink)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B5EFF] to-[#5B3FDF] flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">TonSpace</div>
                    <div className="text-xs text-muted-foreground">Откроется с предзаполненным платежом</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Шаг 3: подтверждение ── */}
          {step === 3 && (
            <motion.div key="step3"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="p-6 space-y-5 overflow-y-auto"
            >
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <h2 className="text-2xl font-bold text-center">Подтверждение</h2>

              <div className="rounded-2xl p-5 space-y-3 border border-white/10 bg-white/4 text-sm">
                {[
                  ["Пакет",        `«${pkg.name}»`],
                  ["Сумма",        `$${pkg.price.toLocaleString()} USDT`],
                  ["RevShare доля",`${pkg.shares}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-bold">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/8 pt-3">
                  <span className="text-muted-foreground">RevShare при:</span>
                  <span className="font-black text-green-400">${fmtUsd(pkg.dau50m)}/мес</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Ваш TON-адрес (необязательно)</label>
                <Input placeholder="UQ... или EQ..."
                  value={walletFrom} onChange={e => setWallet(e.target.value)}
                  className="bg-background/50 border-white/10 h-11 font-mono text-xs" />
                <p className="text-xs text-muted-foreground mt-1">Поможет нам найти вашу транзакцию быстрее</p>
              </div>

              {!user && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-300">
                  Для отслеживания инвестиции войдите в аккаунт.
                </div>
              )}

              <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить заявку"}
              </Button>
            </motion.div>
          )}

          {/* ── Шаг 4: успех ── */}
          {step === 4 && (
            <motion.div key="step4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-6 space-y-5 text-center py-8 overflow-y-auto"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-gradient">Заявка принята!</h2>
              <p className="text-muted-foreground">
                Пакет <strong>«{pkg.name}»</strong> активирован. Инвестиция подтверждена, MLM-бонусы начисляются.
              </p>
              <div className="rounded-xl border border-green-500/20 bg-green-500/8 p-4">
                <div className="text-xs text-green-400/70 mb-1">RevShare при</div>
                <div className="text-2xl font-black text-green-400">
                  ${fmtUsd(pkg.dau50m)}<span className="text-base font-normal">/мес</span>
                </div>
              </div>
              <a href={`https://tonviewer.com/${PAYMENT_WALLET}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline">
                <ExternalLink className="w-4 h-4" /> Посмотреть в TON Explorer
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full btn-grad font-bold rounded-xl" onClick={() => { onClose(); setLocation("/cabinet"); }}>
                  Перейти в кабинет
                </Button>
                <Button variant="ghost" className="w-full" onClick={onClose}>Закрыть</Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
