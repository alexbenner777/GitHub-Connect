import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { TwoFARequired } from "@/hooks/AuthProvider";
import logoPath from "@assets/logo_trends_1777962710178.png";

export default function Login() {
  const { login, loginWith2FA } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFaMode, setTwoFaMode] = useState(false);
  const [twoFaToken, setTwoFaToken] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      setLocation(result?.isAdmin ? "/admin" : "/cabinet?invest=true");
    } catch (err: any) {
      if (err instanceof TwoFARequired) {
        setTwoFaToken(err.tempToken);
        setTwoFaMode(true);
        setError("");
      } else {
        setError(err.message ?? "Ошибка входа");
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginWith2FA(twoFaToken, twoFaCode);
      setLocation(result?.isAdmin ? "/admin" : "/cabinet?invest=true");
    } catch (err: any) {
      setError(err.message ?? "Неверный код");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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

          <AnimatePresence mode="wait">
            {!twoFaMode ? (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-3xl font-black mb-2">Вход в личный кабинет</h1>
                <p className="text-muted-foreground mb-8">Войдите в личный кабинет инвестора</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <Input type="email" name="email" autoComplete="email" placeholder="investor@email.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-background/50 border-white/10 h-12" required />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium">Пароль</label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">Забыли пароль?</Link>
                    </div>
                    <Input type="password" name="password" autoComplete="current-password" placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="bg-background/50 border-white/10 h-12" required />
                  </div>
                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                  )}
                  <Button type="submit" disabled={loading} className="w-full h-12 btn-grad btn-3d font-bold text-base rounded-xl">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Войти"}
                  </Button>
                </form>
                <p className="text-center text-muted-foreground text-sm mt-6">
                  Нет аккаунта?{" "}
                  <Link href="/register" className="text-primary font-semibold hover:underline">Зарегистрироваться</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div key="2fa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black">Двухфакторная аутентификация</h1>
                    <p className="text-xs text-muted-foreground">Код отправлен на ваш email</p>
                  </div>
                </div>
                <form onSubmit={handle2FA} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">6-значный код</label>
                    <Input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                      placeholder="000000" value={twoFaCode} onChange={e => setTwoFaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="bg-background/50 border-white/10 h-12 text-center text-2xl tracking-widest font-mono" required />
                  </div>
                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                  )}
                  <Button type="submit" disabled={loading || twoFaCode.length !== 6} className="w-full h-12 btn-grad btn-3d font-bold text-base rounded-xl">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Подтвердить"}
                  </Button>
                  <button type="button" onClick={() => setTwoFaMode(false)} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    ← Назад
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
