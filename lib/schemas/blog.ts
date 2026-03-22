import { z } from "zod";
import { BLOG_DIFFICULTIES, BLOG_POST_STATUSES, SOCIAL_PLATFORMS, SOCIAL_PUBLICATION_STATUSES } from "@/lib/constants";

const localizedTranslationSchema = <T extends z.ZodObject<z.ZodRawShape>>(shape: T) =>
  z.record(z.enum(["en", "fr"]), shape);

const siteSettingsTranslationSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  defaultSeoTitle: z.string().min(1),
  defaultSeoDescription: z.string().min(1)
});

export const siteSettingsSchema = z.object({
  id: z.string().min(1),
  logoMediaId: z.string().nullable(),
  defaultOgImageId: z.string().nullable(),
  contactEmail: z.string().email(),
  linkedinUrl: z.string().url(),
  xUrl: z.string().url(),
  githubUrl: z.string().url(),
  coursePlatformUrl: z.string().url(),
  translations: localizedTranslationSchema(siteSettingsTranslationSchema)
});

export const blogCategorySchema = z.object({
  id: z.string().min(1),
  parentId: z.string().nullable(),
  orderIndex: z.number().int().nonnegative(),
  translations: localizedTranslationSchema(
    z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1)
    })
  )
});

export const blogTagSchema = z.object({
  id: z.string().min(1),
  translations: localizedTranslationSchema(
    z.object({
      name: z.string().min(1),
      slug: z.string().min(1)
    })
  )
});

export const blogPostSchema = z.object({
  id: z.string().min(1),
  authorId: z.string().min(1),
  categoryId: z.string().min(1),
  status: z.enum(BLOG_POST_STATUSES),
  featured: z.boolean(),
  publishedAt: z.string().nullable(),
  scheduledAt: z.string().nullable(),
  coverMediaId: z.string().nullable(),
  ogImageMediaId: z.string().nullable(),
  readingTime: z.number().int().positive(),
  difficulty: z.enum(BLOG_DIFFICULTIES),
  tags: z.array(z.string().min(1)),
  resources: z.array(
    z.object({
      label: z.string().min(1),
      url: z.string().url(),
      type: z.string().optional()
    })
  ),
  relatedPostIds: z.array(z.string().min(1)),
  socialPublishing: z.record(z.string(), z.union([z.string(), z.boolean(), z.null()])),
  translations: localizedTranslationSchema(
    z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().min(1),
      contentJson: z.string().min(1),
      contentHtml: z.string().min(1),
      seoTitle: z.string().min(1),
      seoDescription: z.string().min(1),
      canonicalUrl: z.string().url(),
      courseCtaTitle: z.string().min(1),
      courseCtaDescription: z.string().min(1),
      courseCtaLabel: z.string().min(1),
      courseCtaUrl: z.string().url(),
      socialShareTitle: z.string().min(1),
      socialShareDescription: z.string().min(1)
    })
  )
});

export const socialPublicationSchema = z.object({
  id: z.string().min(1),
  blogPostId: z.string().min(1),
  languageCode: z.enum(["en", "fr"]),
  platform: z.enum(SOCIAL_PLATFORMS),
  status: z.enum(SOCIAL_PUBLICATION_STATUSES),
  generatedText: z.string().min(1),
  finalText: z.string().min(1),
  externalPostId: z.string().nullable(),
  externalUrl: z.string().nullable(),
  publishedAt: z.string().nullable(),
  retryCount: z.number().int().nonnegative(),
  errorMessage: z.string().nullable()
});

export const contactEntrySchema = z.object({
  type: z.enum(["contact", "project-inquiry", "consultation"]),
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(1)
});

export const contactEntryStatusSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(1)
});

export const mediaFileSchema = z.object({
  id: z.string().min(1),
  storageKey: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  altTranslations: localizedTranslationSchema(
    z.object({
      alt: z.string().min(1)
    })
  )
});
