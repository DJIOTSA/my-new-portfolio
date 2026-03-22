import { NextResponse } from "next/server";
import { portfolioAdminSchema } from "@/lib/schemas";
import { getPortfolioDocuments, savePortfolioDocuments } from "@/repositories/portfolio-repository";

export async function GET() {
  const data = await getPortfolioDocuments();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const payload = portfolioAdminSchema.parse(await request.json());
  await savePortfolioDocuments(payload);
  return NextResponse.json({ success: true });
}
