import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blogAuthors = pgTable("blog_authors", {
  id: text("id").primaryKey(),
  avatarMediaId: integer("avatar_media_id"),
  email: text("email").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  xUrl: text("x_url").notNull(),
  githubUrl: text("github_url").notNull(),
  translations: jsonb("translations").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
