"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

export default function AdminForgotPasswordPage() {
  const { locale, adminBasePath } = useAdminLocale();
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier })
    });

    if (!response.ok) {
      setError("Unable to send reset email.");
      return;
    }

    setMessage("If the account exists, a reset email has been sent.");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Reinitialiser le mot de passe admin" : "Reset admin password"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">{locale === "fr" ? "Email ou nom d'utilisateur" : "Email or username"}</Label>
              <Input id="identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
            </div>
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full">
              {locale === "fr" ? "Envoyer le lien de reinitialisation" : "Send reset link"}
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
