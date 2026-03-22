"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

function AdminResetPasswordContent() {
  const { locale, adminBasePath } = useAdminLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/admin/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    if (!response.ok) {
      setError("Reset link is invalid or expired.");
      return;
    }

    setMessage("Password updated. You can sign in now.");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Choisir un nouveau mot de passe" : "Choose a new password"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{locale === "fr" ? "Nouveau mot de passe" : "New password"}</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{locale === "fr" ? "Confirmer le mot de passe" : "Confirm password"}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </div>
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full">
              {locale === "fr" ? "Reinitialiser le mot de passe" : "Reset password"}
            </Button>
          </form>
          <Link href={`${adminBasePath}/login`} className="text-sm text-blue-700 hover:underline">
            {locale === "fr" ? "Retour a la connexion" : "Back to login"}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50 flex items-center justify-center px-4"><p className="text-sm text-gray-600">Loading reset form...</p></main>}>
      <AdminResetPasswordContent />
    </Suspense>
  );
}
