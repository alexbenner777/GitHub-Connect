import { useState, useEffect, type ReactNode } from "react";
import { api, type AuthUser } from "@/lib/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(data => setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        referralCode: data.user.referralCode,
      }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    setUser(data.user);
  };

  const register = async (body: Parameters<typeof api.register>[0]) => {
    const data = await api.register(body);
    setUser(data.user);
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
