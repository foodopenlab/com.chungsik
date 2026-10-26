# HANDOFF — 이 문서만 읽고 이어서 작업하기

최종 갱신: 2026-10-26 · 운영 **https://www.chungsik.com** · 최신 커밋 main = `feat/scan-site`

## 0. 먼저 읽을 것

1. 저장소 루트 `CLAUDE.md` — 코딩 규칙 전부(TDD, 프랙탈 11파일, Feature-Sliced, 토큰, 버전 로그, 배포). **이 문서와 충돌하면 CLAUDE.md가 우선**
2. 이 문서
3. 기획 원본(지시서) `docs/portfolio-work-order-v2.md` — **로컬 전용(git 제외)**. 없으면 사용자에게 요청. 섹션 구성·색·모션·자산의 출처

## 1. 한 줄 요약

김충식(식품기술사·현장 10년 5개월·FDE) 개인 포트폴리오 「SCAN」. 실사 영상이 스캔 라인을 지나 점구름 → 라벨 → 차트 → 실측 숫자로 변환되는 것이 사이트 전체의 문법이다. 프론트 Next.js(Vercel 운영 중), 백엔드 FastAPI+PostgreSQL(로컬만, 운영은 아직 mock API로 동작).

## 2. 운영·브랜치

| 항목 | 값 |
|---|---|
| 운영 | https://www.chungsik.com (chungsik.com → www 308, Let's Encrypt 자동 갱신) |
| 호스팅 | Vercel 프로젝트 `com.chungsik`(foodopenlab), **Root Directory = `frontend`**, Framework = Next.js, 환경변수 없음 |
| 도메인 | 가비아 등록·가비아 DNS. 루트 A, www CNAME — 값은 Vercel → Settings → Domains 화면 기준 |
| 브랜치 | `main` 푸시 = **운영 배포**. `feat/scan-site` 푸시 = Vercel 미리보기(Preview) |
| 흐름 | `feat/scan-site`에서 작업·커밋 → (미리보기 확인) → `main` fast-forward 병합 후 푸시 |
| 저장소 | **PUBLIC** (github.com/foodopenlab/com.chungsik) — 비공개 자료를 절대 커밋하지 말 것(§9) |

## 3. 사용자와 일하는 방식 (지켜 온 약속)

- 응답·커밋 메시지는 한국어. 커밋 끝에 `Co-Authored-By` 한 줄
- **푸시는 매번 확인받고**, main 푸시를 말할 땐 "main 푸시 = 운영 배포"를 함께 말한다. 푸시 전 `git log origin/main..HEAD`로 다른 사람 커밋이 섞였는지 확인
- amend·force push는 사용자가 요청할 때만
- 사용자가 "진행"하면 다음 작업을 스스로 골라 계속 진행. 결정이 필요한 것만 묻는다
- 화면을 바꾸면 Playwright로 1440·390px 스크린샷을 찍어 직접 확인하고 보고(§6)
- 사용자는 Mac에서 SSH로 이 Linux 머신에 붙어 작업한다. 로컬 화면은 Mac에서 `ssh -L 3700:localhost:3700 kimchungsik@192.168.219.101` 후 http://localhost:3700 (또는 VS Code Remote-SSH PORTS 탭). `192.168.219.101:3700` 직접 접속은 ufw 방화벽에 막힘
- 운영 중인 외부 사이트에는 로그인하지 않는다. 로그인이 필요한 장면은 사용자가 직접 녹화

## 4. 지금까지 확정된 결정

