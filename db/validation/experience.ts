import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

export const experienceSchema = z.object({
  id: z.string().min(1),
  location: z.string().nullable(),
  current: z.boolean(),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      company: z.string().min(1),
      period: z.string().min(1),
      description: z.array(z.string().min(1)).min(1)
    })
  )
});
