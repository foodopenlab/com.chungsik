# HERO 카메라·점구름

`CODEX_TASK.md`의 카메라 매칭·점구름·내보내기 범위. 박스 프록시 27개와 저해상 압력계 원판 5개를 사용한다. 실제 치수를 측량한 복원이 아니라 포스터 화면에 맞춘 블로킹이다.

## 재현·검증

저장소 루트에서:

```sh
blender -b --python-exit-code 1 --python blender/scripts/build_hero.py
python blender/scripts/verify_glb.py
```

Blender 5.0.1, PATH의 `python` + Pillow가 필요하다. Geometry Nodes `Distribute Points on Faces`의 고정 seed로 표면 샘플을 생성하고, 두 카메라에서의 프러스텀·BVH 가시성을 검사한 뒤 고정 seed로 40,000점을 선택한다. 전경 설비의 작은 표면이 사라지지 않도록 면별 sampling_weight를 사용한다. 시각 검증 이미지는 Blender의 실제 카메라 행렬로 투영한 프록시 모서리·점을 Pillow로 원본 위에 래스터화한 이미지다. GPU 광원 렌더가 아니다.

| 산출물 | 설명 |
|---|---|
| `scripts/build_hero.py` | 씬·카메라·GN·점 속성·GLB·카메라 JSON·검증 이미지 일괄 생성 |
| `scripts/draw_overlay.py` | 카메라 투영선을 원본 포스터 위에 합성 |
| `scripts/verify_glb.py` | 독립적인 표준 라이브러리 GLB 바이너리 파서·계약 검증 |
| `hero.blend` | 동일 프록시 씬, 두 카메라, 숨긴 GN 샘플러, 최종 40,000점 메쉬 |
| `../frontend/public/models/hero-pointcloud.glb` | Y-up, POINTS(mode=0), 40,000점, 1,761,432 bytes (1.761 MB) |
| `../frontend/public/models/hero-cameras.json` | R3F용 Y-up 카메라 파라미터 및 차트 배치 메타데이터 |
| `renders/overlay_16x9.png`, `renders/overlay_9x16.png` | 원본 포스터 + 와이어프레임 정합 확인 |
| `renders/pointcloud_16x9.png`, `renders/pointcloud_9x16.png` | 점구름 단독 투영 |
| `renders/scan_preview_16x9.png`, `renders/scan_preview_9x16.png` | 포스터와 점구름 합성 미리보기 |
| `renders/validation.json` | 실제 GLB 재파싱 결과 |
| `PLAN.md` | 작업 범위와 구현 판단 |

`renders/`는 기존 git 제외 규칙의 대상이다. 웹앱 코드·버전 로그는 허용된 수정 경로 밖이라 수정하지 않았다. 커밋·푸시는 하지 않았다.

## GLB 속성 계약

| 실제 GLB 이름 | 타입 | 의미 |
|---|---|---|
| `POSITION` | float32 VEC3 | glTF 월드 Y-up 원래 점 위치 |
| `COLOR_0` | float32 VEC3 | sRGB `#71C5E8`를 선형 RGB로 변환한 색 |
| `_TARGET_BAR` | uint16 SCALAR | 데스크톱 화면 x를 10구간으로 나눈 0–9 정수 |
| `_TARGET_POS` | float32 VEC3 | POSITION과 동일한 glTF 월드 좌표계의 막대 목표 위치 |
| `_BAR_HEIGHT` | float32 SCALAR | 해당 막대 안에서의 정규화 높이 0–1 |

정수 속성은 원소마다 2바이트 패딩을 넣어 `byteStride: 4`로 저장한다. 사용자 속성의 `_` 접두사와 4바이트 정렬은 [glTF 공식 규격](https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/Specification.adoc)의 정점 속성 규칙을 따른다. 인덱스·삼각형·외부 버퍼는 없으며 GLB 하나로 완결된다.

차트는 데스크톱 카메라 앞 12m의 카메라 평행 평면에 놓았다. 폭 0.4m, **막대 사이 빈 간격 0.6m**(중심 간격 1.0m), 아래 기준선 NDC y=0.08. 임시 높이는 `[1.2, 1.9, 1.5, 2.4, 1.7, 2.8, 2.1, 3.0, 2.3, 1.6]`m. 실제 수치 반영 시 `_BAR_HEIGHT`로 높이를 재계산할 수 있다. 이 배치는 데스크톱용이므로 모바일에서는 차트 목표 위치를 화면 폭에 맞게 재계산해야 한다.

