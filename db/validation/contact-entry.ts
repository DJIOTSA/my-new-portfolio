import { z } from "zod";

export const contactEntrySchema = z.object({
  type: z.enum(["contact", "project-inquiry", "consultation"]),
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(1)
});
