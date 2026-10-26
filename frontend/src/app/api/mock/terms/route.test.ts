import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/terms", () => {
  it("사전 항목을 정렬 순서대로 돌려준다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect([body.items.length, body.items[0].field]).toEqual([20, "라인이 자주 서요"]);
  });
});
