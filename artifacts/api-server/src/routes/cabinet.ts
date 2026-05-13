import { Router } from "express";
import { db, usersTable, investmentsTable, transactionsTable, referralBonusesTable } from "@workspace/db";
import { eq, desc, sum, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth.js";

const MONTHLY_PROFIT: Record<string, number> = {
  founder1: 1,
  founder2: 4,
  founder3: 15,
  founder4: 74,
  founder5: 371,
  founder6: 1484,
};

const router = Router();

router.get("/cabinet/me", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const [user] = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
    telegramUsername: usersTable.telegramUsername,
    referralCode: usersTable.referralCode,
    walletAddress: usersTable.walletAddress,
    walletNetwork: usersTable.walletNetwork,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, userId));

  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const investments = await db.select().from(investmentsTable)
    .where(eq(investmentsTable.userId, userId))
    .orderBy(desc(investmentsTable.createdAt));

  const transactions = await db.select().from(transactionsTable)
    .where(eq(transactionsTable.userId, userId))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(50);

  const [mlmStats] = await db.select({
    totalBonus: sum(referralBonusesTable.amount),
    count: count(),
  }).from(referralBonusesTable).where(eq(referralBonusesTable.beneficiaryId, userId));

  const totalInvested = investments
    .filter(i => i.status === "confirmed")
    .reduce((s, i) => s + parseFloat(i.amount), 0);

  const totalShares = investments
    .filter(i => i.status === "confirmed")
    .reduce((s, i) => s + parseFloat(i.shares), 0);

  const monthlyProfit = investments
    .filter(i => i.status === "confirmed")
    .reduce((s, i) => s + (MONTHLY_PROFIT[i.packageId] ?? 0), 0);

  res.json({
    user,
    investments,
    transactions,
    stats: {
      totalInvested,
      totalShares,
      monthlyProfit,
      mlmTotalBonus: parseFloat(mlmStats?.totalBonus ?? "0"),
      mlmReferralsCount: mlmStats?.count ?? 0,
    },
  });
});

router.get("/cabinet/referrals", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const levels: Record<number, { count: number; earned: number }> = {};
  const bonuses = await db.select().from(referralBonusesTable)
    .where(eq(referralBonusesTable.beneficiaryId, userId));

  for (const b of bonuses) {
    if (!levels[b.level]) levels[b.level] = { count: 0, earned: 0 };
    levels[b.level].count += 1;
    levels[b.level].earned += parseFloat(b.amount);
  }

  res.json({ levels });
});

router.patch("/cabinet/wallet", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const { walletAddress, walletNetwork } = req.body;
  if (!walletAddress || !walletNetwork) {
    res.status(400).json({ error: "walletAddress и walletNetwork обязательны" });
    return;
  }
  await db.update(usersTable)
    .set({ walletAddress, walletNetwork })
    .where(eq(usersTable.id, userId));
  res.json({ ok: true });
});

export default router;
