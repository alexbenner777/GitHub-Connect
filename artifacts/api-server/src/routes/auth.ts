import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/jwt.js";
import { generateReferralCode } from "../lib/referral.js";
import { notifyNewUser } from "../lib/telegram.js";
import { sendPasswordResetEmail } from "../lib/email.js";

const registerSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100),
  telegramUsername: z.string().optional(),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(1, "Пароль обязателен"),
});

function setCookieToken(res: import("express").Response, token: string) {
  res.cookie("trends_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

const router = Router();

router.post("/auth/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Неверные данные" });
      return;
    }

    const { email, password, name, telegramUsername, referralCode } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    let referredById: number | null = null;
    if (referralCode) {
      const [referrer] = await db.select({ id: usersTable.id })
        .from(usersTable).where(eq(usersTable.referralCode, referralCode));
      if (referrer) referredById = referrer.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const myReferralCode = generateReferralCode(name);

    let user;
    try {
      [user] = await db.insert(usersTable).values({
        email: normalizedEmail,
        passwordHash,
        name,
        telegramUsername: telegramUsername ?? null,
        referralCode: myReferralCode,
        referredById,
        isAdmin: false,
      }).returning();
    } catch (e: any) {
      if (e?.code === "23505") {
        res.status(409).json({ error: "Email уже зарегистрирован" });
        return;
      }
      throw e;
    }

    notifyNewUser({
      userId: user.id,
      name: user.name,
      email: user.email,
      telegramUsername: user.telegramUsername ?? null,
      referralCode: user.referralCode,
      referredByCode: referralCode ?? null,
    });

    const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
    setCookieToken(res, token);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0]?.message ?? "Неверные данные" });
      return;
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.email, normalizedEmail));

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
    setCookieToken(res, token);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode, isAdmin: user.isAdmin },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie("trends_token", { path: "/" });
  res.json({ ok: true });
});

router.post("/auth/forgot-password", async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    const [user] = await db.select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable).where(eq(usersTable.email, normalizedEmail));

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await db.update(usersTable)
        .set({ resetToken: token, resetTokenExpiry: expiry })
        .where(eq(usersTable.id, user.id));

      const origin = req.headers.origin ?? `https://${req.headers.host}`;
      const resetUrl = `${origin}/reset-password?token=${token}`;

      await sendPasswordResetEmail(user.email, resetUrl).catch(() => {});
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/reset-password", async (req, res, next) => {
  try {
    const { token, password } = z.object({
      token: z.string().min(1),
      password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
    }).parse(req.body);

    const [user] = await db.select({
      id: usersTable.id,
      resetToken: usersTable.resetToken,
      resetTokenExpiry: usersTable.resetTokenExpiry,
    }).from(usersTable).where(eq(usersTable.resetToken, token));

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ error: "Ссылка недействительна или истекла" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(usersTable.id, user.id));

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
