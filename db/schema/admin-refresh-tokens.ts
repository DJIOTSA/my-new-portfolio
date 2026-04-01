import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { adminUsers } from "@/db/schema/admin-users";

export const adminRefreshTokens = pgTable("admin_refresh_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => adminUsers.id),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  replacedByTokenId: text("replaced_by_token_id"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
}, (table) => [
  uniqueIndex("admin_refresh_tokens_token_hash_idx").on(table.tokenHash)
]);
