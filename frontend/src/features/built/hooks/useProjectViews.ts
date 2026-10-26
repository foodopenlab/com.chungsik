"use client";

import { useApiQuery } from "@/shared/api/useApiQuery";
import { fetchMetrics } from "@/shared/metrics/api";

import { fetchProjects, fetchProjectStacks } from "../api";
import { buildProjectViews } from "../lib/buildProjectViews";

export function useProjectViews() {
  const projects = useApiQuery({ queryKey: ["projects"], queryFn: fetchProjects, staleTime: Infinity });
  const links = useApiQuery({ queryKey: ["project-stacks"], queryFn: fetchProjectStacks, staleTime: Infinity });
  const metrics = useApiQuery({ queryKey: ["metrics"], queryFn: fetchMetrics, staleTime: Infinity });

  return {
    views:
      projects.data && links.data && metrics.data
        ? buildProjectViews(projects.data.items, links.data.items, metrics.data.items)
        : [],
    isPending: projects.isPending || links.isPending || metrics.isPending,
    isError: projects.isError || links.isError || metrics.isError,
  };
}