일반 GLTFLoader는 POINTS를 Points 객체로 읽으며 사용자 속성 이름을 소문자로 제공할 수 있다. 실제 소비자에서 geometry.attributes 이름을 확인해야 한다. 앱 내 로딩·셰이더·스크롤 동작은 이번 범위 밖이며 확인하지 않았다.

## 카메라 (glTF Y-up)

두 포스터의 중앙 압력계가 같은 세로 화각에서 가깝게 정합되어 두 카메라의 위치·회전·세로 FOV를 동일하게 유지했다. 별도 카메라 오브젝트와 서로 다른 aspect/센서 fit을 사용한다. 모바일용 별도 프록시는 없다.

- 공통 위치: `[0, 1.7000005245, 12]`
- 공통 quaternion **xyzw**: `[0.0294193495, 0.0239689108, -0.0007056593, 0.9992794991]`
- 공통 세로 FOV: `0.5631968436 rad` = `32.26880217°`
- 공통 near/far: `0.1 / 150`
- 16:9: 1920×1080, aspect `1.7777777778`, 35mm, 센서 폭 36mm, HORIZONTAL fit
- 9:16: 1080×1920, aspect `0.5625`, 35mm, 유효 센서 높이 20.25mm, VERTICAL fit

R3F/Three PerspectiveCamera의 `fov`는 도 단위이므로 `fov_y_degrees`를 쓴다. position·quaternion은 JSON 값을 그대로 사용하고 GLB 오브젝트에는 추가 축 회전·스케일을 주지 않는다.

## 눈으로 확인한 정합과 한계

- 16:9: 중앙 압력계 5개의 중심·크기는 원본 윤곽에 근접한다. 왼쪽 앞 배관 랙의 왼쪽 외곽과 바닥 높이, 오른쪽 탱크 열의 대략적인 통로 경계를 맞췄다.
- 9:16: 동일 프록시로 압력계·하단 가로 배관 위치가 가까이 맞는다. 오른쪽 큰 압력계에는 약 10–20px 정도의 위치/윤곽 차이가 보인다.
- 탱크는 박스이므로 실제 원통 실루엣·지지 다리·곡면과 일치하지 않는다. 왼쪽 배관 랙의 기울어진 상단은 수평 박스 상단과 차이가 난다. 뒤쪽 탱크 하단·벽과 바닥 접점은 수십~100여 px 차이가 남는다. 원근 방향을 근사했으며 전체 화면의 픽셀 단위 정합을 완료한 것은 아니다.
- 카메라용 영상은 생성 이미지여서 강체 핀홀 카메라 하나로 모든 세부를 재구성할 수 있는지는 보장하지 않는다. 소실점·깊이는 수작업 추정이며 보정 렌즈/실측치가 아니다.
- 동일 명령으로 전체 재생성을 반복하여 GLB·카메라 JSON의 SHA-256 동일성을 확인했다. 내보낸 GLB 바이트를 독립 파서로 다시 읽어 개수·모드·속성 값·선형 색·정렬·카메라 quaternion·막대 폭/간격/높이와 화면 x 배정·용량을 검증했다.
- 추가로 시도한 Blender glTF 재가져오기는 이 설치의 `numpy` 누락으로 실행되지 않았다. 이는 별도 바이너리 파싱 검증과 구분한다.

## 작업 2 — TRANSLATE 오브젝트·HERO 폴백

기준: `CODEX_TASK_2.md`, 실행 판단: `TASK_2_PLAN.md`. Blender 5.0.1과 PATH의 `python` + Pillow를 사용한다. 이 설치의 Eevee 식별자는 `BLENDER_EEVEE`이다. Blender glTF 애드온의 numpy 의존성 없이 표준 라이브러리 writer로 자체 완결 GLB를 만든다.

### 재현

저장소 루트에서 각각 한 번 실행한다:

```sh
blender -b --python-exit-code 1 --python blender/scripts/build_objects.py
blender -b --python-exit-code 1 --python blender/scripts/render_hero_seq.py
python blender/scripts/verify_task_2.py
blender -b --python-exit-code 1 --python blender/scripts/verify_object_surfaces.py
sha256sum frontend/public/models/hero-pointcloud.glb frontend/public/models/hero-cameras.json
```

`--python-exit-code 1`은 Python 오류가 발생한 Blender 실행을 실패로 처리한다. 시퀀스는 CPU 소프트웨어 그래픽 환경에서 수분이 걸린다. 이 환경은 EGL 경고를 출력하지만 실제 Eevee PNG 저장은 성공한다.

