import { z } from "zod";
import { aboutSchema } from "@/db/validation/about";
import { certificationSchema } from "@/db/validation/certification";
import { contactSchema } from "@/db/validation/contact-section";
import { educationSchema } from "@/db/validation/education";
import { experienceSchema } from "@/db/validation/experience";
import { heroSchema } from "@/db/validation/hero";
import { projectSchema } from "@/db/validation/project";
import { serviceSchema } from "@/db/validation/service";
import { skillCategorySchema } from "@/db/validation/skill-category";

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
