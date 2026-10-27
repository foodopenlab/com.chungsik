// 0003~0007 시드와 같은 데이터 — 같은 생성 스크립트로 만든다. 근거: docs/project-facts.md
import type { Metric, Project, ProjectStack } from "@/shared/api/types";

const PROJECTS: Omit<Project, "sortOrder">[] = [
  {
    "slug": "metabole",
    "title": "Metabole",
    "problem": "계약 전에 확인하는 서울 동×업종 창업 경고 서비스. 서울 427개 동, 12개 업종을 판정합니다.",
    "decision": "(팀장 결정) 첫 화면에서 지도 지표 선택기를 없애고 판정 하나만 보여 주기로 했습니다. 창업자에게는 지표 대신 '하지 마라 / 한다면 이 업종'이 필요합니다.",
    "role": "팀장 — 방향·우선순위·일정 조율, 산출물과 최종 발표 총괄",
    "teamRole": "3인 팀 Beyond Facade(김충식·신채연·이은상). 프론트·백엔드를 개인별로 나누지 않아 아래 숫자는 모두 팀 성과입니다.",
    "status": "배포 중 · 10/27 종료 예정",
    "award": "최우수상 · 과정 최종 프로젝트 1위",
    "docsUrl": "https://metabole.beyondfacade.cloud",
    "githubUrl": "https://github.com/beyondfacade/cloud.beyondfacade",
    "serviceUrl": "https://www.beyondfacade.cloud"
  },
  {
    "slug": "life-tutorial",
    "title": "Life Tutorial",
    "problem": "고3~사회초년생이 근로계약·임금·주휴수당을 알아도 실제 상황에서 어떻게 말하고 행동할지 연습할 곳이 없습니다. 그 상황을 게임으로 훈련합니다.",
    "decision": "제출물을 실도메인 배포로 대신해 심사위원이 브라우저에서 바로 플레이하게 하자는 결정을 주도했습니다.",
    "role": "팀장 · PM · 전체 설계 — 사업 기획, 시스템 아키텍처, 퀘스트·판정 프롬프트 설계, 서류·발표 총괄",
    "teamRole": "3인 팀 BeyondFacade(이은상: 백엔드·RAG·판정 API / 신채연: 프론트·배틀·허브맵)",
    "status": "해커톤 수상 · API 중단",
    "award": "해커톤 우수상",
    "docsUrl": "https://lifetutorial.beyondfacade.cloud",
    "githubUrl": null,
    "serviceUrl": "https://www.life-tutorial.com"
  },
  {
    "slug": "localhost-daegu",
    "title": "localhost:daegu",
    "problem": "대구 예비창업자가 자기 조건으로 창업자금을 계산·비교하는 서비스입니다. 은행에 물어볼 것을 정리한 상담 준비자료를 들고 창구로 가게 합니다.",
    "decision": "(담당 WBS-022) 오프라인 대비 모델을 같은 기준으로 평가해 임베딩 qwen3-embedding:4b, 생성 gemma4:12b를 대체 경로로 정했습니다. 자동 폴백은 두지 않았습니다.",
    "role": "풀스택 — 기간 일치(지도 선택 연도 → AI 분석)와 AI 진행 표시를 백엔드부터 프론트까지, 백엔드 배포, 운영 주소 가상 고객 테스트",
    "teamRole": "3인 팀(장민석: 팀장·PM/아키텍트 / 류준: 풀스택·자금 점검 동선)",
    "status": "출품 · 배포 후 중단",
    "award": null,
    "docsUrl": "https://053.localhostdaegu.cloud",
    "githubUrl": "https://github.com/localhostdaegu/cloud.localhostdaegu",
    "serviceUrl": "https://localhostdaegu.cloud"
  },
  {
    "slug": "townpulse",
    "title": "TownPulse",
    "problem": "충북 153개 읍·면·동의 인구·빈집·교통·인프라를 하나의 인과관계로 묶어 지자체 담당자가 어느 마을부터 무엇을 할지 판단하도록 돕습니다.",
    "decision": "LLM이 숫자를 지어내지 못하게 서버에서 컨텍스트를 조립하는 구조를 설계했습니다. 예산·지표는 단가 라이브러리와 마을 데이터로 계산하고 LLM은 설명 문장만 씁니다.",
    "role": "팀장 · PM · 아키텍처 총괄 — 도메인 프랙탈 구조 설계·진화, 공공 API 검증",
    "teamRole": "3인 팀 Pulse Lab(이은상: 풀스택·QA / 신채연: 풀스택·해외 전략)",
    "status": "공모전 출품 · 데모 공개",
    "award": null,
    "docsUrl": "https://townpulse.beyondfacade.cloud",
    "githubUrl": "https://github.com/beyondfacade/townpulse.beyondfacade.cloud-",
    "serviceUrl": "https://townpulse.site"
  },
  {
    "slug": "remakeday",
    "title": "REMAKE DAY",
    "problem": "같은 하루를 반복하는 게임으로, 사람이 언제 AI의 제안을 받아들이는지 관찰합니다.",
    "decision": "(팀 결정) NPC 모델을 EXAONE에서 Kanana로 바꿨습니다. 상업 이용 라이선스가 계기였고 Apache 2.0 후보 3종을 같은 기준으로 잰 뒤 골랐습니다.",
    "role": "Scenario Director · Content — 시나리오 콘텐츠(인물·비트·진실 명제), 그림, 사운드(BGM·음성), 개발 허브 콘텐츠",
    "teamRole": "5인 팀(류준: 팀장·AI Agent / 장민석: AI 평가 / 신채연: 게임 프론트 / 이은상: QA·릴리스)",
    "status": "서비스 중 · 탐색적 관찰",
    "award": null,
    "docsUrl": "https://blog.remakeday.com",
    "githubUrl": "https://github.com/remakeday/com.remakeday",
    "serviceUrl": "https://remakeday.com"
  }
];