### 파일·텍스처 교체

| 파일 | 역할 |
|---|---|
| `scripts/build_objects.py` | 실물 비율 PBR 메쉬 4개, 표면 점구름, objects.blend 및 비교 렌더 생성 |
| `scripts/object_textures.py` | Pillow 임시 텍스처 생성. 기존 파일은 덮어쓰지 않음 |
| `scripts/task2_glb.py` | 정렬된 GLB 바이너리·PBR·임베디드 PNG 작성 |
| `scripts/render_hero_seq.py` | 기존 HERO의 실제 GLB 속성과 landscape 카메라를 이용한 120프레임 Eevee 렌더 |
| `scripts/hero_webp.py` | 첫·마지막 PNG를 무손실 RGBA WebP로 변환 |
| `scripts/verify_task_2.py` | GLB 독립 재파싱, 좌표 범위·원점·색·크기·프레임·WebP 픽셀 검증 |
| `scripts/verify_object_surfaces.py` | 내보낸 메쉬 삼각형과 32,000점 전부의 표면 정합 검증 |
| `objects.blend` | 4개 원본 메쉬·점 전용 메쉬와 비교 미리보기 씬 |
| `textures/clipboard.png` | 768×1024 가상 클레임 기록지: 영문 제목·줄·칸·비언어적 필기·도장 |
| `textures/blueprint.png` | 1024×724 가상 공장 배관 도면 |
| `textures/crt-spinner.png` | 512×512 CRT 로딩 스피너 |
| `renders/objects_preview.png` | 1600×1000 Eevee: 윗줄 PBR, 아랫줄 동일 위치 PBR + 점 겹침 |
| `renders/hero_seq/frame_0001.png` … `frame_0120.png` | 1600×900 투명 RGBA Eevee 시퀀스 |
| `renders/task_2_validation.json`, `object_surface_validation.json` | 실제 파일 검증 결과 |
| `renders/hero_sequence_manifest.json` | 렌더 엔진·해상도·점 수 등 렌더 메타데이터 |

텍스처 교체 시 위 이름으로 PNG를 바꿔 넣고 `build_objects.py`를 다시 실행한다. 다른 파일명을 쓰려면 스크립트의 `texture='…png'` 파일명만 바꾼다. 교체 텍스처도 최대 1024px를 지킨다. PNG는 GLB 안에 포함되므로 배포 때 외부 텍스처 URL은 필요 없다. `objects.blend`에서는 `//textures/` 상대 경로를 쓴다. glTF UV는 이미지 상단이 v=0이므로 Blender UV의 V를 반전해 내보낸다.

### 좌표·형상

GLB는 미터 단위 Y-up이며 별도 노드 변환이 없다. 바닥 중앙이 (0,0,0): Y 최솟값 0, X/Z 경계 중앙 0. 메쉬와 해당 점구름을 같은 transform으로 불러오면 그대로 겹친다. Blender 좌표 (x,y,z)는 glTF (x,z,-y)로 변환한다.

- 클립보드: 폭 0.245m × 깊이 0.340m, 종이와 금속 클립 포함.
- 도면: 원래 종이 0.594m × 0.420m, 두께 0.25mm. 약 230mm를 펼치고 나머지를 말았다.
- CRT: 폭 0.400m × 깊이 0.420m × 높이 약 0.432m. 곡면 유리 화면·받침·통풍구 포함. 스피너는 정지 텍스처다.
- 말풍선: 폭 0.480m × 깊이 0.048m × 높이 약 0.330m, 꼬리 포함 무광 흰색.

`objects.blend`의 `obj-*` 컬렉션에서 `*_preview_placement` 부모는 비교 렌더용 배치다. 각 자식 메쉬의 로컬 원점과 실제 GLB 원점은 바닥 중앙이다. 상·하단 미리보기 복제본과 배경·조명은 GLB에 포함하지 않는다.

