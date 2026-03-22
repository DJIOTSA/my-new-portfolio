import { NextResponse } from "next/server";
import { contactEntryStatusSchema } from "@/lib/schemas";
import { getLeadEntries, updateLeadStatus } from "@/services/blog-service";

export async function GET() {
  const entries = await getLeadEntries();
  return NextResponse.json(entries);
}

export async function PUT(request: Request) {
  const payload = contactEntryStatusSchema.parse(await request.json());
  await updateLeadStatus(payload.id, payload.status);
  return NextResponse.json({ success: true });
}
