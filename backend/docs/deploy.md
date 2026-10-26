# 백엔드 Docker 배포

`docker-compose.yml`은 **저장소 루트**에 있고, 모든 명령은 루트에서 실행합니다.
컨테이너 이름은 다른 프로젝트와 같은 규칙(`chungsik-db`, `chungsik-api`, `chungsik-cloudflared`)이며 모두 `restart: unless-stopped`입니다.
이미지는 Python 3.14 slim, 비루트 사용자로 `alembic upgrade head` 성공 후 FastAPI를 8700에서 시작합니다.

## 환경 파일 (둘 다 gitignore)

| 파일 | 내용 | 예시 |
|---|---|---|
| 루트 `.env` | compose 값 — `POSTGRES_USER/PASSWORD/DB`, `TUNNEL_TOKEN` | `.env.example` |
| `backend/.env` | 앱 설정 — `DATABASE_URL`(호스트 개발용, 컨테이너에서는 `db:5432`로 덮어씀), `CORS_ORIGINS`(쉼표 구분) | `backend/.env.example` |

Compose가 DB URL을 조합하므로 계정·암호·DB 이름에는 URL 예약 문자를 쓰지 않습니다.

## 기동

```sh
docker compose up -d --build --wait                    # db + backend
docker compose --profile tunnel up -d --build --wait   # + Cloudflare Tunnel (TUNNEL_TOKEN 필요)
curl --fail --silent --show-error http://127.0.0.1:8700/api/v1/stacks
```

## Cloudflare Tunnel (api.chungsik.com)

1. Cloudflare 대시보드 → Zero Trust → Networks → Tunnels → Create a tunnel(Cloudflared) → 이름 `chungsik`
2. 설치 화면의 토큰(`eyJ…`)만 복사해 루트 `.env`의 `TUNNEL_TOKEN=`에 넣습니다
3. Public Hostname: `api.chungsik.com` → Service `HTTP` · `backend:8700` (compose 내부망 서비스명)
4. `docker compose --profile tunnel up -d`

## 운영 메모

- DB 데이터는 `chungsik_pgdata` 볼륨. 데이터는 전부 마이그레이션 시드라 빈 볼륨에서도 `upgrade head`로 같은 상태가 됩니다. `docker compose down -v`는 실행하지 않습니다.
- 새 마이그레이션 반영: `docker compose up -d --build backend` (시작 시 `alembic upgrade head`)
- 호스트에서 uvicorn으로 개발할 때는 운영 컨테이너가 8700을 쓰므로 다른 포트를 씁니다: `cd backend && .venv/bin/uvicorn main:app --port 8701`
