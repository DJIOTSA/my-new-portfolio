import { NextResponse } from "next/server";
import { z } from "zod";
import { sendAdminPasswordResetEmail } from "@/services/auth-service";

export async function POST(request: Request) {
  const body = z.object({
    identifier: z.string().min(1)
  }).parse(await request.json());

  await sendAdminPasswordResetEmail(body.identifier);
  return NextResponse.json({ success: true });
}
