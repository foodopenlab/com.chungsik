// 지시서 §2 HERO: 0% 실사 → 15% 정지·스캔 → 40% 라벨 → 60% 차트 정렬 → 72~92% 차트 고정(스냅) → 흩어짐·제목
export type HeroFrame = {
  playing: boolean;
  scanY: number;
  labels: number;
  morph: number;
  counters: boolean;
  scatter: number;
  title: number;
};

// 완성된 차트·카운터가 머무는 구간. snap 지점에 CSS scroll-snap 자석이 붙는다.
export const CHART_HOLD = { from: 0.72, snap: 0.82, to: 0.92 };

const ramp = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)));

export function heroFrame(p: number): HeroFrame {
  return {
    playing: p < 0.15,
    scanY: ramp(p, 0.15, 0.4),
    labels: ramp(p, 0.35, 0.45) * (1 - ramp(p, 0.55, 0.6)),
    morph: ramp(p, 0.6, CHART_HOLD.from),
    counters: p >= 0.62 && p < CHART_HOLD.to,
    scatter: ramp(p, CHART_HOLD.to, 1),
    title: Math.max(1 - ramp(p, 0.05, 0.15), ramp(p, CHART_HOLD.to, 1)),
  };
}
