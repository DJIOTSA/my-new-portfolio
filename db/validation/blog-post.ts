import { z } from "zod";
import { localizedTranslationSchema } from "@/db/validation/shared";
import { BLOG_DIFFICULTIES, BLOG_POST_STATUSES } from "@/lib/constants";

export const blogPostSchema = z.object({
  id: z.string().min(1),
  authorId: z.string().min(1),
  categoryId: z.string().min(1),
  status: z.enum(BLOG_POST_STATUSES),
  featured: z.boolean(),
  publishedAt: z.string().nullable(),
  scheduledAt: z.string().nullable(),
  coverMediaId: z.number().int().positive().nullable(),
  ogImageMediaId: z.number().int().positive().nullable(),
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
