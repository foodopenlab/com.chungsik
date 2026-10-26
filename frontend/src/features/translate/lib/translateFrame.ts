// 지시서 §2 02 공통 문법: 오브젝트 → 스캔 → 라벨 → 구조화 → 숫자 → 1줄 결론
export type TranslateFrame = { scan: number; labels: number; morph: number; result: number };

const ramp = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)));

export function translateFrame(p: number): TranslateFrame {
  return {
    scan: ramp(p, 0.1, 0.38),
    labels: ramp(p, 0.3, 0.4),
    morph: ramp(p, 0.45, 0.72),
    result: ramp(p, 0.72, 0.82),
  };
}
