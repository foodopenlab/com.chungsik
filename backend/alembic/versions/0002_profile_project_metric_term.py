"""profile, project, project_stack, metric, term 테이블 + profile·사전 시드

Revision ID: 0002
Revises: 0001
"""
import sqlalchemy as sa
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None

# 지시서 §2 "05 / DICT" 예시 5쌍 — 나머지는 본인 검수본으로 추가
TERMS = [
    ("CCP 한계기준", "validation rule + alert threshold"),
    ("한도견본", "입고 검수 기준 데이터셋"),
    ("Audit 연 80회", "평가셋 + 재현 가능한 검증"),
    ("작업일지", "이벤트 로그 스키마"),
    ("라인이 자주 서요", "downtime_event + 정지사유 코드(작업자가 실제로 입력할 3개만)"),
]


def upgrade() -> None:
    profile = op.create_table(
        "profile",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(32), nullable=False),
        sa.Column("headline", sa.String(128), nullable=False),
        sa.Column("subtitle", sa.String(255), nullable=False),
    )
    op.create_table(
        "project",
        sa.Column("slug", sa.String(32), primary_key=True),
        sa.Column("profile_id", sa.Integer, sa.ForeignKey("profile.id"), nullable=False),
        sa.Column("title", sa.String(64), nullable=False),
        sa.Column("problem", sa.Text, nullable=False),
        sa.Column("decision", sa.Text, nullable=False),
        sa.Column("role", sa.Text, nullable=False),
        sa.Column("team_role", sa.Text, nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("docs_url", sa.String(255)),
        sa.Column("github_url", sa.String(255)),
        sa.Column("service_url", sa.String(255)),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.create_table(
        "project_stack",
        sa.Column("project_slug", sa.String(32), sa.ForeignKey("project.slug"), primary_key=True),
        sa.Column("stack_id", sa.String(32), sa.ForeignKey("stack.id"), primary_key=True),
    )
    op.create_table(
        "metric",
        sa.Column("id", sa.String(48), primary_key=True),
        sa.Column("profile_id", sa.Integer, sa.ForeignKey("profile.id"), nullable=False),
        sa.Column("project_slug", sa.String(32), sa.ForeignKey("project.slug")),
        sa.Column("value", sa.String(64), nullable=False),
        sa.Column("label", sa.String(128), nullable=False),
        sa.Column("condition", sa.Text, nullable=False),
        sa.Column("source", sa.Text, nullable=False),
        sa.Column("side", sa.String(16), nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
        sa.CheckConstraint("side IN ('field', 'software')", name="ck_metric_side"),
    )
    term = op.create_table(
        "term",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("profile_id", sa.Integer, sa.ForeignKey("profile.id"), nullable=False),
        sa.Column("field", sa.String(128), nullable=False),
        sa.Column("dev", sa.String(255), nullable=False),
        sa.Column("note", sa.Text),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.bulk_insert(profile, [{
        "id": 1,
        "name": "김충식",
        "headline": "아날로그 현장을 데이터로. 그 사이에서 만듭니다.",
        "subtitle": "김충식 · 식품기술사 · 현장 10년 5개월 · Forward Deployed Engineer",
    }])
    op.bulk_insert(term, [
        {"id": i, "profile_id": 1, "field": f, "dev": d, "note": None, "sort_order": i}
        for i, (f, d) in enumerate(TERMS, 1)
    ])


def downgrade() -> None:
    for table in ("term", "metric", "project_stack", "project", "profile"):
        op.drop_table(table)
