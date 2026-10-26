import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/projects", () => {
  it("프로젝트 5개를 순서대로 돌려준다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items.map((p: { slug: string }) => p.slug)).toEqual([
      "metabole", "life-tutorial", "localhost-daegu", "townpulse", "remakeday",
    ]);
  });
});
