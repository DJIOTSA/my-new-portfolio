import { NextResponse } from "next/server";
import { blogPostSchema } from "@/lib/schemas";
import { getAdminBlogData, saveAdminBlogPost } from "@/services/blog-service";

export async function GET() {
  const data = await getAdminBlogData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const payload = blogPostSchema.parse(await request.json());
  await saveAdminBlogPost({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
