import { z } from "zod";
import { localizedTranslationSchema } from "@/db/validation/shared";

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
