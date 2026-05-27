import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq, and, gt, isNull } from "drizzle-orm";
import { signToken, signRefreshToken, verifyRefreshToken, hashToken, generateCsrfToken } from "../lib/jwt.js";
import { generateReferralCode } from "../lib/referral.js";
import { notifyNewUser } from "../lib/telegram.js";
import { sendPasswordResetEmail, sendTwoFactorCodeEmail } from "../lib/email.js";
import { requireAuth } from "../middlewares/auth.js";

const registerSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100),
  telegramUsername: z.string().optional(),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setAccessCookie(res: import("express").Response, token: string) {
  res.cookie("trends_session", token, {
    httpOnly: true, secure: true, sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

function setRefreshCookie(res: import("express").Response, token: string) {
  res.cookie("trends_refresh", token, {
    httpOnly: true, secure: true, sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/api/auth",
  });
}

function setCsrfCookie(res: import("express").Response, token: string) {
  res.cookie("trends_csrf", token, {
    httpOnly: false, secure: true, sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function getIp(req: import("express").Request): string {
  return (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
}

async function createSession(userId: number, req: import("express").Request): Promise<string> {
  const rawToken = crypto.randomBytes(40).toString("hex");
  const hash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({
    userId,
    refreshTokenHash: hash,
    userAgent: req.headers["user-agent"]?.slice(0, 300) ?? null,
    ip: getIp(req),
    expiresAt,
  });
  return rawToken;
}

function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
      const [referrer] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.referralCode, referralCode));
      if (referrer) referredById = referrer.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const myReferralCode = generateReferralCode(name);

    let user;
    try {
      [user] = await db.insert(usersTable).values({
        email: normalizedEmail, passwordHash, name,
        telegramUsername: telegramUsername ?? null,
        referralCode: myReferralCode, referredById, isAdmin: false,
      }).returning();
    } catch (e: any) {
      if (e?.code === "23505") { res.status(409).json({ error: "Email уже зарегистрирован" }); return; }
      throw e;
    }

    notifyNewUser({ userId: user.id, name: user.name, email: user.email, telegramUsername: user.telegramUsername ?? null, referralCode: user.referralCode, referredByCode: referralCode ?? null });

    const accessToken = signToken({ userId: user.id, isAdmin: user.isAdmin });
    const refreshToken = await createSession(user.id, req);
    const csrfToken = generateCsrfToken();

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    setCsrfCookie(res, csrfToken);

    res.status(201).json({
      token: accessToken,
      csrfToken,
      user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode },
    });
  } catch (err) { next(err); }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Неверный email или пароль" }); return; }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }

    // 2FA check
    if (user.twoFactorEnabled) {
      const code = generate6DigitCode();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);
      await db.update(usersTable).set({ twoFactorCode: code, twoFactorExpiry: expiry }).where(eq(usersTable.id, user.id));
      await sendTwoFactorCodeEmail(user.email, user.name, code).catch(e => console.error("[2fa email]", e));
      // Temporary signed token for 2FA step (short-lived, no isAdmin)
      const tempToken = signToken({ userId: user.id, isAdmin: false });
      res.json({ requires2FA: true, tempToken });
      return;
    }

    const accessToken = signToken({ userId: user.id, isAdmin: user.isAdmin });
    const refreshToken = await createSession(user.id, req);
    const csrfToken = generateCsrfToken();

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    setCsrfCookie(res, csrfToken);

    res.json({
      token: accessToken,
      csrfToken,
      user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode, isAdmin: user.isAdmin },
    });
  } catch (err) { next(err); }
});

// 2FA verification at login
router.post("/auth/2fa/check", async (req, res, next) => {
  try {
    const { code, tempToken } = z.object({ code: z.string().length(6), tempToken: z.string() }).parse(req.body);
    let userId: number;
    try {
      const payload = verifyRefreshToken(tempToken) as any;
      userId = payload.userId;
    } catch {
      res.status(401).json({ error: "Недействительный токен" }); return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user || !user.twoFactorCode || !user.twoFactorExpiry || user.twoFactorExpiry < new Date()) {
      res.status(400).json({ error: "Код устарел, войдите снова" }); return;
    }
    if (user.twoFactorCode !== code) {
      res.status(400).json({ error: "Неверный код" }); return;
    }
    await db.update(usersTable).set({ twoFactorCode: null, twoFactorExpiry: null }).where(eq(usersTable.id, userId));

    const accessToken = signToken({ userId: user.id, isAdmin: user.isAdmin });
    const refreshToken = await createSession(user.id, req);
    const csrfToken = generateCsrfToken();
    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);
    setCsrfCookie(res, csrfToken);
    res.json({ token: accessToken, csrfToken, user: { id: user.id, email: user.email, name: user.name, referralCode: user.referralCode, isAdmin: user.isAdmin } });
  } catch (err) { next(err); }
});

