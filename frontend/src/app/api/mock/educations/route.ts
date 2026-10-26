import type { Education, ListResponse } from "@/shared/api/types";

import { educations } from "../fixtures";

export async function GET() {
  return Response.json({ items: educations } satisfies ListResponse<Education>);
}
