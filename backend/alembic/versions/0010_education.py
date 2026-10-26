"""education 테이블 + AX 아카데미 시드, HERO 부제를 식품 현장 경력과 개발 이력 두 줄로

Revision ID: 0010
Revises: 0009

현장 10년 5개월은 식품 경력이고 개발은 교육 과정에서 시작했다는 것을 분명히 한다(다섯 프로젝트 모두 이 과정 중 팀 프로젝트).
frontend mock 픽스처와 같은 내용.
"""
from datetime import date

import sqlalchemy as sa
from alembic import op

revision = "0010"
down_revision = "0009"
branch_labels = None
depends_on = None

OLD_SUBTITLE = "김충식 · 식품기술사 · 현장 10년 5개월 · Forward Deployed Engineer"
NEW_SUBTITLE = (
    "김충식 · 식품기술사 · 식품 현장 10년 5개월\n"
    "개발: IBM × RedHat AX 아카데미 7기(2026.04~10) · 해커톤 고용노동부장관상"
)

profile = sa.table("profile", sa.column("id"), sa.column("subtitle"))


def upgrade() -> None:
    education = op.create_table(
        "education",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("profile_id", sa.Integer, sa.ForeignKey("profile.id"), nullable=False),
        sa.Column("title", sa.String(128), nullable=False),
        sa.Column("organization", sa.String(128), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("started_on", sa.Date, nullable=False),
        sa.Column("ended_on", sa.Date, nullable=False),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
    )
    op.bulk_insert(education, [{
        "id": 1,
        "profile_id": 1,
        "title": "IBM × RedHat AI Transformation Academy",
        "organization": "대한상공회의소 · 하이미디어 강남 AI 캠퍼스",
        "description": "AI 트랜스포메이션(AX) 과정 7기. Python부터 AI 서비스 설계·배포·운영까지",
        "started_on": date(2026, 4, 29),
        "ended_on": date(2026, 10, 27),
        "status": "수료",
        "sort_order": 1,
    }])
    op.execute(profile.update().where(profile.c.id == 1).values(subtitle=NEW_SUBTITLE))


def downgrade() -> None:
    op.execute(profile.update().where(profile.c.id == 1).values(subtitle=OLD_SUBTITLE))
    op.drop_table("education")
