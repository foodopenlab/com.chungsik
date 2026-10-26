import { describe, expect, it } from "vitest";

import { countUp } from "./countUp";

describe("countUp", () => {
  it("진행률만큼 문자열 속 숫자들을 키우고 나머지 글자는 그대로 둔다", () => {
    expect(countUp("185→925 RPS", 0.5)).toBe("93→463 RPS");
  });

  it("쉼표와 소수 자릿수를 유지한다", () => {
    expect(countUp("500→2,900명", 1)).toBe("500→2,900명");
    expect(countUp("4.3–4.8", 0)).toBe("0.0–0.0");
  });
});
