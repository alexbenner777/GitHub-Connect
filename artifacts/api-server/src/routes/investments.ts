import { Router } from "express";
import { z } from "zod";
import { db, investmentsTable, transactionsTable, usersTable } from "@workspace/db";
import { PACKAGES_MAP } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { processReferralBonuses } from "../lib/referral.js";
import {
  notifyNewInvestment,
  notifyConfirmed,
  notifyRejected,
} from "../lib/telegram.js";
import { checkSingleInvestment } from "../lib/ton-checker.js";
import { sendInvestmentConfirmedEmail, sendInvestmentRejectedEmail } from "../lib/email.js";

const createInvestmentSchema = z.object({
  packageId: z.enum(["founder0", "founder1", "founder2", "founder3", "founder4", "founder5"]),
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

    let investment;
    try {
      [investment] = await db.insert(investmentsTable).values({
        userId,
        packageId,
        packageName: pkg.name,
        amount: String(pkg.price),
        shares: String(pkg.shares),
        status: "pending",
        walletFrom: walletFrom ?? null,
        txHash: txHash ?? null,
      }).returning();
    } catch (e: any) {
      if (e?.code === "23505") {
        res.status(409).json({ error: "У вас уже есть ожидающая инвестиция по этому пакету. Дождитесь подтверждения или свяжитесь с поддержкой." });
        return;
      }
      throw e;
    }

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

router.get("/investments/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: "Неверный ID" }); return; }
    const userId = req.user!.userId;
    const [inv] = await db.select().from(investmentsTable)
      .where(and(eq(investmentsTable.id, id), eq(investmentsTable.userId, userId)));
    if (!inv) { res.status(404).json({ error: "Не найдено" }); return; }
    res.json({ investment: inv });
  } catch (err) {
    next(err);
  }
});

router.post("/investments/:id/check", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params["id"] as string);
    if (isNaN(id)) { res.status(400).json({ error: "Неверный ID" }); return; }
    const userId = req.user!.userId;
    const [inv] = await db.select({ id: investmentsTable.id, status: investmentsTable.status })
      .from(investmentsTable)
      .where(and(eq(investmentsTable.id, id), eq(investmentsTable.userId, userId)));
    if (!inv) { res.status(404).json({ error: "Не найдено" }); return; }
    if (inv.status !== "pending") { res.json({ confirmed: inv.status === "confirmed", status: inv.status }); return; }
    const confirmed = await checkSingleInvestment(id);
    res.json({ confirmed, status: confirmed ? "confirmed" : "pending" });
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
      if (inv.status === "rejected") { res.status(400).json({ error: "Нельзя подтвердить отклонённую инвестицию" }); return; }

      const [updated] = await tx.update(investmentsTable)
        .set({ status: "confirmed", txHash: txHash ?? inv.txHash, confirmedAt: new Date() })
        .where(and(eq(investmentsTable.id, id), eq(investmentsTable.status, "pending")))
        .returning();

      if (!updated) { res.status(409).json({ error: "Инвестиция уже была обработана" }); return; }

      await tx.insert(transactionsTable).values({
        userId: inv.userId,
        type: "investment",
        amount: inv.amount,
        description: `Инвестиция подтверждена: ${inv.packageName}`,
        status: "completed",
        referenceId: inv.id,
      });

      await processReferralBonuses(inv.id, inv.userId, parseFloat(inv.amount), tx);

      const [user] = await db.select({
        name: usersTable.name,
        email: usersTable.email,
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

      if (user?.email) {
        const origin = process.env.RENDER_EXTERNAL_URL
          ?? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://trendspartner.space");
        sendInvestmentConfirmedEmail({
          to: user.email,
          name: user.name,
          packageName: inv.packageName,
          amount: parseFloat(inv.amount),
          txHash: txHash ?? inv.txHash ?? null,
          cabinetUrl: `${origin}/cabinet`,
        }).catch((err) => console.error("[email] Failed to send confirmation email:", err?.message));
      }

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

    const reason: string | undefined = typeof req.body?.reason === "string" && req.body.reason.trim()
      ? req.body.reason.trim()
      : undefined;

    const [inv] = await db.select().from(investmentsTable).where(eq(investmentsTable.id, id));
    if (!inv) { res.status(404).json({ error: "Инвестиция не найдена" }); return; }
    if (inv.status !== "pending") { res.status(400).json({ error: "Можно отклонить только pending-инвестицию" }); return; }

    const [updated] = await db.update(investmentsTable)
      .set({ status: "rejected" })
      .where(eq(investmentsTable.id, id))
      .returning();

    const [user] = await db.select({
      name: usersTable.name,
      email: usersTable.email,
      telegramUsername: usersTable.telegramUsername,
    }).from(usersTable).where(eq(usersTable.id, inv.userId));

    notifyRejected({
      investmentId: inv.id,
      userName: user?.name ?? `User #${inv.userId}`,
      telegramUsername: user?.telegramUsername ?? null,
      packageName: inv.packageName,
      amount: parseFloat(inv.amount),
    });

    if (user?.email) {
      const origin = process.env.RENDER_EXTERNAL_URL
        ?? (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "https://trendspartner.space");
      sendInvestmentRejectedEmail({
        to: user.email,
        name: user.name,
        packageName: inv.packageName,
        amount: parseFloat(inv.amount),
        reason: reason ?? null,
        cabinetUrl: `${origin}/cabinet`,
      }).catch((err) => console.error("[email] Failed to send rejection email:", err?.message));
    }

    res.json({ investment: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
