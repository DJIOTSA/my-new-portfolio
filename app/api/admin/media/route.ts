import { NextResponse } from "next/server";
import { mediaFileSchema } from "@/lib/schemas";
import { getAdminMediaFiles, saveAdminMediaFile } from "@/services/blog-service";

export async function GET() {
  const mediaFiles = await getAdminMediaFiles();
  return NextResponse.json(mediaFiles);
}

export async function PUT(request: Request) {
  const payload = mediaFileSchema.parse(await request.json());
  await saveAdminMediaFile({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
