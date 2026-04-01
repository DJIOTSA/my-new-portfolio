import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { blogAuthors } from "@/db/schema/blog-authors";
import { blogCategories } from "@/db/schema/blog-categories";

export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  authorId: text("author_id").notNull().references(() => blogAuthors.id),
  categoryId: text("category_id").notNull().references(() => blogCategories.id),
  status: text("status").notNull(),
  featured: boolean("featured").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  coverMediaId: text("cover_media_id"),
  ogImageMediaId: text("og_image_media_id"),
  readingTime: integer("reading_time").notNull(),
  difficulty: text("difficulty").notNull(),
  tags: jsonb("tags").notNull(),
  resources: jsonb("resources").notNull(),
  relatedPostIds: jsonb("related_post_ids").notNull(),
  socialPublishing: jsonb("social_publishing").notNull(),
  translations: jsonb("translations").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