| 주제 | 결정 |
|---|---|
| 폴더 구조 | CLAUDE.md §14 Feature-Sliced (`features/` + `shared/`) — 지시서의 `src/three`·`src/data` 대신 |
| 테마 | 다크 전용. 토큰 `--bg --bg-tile --line --scan(주황) --data(하늘) --text --muted --alert` (`frontend/src/styles/tokens.css`) |
| 색 규칙 | 현장·제조 숫자 = `--scan`, 소프트웨어 숫자 = `--data`. 사전도 현장 용어 주황·개발 용어 하늘(검색 방향과 무관) |
| 백엔드 | 처음부터 연동. 실 API와 mock이 **응답까지 동일**(7개 경로) |
| 포트 | 백엔드 8700, 프론트 3700, 로컬 DB 5438(다른 프로젝트 localhost:daegu가 5437 사용) |
| 숫자 원칙 | 화면 숫자는 `metric` 테이블에서만. 숫자마다 측정 조건·출처·`attribution`(personal/team) → 화면에 `개인`/`팀` 배지 |
| 팀 성과 | 팀 성과는 `팀` 배지로 표기. **특정 팀원 담당 숫자는 쓰지 않음** |
| REMAKE DAY | **팀 버전** 서술(5인 팀, Scenario Director·Content). 개인 문서 사이트(remakeday.foodopenlab.com)는 링크하지 않음 |
| HERO 제목 | "현장의 말을 개발의 말로 옮깁니다." (탭 제목 "김충식 — 현장의 말을 개발의 말로") |
| 회사 표기 | 회사명 비공개. "김치 제조(일반 HACCP 인증) 회사", "수산물·축산물 전문 제조 회사" |
| 경력 숫자 | 이력서 근거: 100+→15건 미만, 40→11명, 3→8톤, 1월 계약→5월 이전, NCS 강사 5년, 만족도 4.3–4.8, 유튜브 대본 검수 8편, 현장 10년 5개월, 배포 서비스 5종 |
| 연락처 | 이메일 kcs8815@gmail.com 공개. 이력서 다운로드 버튼 없음(삭제 요청) |
| Docs 인덱스 | Metabole·Life Tutorial·localhost:daegu·TownPulse·REMAKE DAY 개발 허브·REMAKE DAY Research (The Horn 제외) |
| 문구 | humanize-korean(im-not-ai) 정밀 검토 반영. 01 제목 "같은 공장, 다른 언어"·01 마무리 문장은 원문 유지 |
| 사전 | 20쌍(`docs/dict-draft.md`). 앞 6쌍이 01 GAP에 표시 |
| 스크롤 | 하이재킹 금지. 대신 CSS `scroll-snap: proximity` 자석 — HERO 차트 고정 지점(82%), 04 프로젝트 블록 시작 |

## 5. 구조 지도

```
frontend/src/
  app/              page.tsx(섹션 조립), layout.tsx(폰트·메타), api/mock/*(실 API 미러 + fixtures)
  features/
    hero/           3D 스캔(R3F, lib/heroTimeline·shaders), "스캔 시작" 자동 스크롤
    gap/            01 현장 말↔개발 말(사전 앞 6쌍) + 마무리 문장
    translate/      02 3D 스크럽(lib/cases·chartTargets·translateFrame, TranslateCanvas)
    stack/          03 스택 그리드
    built/          04 프로젝트 + 우측 고정 스택 필터 + 동작 녹화(ProjectDemo)
    dict/           05 translate 터미널
    deploy/         06 처음 30일
    contact/        07 강의 숫자·이메일·Docs·클로징
  shared/           api(client·types·useApiQuery), stack, metrics, terms, motion(카운터·진입·스캔 가능 여부·진행률), ui(StackGrid·StackTile·배지·ScanReveal·ScanProgress)
backend/
  apps/portfolio/   BC 1개 — profile, stack_category, stack, project, project_stack, metric, term (각 11파일 세트)
  alembic/versions/ 0001~0008 (스키마·시드·이력서 숫자·사전 20쌍)
  docker-compose.yml(db 5438, api 프로필 8700), Dockerfile, docs/(erd.md, deploy.md, 버전 로그)
blender/            HERO 카메라 매칭·점구름, 번역 오브젝트 4개 스크립트(README.md에 재현 방법)
scripts/gen_seed_0003.py   0003 시드 생성기(이후 변경은 새 마이그레이션 + fixtures 직접 수정)
```

## 6. 실행·검증

