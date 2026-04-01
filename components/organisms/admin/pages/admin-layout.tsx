import type { ReactNode } from "react";
import { AdminLocaleProvider } from "@/components/organisms/admin/admin-locale-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLocaleProvider>{children}</AdminLocaleProvider>;
}
