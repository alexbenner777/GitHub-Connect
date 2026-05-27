import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";

export const platformUpdatesTable = pgTable("platform_updates", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PlatformUpdate = typeof platformUpdatesTable.$inferSelect;
