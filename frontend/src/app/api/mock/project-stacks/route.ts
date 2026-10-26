import type { ListResponse, ProjectStack } from "@/shared/api/types";

import { projectStacks } from "../fixtures";

export async function GET() {
  return Response.json({ items: projectStacks } satisfies ListResponse<ProjectStack>);
}
