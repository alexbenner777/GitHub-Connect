import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { db, usersTable, investmentsTable, transactionsTable, referralBonusesTable, sessionsTable, walletChangesTable } from "@workspace/db";
import { PACKAGES_MAP } from "@workspace/db";
import { eq, desc, sum, count, and, isNull, gt } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth.js";
import { sendWalletOtpEmail, sendPasswordChangedEmail } from "../lib/email.js";

const walletUpdateSchema = z.object({
  walletAddress: z.string().min(10).max(100),
  walletNetwork: z.enum(["TON", "USDT TRC-20", "USDT ERC-20", "BTC", "ETH"]),
});

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getIp(req: import("express").Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return raw?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
}

const router = Router();

router.get("/cabinet/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const [user] = await db.select({
      id: usersTable.id, email: usersTable.email, name: usersTable.name,
      telegramUsername: usersTable.telegramUsername, referralCode: usersTable.referralCode,
      walletAddress: usersTable.walletAddress, walletNetwork: usersTable.walletNetwork,
      isAdmin: usersTable.isAdmin, createdAt: usersTable.createdAt, twoFactorEnabled: usersTable.twoFactorEnabled,
    }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const investments = await db.select().from(investmentsTable).where(eq(investmentsTable.userId, userId)).orderBy(desc(investmentsTable.createdAt));
    const transactions = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId)).orderBy(desc(transactionsTable.createdAt)).limit(50);

    const [mlmStats] = await db.select({ totalBonus: sum(referralBonusesTable.amount), count: count() })
      .from(referralBonusesTable).where(eq(referralBonusesTable.beneficiaryId, userId));

    const confirmedInvestments = investments.filter(i => i.status === "confirmed");
    const totalInvested = confirmedInvestments.reduce((s, i) => s + parseFloat(i.amount), 0);
    const totalShares = confirmedInvestments.reduce((s, i) => s + parseFloat(i.shares), 0);
    const monthlyProfit = confirmedInvestments.reduce((s, i) => s + (PACKAGES_MAP[i.packageId]?.price ?? 0) * 0.004, 0);

    res.json({
      user,
      investments,
      transactions,
      stats: { totalInvested, totalShares, monthlyProfit, mlmTotalBonus: parseFloat(mlmStats?.totalBonus ?? "0"), mlmReferralsCount: mlmStats?.count ?? 0 },
    });
  } catch (err) { next(err); }
});

router.get("/cabinet/referrals", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const levels: Record<number, { count: number; earned: number }> = {};
    const bonuses = await db.select().from(referralBonusesTable).where(eq(referralBonusesTable.beneficiaryId, userId));
    for (const b of bonuses) {
      if (!levels[b.level]) levels[b.level] = { count: 0, earned: 0 };
      levels[b.level].count += 1;
      levels[b.level].earned += parseFloat(b.amount);
    }
    res.json({ levels });
  } catch (err) { next(err); }
});

// Wallet OTP: request change
router.post("/cabinet/wallet/request-change", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const parsed = walletUpdateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Неверные данные" }); return; }
    const { walletAddress, walletNetwork } = parsed.data;

    const [user] = await db.select({ email: usersTable.email, name: usersTable.name }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const code = generate6DigitCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    const pending = JSON.stringify({ address: walletAddress, network: walletNetwork });

    await db.update(usersTable).set({ walletOtpCode: code, walletOtpExpiry: expiry, walletOtpPending: pending }).where(eq(usersTable.id, userId));
    await sendWalletOtpEmail(user.email, user.name, code, walletAddress, walletNetwork).catch(e => console.error("[wallet otp]", e));

    res.json({ sent: true, email: user.email.replace(/(.{2}).+(@.+)/, "$1***$2") });
  } catch (err) { next(err); }
});

// Wallet OTP: confirm change
router.post("/cabinet/wallet/confirm-change", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { code } = z.object({ code: z.string().length(6) }).parse(req.body);

    const [user] = await db.select({
      walletAddress: usersTable.walletAddress, walletNetwork: usersTable.walletNetwork,
      walletOtpCode: usersTable.walletOtpCode, walletOtpExpiry: usersTable.walletOtpExpiry, walletOtpPending: usersTable.walletOtpPending,
    }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    if (!user.walletOtpCode || !user.walletOtpExpiry || user.walletOtpExpiry < new Date()) {
      res.status(400).json({ error: "Код устарел, запросите новый" }); return;
    }
    if (user.walletOtpCode !== code) { res.status(400).json({ error: "Неверный код" }); return; }

    const pending = JSON.parse(user.walletOtpPending ?? "{}") as { address: string; network: string };
    if (!pending.address) { res.status(400).json({ error: "Нет ожидающих изменений" }); return; }

    await db.update(usersTable).set({ walletAddress: pending.address, walletNetwork: pending.network, walletOtpCode: null, walletOtpExpiry: null, walletOtpPending: null }).where(eq(usersTable.id, userId));
    await db.insert(walletChangesTable).values({ userId, oldAddress: user.walletAddress, oldNetwork: user.walletNetwork, newAddress: pending.address, newNetwork: pending.network, ip: getIp(req), userAgent: req.headers["user-agent"]?.slice(0, 300) ?? null });

    res.json({ ok: true, walletAddress: pending.address, walletNetwork: pending.network });
  } catch (err) { next(err); }
});

