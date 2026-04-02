"use client";

import { useQuery } from "@tanstack/react-query";
import { adminJsonFetch } from "@/lib/auth/client";

export function useAdminQuery<TData>(queryKey: readonly string[], endpoint: string) {
  return useQuery({
    queryKey,
    queryFn: () => adminJsonFetch<TData>(endpoint)
  });
}
