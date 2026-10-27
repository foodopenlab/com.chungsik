export type ListResponse<T> = { items: T[] };

export type ApiErrorBody = { error: { code: string; message: string } };

export type StackCategory = {
  id: string;
  label: string;
  sortOrder: number;
};

export type Stack = {
  id: string;
  categoryId: string;
  label: string;
  icon: string | null;
  monogram: string | null;
  sortOrder: number;
};

export type Project = {
  slug: string;
  title: string;
  problem: string;
  decision: string;
  role: string;
  teamRole: string;
  status: string;
  award: string | null;
  docsUrl: string | null;
  githubUrl: string | null;
  serviceUrl: string | null;
  sortOrder: number;
};

export type ProjectStack = { projectSlug: string; stackId: string };

export type Metric = {
  id: string;
  projectSlug: string | null;
  value: string;
  label: string;
  condition: string;
  source: string;
  side: "field" | "software" | "award";
  attribution: "personal" | "team";
  sortOrder: number;
};

export type Term = { id: number; field: string; dev: string; note: string | null; sortOrder: number };

export type Profile = { id: number; name: string; headline: string; subtitle: string };

export type Education = {
  id: number;
  title: string;
  organization: string;
  description: string;
  startedOn: string;
  endedOn: string;
  status: string;
  award: string | null;
  sortOrder: number;
};
