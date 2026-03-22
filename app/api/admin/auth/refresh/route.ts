import { NextResponse } from "next/server";
import { refreshAdminSession } from "@/services/auth-service";

export async function POST() {
  const session = await refreshAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true, session });
}
