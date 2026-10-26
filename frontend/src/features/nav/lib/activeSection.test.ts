import { describe, expect, it } from "vitest";

import { activeSection } from "./activeSection";

describe("activeSection", () => {
  it("기준선을 지난 마지막 섹션이 현재 섹션이고, 첫 섹션 전(HERO)이면 없음(-1)", () => {
    const tops = [800, 1600, 2400];

    expect([activeSection(tops, 400), activeSection(tops, 800), activeSection(tops, 2000)]).toEqual([-1, 0, 1]);
  });
});
