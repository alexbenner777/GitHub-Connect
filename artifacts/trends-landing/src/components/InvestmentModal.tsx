import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, ArrowLeft, Wallet, ExternalLink, Smartphone } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";

export const PACKAGES = [
  { id: "founder1", name: "Основателей 1", price: 100, monthly: 1, shares: 0.25, exit: "–" },
  { id: "founder2", name: "Основателей 2", price: 250, monthly: 4, shares: 0.63, exit: "1,300–3,000" },
  { id: "founder3", name: "Основателей 3", price: 1000, monthly: 15, shares: 2.5, exit: "5,000–12,000", recommended: true },
  { id: "founder4", name: "Основателей 4", price: 5000, monthly: 74, shares: 12.5, exit: "25,000–60,000" },
  { id: "founder5", name: "Основателей 5", price: 25000, monthly: 371, shares: 62.5, exit: "125,000–300,000" },
  { id: "founder6", name: "Основателей 6", price: 100000, monthly: 1484, shares: 250, exit: "500,000–1,200,000" },
];

const PAYMENT_WALLET = "UQCG4jJ5BHZhV0qAOwYxMNemhgcdtMBJv5cDXs0O5K3LNAgt";
const USDT_MASTER = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

function buildTonkeeperLink(amountUsd: number, comment: string): string {
  const nanoUsdt = amountUsd * 1_000_000;
  const params = new URLSearchParams({
    jetton: USDT_MASTER,
    amount: String(nanoUsdt),
    text: comment,
  });
  return `https://app.tonkeeper.com/transfer/${PAYMENT_WALLET}?${params.toString()}`;
}

function buildTonspaceLink(amountUsd: number, comment: string): string {
  const nanoUsdt = amountUsd * 1_000_000;
  const params = new URLSearchParams({
    jetton: USDT_MASTER,
    amount: String(nanoUsdt),
    text: comment,
  });
  return `https://tonspace.co/transfer/${PAYMENT_WALLET}?${params.toString()}`;
}

export function InvestmentModal({ isOpen, onClose, defaultPackage = "founder3" }: {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const connectedAddress = useTonAddress();
  const { open: openTonModal } = useTonConnectModal();

  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState(defaultPackage);
  const [walletFrom, setWalletFrom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPkg(defaultPackage);
      setWalletFrom("");
      setSubmitting(false);
    }
  }, [isOpen, defaultPackage]);

  useEffect(() => {
    if (connectedAddress) setWalletFrom(connectedAddress);
  }, [connectedAddress]);

  const pkg = PACKAGES.find(p => p.id === selectedPkg)!;

  const copyWallet = () => {
    navigator.clipboard.writeText(PAYMENT_WALLET);
    toast({ title: "Адрес скопирован!" });
  };

  const tonkeeperLink = buildTonkeeperLink(pkg.price, `Trends ${pkg.name}`);
  const tonspaceLink = buildTonspaceLink(pkg.price, `Trends ${pkg.name}`);

  const handleWalletAppPay = (url: string) => {
    window.open(url, "_blank");
    setTimeout(() => setStep(3), 1500);
  };

  const handleSubmit = async () => {
    if (!user) {
      onClose();
      setLocation("/login");
      return;
    }
    setSubmitting(true);
    try {
      await api.createInvestment({
        packageId: selectedPkg,
        walletFrom: walletFrom || connectedAddress || undefined,
      });
      setStep(4);
    } catch (err: any) {
      toast({ title: err.message ?? "Ошибка", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-card border-card-border text-card-foreground max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Инвестировать в Trends</DialogTitle>

        <AnimatePresence mode="wait">

          {/* Step 1 — выбор пакета */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="space-y-5">
              <h2 className="text-2xl font-bold text-center">Выберите пакет</h2>
              <div className="grid gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {PACKAGES.map((p) => (
                  <div key={p.id} onClick={() => setSelectedPkg(p.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedPkg === p.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/50"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-base">{p.name}
                          {p.recommended && <span className="text-xs text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded-full">ХИТ</span>}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Доля: {p.shares} · Exit: ${p.exit}
                        </p>
                      </div>
                      <div className="text-xl font-black text-primary">${p.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12" onClick={() => setStep(2)}>
                Продолжить →
              </Button>
            </motion.div>
          )}

          {/* Step 2 — оплата */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="space-y-5">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <h2 className="text-2xl font-bold text-center">Оплата</h2>

              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-4xl font-black text-primary">${pkg.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">{pkg.name} · USDT (TON)</div>
              </div>

              {/* Wallet connect banner */}
              {connectedAddress ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-green-400 font-semibold">Кошелёк подключён — адрес сохранён</div>
                    <div className="text-xs font-mono text-muted-foreground truncate">{connectedAddress}</div>
                  </div>
                </div>
              ) : (
                <button onClick={openTonModal}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <Wallet className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-semibold">Подключить кошелёк</div>
                    <div className="text-xs text-muted-foreground">Адрес заполнится автоматически</div>
                  </div>
                </button>
              )}

              {/* Pay buttons */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-center">Выберите кошелёк для оплаты:</p>

                <button onClick={() => handleWalletAppPay(tonkeeperLink)}
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

                <button onClick={() => handleWalletAppPay(tonspaceLink)}
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

          {/* Step 3 — подтверждение */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="space-y-5">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
              <h2 className="text-2xl font-bold text-center">Подтверждение</h2>

              <div className="bg-white/5 rounded-2xl p-5 space-y-3 border border-white/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Пакет:</span>
                  <span className="font-bold">{pkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма:</span>
                  <span className="font-black text-primary">${pkg.price.toLocaleString()} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доля в пуле:</span>
                  <span className="font-semibold">{pkg.shares}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Ваш TON-адрес (необязательно)</label>
                <Input placeholder="UQ... или EQ..."
                  value={walletFrom} onChange={e => setWalletFrom(e.target.value)}
                  className="bg-background/50 border-white/10 h-11 font-mono text-xs" />
                <p className="text-xs text-muted-foreground mt-1">Поможет нам найти вашу транзакцию быстрее</p>
              </div>

              {!user && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-300">
                  Для отслеживания инвестиции войдите в аккаунт.
                </div>
              )}

              <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12"
                onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить заявку"}
              </Button>
            </motion.div>
          )}

          {/* Step 4 — успех */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 text-center py-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-gradient">Заявка принята!</h2>
              <p className="text-muted-foreground">
                Пакет <strong>{pkg.name}</strong> активирован. Инвестиция подтверждена, MLM-бонусы уже начисляются.
              </p>
              <a
                href={`https://tonviewer.com/${PAYMENT_WALLET}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Посмотреть в TON Explorer
              </a>
              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full btn-grad font-bold rounded-xl" onClick={() => {
                  onClose();
                  setLocation("/cabinet");
                }}>
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
