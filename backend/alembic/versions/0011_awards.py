"""수상 표시 — project·education에 award 칸, Life Tutorial 해커톤 수상 지표를 award로

Revision ID: 0011
Revises: 0010

AX 아카데미 수료(2026-10-27): 최종 프로젝트 Metabole이 전체 팀 중 1위(최우수상), 김충식은 우수훈련생.
화면에서는 award를 금색으로 따로 보여 준다. frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0011"
down_revision = "0010"
branch_labels = None
depends_on = None

PROJECT_AWARDS = {
    "metabole": "최우수상 · 과정 최종 프로젝트 1위",
    "life-tutorial": "해커톤 우수상",
}

project = sa.table("project", sa.column("slug"), sa.column("award"))
education = sa.table("education", sa.column("id"), sa.column("award"))
metric = sa.table("metric", sa.column("id"), sa.column("side"))


def upgrade() -> None:
    op.add_column("project", sa.Column("award", sa.String(64)))
    op.add_column("education", sa.Column("award", sa.String(64)))
    for slug, award in PROJECT_AWARDS.items():
        op.execute(project.update().where(project.c.slug == slug).values(award=award))
    op.execute(education.update().where(education.c.id == 1).values(award="우수훈련생"))
    op.drop_constraint("ck_metric_side", "metric", type_="check")
    op.create_check_constraint("ck_metric_side", "metric", "side IN ('field', 'software', 'award')")
    op.execute(metric.update().where(metric.c.id == "life-tutorial-award").values(side="award"))


def downgrade() -> None:
    op.execute(metric.update().where(metric.c.id == "life-tutorial-award").values(side="software"))
    op.drop_constraint("ck_metric_side", "metric", type_="check")
    op.create_check_constraint("ck_metric_side", "metric", "side IN ('field', 'software')")
    op.drop_column("education", "award")
    op.drop_column("project", "award")
