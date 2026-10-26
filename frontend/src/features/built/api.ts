import { apiGet } from "@/shared/api/client";
import type { ListResponse, Project, ProjectStack } from "@/shared/api/types";

export const fetchProjects = () => apiGet<ListResponse<Project>>("/projects");

export const fetchProjectStacks = () => apiGet<ListResponse<ProjectStack>>("/project-stacks");
