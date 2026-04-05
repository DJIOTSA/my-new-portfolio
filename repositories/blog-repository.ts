import { ensureDatabase } from "@/db/init";
import { insertRows, selectRows, updateRows } from "@/db/supabase-rest";
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
  const [row] = await selectRows<{
    id: string;
    logo_media_id: number | null;
    default_og_image_id: number | null;
    contact_email: string;
    linkedin_url: string;
    x_url: string;
    github_url: string;
    course_platform_url: string;
    translations: SiteSettingsEntity["translations"];
    created_at: string;
    updated_at: string;
  }>("site_settings", { limit: 1 });

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
  await insertRows("site_settings", {
    id: settings.id,
    logo_media_id: settings.logoMediaId,
    default_og_image_id: settings.defaultOgImageId,
    contact_email: settings.contactEmail,
    linkedin_url: settings.linkedinUrl,
    x_url: settings.xUrl,
    github_url: settings.githubUrl,
    course_platform_url: settings.coursePlatformUrl,
    translations: settings.translations,
    created_at: settings.createdAt,
    updated_at: settings.updatedAt
  }, { onConflict: "id", upsert: true, returning: "minimal" });
}

export async function getBlogCategories(): Promise<BlogCategoryEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
    id: string;
    parent_id: string | null;
    order_index: number;
    translations: BlogCategoryEntity["translations"];
    created_at: string;
    updated_at: string;
  }>("blog_categories", { orderBy: { column: "order_index", ascending: true } });

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
  const rows = await selectRows<{
    id: string;
    translations: BlogTagEntity["translations"];
    created_at: string;
    updated_at: string;
  }>("blog_tags", { orderBy: { column: "created_at", ascending: true } });

  return rows.map((row) => ({
    id: row.id,
    translations: row.translations ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function getBlogAuthors(): Promise<BlogAuthorEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
    id: string;
    avatar_media_id: number | null;
    email: string;
    linkedin_url: string;
    x_url: string;
    github_url: string;
    translations: BlogAuthorEntity["translations"];
    created_at: string;
    updated_at: string;
  }>("blog_authors", { orderBy: { column: "created_at", ascending: true } });

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
  const rows = await selectRows<{
    id: string;
    author_id: string;
    category_id: string;
    status: BlogPostEntity["status"];
    featured: boolean;
    published_at: string | null;
    scheduled_at: string | null;
    cover_media_id: number | null;
    og_image_media_id: number | null;
    reading_time: number;
    difficulty: BlogPostEntity["difficulty"];
    tags: string[];
    resources: BlogPostEntity["resources"];
    related_post_ids: string[];
    social_publishing: BlogPostEntity["socialPublishing"];
    translations: BlogPostEntity["translations"];
    created_at: string;
    updated_at: string;
  }>("blog_posts", { orderBy: { column: "created_at", ascending: false } });

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
  await insertRows("blog_posts", {
    id: post.id,
    author_id: post.authorId,
    category_id: post.categoryId,
    status: post.status,
    featured: post.featured,
    published_at: post.publishedAt,
    scheduled_at: post.scheduledAt,
    cover_media_id: post.coverMediaId,
    og_image_media_id: post.ogImageMediaId,
    reading_time: post.readingTime,
    difficulty: post.difficulty,
    tags: post.tags,
    resources: post.resources,
    related_post_ids: post.relatedPostIds,
    social_publishing: post.socialPublishing,
    translations: post.translations,
    created_at: post.createdAt,
    updated_at: post.updatedAt
  }, { onConflict: "id", upsert: true, returning: "minimal" });
}

export async function saveBlogCategory(category: BlogCategoryEntity): Promise<void> {
  await ensureDatabase();
  await insertRows("blog_categories", {
    id: category.id,
    parent_id: category.parentId,
    order_index: category.orderIndex,
    translations: category.translations,
    created_at: category.createdAt,
    updated_at: category.updatedAt
  }, { onConflict: "id", upsert: true, returning: "minimal" });
}

export async function saveBlogTag(tag: BlogTagEntity): Promise<void> {
  await ensureDatabase();
  await insertRows("blog_tags", {
    id: tag.id,
    translations: tag.translations,
    created_at: tag.createdAt,
    updated_at: tag.updatedAt
  }, { onConflict: "id", upsert: true, returning: "minimal" });
}

export async function createContactEntry(entry: ContactEntryEntity): Promise<void> {
  await ensureDatabase();
  await insertRows("contact_entries", {
    id: entry.id,
    type: entry.type,
    name: entry.name,
    email: entry.email,
    company: entry.company,
    subject: entry.subject,
    message: entry.message,
    status: entry.status,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt
  }, { returning: "minimal" });
}

export async function getContactEntries(): Promise<ContactEntryEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
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
  }>("contact_entries", { orderBy: { column: "created_at", ascending: false } });
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
  await updateRows("contact_entries", {
    status,
    updated_at: new Date().toISOString()
  }, [{ column: "id", operator: "eq", value: id }], { returning: "minimal" });
}

export async function getMediaFiles(): Promise<MediaFileEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
    id: number;
    storage_key: string;
    file_name: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    alt_translations: MediaFileEntity["altTranslations"];
    created_at: string;
    updated_at: string;
  }>("media_files", { orderBy: { column: "created_at", ascending: false } });

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
  await insertRows("media_files", {
    id: file.id,
    storage_key: file.storageKey,
    file_name: file.fileName,
    mime_type: file.mimeType,
    size: file.size,
    width: file.width,
    height: file.height,
    alt_translations: file.altTranslations,
    created_at: file.createdAt,
    updated_at: file.updatedAt
  }, { onConflict: "id", upsert: true, returning: "minimal" });
}

export async function getSocialPublications(): Promise<SocialPublicationEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
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
  }>("social_publications", { orderBy: { column: "created_at", ascending: false } });

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
  await insertRows("social_publications", {
    id: publication.id,
    blog_post_id: publication.blogPostId,
    language_code: publication.languageCode,
    platform: publication.platform,
    status: publication.status,
    generated_text: publication.generatedText,
    final_text: publication.finalText,
    external_post_id: publication.externalPostId,
    external_url: publication.externalUrl,
    published_at: publication.publishedAt,
    retry_count: publication.retryCount,
    error_message: publication.errorMessage,
    created_at: publication.createdAt,
    updated_at: publication.updatedAt
  }, { onConflict: "id", upsert: true, returning: "minimal" });
}
