import { describe, expect, it } from "vitest";

import type { Metric, Project } from "@/shared/api/types";

import { buildProjectViews } from "./buildProjectViews";

const project = (slug: string, sortOrder: number): Project => ({
  slug, title: slug, problem: "", decision: "", role: "", teamRole: "", status: "",
  docsUrl: null, githubUrl: null, serviceUrl: null, sortOrder,
});

const metric = (id: string, projectSlug: string | null, sortOrder: number): Metric => ({
  id, projectSlug, value: "1", label: "", condition: "c", source: "s", side: "software", attribution: "team", sortOrder,
});

describe("buildProjectViews", () => {
  it("프로젝트 순서대로 자기 스택과 숫자만 붙인다", () => {
    const views = buildProjectViews(
      [project("b", 2), project("a", 1)],
      [{ projectSlug: "a", stackId: "x" }, { projectSlug: "b", stackId: "y" }],
      [metric("m2", "a", 2), metric("career", null, 0), metric("m1", "a", 1)],
    );

    expect(views.map((v) => [v.project.slug, [...v.stackIds], v.metrics.map((m) => m.id)])).toEqual([
      ["a", ["x"], ["m1", "m2"]],
      ["b", ["y"], []],
    ]);
  });
});
