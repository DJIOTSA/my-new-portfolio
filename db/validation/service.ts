import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

export const serviceSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      features: z.array(z.string().min(1)).min(1)
    })
  )
});
