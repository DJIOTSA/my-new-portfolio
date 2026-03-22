import { NextResponse } from "next/server";
import { languageSchema } from "@/lib/schemas";
import { getLanguages, upsertLanguages } from "@/services/language-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const languages = await getLanguages();
  return NextResponse.json(languages);
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = languageSchema.array().parse(await request.json());
  await upsertLanguages(
    payload.map((language) => ({
      ...language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  );
  return NextResponse.json({ success: true });
}
