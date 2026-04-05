import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  storageKey: text("storage_key").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  altTranslations: jsonb("alt_translations").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