점은 최종 삼각형 면적에 비례해 고정 seed로 표면에서 각 8,000개 샘플링한다. 점 GLB는 `mode=0`(POINTS), float32 `POSITION` + 선형 RGB `COLOR_0`(#71C5E8), unlit 재질이다. 바닥 면 등도 포함한 전체 표면 샘플이며 보이는 면만 선별하지 않는다.

### HERO 렌더 방식

`hero.blend`를 읽되 저장하지 않고 프록시는 렌더에서 숨긴다. 기존 `hero-pointcloud.glb`의 `POSITION`과 `_TARGET_POS`를 직접 읽어 양 끝 좌표를 유지한다. 원본 `landscape` 카메라의 위치·회전·렌즈·센서 fit으로 16:9를 렌더한다. 40,000점을 카메라를 향한 지름 1.6px 육각형 emission 메쉬로 표현하며, shape key의 Bezier 보간으로 1→120프레임 동안 차트로 모은다. Standard 색상 변환을 써서 #71C5E8을 유지한다. 경계는 안티앨리어싱 때문에 색·알파가 달라질 수 있다.

웹 정지 이미지:

- `../frontend/public/models/hero-fallback-start.webp`: 프레임 1, 원래 장면 점구름.
- `../frontend/public/models/hero-fallback.webp`: 프레임 120, 10개 막대 차트.

두 WebP는 `lossless=True, exact=True`로 생성해 PNG와 RGBA 픽셀이 동일한지 검사한다. 시퀀스와 비교 렌더는 기존 `blender/renders/` git 제외 규칙의 대상이다. 웹앱 소비 코드·reduced-motion 분기·브라우저 GLTFLoader 실행은 이번 작업에 포함하지 않는다.

### 실제 용량·검증 결과 (2026-10-26)

| GLB 파일 | 메쉬 bytes | 점구름 파일 | 점구름 bytes | 점 수 | 삼각형 수 |
|---|---:|---|---:|---:|---:|
| `obj-clipboard.glb` | 110,388 | `obj-clipboard-points.glb` | 193,084 | 8,000 | 754 |
| `obj-blueprint.glb` | 604,608 | `obj-blueprint-points.glb` | 193,084 | 8,000 | 5,432 |
| `obj-crt.glb` | 510,672 | `obj-crt-points.glb` | 193,072 | 8,000 | 4,544 |
| `obj-bubble.glb` | 291,172 | `obj-bubble-points.glb` | 193,096 | 8,000 | 2,684 |

| 기타 파일 | bytes |
|---|---:|
| `blender/objects.blend` | 5,849,601 |
| `blender/renders/objects_preview.png` | 1,722,244 |
| `frontend/public/models/hero-fallback-start.webp` | 445,140 |
| `frontend/public/models/hero-fallback.webp` | 290,344 |
| `blender/textures/clipboard.png` | 24,054 |
| `blender/textures/blueprint.png` | 16,499 |
| `blender/textures/crt-spinner.png` | 5,393 |
| `blender/scripts/build_objects.py` | 13,358 |
| `blender/scripts/render_hero_seq.py` | 4,413 |
| `blender/scripts/task2_glb.py` | 2,886 |
| `blender/scripts/object_textures.py` | 2,691 |
| `blender/scripts/hero_webp.py` | 420 |
| `blender/scripts/verify_task_2.py` | 4,800 |
| `blender/scripts/verify_object_surfaces.py` | 3,335 |

PNG 120장 합계 **112,246,508 bytes**. `verify_task_2.py` 통과: GLB 8개를 실제 바이트로 재파싱, POINTS 모드·POSITION/COLOR_0·8,000점·선형 색·바닥 중앙 원점·PBR·임베디드 1024px 이하 PNG·각 GLB 1MB 이하 확인. 120장 모두 1600×900 RGBA·투명/불투명 픽셀 포함·서로 다른 프레임이며, 양 끝 PNG와 WebP의 RGBA 픽셀이 동일하다.

`verify_object_surfaces.py` 통과: 32,000점 모두 실제 내보낸 GLB 삼각형에서 1µm 이내. 얇은 베벨에서 Blender float32 최근접 계산 오차가 나타나므로 해당 점은 double 정밀도의 삼각형 거리 계산으로 재검사한다.

오브젝트 비교 렌더와 HERO 첫·마지막 이미지를 직접 확인했다. 클립보드 기록지는 작은 전체 미리보기에서 필기가 옅게 보이며 PNG 원본에는 가상 필기가 들어 있다. 텍스처는 임시본이고, 브라우저/R3F에서의 로딩과 애니메이션은 미확인이다. 공식 Khronos validator는 실행하지 않았으며 이번 결과는 독립 바이너리 계약 검증이다. 기존 hero.blend·hero-pointcloud.glb·hero-cameras.json의 SHA-256은 작업 전후 동일하다. 커밋·푸시는 하지 않았다.
