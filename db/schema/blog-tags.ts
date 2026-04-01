import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blogTags = pgTable("blog_tags", {
  id: text("id").primaryKey(),
  translations: jsonb("translations").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
