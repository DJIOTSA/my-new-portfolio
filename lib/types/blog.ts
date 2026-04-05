import type { LanguageCode, LocalizedResponseMeta } from "@/lib/types/types";
import type { BLOG_DIFFICULTIES, BLOG_POST_STATUSES, SOCIAL_PLATFORMS, SOCIAL_PUBLICATION_STATUSES } from "@/lib/constants";

export type BlogPostStatus = (typeof BLOG_POST_STATUSES)[number];
export type BlogDifficulty = (typeof BLOG_DIFFICULTIES)[number];
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type SocialPublicationStatus = (typeof SOCIAL_PUBLICATION_STATUSES)[number];

export interface SiteSettingsEntity {
  id: string;
  logoMediaId: number | null;
  defaultOgImageId: number | null;
  contactEmail: string;
  linkedinUrl: string;
  xUrl: string;
  githubUrl: string;
  coursePlatformUrl: string;
  translations: Partial<Record<LanguageCode, {
    siteTitle: string;
    siteDescription: string;
    defaultSeoTitle: string;
    defaultSeoDescription: string;
  }>>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryEntity {
  id: string;
  parentId: string | null;
  orderIndex: number;
  translations: Partial<Record<LanguageCode, { name: string; slug: string; description: string }>>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTagEntity {
  id: string;
  translations: Partial<Record<LanguageCode, { name: string; slug: string }>>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthorEntity {
  id: string;
  avatarMediaId: number | null;
  email: string;
  linkedinUrl: string;
  xUrl: string;
  githubUrl: string;
  translations: Partial<Record<LanguageCode, { name: string; bio: string }>>;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFileEntity {
  id: number;
  storageKey: string;
  fileName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altTranslations: Partial<Record<LanguageCode, { alt: string }>>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostTranslation {
  title: string;
  slug: string;
  excerpt: string;
  contentJson: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  courseCtaTitle: string;
  courseCtaDescription: string;
  courseCtaLabel: string;
  courseCtaUrl: string;
  socialShareTitle: string;
  socialShareDescription: string;
}

export interface BlogPostResource {
  label: string;
  url: string;
  type?: string;
}

export interface BlogPostEntity {
  id: string;
  authorId: string;
  categoryId: string;
  status: BlogPostStatus;
  featured: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  coverMediaId: number | null;
  ogImageMediaId: number | null;
  readingTime: number;
  difficulty: BlogDifficulty;
  tags: string[];
  resources: BlogPostResource[];
  relatedPostIds: string[];
  socialPublishing: Record<string, string | boolean | null>;
  translations: Partial<Record<LanguageCode, BlogPostTranslation>>;
  createdAt: string;
  updatedAt: string;
}

export interface ResolvedBlogPost extends LocalizedResponseMeta, Omit<BlogPostEntity, "translations">, BlogPostTranslation {
  author: BlogAuthorEntity & { name: string; bio: string };
  category: BlogCategoryEntity & { name: string; slug: string; description: string };
  resolvedTags: Array<BlogTagEntity & { name: string; slug: string }>;
  relatedPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
  }>;
}

export interface ContactEntryEntity {
  id: string;
  type: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialPublicationEntity {
  id: string;
  blogPostId: string;
  languageCode: string;
  platform: SocialPlatform;
  status: SocialPublicationStatus;
  generatedText: string;
  finalText: string;
  externalPostId: string | null;
  externalUrl: string | null;
  publishedAt: string | null;
  retryCount: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}
