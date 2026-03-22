import type { ReactNode } from "react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
