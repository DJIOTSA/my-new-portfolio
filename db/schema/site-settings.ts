import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  logoMediaId: text("logo_media_id"),
  defaultOgImageId: text("default_og_image_id"),
  contactEmail: text("contact_email").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  xUrl: text("x_url").notNull(),
  githubUrl: text("github_url").notNull(),
  coursePlatformUrl: text("course_platform_url").notNull(),
  translations: jsonb("translations").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});
