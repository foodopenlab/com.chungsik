import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/profiles", () => {
  it("사이트 주인 프로필 한 건을 돌려준다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items.map((p: { name: string }) => p.name)).toEqual(["김충식"]);
  });
});
