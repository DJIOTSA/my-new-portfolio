import { NextResponse } from "next/server";
import { contactEntrySchema } from "@/db/validation/contact-entry";
import { createLead } from "@/services/blog-service";

export async function POST(request: Request) {
  const payload = contactEntrySchema.parse(await request.json());
  await createLead({
    id: `contact_${Date.now()}`,
    type: payload.type,
    name: payload.name,
    email: payload.email,
    company: payload.company ?? null,
    subject: payload.subject,
    message: payload.message,
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}
