import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/mock/stacks", () => {
  it("모든 스택이 아이콘이나 모노그램 중 하나를 가진다", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items.every((s: { icon: string | null; monogram: string | null }) => s.icon ?? s.monogram)).toBe(true);
  });
});
