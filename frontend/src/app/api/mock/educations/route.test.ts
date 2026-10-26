import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/educations", () => {
  it("AX 아카데미 한 건을 실 API와 같은 기간 형식으로 돌려준다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items.map((e: { startedOn: string; endedOn: string }) => [e.startedOn, e.endedOn])).toEqual([
      ["2026-04-29", "2026-10-27"],
    ]);
  });
});
