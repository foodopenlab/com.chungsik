import { describe, expect, it } from "vitest";

import { stacks } from "../fixtures";
import { GET } from "./route";

describe("GET /api/mock/project-stacks", () => {
  it("모든 연결이 존재하는 스택을 가리킨다", async () => {
    const res = await GET();
    const body = await res.json();
    const ids = new Set(stacks.map((s) => s.id));

    expect(res.status).toBe(200);
    expect(body.items.every((l: { stackId: string }) => ids.has(l.stackId))).toBe(true);
  });
});
