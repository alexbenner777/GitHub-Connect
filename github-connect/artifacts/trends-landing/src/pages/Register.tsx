import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft } from "lucide-react";
const logoPath = '/logo.png';

export default function Register() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const refCode = params.get("ref") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegram, setTelegram] = useState("");
  const [referralCode, setReferralCode] = useState(refCode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
    setLoading(true);
    try {
      await register({ email, password, name, telegramUsername: telegram || undefined, referralCode: referralCode || undefined });
      setLocation("/cabinet");
    } catch (err: any) {
      setError(err.message ?? "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>

        <div className="glass-card p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <img src={logoPath} alt="Trends" className="w-9 h-9 object-contain" />
            <span className="text-2xl font-black">Trends</span>
          </div>

          <h1 className="text-3xl font-black mb-2">Регистрация</h1>
          <p className="text-muted-foreground mb-8">Станьте инвестором Trends</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Имя *</label>
              <Input placeholder="Иван Петров" value={name}
                onChange={e => setName(e.target.value)}
                className="bg-background/50 border-white/10 h-12" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email *</label>
              <Input type="email" placeholder="investor@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-background/50 border-white/10 h-12" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Пароль * (мин. 6 символов)</label>
              <Input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-background/50 border-white/10 h-12" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Telegram (необязательно)</label>
              <Input placeholder="@username" value={telegram}
                onChange={e => setTelegram(e.target.value)}
                className="bg-background/50 border-white/10 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Реферальный код (если есть)</label>
              <Input placeholder="abc123" value={referralCode}
                onChange={e => setReferralCode(e.target.value)}
                className="bg-background/50 border-white/10 h-12" />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-12 btn-grad btn-3d font-bold text-base rounded-xl mt-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Создать аккаунт"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Войти</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
