import { Router } from "express";
import { z } from "zod";
import { db, investmentsTable, transactionsTable, usersTable } from "@workspace/db";
import { PACKAGES_MAP } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { processReferralBonuses } from "../lib/referral.js";
import {
  notifyNewInvestment,
  notifyConfirmed,
  notifyRejected,
} from "../lib/telegram.js";

const createInvestmentSchema = z.object({
  packageId: z.enum(["founder1", "founder2", "founder3", "founder4", "founder5"]),
  walletFrom: z.string().optional(),
  txHash: z.string().optional(),
});

const router = Router();

router.post("/investments", requireAuth, async (req, res, next) => {
  try {
    const parsed = createInvestmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Неверные данные", details: parsed.error.flatten() });
      return;
    }

    const { packageId, walletFrom, txHash } = parsed.data;
    const pkg = PACKAGES_MAP[packageId];
    const userId = req.user!.userId;

    const [investment] = await db.insert(investmentsTable).values({
      userId,
      packageId,
      packageName: pkg.name,
      amount: String(pkg.price),
      shares: String(pkg.shares),
      status: "pending",
      walletFrom: walletFrom ?? null,
      txHash: txHash ?? null,
    }).returning();

    const [user] = await db.select({
      name: usersTable.name,
      telegramUsername: usersTable.telegramUsername,
    }).from(usersTable).where(eq(usersTable.id, userId));

    notifyNewInvestment({
      investmentId: investment.id,
      userName: user?.name ?? `User #${userId}`,
      telegramUsername: user?.telegramUsername ?? null,
      packageName: pkg.name,
      amount: pkg.price,
      walletFrom: walletFrom ?? null,
    });

    res.status(201).json({ investment });
  } catch (err) {
    next(err);
  }
});

router.get("/investments", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const list = await db.select().from(investmentsTable)
      .where(eq(investmentsTable.userId, userId))
      .orderBy(desc(investmentsTable.createdAt));
    res.json({ investments: list });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/investments", requireAdmin, async (req, res, next) => {
  try {
    const list = await db.select().from(investmentsTable)
      .orderBy(desc(investmentsTable.createdAt));
    res.json({ investments: list });
  } catch (err) {
    next(err);
  }
});

router.patch("/admin/investments/:id/confirm", requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: "Неверный ID" }); return; }

    const { txHash } = req.body;

    await db.transaction(async (tx) => {
      const [inv] = await tx.select().from(investmentsTable).where(eq(investmentsTable.id, id));
      if (!inv) { res.status(404).json({ error: "Инвестиция не найдена" }); return; }
      if (inv.status === "confirmed") { res.status(400).json({ error: "Уже подтверждена" }); return; }

      const [updated] = await tx.update(investmentsTable)
        .set({ status: "confirmed", txHash: txHash ?? inv.txHash, confirmedAt: new Date() })
        .where(eq(investmentsTable.id, id))
        .returning();

      await tx.insert(transactionsTable).values({
        userId: inv.userId,
        type: "investment",
        amount: inv.amount,
        description: `Инвестиция подтверждена: ${inv.packageName}`,
        status: "completed",
        referenceId: inv.id,
      });

      await processReferralBonuses(inv.id, inv.userId, parseFloat(inv.amount));

      const [user] = await db.select({
        name: usersTable.name,
        telegramUsername: usersTable.telegramUsername,
      }).from(usersTable).where(eq(usersTable.id, inv.userId));

      notifyConfirmed({
        investmentId: inv.id,
        userName: user?.name ?? `User #${inv.userId}`,
        telegramUsername: user?.telegramUsername ?? null,
        packageName: inv.packageName,
        amount: parseFloat(inv.amount),
        txHash: txHash ?? inv.txHash ?? null,
      });

      res.json({ investment: updated });
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/admin/investments/:id/reject", requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: "Неверный ID" }); return; }

    const [inv] = await db.select().from(investmentsTable).where(eq(investmentsTable.id, id));
    if (!inv) { res.status(404).json({ error: "Инвестиция не найдена" }); return; }
    if (inv.status !== "pending") { res.status(400).json({ error: "Можно отклонить только pending-инвестицию" }); return; }

    const [updated] = await db.update(investmentsTable)
      .set({ status: "rejected" })
      .where(eq(investmentsTable.id, id))
      .returning();

    const [user] = await db.select({
      name: usersTable.name,
      telegramUsername: usersTable.telegramUsername,
    }).from(usersTable).where(eq(usersTable.id, inv.userId));

    notifyRejected({
      investmentId: inv.id,
      userName: user?.name ?? `User #${inv.userId}`,
      telegramUsername: user?.telegramUsername ?? null,
      packageName: inv.packageName,
      amount: parseFloat(inv.amount),
    });

    res.json({ investment: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
