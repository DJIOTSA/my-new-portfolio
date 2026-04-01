import { setTimeout as delay } from "node:timers/promises";

type FilterOperator = "eq" | "ilike" | "in" | "is";

interface Filter {
  column: string;
  operator: FilterOperator;
  value: string | number | boolean | null | Array<string | number>;
}

interface SelectOptions {
  columns?: string;
  filters?: Filter[];
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) {
    throw new Error("SUPABASE_URL is not configured.");
  }

  return url.replace(/\/$/, "");
}

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return key;
}

function encodeFilter(filter: Filter): string {
  if (filter.operator === "is") {
    return `${filter.operator}.${filter.value === null ? "null" : filter.value}`;
  }

  if (filter.operator === "in" && Array.isArray(filter.value)) {
    return `${filter.operator}.(${filter.value.map((entry) => String(entry)).join(",")})`;
  }

  return `${filter.operator}.${String(filter.value)}`;
}

function buildUrl(table: string, options: SelectOptions = {}): string {
  const url = new URL(`${getSupabaseUrl()}/rest/v1/${table}`);
  url.searchParams.set("select", options.columns ?? "*");

  for (const filter of options.filters ?? []) {
    url.searchParams.set(filter.column, encodeFilter(filter));
  }

  if (options.orderBy) {
    url.searchParams.set("order", `${options.orderBy.column}.${options.orderBy.ascending === false ? "desc" : "asc"}`);
  }

  if (typeof options.limit === "number") {
    url.searchParams.set("limit", String(options.limit));
  }

  return url.toString();
}

function getHeaders(extra?: HeadersInit): HeadersInit {
  const key = getServiceRoleKey();

  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra
  };
}

function isRetryableFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toUpperCase();
  const causeCode =
    error.cause && typeof error.cause === "object" && "code" in error.cause
      ? String(error.cause.code).toUpperCase()
      : "";

  return (
    error.name === "AbortError" ||
    message.includes("FETCH FAILED") ||
    message.includes("ETIMEDOUT") ||
    causeCode === "ETIMEDOUT" ||
    causeCode === "ENETUNREACH" ||
    causeCode === "ECONNRESET"
  );
}

async function fetchWithRetry(input: string, init: RequestInit, attempts = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(input, {
        ...init,
        signal: AbortSignal.timeout(12_000)
      });
    } catch (error) {
      lastError = error;

      if (!isRetryableFetchError(error) || attempt === attempts) {
        throw error;
      }

      await delay(250 * attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Supabase REST request failed.");
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Supabase REST request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return [] as T;
  }

  const body = await response.text();
  if (!body.trim()) {
    return [] as T;
  }

  return JSON.parse(body) as T;
}

export async function selectRows<TRow>(table: string, options?: SelectOptions): Promise<TRow[]> {
  const response = await fetchWithRetry(buildUrl(table, options), {
    method: "GET",
    headers: getHeaders()
  });

  return parseResponse<TRow[]>(response);
}

export async function insertRows<TRow>(
  table: string,
  payload: Record<string, unknown> | Array<Record<string, unknown>>,
  options?: { onConflict?: string; upsert?: boolean; returning?: "minimal" | "representation" }
): Promise<TRow[]> {
  const url = new URL(`${getSupabaseUrl()}/rest/v1/${table}`);
  if (options?.onConflict) {
    url.searchParams.set("on_conflict", options.onConflict);
  }

  const response = await fetchWithRetry(url.toString(), {
    method: "POST",
    headers: getHeaders({
      Prefer: `${options?.upsert ? "resolution=merge-duplicates," : ""}return=${options?.returning ?? "representation"}`
    }),
    body: JSON.stringify(payload)
  });

  return parseResponse<TRow[]>(response);
}

export async function updateRows<TRow>(
  table: string,
  payload: Record<string, unknown>,
  filters: Filter[],
  options?: { returning?: "minimal" | "representation" }
): Promise<TRow[]> {
  const url = new URL(`${getSupabaseUrl()}/rest/v1/${table}`);
  for (const filter of filters) {
    url.searchParams.set(filter.column, encodeFilter(filter));
  }

  const response = await fetchWithRetry(url.toString(), {
    method: "PATCH",
    headers: getHeaders({
      Prefer: `return=${options?.returning ?? "representation"}`
    }),
    body: JSON.stringify(payload)
  });

  return parseResponse<TRow[]>(response);
}

export async function deleteRows(
  table: string,
  filters: Filter[],
  options?: { returning?: "minimal" | "representation" }
): Promise<void> {
  const url = new URL(`${getSupabaseUrl()}/rest/v1/${table}`);
  for (const filter of filters) {
    url.searchParams.set(filter.column, encodeFilter(filter));
  }

  const response = await fetchWithRetry(url.toString(), {
    method: "DELETE",
    headers: getHeaders({
      Prefer: `return=${options?.returning ?? "minimal"}`
    })
  });

  await parseResponse<void>(response);
}
