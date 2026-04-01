import { NextResponse } from "next/server";
import { toAdminAuthErrorResponse } from "@/app/api/admin/auth/error-response";
import { refreshAdminSession } from "@/services/auth-service";

export async function POST() {
  try {
    const session = await refreshAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("admin refresh failed", error);
    return toAdminAuthErrorResponse(error, "Unable to refresh admin session.");
  }
}
