import { z } from "zod";

const translationRecordSchema = <T extends z.ZodObject<z.ZodRawShape>>(shape: T) =>
  z.record(z.enum(["en", "fr"]), shape);

export const heroTranslationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  headline: z.string().min(1),
  availabilityLabel: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  secondaryCtaLabel: z.string().min(1)
});

export const heroSchema = z.object({
  id: z.string().min(1),
  profileImageUrl: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  linkedinUrl: z.string().url(),
  translations: translationRecordSchema(heroTranslationSchema)
});

export const aboutHighlightSchema = z.object({
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

export const skillCategorySchema = z.object({
  id: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      skills: z.array(z.string().min(1)).min(1)
    })
  )
});

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

export const projectSchema = z.object({
  id: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  translations: translationRecordSchema(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      tech: z.array(z.string().min(1)).min(1),
      category: z.string().min(1)
    })
  )
});

export const socialLinkSchema = z.object({
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

export const portfolioAdminSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  skills: z.array(skillCategorySchema),
  services: z.array(serviceSchema),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
  projects: z.array(projectSchema),
  contact: contactSchema
});
