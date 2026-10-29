## [v0.4.1] - 2026-10-29

### Changed
- 강의 지표 갱신(마이그레이션 `0012_teach_forestry_ep50`, 근거: 본인 제공 2026-10-29)
  - 강의 만족도 4.3–4.8 → 4.3–5.0: 한국임업진흥원 "AI 활용 사업계획서 작성"·"AI 활용 상세페이지·영상 제작" 5.0(5점 만점) 추가, 조건 문구를 기관별로 묶음
  - 유튜브 대본 검수 8편 → 9편(EP23~EP50)
  - 임업진흥원 강의는 "NCS 등록 강사 5년"(한국식품정보원)과 섞지 않고 만족도 칸에만 넣음

## [v0.4.0] - 2026-10-27

### Added
- 수상 표시 칸 `award`(nullable): `project`·`education` 테이블과 각 11파일 세트(entity·dto·schema·orm·orm_mapper·myself) — 마이그레이션 `0011_awards`
  - AX 아카데미 수료(2026-10-27): Metabole "최우수상 · 과정 최종 프로젝트 1위"(960시간 과정 최종 발표, 전체 팀 중 1위), 교육 "우수훈련생", Life Tutorial "해커톤 우수상"
- 지표 `side`에 `award` 추가(체크 제약 교체) — Life Tutorial 해커톤 수상 지표를 `award`로. 화면에서 금색

## [v0.3.9] - 2026-10-26

### Changed
- 공개 API(api.chungsik.com)에서 `/docs`·`/redoc`·`/openapi.json` 비공개: 설정 `docs_enabled`(기본 켬, 호스트 개발 서버는 그대로) + compose `backend`에 `DOCS_ENABLED: "false"` + 테스트
- compose 기본 네트워크 브리지 이름을 `br-chungsik`으로 고정 — ufw `deny in on br-chungsik`로 공개 컨테이너가 호스트(SSH·Ollama·OCR 등)에 닿지 못하게 하기 위함
- `docs/deploy.md`에 서버 격리 절차·확인 결과 추가(ufw 규칙 적용 후 컨테이너 → 호스트 22·8900·11434 차단 확인)

### Removed
- 예전 Docker 볼륨 `backend_chungsik-db-data`(구성 변경 전 것, 사용 컨테이너 없음)

## [v0.3.8] - 2026-10-26

### Added
- `education` 테이블 + 프랙탈 11-File Set(`/api/v1/educations`, `/myself` 포함) + 라우터 테스트. `profile` FK로 ERD에 연결
- 마이그레이션 `0010`: 테이블 생성 + 시드 1행(IBM × RedHat AI Transformation Academy, AX 과정 7기, 2026-04-29 ~ 2026-10-27, 수료)

### Changed
- `0010`: `profile.subtitle`을 두 줄로 — 1줄 식품 경력(식품기술사·식품 현장 10년 5개월), 2줄 개발 이력(AX 아카데미 7기·해커톤 고용노동부장관상). 현장 경력과 개발 이력을 섞어 읽지 않게 함(downgrade로 원복)

## [v0.3.7] - 2026-10-26

### Changed
- 마이그레이션 `0009`: Life Tutorial 해커톤 수상 지표 재배치 — 라벨 `해커톤 우수상`(한 줄, 옆 칸과 높이 맞춤), 값 `고용노동부장관상`, 조건 `2026 제8회 K-디지털 트레이닝 · 지정과제 · 2026-09-04` (downgrade로 원복)

## [v0.3.6] - 2026-10-26

### Changed
- Docker 구성을 다른 프로젝트 규칙에 맞춤: `docker-compose.yml`을 저장소 루트로 이동(`name: chungsik`), 서비스 `backend`(`build: ./backend`, `env_file: ./backend/.env`), 컨테이너 `chungsik-db`·`chungsik-api`, 모두 `restart: unless-stopped`
- 환경 파일 분리: compose 값(`POSTGRES_*`, `TUNNEL_TOKEN`)은 루트 `.env`, 앱 설정(`DATABASE_URL`, `CORS_ORIGINS`)은 `backend/.env` — 예시 파일 각각 갱신
- DB 볼륨 `chungsik_pgdata`(마이그레이션 시드로 재생성, mock과 7개 엔드포인트 일치 확인)
- `docs/deploy.md` 새 구성·Tunnel 절차로 다시 씀. 호스트 개발 uvicorn은 8701

