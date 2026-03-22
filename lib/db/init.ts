import { randomBytes, scryptSync } from "node:crypto";
import { getDb } from "@/lib/db/postgres";
import {
  seedAbout,
  seedBlogAuthor,
  seedBlogCategories,
  seedBlogPosts,
  seedBlogTags,
  seedCertifications,
  seedContact,
  seedEducation,
  seedExperiences,
  seedHero,
  seedLanguages,
  seedProjects,
  seedServices,
  seedSiteSettings,
  seedSkills
} from "@/lib/db/seed-data";

let initialized = false;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function ensureDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  const sql = getDb();

  await sql`create table if not exists languages (id text primary key, code text not null unique, name text not null, native_name text not null, enabled boolean not null, is_default boolean not null, sort_order integer not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists site_settings (id text primary key, logo_media_id text, default_og_image_id text, contact_email text not null, linkedin_url text not null, x_url text not null, github_url text not null, course_platform_url text not null, translations jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists portfolio_documents (id text primary key, section_key text not null unique, data jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists blog_categories (id text primary key, parent_id text, order_index integer not null, translations jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists blog_tags (id text primary key, translations jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists blog_authors (id text primary key, avatar_media_id text, email text not null, linkedin_url text not null, x_url text not null, github_url text not null, translations jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists blog_posts (id text primary key, author_id text not null, category_id text not null, status text not null, featured boolean not null, published_at timestamptz, scheduled_at timestamptz, cover_media_id text, og_image_media_id text, reading_time integer not null, difficulty text not null, tags jsonb not null, resources jsonb not null, related_post_ids jsonb not null, social_publishing jsonb not null, translations jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists media_files (id text primary key, storage_key text not null, file_name text not null, mime_type text not null, size integer not null, width integer, height integer, alt_translations jsonb not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists contact_entries (id text primary key, type text not null, name text not null, email text not null, company text, subject text not null, message text not null, status text not null, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists social_publications (id text primary key, blog_post_id text not null, language_code text not null, platform text not null, status text not null, generated_text text not null, final_text text not null, external_post_id text, external_url text, published_at timestamptz, retry_count integer not null, error_message text, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists admin_users (id text primary key, username text not null unique, email text not null unique, password_hash text not null, role text not null, status text not null, email_verified_at timestamptz, last_login_at timestamptz, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists admin_refresh_tokens (id text primary key, user_id text not null, token_hash text not null unique, expires_at timestamptz not null, revoked_at timestamptz, replaced_by_token_id text, user_agent text, ip_address text, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists admin_email_verification_tokens (id text primary key, user_id text not null, token_hash text not null unique, expires_at timestamptz not null, consumed_at timestamptz, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`create table if not exists admin_password_reset_tokens (id text primary key, user_id text not null, token_hash text not null unique, expires_at timestamptz not null, consumed_at timestamptz, created_at timestamptz not null, updated_at timestamptz not null)`;
  await sql`alter table admin_users add column if not exists email text`;
  await sql`alter table admin_users add column if not exists email_verified_at timestamptz`;
  await sql`alter table admin_users add column if not exists last_login_at timestamptz`;
  await sql`do $$ begin
    if not exists (
      select 1 from pg_constraint where conname = 'admin_users_email_key'
    ) then
      alter table admin_users add constraint admin_users_email_key unique (email);
    end if;
  end $$`;

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  await sql`update admin_users set email = coalesce(email, ${adminEmail}) where email is null`;

  const [{ count: languageCount }] = await sql<{ count: string }[]>`select count(*)::text as count from languages`;
  if (Number(languageCount) === 0) {
    for (const language of seedLanguages) {
      await sql`insert into languages (id, code, name, native_name, enabled, is_default, sort_order, created_at, updated_at) values (${language.id}, ${language.code}, ${language.name}, ${language.nativeName}, ${language.enabled}, ${language.isDefault}, ${language.sortOrder}, ${language.createdAt}, ${language.updatedAt})`;
    }
  }

  const [{ count: settingsCount }] = await sql<{ count: string }[]>`select count(*)::text as count from site_settings`;
  if (Number(settingsCount) === 0) {
    await sql`insert into site_settings (id, logo_media_id, default_og_image_id, contact_email, linkedin_url, x_url, github_url, course_platform_url, translations, created_at, updated_at) values (${seedSiteSettings.id}, ${seedSiteSettings.logoMediaId}, ${seedSiteSettings.defaultOgImageId}, ${seedSiteSettings.contactEmail}, ${seedSiteSettings.linkedinUrl}, ${seedSiteSettings.xUrl}, ${seedSiteSettings.githubUrl}, ${seedSiteSettings.coursePlatformUrl}, ${JSON.stringify(seedSiteSettings.translations)}::jsonb, ${seedSiteSettings.createdAt}, ${seedSiteSettings.updatedAt})`;
  }

  const portfolioSeeds = [
    { sectionKey: "hero", data: seedHero },
    { sectionKey: "about", data: seedAbout },
    { sectionKey: "skills", data: seedSkills },
    { sectionKey: "services", data: seedServices },
    { sectionKey: "experiences", data: seedExperiences },
    { sectionKey: "education", data: seedEducation },
    { sectionKey: "certifications", data: seedCertifications },
    { sectionKey: "projects", data: seedProjects },
    { sectionKey: "contact", data: seedContact }
  ] as const;

  for (const document of portfolioSeeds) {
    await sql`insert into portfolio_documents (id, section_key, data, created_at, updated_at) values (${document.sectionKey}, ${document.sectionKey}, ${JSON.stringify(document.data)}::jsonb, ${new Date().toISOString()}, ${new Date().toISOString()}) on conflict (section_key) do nothing`;
  }

  const [{ count: categoryCount }] = await sql<{ count: string }[]>`select count(*)::text as count from blog_categories`;
  if (Number(categoryCount) === 0) {
    for (const category of seedBlogCategories) {
      await sql`insert into blog_categories (id, parent_id, order_index, translations, created_at, updated_at) values (${category.id}, ${category.parentId}, ${category.orderIndex}, ${JSON.stringify(category.translations)}::jsonb, ${category.createdAt}, ${category.updatedAt})`;
    }
  }

  const [{ count: tagCount }] = await sql<{ count: string }[]>`select count(*)::text as count from blog_tags`;
  if (Number(tagCount) === 0) {
    for (const tag of seedBlogTags) {
      await sql`insert into blog_tags (id, translations, created_at, updated_at) values (${tag.id}, ${JSON.stringify(tag.translations)}::jsonb, ${tag.createdAt}, ${tag.updatedAt})`;
    }
  }

  const [{ count: authorCount }] = await sql<{ count: string }[]>`select count(*)::text as count from blog_authors`;
  if (Number(authorCount) === 0) {
    await sql`insert into blog_authors (id, avatar_media_id, email, linkedin_url, x_url, github_url, translations, created_at, updated_at) values (${seedBlogAuthor.id}, ${seedBlogAuthor.avatarMediaId}, ${seedBlogAuthor.email}, ${seedBlogAuthor.linkedinUrl}, ${seedBlogAuthor.xUrl}, ${seedBlogAuthor.githubUrl}, ${JSON.stringify(seedBlogAuthor.translations)}::jsonb, ${seedBlogAuthor.createdAt}, ${seedBlogAuthor.updatedAt})`;
  }

  const [{ count: postCount }] = await sql<{ count: string }[]>`select count(*)::text as count from blog_posts`;
  if (Number(postCount) === 0) {
    for (const post of seedBlogPosts) {
      await sql`insert into blog_posts (id, author_id, category_id, status, featured, published_at, scheduled_at, cover_media_id, og_image_media_id, reading_time, difficulty, tags, resources, related_post_ids, social_publishing, translations, created_at, updated_at) values (${post.id}, ${post.authorId}, ${post.categoryId}, ${post.status}, ${post.featured}, ${post.publishedAt}, ${post.scheduledAt}, ${post.coverMediaId}, ${post.ogImageMediaId}, ${post.readingTime}, ${post.difficulty}, ${JSON.stringify(post.tags)}::jsonb, ${JSON.stringify(post.resources)}::jsonb, ${JSON.stringify(post.relatedPostIds)}::jsonb, ${JSON.stringify(post.socialPublishing)}::jsonb, ${JSON.stringify(post.translations)}::jsonb, ${post.createdAt}, ${post.updatedAt})`;
    }
  }

  const [{ count: adminUserCount }] = await sql<{ count: string }[]>`select count(*)::text as count from admin_users`;
  if (Number(adminUserCount) === 0) {
    const now = new Date().toISOString();
    await sql`
      insert into admin_users (
        id, username, email, password_hash, role, status, email_verified_at, last_login_at, created_at, updated_at
      ) values (
        ${"admin_user_1"},
        ${process.env.ADMIN_USERNAME ?? "admin"},
        ${adminEmail},
        ${hashPassword(process.env.ADMIN_PASSWORD ?? "change-me")},
        ${"super-admin"},
        ${"active"},
        ${process.env.ADMIN_FORCE_EMAIL_VERIFICATION === "true" ? null : now},
        ${null},
        ${now},
        ${now}
      )
    `;
  }

  initialized = true;
}
