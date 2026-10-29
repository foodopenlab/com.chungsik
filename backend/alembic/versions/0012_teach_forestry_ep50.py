"""강의 갱신 — 한국임업진흥원 AI 강의 2과목(만족도 5.0) 추가, 유튜브 대본 검수 EP50까지 9편

Revision ID: 0012
Revises: 0011

근거: 본인 제공(2026-10-29). 임업진흥원 강의는 NCS 등록 강사 5년(한국식품정보원)과 섞지 않고 만족도 칸에만 넣는다.
frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0012"
down_revision = "0011"
branch_labels = None
depends_on = None

SOURCE = "본인 이력서(FDE·AX/DX PM) + 본인 제공(2026-10-29)"

# id → (value, condition)
BEFORE = {
    "teach-satisfaction": (
        "4.3–4.8",
        "과목별 — 품질관리 4.8 · 생성형 AI 활용 4.7 · 식품위생법규 4.6 · 식품기술사 4.5 · HACCP 팀장 4.3",
    ),
    "teach-youtube-reviews": ("8편", "한국식품정보원 콘텐츠 EP23~EP44 중 8편"),
}
AFTER = {
    "teach-satisfaction": (
        "4.3–5.0",
        "과목별 — 한국임업진흥원: AI 활용 사업계획서 작성 5.0 · AI 활용 상세페이지·영상 제작 5.0 / "
        "한국식품정보원: 품질관리 4.8 · 생성형 AI 활용 4.7 · 식품위생법규 4.6 · 식품기술사 4.5 · HACCP 팀장 4.3",
    ),
    "teach-youtube-reviews": ("9편", "한국식품정보원 콘텐츠 EP23~EP50 중 9편"),
}

metric = sa.table("metric", sa.column("id"), sa.column("value"), sa.column("condition"), sa.column("source"))


def _apply(rows: dict, source: str) -> None:
    for mid, (value, condition) in rows.items():
        op.execute(metric.update().where(metric.c.id == mid).values(value=value, condition=condition, source=source))


def upgrade() -> None:
    _apply(AFTER, SOURCE)


def downgrade() -> None:
    _apply(BEFORE, "본인 이력서(FDE·AX/DX PM)")
