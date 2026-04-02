import { NextResponse } from "next/server";
import { socialPublicationSchema } from "@/db/validation/social-publication";
import { getAdminSocialPublications, saveAdminSocialPublication } from "@/services/blog-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const publications = await getAdminSocialPublications();
  return NextResponse.json(publications);
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = socialPublicationSchema.parse(await request.json());
  await saveAdminSocialPublication({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
