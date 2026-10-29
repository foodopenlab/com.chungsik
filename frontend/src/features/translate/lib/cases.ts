import type { ChartKind } from "./chartTargets";

// 지시서 §2 "02 / TRANSLATE" 번역 4건. 숫자는 metric id로만 참조한다.
// model: public/models/obj-{model}.glb·obj-{model}-points.glb
// tilt: 바닥에 눕힌 오브젝트를 세우는 X축 회전, yaw: Y축, roll: Z축(세운 뒤 위아래 바로잡기) — rad
export type TranslateCase = {
  object: string;
  labels: string[];
  structure: string;
  metricIds: string[];
  conclusion: string;
  poster: string;
  model: string;
  chart: ChartKind;
  tilt: number;
  yaw: number;
  roll: number;
  // 화면 틀 안 크기(가장 긴 변) — 없으면 기본값. 밝은 오브젝트가 화면을 덮어 혼자 튀지 않게 줄일 때
  fit?: number;
  // 차트가 완성되면 캔버스 위에 띄우는 라벨(x: 캔버스 가로 %)과 경계선
  chartLabels?: { text: string; x: number; side: "data" | "scan" }[];
  divider?: boolean;
};

export const CASES: TranslateCase[] = [
  {
    object: "클립보드의 클레임 기록지",
    labels: ["유형", "공정", "원료", "계절"],
    structure: "파레토",
    metricIds: ["translate-claims"],
    conclusion: "접수에서 멈추지 않고 분류 체계를 만들었다",
    poster: "/video/translate-1-workbench-poster.webp",
    model: "clipboard",
    chart: "pareto",
    tilt: 1.15,
    yaw: 0,
    roll: 0,
  },
  {
    object: "말린 공장 도면",
    labels: ["면적", "전력", "폐수", "Capacity"],
    structure: "비교표 → 일정표",
    metricIds: ["translate-relocation"],
    conclusion: "“누가 맞나”를 “어떤 조건이 필요한가”로 바꿨다",
    poster: "/video/translate-2-corridor-poster.webp",
    model: "blueprint",
    chart: "timeline",
    tilt: -1.0,
    yaw: 0,
    roll: 0,
  },
  {
    object: "멈춘 모니터",
    labels: ["Worker", "상태", "DB", "Cache"],
    structure: "차수별 막대 — 차수마다 바꾼 것 하나씩(4차만 둘)",
    metricIds: ["metabole-rps", "metabole-users"],
    conclusion: "제조 병목 잡던 방식 그대로",
    poster: "/video/translate-3-pipes-poster.webp",
    model: "crt",
    chart: "rounds",
    tilt: 0,
    yaw: 0.45,
    roll: 0,
  },
  {
    object: "말풍선 “AI가 다 해줬으면”",
    labels: ["계산", "해석"],
    structure: "두 색으로 갈라짐",
    metricIds: ["localhost-daegu-persona"],
    conclusion: "어디까지 맡길지 먼저 정한다",
    poster: "/video/translate-4-panel-poster.webp",
    model: "bubble",
    chart: "split",
    tilt: 0,
    yaw: 0.25,
    roll: 0,
    fit: 0.95,
    chartLabels: [
      { text: "계산 · 코드", x: 26, side: "data" },
      { text: "해석 · AI", x: 74, side: "scan" },
    ],
    divider: true,
  },
];