| 대상 | 명령 |
|---|---|
| DB·백엔드(운영) | 루트에서 `docker compose up -d --build --wait` → `chungsik-db`·`chungsik-api`(8700). Tunnel은 `--profile tunnel`. 자세히는 `backend/docs/deploy.md` |
| 백엔드(개발) | `cd backend && .venv/bin/uvicorn main:app --port 8701` (8700은 운영 컨테이너) |
| 프론트 | `cd frontend && npx next build && npx next start -p 3700` |
| 테스트 | 백엔드 `cd backend && .venv/bin/python -m pytest tests -q`(15개) · 프론트 `cd frontend && npx vitest run`(27개) + `npx eslint src` + `npx tsc --noEmit -p .` |
| mock=실 API | 두 서버를 띄우고 `for p in stack-categories stacks projects project-stacks metrics terms profiles; do diff <(curl -s localhost:3700/api/mock/$p \| python3 -m json.tool --sort-keys) <(curl -s localhost:8700/api/v1/$p \| python3 -m json.tool --sort-keys) >/dev/null && echo "$p ok" \|\| echo "$p DIFF"; done` |
| 스크린샷 | Playwright 1.63: `require("/home/kimchungsik/.npm/_npx/6bcb61ec6d5aea22/node_modules/playwright")`, 3D는 `chromium.launch({ args: ["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"] })`. 다른 Playwright 버전은 설치된 chromium-1243과 안 맞음 |
| 운영 확인 | `curl -s https://www.chungsik.com \| grep -o "<title>[^<]*</title>"` |

## 7. 알아 둘 함정 (실제로 겪은 것)

