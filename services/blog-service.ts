import { resolveLocalizedValue } from "@/lib/utils";
import type {
  BlogCategoryEntity,
  BlogPostEntity,
  BlogTagEntity,
  ContactEntryEntity,
  LanguageCode,
  MediaFileEntity,
  ResolvedBlogPost,
  SiteSettingsEntity,
  SocialPublicationEntity
} from "@/lib/types";
import {
  createContactEntry,
  getBlogAuthors,
  getBlogCategories,
  getBlogPosts,
  getBlogTags,
  getContactEntries,
  getMediaFiles,
  getSiteSettings,
  getSocialPublications,
  saveMediaFile,
  saveSiteSettings,
  saveBlogCategory,
  saveBlogPost,
  saveBlogTag,
  saveSocialPublication,
  updateContactEntryStatus
} from "@/repositories/blog-repository";
import { getDefaultLanguage, resolveRequestedLanguage } from "@/services/language-service";

function resolveCategory(
  category: BlogCategoryEntity,
  requestedLanguage: LanguageCode,
  defaultLanguage: LanguageCode
): BlogCategoryEntity & { name: string; slug: string; description: string } {
  const localized = resolveLocalizedValue(category.translations, requestedLanguage, defaultLanguage);
  return {
    ...category,
    name: localized.value.name,
    slug: localized.value.slug,
    description: localized.value.description
  };
}

function safeResolveCategory(
  category: BlogCategoryEntity,
  requestedLanguage: LanguageCode,
  defaultLanguage: LanguageCode
): (BlogCategoryEntity & { name: string; slug: string; description: string }) | null {
  try {
    return resolveCategory(category, requestedLanguage, defaultLanguage);
  } catch {
    return null;
  }
}

function resolveTags(
  tags: BlogTagEntity[],
  requestedLanguage: LanguageCode,
  defaultLanguage: LanguageCode
): Array<BlogTagEntity & { name: string; slug: string }> {
  return tags.flatMap((tag) => {
    try {
      const localized = resolveLocalizedValue(tag.translations, requestedLanguage, defaultLanguage);
      return [{
        ...tag,
        name: localized.value.name,
        slug: localized.value.slug
      }];
    } catch {
      return [];
    }
  });
}

export async function getBlogListing(language: string | undefined, filters?: {
  categorySlug?: string;
  tagSlug?: string;
}): Promise<{
  posts: ResolvedBlogPost[];
  categories: Array<BlogCategoryEntity & { name: string; slug: string; description: string }>;
  tags: Array<BlogTagEntity & { name: string; slug: string }>;
  featuredPosts: ResolvedBlogPost[];
}> {
  const { effectiveRequestedLanguage, requestedLanguage, defaultLanguage } = await resolveRequestedLanguage(language);
  const [posts, authors, categories, tags] = await Promise.all([
    getBlogPosts(),
    getBlogAuthors(),
    getBlogCategories(),
    getBlogTags()
  ]);

  const resolvedCategories = categories.flatMap((category) => {
    const resolvedCategory = safeResolveCategory(category, effectiveRequestedLanguage, defaultLanguage);
    return resolvedCategory ? [resolvedCategory] : [];
  });
  const resolvedTags = resolveTags(tags, effectiveRequestedLanguage, defaultLanguage);

  const resolvedPosts = posts
    .filter((post) => post.status === "published")
    .flatMap((post) => {
      try {
        return [resolveBlogPostEntity(post, authors, categories, tags, requestedLanguage, effectiveRequestedLanguage, defaultLanguage)];
      } catch {
        return [];
      }
    })
    .filter((post) => {
      const categoryMatches = filters?.categorySlug ? post.category.slug === filters.categorySlug : true;
      const tagMatches = filters?.tagSlug ? post.resolvedTags.some((tag) => tag.slug === filters.tagSlug) : true;
      return categoryMatches && tagMatches;
    });

  return {
    posts: resolvedPosts,
    categories: resolvedCategories,
    tags: resolvedTags,
    featuredPosts: resolvedPosts.filter((post) => post.featured)
  };
}

function resolveBlogPostEntity(
  post: BlogPostEntity,
  authors: Awaited<ReturnType<typeof getBlogAuthors>>,
  categories: BlogCategoryEntity[],
  tags: BlogTagEntity[],
  requestedLanguage: LanguageCode,
  effectiveLanguage: LanguageCode,
  defaultLanguage: LanguageCode
): ResolvedBlogPost {
  const localizedPost = resolveLocalizedValue(post.translations, effectiveLanguage, defaultLanguage);
  const author = authors.find((entry) => entry.id === post.authorId);
  const category = categories.find((entry) => entry.id === post.categoryId);

  if (!author || !category) {
    throw new Error(`Blog post ${post.id} references missing author or category.`);
  }

  const localizedAuthor = resolveLocalizedValue(author.translations, effectiveLanguage, defaultLanguage);
  const localizedCategory = resolveLocalizedValue(category.translations, effectiveLanguage, defaultLanguage);
  const resolvedTags = tags
    .filter((tag) => post.tags.includes(tag.id))
    .flatMap((tag) => {
      try {
        const localizedTag = resolveLocalizedValue(tag.translations, effectiveLanguage, defaultLanguage);
        return [{
          ...tag,
          name: localizedTag.value.name,
          slug: localizedTag.value.slug
        }];
      } catch {
        return [];
      }
    });

  return {
    ...post,
    requestedLanguage,
    effectiveLanguage: localizedPost.effectiveLanguage,
    isFallback: localizedPost.isFallback,
    ...localizedPost.value,
    author: {
      ...author,
      name: localizedAuthor.value.name,
      bio: localizedAuthor.value.bio
    },
    category: {
      ...category,
      name: localizedCategory.value.name,
      slug: localizedCategory.value.slug,
      description: localizedCategory.value.description
    },
    resolvedTags,
    relatedPosts: []
  };
}

