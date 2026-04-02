import { NextResponse } from "next/server";
import { getAdminUnauthorizedResponse, getAdminUsersForDashboard } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const users = await getAdminUsersForDashboard();
  return NextResponse.json(
    users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))
  );
}
