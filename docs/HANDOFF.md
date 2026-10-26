# HANDOFF — 남은 작업

최종 갱신: 2026-10-26 · 브랜치 `feat/scan-site` (main은 운영 배포 브랜치 — main 푸시 = 프론트 운영 배포)

## 지금 상태

- 전 섹션 구현 완료: HERO(3D 스캔·차트 자석 정지·"스캔 시작" 자동 스크롤) → 01 GAP → 02 TRANSLATE(3D 스크럽) → 03 STACK → 04 BUILT(스택 필터·프로젝트 자석·동작 녹화 4종) → 05 DICT(사전 20쌍) → 06 DEPLOY → 07 TEACH+CONTACT
- 화면 숫자는 전부 `metric` 테이블(실 API)·mock 픽스처에서만 나온다. 숫자마다 측정 조건·출처·팀/개인 귀속이 있다
- 테스트: 백엔드 15개(`backend/`에서 `.venv/bin/python -m pytest tests -q`), 프론트 25개(`frontend/`에서 `npm test`)

### 로컬 실행

| 대상 | 명령 | 포트 |
|---|---|---|
| DB | `cd backend && docker compose up -d db` | 5438 |
| 백엔드 | `cd backend && .venv/bin/alembic upgrade head && .venv/bin/uvicorn main:app --port 8700` | 8700 |
| 프론트 | `cd frontend && npm run build && npm start` (또는 `npm run dev`) | 3700 |

- 프론트는 기본으로 mock API(`/api/mock`)를 쓴다. 실 API로 보려면 `NEXT_PUBLIC_API_BASE=http://localhost:8700/api/v1`로 빌드
- `next start`는 빌드 시점의 `public/` 파일만 서빙한다 — 영상·모델을 추가하면 다시 빌드

## 남은 작업 (우선순위 순)

1. **커밋** — 02 TRANSLATE 3D 스크럽, "스캔 시작" 자동 스크롤, `shared/motion` 승격이 아직 미커밋
2. **Vercel 미리보기 배포** — `feat/scan-site` 푸시 → Vercel 프로젝트 Root Directory = `frontend`. mock API가 Next 라우트로 들어 있어 백엔드 없이 전체 동작. 실제 휴대폰에서 3D·영상·자석 정지 확인
3. **Lighthouse·모바일 점검** (지시서 목표: 모바일 Perf 85+, A11y 95+)
   - 문구·숫자를 전부 클라이언트에서 불러온다 → LCP·검색 노출 불리. 측정 후 필요하면 서버 프리페치(HydrationBoundary)로
   - 모바일 HERO 막대 차트 밀도가 고르지 않음(점 1/3 + 막대 폭 축소)
4. **백엔드 운영 배포** — `backend/docs/deploy.md` 절차(개인 서버 Docker `--profile api` + Cloudflare Tunnel). 이후 Vercel 환경변수 `NEXT_PUBLIC_API_BASE`를 Tunnel 주소로, 백엔드 `.env`의 `CORS_ORIGINS`에 Vercel 도메인 추가
5. **07 클로징 연출** — 스캔 라인이 한 번 더 지나가며 점구름 → 실사로 복귀(CLOSING 영상 `public/video/closing.*` 준비됨, 지금은 포스터 정지 이미지)
6. **OG 이미지** — 링크 공유 미리보기(`app/opengraph-image` 또는 정적 이미지)
7. **번역 오브젝트 텍스처 교체** — 지금은 임시본. `blender/textures/*.png`를 같은 이름으로 바꾸고 `blender -b --python blender/scripts/build_objects.py` 재실행(재현 방법 `blender/README.md`)
8. **적대적 리뷰** — "채용 담당자로서 과장으로 보이는 지점 5개, 팀 성과를 개인처럼 쓴 곳, 면접에서 바로 물을 약점"
9. **상태 태그 갱신** — Metabole은 10/27 밤 AWS 운영 종료 예정 → 이후 `배포 중 · 10/27 종료 예정`을 종료 상태로(마이그레이션 + mock 픽스처)
10. **소소한 것**
    - 상단 진행 바는 지금 페이지 끝에서 100% — 지시서는 06 DEPLOY 도달 시 100%
    - `100+→15건 미만`처럼 숫자에 고정폭 글꼴을 써서 공백이 넓어 보임(원하면 좁히기)

## 데이터를 바꿀 때

- 실 API와 mock은 같은 데이터여야 한다(§15). 새 Alembic 마이그레이션(`backend/alembic/versions/00NN_*.py`)과 `frontend/src/app/api/mock/fixtures*.ts`를 **함께** 고친다
- 확인: 두 서버를 띄운 뒤
  `for p in stack-categories stacks projects project-stacks metrics terms profiles; do diff <(curl -s localhost:3700/api/mock/$p | python3 -m json.tool --sort-keys) <(curl -s localhost:8700/api/v1/$p | python3 -m json.tool --sort-keys) >/dev/null && echo "$p ok" || echo "$p DIFF"; done`
- 새 BC가 필요하면 `backend/apps/dummy`를 복사해 시작(11파일 세트 템플릿)

## 자산 위치

| 자산 | 위치 |
|---|---|
| 실사 영상(HERO·CLOSING·TRANSLATE 배경) | `frontend/public/video/` (원본은 `raw/`, git 제외) |
| 프로젝트 동작 녹화 | `frontend/public/video/projects/{slug}.webm·.mp4·-poster.webp` |
| 3D 모델 | `frontend/public/models/` — `hero-pointcloud.glb`, `hero-cameras.json`, `obj-*.glb` |
| Blender 원본·스크립트 | `blender/` (`README.md`에 재현 방법) |
| 사전 초안·근거 | `docs/dict-draft.md` |
| 이력서 원본 | `frontend/docs/private/` (git 제외) |
