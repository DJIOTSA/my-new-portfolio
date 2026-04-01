import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

const aboutHighlightSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1)
    })
  )
});

export const aboutSchema = z.object({
  id: z.string().min(1),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      paragraphs: z.array(z.string().min(1)).min(1)
    })
  ),
  highlights: z.array(aboutHighlightSchema)
});
