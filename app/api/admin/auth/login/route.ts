import { NextResponse } from "next/server";
import { createAdminSession, validateAdminCredentials } from "@/services/auth-service";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  if (!body.username || !body.password || !(await validateAdminCredentials(body.username, body.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession(body.username);
  return NextResponse.json({ success: true });
}
