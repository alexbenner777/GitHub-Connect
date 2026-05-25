const BASE = "/api";
const TOKEN_KEY = "trends_jwt";

export function getStoredToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function setStoredToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
}

export function clearStoredToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(res.ok ? "Неверный ответ сервера" : `Ошибка сервера (${res.status})`);
  }
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
  return data as T;
}

export const api = {
  register: (body: { email: string; password: string; name: string; telegramUsername?: string; referralCode?: string }) =>
    request<{ token?: string; user: AuthUser }>("/auth/register", { method: "POST", body: JSON.stringify(body) })
      .then(data => { if (data.token) setStoredToken(data.token); return data; }),

  login: (body: { email: string; password: string }) =>
    request<{ token?: string; user: AuthUser }>("/auth/login", { method: "POST", body: JSON.stringify(body) })
      .then(data => { if (data.token) setStoredToken(data.token); return data; }),

  logout: () => {
    clearStoredToken();
    return request("/auth/logout", { method: "POST" });
  },

  me: () => request<CabinetData>("/cabinet/me"),

  referrals: () => request<{ levels: Record<number, { count: number; earned: number }> }>("/cabinet/referrals"),

  createInvestment: (body: { packageId: string; walletFrom?: string; txHash?: string }) =>
    request<{ investment: Investment }>("/investments", { method: "POST", body: JSON.stringify(body) }),

  getInvestment: (id: number) =>
    request<{ investment: Investment }>(`/investments/${id}`),

  checkInvestment: (id: number) =>
    request<{ confirmed: boolean; status: string }>(`/investments/${id}/check`, { method: "POST" }),

  updateWallet: (body: { walletAddress: string; walletNetwork: string }) =>
    request("/cabinet/wallet", { method: "PATCH", body: JSON.stringify(body) }),

  adminGetInvestments: () => request<{ investments: Investment[] }>("/admin/investments"),

  adminConfirm: (id: number, txHash?: string) =>
    request(`/admin/investments/${id}/confirm`, { method: "PATCH", body: JSON.stringify({ txHash }) }),

  adminReject: (id: number) =>
    request(`/admin/investments/${id}/reject`, { method: "PATCH", body: JSON.stringify({}) }),

  stats: () => request<{ raised: number; investors: number }>("/stats"),

  platformMetrics: () =>
    request<{ metrics: PlatformMetrics | null }>("/platform-metrics"),

  adminGetPlatformMetricsHistory: () =>
    request<{ metrics: PlatformMetrics[] }>("/admin/platform-metrics/history"),

  adminSavePlatformMetrics: (body: Partial<PlatformMetricsInput>) =>
    request<{ metrics: PlatformMetrics }>("/admin/platform-metrics", {
      method: "POST",
      body: JSON.stringify(body),
    }),
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

export interface PlatformMetrics {
  id: number;
  dau: number | null;
  mau: number | null;
  wau: number | null;
  totalUsers: number | null;
  newUsersMonth: number | null;
  totalVideos: number | null;
  newVideosMonth: number | null;
  totalCreators: number | null;
  adsSold: number | null;
  adImpressions: number | null;
  adRevenueUsd: string | null;
  cpmUsd: string | null;
  platformRevenueUsd: string | null;
  creatorsPaidOutUsd: string | null;
  source: string;
  notes: string | null;
  recordedAt: string;
}

export type PlatformMetricsInput = Omit<PlatformMetrics, "id" | "recordedAt">;

export interface CabinetData {
  user: {
    id: number;
    email: string;
    name: string;
    telegramUsername: string | null;
    referralCode: string;
    walletAddress: string | null;
    walletNetwork: string | null;
    isAdmin?: boolean;
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
