import { pgTable, serial, timestamp, integer, numeric, text } from "drizzle-orm/pg-core";

export const platformMetricsTable = pgTable("platform_metrics", {
  id: serial("id").primaryKey(),
  dau: integer("dau"),
  mau: integer("mau"),
  wau: integer("wau"),
  totalUsers: integer("total_users"),
  newUsersMonth: integer("new_users_month"),
  totalVideos: integer("total_videos"),
  newVideosMonth: integer("new_videos_month"),
  totalCreators: integer("total_creators"),
  adsSold: integer("ads_sold"),
  adImpressions: integer("ad_impressions"),
  adRevenueUsd: numeric("ad_revenue_usd", { precision: 12, scale: 2 }),
  cpmUsd: numeric("cpm_usd", { precision: 8, scale: 2 }),
  platformRevenueUsd: numeric("platform_revenue_usd", { precision: 12, scale: 2 }),
  creatorsPaidOutUsd: numeric("creators_paid_out_usd", { precision: 12, scale: 2 }),
  source: text("source").notNull().default("manual"),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PlatformMetrics = typeof platformMetricsTable.$inferSelect;
