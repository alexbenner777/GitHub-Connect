import { Router } from "express";
import { db, investmentsTable, usersTable } from "@workspace/db";
import { eq, sum, count } from "drizzle-orm";

const router = Router();

router.get("/stats", async (_req, res, next) => {
  try {
    const [amountRow] = await db
      .select({ total: sum(investmentsTable.amount) })
      .from(investmentsTable)
      .where(eq(investmentsTable.status, "confirmed"));

    const [investorsRow] = await db
      .select({ total: count() })
      .from(usersTable);

    const raised = parseFloat(amountRow?.total ?? "0") || 0;
    const investors = Number(investorsRow?.total ?? 0);

    res.json({ raised, investors });
  } catch (err) {
    next(err);
  }
});

export default router;
