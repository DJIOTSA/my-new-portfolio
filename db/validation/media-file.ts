import { z } from "zod";
import { localizedTranslationSchema } from "@/db/validation/shared";

export const mediaFileSchema = z.object({
  id: z.number().int().positive(),
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
