"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";

function AdminVerifyEmailContent() {
  const { locale, adminBasePath } = useAdminLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let active = true;

    async function verify() {
      const response = await fetch("/api/admin/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (!active) {
        return;
      }

      setStatus(response.ok ? "success" : "error");
    }

    if (!token) {
      setStatus("error");
      return;
    }

    void verify();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Verifier l'email admin" : "Verify admin email"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" ? <p className="text-sm text-gray-600">Verifying your email...</p> : null}
          {status === "success" ? <p className="text-sm text-emerald-600">Email verified. You can sign in now.</p> : null}
          {status === "error" ? <p className="text-sm text-red-600">Verification link is invalid or expired.</p> : null}
          <Link href={`${adminBasePath}/login`} className="text-sm text-blue-700 hover:underline">
            {locale === "fr" ? "Retour a la connexion" : "Back to login"}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

export default function AdminVerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50 flex items-center justify-center px-4"><p className="text-sm text-gray-600">Loading verification...</p></main>}>
      <AdminVerifyEmailContent />
    </Suspense>
  );
}
