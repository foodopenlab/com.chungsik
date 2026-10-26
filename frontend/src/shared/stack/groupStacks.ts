import type { Stack, StackCategory } from "@/shared/api/types";

export type StackGroup = { category: StackCategory; stacks: Stack[] };

export function groupStacks(categories: StackCategory[], stacks: Stack[]): StackGroup[] {
  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      category,
      stacks: stacks.filter((s) => s.categoryId === category.id).sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}
