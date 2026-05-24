import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoPath from "@assets/logo_trends_1777962710178.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

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

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-3">Письмо отправлено</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Мы отправили ссылку для сброса пароля на <strong className="text-white">{email}</strong>.
                Проверьте почту — ссылка действует 1 час.
              </p>
              <Link href="/login">
                <Button className="w-full btn-grad btn-3d font-bold rounded-xl h-12">Войти</Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-3xl font-black mb-2">Забыли пароль?</h1>
              <p className="text-muted-foreground mb-8">Введите email — пришлём ссылку для сброса</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="investor@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Отправить ссылку"}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
