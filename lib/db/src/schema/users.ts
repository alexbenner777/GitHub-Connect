import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  telegramUsername: text("telegram_username"),
  referralCode: text("referral_code").notNull().unique(),
  referredById: integer("referred_by_id").references((): any => usersTable.id),
  isAdmin: boolean("is_admin").notNull().default(false),
  walletAddress: text("wallet_address"),
  walletNetwork: text("wallet_network"),
  // Wallet OTP verification
  walletOtpCode: text("wallet_otp_code"),
  walletOtpExpiry: timestamp("wallet_otp_expiry", { withTimezone: true }),
  walletOtpPending: text("wallet_otp_pending"), // JSON: { address, network }
  // Two-factor authentication
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorCode: text("two_factor_code"),
  twoFactorExpiry: timestamp("two_factor_expiry", { withTimezone: true }),
  // Password reset
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true, createdAt: true, updatedAt: true, referralCode: true, isAdmin: true
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
