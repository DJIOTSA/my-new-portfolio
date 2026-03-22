import { NextResponse } from "next/server";
import { getAdminDashboardData } from "@/services/blog-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const data = await getAdminDashboardData();
  return NextResponse.json(data);
}
