import type { ListResponse, StackCategory } from "@/shared/api/types";

import { stackCategories } from "../fixtures";

export async function GET() {
  return Response.json({ items: stackCategories } satisfies ListResponse<StackCategory>);
}
