import { boolean, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const languages = pgTable("languages", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  enabled: boolean("enabled").notNull(),
  isDefault: boolean("is_default").notNull(),
  sortOrder: integer("sort_order").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
}, (table) => [
  uniqueIndex("languages_code_idx").on(table.code)
]);
