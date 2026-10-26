"""이력서 근거로 경력·강의 숫자 갱신 + HERO 카운터 숫자 2개 추가

Revision ID: 0004
Revises: 0003

근거: 본인 이력서 2종(FDE·AX/DX PM, 비공개 원본은 frontend/docs/private). frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None

SOURCE = "본인 이력서(FDE·AX/DX PM)"

# id → (value, label, condition)
UPDATES = {
    "translate-claims": (
        "100+→15건 미만", "연간 클레임",
        "김치·절임배추 제조사 품질·HACCP 총괄(2015~2019). 클레임을 유형·공정·원료·계절로 재분류해 원인별 관리기준 재설계, 약 80%↓",
    ),
    "translate-relocation": (
        "1월 계약 → 5월 이전", "공장 이전 + HACCP 재인증",
        "HMR 제조사, 2025년. 후보 공장 면적·전력·폐수·Capacity 비교 → 설비 Layout, 인허가·재인증 일정을 생산 이전계획과 한 일정표로",
    ),
    "teach-ncs-years": (
        "5년차", "NCS 등록 강사",
        "한국식품정보원. 식품기술사·식품위생법·HACCP 팀장교육·식품품질관리·생성형 AI 활용 강의",
    ),
    "teach-satisfaction": (
        "4.3–4.8", "강의 만족도(5점 만점)",
        "과목별 — 품질관리 4.8 · 생성형 AI 활용 4.7 · 식품위생법규 4.6 · 식품기술사 4.5 · HACCP 팀장 4.3",
    ),
    "teach-youtube-reviews": (
        "8편", "유튜브 콘텐츠 대본 검수",
        "한국식품정보원 콘텐츠 EP23~EP44 중 8편",
    ),
}

# (id, value, label, condition, sort_order)
INSERTS = [
    ("hero-staff", "40→11명", "투입 인원, 반자동화 라인",
     "HMR 제조사(2020~2025). 전 품목 공정 분석, 포장재·용기 표준화 후 기존·신규 설비를 조합한 반자동화 라인", 21),
    ("hero-capacity", "3→8톤", "일 생산능력, 반자동화 라인",
     "투입 인원과 같은 반자동화 라인 구축 결과", 22),
]


def upgrade() -> None:
    metric = sa.table(
        "metric",
        *(sa.column(c) for c in (
            "id", "profile_id", "project_slug", "value", "label", "condition", "source", "side", "attribution", "sort_order",
        )),
    )
    for mid, (value, label, condition) in UPDATES.items():
        op.execute(
            metric.update().where(metric.c.id == mid)
            .values(value=value, label=label, condition=condition, source=SOURCE)
        )
    op.bulk_insert(metric, [
        {"id": mid, "profile_id": 1, "project_slug": None, "value": v, "label": label, "condition": cond,
         "source": SOURCE, "side": "field", "attribution": "personal", "sort_order": order}
        for mid, v, label, cond, order in INSERTS
    ])


def downgrade() -> None:
    op.execute("DELETE FROM metric WHERE id IN ('hero-staff', 'hero-capacity')")
