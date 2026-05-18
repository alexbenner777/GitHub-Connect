import { createContext } from "react";
import type { AuthUser } from "@/lib/api";

export interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; telegramUsername?: string; referralCode?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthCtx | null>(null);
