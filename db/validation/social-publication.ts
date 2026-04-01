import { z } from "zod";
import { languageCodesSchema } from "@/db/validation/shared";
import { SOCIAL_PLATFORMS, SOCIAL_PUBLICATION_STATUSES } from "@/lib/constants";

export const socialPublicationSchema = z.object({
  id: z.string().min(1),
  blogPostId: z.string().min(1),
  languageCode: languageCodesSchema,
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
