const BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("trends_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
  return data as T;
}

export const api = {
  register: (body: { email: string; password: string; name: string; telegramUsername?: string; referralCode?: string }) =>
    request<{ token: string; user: AuthUser }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<CabinetData>("/cabinet/me"),

  referrals: () => request<{ levels: Record<number, { count: number; earned: number }> }>("/cabinet/referrals"),

  createInvestment: (body: { packageId: string; walletFrom?: string }) =>
    request<{ investment: Investment }>("/investments", { method: "POST", body: JSON.stringify(body) }),

  updateWallet: (body: { walletAddress: string; walletNetwork: string }) =>
    request("/cabinet/wallet", { method: "PATCH", body: JSON.stringify(body) }),

  adminGetInvestments: () => request<{ investments: Investment[] }>("/admin/investments"),

  adminConfirm: (id: number, txHash?: string) =>
    request(`/admin/investments/${id}/confirm`, { method: "PATCH", body: JSON.stringify({ txHash }) }),

  adminReject: (id: number) =>
    request(`/admin/investments/${id}/reject`, { method: "PATCH", body: JSON.stringify({}) }),
};

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  referralCode: string;
  isAdmin?: boolean;
}

export interface Investment {
  id: number;
  userId: number;
  packageId: string;
  packageName: string;
  amount: string;
  shares: string;
  status: string;
  txHash: string | null;
  walletFrom: string | null;
  confirmedAt: string | null;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface CabinetData {
  user: {
    id: number;
    email: string;
    name: string;
    telegramUsername: string | null;
    referralCode: string;
    walletAddress: string | null;
    walletNetwork: string | null;
    createdAt: string;
  };
  investments: Investment[];
  transactions: Transaction[];
  stats: {
    totalInvested: number;
    totalShares: number;
    monthlyProfit: number;
    mlmTotalBonus: number;
    mlmReferralsCount: number;
  };
}
