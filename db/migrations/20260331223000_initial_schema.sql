CREATE TABLE "admin_email_verification_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_refresh_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"replaced_by_token_id" text,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text NOT NULL,
	"status" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_authors" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar_media_id" text,
	"email" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"x_url" text NOT NULL,
	"github_url" text NOT NULL,
	"translations" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text,
	"order_index" integer NOT NULL,
	"translations" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"category_id" text NOT NULL,
	"status" text NOT NULL,
	"featured" boolean NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"cover_media_id" text,
	"og_image_media_id" text,
	"reading_time" integer NOT NULL,
	"difficulty" text NOT NULL,
	"tags" jsonb NOT NULL,
	"resources" jsonb NOT NULL,
	"related_post_ids" jsonb NOT NULL,
	"social_publishing" jsonb NOT NULL,
	"translations" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"translations" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"enabled" boolean NOT NULL,
	"is_default" boolean NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_files" (
	"id" text PRIMARY KEY NOT NULL,
	"storage_key" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt_translations" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"section_key" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"logo_media_id" text,
	"default_og_image_id" text,
	"contact_email" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"x_url" text NOT NULL,
	"github_url" text NOT NULL,
	"course_platform_url" text NOT NULL,
	"translations" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_publications" (
	"id" text PRIMARY KEY NOT NULL,
	"blog_post_id" text NOT NULL,
	"language_code" text NOT NULL,
	"platform" text NOT NULL,
	"status" text NOT NULL,
	"generated_text" text NOT NULL,
	"final_text" text NOT NULL,
	"external_post_id" text,
	"external_url" text,
	"published_at" timestamp with time zone,
	"retry_count" integer NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_email_verification_tokens_token_hash_idx" ON "admin_email_verification_tokens" USING btree ("token_hash");
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_password_reset_tokens_token_hash_idx" ON "admin_password_reset_tokens" USING btree ("token_hash");
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_refresh_tokens_token_hash_idx" ON "admin_refresh_tokens" USING btree ("token_hash");
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_username_idx" ON "admin_users" USING btree ("username");
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");
--> statement-breakpoint
CREATE UNIQUE INDEX "languages_code_idx" ON "languages" USING btree ("code");
--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_documents_section_key_idx" ON "portfolio_documents" USING btree ("section_key");
--> statement-breakpoint
ALTER TABLE "admin_email_verification_tokens" ADD CONSTRAINT "admin_email_verification_tokens_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_password_reset_tokens" ADD CONSTRAINT "admin_password_reset_tokens_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "admin_refresh_tokens" ADD CONSTRAINT "admin_refresh_tokens_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_blog_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."blog_authors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "social_publications" ADD CONSTRAINT "social_publications_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
grant usage on schema public to anon, authenticated;
grant select on public.languages, public.site_settings, public.portfolio_documents, public.blog_categories, public.blog_tags, public.blog_authors, public.blog_posts, public.media_files to anon, authenticated;
grant insert on public.contact_entries to anon, authenticated;
grant select, insert, update, delete on public.contact_entries, public.social_publications, public.admin_users, public.admin_refresh_tokens, public.admin_email_verification_tokens, public.admin_password_reset_tokens to authenticated;
grant select, insert, update, delete on public.languages, public.site_settings, public.portfolio_documents, public.blog_categories, public.blog_tags, public.blog_authors, public.blog_posts, public.media_files to authenticated;
--> statement-breakpoint
alter table public.languages enable row level security;
alter table public.site_settings enable row level security;
alter table public.portfolio_documents enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_authors enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media_files enable row level security;
alter table public.contact_entries enable row level security;
alter table public.social_publications enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_refresh_tokens enable row level security;
alter table public.admin_email_verification_tokens enable row level security;
alter table public.admin_password_reset_tokens enable row level security;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'languages' and policyname = 'public_read_enabled_languages'
  ) then
    create policy "public_read_enabled_languages" on public.languages for select to "anon", "authenticated" using (enabled = true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'site_settings' and policyname = 'public_read_site_settings'
  ) then
    create policy "public_read_site_settings" on public.site_settings for select to "anon", "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'portfolio_documents' and policyname = 'public_read_portfolio_documents'
  ) then
    create policy "public_read_portfolio_documents" on public.portfolio_documents for select to "anon", "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_categories' and policyname = 'public_read_blog_categories'
  ) then
    create policy "public_read_blog_categories" on public.blog_categories for select to "anon", "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_tags' and policyname = 'public_read_blog_tags'
  ) then
    create policy "public_read_blog_tags" on public.blog_tags for select to "anon", "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_authors' and policyname = 'public_read_blog_authors'
  ) then
    create policy "public_read_blog_authors" on public.blog_authors for select to "anon", "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blog_posts' and policyname = 'public_read_published_blog_posts'
  ) then
    create policy "public_read_published_blog_posts" on public.blog_posts for select to "anon", "authenticated" using (status = 'published');
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'media_files' and policyname = 'public_read_media_files'
  ) then
    create policy "public_read_media_files" on public.media_files for select to "anon", "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'contact_entries' and policyname = 'public_insert_contact_entries'
  ) then
    create policy "public_insert_contact_entries" on public.contact_entries for insert to "anon", "authenticated" with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'contact_entries' and policyname = 'authenticated_read_contact_entries'
  ) then
    create policy "authenticated_read_contact_entries" on public.contact_entries for select to "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'contact_entries' and policyname = 'authenticated_update_contact_entries'
  ) then
    create policy "authenticated_update_contact_entries" on public.contact_entries for update to "authenticated" using (true) with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'contact_entries' and policyname = 'authenticated_delete_contact_entries'
  ) then
    create policy "authenticated_delete_contact_entries" on public.contact_entries for delete to "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'social_publications' and policyname = 'authenticated_manage_social_publications_select'
  ) then
    create policy "authenticated_manage_social_publications_select" on public.social_publications for select to "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'social_publications' and policyname = 'authenticated_manage_social_publications_insert'
  ) then
    create policy "authenticated_manage_social_publications_insert" on public.social_publications for insert to "authenticated" with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'social_publications' and policyname = 'authenticated_manage_social_publications_update'
  ) then
    create policy "authenticated_manage_social_publications_update" on public.social_publications for update to "authenticated" using (true) with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'social_publications' and policyname = 'authenticated_manage_social_publications_delete'
  ) then
    create policy "authenticated_manage_social_publications_delete" on public.social_publications for delete to "authenticated" using (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'admin_users' and policyname = 'authenticated_manage_admin_users'
  ) then
    create policy "authenticated_manage_admin_users" on public.admin_users for all to "authenticated" using (true) with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'admin_refresh_tokens' and policyname = 'authenticated_manage_admin_refresh_tokens'
  ) then
    create policy "authenticated_manage_admin_refresh_tokens" on public.admin_refresh_tokens for all to "authenticated" using (true) with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'admin_email_verification_tokens' and policyname = 'authenticated_manage_admin_email_verification_tokens'
  ) then
    create policy "authenticated_manage_admin_email_verification_tokens" on public.admin_email_verification_tokens for all to "authenticated" using (true) with check (true);
  end if;
end $$;
--> statement-breakpoint
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'admin_password_reset_tokens' and policyname = 'authenticated_manage_admin_password_reset_tokens'
  ) then
    create policy "authenticated_manage_admin_password_reset_tokens" on public.admin_password_reset_tokens for all to "authenticated" using (true) with check (true);
  end if;
end $$;
