import { NextResponse } from "next/server";
import { getAdminDashboardData } from "@/services/blog-service";

export async function GET() {
  const data = await getAdminDashboardData();
  return NextResponse.json(data);
}
