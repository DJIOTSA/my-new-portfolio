import { NextResponse } from "next/server";
import { languageSchema } from "@/lib/schemas";
import { getLanguages, upsertLanguages } from "@/services/language-service";

export async function GET() {
  const languages = await getLanguages();
  return NextResponse.json(languages);
}

export async function PUT(request: Request) {
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
