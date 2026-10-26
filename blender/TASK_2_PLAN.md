# 작업 2 실행 계획

기준: CODEX_TASK_2.md. 허용 경로는 blender/와 frontend/public/models/뿐. 커밋·푸시 및 기존 HERO 파일 수정 금지.

1. 산출물 검증기를 먼저 작성하고 파일 부재로 실패하는지 확인한다.
2. build_objects.py: 교체 가능한 1024px 이하 임시 텍스처, 실물 크기 PBR 메쉬 4개, 표면 균일 샘플 8,000점씩과 자체 완결 GLB를 생성한다. 모든 메쉬는 Blender Z-up 바닥 중앙 원점에서 glTF Y-up으로 동일 변환한다. objects.blend와 Eevee 비교 미리보기를 저장한다.
3. render_hero_seq.py: 기존 GLB의 POSITION/_TARGET_POS를 읽고 hero.blend의 landscape 카메라를 사용한다. 카메라를 향한 작은 원판으로 점을 렌더해 투명 Eevee PNG 120장과 양 끝 WebP를 생성한다. 원본 blend는 저장하지 않는다.
4. GLB 바이너리 재파싱, 표면과 점 정합, 텍스처 크기·파일 용량·프레임 수·RGBA·끝 프레임 일치 검증. 미리보기 직접 확인. README에 실제 결과 기록.

결정: 텍스처는 Pillow를 사용하는 시스템 Python 보조 스크립트로 생성한다. 기존 PNG가 있으면 덮어쓰지 않아 디자인 교체본을 유지한다. Blender glTF 애드온의 numpy 누락을 피하도록 표준 라이브러리 GLB writer를 사용한다.
