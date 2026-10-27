// 서버 전용 — mock 라우트만 import한다. 실 API 시드(backend/alembic/versions/0001_stack.py)와 같은 데이터.
import type { Education, Profile, Stack, StackCategory, Term } from "@/shared/api/types";

const CATEGORIES: [string, string][] = [
  ["frontend", "프론트엔드·웹 화면"],
  ["backend", "백엔드·API와 수집"],
  ["data-ai", "데이터·AI"],
  ["infra", "인프라·배포"],
  ["quality", "테스트·품질"],
  ["ai-tools", "AI 개발 도구"],
];

// [id, categoryId, label, icon, monogram]
const STACKS: [string, string, string, string | null, string | null][] = [
  ["nextjs", "frontend", "Next.js", "simple-icons:nextdotjs", null],
  ["react", "frontend", "React", "simple-icons:react", null],
  ["typescript", "frontend", "TypeScript", "simple-icons:typescript", null],
  ["tailwind", "frontend", "Tailwind CSS", "simple-icons:tailwindcss", null],
  ["maplibre", "frontend", "MapLibre GL", "simple-icons:maplibre", null],
  ["tanstack-query", "frontend", "TanStack Query", "simple-icons:reactquery", null],
  ["flutter", "frontend", "Flutter", "simple-icons:flutter", null],
  ["python", "backend", "Python", "simple-icons:python", null],
  ["fastapi", "backend", "FastAPI", "simple-icons:fastapi", null],
  ["sqlalchemy", "backend", "SQLAlchemy", "simple-icons:sqlalchemy", null],
  ["pydantic", "backend", "Pydantic", "simple-icons:pydantic", null],
  ["alembic", "backend", "Alembic", null, "ALB"],
  ["sse", "backend", "SSE", null, "SSE"],
  ["postgresql", "data-ai", "PostgreSQL", "simple-icons:postgresql", null],
  ["pgvector", "data-ai", "pgvector", null, "pgv"],
  ["ollama", "data-ai", "Ollama", "simple-icons:ollama", null],
  ["bge-m3", "data-ai", "bge-m3", null, "bge"],
  ["gemini", "data-ai", "Gemini", "simple-icons:googlegemini", null],
  ["claude", "data-ai", "Claude", "simple-icons:claude", null],
  ["exaone", "data-ai", "EXAONE", null, "EXA"],
  ["gemma", "data-ai", "Gemma", null, "GMA"],
  ["qwen", "data-ai", "Qwen", "simple-icons:qwen", null],
  ["kanana", "data-ai", "kanana", null, "KNN"],
  ["xgboost", "data-ai", "XGBoost", null, "XGB"],
  ["prophet", "data-ai", "Prophet", null, "PRO"],
  ["scikit-learn", "data-ai", "scikit-learn", "simple-icons:scikitlearn", null],
  ["aws", "infra", "AWS", "simple-icons:amazonaws", null],
  ["kubernetes", "infra", "Kubernetes", "simple-icons:kubernetes", null],
  ["docker", "infra", "Docker", "simple-icons:docker", null],
  ["terraform", "infra", "Terraform", "simple-icons:terraform", null],
  ["argo-cd", "infra", "Argo CD", "simple-icons:argo", null],
  ["github-actions", "infra", "GitHub Actions", "simple-icons:githubactions", null],
  ["vercel", "infra", "Vercel", "simple-icons:vercel", null],
  ["linux", "infra", "Linux", "simple-icons:linux", null],
  ["pytest", "quality", "pytest", "simple-icons:pytest", null],
  ["vitest", "quality", "Vitest", "simple-icons:vitest", null],
  ["k6", "quality", "k6", "simple-icons:k6", null],
  ["playwright", "quality", "Playwright", "simple-icons:playwright", null],
  ["claude-code", "ai-tools", "Claude Code", "simple-icons:anthropic", null],
  ["codex", "ai-tools", "Codex", "simple-icons:openai", null],
  ["github", "ai-tools", "GitHub", "simple-icons:github", null],
];

export const stackCategories: StackCategory[] = CATEGORIES.map(([id, label], i) => ({ id, label, sortOrder: i + 1 }));

