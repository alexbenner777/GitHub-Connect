import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/jwt.js";
import { generateReferralCode } from "../lib/referral.js";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const { email, password, name, telegramUsername, referralCode } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: "email, password, name обязательны" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "Email уже зарегистрирован" });
    return;
  }

  let referredById: number | null = null;
  if (referralCode) {
    const [referrer] = await db.select().from(usersTable).where(eq(usersTable.referralCode, referralCode));
    if (referrer) referredById = referrer.id;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const myReferralCode = generateReferralCode(name);

  const [user] = await db.insert(usersTable).values({
    email,
    passwordHash,
    name,
    telegramUsername: telegramUsername ?? null,
    referralCode: myReferralCode,
    referredById,
    isAdmin: false,
  }).returning();

  const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode } });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email и password обязательны" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode, isAdmin: user.isAdmin } });
});

export default router;
