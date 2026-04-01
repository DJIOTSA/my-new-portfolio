import { NextResponse } from "next/server";
import { z } from "zod";
import { toAdminAuthErrorResponse } from "@/app/api/admin/auth/error-response";
import { sendAdminVerificationEmail } from "@/services/auth-service";

export async function POST(request: Request) {
  const body = z.object({
    identifier: z.string().min(1)
  }).parse(await request.json());

  try {
    await sendAdminVerificationEmail(body.identifier);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin resend-verification failed", error);
    return toAdminAuthErrorResponse(error, "Unable to send verification email.");
  }
}
