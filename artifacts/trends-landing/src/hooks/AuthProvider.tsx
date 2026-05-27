import { useState, useEffect, type ReactNode } from "react";
import { api, type AuthUser } from "@/lib/api";
import { AuthContext } from "./AuthContext";

export class TwoFARequired extends Error {
  constructor(public tempToken: string) {
    super("2fa_required");
    this.name = "TwoFARequired";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(data => setUser({
        id: data.user.id, email: data.user.email, name: data.user.name,
        referralCode: data.user.referralCode, isAdmin: (data.user as any).isAdmin ?? false,
      }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const data = await api.login({ email, password });
    if (data.requires2FA && data.tempToken) {
      throw new TwoFARequired(data.tempToken);
    }
    const u: AuthUser = {
      id: data.user!.id, email: data.user!.email, name: data.user!.name,
      referralCode: data.user!.referralCode, isAdmin: data.user!.isAdmin ?? false,
    };
    setUser(u);
    return u;
  };

  const loginWith2FA = async (tempToken: string, code: string): Promise<AuthUser> => {
    const data = await api.check2FA({ code, tempToken });
    const u: AuthUser = {
      id: data.user.id, email: data.user.email, name: data.user.name,
      referralCode: data.user.referralCode, isAdmin: data.user.isAdmin ?? false,
    };
    setUser(u);
    return u;
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
    <AuthContext.Provider value={{ user, loading, login, loginWith2FA, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
