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
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
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
  const { open: openTon, state: tonState } = useTonConnectModal();
  const [tonUI]             = useTonConnectUI();

  const [step, setStep]         = useState(1);
  const [selectedId, setId]     = useState(defaultPackage);
  const [walletFrom, setWallet] = useState("");
  const [submitting, setSub]    = useState(false);
  const [payClicked, setPayClicked] = useState(false);
  const [paying, setPaying]     = useState(false);
  const [pendingInvId, setPendingInvId] = useState<number | null>(null);
  const [pollTimeout, setPollTimeout]   = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1); setId(defaultPackage); setWallet(""); setSub(false);
      setPayClicked(false); setPaying(false); setPendingInvId(null); setPollTimeout(false);
    }
  }, [isOpen, defaultPackage]);

  useEffect(() => {
    if (pendingInvId === null) return;
    let tries = 0;
    const MAX_TRIES = 60;
    const timer = setInterval(async () => {
      tries++;
      try {
        const { status } = await api.checkInvestment(pendingInvId);
        if (status === "confirmed") {
          clearInterval(timer);
          setStep(3);
        } else if (tries >= MAX_TRIES) {
          clearInterval(timer);
          setPollTimeout(true);
        }
      } catch {
        if (tries >= MAX_TRIES) { clearInterval(timer); setPollTimeout(true); }
      }
    }, 10_000);
    return () => clearInterval(timer);
  }, [pendingInvId]);

  useEffect(() => { if (connectedAddress) setWallet(connectedAddress); }, [connectedAddress]);

  const pkg    = PACKAGES.find(p => p.id === selectedId)!;
  const ui     = PACKAGE_UI[selectedId];
  const PkgIcon = ICONS[ui.iconName];

  const tonkeeperLink  = buildLink("https://app.tonkeeper.com/transfer", pkg.price, `Trends ${pkg.name}`);
  const mytonwallet   = buildLink("https://mytonwallet.io/transfer",    pkg.price, `Trends ${pkg.name}`);

  const handleWalletPay = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setPayClicked(true);
  };

  const handleTonConnectPay = async () => {
    if (!connectedAddress || !tonUI) return;
    if (!user) { onClose(); setLocation("/login"); return; }
    setPaying(true);
    try {
      const { TonClient, JettonMaster } = await import("@ton/ton");
      const { Address, beginCell, toNano } = await import("@ton/core");

      const client = new TonClient({ endpoint: "https://toncenter.com/api/v2/jsonRPC" });
      const master = client.open(JettonMaster.create(Address.parse(USDT_MASTER)));
      const jettonWalletAddr = await master.getWalletAddress(Address.parse(connectedAddress));

      const jettonAmount = BigInt(pkg.price * 1_000_000);

      const forwardPayload = beginCell()
        .storeUint(0, 32)
        .storeStringTail(`Trends ${pkg.name}`)
        .endCell();

      const body = beginCell()
        .storeUint(0xf8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(jettonAmount)
        .storeAddress(Address.parse(PAYMENT_WALLET))
        .storeAddress(Address.parse(connectedAddress))
        .storeBit(0)
        .storeCoins(toNano("0.05"))
        .storeBit(1)
        .storeRef(forwardPayload)
        .endCell();

      const result = await tonUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [{
          address: jettonWalletAddr.toString(),
          amount: toNano("0.15").toString(),
          payload: Buffer.from(body.toBoc()).toString("base64"),
        }],
      });

      const txHash = (result as any)?.boc ?? undefined;

      const { investment } = await api.createInvestment({
        packageId: selectedId,
        walletFrom: connectedAddress,
        txHash: typeof txHash === "string" ? txHash : undefined,
      });

      setPendingInvId(investment.id);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (/reject|cancel|decline|user/i.test(msg)) {
        toast({ title: "Транзакция отменена", variant: "destructive" });
      } else {
        toast({ title: "Ошибка при отправке", description: msg || "Попробуйте ещё раз", variant: "destructive" });
      }
    } finally {
      setPaying(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) { onClose(); setLocation("/login"); return; }
    setSub(true);
    try {
      await api.createInvestment({ packageId: selectedId, walletFrom: walletFrom || connectedAddress || undefined });
      setStep(3);
    } catch (err: any) {
      const msg: string = err.message ?? "Ошибка";
      const isDuplicate = msg.includes("уже есть") || msg.includes("500") || msg.toLowerCase().includes("internal");
      if (isDuplicate) {
        toast({
          title: "Заявка уже создана",
          description: `У вас уже есть ожидающая инвестиция «${pkg.name}». Перейдите в кабинет — она там отображается.`,
          variant: "destructive",
        });
      } else {
        toast({ title: msg, variant: "destructive" });
      }
    } finally { setSub(false); }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && tonState.status === "opened") return;
        if (!open) onClose();
      }}
      modal={false}
    >
      <DialogContent
        overlay={false}
        className="w-full max-w-[700px] bg-card border-card-border text-card-foreground flex flex-col p-0 rounded-none sm:rounded-2xl h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-hidden top-0 left-0 translate-x-0 translate-y-0 sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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

              {/* Layout: mobile = column, desktop = row */}
              <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">

                {/* Mobile: горизонтальный скролл / Desktop: вертикальная панель */}
                <div className="md:w-[210px] shrink-0 md:border-r border-white/8 md:overflow-y-auto">
                  {/* Desktop list */}
                  <div className="hidden md:block py-2 px-2">
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
                  {/* Mobile: горизонтальный скролл-ряд */}
                  <div className="md:hidden flex gap-2 overflow-x-auto px-3 py-2.5 border-b border-white/8 scrollbar-none">
                    {PACKAGES.map(p => {
                      const pui = PACKAGE_UI[p.id];
                      const PIco = ICONS[pui.iconName];
                      const active = selectedId === p.id;
                      return (
                        <button key={p.id} onClick={() => setId(p.id)}
                          className={`flex-none flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                            active ? `${pui.border} bg-white/10` : "border-white/10 bg-white/3"
                          }`}
                        >
                          <PIco className={`w-3.5 h-3.5 shrink-0 ${pui.color}`} />
                          <div className="text-left">
                            <div className={`text-xs font-bold whitespace-nowrap ${active ? pui.color : ""}`}>
                              {p.name}
                              {p.recommended && (
                                <span className="ml-1 text-[8px] bg-primary/20 text-primary px-1 py-0.5 rounded-full">ХИТ</span>
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">${p.price.toLocaleString()}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Детали пакета */}
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
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
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

          {/* ── Шаг 2: оплата + подтверждение (объединено) ── */}
          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="p-6 space-y-4 overflow-y-auto"
            >
              {!pendingInvId && (
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Назад
                </button>
              )}
              <h2 className="text-2xl font-bold text-center">Оплата</h2>

              {/* Сумма */}
              <div className={`text-center rounded-2xl p-4 border ${ui.border} bg-white/4`}>
                <div className={`text-4xl font-black ${ui.color}`}>${pkg.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Пакет «{pkg.name}» · USDT (TON)</div>
                <div className="mt-1.5 text-xs text-green-400/80">
                  RevShare при: <span className="font-black text-green-400">${fmtUsd(pkg.dau50m)}/мес</span>
                </div>
              </div>

              {/* ── Экран ожидания подтверждения блокчейна ── */}
              {pendingInvId ? (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 py-2"
                >
                  {pollTimeout ? (
                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/8 p-4 text-center space-y-2">
                      <div className="text-2xl">⏳</div>
                      <div className="font-bold text-yellow-400">Транзакция ещё обрабатывается</div>
                      <div className="text-xs text-muted-foreground">
                        Блокчейн может занять больше времени. Ваша заявка сохранена — мы подтвердим её вручную в течение 24 часов.
                      </div>
                      <button onClick={() => setStep(3)} className="mt-2 text-xs text-primary hover:underline">
                        Перейти к заявке →
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-primary/30 bg-primary/8 p-6 text-center space-y-4">
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-primary/60" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-base text-primary">Транзакция отправлена</div>
                        <div className="text-sm text-muted-foreground mt-1">Ожидаем подтверждения в блокчейне TON…</div>
                        <div className="text-xs text-muted-foreground/60 mt-2">Обычно 10–60 секунд · Проверяем каждые 10 сек</div>
                      </div>
                    </div>
                  )}
                  <div className={`text-center rounded-xl p-3 border ${ui.border} bg-white/3`}>
                    <div className="text-xs text-muted-foreground">Заявка #{pendingInvId} · ${pkg.price.toLocaleString()} USDT</div>
                    <div className="text-xs text-muted-foreground/60 mt-0.5">Пакет «{pkg.name}»</div>
                  </div>
                </motion.div>
              ) : !payClicked ? (
                <div className="space-y-3">

                  {/* ── Wallet Connect ── */}
                  {connectedAddress ? (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/8 p-3 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-green-400">Кошелёк подключён</div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {connectedAddress.slice(0, 6)}…{connectedAddress.slice(-6)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => tonUI.disconnect()}
                          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors border border-white/10 px-2 py-1 rounded-lg"
                        >
                          Отключить
                        </button>
                      </div>
                      <button
                        onClick={handleTonConnectPay}
                        disabled={paying}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 transition-all font-bold text-sm text-green-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {paying
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Wallet className="w-4 h-4" />
                        }
                        {paying ? "Подписание транзакции…" : `Оплатить $${pkg.price.toLocaleString()} USDT`}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openTon()}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-primary/40 bg-primary/8 hover:border-primary/70 hover:bg-primary/12 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-primary">Подключить TON кошелёк</div>
                        <div className="text-xs text-muted-foreground">Telegram Wallet, TonKeeper и другие</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                    </button>
                  )}

                  {/* ── Divider ── */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">или открыть приложение</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  {/* ── Внешние приложения ── */}
                  <button onClick={() => handleWalletPay(tonkeeperLink)}
                    className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-white/10 hover:border-[#0098EA]/50 hover:bg-[#0098EA]/5 transition-all text-left">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0098EA] to-[#006BB5] flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">TonKeeper</div>
                      <div className="text-xs text-muted-foreground">Сумма и адрес заполнятся автоматически</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <button onClick={() => handleWalletPay(mytonwallet)}
                    className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-white/10 hover:border-[#7B5EFF]/50 hover:bg-[#7B5EFF]/5 transition-all text-left">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7B5EFF] to-[#5B3FDF] flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">MyTonWallet</div>
                      <div className="text-xs text-muted-foreground">Сумма и адрес заполнятся автоматически</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                /* Шаг 2 инструкции: подтвердить после оплаты */
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div className="text-sm">
                      <div className="font-semibold text-primary">Кошелёк открыт</div>
                      <div className="text-xs text-muted-foreground">Завершите перевод в приложении, затем вернитесь сюда</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-black shrink-0">2</span>
                    Ваш TON-адрес (необязательно):
                  </div>

                  <Input placeholder="UQ... или EQ..."
                    value={walletFrom} onChange={e => setWallet(e.target.value)}
                    className="bg-background/50 border-white/10 h-11 font-mono text-xs" />
                  <p className="text-xs text-muted-foreground -mt-2">Поможет быстрее найти вашу транзакцию</p>

                  <Button
                    className="w-full btn-grad btn-3d font-bold rounded-xl h-12 text-base"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : "✓ Я оплатил — отправить заявку"}
                  </Button>

                  <button
                    onClick={() => setPayClicked(false)}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Вернуться к выбору кошелька
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── Шаг 3: успех ── */}
          {step === 3 && (
            <motion.div key="step3"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-6 space-y-5 text-center py-8 overflow-y-auto"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-gradient">Заявка принята!</h2>
              <p className="text-muted-foreground">
                Пакет <strong>«{pkg.name}»</strong> ожидает подтверждения. Мы проверим перевод и активируем пакет в течение 24 часов.
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
