import { describe, expect, it } from "vitest";

import { translateFrame } from "./translateFrame";

describe("translateFrame", () => {
  it("처음에는 실물 오브젝트만 보인다", () => {
    expect(translateFrame(0)).toMatchObject({ scan: 0, morph: 0, labels: 0, result: 0 });
  });

  it("끝에서는 차트가 완성되고 숫자·결론이 보인다", () => {
    expect(translateFrame(1)).toMatchObject({ scan: 1, morph: 1, result: 1 });
  });
});
