import { describe, expect, it } from "vitest";

import { config } from "./config";

describe("config", () => {
  it("NEXT_PUBLIC_API_BASE가 없으면 mock API를 쓴다", () => {
    expect(config.apiBase).toBe("/api/mock");
  });
});
