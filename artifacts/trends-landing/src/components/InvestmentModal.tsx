import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Copy, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const PACKAGES = [
  { id: "founder1", name: "Основателей 1", price: 100, monthly: 1, shares: 0.25, exit: "–" },
  { id: "founder2", name: "Основателей 2", price: 250, monthly: 4, shares: 0.63, exit: "1,300–3,000" },
  { id: "founder3", name: "Основателей 3", price: 1000, monthly: 15, shares: 2.5, exit: "5,000–12,000", recommended: true },
  { id: "founder4", name: "Основателей 4", price: 5000, monthly: 74, shares: 12.5, exit: "25,000–60,000" },
  { id: "founder5", name: "Основателей 5", price: 25000, monthly: 371, shares: 62.5, exit: "125,000–300,000" },
  { id: "founder6", name: "Основателей 6", price: 100000, monthly: 1484, shares: 250, exit: "500,000–1,200,000" },
];

const PAYMENT_WALLET = "UQCG4jJ5BHZhV0qAOwYxMNemhgcdtMBJv5cDXs0O5K3LNAgt";
const PAYMENT_NETWORK = "TON";

export function InvestmentModal({ isOpen, onClose, defaultPackage = "founder3" }: {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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

  const pkg = PACKAGES.find(p => p.id === selectedPkg)!;

  const copyWallet = () => {
    navigator.clipboard.writeText(PAYMENT_WALLET);
    toast({ title: "Адрес скопирован!" });
  };

  const handleSubmit = async () => {
    if (!user) {
      onClose();
      setLocation("/login");
      return;
    }
    setSubmitting(true);
    try {
      await api.createInvestment({ packageId: selectedPkg, walletFrom: walletFrom || undefined });
      setStep(4);
    } catch (err: any) {
      toast({ title: err.message ?? "Ошибка", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-card border-card-border text-card-foreground">
        <DialogTitle className="sr-only">Инвестировать в Trends</DialogTitle>

        {/* Step 1 — выбор пакета */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-center">Выберите пакет</h2>
            <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
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
          </div>
        )}

        {/* Step 2 — инструкция по оплате */}
        {step === 2 && (
          <div className="space-y-5">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            <h2 className="text-2xl font-bold text-center">Инструкция по оплате</h2>

            <div className="bg-white/5 rounded-2xl p-5 space-y-4 border border-white/10">
              <div className="text-center">
                <div className="text-4xl font-black text-primary">${pkg.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">{pkg.name}</div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <p className="text-sm font-semibold">Переведите точную сумму на кошелёк:</p>
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-xl border border-white/10">
                  <span className="text-sm font-mono flex-1 break-all text-muted-foreground">{PAYMENT_WALLET}</span>
                  <Button variant="ghost" size="icon" onClick={copyWallet} className="shrink-0 h-8 w-8">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Сеть:</span>
                  <span className="font-bold text-yellow-400">{PAYMENT_NETWORK}</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-400">
                Переводите только TON на указанный адрес. После перевода нажмите «Я оплатил» и ваша заявка будет проверена администратором.
              </div>
            </div>

            <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12" onClick={() => setStep(3)}>
              Я оплатил →
            </Button>
          </div>
        )}

        {/* Step 3 — подтверждение + хэш транзакции */}
        {step === 3 && (
          <div className="space-y-5">
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
                <span className="font-black text-primary">${pkg.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Доля в пуле:</span>
                <span className="font-semibold">{pkg.shares}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Ваш адрес кошелька (необязательно)</label>
              <Input placeholder="Адрес, с которого отправили USDT"
                value={walletFrom} onChange={e => setWalletFrom(e.target.value)}
                className="bg-background/50 border-white/10 h-11 font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-1">Поможет нам быстрее найти вашу транзакцию</p>
            </div>

            {!user && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-300">
                Для отслеживания инвестиции войдите в аккаунт. После нажатия кнопки вас перенаправят на страницу входа.
              </div>
            )}

            <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить заявку"}
            </Button>
          </div>
        )}

        {/* Step 4 — успех */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-5 text-center py-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-gradient">Заявка принята!</h2>
            <p className="text-muted-foreground">
              Ваша заявка на пакет <strong>{pkg.name}</strong> отправлена.
              После подтверждения оплаты администратором инвестиция будет активирована и начнут начисляться MLM бонусы.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-sm text-yellow-400">
              Обычно подтверждение занимает до 24 часов
            </div>
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
      </DialogContent>
    </Dialog>
  );
}
