import { NextResponse } from "next/server";
import { socialPublicationSchema } from "@/lib/schemas";
import { getAdminSocialPublications, saveAdminSocialPublication } from "@/services/blog-service";

export async function GET() {
  const publications = await getAdminSocialPublications();
  return NextResponse.json(publications);
}

export async function PUT(request: Request) {
  const payload = socialPublicationSchema.parse(await request.json());
  await saveAdminSocialPublication({
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
