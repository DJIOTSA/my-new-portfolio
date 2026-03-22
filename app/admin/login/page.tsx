"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { locale, adminBasePath } = useAdminLocale();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string; code?: string } | null;
      if (payload?.code === "EMAIL_NOT_VERIFIED") {
        setError("Email not verified. A new verification link has been sent if the account exists.");
        return;
      }

      setError(payload?.error ?? "Invalid credentials");
      return;
    }

    router.push(adminBasePath);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Connexion admin" : "Admin Login"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">{locale === "fr" ? "Email ou nom d'utilisateur" : "Email or username"}</Label>
              <Input id="identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{locale === "fr" ? "Mot de passe" : "Password"}</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full">
              {locale === "fr" ? "Se connecter" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm">
            <Link href={`${adminBasePath}/forgot-password`} className="text-blue-700 hover:underline">
              {locale === "fr" ? "Mot de passe oublie ?" : "Forgot password?"}
            </Link>
            <button
              type="button"
              className="text-blue-700 hover:underline"
              onClick={async () => {
                setError("");
                setMessage("");
                const response = await fetch("/api/admin/auth/resend-verification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ identifier })
                });

                if (!response.ok) {
                  setError("Unable to send verification email.");
                  return;
                }

                setMessage("If the account exists, a verification email has been sent.");
              }}
            >
              {locale === "fr" ? "Renvoyer la verification" : "Resend verification"}
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
