"""회사 표기 확정·강의 기간 5년 + 01 GAP 숫자 2개 추가

Revision ID: 0005
Revises: 0004

근거: 본인 확인(2026-10-26). frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None

SOURCE = "본인 이력서(FDE·AX/DX PM)"

# id → (value, condition)
UPDATES = {
    "translate-claims": (
        "100+→15건 미만",
        "김치 제조(일반 HACCP 인증) 회사 품질·HACCP 총괄(2015~2019). 클레임을 유형·공정·원료·계절로 재분류해 원인별 관리기준 재설계, 약 80%↓",
    ),
    "translate-relocation": (
        "1월 계약 → 5월 이전",
        "수산물·축산물 전문 제조 회사, 2025년. 후보 공장 면적·전력·폐수·Capacity 비교 → 설비 Layout, 인허가·재인증 일정을 생산 이전계획과 한 일정표로",
    ),
    "hero-staff": (
        "40→11명",
        "수산물·축산물 전문 제조 회사(2020~2025). 전 품목 공정 분석, 포장재·용기 표준화 후 기존·신규 설비를 조합한 반자동화 라인",
    ),
    "teach-ncs-years": (
        "5년",
        "한국식품정보원. 식품기술사·식품위생법·HACCP 팀장교육·식품품질관리·생성형 AI 활용 강의",
    ),
}

# (id, value, label, condition, source, side, attribution, sort_order)
INSERTS = [
    ("gap-field-years", "10년 5개월", "식품 제조 현장",
     "김치 제조(일반 HACCP 인증) 회사 4년 7개월 + 수산물·축산물 전문 제조 회사 5년 10개월",
     SOURCE, "field", "personal", 23),
    ("gap-services", "5종", "개발 과정에서 배포한 서비스",
     "Metabole · Life Tutorial · localhost:daegu · TownPulse · REMAKE DAY (팀 프로젝트 포함)",
     "본인 확인(2026-10-26), 04 BUILT 프로젝트", "software", "team", 24),
]


def upgrade() -> None:
    metric = sa.table(
        "metric",
        *(sa.column(c) for c in (
            "id", "profile_id", "project_slug", "value", "label", "condition", "source", "side", "attribution", "sort_order",
        )),
    )
    for mid, (value, condition) in UPDATES.items():
        op.execute(metric.update().where(metric.c.id == mid).values(value=value, condition=condition))
    op.bulk_insert(metric, [
        {"id": mid, "profile_id": 1, "project_slug": None, "value": v, "label": label, "condition": cond,
         "source": src, "side": side, "attribution": attr, "sort_order": order}
        for mid, v, label, cond, src, side, attr, order in INSERTS
    ])


def downgrade() -> None:
    op.execute("DELETE FROM metric WHERE id IN ('gap-field-years', 'gap-services')")
