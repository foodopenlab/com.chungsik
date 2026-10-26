import { describe, expect, it } from "vitest";

import { evenBarTargets } from "./barTargets";

// 막대 2개(x=0, x=1, 폭 0.4): 높이 1과 3. 원래 배치는 왼쪽 막대에 점이 몰려 있다.
function layout() {
  const n = 400;
  const source = new Float32Array(n * 3);
  const target = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    source[i * 3] = i / n;
    const left = i < 380;
    target[i * 3] = (left ? 0 : 1) + (i % 2 ? 0.2 : -0.2);
    target[i * 3 + 1] = i % 3 === 0 ? 0 : left ? 1 : 3;
  }
  return { source, target };
}

describe("evenBarTargets", () => {
  it("점을 막대 높이에 비례해 나눠 모든 막대의 밀도를 같게 한다 — 앞쪽 일부만 그려도 같다", () => {
    const { source, target } = layout();
    const out = evenBarTargets(source, target, 100);
    const leftOf = (from: number, to: number) => {
      let left = 0;
      for (let i = from; i < to; i++) if (out[i * 2] < 0.5) left++;
      return left;
    };
    expect([leftOf(0, 100), leftOf(0, 400)]).toEqual([25, 100]);
  });
});
