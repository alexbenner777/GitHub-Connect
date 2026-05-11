import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, type AuthUser } from "@/lib/api";

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; telegramUsername?: string; referralCode?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("trends_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.me()
      .then(data => setUser({ id: data.user.id, email: data.user.email, name: data.user.name, referralCode: data.user.referralCode }))
      .catch(() => { localStorage.removeItem("trends_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password });
    localStorage.setItem("trends_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (body: Parameters<typeof api.register>[0]) => {
    const data = await api.register(body);
    localStorage.setItem("trends_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("trends_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
