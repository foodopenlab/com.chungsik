import type { Metric, Project, ProjectStack } from "@/shared/api/types";

export type ProjectView = { project: Project; stackIds: ReadonlySet<string>; metrics: Metric[] };

export function buildProjectViews(projects: Project[], links: ProjectStack[], metrics: Metric[]): ProjectView[] {
  return [...projects]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((project) => ({
      project,
      stackIds: new Set(links.filter((l) => l.projectSlug === project.slug).map((l) => l.stackId)),
      metrics: metrics.filter((m) => m.projectSlug === project.slug).sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}