const PROJECT_STACKS: Record<string, string[]> = {
  "metabole": [
    "nextjs",
    "react",
    "typescript",
    "tailwind",
    "maplibre",
    "tanstack-query",
    "vitest",
    "python",
    "fastapi",
    "sqlalchemy",
    "alembic",
    "pydantic",
    "pytest",
    "sse",
    "postgresql",
    "pgvector",
    "ollama",
    "bge-m3",
    "gemini",
    "claude",
    "gemma",
    "qwen",
    "aws",
    "kubernetes",
    "docker",
    "terraform",
    "argo-cd",
    "github-actions",
    "vercel",
    "k6",
    "claude-code",
    "codex",
    "github"
  ],
  "life-tutorial": [
    "nextjs",
    "react",
    "typescript",
    "tailwind",
    "python",
    "fastapi",
    "sqlalchemy",
    "alembic",
    "pydantic",
    "pytest",
    "postgresql",
    "pgvector",
    "ollama",
    "gemini",
    "exaone",
    "gemma",
    "qwen",
    "docker",
    "vercel",
    "linux",
    "playwright",
    "claude-code",
    "github"
  ],
  "localhost-daegu": [
    "nextjs",
    "react",
    "typescript",
    "tailwind",
    "maplibre",
    "tanstack-query",
    "vitest",
    "playwright",
    "python",
    "fastapi",
    "sqlalchemy",
    "alembic",
    "pydantic",
    "pytest",
    "sse",
    "postgresql",
    "pgvector",
    "gemini",
    "ollama",
    "qwen",
    "gemma",
    "docker",
    "vercel",
    "linux",
    "github",
    "github-actions"
  ],
  "townpulse": [
    "nextjs",
    "typescript",
    "tailwind",
    "python",
    "fastapi",
    "sqlalchemy",
    "sse",
    "postgresql",
    "ollama",
    "exaone",
    "xgboost",
    "prophet",
    "scikit-learn",
    "vercel",
    "github"
  ],
  "remakeday": [
    "nextjs",
    "react",
    "typescript",
    "tailwind",
    "python",
    "fastapi",
    "sqlalchemy",
    "alembic",
    "pydantic",
    "pytest",
    "postgresql",
    "claude",
    "gemini",
    "kanana",
    "gemma",
    "bge-m3",
    "ollama",
    "docker",
    "vercel",
    "playwright",
    "claude-code",
    "codex",
    "github",
    "github-actions"
  ]
};

