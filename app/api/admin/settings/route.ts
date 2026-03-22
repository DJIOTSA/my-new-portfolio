import { NextResponse } from "next/server";
import { siteSettingsSchema } from "@/lib/schemas";
import { getAdminSiteSettings, saveAdminSiteSettings } from "@/services/blog-service";

export async function GET() {
  const settings = await getAdminSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const payload = siteSettingsSchema.parse(await request.json());
  const existing = await getAdminSiteSettings();
  await saveAdminSiteSettings({
    ...payload,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
