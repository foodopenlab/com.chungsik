import { describe, expect, it } from "vitest";

import { groupStacks } from "./groupStacks";

describe("groupStacks", () => {
  it("카테고리 순서대로 스택을 묶는다", () => {
    const categories = [
      { id: "a", label: "A", sortOrder: 1 },
      { id: "b", label: "B", sortOrder: 2 },
    ];
    const stacks = [
      { id: "y", categoryId: "b", label: "Y", icon: null, monogram: "Y", sortOrder: 1 },
      { id: "x", categoryId: "a", label: "X", icon: "simple-icons:x", monogram: null, sortOrder: 1 },
    ];

    const groups = groupStacks(categories, stacks);

    expect(groups.map((g) => [g.category.id, g.stacks.map((s) => s.id)])).toEqual([
      ["a", ["x"]],
      ["b", ["y"]],
    ]);
  });
});
