import { z } from "zod";
import { localizedTranslationSchema } from "@/db/validation/shared";

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
