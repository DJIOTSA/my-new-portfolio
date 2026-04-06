import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

export const projectSchema = z.object({
  id: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  images: z.array(z.string().min(1)).max(10).optional().default([]),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      tech: z.array(z.string().min(1)).min(1),
      category: z.string().min(1)
    })
  )
});
