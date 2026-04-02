import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

export const certificationSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      provider: z.string().min(1),
      count: z.string().min(1)
    })
  )
});
