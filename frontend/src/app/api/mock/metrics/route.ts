import type { ListResponse, Metric } from "@/shared/api/types";

import { metrics } from "../fixtures";

export async function GET() {
  return Response.json({ items: metrics } satisfies ListResponse<Metric>);
}
