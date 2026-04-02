import { getAdminSessionResponse } from "@/services/auth-service";

export async function GET() {
  return getAdminSessionResponse();
}
