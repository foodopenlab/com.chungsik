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