- `next start`는 **빌드 시점의 `public/` 파일만** 서빙 → 영상·모델 추가 후 반드시 다시 빌드
- 이 머신의 npm 10.8은 일부 설치에서 `edgesOut` 버그 → `npx -y npm@11 i ...`로 설치
- 여러 Suspense 경계가 같은 쿼리 캐시를 쓰면 하이드레이션 불일치(React #418) → 데이터 훅은 반드시 `shared/api/useApiQuery`(하이드레이션 전엔 데이터 숨김)
- 긴 섹션에서 IntersectionObserver `threshold` 비율 판정이 안 걸림 → `useInViewOnce`는 `rootMargin: "0px 0px -15% 0px"`
- three.js GLTFLoader는 커스텀 속성 이름을 소문자로 바꿈(`_TARGET_POS` → `_target_pos`)
- ShaderMaterial 색은 `#include <colorspace_fragment>` 없으면 토큰보다 진하게 나옴
- three 객체 직접 변경은 React Compiler lint(`react-hooks/immutability`)에 걸림 → 해당 캔버스 파일에서만 사유와 함께 disable
- 바닥에 눕힌 Blender 오브젝트(클립보드·도면)는 `cases.ts`의 `tilt`/`yaw`/`roll`로 세움(클립보드 tilt=+1.15)
- Mac에서 넘어온 한글 파일명은 NFD — 셸에서 경로를 그대로 쓰면 못 찾음, 글롭(`*.pdf`)으로 접근
- 프론트 `public/video/translate-*-poster.png`·`closing-poster.png`는 git 제외(WebP 사용). `hero-poster.png`·`hero-portrait-poster.png`는 Blender 기준 이미지라 유지

## 8. 남은 작업 (우선순위 순)

1. ~~**OG·공유 메타**~~ — 완료(v0.4.3). 이미지 교체는 `frontend/src/app/opengraph-image.jpg`(1200×630)를 같은 이름으로 바꾸면 됨
2. ~~**Lighthouse·모바일 점검**~~ — 완료(2026-10-26, 운영 URL). 모바일 성능 72→**98**(LCP 8.1→2.4s, CLS 0.084→0.001), 접근성·권장사항·SEO 100. 데스크톱 99. 모바일 HERO 차트 밀도·겹침·라벨 넘침은 v0.5.3에서 해결. 남은 관찰: 02 TRANSLATE는 3D 캔버스(`ssr:false`) 때문에 서버 HTML에서 빈자리
3. **실제 휴대폰 확인** — 3D·영상·자석 정지·자동 스크롤
4. ~~**07 클로징 연출**~~ — 완료(v0.6.0). 지시서의 점구름 단계는 빼고 스캔 라인 → CLOSING 실사 영상(사용자 선택, 3D 없이 가볍게). 상단 내비게이션도 함께 추가(HERO 지나면 나타남)
5. **Metabole 상태 태그** — 10/27 밤 AWS 운영 종료 예정 → 이후 `배포 중 · 10/27 종료 예정`을 종료 표기로(새 마이그레이션 + `fixtures.built.ts`), 서비스 링크 처리도 결정
6. **번역 오브젝트 텍스처 교체** — 임시본. `blender/textures/*.png`를 같은 이름으로 바꾸고 `blender -b --python blender/scripts/build_objects.py` → `public/models/obj-*.glb` 갱신
7. **TownPulse 지도·AI 채팅 장면** — 로그인 필요라 공개 화면만 녹화됨. 사용자가 직접 녹화해 `frontend/public/video/raw/`에 넣으면 편집·압축·교체
8. ~~**실 API 전환**~~ — 완료(2026-10-26). 지금은 8-1의 중계 구조(Preview도 실 데이터). 구성: chungsik.com DNS는 Cloudflare(가비아는 등록만, `@`·`www`는 DNS only 회색 구름), 터널 `chungsik`(토큰은 루트 `.env`) → `backend:8700`. 이 서버의 로컬 DNS 캐시가 늦게 갱신되면 Playwright/Lighthouse에 `--host-resolver-rules="MAP api.chungsik.com <IP>"`
8-1. ~~**API 비공개(Vercel 중계 + Cloudflare Access)**~~ — 완료(2026-10-26). 서버에 다른 프로젝트가 많아 api.chungsik.com을 외부에 열지 않음
   - 흐름: 브라우저 → `www.chungsik.com/api/v1/[resource]`(Vercel 중계, 허용 8종 GET만·쿼리 붙으면 404·CDN 60s) → Access 서비스 토큰 → api.chungsik.com → Tunnel → backend. HERO 서버 미리 불러오기는 `upstreamFetch`로 직접
   - Vercel env(Production+Preview): `NEXT_PUBLIC_API_BASE=/api/v1`, `API_ORIGIN=https://api.chungsik.com/api/v1`, `CF_ACCESS_CLIENT_ID/SECRET`(Sensitive)
   - Cloudflare Zero Trust: 서비스 토큰 `vercel-chungsik`(만료 없음), Access 앱 `chungsik-api`(api.chungsik.com 전체) + 정책 `vercel only`(Action Service Auth, Include Service Token). 토큰 없이 직접 호출 → 403 확인
   - 되돌리기: Access 앱 삭제(즉시) / 중계를 끄려면 `NEXT_PUBLIC_API_BASE`를 Tunnel 주소로 + Redeploy(단, Access가 켜져 있으면 브라우저 직접 호출은 403)
   - 서버 격리 ✅: 브리지 `br-chungsik` + ufw 1번 `deny in on br-chungsik` → 컨테이너에서 호스트 SSH·OCR·Ollama·다른 프로젝트 DB 차단(`backend/docs/deploy.md` 서버 격리). SSH 비밀번호 로그인 끄기는 사용자 선택
   - Lighthouse 재확인(2026-10-27): 운영 모바일 10회 중앙값 98(98~99 6회, 75~86 4회). 로컬 A/B(중계 전 `f5b5285` vs 지금)는 같음 → 중계 영향 없음. 느린 회차 원인 = Pretendard 분할 폰트 26개(574KB)가 첫 페인트 전에 끝난 회차마다 Lighthouse가 LCP 의존으로 계산(실제 브라우저 LCP는 느린 휴대폰 조건 1.4초로 일정). v0.5.8에서 서브셋 1개(110KB, Scan Sans)로 바꿔 로컬 70 → 87. 운영 10회: 74·99·94·95·95·98·94·90·94·100(중앙값 94.5) — 미리 받기(preload) 때문에 글꼴이 매번 계산에 들어감 → v0.5.9에서 preload 끔. **배포 후 운영 10회 재측정 필요**. 74 회차는 실측 첫 페인트가 1.3초로 늦어 HERO 영상(1.9MB)까지 계산된 일회성
   - 남은 관찰: 아래쪽 섹션 영상 포스터(translate·closing, 약 630KB)가 첫 화면에서 바로 받아짐 — 필요하면 화면 근처에서 포스터를 붙이는 방식 검토
8-2. **중계 요청 속도 제한(Vercel 방화벽)** — 진행 중(2026-10-26 결정)
   - 이유: 중계 주소를 반복 호출하는 부하 대비. `?쿼리`로 캐시를 건너뛰던 구멍은 v0.5.7에서 막음(404). 남은 대비책으로 IP당 요청 수 제한
   - 이메일 인증(Cloudflare Access 사람 로그인)은 검토 후 제외: api.chungsik.com에 걸면 Vercel 서버가 코드를 못 받아 사이트 데이터가 끊기고, www에 걸면 모든 방문자(채용 담당자 포함)가 로그인해야 함. 캐시 우회 문제와도 무관(문제는 Vercel 캐시 단계, 토큰은 그 뒤 단계)
   - 규칙(대시보드 Firewall) `api rate limit`: 경로가 `/api/v1/`로 시작 → Rate Limit, 고정 창 60초·IP당 100회(정상 방문 1회 = 요청 7개). www는 Cloudflare 회색 구름이라 Vercel 방화벽이 맞는 위치. 카운터는 리전별
   - 2026-10-26 Log 모드로 게시, 이 서버에서 120회 보내 정확히 20회 기록 확인. **남은 일**: 하루 트래픽에 다른 IP가 없으면 Log → 429로 전환 후 120회 재시험(101번째부터 429)
9. **적대적 리뷰** — "채용 담당자로서 과장으로 보이는 지점 5개, 팀 성과를 개인처럼 쓴 곳, 면접에서 바로 물을 약점"
10. **소소한 것** — 상단 진행 바는 페이지 끝에서 100%(지시서는 06 도달 시 100%) · 숫자 고정폭 글꼴 공백(`15건  미만`) · 02 ④ 계산 격자 점이 흐리면 간격·크기 키우기

## 9. 데이터를 바꿀 때

- 실 API와 mock은 같은 데이터여야 한다. **새 Alembic 마이그레이션**(`backend/alembic/versions/00NN_*.py`, downgrade 포함)과 `frontend/src/app/api/mock/fixtures.ts`·`fixtures.built.ts`를 **함께** 고친 뒤 §6 mock=실 API 비교
- 글자 추가 = `frontend/src/styles/fonts/scanSans.test.ts`가 실패하면 `bash frontend/scripts/subset-font.sh`로 서브셋 폰트 재생성(fonttools·brotli). 픽스처에 없는 글자는 폴백 글꼴로 보임
- 숫자 추가 = `metric` 행 추가(측정 조건·출처·attribution 필수). 컴포넌트에 숫자를 직접 쓰지 않는다
- 버전 로그: 백엔드 `backend/docs/backend_ver_log.md`, 프론트 `frontend/docs/frontend_ver_log.md` 맨 위에 기록(현재 백엔드 v0.3.9, 프론트 v0.6.0)
- 새 BC는 `backend/apps/dummy`를 복사해 시작

## 10. 자산·파일 위치

| 자산 | 위치 | git |
|---|---|---|
| 실사 영상(HERO 가로·세로, CLOSING, TRANSLATE 배경 4) | `frontend/public/video/` | O |
| 원본 영상(Google Flow) | `frontend/public/video/raw/` | **제외** |
| 프로젝트 동작 녹화 5종 | `frontend/public/video/projects/{slug}.webm·.mp4·-poster.webp` (1280×720) | O |
| 3D 모델 | `frontend/public/models/` | O |
| Blender 원본·스크립트 | `blender/` (렌더는 `blender/renders/` 제외) | O |
| 사전 초안·근거 | `docs/dict-draft.md` | O |
| 지시서 | `docs/portfolio-work-order-v2.md` | **제외(로컬 전용)** |
| 프로젝트 사실 조사 | `docs/project-facts.md` | **제외(로컬 전용)** |
| Codex 작업 지시서 | `**/CODEX_TASK*.md`, `blender/PLAN.md` | **제외** |
| 이력서 원본 | `frontend/docs/private/` | **제외** |

## 11. 다른 프로젝트 녹화 참고

- Metabole(로컬 3200/8200), Life Tutorial(로컬 3100/8100), localhost:daegu(로컬 3300/8300, DB 5437), REMAKE DAY(로컬 3500/850x), TownPulse(공개 데모 townpulse.site)에서 Playwright로 1920×1080 녹화 → 1280×720 편집·압축(WebM VP9 + MP4 H.264, 각 1~2MB, 15~30초)
- 다른 프로젝트 저장소의 코드·`.env`는 수정하지 않는다. 녹화 때 띄운 프로세스는 종료, DB 컨테이너는 둔다
