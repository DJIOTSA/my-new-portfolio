import { z } from "zod";
import { localizedTranslationSchema } from "@/db/validation/shared";

export const blogTagSchema = z.object({
  id: z.string().min(1),
  translations: localizedTranslationSchema(
    z.object({
      name: z.string().min(1),
      slug: z.string().min(1)
    })
  )
});
