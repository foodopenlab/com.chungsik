# 백엔드 Docker 배포

모든 명령은 `backend/`에서 실행합니다. 이미지는 Python 3.14 slim을 사용하며,
비루트 사용자로 `alembic upgrade head` 성공 후 FastAPI를 8700에서 시작합니다.

## 개인 서버

1. `.env.example`을 참고해 서버의 `backend/.env`를 준비합니다.
   `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`는 실제 DB 계정과 맞추고,
   `CORS_ORIGINS`에는 프론트엔드 출처를 쉼표로 구분해 넣습니다.
   `DATABASE_URL`은 호스트 개발용이며, 컨테이너에서는 Compose가 `db:5432` 주소로 덮어씁니다.
   Compose가 URL을 조합하므로 계정·암호·DB 이름에는 URL 예약 문자를 사용하지 않습니다.
2. 새 서버에서 빌드하고 기동합니다. DB healthcheck 통과 후 API가 시작됩니다.

   ```sh
   docker compose --profile api up -d --build --wait
   curl --fail --silent --show-error http://127.0.0.1:8700/api/v1/stacks
   ```

3. 같은 서버에서 실행하는 Cloudflare Tunnel의 서비스 주소를
   `http://127.0.0.1:8700`으로 지정합니다. Tunnel 자체가 컨테이너라면
   Compose 네트워크에 연결하고 `http://api:8700`을 사용합니다.

DB 데이터는 기존 `chungsik-db-data` 볼륨에 유지됩니다. `docker compose down -v`는 실행하지 않습니다.
로컬 개발은 `docker compose up -d --no-recreate db`로 DB만 사용하고 호스트에서 uvicorn을 실행합니다.
로컬 의존성은 `.venv/bin/python -m pip install -r requirements-dev.txt`로 설치합니다.

## 기존 로컬 DB를 보존하는 검증 (다른 세션에서 실행)

기존 DB 컨테이너에는 새 healthcheck 설정이 적용되지 않습니다. 재생성하지 않고
DB 준비 상태를 직접 확인한 뒤 `--no-deps`로 임시 API만 띄웁니다.
호스트 uvicorn의 8700 포트 대신 8790을 사용합니다.
시작 시 기존 DB에 Alembic 마이그레이션이 적용되므로 현재 마이그레이션을 먼저 확인합니다.

```sh
# 설정 검증 (시크릿 값을 출력하지 않음)
docker compose --profile api config --quiet
docker compose --profile api build api

# 기존 DB 컨테이너·볼륨 유지, 준비 확인 성공 후 다음 명령 실행
docker compose exec -T db sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
docker compose run --detach --rm --no-deps --name chungsik-api-check -p 127.0.0.1:8790:8700 api
docker image inspect --format '{{.Size}}' "$(docker inspect --format '{{.Image}}' chungsik-api-check)"

# 시작·마이그레이션 시간을 기다린 뒤 확인
curl --fail --silent --show-error --retry 20 --retry-connrefused --retry-delay 2 http://127.0.0.1:8790/api/v1/stack-categories/myself
curl --fail --silent --show-error http://127.0.0.1:8790/api/v1/stacks
docker inspect --format '{{.State.Health.Status}}' chungsik-api-check

# 임시 API만 정리 (--rm으로 중지 후 자동 삭제)
docker stop chungsik-api-check
```

이미지 크기는 `docker image inspect` 결과의 바이트 수로 확인합니다.
샌드박스에서는 Docker 명령을 실행하지 않으므로 빌드·실행·이미지 크기는 다른 세션에서 검증해야 합니다.
