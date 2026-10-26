import { rng } from "@/shared/random/rng";

type Bar = { x0: number; x1: number; y0: number; y1: number };

// glb의 목표 좌표에서 막대 모양만 읽는다 — 막대는 x 정수 간격으로 놓여 있다
function barsOf(target: Float32Array): Bar[] {
  const bars = new Map<number, Bar>();
  for (let i = 0; i < target.length; i += 3) {
    const [x, y] = [target[i], target[i + 1]];
    const b = bars.get(Math.round(x));
    if (!b) bars.set(Math.round(x), { x0: x, x1: x, y0: y, y1: y });
    else Object.assign(b, { x0: Math.min(b.x0, x), x1: Math.max(b.x1, x), y0: Math.min(b.y0, y), y1: Math.max(b.y1, y) });
  }
  return [...bars.entries()].sort((a, b) => a[0] - b[0]).map(([, b]) => b);
}

// 막대 면적에 비례해 점 개수를 나눈다(최대 나머지 방식)
function countsOf(bars: Bar[], n: number) {
  const area = bars.map((b) => (b.x1 - b.x0) * (b.y1 - b.y0));
  const total = area.reduce((s, a) => s + a, 0);
  const exact = area.map((a) => (a / total) * n);
  const counts = exact.map(Math.floor);
  const left = n - counts.reduce((s, c) => s + c, 0);
  exact
    .map((e, i) => [e - Math.floor(e), i] as const)
    .sort((a, b) => b[0] - a[0])
    .slice(0, left)
    .forEach(([, i]) => counts[i]++);
  return counts;
}

// glb의 막대 배정은 원래 점구름의 x 분포를 따라 가운데 막대에 점이 몰려 있다(양 끝 338개 vs 가운데 11,654개).
// 막대 모양은 그대로 두고, 점을 원래 x 순서대로 왼쪽 막대부터 면적 비례로 다시 나눠 모든 막대의 밀도를 같게 한다.
// 결과는 차트 틀 안의 정규 좌표(x·y 0~1, 점마다 2개) — 화면 어디에 그릴지는 셰이더가 정한다.
// 모바일은 앞쪽 firstCount개만 그리므로 [0, firstCount)와 나머지를 따로 나눠 어느 쪽만 그려도 고르게 한다.
export function evenBarTargets(source: Float32Array, target: Float32Array, firstCount: number): Float32Array {
  const n = target.length / 3;
  const bars = barsOf(target);
  const [minX, maxX] = [Math.min(...bars.map((b) => b.x0)), Math.max(...bars.map((b) => b.x1))];
  const [minY, maxY] = [Math.min(...bars.map((b) => b.y0)), Math.max(...bars.map((b) => b.y1))];
  const rand = rng(11);
  const out = new Float32Array(n * 2);
  const assign = (from: number, to: number) => {
    const counts = countsOf(bars, to - from);
    const order = Array.from({ length: to - from }, (_, i) => from + i).sort((a, b) => source[a * 3] - source[b * 3]);
    let k = 0;
    bars.forEach((b, bi) => {
      for (let j = 0; j < counts[bi]; j++, k++) {
        const i = order[k];
        out[i * 2] = (b.x0 + rand() * (b.x1 - b.x0) - minX) / (maxX - minX);
        out[i * 2 + 1] = (b.y0 + rand() * (b.y1 - b.y0) - minY) / (maxY - minY);
      }
    });
  };
  assign(0, firstCount);
  assign(firstCount, n);
  return out;
}
