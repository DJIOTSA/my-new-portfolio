import { NextResponse } from "next/server";
import { z } from "zod";
import { toAdminAuthErrorResponse } from "@/app/api/admin/auth/error-response";
import { loginAdmin } from "@/services/auth-service";

export async function POST(request: Request) {
  const body = z.object({
    identifier: z.string().min(1),
    password: z.string().min(1)
  }).parse(await request.json());

  try {
    const session = await loginAdmin(body.identifier, body.password);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.error("admin login failed", error);
    return toAdminAuthErrorResponse(error, "Unable to sign in.");
  }
}