// Refresh access token
router.post("/auth/refresh", async (req, res, next) => {
  try {
    const rawRefresh = (req.cookies as Record<string, string>)?.["trends_refresh"];
    if (!rawRefresh) { res.status(401).json({ error: "No refresh token" }); return; }

    const hash = hashToken(rawRefresh);
    const now = new Date();
    const [session] = await db.select().from(sessionsTable)
      .where(and(eq(sessionsTable.refreshTokenHash, hash), isNull(sessionsTable.revokedAt), gt(sessionsTable.expiresAt, now)));

    if (!session) { res.status(401).json({ error: "Session expired or revoked" }); return; }

    const [user] = await db.select({ id: usersTable.id, isAdmin: usersTable.isAdmin }).from(usersTable).where(eq(usersTable.id, session.userId));
    if (!user) { res.status(401).json({ error: "User not found" }); return; }

    // Rotate refresh token
    const newRawToken = crypto.randomBytes(40).toString("hex");
    const newHash = hashToken(newRawToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.update(sessionsTable).set({ revokedAt: now }).where(eq(sessionsTable.id, session.id));
    await db.insert(sessionsTable).values({
      userId: session.userId, refreshTokenHash: newHash,
      userAgent: session.userAgent, ip: session.ip, expiresAt,
    });

    const accessToken = signToken({ userId: user.id, isAdmin: user.isAdmin });
    const csrfToken = generateCsrfToken();
    setAccessCookie(res, accessToken);
    setRefreshCookie(res, newRawToken);
    setCsrfCookie(res, csrfToken);
    res.json({ token: accessToken, csrfToken });
  } catch (err) { next(err); }
});

router.post("/auth/logout", async (req, res) => {
  const rawRefresh = (req.cookies as Record<string, string>)?.["trends_refresh"];
  if (rawRefresh) {
    const hash = hashToken(rawRefresh);
    await db.update(sessionsTable).set({ revokedAt: new Date() }).where(eq(sessionsTable.refreshTokenHash, hash)).catch(() => {});
  }
  res.clearCookie("trends_session", { path: "/" });
  res.clearCookie("trends_refresh", { path: "/api/auth" });
  res.clearCookie("trends_csrf", { path: "/" });
  res.json({ ok: true });
});

router.post("/auth/forgot-password", async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email }).from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000);
      await db.update(usersTable).set({ resetToken: token, resetTokenExpiry: expiry }).where(eq(usersTable.id, user.id));
      const origin = req.headers.origin ?? `https://${req.headers.host}`;
      await sendPasswordResetEmail(user.email, `${origin}/reset-password?token=${token}`).catch(e => console.error("[forgot-password]", e));
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post("/auth/reset-password", async (req, res, next) => {
  try {
    const { token, password } = z.object({ token: z.string().min(1), password: z.string().min(8) }).parse(req.body);
    const [user] = await db.select({ id: usersTable.id, resetToken: usersTable.resetToken, resetTokenExpiry: usersTable.resetTokenExpiry })
      .from(usersTable).where(eq(usersTable.resetToken, token));
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ error: "Ссылка недействительна или истекла" }); return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(usersTable).set({ passwordHash, resetToken: null, resetTokenExpiry: null }).where(eq(usersTable.id, user.id));
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// 2FA management (in-cabinet)
router.post("/auth/2fa/enable", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const [user] = await db.select({ email: usersTable.email, name: usersTable.name }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const code = generate6DigitCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await db.update(usersTable).set({ twoFactorCode: code, twoFactorExpiry: expiry }).where(eq(usersTable.id, userId));
    await sendTwoFactorCodeEmail(user.email, user.name, code).catch(e => console.error("[2fa enable]", e));
    res.json({ sent: true });
  } catch (err) { next(err); }
});

router.post("/auth/2fa/verify", requireAuth, async (req, res, next) => {
  try {
    const { code } = z.object({ code: z.string().length(6) }).parse(req.body);
    const userId = req.user!.userId;
    const [user] = await db.select({ twoFactorCode: usersTable.twoFactorCode, twoFactorExpiry: usersTable.twoFactorExpiry }).from(usersTable).where(eq(usersTable.id, userId));
    if (!user?.twoFactorCode || !user.twoFactorExpiry || user.twoFactorExpiry < new Date()) {
      res.status(400).json({ error: "Код устарел, запросите новый" }); return;
    }
    if (user.twoFactorCode !== code) { res.status(400).json({ error: "Неверный код" }); return; }
    await db.update(usersTable).set({ twoFactorEnabled: true, twoFactorCode: null, twoFactorExpiry: null }).where(eq(usersTable.id, userId));
    res.json({ ok: true, enabled: true });
  } catch (err) { next(err); }
});

router.post("/auth/2fa/disable", requireAuth, async (req, res, next) => {
  try {
    await db.update(usersTable).set({ twoFactorEnabled: false, twoFactorCode: null, twoFactorExpiry: null }).where(eq(usersTable.id, req.user!.userId));
    res.json({ ok: true, enabled: false });
  } catch (err) { next(err); }
});

export default router;
