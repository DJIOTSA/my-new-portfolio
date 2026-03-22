import { NextResponse } from "next/server";
import { blogTagSchema } from "@/lib/schemas";
import { getAdminBlogData, saveAdminBlogTag } from "@/services/blog-service";

export async function GET() {
  const data = await getAdminBlogData();
  return NextResponse.json(data.tags);
}

export async function PUT(request: Request) {
  const payload = blogTagSchema.parse(await request.json());
  await saveAdminBlogTag({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
