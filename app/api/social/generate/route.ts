import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSocialPublication } from "@/services/blog-service";

const schema = z.object({
  postId: z.string().min(1),
  platform: z.enum(["linkedin", "x"]),
  languageCode: z.enum(["en", "fr"])
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const publication = await generateSocialPublication(payload.postId, payload.platform, payload.languageCode);
  return NextResponse.json(publication);
}
