import { describe, expect, it } from "vitest";

import type { Term } from "@/shared/api/types";

import { translate } from "./translate";

const terms: Term[] = [
  { id: 1, field: "CCP 한계기준", dev: "validation rule + alert threshold", note: null, sortOrder: 1 },
  { id: 2, field: "작업일지", dev: "이벤트 로그 스키마", note: null, sortOrder: 2 },
];

describe("translate", () => {
  it("현장 용어 일부만 쳐도 개발 용어로 바꾼다", () => {
    expect(translate("ccp", terms)?.to).toBe("validation rule + alert threshold");
  });

  it("개발 용어를 치면 현장 용어로 바꾸고, 입력이 개발 쪽이었다고 표시한다", () => {
    expect(translate("이벤트로그 스키마", terms)).toMatchObject({ to: "작업일지", fromField: false });
  });

  it("사전에 없으면 null을 돌려준다", () => {
    expect(translate("MES", terms)).toBeNull();
  });
});
