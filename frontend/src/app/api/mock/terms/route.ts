import type { ListResponse, Term } from "@/shared/api/types";

import { terms } from "../fixtures";

export async function GET() {
  return Response.json({ items: terms } satisfies ListResponse<Term>);
}
