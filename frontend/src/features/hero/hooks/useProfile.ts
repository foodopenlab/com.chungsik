"use client";

import { useApiQuery } from "@/shared/api/useApiQuery";

import { fetchProfiles } from "../api";

export function useProfile(enabled = true) {
  const { data } = useApiQuery({ queryKey: ["profiles"], queryFn: fetchProfiles, staleTime: Infinity, enabled });
  return data?.items[0];
}
