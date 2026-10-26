import type { ListResponse, Project } from "@/shared/api/types";

import { projects } from "../fixtures";

export async function GET() {
  return Response.json({ items: projects } satisfies ListResponse<Project>);
}
