import { Router } from "express";
import { db, platformUpdatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth.js";
import { z } from "zod";

const router = Router();

router.get("/platform-updates", async (_req, res, next) => {
  try {
    const updates = await db
      .select()
      .from(platformUpdatesTable)
      .where(eq(platformUpdatesTable.published, true))
      .orderBy(desc(platformUpdatesTable.date))
      .limit(10);
    res.json({ updates });
  } catch (err) { next(err); }
});

router.get("/admin/platform-updates", requireAdmin, async (_req, res, next) => {
  try {
    const updates = await db
      .select()
      .from(platformUpdatesTable)
      .orderBy(desc(platformUpdatesTable.date));
    res.json({ updates });
  } catch (err) { next(err); }
});

const updateSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(2000).default(""),
  date: z.string().optional(),
  published: z.boolean().default(false),
});

router.post("/admin/platform-updates", requireAdmin, async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0]?.message }); return; }
    const { title, body, date, published } = parsed.data;
    const [update] = await db.insert(platformUpdatesTable).values({
      title, body, published,
      date: date ? new Date(date) : new Date(),
    }).returning();
    res.status(201).json({ update });
  } catch (err) { next(err); }
});

router.patch("/admin/platform-updates/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = updateSchema.partial().safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0]?.message }); return; }
    const updates: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.body !== undefined) updates.body = parsed.data.body;
    if (parsed.data.published !== undefined) updates.published = parsed.data.published;
    if (parsed.data.date !== undefined) updates.date = new Date(parsed.data.date);
    const [updated] = await db.update(platformUpdatesTable).set(updates).where(eq(platformUpdatesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ update: updated });
  } catch (err) { next(err); }
});

export default router;
