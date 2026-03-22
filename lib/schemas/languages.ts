import { z } from "zod";

export const languageSchema = z.object({
  id: z.string().min(1),
  code: z.enum(["en", "fr"]),
  name: z.string().min(1),
  nativeName: z.string().min(1),
  enabled: z.boolean(),
  isDefault: z.boolean(),
  sortOrder: z.number().int().nonnegative()
});
