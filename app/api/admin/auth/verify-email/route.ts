import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminEmail } from "@/services/auth-service";

export async function POST(request: Request) {
  const body = z.object({
    token: z.string().min(1)
  }).parse(await request.json());

  try {
    await verifyAdminEmail(body.token);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
