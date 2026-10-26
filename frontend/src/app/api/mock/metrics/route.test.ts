import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/metrics", () => {
  it("모든 숫자가 측정 조건·출처·귀속을 가진다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(
      body.items.every(
        (m: { condition: string; source: string; attribution: string }) =>
          m.condition && m.source && ["personal", "team"].includes(m.attribution),
      ),
    ).toBe(true);
  });
});
