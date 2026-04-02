import { NextResponse } from "next/server";
import { blogTagSchema } from "@/db/validation/blog-tag";
import { getAdminBlogData, saveAdminBlogTag } from "@/services/blog-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const data = await getAdminBlogData();
  return NextResponse.json(data.tags);
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = blogTagSchema.parse(await request.json());
  await saveAdminBlogTag({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
