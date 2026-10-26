"""HERO 제목 변경 — FDE 연결자 역할이 바로 읽히게

Revision ID: 0006
Revises: 0005
"""
from alembic import op

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None

NEW = "현장의 말을 개발의 말로 옮깁니다."
OLD = "아날로그 현장을 데이터로. 그 사이에서 만듭니다."


def upgrade() -> None:
    op.execute(f"UPDATE profile SET headline = '{NEW}' WHERE id = 1")


def downgrade() -> None:
    op.execute(f"UPDATE profile SET headline = '{OLD}' WHERE id = 1")
