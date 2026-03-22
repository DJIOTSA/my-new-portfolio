import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSocialPublication } from "@/services/blog-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

const schema = z.object({
  postId: z.string().min(1),
  platform: z.enum(["linkedin", "x"]),
  languageCode: z.enum(["en", "fr"])
});

export async function POST(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = schema.parse(await request.json());
  const publication = await generateSocialPublication(payload.postId, payload.platform, payload.languageCode);
  return NextResponse.json(publication);
}