export const stacks: Stack[] = STACKS.map(([id, categoryId, label, icon, monogram], i) => ({
  id, categoryId, label, icon, monogram, sortOrder: i + 1,
}));

// 05 DICT 사전 20쌍 — 실 API 시드(0008)와 같은 데이터. 앞 6쌍은 01 GAP에 보인다.
// [field, dev, note]
const TERMS: [string, string, string | null][] = [
  [
    "라인이 자주 서요",
    "downtime_event + 정지사유 코드(작업자가 실제로 입력할 3개만)",
    null
  ],
  [
    "다시 안 나게 해 주세요",
    "원인별 관리기준 = 재발 방지 규칙 + 회귀 테스트",
    "김치 공장 클레임 원인별 관리기준 재설계"
  ],
  [
    "CCP 한계기준",
    "validation rule + alert threshold",
    null
  ],
  [
    "한도견본",
    "입고 검수 기준 데이터셋",
    null
  ],
  [
    "작업일지",
    "이벤트 로그 스키마",
    null
  ],
  [
    "선입선출",
    "FIFO 큐",
    "원부재료 재고 운영"
  ],
  [
    "Audit 연 80회",
    "평가셋 + 재현 가능한 검증",
    null
  ],
  [
    "클레임 유형 분류표",
    "라벨 체계(taxonomy) + 다빈도 집계 쿼리",
    "김치 공장 클레임 재분류(유형·공정·원료·계절)"
  ],
  [
    "절임 조건표",
    "조건부 파라미터 테이블(feature → setpoint)",
    "배추 품종·계절·날씨별 절임조건 데이터화"
  ],
  [
    "염도 편차 관리",
    "허용 오차(tolerance) + 이탈 알림",
    "절임염도 편차 관리"
  ],
  [
    "금속검출기 테스트피스 점검",
    "정기 회귀 테스트 — 테스트피스가 테스트 케이스",
    "금속검출기 검증 체계"
  ],
  [
    "표시사항 검토",
    "규칙 기반 검사 + 근거 조문 검색(RAG)",
    "표시사항 검토 표준화"
  ],
  [
    "로트 추적",
    "추적 ID(trace id) + 이력 테이블 조인",
    "HACCP 이력 관리"
  ],
  [
    "원료 수불부",
    "입고·출고 이벤트의 합(이벤트 소싱)",
    "원부재료 재고·구매"
  ],
  [
    "개선조치 기록",
    "인시던트 리포트(포스트모템)",
    "CCP 이탈 시 개선조치"
  ],
  [
    "병목 공정",
    "처리량을 막는 한 지점 — 한 변수씩 바꾸고 재측정",
    "반자동화 라인 ↔ Metabole 부하 테스트"
  ],
  [
    "일 생산능력",
    "처리량(throughput)",
    "톤/일 ↔ RPS"
  ],
  [
    "HACCP 재인증",
    "배포 전 릴리스 게이트",
    "공장 이전 후 재인증"
  ],
  [
    "설비 배치도",
    "아키텍처 다이어그램 + 마이그레이션 계획",
    "공장 이전 설비 Layout 설계"
  ],
  [
    "SKU별 원가",
    "제품 단위 비용 집계 모델",
    "SKU 원가·손익 관리"
  ]
];

export const terms: Term[] = TERMS.map(([field, dev, note], i) => ({ id: i + 1, field, dev, note, sortOrder: i + 1 }));

export const profiles: Profile[] = [
  {
    id: 1,
    name: "김충식",
    headline: "현장의 말을 개발의 말로 옮깁니다.",
    subtitle:
      "김충식 · 식품기술사 · 식품 현장 10년 5개월\n개발: IBM × RedHat AX 아카데미 7기(2026.04~10) · 해커톤 고용노동부장관상",
  },
];

export const educations: Education[] = [
  {
    id: 1,
    title: "IBM × RedHat AI Transformation Academy",
    organization: "대한상공회의소 · 하이미디어 강남 AI 캠퍼스",
    description: "AI 트랜스포메이션(AX) 과정 7기. Python부터 AI 서비스 설계·배포·운영까지",
    startedOn: "2026-04-29",
    endedOn: "2026-10-27",
    status: "수료",
    award: "우수훈련생",
    sortOrder: 1,
  },
];

export { metrics, projects, projectStacks } from "./fixtures.built";
