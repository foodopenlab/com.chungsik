import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/stack-categories", () => {
  it("카테고리 6개를 슬라이드 순서로 돌려준다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items.map((c: { id: string }) => c.id)).toEqual([
      "frontend", "backend", "data-ai", "infra", "quality", "ai-tools",
    ]);
  });
});
