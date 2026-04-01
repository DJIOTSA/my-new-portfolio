import { NextResponse } from "next/server";

function isDatabaseConnectivityError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = "code" in error ? String(error.code) : "";
  const message = error.message.toUpperCase();

  return [
    "CONNECT_TIMEOUT",
    "ETIMEDOUT",
    "ENETUNREACH",
    "ECONNREFUSED"
  ].includes(code) || message.includes("CONNECT_TIMEOUT") || message.includes("ETIMEDOUT");
}

export function toAdminAuthErrorResponse(error: unknown, fallbackMessage: string) {
  if (isDatabaseConnectivityError(error)) {
    return NextResponse.json(
      {
        error: "Database connection failed. The app cannot reach the Supabase database from the current runtime environment."
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
