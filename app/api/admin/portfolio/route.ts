import { NextResponse } from "next/server";
import { portfolioAdminSchema } from "@/lib/schemas";
import { getPortfolioDocuments, savePortfolioDocuments } from "@/repositories/portfolio-repository";
import { getAdminUnauthorizedResponse } from "@/services/auth-service";

export async function GET() {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const data = await getPortfolioDocuments();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const unauthorizedResponse = await getAdminUnauthorizedResponse();
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }
  const payload = portfolioAdminSchema.parse(await request.json());
  await savePortfolioDocuments(payload);
  return NextResponse.json({ success: true });
}
