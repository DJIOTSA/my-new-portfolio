import { NextResponse } from "next/server";
import { z } from "zod";
import { resetAdminPassword } from "@/services/auth-service";

export async function POST(request: Request) {
  const body = z.object({
    token: z.string().min(1),
    password: z.string().min(8)
  }).parse(await request.json());

  try {
    await resetAdminPassword(body.token, body.password);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
