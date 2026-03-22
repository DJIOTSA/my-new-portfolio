import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, BookOpen, Globe, Image as ImageIcon, LogOut, Mail, Settings, Share2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui";
import { getAdminSession } from "@/services/auth-service";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/languages", label: "Languages", icon: Globe },
  { href: "/admin/contact", label: "Leads", icon: Mail },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/social", label: "Social", icon: Share2 },
  { href: "/admin/settings", label: "Settings", icon: Settings }
] as const;

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="border-r bg-white">
          <div className="p-6 border-b">
            <Link href="/admin" className="text-xl font-bold text-blue-700">
              Djiotsa CMS
            </Link>
            <p className="text-sm text-gray-500 mt-2">{session.username}</p>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action="/api/admin/auth/logout" method="post" className="p-4">
            <Button type="submit" variant="outline" className="w-full justify-start">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </form>
        </aside>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
