import { NextResponse } from "next/server";
import { contactEntryStatusSchema } from "@/lib/schemas";
import { getLeadEntries, updateLeadStatus } from "@/services/blog-service";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const entries = await getLeadEntries();
  return NextResponse.json(entries);
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = contactEntryStatusSchema.parse(await request.json());
  await updateLeadStatus(payload.id, payload.status);
  return NextResponse.json({ success: true });
}
