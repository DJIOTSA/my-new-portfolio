import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

const heroTranslationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  headline: z.string().min(1),
  availabilityLabel: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  secondaryCtaLabel: z.string().min(1)
});

export const heroSchema = z.object({
  id: z.string().min(1),
  profileImageUrl: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  linkedinUrl: z.string().url(),
  translations: translationRecordSchema(heroTranslationSchema)
});
