import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

export const educationSchema = z.object({
  id: z.string().min(1),
  gpa: z.string().nullable(),
  type: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      degree: z.string().min(1),
      institution: z.string().min(1)
    })
  )
});
