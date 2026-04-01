import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blogCategories = pgTable("blog_categories", {
  id: text("id").primaryKey(),
  parentId: text("parent_id"),
  orderIndex: integer("order_index").notNull(),
  translations: jsonb("translations").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
