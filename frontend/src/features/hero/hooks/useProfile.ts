"use client";

import { useApiQuery } from "@/shared/api/useApiQuery";

import { fetchProfiles } from "../api";

export function useProfile() {
  const { data } = useApiQuery({ queryKey: ["profiles"], queryFn: fetchProfiles, staleTime: Infinity });
  return data?.items[0];
}
