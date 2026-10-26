"use client";

import { useApiQuery } from "@/shared/api/useApiQuery";
import { fetchTerms } from "@/shared/terms/api";

export function useTerms() {
  return useApiQuery({ queryKey: ["terms"], queryFn: fetchTerms, staleTime: Infinity });
}
