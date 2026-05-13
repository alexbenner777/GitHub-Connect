import { Router } from "express";
import { db, investmentsTable, transactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { processReferralBonuses } from "../lib/referral.js";

const PACKAGES: Record<string, { name: string; price: number; shares: number }> = {
  founder1: { name: "Основателей 1", price: 100, shares: 0 },
  founder2: { name: "Основателей 2", price: 250, shares: 0.26 },
  founder3: { name: "Основателей 3", price: 1000, shares: 1.3 },
  founder4: { name: "Основателей 4", price: 5000, shares: 10.04 },
  founder5: { name: "Основателей 5", price: 25000, shares: 65 },
  founder6: { name: "Основателей 6", price: 100000, shares: 250 },
};

const router = Router();

router.post("/investments", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const { packageId, walletFrom } = req.body;

  const pkg = PACKAGES[packageId];
  if (!pkg) { res.status(400).json({ error: "Неверный пакет" }); return; }

  const [investment] = await db.insert(investmentsTable).values({
    userId,
    packageId,
    packageName: pkg.name,
    amount: String(pkg.price),
    shares: String(pkg.shares),
    status: "confirmed",
    confirmedAt: new Date(),
    walletFrom: walletFrom ?? null,
  }).returning();

  await db.insert(transactionsTable).values({
    userId,
    type: "investment",
    amount: String(pkg.price),
    description: `Инвестиция подтверждена: ${pkg.name}`,
    status: "completed",
    referenceId: investment.id,
  });

  await processReferralBonuses(investment.id, userId, pkg.price);

  res.json({ investment });
});

router.get("/investments", requireAuth, async (req, res) => {
  const userId = req.user!.userId;
  const list = await db.select().from(investmentsTable)
    .where(eq(investmentsTable.userId, userId))
    .orderBy(desc(investmentsTable.createdAt));
  res.json({ investments: list });
});

router.get("/admin/investments", requireAdmin, async (req, res) => {
  const list = await db.select().from(investmentsTable)
    .orderBy(desc(investmentsTable.createdAt));
  res.json({ investments: list });
});

router.patch("/admin/investments/:id/confirm", requireAdmin, async (req, res) => {
  const id = parseInt(req.params["id"] as string);
  const { txHash } = req.body;

  const [inv] = await db.select().from(investmentsTable).where(eq(investmentsTable.id, id));
  if (!inv) { res.status(404).json({ error: "Инвестиция не найдена" }); return; }
  if (inv.status === "confirmed") { res.status(400).json({ error: "Уже подтверждена" }); return; }

  const [updated] = await db.update(investmentsTable)
    .set({ status: "confirmed", txHash: txHash ?? null, confirmedAt: new Date() })
    .where(eq(investmentsTable.id, id))
    .returning();

  await db.insert(transactionsTable).values({
    userId: inv.userId,
    type: "investment",
    amount: inv.amount,
    description: `Инвестиция подтверждена: ${inv.packageName}`,
    status: "completed",
    referenceId: inv.id,
  });

  await processReferralBonuses(inv.id, inv.userId, parseFloat(inv.amount));

  res.json({ investment: updated });
});

export default router;
