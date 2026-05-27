const BASE = "/api";

// CSRF token read from non-httpOnly cookie set by server
function getCsrfToken(): string | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)trends_csrf=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch { return null; }
}

// Remove localStorage - rely on httpOnly cookie only
// Kept as no-ops for backward compat during deploy transition
export function getStoredToken(): string | null { return null; }
export function clearStoredToken() { /* no-op: server clears cookie via /auth/logout */ }

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const csrfToken = getCsrfToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(MUTATION_METHODS.has(method) && csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...(options.headers ?? {}),
    },
  });

  // Auto-refresh if access token expired
  if (res.status === 401 && path !== "/auth/refresh" && path !== "/auth/login" && path !== "/auth/register") {
    const refreshed = await fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "include" });
    if (refreshed.ok) {
      return request<T>(path, options);
    }
  }

  let data: any;
  try { data = await res.json(); } catch {
    throw new Error(res.ok ? "Неверный ответ сервера" : `Ошибка сервера (${res.status})`);
  }
  if (!res.ok) throw new Error(data.error ?? "Ошибка запроса");
  return data as T;
}

export const api = {
  register: (body: { email: string; password: string; name: string; telegramUsername?: string; referralCode?: string }) =>
    request<{ token?: string; csrfToken?: string; user: AuthUser }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token?: string; csrfToken?: string; user?: AuthUser; requires2FA?: boolean; tempToken?: string }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  check2FA: (body: { code: string; tempToken: string }) =>
    request<{ token: string; csrfToken: string; user: AuthUser }>("/auth/2fa/check", { method: "POST", body: JSON.stringify(body) }),

  logout: () => request("/auth/logout", { method: "POST" }),

  refresh: () => request<{ token: string; csrfToken: string }>("/auth/refresh", { method: "POST" }),

  enable2FA: () => request<{ sent: boolean }>("/auth/2fa/enable", { method: "POST", body: JSON.stringify({}) }),

  verify2FA: (body: { code: string }) =>
    request<{ ok: boolean; enabled: boolean }>("/auth/2fa/verify", { method: "POST", body: JSON.stringify(body) }),

  disable2FA: () =>
    request<{ ok: boolean; enabled: boolean }>("/auth/2fa/disable", { method: "POST", body: JSON.stringify({}) }),

  me: () => request<CabinetData>("/cabinet/me"),

  referrals: () => request<{ levels: Record<number, { count: number; earned: number }> }>("/cabinet/referrals"),

  createInvestment: (body: { packageId: string; walletFrom?: string; txHash?: string }) =>
    request<{ investment: Investment }>("/investments", { method: "POST", body: JSON.stringify(body) }),

  getInvestment: (id: number) =>
    request<{ investment: Investment }>(`/investments/${id}`),

  checkInvestment: (id: number) =>
    request<{ confirmed: boolean; status: string }>(`/investments/${id}/check`, { method: "POST", body: JSON.stringify({}) }),

  requestWalletChange: (body: { walletAddress: string; walletNetwork: string }) =>
    request<{ sent: boolean; email: string }>("/cabinet/wallet/request-change", { method: "POST", body: JSON.stringify(body) }),

  confirmWalletChange: (body: { code: string }) =>
    request<{ ok: boolean; walletAddress: string; walletNetwork: string }>("/cabinet/wallet/confirm-change", { method: "POST", body: JSON.stringify(body) }),

  // Legacy wallet update (kept for admin use; new flow uses request/confirm)
  updateWallet: (body: { walletAddress: string; walletNetwork: string }) =>
    request("/cabinet/wallet", { method: "PATCH", body: JSON.stringify(body) }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request<{ ok: boolean }>("/cabinet/password", { method: "POST", body: JSON.stringify(body) }),

  getSessions: () =>
    request<{ sessions: SessionInfo[] }>("/cabinet/sessions"),

  revokeSession: (id: number) =>
    request<{ ok: boolean }>(`/cabinet/sessions/${id}`, { method: "DELETE", body: JSON.stringify({}) }),

  exportData: () => fetch(`${BASE}/cabinet/export`, { credentials: "include" }),

  deleteAccount: (body: { password: string }) =>
    request<{ ok: boolean }>("/cabinet/account", { method: "DELETE", body: JSON.stringify(body) }),

  adminGetInvestments: () => request<{ investments: Investment[] }>("/admin/investments"),

  adminConfirm: (id: number, txHash?: string) =>
    request(`/admin/investments/${id}/confirm`, { method: "PATCH", body: JSON.stringify({ txHash }) }),

  adminReject: (id: number, reason?: string) =>
    request(`/admin/investments/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason: reason ?? null }) }),

  stats: () => request<{ raised: number; investors: number }>("/stats"),

  platformMetrics: () =>
    request<{ metrics: PlatformMetrics | null }>("/platform-metrics"),

  adminGetPlatformMetricsHistory: () =>
    request<{ metrics: PlatformMetrics[] }>("/admin/platform-metrics/history"),

  adminSavePlatformMetrics: (body: Partial<PlatformMetricsInput>) =>
    request<{ metrics: PlatformMetrics }>("/admin/platform-metrics", { method: "POST", body: JSON.stringify(body) }),
};

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  referralCode: string;
  isAdmin?: boolean;
}

export interface SessionInfo {
  id: number;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  lastUsedAt: string;
}

export interface Investment {
  id: number; userId: number; packageId: string; packageName: string;
  amount: string; shares: string; status: string; txHash: string | null;
  walletFrom: string | null; confirmedAt: string | null; createdAt: string;
}

export interface Transaction {
  id: number; type: string; amount: string; description: string;
  status: string; createdAt: string;
}

export interface PlatformMetrics {
  id: number; dau: number | null; mau: number | null; wau: number | null;
  totalUsers: number | null; newUsersMonth: number | null;
  totalVideos: number | null; newVideosMonth: number | null; totalCreators: number | null;
  adsSold: number | null; adImpressions: number | null; adRevenueUsd: string | null;
  cpmUsd: string | null; platformRevenueUsd: string | null; creatorsPaidOutUsd: string | null;
  source: string; notes: string | null; recordedAt: string;
}

export type PlatformMetricsInput = Omit<PlatformMetrics, "id" | "recordedAt">;

export interface CabinetData {
  user: {
    id: number; email: string; name: string; telegramUsername: string | null;
    referralCode: string; walletAddress: string | null; walletNetwork: string | null;
    isAdmin?: boolean; createdAt: string; twoFactorEnabled?: boolean;
  };
  investments: Investment[];
  transactions: Transaction[];
  stats: {
    totalInvested: number; totalShares: number; monthlyProfit: number;
    mlmTotalBonus: number; mlmReferralsCount: number;
  };
}
