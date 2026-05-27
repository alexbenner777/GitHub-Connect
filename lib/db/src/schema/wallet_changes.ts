import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const walletChangesTable = pgTable("wallet_changes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  oldAddress: text("old_address"),
  oldNetwork: text("old_network"),
  newAddress: text("new_address").notNull(),
  newNetwork: text("new_network").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WalletChange = typeof walletChangesTable.$inferSelect;
