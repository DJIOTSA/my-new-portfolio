import { z } from "zod";

export const contactEntryStatusSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(1)
});
