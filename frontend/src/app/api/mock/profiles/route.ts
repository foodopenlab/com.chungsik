import type { ListResponse, Profile } from "@/shared/api/types";

import { profiles } from "../fixtures";

export async function GET() {
  return Response.json({ items: profiles } satisfies ListResponse<Profile>);
}
