// 02 TRANSLATE — 번역마다 점구름이 모일 차트 모양. 좌표는 화면 틀(가로 ±1, 세로 ±0.7) 기준.
export type ChartKind = "pareto" | "timeline" | "rounds" | "split";

// tone 0 = --data(하늘), 1 = --scan(주황)
type Rect = { x0: number; x1: number; y0: number; y1: number; tone: number };

const BASE = -0.6;
const MAX_H = 1.2;

function bars(heights: number[]): Rect[] {
  const slot = 1.8 / heights.length;
  return heights.map((h, i) => {
    const x0 = -0.9 + slot * i + slot * 0.2;
    return { x0, x1: x0 + slot * 0.6, y0: BASE, y1: BASE + h * MAX_H, tone: 0 };
  });
}

type Targets = { pos: Float32Array; tone: Float32Array };

// 직사각형들에 면적 비례로 점을 채운다 → 막대마다 밀도가 같다
function fillRects(rects: Rect[], n: number, rand: () => number): Targets {
  const areas = rects.map((r) => (r.x1 - r.x0) * (r.y1 - r.y0));
  const total = areas.reduce((a, b) => a + b, 0);
  const pos = new Float32Array(n * 3);
  const tone = new Float32Array(n);
  let r = 0;
  let acc = areas[0];
  for (let i = 0; i < n; i++) {
    while ((i + 0.5) / n > acc / total && r < rects.length - 1) acc += areas[++r];
    const rect = rects[r];
    pos[i * 3] = rect.x0 + rand() * (rect.x1 - rect.x0);
    pos[i * 3 + 1] = rect.y0 + rand() * (rect.y1 - rect.y0);
    pos[i * 3 + 2] = (rand() - 0.5) * 0.04;
    tone[i] = rect.tone;
  }
  return { pos, tone };
}

// 계산(코드)은 칸이 딱 맞는 격자, 해석(AI)은 길이가 제각각인 글 줄 — 같은 말풍선이 성격이 다른 두 일로 갈라진다
function computeVsInterpret(n: number, rand: () => number): Targets {
  const pos = new Float32Array(n * 3);
  const tone = new Float32Array(n);
  const half = Math.floor(n / 2);
  const [x0, x1, y0, y1] = [-0.9, -0.12, -0.45, 0.45];
  const cols = Math.round(Math.sqrt((half * (x1 - x0)) / (y1 - y0)));
  const rows = Math.ceil(half / cols);
  for (let i = 0; i < half; i++) {
    pos[i * 3] = x0 + ((i % cols) + 0.5) * ((x1 - x0) / cols);
    pos[i * 3 + 1] = y1 - (Math.floor(i / cols) + 0.5) * ((y1 - y0) / rows);
  }
  const lines = [0.78, 0.66, 0.74, 0.5, 0.7, 0.58, 0.32];
  const total = lines.reduce((a, b) => a + b, 0);
  let line = 0;
  let acc = lines[0];
  for (let i = half; i < n; i++) {
    while ((i - half + 0.5) / (n - half) > acc / total && line < lines.length - 1) acc += lines[++line];
    pos[i * 3] = 0.12 + rand() * lines[line];
    pos[i * 3 + 1] = 0.42 - line * 0.14 + (rand() - 0.5) * 0.03;
    pos[i * 3 + 2] = (rand() - 0.5) * 0.04;
    tone[i] = 1;
  }
  return { pos, tone };
}

const SHAPES: Record<ChartKind, (n: number, rand: () => number) => Targets> = {
  // 클레임 유형별 빈도 — 큰 원인부터
  pareto: (n, rand) => fillRects(bars([1, 0.62, 0.4, 0.25, 0.15, 0.09]), n, rand),
  // 비교표 → 일정표: 계약 → 이전·재인증까지 겹치며 이어지는 4개 트랙
  timeline: (n, rand) =>
    fillRects(
      [
        [-0.9, -0.2],
        [-0.5, 0.2],
        [-0.1, 0.6],
        [0.3, 0.9],
      ].map(([x0, x1], i) => ({ x0, x1, y0: 0.33 - i * 0.27, y1: 0.47 - i * 0.27, tone: 0 })),
      n,
      rand,
    ),
  // 차수마다 한 가지씩 바꾸며 오른 처리량
  rounds: (n, rand) => fillRects(bars(Array.from({ length: 10 }, (_, i) => 0.22 + 0.78 * (i / 9) ** 1.3)), n, rand),
  split: computeVsInterpret,
};

// 시드 고정 난수(mulberry32) — 매번 같은 모양
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function chartTargets(kind: ChartKind, n: number): Targets {
  return SHAPES[kind](n, rng(7));
}

// 원래 점과 목표를 x 순서끼리 짝짓는다 — 왼쪽 점은 왼쪽 목표로 가서 덜 엉키고, 말풍선이 반으로 갈라지듯 보인다
export function pairByX(source: Float32Array, target: Targets): Targets {
  const n = target.tone.length;
  const byX = (arr: Float32Array) => Array.from({ length: n }, (_, i) => i).sort((a, b) => arr[a * 3] - arr[b * 3]);
  const src = byX(source);
  const tgt = byX(target.pos);
  const pos = new Float32Array(n * 3);
  const tone = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    pos.set(target.pos.subarray(tgt[k] * 3, tgt[k] * 3 + 3), src[k] * 3);
    tone[src[k]] = target.tone[tgt[k]];
  }
  return { pos, tone };
}
