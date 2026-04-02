import { z } from "zod";
import { translationRecordSchema } from "@/db/validation/shared";

const socialLinkSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  href: z.string().nullable(),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1)
    })
  )
});

export const contactSchema = z.object({
  id: z.string().min(1),
  availabilityValue: z.string().min(1),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      formTitle: z.string().min(1),
      formTypeLabel: z.string().min(1),
      nameLabel: z.string().min(1),
      namePlaceholder: z.string().min(1),
      emailLabel: z.string().min(1),
      emailPlaceholder: z.string().min(1),
      subjectLabel: z.string().min(1),
      subjectPlaceholder: z.string().min(1),
      messageLabel: z.string().min(1),
      messagePlaceholder: z.string().min(1),
      submitLabel: z.string().min(1)
    })
  ),
  contactLinks: z.array(socialLinkSchema)
});
