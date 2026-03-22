import { NextResponse } from "next/server";
import { mediaFileSchema } from "@/lib/schemas";
import { getAdminMediaFiles, saveAdminMediaFile } from "@/services/blog-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const mediaFiles = await getAdminMediaFiles();
  return NextResponse.json(mediaFiles);
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = mediaFileSchema.parse(await request.json());
  await saveAdminMediaFile({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
