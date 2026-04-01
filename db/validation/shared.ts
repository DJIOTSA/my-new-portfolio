import { z } from "zod";

export const languageCodesSchema = z.enum(["en", "fr"]);

export const localizedTranslationSchema = <T extends z.ZodObject<z.ZodRawShape>>(shape: T) =>
  z.record(languageCodesSchema, shape);

export const translationRecordSchema = <T extends z.ZodObject<z.ZodRawShape>>(shape: T) =>
  z.record(languageCodesSchema, shape);
