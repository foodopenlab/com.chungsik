import { describe, expect, it } from "vitest";

import { chartTargets, pairByX } from "./chartTargets";

const N = 4000;
const xs = (pos: Float32Array) => Array.from({ length: pos.length / 3 }, (_, i) => pos[i * 3]);
const ys = (pos: Float32Array) => Array.from({ length: pos.length / 3 }, (_, i) => pos[i * 3 + 1]);

// x 구간별 최대 높이 — 막대 높이 근사
function barTops(pos: Float32Array, bars: number) {
  const x = xs(pos);
  const y = ys(pos);
  const min = Math.min(...x);
  const width = Math.max(...x) - min;
  const tops = Array(bars).fill(-Infinity);
  x.forEach((v, i) => {
    const b = Math.min(bars - 1, Math.floor(((v - min) / width) * bars));
    tops[b] = Math.max(tops[b], y[i]);
  });
  return tops;
}

describe("chartTargets", () => {
  it("파레토는 왼쪽 막대가 가장 높고 오른쪽으로 갈수록 낮아진다", () => {
    const tops = barTops(chartTargets("pareto", N).pos, 6);
    expect(tops.every((t, i) => i === 0 || t <= tops[i - 1])).toBe(true);
  });

  it("차수별 막대 10개는 오른쪽으로 갈수록 높아진다", () => {
    const tops = barTops(chartTargets("rounds", N).pos, 10);
    expect(tops[9]).toBeGreaterThan(tops[0]);
    expect(tops.every((t, i) => i === 0 || t >= tops[i - 1] - 1e-6)).toBe(true);
  });

  it("두 색 분리는 점의 절반 가까이를 반대 색으로 칠한다", () => {
    const { tone } = chartTargets("split", N);
    const scanShare = tone.reduce((s, t) => s + t, 0) / N;
    expect(scanShare).toBeGreaterThan(0.4);
    expect(scanShare).toBeLessThan(0.6);
  });

  it("두 색 분리에서 계산(왼쪽)은 열이 딱 맞는 격자로 정렬된다", () => {
    const { pos, tone } = chartTargets("split", N);
    const columns = new Set(xs(pos).filter((_, i) => tone[i] === 0).map((x) => x.toFixed(2)));
    expect(columns.size).toBeLessThan(60);
  });

  it("모든 목표 좌표는 화면 틀(가로 ±1, 세로 ±0.7) 안에 있다", () => {
    for (const kind of ["pareto", "timeline", "rounds", "split"] as const) {
      const { pos } = chartTargets(kind, N);
      expect(xs(pos).every((v) => Math.abs(v) <= 1) && ys(pos).every((v) => Math.abs(v) <= 0.7)).toBe(true);
    }
  });
});

describe("pairByX", () => {
  it("원래 가장 왼쪽 점이 가장 왼쪽 목표로, 가장 오른쪽 점이 가장 오른쪽 목표로 간다", () => {
    const source = new Float32Array([0.5, 0, 0, -0.5, 0, 0, 0, 0, 0]);
    const target = { pos: new Float32Array([9, 1, 0, -9, 2, 0, 0, 3, 0]), tone: new Float32Array([1, 0, 0]) };

    const paired = pairByX(source, target);

    expect([paired.pos[0], paired.pos[3], paired.tone[0]]).toEqual([9, -9, 1]);
  });
});
