import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import logoPath from "@assets/logo_trends_1777962710178.png";

export default function ResetPassword() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const token = new URLSearchParams(search).get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Пароли не совпадают"); return; }
    if (password.length < 8) { setError("Минимум 8 символов"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setDone(true);
      setTimeout(() => setLocation("/login"), 3000);
    } catch (err: any) {
      setError(err.message ?? "Ошибка сброса пароля");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="w-14 h-14 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Неверная ссылка</h2>
          <p className="text-muted-foreground mb-6">Ссылка недействительна или устарела.</p>
          <Link href="/forgot-password">
            <Button className="btn-grad btn-3d font-bold rounded-xl">Запросить новую</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Назад ко входу
        </Link>

        <div className="glass-card p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <img src={logoPath} alt="Trends" className="w-9 h-9 object-contain" />
            <span className="text-2xl font-black">Trends</span>
          </div>

          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-3">Пароль изменён!</h2>
              <p className="text-muted-foreground text-sm mb-6">Перенаправляем на страницу входа...</p>
            </motion.div>
          ) : (
            <>
              <h1 className="text-3xl font-black mb-2">Новый пароль</h1>
              <p className="text-muted-foreground mb-8">Придумайте надёжный пароль</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Новый пароль</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-background/50 border-white/10 h-12"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Повторите пароль</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="bg-background/50 border-white/10 h-12"
                    required
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading}
                  className="w-full h-12 btn-grad btn-3d font-bold text-base rounded-xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Сохранить пароль"}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
