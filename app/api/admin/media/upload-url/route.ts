import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSupabasePublicUrl, createSupabaseUploadUrl } from "@/lib/storage/supabase-s3";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  directory: z.string().optional()
});

function buildStorageKey(fileName: string, directory?: string): string {
  const safeDirectory = (directory ?? "media")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/|\/$/g, "");

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const prefix = safeDirectory ? `${safeDirectory}/` : "";
  return `${prefix}${randomUUID()}-${safeFileName}`;
}

export async function POST(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const payload = uploadRequestSchema.parse(await request.json());
  const storageKey = buildStorageKey(payload.fileName, payload.directory);

  try {
    const { uploadUrl } = await createSupabaseUploadUrl({
      key: storageKey,
      contentType: payload.contentType
    });

    return NextResponse.json({
      uploadUrl,
      storageKey,
      publicUrl: buildSupabasePublicUrl(storageKey)
    });
  } catch (error) {
    console.error("Failed to create Supabase upload URL", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
