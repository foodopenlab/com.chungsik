import { useApiQuery } from "@/shared/api/useApiQuery";
import type { Metric } from "@/shared/api/types";
import { fetchMetrics } from "@/shared/metrics/api";

export function useMetricsById(): ReadonlyMap<string, Metric> {
  const { data } = useApiQuery({ queryKey: ["metrics"], queryFn: fetchMetrics, staleTime: Infinity });
  return new Map((data?.items ?? []).map((m) => [m.id, m]));
}