// [id, projectSlug, value, label, condition, source, side, attribution]
const METRICS: [string, string | null, string, string, string, string, Metric["side"], Metric["attribution"]][] = [
  [
    "metabole-rps",
    "metabole",
    "185→925 RPS",
    "처리량, 부하 테스트 1→9차",
    "로컬, 가짜 LLM(고정 3초), 차수마다 한 가지만 변경, 차수별 1회(흔들림 ±10%). 실제 브라우저 조건 10차는 약 900 RPS",
    "metabole.beyondfacade.cloud/jekyll/load-test",
    "software",
    "team"
  ],
  [
    "metabole-users",
    "metabole",
    "500→2,900명",
    "응답 기준을 지킨 최대 동시접속",
    "처리량과 같은 조건(로컬, 가짜 LLM, 1→9차)",
    "metabole.beyondfacade.cloud/jekyll/load-test",
    "software",
    "team"
  ],
  [
    "metabole-mrr",
    "metabole",
    "MRR 0.940",
    "검색 정확도, bge-m3",
    "검수 233문항, 당시 코퍼스 전수 검색. 운영 HNSW 기준 0.930",
    "metabole.beyondfacade.cloud/jekyll/model-evaluation",
    "software",
    "team"
  ],
  [
    "life-tutorial-award",
    "life-tutorial",
    "고용노동부장관상",
    "해커톤 우수상",
    "2026 제8회 K-디지털 트레이닝 · 지정과제 · 2026-09-04",
    "lifetutorial.beyondfacade.cloud/jekyll/intro/hackathon",
    "award",
    "team"
  ],
  [
    "life-tutorial-rehearsal",
    "life-tutorial",
    "3회",
    "발표 리허설 완주",
    "마감 구간(Sprint 5~6), 현장 네트워크 사고 대비",
    "lifetutorial.beyondfacade.cloud/jekyll/intro/team",
    "software",
    "personal"
  ],
  [
    "life-tutorial-videos",
    "life-tutorial",
    "5편",
    "시연 영상 제작",
    "롱폼 1편 + 숏폼 4편",
    "lifetutorial.beyondfacade.cloud/jekyll/intro/team",
    "software",
    "personal"
  ],
  [
    "localhost-daegu-permits",
    "localhost-daegu",
    "161,115건",
    "인허가 데이터 적재",
    "공공데이터포털 인허가, 7업종 × 8개 구·군, 2026-09-16 첫 적재",
    "053.localhostdaegu.cloud/_posts/2026-09-16-daegu-data-funnel",
    "software",
    "team"
  ],
  [
    "localhost-daegu-products",
    "localhost-daegu",
    "12건",
    "금융상품, 기관 3곳",
    "iM뱅크 3 · 대구신용보증재단 5 · 정책자금 4, 2026-09-18 원문 대조 12/12",
    "053.localhostdaegu.cloud/decisions",
    "software",
    "team"
  ],
  [
    "localhost-daegu-persona",
    "localhost-daegu",
    "10/10",
    "가상 고객 E2E 상담자료 도달",
    "2026-09-19 운영 주소, 헤드리스 Playwright 가상 고객 10명(사람 아님) 순차 실행, 결함 7건 발견",
    "053.localhostdaegu.cloud/docs/testing",
    "software",
    "personal"
  ],
  [
    "townpulse-apis",
    "townpulse",
    "19종",
    "공공 API 실호출 검증",
    "개발계정 승인 후 전 API 실호출 검증. 연동은 팀, 검증은 개인",
    "townpulse.beyondfacade.cloud/docs/team",
    "software",
    "personal"
  ],
  [
    "townpulse-domains",
    "townpulse",
    "34개",
    "도메인 × 11파일 프랙탈",
    "물리 테이블 매핑 25 + 오케스트레이터·보조 9. 코드는 팀, 설계·문서화 총괄은 개인",
    "townpulse.beyondfacade.cloud/docs/system/backend",
    "software",
    "team"
  ],
  [
    "townpulse-iterations",
    "townpulse",
    "13차",
    "아키텍처 버전 진화",
    "v1.0 → v9.5, 열세 차례",
    "townpulse.beyondfacade.cloud/docs/team",
    "software",
    "personal"
  ],
  [
    "remakeday-harness",
    "remakeday",
    "372회 · 오류 0",
    "역할-문항 하네스 실행",
    "2026-09-13, 로컬 후보 4셀(gemma 3종 + gemini-3-flash) × 31문항 × 3반복. 운영 Claude 구성 아님, 최종 폴백 0",
    "research.remakeday.com/experiments/model-selection",
    "software",
    "team"
  ],
  [
    "remakeday-plays",
    "remakeday",
    "14판",
    "사람 플레이 관찰, 10판 완주",
    "2026-09-09~18, 탐색적 관찰. 판수는 참가자 수가 아니며 팀 내부 1판 포함",
    "research.remakeday.com/experiments/human-observations",
    "software",
    "team"
  ],
  [
    "remakeday-ai-rules",
    "remakeday",
    "48/60",
    "AI 제안에서 온 적용 규칙",
    "14판 기준 80%, 원숭이손 수락 17 + AI 추천 31. 탐색적 관찰",
    "research.remakeday.com/experiments/human-observations",
    "software",
    "team"
  ],
  [
    "translate-claims",
    null,
    "100+→15건 미만",
    "연간 클레임",
    "김치 제조(일반 HACCP 인증) 회사 품질·HACCP 총괄(2015~2019). 클레임을 유형·공정·원료·계절로 재분류해 원인별 관리기준 재설계, 약 80%↓",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "translate-relocation",
    null,
    "1월 계약 → 5월 이전",
    "공장 이전 + HACCP 재인증",
    "수산물·축산물 전문 제조 회사, 2025년. 후보 공장 면적·전력·폐수·Capacity 비교 → 설비 Layout, 인허가·재인증 일정을 생산 이전계획과 한 일정표로",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "teach-ncs-years",
    null,
    "5년",
    "NCS 등록 강사",
    "한국식품정보원. 식품기술사·식품위생법·HACCP 팀장교육·식품품질관리·생성형 AI 활용 강의",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "teach-satisfaction",
    null,
    "4.3–4.8",
    "강의 만족도(5점 만점)",
    "과목별 — 품질관리 4.8 · 생성형 AI 활용 4.7 · 식품위생법규 4.6 · 식품기술사 4.5 · HACCP 팀장 4.3",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "teach-youtube-reviews",
    null,
    "8편",
    "유튜브 콘텐츠 대본 검수",
    "한국식품정보원 콘텐츠 EP23~EP44 중 8편",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "hero-staff",
    null,
    "40→11명",
    "투입 인원, 반자동화 라인",
    "수산물·축산물 전문 제조 회사(2020~2025). 전 품목 공정 분석, 포장재·용기 표준화 후 기존·신규 설비를 조합한 반자동화 라인",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "hero-capacity",
    null,
    "3→8톤",
    "일 생산능력, 반자동화 라인",
    "투입 인원과 같은 반자동화 라인 구축 결과",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "gap-field-years",
    null,
    "10년 5개월",
    "식품 제조 현장",
    "김치 제조(일반 HACCP 인증) 회사 4년 7개월 + 수산물·축산물 전문 제조 회사 5년 10개월",
    "본인 이력서(FDE·AX/DX PM)",
    "field",
    "personal"
  ],
  [
    "gap-services",
    null,
    "5종",
    "개발 과정에서 배포한 서비스",
    "Metabole · Life Tutorial · localhost:daegu · TownPulse · REMAKE DAY (팀 프로젝트 포함)",
    "본인 확인(2026-10-26), 04 BUILT 프로젝트",
    "software",
    "team"
  ]
];

export const projects: Project[] = PROJECTS.map((p, i) => ({ ...p, sortOrder: i + 1 }));

// 실 API와 같은 정렬: project_slug, stack_id
export const projectStacks: ProjectStack[] = Object.entries(PROJECT_STACKS)
  .flatMap(([projectSlug, ids]) => ids.map((stackId) => ({ projectSlug, stackId })))
  .sort((a, b) => a.projectSlug.localeCompare(b.projectSlug) || a.stackId.localeCompare(b.stackId));

export const metrics: Metric[] = METRICS.map(([id, projectSlug, value, label, condition, source, side, attribution], i) => ({
  id, projectSlug, value, label, condition, source, side, attribution, sortOrder: i + 1,
}));
