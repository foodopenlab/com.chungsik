import { apiGet } from "@/shared/api/client";
import type { ListResponse, Stack, StackCategory } from "@/shared/api/types";

export const fetchStackCategories = () => apiGet<ListResponse<StackCategory>>("/stack-categories");

export const fetchStacks = () => apiGet<ListResponse<Stack>>("/stacks");
