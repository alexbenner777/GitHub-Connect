import { Router } from "express";
import { z } from "zod";
import { db, platformMetricsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/platform-metrics", async (_req, res, next) => {
  try {
    const [latest] = await db
      .select()
      .from(platformMetricsTable)
      .orderBy(desc(platformMetricsTable.recordedAt))
      .limit(1);
    res.json({ metrics: latest ?? null });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/platform-metrics/history", requireAdmin, async (_req, res, next) => {
  try {
    const list = await db
      .select()
      .from(platformMetricsTable)
      .orderBy(desc(platformMetricsTable.recordedAt))
      .limit(50);
    res.json({ metrics: list });
  } catch (err) {
    next(err);
  }
});

const metricsSchema = z.object({
  dau: z.number().int().nonnegative().nullable().optional(),
  mau: z.number().int().nonnegative().nullable().optional(),
  wau: z.number().int().nonnegative().nullable().optional(),
  totalUsers: z.number().int().nonnegative().nullable().optional(),
  newUsersMonth: z.number().int().nonnegative().nullable().optional(),
  totalVideos: z.number().int().nonnegative().nullable().optional(),
  newVideosMonth: z.number().int().nonnegative().nullable().optional(),
  totalCreators: z.number().int().nonnegative().nullable().optional(),
  adsSold: z.number().int().nonnegative().nullable().optional(),
  adImpressions: z.number().int().nonnegative().nullable().optional(),
  adRevenueUsd: z.string().nullable().optional(),
  cpmUsd: z.string().nullable().optional(),
  platformRevenueUsd: z.string().nullable().optional(),
  creatorsPaidOutUsd: z.string().nullable().optional(),
  source: z.enum(["manual", "api", "mixed"]).default("manual"),
  notes: z.string().max(500).nullable().optional(),
});

router.post("/admin/platform-metrics", requireAdmin, async (req, res, next) => {
  try {
    const parsed = metricsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Неверные данные", details: parsed.error.flatten() });
      return;
    }
    const [record] = await db
      .insert(platformMetricsTable)
      .values({ ...parsed.data, recordedAt: new Date() })
      .returning();
    res.status(201).json({ metrics: record });
  } catch (err) {
    next(err);
  }
});

export default router;
