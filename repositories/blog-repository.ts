import { getDb } from "@/lib/db/postgres";
import { ensureDatabase } from "@/lib/db/init";
import type {
  BlogAuthorEntity,
  BlogCategoryEntity,
  BlogPostEntity,
  BlogTagEntity,
  ContactEntryEntity,
  MediaFileEntity,
  SiteSettingsEntity,
  SocialPublicationEntity
} from "@/lib/types";

export async function getSiteSettings(): Promise<SiteSettingsEntity> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    logo_media_id: string | null;
    default_og_image_id: string | null;
    contact_email: string;
    linkedin_url: string;
    x_url: string;
    github_url: string;
    course_platform_url: string;
    translations: SiteSettingsEntity["translations"];
    created_at: string;
    updated_at: string;
  }[]>`select * from site_settings limit 1`;

  if (!row) {
    throw new Error("Site settings not found.");
  }

  return {
    id: row.id,
    logoMediaId: row.logo_media_id,
    defaultOgImageId: row.default_og_image_id,
    contactEmail: row.contact_email,
    linkedinUrl: row.linkedin_url,
    xUrl: row.x_url,
    githubUrl: row.github_url,
    coursePlatformUrl: row.course_platform_url,
    translations: row.translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function saveSiteSettings(settings: SiteSettingsEntity): Promise<void> {
  const sql = getDb();
  await sql`
    insert into site_settings (
      id, logo_media_id, default_og_image_id, contact_email, linkedin_url, x_url,
      github_url, course_platform_url, translations, created_at, updated_at
    ) values (
      ${settings.id},
      ${settings.logoMediaId},
      ${settings.defaultOgImageId},
      ${settings.contactEmail},
      ${settings.linkedinUrl},
      ${settings.xUrl},
      ${settings.githubUrl},
      ${settings.coursePlatformUrl},
      ${JSON.stringify(settings.translations)}::jsonb,
      ${settings.createdAt},
      ${settings.updatedAt}
    )
    on conflict (id) do update
    set logo_media_id = excluded.logo_media_id,
        default_og_image_id = excluded.default_og_image_id,
        contact_email = excluded.contact_email,
        linkedin_url = excluded.linkedin_url,
        x_url = excluded.x_url,
        github_url = excluded.github_url,
        course_platform_url = excluded.course_platform_url,
        translations = excluded.translations,
        updated_at = excluded.updated_at
  `;
}

export async function getBlogCategories(): Promise<BlogCategoryEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    parent_id: string | null;
    order_index: number;
    translations: BlogCategoryEntity["translations"];
    created_at: string;
    updated_at: string;
  }[]>`select * from blog_categories order by order_index asc`;

  return rows.map((row) => ({
    id: row.id,
    parentId: row.parent_id,
    orderIndex: row.order_index,
    translations: row.translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function getBlogTags(): Promise<BlogTagEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    translations: BlogTagEntity["translations"];
    created_at: string;
    updated_at: string;
  }[]>`select * from blog_tags order by created_at asc`;

  return rows.map((row) => ({
    id: row.id,
    translations: row.translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function getBlogAuthors(): Promise<BlogAuthorEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    avatar_media_id: string | null;
    email: string;
    linkedin_url: string;
    x_url: string;
    github_url: string;
    translations: BlogAuthorEntity["translations"];
    created_at: string;
    updated_at: string;
  }[]>`select * from blog_authors order by created_at asc`;

  return rows.map((row) => ({
    id: row.id,
    avatarMediaId: row.avatar_media_id,
    email: row.email,
    linkedinUrl: row.linkedin_url,
    xUrl: row.x_url,
    githubUrl: row.github_url,
    translations: row.translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function getBlogPosts(): Promise<BlogPostEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    author_id: string;
    category_id: string;
    status: BlogPostEntity["status"];
    featured: boolean;
    published_at: string | null;
    scheduled_at: string | null;
    cover_media_id: string | null;
    og_image_media_id: string | null;
    reading_time: number;
    difficulty: BlogPostEntity["difficulty"];
    tags: string[];
    resources: BlogPostEntity["resources"];
    related_post_ids: string[];
    social_publishing: BlogPostEntity["socialPublishing"];
    translations: BlogPostEntity["translations"];
    created_at: string;
    updated_at: string;
  }[]>`select * from blog_posts order by coalesce(published_at, created_at) desc`;

  return rows.map((row) => ({
    id: row.id,
    authorId: row.author_id,
    categoryId: row.category_id,
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
    scheduledAt: row.scheduled_at,
    coverMediaId: row.cover_media_id,
    ogImageMediaId: row.og_image_media_id,
    readingTime: row.reading_time,
    difficulty: row.difficulty,
    tags: row.tags,
    resources: row.resources,
    relatedPostIds: row.related_post_ids,
    socialPublishing: row.social_publishing,
    translations: row.translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function saveBlogPost(post: BlogPostEntity): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    insert into blog_posts (
      id, author_id, category_id, status, featured, published_at, scheduled_at, cover_media_id,
      og_image_media_id, reading_time, difficulty, tags, resources, related_post_ids, social_publishing,
      translations, created_at, updated_at
    ) values (
      ${post.id}, ${post.authorId}, ${post.categoryId}, ${post.status}, ${post.featured}, ${post.publishedAt},
      ${post.scheduledAt}, ${post.coverMediaId}, ${post.ogImageMediaId}, ${post.readingTime}, ${post.difficulty},
      ${JSON.stringify(post.tags)}::jsonb, ${JSON.stringify(post.resources)}::jsonb, ${JSON.stringify(post.relatedPostIds)}::jsonb,
      ${JSON.stringify(post.socialPublishing)}::jsonb, ${JSON.stringify(post.translations)}::jsonb, ${post.createdAt}, ${post.updatedAt}
    )
    on conflict (id) do update
    set author_id = excluded.author_id,
        category_id = excluded.category_id,
        status = excluded.status,
        featured = excluded.featured,
        published_at = excluded.published_at,
        scheduled_at = excluded.scheduled_at,
        cover_media_id = excluded.cover_media_id,
        og_image_media_id = excluded.og_image_media_id,
        reading_time = excluded.reading_time,
        difficulty = excluded.difficulty,
        tags = excluded.tags,
        resources = excluded.resources,
        related_post_ids = excluded.related_post_ids,
        social_publishing = excluded.social_publishing,
        translations = excluded.translations,
        updated_at = excluded.updated_at
  `;
}

export async function saveBlogCategory(category: BlogCategoryEntity): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    insert into blog_categories (id, parent_id, order_index, translations, created_at, updated_at)
    values (${category.id}, ${category.parentId}, ${category.orderIndex}, ${JSON.stringify(category.translations)}::jsonb, ${category.createdAt}, ${category.updatedAt})
    on conflict (id) do update
    set parent_id = excluded.parent_id,
        order_index = excluded.order_index,
        translations = excluded.translations,
        updated_at = excluded.updated_at
  `;
}

export async function saveBlogTag(tag: BlogTagEntity): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    insert into blog_tags (id, translations, created_at, updated_at)
    values (${tag.id}, ${JSON.stringify(tag.translations)}::jsonb, ${tag.createdAt}, ${tag.updatedAt})
    on conflict (id) do update
    set translations = excluded.translations,
        updated_at = excluded.updated_at
  `;
}

export async function createContactEntry(entry: ContactEntryEntity): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    insert into contact_entries (id, type, name, email, company, subject, message, status, created_at, updated_at)
    values (${entry.id}, ${entry.type}, ${entry.name}, ${entry.email}, ${entry.company}, ${entry.subject}, ${entry.message}, ${entry.status}, ${entry.createdAt}, ${entry.updatedAt})
  `;
}

export async function getContactEntries(): Promise<ContactEntryEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    type: string;
    name: string;
    email: string;
    company: string | null;
    subject: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[]>`select * from contact_entries order by created_at desc`;
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    company: row.company,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function updateContactEntryStatus(id: string, status: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    update contact_entries
    set status = ${status},
        updated_at = ${new Date().toISOString()}
    where id = ${id}
  `;
}

export async function getMediaFiles(): Promise<MediaFileEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    storage_key: string;
    file_name: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    alt_translations: MediaFileEntity["altTranslations"];
    created_at: string;
    updated_at: string;
  }[]>`select * from media_files order by created_at desc`;

  return rows.map((row) => ({
    id: row.id,
    storageKey: row.storage_key,
    fileName: row.file_name,
    mimeType: row.mime_type,
    size: row.size,
    width: row.width,
    height: row.height,
    altTranslations: row.alt_translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function saveMediaFile(file: MediaFileEntity): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    insert into media_files (
      id, storage_key, file_name, mime_type, size, width, height, alt_translations, created_at, updated_at
    ) values (
      ${file.id},
      ${file.storageKey},
      ${file.fileName},
      ${file.mimeType},
      ${file.size},
      ${file.width},
      ${file.height},
      ${JSON.stringify(file.altTranslations)}::jsonb,
      ${file.createdAt},
      ${file.updatedAt}
    )
    on conflict (id) do update
    set storage_key = excluded.storage_key,
        file_name = excluded.file_name,
        mime_type = excluded.mime_type,
        size = excluded.size,
        width = excluded.width,
        height = excluded.height,
        alt_translations = excluded.alt_translations,
        updated_at = excluded.updated_at
  `;
}

export async function getSocialPublications(): Promise<SocialPublicationEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    blog_post_id: string;
    language_code: string;
    platform: SocialPublicationEntity["platform"];
    status: SocialPublicationEntity["status"];
    generated_text: string;
    final_text: string;
    external_post_id: string | null;
    external_url: string | null;
    published_at: string | null;
    retry_count: number;
    error_message: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from social_publications order by created_at desc`;

  return rows.map((row) => ({
    id: row.id,
    blogPostId: row.blog_post_id,
    languageCode: row.language_code,
    platform: row.platform,
    status: row.status,
    generatedText: row.generated_text,
    finalText: row.final_text,
    externalPostId: row.external_post_id,
    externalUrl: row.external_url,
    publishedAt: row.published_at,
    retryCount: row.retry_count,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function saveSocialPublication(publication: SocialPublicationEntity): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    insert into social_publications (
      id, blog_post_id, language_code, platform, status, generated_text, final_text, external_post_id, external_url,
      published_at, retry_count, error_message, created_at, updated_at
    ) values (
      ${publication.id}, ${publication.blogPostId}, ${publication.languageCode}, ${publication.platform}, ${publication.status},
      ${publication.generatedText}, ${publication.finalText}, ${publication.externalPostId}, ${publication.externalUrl},
      ${publication.publishedAt}, ${publication.retryCount}, ${publication.errorMessage}, ${publication.createdAt}, ${publication.updatedAt}
    )
    on conflict (id) do update
    set status = excluded.status,
        generated_text = excluded.generated_text,
        final_text = excluded.final_text,
        external_post_id = excluded.external_post_id,
        external_url = excluded.external_url,
        published_at = excluded.published_at,
        retry_count = excluded.retry_count,
        error_message = excluded.error_message,
        updated_at = excluded.updated_at
  `;
}