export async function getBlogPostBySlug(language: string | undefined, slug: string): Promise<ResolvedBlogPost | null> {
  const { requestedLanguage, effectiveRequestedLanguage, defaultLanguage } = await resolveRequestedLanguage(language);
  const [posts, authors, categories, tags] = await Promise.all([
    getBlogPosts(),
    getBlogAuthors(),
    getBlogCategories(),
    getBlogTags()
  ]);

  const matchedPost = posts.find((post) => {
    const translations = post.translations ?? {};
    const localized =
      translations[effectiveRequestedLanguage] ??
      translations[defaultLanguage] ??
      translations.en ??
      translations.fr;
    return localized?.slug === slug && post.status === "published";
  });

  if (!matchedPost) {
    return null;
  }

  const resolved = resolveBlogPostEntity(
    matchedPost,
    authors,
    categories,
    tags,
    requestedLanguage,
    effectiveRequestedLanguage,
    defaultLanguage
  );
  resolved.relatedPosts = posts
    .filter((post) => matchedPost.relatedPostIds.includes(post.id))
    .flatMap((post) => {
      try {
        const localized = resolveLocalizedValue(post.translations, effectiveRequestedLanguage, defaultLanguage);
        return [{
          id: post.id,
          title: localized.value.title,
          slug: localized.value.slug,
          excerpt: localized.value.excerpt
        }];
      } catch {
        return [];
      }
    });

  return resolved;
}

export async function getFeaturedBlogPosts(language: string | undefined): Promise<ResolvedBlogPost[]> {
  const listing = await getBlogListing(language);
  return listing.featuredPosts;
}

export async function getAdminBlogData(): Promise<{
  posts: BlogPostEntity[];
  categories: BlogCategoryEntity[];
  tags: BlogTagEntity[];
  authors: Awaited<ReturnType<typeof getBlogAuthors>>;
}> {
  const [posts, categories, tags, authors] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getBlogTags(),
    getBlogAuthors()
  ]);

  return { posts, categories, tags, authors };
}

export async function saveAdminBlogPost(post: BlogPostEntity): Promise<void> {
  await saveBlogPost(post);
}

export async function saveAdminBlogCategory(category: BlogCategoryEntity): Promise<void> {
  await saveBlogCategory(category);
}

export async function saveAdminBlogTag(tag: BlogTagEntity): Promise<void> {
  await saveBlogTag(tag);
}

export async function createLead(entry: ContactEntryEntity): Promise<void> {
  await createContactEntry(entry);
}

export async function getLeadEntries(): Promise<ContactEntryEntity[]> {
  return getContactEntries();
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  await updateContactEntryStatus(id, status);
}

export async function getAdminDashboardData(): Promise<{
  totalPosts: number;
  publishedPosts: number;
  totalLeads: number;
  enabledLanguages: number;
}> {
  const [posts, leads, defaultLanguage, settings] = await Promise.all([
    getBlogPosts(),
    getContactEntries(),
    getDefaultLanguage(),
    getSiteSettings()
  ]);
  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((post) => post.status === "published").length,
    totalLeads: leads.length,
    enabledLanguages: settings.translations[defaultLanguage.code] ? 2 : 1
  };
}

export async function getAdminSiteSettings(): Promise<Awaited<ReturnType<typeof getSiteSettings>>> {
  return getSiteSettings();
}

export async function saveAdminSiteSettings(settings: SiteSettingsEntity): Promise<void> {
  await saveSiteSettings(settings);
}

export async function getAdminMediaFiles(): Promise<MediaFileEntity[]> {
  return getMediaFiles();
}

export async function saveAdminMediaFile(file: MediaFileEntity): Promise<void> {
  await saveMediaFile(file);
}

export async function getAdminSocialPublications(): Promise<SocialPublicationEntity[]> {
  return getSocialPublications();
}

export async function saveAdminSocialPublication(publication: SocialPublicationEntity): Promise<void> {
  await saveSocialPublication(publication);
}

export async function generateSocialPublication(
  postId: string,
  platform: SocialPublicationEntity["platform"],
  languageCode: LanguageCode
): Promise<SocialPublicationEntity> {
  const post = (await getBlogPosts()).find((entry) => entry.id === postId);
  const defaultLanguage = (await getDefaultLanguage()).code;

  if (!post) {
    throw new Error("Post not found.");
  }

  const localized = resolveLocalizedValue(post.translations, languageCode, defaultLanguage);
  const generatedText =
    platform === "linkedin"
      ? `${localized.value.socialShareTitle}\n\n${localized.value.excerpt}\n\n${localized.value.canonicalUrl}`
      : `${localized.value.socialShareTitle} ${localized.value.canonicalUrl}`;

  const publication: SocialPublicationEntity = {
    id: `social_${Date.now()}`,
    blogPostId: postId,
    languageCode,
    platform,
    status: "ready",
    generatedText,
    finalText: generatedText,
    externalPostId: null,
    externalUrl: null,
    publishedAt: null,
    retryCount: 0,
    errorMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await saveSocialPublication(publication);
  return publication;
}

export async function savePublication(publication: SocialPublicationEntity): Promise<void> {
  await saveSocialPublication(publication);
}
