import { pgTable, text, serial, timestamp, numeric, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const investmentsTable = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  packageId: text("package_id").notNull(),
  packageName: text("package_name").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  shares: numeric("shares", { precision: 18, scale: 4 }).notNull().default("0"),
  status: text("status").notNull().default("pending"),
  txHash: text("tx_hash"),
  walletFrom: text("wallet_from"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("investments_user_package_pending_uidx")
    .on(table.userId, table.packageId)
    .where(sql`${table.status} = 'pending'`),
]);

export const insertInvestmentSchema = createInsertSchema(investmentsTable).omit({
  id: true, createdAt: true, updatedAt: true, status: true, confirmedAt: true
});
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investmentsTable.$inferSelect;
