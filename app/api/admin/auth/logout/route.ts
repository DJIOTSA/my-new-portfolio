import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/services/auth-service";

export async function POST() {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
}
