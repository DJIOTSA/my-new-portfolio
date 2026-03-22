import { NextResponse } from "next/server";
import { blogCategorySchema } from "@/lib/schemas";
import { getAdminBlogData, saveAdminBlogCategory } from "@/services/blog-service";

export async function GET() {
  const data = await getAdminBlogData();
  return NextResponse.json(data.categories);
}

export async function PUT(request: Request) {
  const payload = blogCategorySchema.parse(await request.json());
  await saveAdminBlogCategory({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
