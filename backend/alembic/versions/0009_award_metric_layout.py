"""Life Tutorial 해커톤 수상 지표 재배치 — 라벨 한 줄로 칸 높이 맞춤, 고용노동부장관상을 큰 글씨로

Revision ID: 0009
Revises: 0008

같은 사실을 칸만 옮긴다(라벨 '해커톤 우수상', 값 '고용노동부장관상', 조건에 대회명·날짜). frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0009"
down_revision = "0008"
branch_labels = None
depends_on = None

METRIC_ID = "life-tutorial-award"
BEFORE = {
    "value": "우수상",
    "label": "2026 제8회 K-디지털 트레이닝 해커톤",
    "condition": "고용노동부장관상, 지정과제, 2026-09-04. 팀 수상",
}
AFTER = {
    "value": "고용노동부장관상",
    "label": "해커톤 우수상",
    "condition": "2026 제8회 K-디지털 트레이닝 · 지정과제 · 2026-09-04",
}

metric = sa.table("metric", sa.column("id"), sa.column("value"), sa.column("label"), sa.column("condition"))


def upgrade() -> None:
    op.execute(metric.update().where(metric.c.id == METRIC_ID).values(AFTER))


def downgrade() -> None:
    op.execute(metric.update().where(metric.c.id == METRIC_ID).values(BEFORE))
