"use client";

async function tryRefreshSession(): Promise<boolean> {
  const response = await fetch("/api/admin/auth/refresh", {
    method: "POST",
    credentials: "include"
  });

  return response.ok;
}

export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include"
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await tryRefreshSession();
  if (!refreshed) {
    return response;
  }

  return fetch(input, {
    ...init,
    credentials: "include"
  });
}

export async function adminJsonFetch<TData>(input: RequestInfo | URL, init?: RequestInit): Promise<TData> {
  const response = await adminFetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as TData;
}
