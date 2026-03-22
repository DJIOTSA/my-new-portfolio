"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, FolderKanban, Globe, Image as ImageIcon, LogOut, Mail, Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui";
import { adminFetch, adminJsonFetch } from "@/lib/auth/client";
import type { AdminSession } from "@/lib/types";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

const navItems = [
  { href: "/admin", label: { en: "Overview", fr: "Vue d'ensemble" }, icon: BarChart3 },
  { href: "/admin/portfolio", label: { en: "Portfolio", fr: "Portfolio" }, icon: FolderKanban },
  { href: "/admin/blog", label: { en: "Blog", fr: "Blog" }, icon: BookOpen },
  { href: "/admin/languages", label: { en: "Languages", fr: "Langues" }, icon: Globe },
  { href: "/admin/contact", label: { en: "Leads", fr: "Prospects" }, icon: Mail },
  { href: "/admin/media", label: { en: "Media", fr: "Medias" }, icon: ImageIcon },
  { href: "/admin/social", label: { en: "Social", fr: "Social" }, icon: Share2 },
  { href: "/admin/settings", label: { en: "Settings", fr: "Parametres" }, icon: Settings }
] as const;

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale, adminBasePath } = useAdminLocale();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await adminJsonFetch<{ session: AdminSession }>("/api/admin/auth/session");
        if (!active) {
          return;
        }

        setSession(response.session);
      } catch {
        if (!active) {
          return;
        }

        router.replace(`${adminBasePath}/login`);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSession();
    return () => {
      active = false;
    };
  }, [adminBasePath, router]);

  async function handleLogout() {
    await adminFetch("/api/admin/auth/logout", {
      method: "POST"
    });
    router.replace(`${adminBasePath}/login`);
    router.refresh();
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-600">Checking admin session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="p-6 border-b">
            <Link href={adminBasePath} className="text-xl font-bold text-blue-700">
              Djiotsa CMS
            </Link>
            <p className="text-sm text-gray-700 mt-2">{session.username}</p>
            <p className="text-xs text-gray-500">{session.email}</p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className={`rounded-md px-2 py-1 text-xs ${locale === "en" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`rounded-md px-2 py-1 text-xs ${locale === "fr" ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setLocale("fr")}
              >
                FR
              </button>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = `${adminBasePath}${item.href === "/admin" ? "" : item.href.replace("/admin", "")}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label[locale]}
                </Link>
              );
            })}
          </nav>
          <div className="p-4">
            <Button type="button" variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {locale === "fr" ? "Deconnexion" : "Sign out"}
            </Button>
          </div>
        </aside>
        <main className="p-6 lg:h-screen lg:overflow-y-auto lg:p-10">{children}</main>
      </div>
    </div>
  );
}
