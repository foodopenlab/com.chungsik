## [v0.5.2] - 2026-10-26

### Changed
- 07 제목 "가르치고, 연락받습니다" → "가르친 5년, 그리고 연락처"(다른 섹션처럼 명사로 끝나게). 연수는 `teach-ncs-years` metric 값을 그대로 씀

## [v0.5.1] - 2026-10-26

### Changed
- mock 픽스처 `life-tutorial-award`를 백엔드 `0009`와 같게: 라벨 `해커톤 우수상`, 값 `고용노동부장관상`, 조건에 대회명·날짜

## [v0.5.0] - 2026-10-26

### Added
- `HeroPrefetch`(서버 컴포넌트): HERO profile을 서버에서 미리 받아 첫 HTML에 제목·부제를 넣음(`"use cache"` + `cacheLife("minutes")`, 1분 안팎으로 DB 변경 반영). 백엔드가 꺼져 있거나 apiBase가 상대 주소면 기존처럼 브라우저에서 불러옴
  - 근거: 운영 모바일 Lighthouse 성능 72, LCP 8.1s — LCP 요소가 h1인데 클라이언트 fetch 뒤에야 채워짐(서버 HTML의 h1이 비어 있음), CLS 0.084도 같은 원인

### Changed
- `HeroSection`이 `serverProfile` prop을 받음. 있으면 `useProfile`을 끔(`useProfile(enabled)`)
- React Query 캐시(HydrationBoundary)로 넘기지 않음 — 데이터가 있으면 useQuery가 프리렌더 중 현재 시각을 읽어 Suspense 섹션 전체가 빈자리가 되는 것을 실측으로 확인

## [v0.4.3] - 2026-10-26

### Added
- 공유 미리보기(OG·트위터 카드): `app/opengraph-image.jpg`(1200×630, HERO 첫 화면 캡처) + alt 텍스트, `metadataBase` https://www.chungsik.com, `og:title/description/url/site_name/locale`, `twitter:card=summary_large_image`

## [v0.4.2] - 2026-10-26

