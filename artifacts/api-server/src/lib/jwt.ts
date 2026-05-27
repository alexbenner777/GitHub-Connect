import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const SECRET = process.env.SESSION_SECRET;
if (!SECRET) throw new Error("SESSION_SECRET env var is required");

export interface JwtPayload {
  userId: number;
  isAdmin: boolean;
  // email kept optional for backward-compat transition period
  email?: string;
}

export function signToken(payload: JwtPayload): string {
  const { email: _email, ...clean } = payload;
  return jwt.sign(clean, SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET!) as JwtPayload;
}

export function signRefreshToken(payload: { userId: number }): string {
  return jwt.sign(payload, SECRET!, { expiresIn: "7d" });
}

export function verifyRefreshToken(token: string): { userId: number } {
  return jwt.verify(token, SECRET!) as { userId: number };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
