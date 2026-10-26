import { apiGet } from "@/shared/api/client";
import type { ListResponse, Metric } from "@/shared/api/types";

export const fetchMetrics = () => apiGet<ListResponse<Metric>>("/metrics");
