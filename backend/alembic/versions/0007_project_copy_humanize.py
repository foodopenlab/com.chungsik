"""프로젝트 설명 문장 다듬기 — humanize-korean 정밀 검토(2026-10-26-002) 반영

Revision ID: 0007
Revises: 0006

의미·숫자·귀속 표기는 그대로, 연결어미 쉼표·대구·관형절 중첩만 정리. frontend mock 픽스처와 같은 내용.
"""
import sqlalchemy as sa
from alembic import op

revision = "0007"
down_revision = "0006"
branch_labels = None
depends_on = None

# (slug, field, before, after)
CHANGES = [
    ("metabole", "decision",
     "(팀장 결정) 첫 화면에서 지도 지표 선택기를 없애고 판정 하나만 보여 주기로 했습니다. 창업자는 지표가 아니라 '하지 마라 / 한다면 이 업종'이 필요합니다.",
     "(팀장 결정) 첫 화면에서 지도 지표 선택기를 없애고 판정 하나만 보여 주기로 했습니다. 창업자에게는 지표 대신 '하지 마라 / 한다면 이 업종'이 필요합니다."),
    ("life-tutorial", "decision",
     "제출물을 실도메인 배포로 대신해, 심사위원이 브라우저에서 바로 플레이하게 하는 결정을 이끌었습니다.",
     "제출물을 실도메인 배포로 대신해 심사위원이 브라우저에서 바로 플레이하게 하자는 결정을 주도했습니다."),
    ("localhost-daegu", "problem",
     "대구 예비창업자가 자기 조건으로 창업자금을 계산·비교하고, 은행에 물어볼 것을 정리한 상담 준비자료를 들고 창구로 가게 하는 서비스입니다.",
     "대구 예비창업자가 자기 조건으로 창업자금을 계산·비교하는 서비스입니다. 은행에 물어볼 것을 정리한 상담 준비자료를 들고 창구로 가게 합니다."),
    ("townpulse", "problem",
     "충북 153개 읍·면·동의 인구·빈집·교통·인프라를 하나의 인과관계로 묶어, 지자체 담당자가 어느 마을부터 무엇을 할지 판단하도록 돕습니다.",
     "충북 153개 읍·면·동의 인구·빈집·교통·인프라를 하나의 인과관계로 묶어 지자체 담당자가 어느 마을부터 무엇을 할지 판단하도록 돕습니다."),
    ("townpulse", "decision",
     "LLM이 숫자를 지어내지 못하게 서버에서 컨텍스트를 조립하는 구조를 설계했습니다. 예산·지표는 단가 라이브러리와 마을 데이터로 계산하고, LLM은 설명 문장만 씁니다.",
     "LLM이 숫자를 지어내지 못하게 서버에서 컨텍스트를 조립하는 구조를 설계했습니다. 예산·지표는 단가 라이브러리와 마을 데이터로 계산하고 LLM은 설명 문장만 씁니다."),
    ("remakeday", "decision",
     "(팀 결정) NPC 모델을 EXAONE에서 Kanana로 바꿨습니다. 상업 이용 라이선스가 계기였고, Apache 2.0 후보 3종을 같은 기준으로 잰 뒤 골랐습니다.",
     "(팀 결정) NPC 모델을 EXAONE에서 Kanana로 바꿨습니다. 상업 이용 라이선스가 계기였고 Apache 2.0 후보 3종을 같은 기준으로 잰 뒤 골랐습니다."),
]

project = sa.table("project", sa.column("slug"), sa.column("problem"), sa.column("decision"))


def _apply(pick):
    for slug, field, before, after in CHANGES:
        op.execute(project.update().where(project.c.slug == slug).values({field: pick(before, after)}))


def upgrade() -> None:
    _apply(lambda before, after: after)


def downgrade() -> None:
    _apply(lambda before, after: before)
