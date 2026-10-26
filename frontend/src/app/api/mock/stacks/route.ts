import type { ListResponse, Stack } from "@/shared/api/types";

import { stacks } from "../fixtures";

export async function GET() {
  return Response.json({ items: stacks } satisfies ListResponse<Stack>);
}
