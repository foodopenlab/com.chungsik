"use client";

import { useApiQuery } from "@/shared/api/useApiQuery";
import { fetchTerms } from "@/shared/terms/api";

const PAIR_COUNT = 6;

export function useGapPairs() {
  const { data } = useApiQuery({ queryKey: ["terms"], queryFn: fetchTerms, staleTime: Infinity });
  return (data?.items ?? []).slice(0, PAIR_COUNT);
}