### Added
- `cloudflared` 서비스(`--profile tunnel`, 토큰 방식) — api.chungsik.com → backend:8700

### Removed
- `backend/docker-compose.yml`, `api` 프로필

## [v0.3.5] - 2026-10-26

### Changed
- Alembic `0008` — 05 DICT 사전 5쌍 → 20쌍(새 15쌍은 근거 note 포함), 01 GAP용 앞 6쌍 재배치. downgrade는 0002의 원래 5쌍 복원

## [v0.3.4] - 2026-10-26

### Changed
- 로컬 PostgreSQL 포트 5437 → 5438 (`docker-compose.yml`, `.env.example`) — 먼저 있던 localhost:daegu DB(5437)와 충돌 회피. 데이터 볼륨 유지

## [v0.3.3] - 2026-10-26

### Changed
- Alembic `0006` — HERO 제목 "현장의 말을 개발의 말로 옮깁니다."
- Alembic `0007` — 프로젝트 설명 6문장 다듬기(humanize-korean 정밀 검토 반영, 의미·숫자·귀속 표기 불변)

## [v0.3.2] - 2026-10-26

### Changed
- Alembic `0005` — 회사 표기 확정(김치 제조(일반 HACCP 인증) 회사 / 수산물·축산물 전문 제조 회사), 강의 기간 5년, 01 GAP 숫자 `gap-field-years`(10년 5개월)·`gap-services`(5종) 추가

## [v0.3.1] - 2026-10-26

### Changed
- Alembic `0004` — 경력·강의 숫자 5개를 이력서 근거로 갱신(값·라벨·측정 조건·출처), HERO 카운터용 `hero-staff`(40→11명)·`hero-capacity`(3→8톤) 추가

## [v0.3.0] - 2026-10-26

### Added
- `profile`, `project`, `project_stack`, `metric`, `term` 테이블 11파일 세트 5벌 — API `GET /api/v1/{profiles,projects,project-stacks,metrics,terms}` (+ 각 `/myself`)
- Alembic `0002` — 위 5개 테이블 + profile·사전 예시 5쌍 시드
- Alembic `0003` — `metric.attribution`(personal|team, CHECK) + 프로젝트 5·스택 연결 121·숫자 20 시드. 근거 `docs/project-facts.md`, 생성 스크립트 `scripts/gen_seed_0003.py`(frontend mock 픽스처와 같은 원천)
- 라우터 테스트 11개 추가(총 15)

## [v0.2.0] - 2026-10-26

### Added
- Python 3.14 slim 기반 비루트 API Dockerfile, 마이그레이션 후 서버 시작, `.dockerignore`
- Compose `api` 프로필, DB 준비 대기와 기존 myself 엔드포인트 기반 API healthcheck
- `docs/deploy.md` — 개인 서버·Cloudflare Tunnel 배포와 기존 DB를 보존하는 8790 포트 검증 절차

### Changed
- 런타임 `requirements.txt`와 개발·테스트 `requirements-dev.txt` 분리 및 설치 안내 추가

## [v0.1.0] - 2026-10-26

### Added
- `apps/portfolio` BC — `stack_category`, `stack` 테이블 Fractal 11파일 세트 2벌 + `dependencies/` Composition Root
- API: `GET /api/v1/stack-categories`, `GET /api/v1/stacks` (+ 각 `/myself` 배선 확인), 응답 camelCase `{items: [...]}`
- `core/matrix` — `grid_keymaker_secret_manager.py`(`.env` 단일 창구), `grid_oracle_database_manager.py`(SQLAlchemy 엔진·세션)
- Alembic 마이그레이션 `0001` — 테이블 생성 + 03 STACK 시드(카테고리 6, 스택 41)
- `docker-compose.yml` — 로컬 PostgreSQL 17(`chungsik-db`, 127.0.0.1:5437), `.env.example`
- `main.py` — FastAPI 앱, CORS(`CORS_ORIGINS`)
- `docs/erd.md` — 전체 ERD 초안(구현 2 / 초안 5 테이블)
- 라우터 테스트 4개
