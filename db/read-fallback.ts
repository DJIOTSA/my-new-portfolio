const CONNECTION_ERROR_CODES = new Set([
  "ETIMEDOUT",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "CONNECT_TIMEOUT",
  "57P01",
  "XX000"
]);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === "string" ? error : "";
}

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return getErrorMessage(error).includes("DATABASE_URL is not configured");
  }

  const code = "code" in error ? error.code : undefined;
  if (typeof code === "string" && CONNECTION_ERROR_CODES.has(code)) {
    return true;
  }

  const message = getErrorMessage(error);
  return (
    message.includes("DATABASE_URL is not configured") ||
    message.includes("CONNECT_TIMEOUT") ||
    message.includes("ETIMEDOUT") ||
    message.includes("Circuit breaker open") ||
    message.includes("authentication errors")
  );
}

export async function withDbReadFallback<T>(read: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return fallback();
  }
}
