import { getSql, logStep } from "./db-utils.mjs";

const sql = getSql();

async function ensurePolicy(tableName, policyName, command, usingExpression, checkExpression = null, roles = ["anon", "authenticated"]) {
  const [existingPolicy] = await sql`
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = ${tableName}
      and policyname = ${policyName}
  `;

  if (existingPolicy) {
    return;
  }

  const rolesSql = roles.map((role) => `"${role}"`).join(", ");
  const usingClause = usingExpression ? ` using (${usingExpression})` : "";
  const checkClause = checkExpression ? ` with check (${checkExpression})` : "";
  await sql.unsafe(
    `create policy "${policyName}" on public.${tableName} for ${command} to ${rolesSql}${usingClause}${checkClause}`
  );
}

async function enableRls(tableName) {
  await sql.unsafe(`alter table public.${tableName} enable row level security`);
}

async function migrate() {
  logStep("Running PostgreSQL migrations...");

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
  await sql`update admin_users set email = coalesce(email, ${process.env.ADMIN_EMAIL ?? "admin@example.com"}) where email is null`;
  await sql`create unique index if not exists admin_users_email_idx on admin_users (email)`;

  await sql`grant usage on schema public to anon, authenticated`;
  await sql`grant select on public.languages, public.site_settings, public.portfolio_documents, public.blog_categories, public.blog_tags, public.blog_authors, public.blog_posts, public.media_files to anon, authenticated`;
  await sql`grant insert on public.contact_entries to anon, authenticated`;
  await sql`grant select, insert, update, delete on public.contact_entries, public.social_publications, public.admin_users, public.admin_refresh_tokens, public.admin_email_verification_tokens, public.admin_password_reset_tokens to authenticated`;
  await sql`grant select, insert, update, delete on public.languages, public.site_settings, public.portfolio_documents, public.blog_categories, public.blog_tags, public.blog_authors, public.blog_posts, public.media_files to authenticated`;

  for (const tableName of [
    "languages",
    "site_settings",
    "portfolio_documents",
    "blog_categories",
    "blog_tags",
    "blog_authors",
    "blog_posts",
    "media_files",
    "contact_entries",
    "social_publications",
    "admin_users",
    "admin_refresh_tokens",
    "admin_email_verification_tokens",
    "admin_password_reset_tokens"
  ]) {
    await enableRls(tableName);
  }

  await ensurePolicy("languages", "public_read_enabled_languages", "select", "enabled = true");
  await ensurePolicy("site_settings", "public_read_site_settings", "select", "true");
  await ensurePolicy("portfolio_documents", "public_read_portfolio_documents", "select", "true");
  await ensurePolicy("blog_categories", "public_read_blog_categories", "select", "true");
  await ensurePolicy("blog_tags", "public_read_blog_tags", "select", "true");
  await ensurePolicy("blog_authors", "public_read_blog_authors", "select", "true");
  await ensurePolicy("blog_posts", "public_read_published_blog_posts", "select", "status = 'published'");
  await ensurePolicy("media_files", "public_read_media_files", "select", "true");

  await ensurePolicy("contact_entries", "public_insert_contact_entries", "insert", null, "true");
  await ensurePolicy("contact_entries", "authenticated_read_contact_entries", "select", "true", null, ["authenticated"]);
  await ensurePolicy("contact_entries", "authenticated_update_contact_entries", "update", "true", "true", ["authenticated"]);
  await ensurePolicy("contact_entries", "authenticated_delete_contact_entries", "delete", "true", null, ["authenticated"]);

  await ensurePolicy("social_publications", "authenticated_manage_social_publications_select", "select", "true", null, ["authenticated"]);
  await ensurePolicy("social_publications", "authenticated_manage_social_publications_insert", "insert", null, "true", ["authenticated"]);
  await ensurePolicy("social_publications", "authenticated_manage_social_publications_update", "update", "true", "true", ["authenticated"]);
  await ensurePolicy("social_publications", "authenticated_manage_social_publications_delete", "delete", "true", null, ["authenticated"]);
  await ensurePolicy("admin_users", "authenticated_manage_admin_users", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("admin_refresh_tokens", "authenticated_manage_admin_refresh_tokens", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("admin_email_verification_tokens", "authenticated_manage_admin_email_verification_tokens", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("admin_password_reset_tokens", "authenticated_manage_admin_password_reset_tokens", "all", "true", "true", ["authenticated"]);

  await ensurePolicy("languages", "authenticated_manage_languages", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("site_settings", "authenticated_manage_site_settings", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("portfolio_documents", "authenticated_manage_portfolio_documents", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("blog_categories", "authenticated_manage_blog_categories", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("blog_tags", "authenticated_manage_blog_tags", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("blog_authors", "authenticated_manage_blog_authors", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("blog_posts", "authenticated_manage_blog_posts", "all", "true", "true", ["authenticated"]);
  await ensurePolicy("media_files", "authenticated_manage_media_files", "all", "true", "true", ["authenticated"]);

  logStep("Migrations completed.");
}

try {
  await migrate();
} finally {
  await sql.end({ timeout: 1 });
}