// Change password
router.post("/cabinet/password", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8, "Минимум 8 символов") }).parse(req.body);

    const [user] = await db.select({ passwordHash: usersTable.passwordHash, email: usersTable.email, name: usersTable.name }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) { res.status(400).json({ error: "Неверный текущий пароль" }); return; }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, userId));
    await sendPasswordChangedEmail(user.email, user.name).catch(e => console.error("[password changed email]", e));
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Active sessions
router.get("/cabinet/sessions", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    const sessions = await db.select({ id: sessionsTable.id, userAgent: sessionsTable.userAgent, ip: sessionsTable.ip, createdAt: sessionsTable.createdAt, lastUsedAt: sessionsTable.lastUsedAt })
      .from(sessionsTable)
      .where(and(eq(sessionsTable.userId, userId), isNull(sessionsTable.revokedAt), gt(sessionsTable.expiresAt, now)))
      .orderBy(desc(sessionsTable.lastUsedAt));
    res.json({ sessions });
  } catch (err) { next(err); }
});

router.delete("/cabinet/sessions/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const sessionId = parseInt(String(req.params.id));
    if (isNaN(sessionId)) { res.status(400).json({ error: "Invalid session id" }); return; }
    const [session] = await db.select({ id: sessionsTable.id, userId: sessionsTable.userId }).from(sessionsTable).where(eq(sessionsTable.id, sessionId));
    if (!session || session.userId !== userId) { res.status(404).json({ error: "Session not found" }); return; }
    await db.update(sessionsTable).set({ revokedAt: new Date() }).where(eq(sessionsTable.id, sessionId));
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// GDPR export
router.get("/cabinet/export", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, telegramUsername: usersTable.telegramUsername, referralCode: usersTable.referralCode, walletAddress: usersTable.walletAddress, walletNetwork: usersTable.walletNetwork, createdAt: usersTable.createdAt }).from(usersTable).where(eq(usersTable.id, userId));
    const investments = await db.select().from(investmentsTable).where(eq(investmentsTable.userId, userId));
    const transactions = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId));
    const mlmBonuses = await db.select().from(referralBonusesTable).where(eq(referralBonusesTable.beneficiaryId, userId));
    const walletHistory = await db.select({ id: walletChangesTable.id, newAddress: walletChangesTable.newAddress, newNetwork: walletChangesTable.newNetwork, createdAt: walletChangesTable.createdAt }).from(walletChangesTable).where(eq(walletChangesTable.userId, userId));

    const exportData = { exportedAt: new Date().toISOString(), user, investments, transactions, mlmBonuses, walletHistory };
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="trends-data-${userId}-${Date.now()}.json"`);
    res.json(exportData);
  } catch (err) { next(err); }
});

// Delete account
router.delete("/cabinet/account", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { password } = z.object({ password: z.string().min(1) }).parse(req.body);
    const [user] = await db.select({ passwordHash: usersTable.passwordHash }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) { res.status(400).json({ error: "Неверный пароль" }); return; }
    await db.delete(usersTable).where(eq(usersTable.id, userId));
    res.clearCookie("trends_token", { path: "/" });
    res.clearCookie("trends_refresh", { path: "/api/auth" });
    res.clearCookie("trends_csrf", { path: "/" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Legacy wallet update (kept for backward compat, now requires OTP flow)
router.patch("/cabinet/wallet", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const parsed = walletUpdateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Неверные данные" }); return; }
    // For backward compat: direct update (new frontend uses /wallet/request-change + /wallet/confirm-change)
    const { walletAddress, walletNetwork } = parsed.data;
    const [user] = await db.select({ walletAddress: usersTable.walletAddress, walletNetwork: usersTable.walletNetwork }).from(usersTable).where(eq(usersTable.id, userId));
    await db.update(usersTable).set({ walletAddress, walletNetwork }).where(eq(usersTable.id, userId));
    if (user) await db.insert(walletChangesTable).values({ userId, oldAddress: user.walletAddress, oldNetwork: user.walletNetwork, newAddress: walletAddress, newNetwork: walletNetwork, ip: getIp(req), userAgent: req.headers["user-agent"]?.slice(0, 300) ?? null }).catch(() => {});
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// Platform stats stub (will be connected to live bot later)
router.get("/platform-stats", requireAuth, async (_req, res) => {
  res.json({
    stats: {
      dau: null, mau: null, totalVideos: null, revenueThisMonth: null,
      message: "Данные появятся по мере роста платформы",
    },
  });
});

export default router;
