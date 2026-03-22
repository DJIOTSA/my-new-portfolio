"use client";

import { useQuery } from "@tanstack/react-query";

export function useAdminQuery<TData>(queryKey: readonly string[], endpoint: string) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(endpoint, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      return (await response.json()) as TData;
    }
  });
}
