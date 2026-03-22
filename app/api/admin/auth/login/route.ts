import { NextResponse } from "next/server";
import { z } from "zod";
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
    if (error instanceof Error && error.message === "EMAIL_NOT_VERIFIED") {
      return NextResponse.json({ error: "Email not verified", code: "EMAIL_NOT_VERIFIED" }, { status: 403 });
    }

    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 });
  }
}
