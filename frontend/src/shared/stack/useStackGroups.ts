
import { useApiQuery } from "@/shared/api/useApiQuery";

import { fetchStackCategories, fetchStacks } from "./api";
import { groupStacks } from "./groupStacks";

export function useStackGroups() {
  const categories = useApiQuery({ queryKey: ["stack-categories"], queryFn: fetchStackCategories, staleTime: Infinity });
  const stacks = useApiQuery({ queryKey: ["stacks"], queryFn: fetchStacks, staleTime: Infinity });

  return {
    groups: categories.data && stacks.data ? groupStacks(categories.data.items, stacks.data.items) : [],
    isPending: categories.isPending || stacks.isPending,
    isError: categories.isError || stacks.isError,
  };
}
