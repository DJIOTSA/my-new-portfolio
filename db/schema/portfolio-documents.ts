import { jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const portfolioDocuments = pgTable("portfolio_documents", {
  id: text("id").primaryKey(),
  sectionKey: text("section_key").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
}, (table) => [
  uniqueIndex("portfolio_documents_section_key_idx").on(table.sectionKey)
]);
