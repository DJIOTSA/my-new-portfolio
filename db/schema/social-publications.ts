import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { blogPosts } from "@/db/schema/blog-posts";

export const socialPublications = pgTable("social_publications", {
  id: text("id").primaryKey(),
  blogPostId: text("blog_post_id").notNull().references(() => blogPosts.id),
  languageCode: text("language_code").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull(),
  generatedText: text("generated_text").notNull(),
  finalText: text("final_text").notNull(),
  externalPostId: text("external_post_id"),
  externalUrl: text("external_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  retryCount: integer("retry_count").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
