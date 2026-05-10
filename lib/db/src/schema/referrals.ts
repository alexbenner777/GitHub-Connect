import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { investmentsTable } from "./investments";

export const referralBonusesTable = pgTable("referral_bonuses", {
  id: serial("id").primaryKey(),
  beneficiaryId: integer("beneficiary_id").notNull().references(() => usersTable.id),
  fromUserId: integer("from_user_id").notNull().references(() => usersTable.id),
  investmentId: integer("investment_id").notNull().references(() => investmentsTable.id),
  level: integer("level").notNull(),
  percent: numeric("percent", { precision: 5, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReferralBonusSchema = createInsertSchema(referralBonusesTable).omit({
  id: true, createdAt: true
});
export type InsertReferralBonus = z.infer<typeof insertReferralBonusSchema>;
export type ReferralBonus = typeof referralBonusesTable.$inferSelect;