### Changed
- 탭 제목·메타데이터 title을 HERO 제목에 맞춤: "김충식 — 현장의 말을 개발의 말로"
- 운영 배포: Vercel(Root Directory `frontend`) + 도메인 www.chungsik.com(가비아 DNS, chungsik.com → www 308, Let's Encrypt)

## [v0.4.1] - 2026-10-26

### Added
- 04 BUILT TownPulse 동작 녹화(공개 데모 townpulse.site, 로그인 없는 메인·대시보드·마을 TVI 목록, 19s, WebM 1.9MB) — 다섯 프로젝트 모두 영상

### Changed
- 02 TRANSLATE ④ 계산/해석: 같은 사각형 두 개 → 계산(코드)은 칸이 맞는 격자, 해석(AI)은 길이가 제각각인 글 줄 + 가운데 경계선 + "계산 · 코드"/"해석 · AI" 라벨(`chartLabels`·`divider`)
- 점↔차트 짝짓기를 x 순서로(`pairByX`) — 말풍선이 좌우로 갈라지고, 다른 차트도 점이 덜 엉키며 모임. 테스트 2개 추가

## [v0.4.0] - 2026-10-26

### Added
- 02 TRANSLATE 3D 스크럽(지시서 §2 "사이트의 심장"): 번역 1건 = 200svh 고정, 진행률에 따라 실물 오브젝트(Blender glb) → 스캔 라인(아래는 메쉬 클리핑, 위는 점구름) → 라벨 → 점구름이 차트로 모임 → 숫자·결론
  - 차트 4종 `chartTargets`: ① 파레토 ② 일정표 4트랙 ③ 차수별 막대 10개 ④ 계산/해석 두 색 분리 — 시드 고정, 면적 비례 배치 + 테스트 4개
  - `translateFrame` 진행률 매핑 + 테스트 2개, 캔버스는 화면 근처에서만 생성(동시 1~2개), 세로 화면은 카메라를 물려 차트 전체 표시
  - reduced-motion·WebGL 미지원은 기존 정지 카드(`CaseText` 공용)

### Changed
- `useScanEnabled`·`useSectionProgress`를 `shared/motion`으로 승격(HERO·TRANSLATE 공용)

## [v0.3.7] - 2026-10-26

### Changed
- HERO "스캔 시작": 차트 고정 지점(82%)까지 4.2초 동안 천천히 자동 스크롤(스캔→점구름→라벨→차트가 차례로 보임). 휠·터치·키 입력 시 즉시 중단, 애니메이션 동안만 scroll-snap 해제

## [v0.3.6] - 2026-10-26

### Added
- 04 BUILT 동작 녹화 4종 `public/video/projects/` — Metabole 20s · Life Tutorial 21s · localhost:daegu 28s · REMAKE DAY 28s(1280×720, WebM·MP4 각 1~2MB, 포스터 WebP). TownPulse는 녹화 없음 표시

### Changed
- 05 DICT 사전 20쌍(mock 픽스처를 0008과 같게), 자동 재생 버튼 3개 교체(현장→개발 2, 개발→현장 1)

### Fixed
- 05 DICT: 개발 용어로 검색하면 현장/개발 색이 뒤집히던 문제 — `translate`가 입력 쪽(`fromField`)을 돌려주고, 현장 `--scan`·개발 `--data`로 고정

## [v0.3.5] - 2026-10-26

### Changed
- HERO 차트 고정 구간: 막대 정렬 60→72%, 완성된 차트·카운터 4개를 72~92%(스크롤 구간의 20%) 동안 유지 — `CHART_HOLD` + 테스트 1개
- 차트 고정 구간 자석 정지: `html { scroll-snap-type: y proximity }` + HERO 내부 snap 지점(82%). 근처에서 멈출 때만 붙고 계속 스크롤하면 지나감
- 04 BUILT 프로젝트 블록마다 snap 지점(`snap-start`) — 블록 시작에 붙어 우측 그리드가 그 프로젝트 스택으로 바뀜, 블록 안은 자유 스크롤
- HERO 카운터 4개: subgrid로 라벨·숫자·조건 줄을 좌우 칸에서 맞춤, 위아래 간격 확대, 조건 문장 단어 단위 줄바꿈
- 04 BUILT 숫자 3칸: 같은 subgrid 정렬(라벨 줄 하단 정렬·숫자 줄·조건 줄), 배지를 라벨 뒤에 인라인, 숫자 24px로 한 줄 유지, 간격 통일
- 04 BUILT 동작 녹화 플레이어(`ProjectDemo`) — 뷰포트 진입 시만 재생, reduced-motion은 포스터. Metabole·localhost:daegu 영상(1280×720)

### Removed
- 07 Docs 인덱스에서 The Horn 링크

## [v0.3.4] - 2026-10-26

### Changed
- HERO 제목 변경, 프로젝트 설명 6문장 다듬기 — mock 픽스처를 0006·0007과 같게 갱신
- 02 TRANSLATE 결론 2건: "접수에서 멈추지 않고 분류 체계를 만들었다", "“누가 맞나”를 “어떤 조건이 필요한가”로 바꿨다"

## [v0.3.3] - 2026-10-26

### Removed
- 07 CONTACT 이력서 다운로드 버튼 2개, HERO의 "이력서 2종" CTA

## [v0.3.2] - 2026-10-26

### Added
- 01 GAP 마무리 문장 "현장 10년 5개월. 개발 과정에서 서비스 5종 배포. 양쪽에 다 있었습니다." — 숫자는 metric에서만, 현장 `--scan`·개발 `--data`

### Changed
- mock 픽스처를 0005와 같게 갱신(회사 표기·강의 기간)

## [v0.3.1] - 2026-10-26

### Changed
- HERO 카운터 4개(클레임·투입 인원·일 생산능력·RPS), 지시서 §2 HERO 65% 구성대로. mock 픽스처를 0004와 같게 갱신
- `.gitignore`에 `docs/private/`(이력서 원본) 추가

## [v0.3.0] - 2026-10-26

### Added
- HERO 3D 스캔(지시서 §3-3): 300svh sticky, 진행률 → 실사 루프 → 정지·스캔 라인(위쪽만 점구름) → 데이터 라벨 → 막대 차트 정렬·카운터 → 흩어짐·제목. R3F + 커스텀 셰이더(`features/hero/lib/shaders.ts`), 카메라는 `public/models/hero-cameras.json`(가로·세로)
- `heroFrame` 진행률 매핑 + 테스트 3개, 모바일 점 1/3·DPR 1.5 제한, reduced-motion·WebGL 미지원 시 정지 HERO
- three, @react-three/fiber 의존성(3D 코드는 동적 import로 분리)

### Fixed
- 프로덕션 하이드레이션 불일치(React #418) — Suspense 경계가 순서대로 하이드레이션되는 사이 공용 쿼리 캐시를 읽어 생기던 문제. `shared/api/useApiQuery`로 하이드레이션 전에는 데이터를 감춤
- 섹션 스캔 라인이 긴 섹션(04 BUILT)에서 시작되지 않던 문제 — 진입 판정을 화면 아래 15% 선 기준으로 변경

## [v0.2.0] - 2026-10-26

### Added
- 섹션 정적 버전 전부: HERO(루프 영상·세로 영상·CTA), 01 GAP(손글씨 Gaegu), 02 TRANSLATE(번역 4건), 04 BUILT(프로젝트 5 + 우측 고정 스택 그리드 필터·모바일 칩), 05 DICT(양방향 사전 터미널·자동 재생 3), 06 DEPLOY, 07 TEACH+CONTACT(이메일·이력서·Docs 인덱스·클로징)
- mock API `/profiles`, `/projects`, `/project-stacks`, `/metrics`, `/terms` — 실 API와 7개 경로 응답 동일 확인
- 숫자 팀/개인 배지(`AttributionBadge`), 숫자 카운터(`CountUpText`, 1.2s 1회), 상단 스캔 진행 바, 섹션 스캔 라인(`ScanReveal`, 0.9s 1회) — reduced-motion 시 최종 상태
- 포스터 WebP 7종(PNG 대비 약 1/10)

### Changed
- 스택 그리드·데이터 훅을 `shared/`로 승격(`StackGrid` full/compact, 타일 idle/active/dim), `fetchTerms`·`fetchMetrics`·`useMetricsById` 공용화
- 테스트 15개(로직 4, mock 계약 8, 설정 1, 카운터 2)

## [v0.1.0] - 2026-10-26

### Added
- Next.js 16.4.3 + Tailwind v4 + TanStack Query + Vitest 셋업, dev/start 포트 3700
- `styles/tokens.css` — 지시서 §1-1 색 토큰(다크 전용), Pretendard·JetBrains Mono 폰트
- `shared/` — `config.ts`(apiBase), `api/client.ts`(ApiError 톨게이트), `api/types.ts`, `api/providers.tsx`, `ui/RouteFallback.tsx`
- mock API `/api/mock/stack-categories`, `/api/mock/stacks` + `fixtures.ts` (실 API와 응답 동일 확인)
- `features/stack` — 03 STACK 정적 그리드(카테고리 6, 타일 41, 아이콘/모노그램, 포트·어댑터 콜아웃)
- 테스트 4개(config 계약, mock 라우트 계약 2, groupStacks)
