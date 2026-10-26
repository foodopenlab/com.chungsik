"use client";

import { useApiQuery } from "@/shared/api/useApiQuery";

import { fetchEducations } from "../api";

export function useEducations() {
  const { data } = useApiQuery({ queryKey: ["educations"], queryFn: fetchEducations, staleTime: Infinity });
  return data?.items ?? [];
}
