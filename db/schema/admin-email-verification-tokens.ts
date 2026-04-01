import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { adminUsers } from "@/db/schema/admin-users";

export const adminEmailVerificationTokens = pgTable("admin_email_verification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => adminUsers.id),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
}, (table) => [
  uniqueIndex("admin_email_verification_tokens_token_hash_idx").on(table.tokenHash)
]);
