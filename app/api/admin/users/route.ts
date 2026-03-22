import { NextResponse } from "next/server";
import { getAdminUsersForDashboard } from "@/services/auth-service";

export async function GET() {
  const users = await getAdminUsersForDashboard();
  return NextResponse.json(
    users.map((user) => ({
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))
  );
}
